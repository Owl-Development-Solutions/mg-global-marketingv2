export interface GeonologyNode {
  id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  balance: string | number;
  leftPoints: number;
  rightPoints: number;
  leftDownline: number;
  rightDownline: number;
  rankPoints: number;
  level: number | LowOrHigh;
  side: string;
  image?: string;
  hasDeduction: number | boolean;
  leftChild?: GeonologyNode | null;
  rightChild?: GeonologyNode | null;
}

export interface LowOrHigh {
  low: number;
  high: number;
}
