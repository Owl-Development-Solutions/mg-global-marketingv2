import { connection } from "../../config/mysql.db";

export const normalizePair = (a: string, b: string): [string, string] => {
  return a < b ? [a, b] : [b, a];
};

export const getAll3500Users = (map: Map<string, any>) => {
  const users: any[] = [];

  for (const [, node] of map) {
    if (Number(node.currentIdPrice) === 3500) {
      users.push(node);
    }
  }

  return users;
};

export const groupBySponsor = (users: any[]) => {
  const sponsorMap = new Map<string, any[]>();

  for (const user of users) {
    const sponsor = user.ancestorSponsorId;

    if (!sponsorMap.has(sponsor)) {
      sponsorMap.set(sponsor, []);
    }

    sponsorMap.get(sponsor)!.push(user);
  }

  return sponsorMap;
};

export const isEligibleForBonus = (node: any) => {
  const price = Number(node.currentIdPrice);

  return price === 3500 || price === 0;
};

export const getRootNode = (map: Map<string, any>) => {
  for (const [, node] of map) {
    if (node.parentId == null) {
      return node;
    }
  }

  return null;
};

export const buildQueue = (users: any[]) => {
  users.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  return [...users];
};

export const getSponsorChain = (userId: string, map: Map<string, any>) => {
  const chain: string[] = [];
  let current = map.get(userId);

  while (current) {
    if (current.ancestorSponsorId) {
      chain.push(current.ancestorSponsorId);
      current = map.get(current.ancestorSponsorId);
    } else {
      break;
    }
  }

  return chain;
};

export const findCommonSponsor = (
  user1: any,
  user2: any,
  map: Map<string, any>,
) => {
  const chain1 = getSponsorChain(user1.currentId, map);
  const chain2 = new Set(getSponsorChain(user2.currentId, map));

  for (const sponsor of chain1) {
    if (chain2.has(sponsor)) {
      return sponsor;
    }
  }

  return null;
};

export const hasExistingPair = async (userId: string) => {
  const db = connection();
  const [result]: any = await db.execute(
    `
    SELECT 1 FROM pairing_records 
    WHERE user1_id = ? OR user2_id = ?
    LIMIT 1
    `,
    [userId, userId],
  );

  if (result.length > 0) return true;

  const [motherResult]: any = await db.execute(
    `
    SELECT 1 FROM pairing_records_for_mother 
    WHERE user1_id = ? OR user2_id = ?
    LIMIT 1
    `,
    [userId, userId],
  );

  return motherResult.length > 0;
};

export const processSponsorPairs = async (
  sponsorMap: Map<string, any[]>,
  map: Map<string, any>,
) => {
  const db = connection();
  for (const [sponsorId, users] of sponsorMap) {
    if (users.length < 2) continue;

    const queue = buildQueue(users);

    while (queue.length >= 2) {
      const user1 = queue.shift();
      const user2 = queue.shift();

      const [u1, u2] = normalizePair(user1.currentId, user2.currentId);

      const [existing]: any = await db.execute(
        `SELECT 1 FROM pairing_records 
          WHERE user1_id IN (?, ?) OR user2_id IN (?, ?) 
          LIMIT 1`,
        [u1, u2, u1, u2],
      );

      if (existing.length > 0) {
        console.log(
          `SKIPPED: One of the users (${u1} or ${u2}) is already paired.`,
        );
        continue;
      }

      await db.execute(
        `INSERT INTO pairing_records (user1_id, user2_id, sponsor_id) VALUES (?, ?, ?)`,
        [u1, u2, sponsorId],
      );

      const commonSponsorId = findCommonSponsor(user1, user2, map);

      if (!commonSponsorId) return;

      const node = map.get(commonSponsorId);

      if (!node) return;

      // skip root if needed
      const root = getRootNode(map);

      if (commonSponsorId === root?.currentId) return;

      if (isEligibleForBonus(node)) {
        console.log(`only ${commonSponsorId} receives bonus`);

        await db.execute(
          `UPDATE user_stats
             SET pairingBonusAmount = COALESCE(pairingBonusAmount, 0) + ?
             WHERE userId = ?
            `,
          [700, commonSponsorId],
        );
      }
    }
  }
};

