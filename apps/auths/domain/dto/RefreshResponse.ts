export type RefreshResponse = {
  jwt: string;
  refreshToken: string;
  expiresAt: Date;
};
