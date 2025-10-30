export interface ActivationCode {
  id: string;
  code: string;
  status: string;
  codeDescription: string;
  sponsorId: string;
  expiresAt: string;
  price: string;
  redeemedAt: Date;
  createdAt: Date;
  updated_at: Date;
}
