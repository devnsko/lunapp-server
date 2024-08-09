import { dbQuery } from "../database";
import { ApodRateData, ApodRateModel } from "../schemas";

export async function hasLiked(rateData: ApodRateData): Promise<ApodRateModel | null> {
    try {
        const query = `
        SELECT * FROM apodRate
        WHERE user_id=$1
        AND post_id=$2
        `
        const rows = await dbQuery(query, [rateData.user_id, rateData.post_id])
        return rows[0] ?? null;
    } catch (error) {
        console.error('🚨 [Database]: Error inserting photo of the day: 🚨', error);
        throw error;
    }
}

export async function addLike(rateData: ApodRateData): Promise<ApodRateModel> {
    try {
        const query = `
            INSERT INTO apodRate (user_id, post_id) 
            VALUES ($1, $2)
            RETURNING *
        `;
        const rows = await dbQuery(query, [rateData.user_id, rateData.post_id]);
        return rows[0] as ApodRateModel;
    } catch (error) {
        console.error('🚨 [Database]: Error inserting photo of the day: 🚨', error);
        throw error;
    }
}

export async function removeLike(rateData: ApodRateData): Promise<ApodRateModel> {
    try {
        const query = `
            DELETE FROM apodRate 
            WHERE user_id = $1 
            AND post_id = $2 
            RETURNING *
        `;
        const rows = await dbQuery(query, [rateData.user_id, rateData.post_id]);
        return rows[0];
    } catch (error) {
        console.error('🚨 [Database]: Error inserting photo of the day: 🚨', error);
        throw error;
    }
}

export async function countLikes(postId: number): Promise<number> {
    try {
        const query = `
            SELECT COUNT(*) FROM apodRate
            WHERE post_id = $1
        `
        const rows = await dbQuery(query, [postId]);
        return rows[0];
    } catch (error) {
        console.error('🚨 [Database]: Error inserting photo of the day: 🚨', error);
        throw error;
    }
}

export async function likesByUser(userId: number): Promise<ApodRateModel[]> {
    try {
        const query = `
            SELECT * FROM apodRate
            WHERE user_id = $1
        `
        const rows = await dbQuery(query, [userId]);
        return rows;
    } catch (error) {
        console.error('🚨 [Database]: Error inserting photo of the day: 🚨', error);
        throw error;
    }
}

export default { hasLiked, addLike, removeLike, countLikes, likesByUser}