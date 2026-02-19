import { connection } from "../../config/mysql.db";

/**
 * Recursively processes binary volume and commissions for all ancestors up the tree.
 * * @param ancestorId The ID of the current ancestor being processed (starts with the direct upline).
 * @param side The side the new volume was added to relative to the ancestor: 'Left' or 'Right'.
 */
export const processBinaryVolumeUpstream = async (
  ancestorId: string,
  side: "Left" | "Right"
): Promise<void> => {
  if (!ancestorId) {
    return;
  }

  try {
    const db = connection();
    const pointColumn = side === "Left" ? "leftPoints" : "rightPoints";

    console.log(`pointColumn`, pointColumn);

    console.log(`ancestorId`, ancestorId);

    await db.execute(
      `UPDATE user_stats SET ${pointColumn} = ${pointColumn} + 1 WHERE userId = ?`,
      [ancestorId]
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
      [ancestorId]
    );

    const ancestore = (ancestorDataResult as any[])[0];

    if (!ancestore) {
      return;
    }

    const matchValue = Math.min(ancestore.leftPoints, ancestore.rightPoints);

    console.log(`matchValue`, matchValue);

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
        ]
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
        ]
      );

      const pairsMadeCheck = newTotalPairs - pairsToProcess;

      const travelPointsAwarded =
        Math.floor(newTotalPairs / 10) - Math.floor(pairsMadeCheck / 10);

      if (travelPointsAwarded > 0) {
        //Grant Travel GC Points
        const pointValue = travelPointsAwarded * 1.0;

        await db.execute(
          `UPDATE user_stats SET travelGcPoints = travelGcPoints + ? WHERE userId = ?`,
          [travelPointsAwarded, ancestorId]
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
          ]
        );
      }
    }

    if (ancestore.parentId) {
      const [parentSideCheck] = await db.execute(
        `SELECT leftChildId, rightChildId FROM users WHERE id = ?`,
        [ancestore.parentId]
      );

      const parentData = (parentSideCheck as any[])[0];
      let parentSide: "Left" | "Right";

      if (parentData.leftChildId === ancestorId) {
        parentSide = "Left";
      } else if (parentData.rightChildId === ancestorId) {
        parentSide = "Right";
      } else {
        console.log(
          `Ancestore ${ancestorId} is not a direct child of parent ${ancestore.parentId}`
        );
        return;
      }

      await processBinaryVolumeUpstream(ancestore.parentId, parentSide);
    }
  } catch (error) {
    console.error(
      `Critical failure in Binary Commission for ancestor ${ancestorId}:`,
      error
    );
  }
};
