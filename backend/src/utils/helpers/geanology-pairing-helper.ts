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

      await giveBonusToUplineChain(sponsorId, map, user1, user2);
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

export const processMotherPairs = async (
  users: any[],
  map: Map<string, any>,
) => {
  const db = connection();
  const motherNode = getRootNode(map);
  if (!motherNode || !Array.isArray(users)) return;

  const motherId = motherNode.currentId;
  // buildQueue sorts by createdAt so we process oldest first
  let queue = buildQueue(users);

  // We will store people who are actually eligible for a new pair here
  const eligibleUsers = [];

  // Filter out anyone who already exists in a mother pair record
  for (const user of queue) {
    const [existing]: any = await db.execute(
      `SELECT 1 FROM pairing_records_for_mother 
       WHERE user1_id = ? OR user2_id = ? LIMIT 1`,
      [user.currentId, user.currentId],
    );

    if (existing.length === 0) {
      eligibleUsers.push(user);
    } else {
      console.log(`Mother skip: ${user.currentId} already used.`);
    }
  }

  // Pair the remaining eligible users
  while (eligibleUsers.length >= 2) {
    const user1 = eligibleUsers.shift();
    const user2 = eligibleUsers.shift();
    const [u1, u2] = normalizePair(user1.currentId, user2.currentId);

    await db.execute(
      `INSERT INTO pairing_records_for_mother (user1_id, user2_id) VALUES (?, ?)`,
      [u1, u2],
    );

    console.log(`SUCCESSFUL MOTHER PAIR: ${u1} + ${u2}`);

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

//new
export const processPairs = async (
  sponsorGroups: Map<string, any>,
  users3500: any[],
  map: Map<string, any>,
) => {
  const db = connection();
  const motherNode = getRootNode(map);

  if (motherNode && Array.isArray(users3500)) {
    if (users3500.length < 2) return;

    const queue = buildQueue(users3500);

    const root = getRootNode(map);

    if (!root) return;

    const motherId = motherNode.currentId;
    console.log(`Processing Mother Node: ${motherId}`);

    while (queue.length >= 2) {
      const user1 = queue.shift();
      const user2 = queue.shift();

      const [u1, u2] = normalizePair(user1.currentId, user2.currentId);

      const [result]: any = await db.execute(
        `INSERT IGNORE INTO pairing_records_for_mother (user1_id, user2_id) VALUES (?, ?)`,
        [u1, u2],
      );

      if (result.affectedRows === 0) {
        console.log(`mother duplicate skipped`);

        continue;
      }

      console.log(`MOTHER PAIR: ${u1} + ${u2}`);

      const motherNodeData = map.get(motherId);

      if (isEligibleForBonus(motherNodeData)) {
        console.log("Mother received bonues");

        await db.execute(
          `UPDATE user_stats SET pairingBonusAmount = COALESCE(pairingBonusAmount, 0) + ? WHERE userId = ?`,
          [700, motherId],
        );
      }
    }
  } else if (sponsorGroups instanceof Map) {
    console.log("runs here");

    for (const [sponsorId, users] of sponsorGroups) {
      if (users.length < 2) continue;

      const queue = buildQueue(users);

      while (queue.length >= 2) {
        const user1 = queue.shift();
        const user2 = queue.shift();

        const [u1, u2] = normalizePair(user1.currentId, user2.currentId);

        const [result]: any = await db.execute(
          `INSERT IGNORE INTO pairing_records (user1_id, user2_id, sponsor_id) VALUES (?, ?, ?)`,
          [u1, u2, sponsorId],
        );

        if (result.affectedRows === 0) {
          console.log(`SKIPPED DUPLICATE: ${u1} + ${u2}`);
          continue;
        }

        await giveBonusToUplineChain(sponsorId, map, user1, user2);
      }
    }
  }
};
