import { getDirectBonus, getIndirectBonus, getLevelBonus } from ".";
import { connection } from "../../config/mysql.db";
import { User, UserStats } from "../models";
import {
  getAll3500Users,
  groupBySponsor,
  processMotherPairs,
  processPairs,
  processSponsorPairs,
} from "./geanology-pairing-helper";
import { buildNodeTree, getSponsorshipChain } from "./genology-helper";

/**
 * Recursively processes binary volume and commissions for all ancestors up the tree.
 * * @param ancestorId The ID of the current ancestor being processed (starts with the direct upline).
 * @param side The side the new volume was added to relative to the ancestor: 'Left' or 'Right'.
 */
export const processBinaryVolumeUpstream = async (
  ancestorId: string,
  side: "Left" | "Right",
): Promise<void> => {
  if (!ancestorId) {
    return;
  }

  try {
    const db = connection();
    const pointColumn = side === "Left" ? "leftPoints" : "rightPoints";

    await db.execute(
      `UPDATE user_stats SET ${pointColumn} = ${pointColumn} + 1 WHERE userId = ?`,
      [ancestorId],
    );

    //Fetch the ancestor's updated stats and their own parentId
    const [ancestorDataResult] = await db.execute(
      `SELECT
                u.parentId,
                us.leftPoints,
                us.rightPoints,
                us.totalPairsMade
            FROM users u
            JOIN user_stats us ON u.id = us.userId
            WHERE u.id = ? FOR UPDATE`,
      [ancestorId],
    );

    const ancestore = (ancestorDataResult as any[])[0];

    if (!ancestore) {
      return;
    }

    const matchValue = Math.min(ancestore.leftPoints, ancestore.rightPoints);

    if (matchValue >= 1) {
      const pairsToProcess = Math.floor(matchValue);

      //Grant 250 * pairsToProcess Pairing Bonus and update pair count
      const commisionCount = pairsToProcess * 250.0;
      const newLeftPoints = ancestore.leftPoints - pairsToProcess;
      const newRightPoints = ancestore.rightPoints - pairsToProcess;
      const newTotalPairs = ancestore.totalPairsMade + pairsToProcess;

      await db.execute(
        `UPDATE user_stats SET
                njWallet = njWallet + ?,
                leftPoints = ?,
                rightPoints = ?,
                totalPairsMade = ?
         WHERE userId = ?`,
        [
          commisionCount,
          newLeftPoints,
          newRightPoints,
          newTotalPairs,
          ancestorId,
        ],
      );

      await db.execute(
        "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
        [
          ancestorId,
          "Pairing Bonus",
          "njWallet",
          commisionCount,
          "Credit",
          `${pairsToProcess} binary pair(s) completed`,
        ],
      );

      const pairsMadeCheck = newTotalPairs - pairsToProcess;

      const travelPointsAwarded =
        Math.floor(newTotalPairs / 10) - Math.floor(pairsMadeCheck / 10);

      if (travelPointsAwarded > 0) {
        //Grant Travel GC Points
        const pointValue = travelPointsAwarded * 1.0;

        await db.execute(
          `UPDATE user_stats SET travelGcPoints = travelGcPoints + ? WHERE userId = ?`,
          [travelPointsAwarded, ancestorId],
        );

        await db.execute(
          "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
          [
            ancestorId,
            "Travel Points",
            "travelGcPoints",
            pointValue,
            "Credit",
            `${travelPointsAwarded} travel point(s) awarded`,
          ],
        );
      }
    }

    if (ancestore.parentId) {
      const [parentSideCheck] = await db.execute(
        `SELECT leftChildId, rightChildId FROM users WHERE id = ?`,
        [ancestore.parentId],
      );

      const parentData = (parentSideCheck as any[])[0];
      let parentSide: "Left" | "Right";

      if (parentData.leftChildId === ancestorId) {
        parentSide = "Left";
      } else if (parentData.rightChildId === ancestorId) {
        parentSide = "Right";
      } else {
        console.log(
          `Ancestore ${ancestorId} is not a direct child of parent ${ancestore.parentId}`,
        );
        return;
      }

      await processBinaryVolumeUpstream(ancestore.parentId, parentSide);
    }
  } catch (error) {
    console.error(
      `Critical failure in Binary Commission for ancestor ${ancestorId}:`,
      error,
    );
  }
};

