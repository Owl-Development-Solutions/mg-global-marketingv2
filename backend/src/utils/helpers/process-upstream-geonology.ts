import { connection } from "../../config/mysql.db";

/**
 * Recursively processes binary volume and commissions for all ancestors up the tree.
 * * @param ancestorId The ID of the current ancestor being processed (starts with the direct upline).
 * @param side The side the new volume was added to relative to the ancestor: 'Left' or 'Right'.
 */
// export const processBinaryVolumeUpstream = async (
//   ancestorId: string,
//   side: "Left" | "Right",
// ): Promise<void> => {
//   if (!ancestorId) {
//     return;
//   }

//   try {
//     const db = connection();
//     const pointColumn = side === "Left" ? "leftPoints" : "rightPoints";

//     console.log(`pointColumn`, pointColumn);

//     console.log(`ancestorId`, ancestorId);

//     await db.execute(
//       `UPDATE user_stats SET ${pointColumn} = ${pointColumn} + 1 WHERE userId = ?`,
//       [ancestorId],
//     );

//     //Fetch the ancestor's updated stats and their own parentId
//     const [ancestorDataResult] = await db.execute(
//       `SELECT
//                 u.parentId,
//                 us.leftPoints,
//                 us.rightPoints,
//                 us.totalPairsMade
//             FROM users u
//             JOIN user_stats us ON u.id = us.userId
//             WHERE u.id = ? FOR UPDATE`,
//       [ancestorId],
//     );

//     const ancestore = (ancestorDataResult as any[])[0];

//     if (!ancestore) {
//       return;
//     }

//     const matchValue = Math.min(ancestore.leftPoints, ancestore.rightPoints);

//     console.log(`matchValue`, matchValue);

//     if (matchValue >= 1) {
//       const pairsToProcess = Math.floor(matchValue);

//       //Grant 250 * pairsToProcess Pairing Bonus and update pair count
//       const commisionCount = pairsToProcess * 250.0;
//       const newLeftPoints = ancestore.leftPoints - pairsToProcess;
//       const newRightPoints = ancestore.rightPoints - pairsToProcess;
//       const newTotalPairs = ancestore.totalPairsMade + pairsToProcess;

//       await db.execute(
//         `UPDATE user_stats SET
//                 njWallet = njWallet + ?,
//                 leftPoints = ?,
//                 rightPoints = ?,
//                 totalPairsMade = ?
//          WHERE userId = ?`,
//         [
//           commisionCount,
//           newLeftPoints,
//           newRightPoints,
//           newTotalPairs,
//           ancestorId,
//         ],
//       );

//       await db.execute(
//         "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
//         [
//           ancestorId,
//           "Pairing Bonus",
//           "njWallet",
//           commisionCount,
//           "Credit",
//           `${pairsToProcess} binary pair(s) completed`,
//         ],
//       );

//       const pairsMadeCheck = newTotalPairs - pairsToProcess;

//       const travelPointsAwarded =
//         Math.floor(newTotalPairs / 10) - Math.floor(pairsMadeCheck / 10);

//       if (travelPointsAwarded > 0) {
//         //Grant Travel GC Points
//         const pointValue = travelPointsAwarded * 1.0;

//         await db.execute(
//           `UPDATE user_stats SET travelGcPoints = travelGcPoints + ? WHERE userId = ?`,
//           [travelPointsAwarded, ancestorId],
//         );

//         await db.execute(
//           "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
//           [
//             ancestorId,
//             "Travel Points",
//             "travelGcPoints",
//             pointValue,
//             "Credit",
//             `${travelPointsAwarded} travel point(s) awarded`,
//           ],
//         );
//       }
//     }

//     if (ancestore.parentId) {
//       const [parentSideCheck] = await db.execute(
//         `SELECT leftChildId, rightChildId FROM users WHERE id = ?`,
//         [ancestore.parentId],
//       );

//       const parentData = (parentSideCheck as any[])[0];
//       let parentSide: "Left" | "Right";

//       if (parentData.leftChildId === ancestorId) {
//         parentSide = "Left";
//       } else if (parentData.rightChildId === ancestorId) {
//         parentSide = "Right";
//       } else {
//         console.log(
//           `Ancestore ${ancestorId} is not a direct child of parent ${ancestore.parentId}`,
//         );
//         return;
//       }

