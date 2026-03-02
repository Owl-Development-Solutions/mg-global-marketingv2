import { getDirectBonus, getIndirectBonus, getLevelBonus } from ".";
import { connection } from "../../config/mysql.db";

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

    console.log(`pointColumn`, pointColumn);

    console.log(`ancestorId`, ancestorId);

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
  initialSide: "Left" | "Right",
  newUserId: string,
  packagePrice: number,
): Promise<void> => {
  if (!initialAncestorId) return;

  console.log("initialAncestorId", initialAncestorId);

  console.log("newUserId", newUserId);

  const db = connection();
  const price = Number(packagePrice);

  const path: any[] = [];
  let currentAncestorId = initialAncestorId;
  let currentSide = initialSide;

  try {
    // 1. TRAVERSAL: Build the ancestor path
    while (currentAncestorId) {
      const [dataResult] = await db.execute(
        `SELECT
            anc.id AS currentId,
            anc.parentId,
            anc.sponsorId AS ancestorSponsorId,
            child.sponsorId AS actualSponsorId,
            parent.sponsorId AS parentSponsorId,
            childStats.level AS childLevel,
            ancStats.level AS ancestorLevel,
            ancStats.indirectBonus3500 AS ancestorIndirectBonus3500,
            ancStats.indirectBonus500 AS ancestorIndirectBonus500
         FROM users anc
         LEFT JOIN user_stats ancStats ON anc.id = ancStats.userId
         LEFT JOIN users child ON child.id = ?
         LEFT JOIN users parent ON parent.id = child.parentId
         LEFT JOIN user_stats childStats ON childStats.userId = child.id
         WHERE anc.id = ? FOR UPDATE`,
        [newUserId, currentAncestorId],
      );

      const data = (dataResult as any[])[0];
      if (!data) break;

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

    console.log("path", path);

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

    for (const node of path) {
      const pointColumn = node.side === "Left" ? "leftPoints" : "rightPoints";

      await db.execute(
        `UPDATE user_stats SET ${pointColumn} = ${pointColumn} + 1 WHERE userId = ?`,
        [node.currentId],
      );

      const degree = Number(node.childLevel) - Number(node.ancestorLevel);

      /* DIRECT BONUS */
      if (node.currentId === node.actualSponsorId) {
        const directAmt = price === 3500 ? 400 : 100;

        if (price === 3500) {
          //package price bonus 400
          await db.execute(
            `UPDATE user_stats SET directBonus3500 = COALESCE(directBonus3500, 0) + ? WHERE userId = ?`,
            [directAmt, node.currentId],
          );
          await db.execute(
            `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
           VALUES (?, 'Direct Bonus for package 3500', 'directBonus', ?, 'Credit', 'Direct referral bonus')`,
            [node.currentId, directAmt],
          );
        } else {
          await db.execute(
            `UPDATE user_stats SET directBonus500 = COALESCE(directBonus500, 0) + ? WHERE userId = ?`,
            [directAmt, node.currentId],
          );
          await db.execute(
            `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
           VALUES (?, 'Direct Bonus for package 500', 'directBonus', ?, 'Credit', 'Direct referral bonus')`,
            [node.currentId, directAmt],
          );
        }
      } else if (node.currentId === node.parentSponsorId) {
        console.log("runs the indirect");

        /* INDIRECT BONUS */
        const indirectAmt = getIndirectBonus({
          price,
          current3500: Number(node.ancestorIndirectBonus3500),
          current500: Number(node.ancestorIndirectBonus500),
        });

        if (indirectAmt > 0) {
          if (price === 3500) {
            await db.execute(
              `UPDATE user_stats SET inDirectBonus3500 = COALESCE(inDirectBonus3500, 0) + ? WHERE userId = ?`,
              [indirectAmt, node.currentId],
            );
            await db.execute(
              `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
             VALUES (?, 'Indirect Bonus for 3500', 'indirectBonus', ?, 'Credit', ?)`,
              [node.currentId, indirectAmt, `Indirect bonus degree ${degree}`],
            );

            if (
              mainGrandParentSponsor &&
              node.currentId !== mainGrandParentSponsor
            ) {
              await db.execute(
                `UPDATE user_stats SET inDirectBonus3500 = COALESCE(inDirectBonus3500, 0) + ? WHERE userId = ?`,
                [indirectAmt, mainGrandParentSponsor],
              );
              await db.execute(
                `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
             VALUES (?, 'Indirect Bonus for 3500', 'indirectBonus', ?, 'Credit', ?)`,
                [
                  mainGrandParentSponsor,
                  indirectAmt,
                  `Indirect bonus degree ${degree}`,
                ],
              );
            }
          } else {
            await db.execute(
              `UPDATE user_stats SET inDirectBonus500 = COALESCE(inDirectBonus500, 0) + ? WHERE userId = ?`,
              [indirectAmt, node.currentId],
            );
            await db.execute(
              `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
             VALUES (?, 'Indirect Bonus for 500', 'indirectBonus', ?, 'Credit', ?)`,
              [node.currentId, indirectAmt, `Indirect bonus degree ${degree}`],
            );

            if (
              mainGrandParentSponsor &&
              node.currentId !== mainGrandParentSponsor
            ) {
              await db.execute(
                `UPDATE user_stats SET inDirectBonus500 = COALESCE(inDirectBonus500, 0) + ? WHERE userId = ?`,
                [indirectAmt, mainGrandParentSponsor],
              );
              await db.execute(
                `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
             VALUES (?, 'Indirect Bonus for 500', 'indirectBonus', ?, 'Credit', ?)`,
                [
                  mainGrandParentSponsor,
                  indirectAmt,
                  `Indirect bonus degree ${degree}`,
                ],
              );
            }
          }
        }
      }
    }

    if (price === 3500 && mainGrandParentSponsor) {
      await db.execute(
        `UPDATE user_stats SET totalPairsMade = COALESCE(totalPairsMade, 0) + 1 WHERE userId = ?`,
        [mainGrandParentSponsor],
      );

      const [countResult] = await db.execute(
        `SELECT totalPairsMade FROM user_stats WHERE userId = ?`,
        [mainGrandParentSponsor],
      );
      const totalActivations = (countResult as any[])[0]?.totalPairsMade ?? 0;

      if (totalActivations > 0 && totalActivations % 2 === 0) {
        const [dailyResult] = await db.execute(
          `SELECT COUNT(*) as todayPairs FROM pairing_logs
           WHERE mainAncestorId = ? AND DATE(createdAt) = CURDATE()`,
          [mainGrandParentSponsor],
        );
        const todayPairs = (dailyResult as any[])[0]?.todayPairs ?? 0;

        if (todayPairs < 15) {
          const pairingBonus = 500;

          await db.execute(
            `UPDATE user_stats SET pairingBonusAmount = COALESCE(pairingBonusAmount, 0) + ? WHERE userId = ?`,
            [pairingBonus, mainGrandParentSponsor],
          );

          await db.execute(
            `INSERT INTO transactions (userId, type, walletType, amount, transactionDirection, description)
             VALUES (?, 'Pairing Bonus', 'Wallet Bonus', ?, 'Credit', 'Global 3500 pairing')`,
            [mainGrandParentSponsor, pairingBonus],
          );

          await db.execute(
            `INSERT INTO pairing_logs (mainAncestorId, packagePrice, bonusAmount, createdAt) VALUES (?, ?, ?, NOW())`,
            [mainGrandParentSponsor, 3500, pairingBonus],
          );
        } else {
          console.log(
            "Daily pairing limit (15) reached for:",
            mainGrandParentSponsor,
          );
        }
      }
    }
  } catch (error) {
    console.error("Bonus Error:", error);
  }
};
