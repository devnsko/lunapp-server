import jwt from 'jsonwebtoken';
import { updateToken, deleteToken } from './database/requests/tokenRequest';

export interface TokensPair {
    accessToken: string;
    refreshToken: string;
}

class TokenService {
    generateTokens(payload: any): TokensPair {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        } as TokensPair;
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await updateToken({ userId, refreshToken });
    }

    async removeToken(refreshToken: string) {
        const tokenData = await deleteToken(refreshToken);
        return tokenData;
    }
}

export default new TokenService();