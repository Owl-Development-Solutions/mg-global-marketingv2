export interface GeonologyNode {
  id?: string;
  userName: string;
  firstName: string;
  middleName?: string;
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
  sponsorId?: string;
  sponsorName?: string | null;
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
}

export interface GeonologyResponse {
  newUserId: string;
  geonologyLevel: LowOrHigh;
}
