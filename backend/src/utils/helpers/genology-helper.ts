import { GeonologyNode, LowOrHigh, User } from "../models";

export const processUplineRewards = async (
  connection: any,
  startUplineId: string,
  newChildId: string,
) => {
  const POINT_VALUE = 1;
  const PAIRING_BONUS = 250.0;
  const TRAVEL_MILESTONE = 10;

  let currentUplineId = startUplineId;
  let currentChildId = newChildId;

  while (currentUplineId) {
    const [uplineUserRows] = await connection.execute(
      `SELECT id, parentId, leftChildId, rightChildId FROM users WHERE id = ?`,
      [currentUplineId],
    );

    const uplineUser = (uplineUserRows as any)[0];
    if (!uplineUser) break;

    const side = uplineUser.leftChildId === currentChildId ? "Left" : "Right";
    const downlineColumn = side === "Left" ? "leftDownline" : "rightDownline";
    const pointsColumn = side === "Left" ? "leftPoints" : "rightPoints";

    await connection.execute(
      `UPDATE user_stats SET 
        ${downlineColumn} = ${downlineColumn} + 1, 
        ${pointsColumn} = ${pointsColumn} + ? 
       WHERE userId = ?`,
      [POINT_VALUE, currentUplineId],
    );

    const [statsRows] = await connection.execute(
      `SELECT leftPoints, rightPoints, totalPairsMade, njWallet FROM user_stats WHERE userId = ? FOR UPDATE`,
      [currentUplineId],
    );

    const stats = (statsRows as any)[0];
    const matchValue = Math.floor(
      Math.min(stats.leftPoints, stats.rightPoints),
    );

    if (matchValue >= 1) {
      const pairsToProcess = matchValue;
      const commissionEarned = pairsToProcess * PAIRING_BONUS;
      const newTotalPairs = stats.totalPairsMade + pairsToProcess;

      // Update the user's wallet and consume points
      await connection.execute(
        `UPDATE user_stats SET 
            njWallet = njWallet + ?, 
            leftPoints = leftPoints - ?, 
            rightPoints = rightPoints - ?, 
            totalPairsMade = ? 
         WHERE userId = ?`,
        [
          commissionEarned,
          pairsToProcess,
          pairsToProcess,
          newTotalPairs,
          currentUplineId,
        ],
      );

      await connection.execute(
        "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
        [
          currentUplineId,
          "Pairing Bonus",
          "njWallet",
          commissionEarned,
          "Credit",
          `${pairsToProcess} pair(s) completed`,
        ],
      );

      const travelPointsAwarded =
        Math.floor(newTotalPairs / TRAVEL_MILESTONE) -
        Math.floor(stats.totalPairsMade / TRAVEL_MILESTONE);

      if (travelPointsAwarded > 0) {
        await connection.execute(
          `UPDATE user_stats SET travelGcPoints = travelGcPoints + ? WHERE userId = ?`,
          [travelPointsAwarded, currentUplineId],
        );

        await connection.execute(
          "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
          [
            currentUplineId,
            "Travel Points",
            "travelGcPoints",
            travelPointsAwarded,
            "Credit",
            `${travelPointsAwarded} travel point(s) awarded`,
          ],
        );
      }
    }

    currentChildId = currentUplineId;
    currentUplineId = uplineUser.parentId;
  }
};

// old code

// export const buildNodeTree = async (
//   db: any,
//   currentNodeData: any,
//   level: number,
//   relativeSide: string,
// ): Promise<GeonologyNode> => {
//   const MAX_LEVEL_DEPTH = 5;

//   const mapLevel = (lvl: number): LowOrHigh => ({
//     low: lvl,
//     high: 0,
//   });

//   const shouldRecurse = level < MAX_LEVEL_DEPTH;

