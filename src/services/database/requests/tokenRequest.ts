import { dbQuery } from "../database";
import { TokenData } from "../schemas";

export async function updateToken(tokenData: TokenData): Promise<TokenData> {
    const query = `
    INSERT INTO tokens (userId, refreshToken) VALUES ($1, $2)
    ON CONFLICT (userId) DO UPDATE SET refreshToken = $2
    RETURNING *;
    `;
    const result = await dbQuery(query, [tokenData.userId, tokenData.refreshToken]);
    return result[0];
}

export async function deleteToken(refreshToken: string): Promise<TokenData> {
    const query = `
    DELETE FROM tokens WHERE refreshToken = $1 RETURNING *;
    `;
    const result = await dbQuery(query, [refreshToken]);
    return result[0];
}