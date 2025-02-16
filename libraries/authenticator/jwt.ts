import fs from 'fs';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const privateKey = fs.readFileSync('ed_private.pem', 'utf8');
const publicKey = fs.readFileSync('ed_public.pem', 'utf8');

export const signToken = (userId: string, roleId: number): string => {
  const token = jwt.sign({ userId, roleId }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1h',
  });

  return token;
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
  return decoded;
};