export const processBinaryVolumeUpstreamv1 = async (
  initialAncestorId: string,
  uplineId: string,
  initialSide: "Left" | "Right",
  newUserId: string,
  packagePrice: number,
  newLevel: any,
): Promise<void> => {
  if (!initialAncestorId) return;

  const db = connection();
  const price = Number(packagePrice);

  const path: any[] = [];
  let currentAncestorId = uplineId;
  let currentSide = initialSide;

  try {
    // 1. TRAVERSAL: Build the ancestor path
    while (currentAncestorId) {
      const [dataResult] = await db.execute(
        `SELECT
          anc.id AS currentId,
          anc.parentId,
          anc.createdAt,
          anc.sponsorId AS ancestorSponsorId,
          ac.price AS currentIdPrice,
          child.sponsorId AS actualSponsorId,
          parent.sponsorId AS parentSponsorId,
          childStats.level AS childLevel,
          ancStats.level AS ancestorLevel,
          ancStats.indirectBonus3500 AS ancestorIndirectBonus3500,
          ancStats.indirectBonus500 AS ancestorIndirectBonus500,
          -- Left Child Data
          l.id AS leftChildId,
          acl.price AS leftChildPrice,
          -- Right Child Data
          r.id AS rightChildId,
          acr.price AS rightChildPrice
        FROM users anc
          LEFT JOIN activation_codes ac ON anc.activationCodeId = ac.id
          LEFT JOIN user_stats ancStats ON anc.id = ancStats.userId
          LEFT JOIN users child ON child.id = ?
          LEFT JOIN users parent ON parent.id = child.parentId
          LEFT JOIN user_stats childStats ON childStats.userId = child.id
          -- Join for the Left Child
          LEFT JOIN users l ON anc.leftChildId = l.id
          LEFT JOIN activation_codes acl ON l.activationCodeId = acl.id
          -- Join for the Right Child
          LEFT JOIN users r ON anc.rightChildId = r.id
          LEFT JOIN activation_codes acr ON r.activationCodeId = acr.id
          WHERE anc.id = ? FOR UPDATE`,
        [newUserId, currentAncestorId],
      );

      const rawData = (dataResult as any[])[0];

      // console.log("dataRes", dataResult);

      const leftChildData =
        rawData.currentId === uplineId && initialSide === "Left"
          ? { id: newUserId, activationCodePrice: price }
          : rawData.leftChildId
            ? {
                id: rawData.leftChildId,
                activationCodePrice: rawData.leftChildPrice,
              }
            : null;

      const rightChildData =
        rawData.currentId === uplineId && initialSide === "Right"
          ? { id: newUserId, activationCodePrice: price }
          : rawData.rightChildId
            ? {
                id: rawData.rightChildId,
                activationCodePrice: rawData.rightChildPrice,
              }
            : null;

      const data = {
        currentId: rawData.currentId,
        parentId: rawData.parentId,
        createdAt: rawData.createdAt,
        ancestorSponsorId: rawData.ancestorSponsorId,
        currentIdPrice: rawData.currentIdPrice,
        actualSponsorId: rawData.actualSponsorId,
        parentSponsorId: rawData.parentSponsorId,
        childLevel: rawData.childLevel,
        ancestorLevel: rawData.ancestorLevel,
        ancestorIndirectBonus3500: rawData.ancestorIndirectBonus3500,
        ancestorIndirectBonus500: rawData.ancestorIndirectBonus500,
        // Nested Objects
        leftChild: leftChildData,
        rightChild: rightChildData,
        side: currentSide,
      };

      if (!rawData) break;

      path.push({ ...data, side: currentSide });

      if (data.parentId) {
        const [pData] = await db.execute(
          `SELECT leftChildId FROM users WHERE id = ?`,
          [data.parentId],
        );
        const parentLeftChild = (pData as any[])[0]?.leftChildId;
        currentSide = parentLeftChild === currentAncestorId ? "Left" : "Right";
        currentAncestorId = data.parentId;
      } else {
        currentAncestorId = "";
      }
    }

    // console.log("path", path);

    const secondToLastItem = path.length >= 2 ? path[path.length - 2] : null;

    console.log("secondToLastItem", secondToLastItem);

    let finalSponsorIdToUse;

    if (path[0]?.actualSponsorId === null && secondToLastItem) {
      finalSponsorIdToUse = secondToLastItem.parentId;
    } else {
      finalSponsorIdToUse = path[0]?.parentSponsorId;
    }

    let mainGrandParentSponsor;

    mainGrandParentSponsor = path[path.length - 1]?.currentId;

    //container for the pairing logic items
    const nodeMap = new Map();
    const que = [];

    for (const node of path) {
      const pointColumn = node.side === "Left" ? "leftPoints" : "rightPoints";

      await db.execute(
        `UPDATE user_stats SET ${pointColumn} = ${pointColumn} + 1 WHERE userId = ?`,
        [node.currentId],
      );

      console.log("price", price);

      // PREVENT BONUS IF PRICE IS 0
      if (price === 0) return;

      // console.log("nodeMap", nodeMap);
      // console.log("node", node);

      //LOGIC FOR 3500 PAIRING
      nodeMap.set(node.currentId, node);
      que.push(node);
    }

    let queIndex = 0;
    while (queIndex < que.length) {
      const currentNode = que[queIndex];
      queIndex++;

      const childrenToFetch = [];

      if (currentNode.leftChild?.id && !nodeMap.has(currentNode.leftChild.id)) {
        childrenToFetch.push(currentNode.leftChild.id);
      }
      if (
        currentNode.rightChild?.id &&
        !nodeMap.has(currentNode.rightChild.id)
      ) {
        childrenToFetch.push(currentNode.rightChild.id);
      }

      for (const childId of childrenToFetch) {
        const [siblingResult] = await db.execute(
          `SELECT
            u.id AS currentId,
            u.parentId,
            u.createdAt,
            u.sponsorId AS ancestorSponsorId,
            ac.price AS currentIdPrice,

            child.sponsorId AS actualSponsorId,
            parent.sponsorId AS parentSponsorId,
            childStats.level AS childLevel,

            us.level AS ancestorLevel,
            us.indirectBonus3500 AS ancestorIndirectBonus3500,
            us.indirectBonus500 AS ancestorIndirectBonus500,

            u.leftChildId AS leftChildId,
            acl.price AS leftChildPrice,
            u.rightChildId AS rightChildId,
            acr.price AS rightChildPrice

          FROM users u
          LEFT JOIN activation_codes ac ON u.activationCodeId = ac.id
          LEFT JOIN user_stats us ON u.id = us.userId

          LEFT JOIN users child ON child.id = ?
          LEFT JOIN users parent ON parent.id = child.parentId
          LEFT JOIN user_stats childStats ON childStats.userId = child.id

          LEFT JOIN users l ON u.leftChildId = l.id
          LEFT JOIN activation_codes acl ON l.activationCodeId = acl.id
          LEFT JOIN users r ON u.rightChildId = r.id
          LEFT JOIN activation_codes acr ON r.activationCodeId = acr.id

        WHERE u.id = ?`,
          [newUserId, childId],
        );

        const rawSibling = (siblingResult as any[])[0];

        if (rawSibling) {
          const newNode: any = {
            currentId: rawSibling.currentId,
            createdAt: rawSibling.createdAt,
            parentId: rawSibling.parentId,
            ancestorSponsorId: rawSibling.ancestorSponsorId,
            currentIdPrice: rawSibling.currentIdPrice,
            actualSponsorId: rawSibling.actualSponsorId,
            parentSponsorId: rawSibling.parentSponsorId,
            childLevel: rawSibling.childLevel,
            ancestorLevel: rawSibling.ancestorLevel,
            ancestorIndirectBonus3500: rawSibling.ancestorIndirectBonus3500,
            ancestorIndirectBonus500: rawSibling.ancestorIndirectBonus500,
            leftChild: rawSibling.leftChildId
              ? {
                  id: rawSibling.leftChildId,
                  activationCodePrice: rawSibling.leftChildPrice,
                }
              : null,
            rightChild: rawSibling.rightChildId
              ? {
                  id: rawSibling.rightChildId,
                  activationCodePrice: rawSibling.rightChildPrice,
                }
              : null,
            isExpansion: true, // Flag to distinguish from the main path
          };

          nodeMap.set(rawSibling.currentId, newNode);
          que.push(newNode);
        }
      }
    }

    // console.log("nodeMap", nodeMap);

    //logic for the direct and indirect bonuses...
    const nodeArrayMap = Array.from(nodeMap.values());

    const [newUserResult] = await db.execute(
      `SELECT sponsorId FROM users WHERE id = ?`,
      [newUserId],
    );
    const directSponsorId = (newUserResult as any[])[0]?.sponsorId;

    console.log("nodeArrayMap", nodeArrayMap);

    //newlogicv1
    let referalChain = await getSponsorshipChain(db, directSponsorId, 5);

    const chainLength = referalChain.length;

    if (chainLength === 3) {
      referalChain = referalChain.map((entry, index) => {
        if (index === 1) return { ...entry, level: 2 };
        if (index === 2) return { ...entry, level: 3 };

        return entry;
      });
    }

    console.log("referal chain", referalChain);

    if (uplineId === initialAncestorId) {
      console.log("runs here dont apply subtraction");
    }

    for (const entry of referalChain) {
      const { userId, level } = entry;

      const nodeEntry = nodeArrayMap.find((node) => node.currentId === userId);

      let finalLevel = level;
      const isInitialAncestor = uplineId === initialAncestorId;

      if (
        (nodeEntry && chainLength === 2) ||
        (chainLength === 3 && level !== 0 && !isInitialAncestor)
      ) {
        const childLevel = nodeEntry.childLevel || 0;
        finalLevel = Math.max(0, childLevel - level);
        console.log(
          `Applying subtraction for ${userId}: ${childLevel} - ${level} = ${finalLevel}`,
        );
      } else {
        console.log(
          `Skipping subtraction for ${userId} (Chain Length: ${chainLength})`,
        );
      }

      if (level === 0) {
        console.log("direct amount runs reciever", userId);
        const directAmt = price === 3500 ? 500 : 100;
        if (price === 3500) {
          await db.execute(
            `UPDATE user_stats SET directBonus3500 = COALESCE(directBonus3500, 0) + ? WHERE userId = ?`,
            [directAmt, userId],
          );
          await db.execute(
            `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
           VALUES (?, 'Direct Bonus for package 3500', 'directBonus', ?, 'Credit', 'Direct referral bonus')`,
            [userId, directAmt],
          );
        } else {
          await db.execute(
            `UPDATE user_stats SET directBonus500 = COALESCE(directBonus500, 0) + ? WHERE userId = ?`,
            [directAmt, userId],
          );
          await db.execute(
            `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
           VALUES (?, 'Direct Bonus for package 500', 'directBonus', ?, 'Credit', 'Direct referral bonus')`,
            [userId, directAmt],
          );
        }
      } else {
        const indirectAmt = getLevelBonus(finalLevel);

        console.log(
          `indirect amounts receives ${indirectAmt} receivers`,
          userId,
        );

        if (price === 3500) {
          await db.execute(
            `UPDATE user_stats SET inDirectBonus3500 = COALESCE(inDirectBonus3500, 0) + ? WHERE userId = ?`,
            [indirectAmt, userId],
          );
          await db.execute(
            `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
             VALUES (?, 'Indirect Bonus for 3500', 'indirectBonus', ?, 'Credit', ?)`,
            [userId, indirectAmt, `Indirect bonus degree ${level}`],
          );
        } else {
          await db.execute(
            `UPDATE user_stats SET inDirectBonus500 = COALESCE(inDirectBonus500, 0) + ? WHERE userId = ?`,
            [indirectAmt, userId],
          );
          await db.execute(
            `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
             VALUES (?, 'Indirect Bonus for 500', 'indirectBonus', ?, 'Credit', ?)`,
            [userId, indirectAmt, `Indirect bonus degree ${level}`],
          );
        }
      }
    }

    //LOGIC FOR 3500 PAIRING
    const [dailyResult] = await db.execute(
      `
         SELECT COUNT(*) AS todayPairCount
         FROM pairing_records
         WHERE DATE(createdAt) = CURDATE()
        `,
    );

    const todayPairs = (dailyResult as any[])[0]?.todayPairs ?? 0;

    //newLogic
    const newlyAddedUserId = newUserId;
    const newLyAddedUser = nodeMap.get(newlyAddedUserId);
    let finalReceiverId;

    if (!newLyAddedUser || +newLyAddedUser.currentIdPrice !== 3500) {
      console.log(
        "Newly added user is not 3500 or not found. Skipping pairing.",
      );
      return;
    }

    const users3500 = getAll3500Users(nodeMap);

    // console.log(
    //   "users3500",
    //   users3500.map((u) => u.currentId),
    // );

    //group by sponsor
    const sponsorGroups = groupBySponsor(users3500);

    // console.log("sponsorGroups", sponsorGroups);

    const remainingSlots = 15 - todayPairs;

    // console.log("remainingSlots", remainingSlots);

    if (remainingSlots <= 0) {
      console.log("Daily pairing limit reached");
    } else {
      await processSponsorPairs(sponsorGroups, nodeMap);
      await processMotherPairs(users3500, nodeMap);
    }
  } catch (error) {
    console.error("Bonus Error:", error);
  }
};
