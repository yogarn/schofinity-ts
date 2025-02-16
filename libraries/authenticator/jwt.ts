import fs from 'fs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../../configs';

const expiry = config.get('jwt.expiry');

const privateKey = fs.readFileSync('private.pem', 'utf8');
const publicKey = fs.readFileSync('public.pem', 'utf8');

export const signToken = (userId: string, roleId: number): string => {
  const token = jwt.sign({ userId, roleId }, privateKey, {
    algorithm: 'RS256',
    expiresIn: expiry,
  });

  return token;
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
  return decoded;
};
