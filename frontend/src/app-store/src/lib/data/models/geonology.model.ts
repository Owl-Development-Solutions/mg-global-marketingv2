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
  hasDeduction: number | boolean;
  leftChild?: GeonologyNode | null;
  rightChild?: GeonologyNode | null;
}

export interface LowOrHigh {
  low: number;
  high: number;
}

export interface AddUserGeonologyData {
  parentUserName: string;
  side: string;
  child: GeonologyNode;
  activationCodeId: string;
  sponsorUsername: string;
  mainParentTree: string;
}

export interface GeonologyResponse {
  newUserId: string;
  geonologyLevel: LowOrHigh;
}