//   const node: GeonologyNode = {
//     id: currentNodeData.id,
//     userName: currentNodeData.userName,
//     firstName: currentNodeData.firstName,
//     lastName: currentNodeData.lastName,
//     balance: currentNodeData.balance,
//     leftPoints: currentNodeData.leftPoints,
//     rightPoints: currentNodeData.rightPoints,
//     leftDownline: currentNodeData.leftDownline,
//     rightDownline: currentNodeData.rightDownline,
//     rankPoints: currentNodeData.rankPoints,
//     price: Number(currentNodeData.price),
//     image: currentNodeData.image,
//     // 2. Use the passed level
//     level: mapLevel(level),
//     // 3. Use the passed relative side
//     side: relativeSide,
//     hasDeduction: currentNodeData.hasDeduction,
//     sponsorId: currentNodeData.sponsorId,
//     sponsorName:
//       currentNodeData.sponsorFirstName && currentNodeData.sponsorLastName
//         ? `${currentNodeData.sponsorFirstName} ${currentNodeData.sponsorLastName}`
//         : null,
//     leftChild: null,
//     rightChild: null,
//   };

//   if (currentNodeData.leftChildId && shouldRecurse) {
//     const [leftRows] = await db.execute(
//       `SELECT
//                     u.id, u.userName, u.firstName, u.lastName, u.image,
//                     us.balance, us.leftPoints, us.rightPoints, us.leftDownline, us.rightDownline,
//                     us.rankPoints, us.level, us.sidePath, us.hasDeduction,
//                     u.leftChildId, u.rightChildId,
//                     u.sponsorId,
//                     s.firstName as sponsorFirstName,
//                     s.lastName as sponsorLastName,
//                     ac.price
//                 FROM users u
//                 JOIN user_stats us ON u.id = us.userId
//                 LEFT JOIN users s ON u.sponsorId = s.id
//                 LEFT JOIN activation_codes ac ON u.activationCodeId = ac.id
//                 WHERE u.id = ?`,
//       [currentNodeData.leftChildId],
//     );

//     const leftChildDatas = leftRows as any;
//     const leftChildData = leftChildDatas[0];

//     if (leftChildData) {
//       node.leftChild = await buildNodeTree(
//         db,
//         leftChildData,
//         level + 1, // Next level
//         relativeSide === "root" ? "[L]" : `${relativeSide}[L]`,
//       );
//     }
//   }

//   if (currentNodeData.rightChildId && shouldRecurse) {
//     const [rightRows] = await db.execute(
//       `SELECT
//                     u.id, u.userName, u.firstName, u.lastName, u.image,
//                     us.balance, us.leftPoints, us.rightPoints, us.leftDownline, us.rightDownline,
//                     us.rankPoints, us.level, us.sidePath, us.hasDeduction,
//                     u.leftChildId, u.rightChildId,
//                     u.sponsorId,
//                     s.firstName as sponsorFirstName,
//                     s.lastName as sponsorLastName,
//                     ac.price
//                 FROM users u
//                 JOIN user_stats us ON u.id = us.userId
//                 LEFT JOIN users s ON u.sponsorId = s.id
//                 LEFT JOIN activation_codes ac ON u.activationCodeId = ac.id
//                 WHERE u.id = ?`,
//       [currentNodeData.rightChildId],
//     );

//     const rightChildDatas = rightRows as any;
//     const rightChildData = rightChildDatas[0];

//     if (rightChildData) {
//       node.rightChild = await buildNodeTree(
//         db,
//         rightChildData,
//         level + 1, // Next level
//         relativeSide === "root" ? "[R]" : `${relativeSide}[R]`,
//       );
//     }
//   }

//   return node;
// };

export const buildNodeTree = async (
  db: any,
  currentNodeData: any,
  level: number,
  relativeSide: string,
  rootSponsorId: string,
): Promise<GeonologyNode> => {
  const MAX_LEVEL_DEPTH = 5;
  const shouldRecurse = level < MAX_LEVEL_DEPTH;

  const isDirect = currentNodeData.sponsorId === rootSponsorId || level === 0;

  const node: GeonologyNode = {
    id: currentNodeData.id,
    userName: isDirect ? currentNodeData.userName : "indirect",
    firstName: currentNodeData.firstName,
    lastName: currentNodeData.lastName,
    balance: currentNodeData.balance,
    leftPoints: currentNodeData.leftPoints,
    rightPoints: currentNodeData.rightPoints,
    leftDownline: currentNodeData.leftDownline,
    rightDownline: currentNodeData.rightDownline,
    rankPoints: currentNodeData.rankPoints,
    price: Number(currentNodeData.price),
    image: isDirect ? currentNodeData.image : null,
    level: { low: level, high: 0 },
    side: relativeSide,
    hasDeduction: currentNodeData.hasDeduction,
    sponsorId: currentNodeData.sponsorId,
    sponsorName:
      currentNodeData.sponsorFirstName && currentNodeData.sponsorLastName
        ? `${currentNodeData.sponsorFirstName} ${currentNodeData.sponsorLastName}`
        : null,
    leftChild: null,
    rightChild: null,
  };

  if (shouldRecurse) {
    if (currentNodeData.leftChildId) {
      node.leftChild = await fetchChildById(
        db,
        currentNodeData.leftChildId,
        level,
        relativeSide,
        "L",
        rootSponsorId,
      );
    }
    if (currentNodeData.rightChildId) {
      node.rightChild = await fetchChildById(
        db,
        currentNodeData.rightChildId,
        level,
        relativeSide,
        "R",
        rootSponsorId,
      );
    }
  }

  return node;
};