//       await processBinaryVolumeUpstream(ancestore.parentId, parentSide);
//     }
//   } catch (error) {
//     console.error(
//       `Critical failure in Binary Commission for ancestor ${ancestorId}:`,
//       error,
//     );
//   }
// };

/**
 * Processes binary volume and commissions upstream recursively.
 * @param conn - The active database connection (for transaction safety)
 * @param ancestorId - The ID of the user receiving the points
 * @param side - Which side the new volume came from ("Left" | "Right")
 */
// export const processBinaryVolumeUpstream = async (
//   conn: any,
//   ancestorId: string,
//   side: "Left" | "Right",
// ): Promise<void> => {
//   if (!ancestorId) return;

//   try {
//     // 1. LOCK the row immediately to prevent concurrent updates from interfering
//     const [rows]: any = await conn.execute(
//       `SELECT
//         u.parentId,
//         us.leftPoints,
//         us.rightPoints,
//         us.leftDownline,
//         us.rightDownline,
//         us.totalPairsMade,
//         us.njWallet,
//         us.travelGcPoints
//       FROM users u
//       JOIN user_stats us ON u.id = us.userId
//       WHERE u.id = ? FOR UPDATE`,
//       [ancestorId],
//     );

//     const ancestor = rows[0];
//     if (!ancestor) return;

//     // 2. Prepare local variables for math
//     let currentLeftPoints = ancestor.leftPoints;
//     let currentRightPoints = ancestor.rightPoints;

//     const downlineColumn = side === "Left" ? "leftDownline" : "rightDownline";

//     // 3. Update CUMULATIVE count (The 1:1 Dashboard display)
//     // We increment this directly in the DB so it never resets.
//     await conn.execute(
//       `UPDATE user_stats SET ${downlineColumn} = ${downlineColumn} + 1 WHERE userId = ?`,
//       [ancestorId],
//     );

//     // 4. Update AVAILABLE balance for pairing math
//     if (side === "Left") {
//       currentLeftPoints += 1;
//     } else {
//       currentRightPoints += 1;
//     }

//     // 5. Calculate Pairing (The "Match")
//     const matchValue = Math.min(currentLeftPoints, currentRightPoints);

//     if (matchValue >= 1) {
//       const pairsToProcess = Math.floor(matchValue);
//       const commissionAmount = pairsToProcess * 250.0;

//       // Deduct from "Points" balance, but NOT from the "Downline" count
//       currentLeftPoints -= pairsToProcess;
//       currentRightPoints -= pairsToProcess;
//       const newTotalPairs = ancestor.totalPairsMade + pairsToProcess;

//       // Update Stats: Save the new point balance and the money earned
//       await conn.execute(
//         `UPDATE user_stats SET
//           leftPoints = ?,
//           rightPoints = ?,
//           njWallet = njWallet + ?,
//           totalPairsMade = ?
//          WHERE userId = ?`,
//         [
//           currentLeftPoints,
//           currentRightPoints,
//           commissionAmount,
//           newTotalPairs,
//           ancestorId,
//         ],
//       );

//       // Record Pairing Transaction
//       await conn.execute(
//         "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
//         [
//           ancestorId,
//           "Pairing Bonus",
//           "njWallet",
//           commissionAmount,
//           "Credit",
//           `${pairsToProcess} binary pair(s) completed`,
//         ],
//       );

//       // 6. Handle Travel Points (Every 10th pair)
//       const travelPointsAwarded =
//         Math.floor(newTotalPairs / 10) -
//         Math.floor(ancestor.totalPairsMade / 10);

//       if (travelPointsAwarded > 0) {
//         await conn.execute(
//           `UPDATE user_stats SET travelGcPoints = travelGcPoints + ? WHERE userId = ?`,
//           [travelPointsAwarded, ancestorId],
//         );

//         await conn.execute(
//           "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
//           [
//             ancestorId,
//             "Travel Points",
//             "travelGcPoints",
//             travelPointsAwarded,
//             "Credit",
//             `${travelPointsAwarded} travel point(s) awarded`,
//           ],
//         );
//       }
//     } else {
//       // No match found? Simply save the updated point balance
//       await conn.execute(
//         `UPDATE user_stats SET leftPoints = ?, rightPoints = ? WHERE userId = ?`,
//         [currentLeftPoints, currentRightPoints, ancestorId],
//       );
//     }