export const giveBonusToUplineChain = async (
  sponsorId: string,
  map: Map<string, any>,
  user1: any,
  user2: any,
) => {
  const db = connection();
  const visited = new Set<string>();
  const queue: string[] = [sponsorId];

  const root = getRootNode(map);
  const rootId = root?.currentId;

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (!currentId || visited.has(currentId)) continue;

    visited.add(currentId);

    const node = map.get(currentId);

    if (!node) continue;

    //skip mother here
    if (currentId === rootId) {
      continue;
    }

    const eligible = isEligibleForBonus(node);

    if (eligible) {
      console.log(`Result: ${currentId} receives Bonus`);
      await db.execute(
        `UPDATE user_stats
             SET pairingBonusAmount = COALESCE(pairingBonusAmount, 0) + ?
             WHERE userId = ?
            `,
        [700, currentId],
      );
    }

    if (node.parentId) {
      queue.push(node.parentId);
    }

    if (node.ancestorSponsorId) {
      queue.push(node.ancestorSponsorId);
    }
  }
};

/**
 *
 * @param users who uses 3500 activation code
 * @param map mapped users who have been recorded in the geanology
 * @returns bonuses for the ROOT MOTHER ONLY
 */
export const processMotherPairs = async (
  users: any[],
  map: Map<string, any>,
) => {
  console.log("users");

  const db = connection();
  const motherNode = getRootNode(map);
  if (!motherNode || !Array.isArray(users)) return;

  const motherId = motherNode.currentId;

  const leftQueue = [];
  const rightQueue = [];

  for (const user of users) {
    if (Number(user.currentIdPrice) !== 3500) continue;

    if (user.userPath.startsWith("[L]")) {
      leftQueue.push(user);
    } else if (user.userPath.startsWith("[R]")) {
      rightQueue.push(user);
    }
  }

  while (leftQueue.length > 0 && rightQueue.length > 0) {
    const leftUser = leftQueue.shift();
    const rightUser = rightQueue.shift();

    const [u1, u2] = normalizePair(leftUser.currentId, rightUser.currentId);

    const [existing]: any = await db.execute(
      `SELECT 1 FROM pairing_records_for_mother
       WHERE user1_id IN (?, ?) or user2_id IN (?, ?)
       LIMIT 1
      `,
      [u1, u2, u1, u2],
    );

    if (existing.length > 0) {
      console.log(
        `skipped: one of the users (${u1} or ${u2}) is already paired`,
      );
      continue;
    }

    await db.execute(
      `INSERT INTO pairing_records_for_mother (user1_id, user2_id) VALUES (?, ?)`,
      [u1, u2],
    );

    const motherNodeData = map.get(motherId);
    if (isEligibleForBonus(motherNodeData)) {
      console.log("Mother received bonus");
      await db.execute(
        `UPDATE user_stats SET pairingBonusAmount = COALESCE(pairingBonusAmount, 0) + ? WHERE userId = ?`,
        [700, motherId],
      );
    }
  }
};

export const processMotherPairsForNode = async (
  motherNode: any,
  map: Map<string, any>,
) => {
  const db = connection();

  const motherId = motherNode.currentId;

  //get all descendants from the mother
  const descendants = Array.from(map.values()).filter((u) =>
    u.userPath.startsWith(
      motherNode.userPath === "root" ? "" : motherNode.userPath,
    ),
  );

  //users with 3500 only
  const users3500 = descendants.filter(
    (u) => Number(u.currentIdPrice) === 3500,
  );

  const leftQueue = [];
  const rightQueue = [];

  for (const user of users3500) {
    if (user.currentId === motherId) continue;

    const relativePath = user.userPath.replace(motherNode.userPath, "");

    if (relativePath.startsWith("[L]")) {
      leftQueue.push(user);
    } else if (relativePath.startsWith("[R]")) {
      rightQueue.push(user);
    }

    // FIFO
    leftQueue.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    rightQueue.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  }

  // Pairing
  while (leftQueue.length > 0 && rightQueue.length > 0) {
    const leftUser = leftQueue.shift();
    const rightUser = rightQueue.shift();

    const [u1, u2] = normalizePair(leftUser.currentId, rightUser.currentId);

    // prevent duplicate pairing per mother
    const [existing]: any = await db.execute(
      `SELECT 1 FROM pairing_records_for_mother 
       WHERE motherId = ? AND user1_id = ? AND user2_id = ? LIMIT 1`,
      [motherId, u1, u2],
    );

    if (existing.length > 0) continue;

    await db.execute(
      `INSERT INTO pairing_records_for_mother (motherId, user1_id, user2_id)
       VALUES (?, ?, ?)`,
      [motherId, u1, u2],
    );

    console.log(`PAIR for ${motherId}: ${u1} + ${u2}`);

    // 💰 BONUS
    await db.execute(
      `UPDATE user_stats 
       SET pairingBonusAmount = COALESCE(pairingBonusAmount, 0) + 700 
       WHERE userId = ?`,
      [motherId],
    );
  }
};