// Helper function to keep the code clean
const fetchChildById = async (
  db: any,
  childId: string,
  level: number,
  relativeSide: string,
  side: "L" | "R",
  rootSponsorId: string,
) => {
  const [rows] = await db.execute(
    `SELECT u.*, us.*, s.firstName as sponsorFirstName, s.lastName as sponsorLastName, ac.price
     FROM users u
     JOIN user_stats us ON u.id = us.userId
     LEFT JOIN users s ON u.sponsorId = s.id
     LEFT JOIN activation_codes ac ON u.activationCodeId = ac.id
     WHERE u.id = ?`,
    [childId],
  );
  const data = (rows as any)[0];
  if (!data) return null;

  return await buildNodeTree(
    db,
    data,
    level + 1,
    relativeSide === "root" ? `[${side}]` : `${relativeSide}[${side}]`,
    rootSponsorId,
  );
};

export const decrementUplineDownlineCounts = async (
  db: any,
  currentParentId: string,
  side: "[L]" | "[R]",
): Promise<void> => {
  if (!currentParentId) {
    return;
  }

  const downlineColumn = side === "[L]" ? "leftDownline" : "rightDownline";

  await db.execute(
    `UPDATE user_stats SET ${downlineColumn} = ${downlineColumn} -1 WHERE userId = ?`,
    [currentParentId],
  );

  const [grandParentRows] = await db.execute(
    `SELECT id, leftChildId, rightChildId
     FROM users
     WHERE leftChildId = ? OR rightChildId = ?`,
    [currentParentId, currentParentId],
  );

  const grandParentData = grandParentRows[0];

  if (grandParentData) {
    const grandParentId = grandParentData.id;
    let parentSideRelativeToGrandParent: "[L]" | "[R]";

    if (grandParentData.leftChildId === currentParentId) {
      parentSideRelativeToGrandParent = "[L]";
    } else {
      parentSideRelativeToGrandParent = "[R]";
    }

    await decrementUplineDownlineCounts(
      db,
      grandParentId,
      parentSideRelativeToGrandParent,
    );
  }
};

export const collectDescendantsForDeletion = async (
  db: any,
  currentId: string,
  idsToDelete: string[],
  coodesToReset: string[],
): Promise<void> => {
  const [userRows] = await db.execute(
    `SELECT id, leftChildId, rightChildId, activationCodeId
     FROM users
     WHERE id = ? FOR UPDATE
    `,
    [currentId],
  );

  const userData: User = userRows[0];

  if (!userData) return;

  idsToDelete.push(userData.id);

  if (userData.activationCodeId) {
    coodesToReset.push(userData.activationCodeId);
  }

  if (userData.leftChildId) {
    await collectDescendantsForDeletion(
      db,
      userData.leftChildId,
      idsToDelete,
      coodesToReset,
    );
  }

  if (userData.rightChildId) {
    await collectDescendantsForDeletion(
      db,
      userData.rightChildId,
      idsToDelete,
      coodesToReset,
    );
  }
};

export const getSponsorshipChain = async (
  db: any,
  startSponsorId: string,
  depth: number = 5,
) => {
  const chain = [];
  let currentId = startSponsorId;

  for (let i = 0; i < depth; i++) {
    if (!currentId) break;

    const [rows] = await db.execute(
      `SELECT id, sponsorId FROM users WHERE id = ?`,
      [currentId],
    );
    const user = (rows as any[])[0];

    if (user) {
      chain.push(user.id);
      currentId = user.sponsorId;
    } else {
      break;
    }
  }
  return chain;
};