//     // 7. RECURSION: Move up to the next parent
//     if (ancestor.parentId) {
//       const [parentCheck]: any = await conn.execute(
//         `SELECT leftChildId, rightChildId FROM users WHERE id = ?`,
//         [ancestor.parentId],
//       );

//       const parentData = parentCheck[0];
//       if (parentData) {
//         // Determine if the current ancestor is the Left or Right child of their parent
//         const nextSide =
//           parentData.leftChildId === ancestorId ? "Left" : "Right";
//         await processBinaryVolumeUpstream(conn, ancestor.parentId, nextSide);
//       }
//     }
//   } catch (error) {
//     console.error(
//       `Critical failure in volume update for ${ancestorId}:`,
//       error,
//     );
//     throw error; // Throw so the main transaction can rollback
//   }
// };

export const processBinaryVolumeUpstream = async (
  conn: any,
  ancestorId: string,
  side: "Left" | "Right",
): Promise<void> => {
  if (!ancestorId) return;

  try {
    // 1. LOCK the user stats and fetch child info
    const [rows]: any = await conn.execute(
      `SELECT 
        u.parentId, u.leftChildId, u.rightChildId,
        us.leftPoints, us.rightPoints, 
        us.leftDownline, us.rightDownline, 
        us.pairsMadeGrandParent, us.njWallet
      FROM users u 
      JOIN user_stats us ON u.id = us.userId 
      WHERE u.id = ? FOR UPDATE`,
      [ancestorId],
    );

    const ancestor = rows[0];
    if (!ancestor) return;

    let currentLeft = ancestor.leftPoints;
    let currentRight = ancestor.rightPoints;
    let newPairsMadeGP = ancestor.pairsMadeGrandParent;
    let bonusToPay = 0;

    // 2. Increment Downline (Dashboard 1:1)
    const downlineCol = side === "Left" ? "leftDownline" : "rightDownline";
    await conn.execute(
      `UPDATE user_stats SET ${downlineCol} = ${downlineCol} + 1 WHERE userId = ?`,
      [ancestorId],
    );

    // 3. Increment Points Balance
    side === "Left" ? currentLeft++ : currentRight++;

    // 4. THE SPECIAL LOGIC: Check for Direct Pairing (Grandparent Pairs)
    // We only count this if BOTH physical slots are filled AND we have a point match
    const hasBothChildren =
      ancestor.leftChildId !== null && ancestor.rightChildId !== null;
    const pointMatch = Math.min(currentLeft, currentRight);

    if (hasBothChildren && pointMatch >= 1) {
      const pairs = Math.floor(pointMatch);
      newPairsMadeGP += pairs; // Increment your new column
      bonusToPay = pairs * 250.0;

      currentLeft -= pairs;
      currentRight -= pairs;

      // Log the specific Pairing Transaction
      await conn.execute(
        "INSERT INTO transactions (userId, type, walletType, amount, description) VALUES (?, ?, ?, ?, ?)",
        [
          ancestorId,
          "Pairing Bonus",
          "njWallet",
          bonusToPay,
          `Direct structure pair completed`,
        ],
      );
    }

    // 5. Update Database
    await conn.execute(
      `UPDATE user_stats SET 
        leftPoints = ?, 
        rightPoints = ?, 
        pairsMadeGrandParent = ?, 
        njWallet = njWallet + ? 
       WHERE userId = ?`,
      [currentLeft, currentRight, newPairsMadeGP, bonusToPay, ancestorId],
    );

    // 6. RECURSE: Move up to the next parent in the tree
    if (ancestor.parentId) {
      const [parentCheck]: any = await conn.execute(
        `SELECT leftChildId FROM users WHERE id = ?`,
        [ancestor.parentId],
      );
      const nextSide =
        parentCheck[0].leftChildId === ancestorId ? "Left" : "Right";
      await processBinaryVolumeUpstream(conn, ancestor.parentId, nextSide);
    }
  } catch (error) {
    console.error(`Volume update failed for ${ancestorId}:`, error);
    throw error;
  }
};
