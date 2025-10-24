import { GeonologyNode, LowOrHigh } from "../models";

export const processUplineRewards = async (
  connection: any,
  startUplineId: string,
  newChildId: string
) => {
  console.log(`connection`, connection);

  const RPP = 100;
  const PAIRING_BONUS = 150.0;

  let currentUplineId = startUplineId;
  let currentChildId = newChildId;

  while (currentUplineId) {
    const [uplineUserRows] = await connection.execute(
      `SELECT id, parentId, leftChildId, rightChildId FROM users WHERE id = ?`,
      [currentUplineId]
    );

    const uplineUsers = uplineUserRows as any;
    const uplineUser = uplineUsers[0];

    if (!uplineUser) break;

    const sideToUpdate =
      uplineUser.leftChildId === currentChildId
        ? "leftDownline"
        : "rightDownline";

    await connection.execute(
      `UPDATE user_stats SET ${sideToUpdate} = ${sideToUpdate} + 1 WHERE userId = ?`,
      [currentUplineId]
    );

    const [statsRows] = await connection.execute(
      `SELECT leftPoints, rightPoints, balance FROM user_stats WHERE userId = ? FOR UPDATE`,
      [currentUplineId]
    );

    const stats = statsRows as any;
    const stat = stats[0];

    const matches = Math.floor(
      Math.min(stat.leftPoints, stat.rightPoints) / RPP
    );

    if (matches > 0) {
      const pointsToDeduct = matches * RPP;
      const commisionEarned = matches * PAIRING_BONUS;

      await connection.execute(
        `UPDATE user_stats SET leftPoints = leftPoints - ?, rightPoints = rightPoints - ?, balance = balance + ? WHERE userId = ?`,
        [pointsToDeduct, pointsToDeduct, commisionEarned, currentUplineId]
      );

      //@TODO
      //SHOULD WE ADD A commission_history table her ??
      //Should also insert a record into a 'commission_history' table here.
    }

    currentChildId = currentUplineId;
    currentUplineId = uplineUser.parentId;
  }
};

export const buildNodeTree = async (
  db: any,
  currentNodeData: any,
  isViewRoot: boolean = false
): Promise<GeonologyNode> => {
  const MAX_LEVEL_DEPTH = 5;

  const mapLevel = (level: number): LowOrHigh => ({
    low: level,
    high: 0,
  });

  const currentLevel = isViewRoot ? 0 : currentNodeData.level;
  const shouldRecurse = currentLevel < MAX_LEVEL_DEPTH;

  const node: GeonologyNode = {
    id: currentNodeData.id,
    userName: currentNodeData.userName,
    firstName: currentNodeData.firstName,
    lastName: currentNodeData.lastName,
    balance: currentNodeData.balance,
    leftPoints: currentNodeData.leftPoints,
    rightPoints: currentNodeData.rightPoints,
    leftDownline: currentNodeData.leftDownline,
    rightDownline: currentNodeData.rightDownline,
    rankPoints: currentNodeData.rankPoints,
    level: mapLevel(currentLevel),
    side: isViewRoot ? "root" : currentNodeData.sidePath,
    hasDeduction: currentNodeData.hasDeduction,
    leftChild: null,
    rightChild: null,
  };

  if (currentNodeData.leftChildId && shouldRecurse) {
    const [leftRows] = await db.execute(
      `SELECT
                    u.id, u.userName, u.firstName, u.lastName,
                    us.balance, us.leftPoints, us.rightPoints, us.leftDownline, us.rightDownline,
                    us.rankPoints, us.level, us.sidePath, us.hasDeduction,
                    u.leftChildId, u.rightChildId
                FROM users u
                JOIN user_stats us ON u.id = us.userId
                WHERE u.id = ?`,
      [currentNodeData.leftChildId]
    );

    const leftChildDatas = leftRows as any;
    const leftChildData = leftChildDatas[0];

    if (leftChildData) {
      node.leftChild = await buildNodeTree(db, leftChildData, false);
    }
  }

  if (currentNodeData.rightChildId && shouldRecurse) {
    const [rightRows] = await db.execute(
      `SELECT
                    u.id, u.userName, u.firstName, u.lastName,
                    us.balance, us.leftPoints, us.rightPoints, us.leftDownline, us.rightDownline,
                    us.rankPoints, us.level, us.sidePath, us.hasDeduction,
                    u.leftChildId, u.rightChildId
                FROM users u
                JOIN user_stats us ON u.id = us.userId
                WHERE u.id = ?`,
      [currentNodeData.rightChildId]
    );

    const rightChildDatas = rightRows as any;
    const rightChildData = rightChildDatas[0];

    if (rightChildData) {
      node.rightChild = await buildNodeTree(db, rightChildData, false);
    }
  }

  return node;
};
