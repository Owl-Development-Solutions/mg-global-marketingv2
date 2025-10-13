export interface GeonologyNode {
  userName: string;
  firstName: string;
  lastName: string;
  balance: number;
  leftPoints: number;
  rightPoints: number;
  leftDownline: number;
  rightDownline: number;
  rankPoints: number;
  level: number | LowOrHigh;
  side: string;
  hasDeduction: boolean;
  leftChild?: GeonologyNode;
  rightChild?: GeonologyNode;
}

export interface LowOrHigh {
  low: number;
  high: number;
}
