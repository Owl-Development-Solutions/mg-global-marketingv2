export interface ActivationCode {
  id: string;
  code: string;
  status: string;
  codeDescription: string;
  sponsorId: string;
  redeemedById: string;
  redeemedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updated_at: Date;
}
