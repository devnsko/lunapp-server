import { dbQuery } from "../database";
import { ApodData, ApodModel } from "../schemas";

async function insert(object: ApodData): Promise<ApodModel> {
    try {
        // Insert the photo into the database
        const query = `INSERT INTO photoofday 
        (title, date, explanation, media_type, hdurl, url) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (date) DO UPDATE SET
        title = $1, explanation = $3, media_type = $4, hdurl = $5, url = $6
        RETURNING *;`;
        const values = [
            object.title,
            object.date,
            object.explanation,
            object.media_type,
            object.hdurl,
            object.url
        ];
        const row = await dbQuery(query, values);
        console.log('Photo of the day inserted successfully!');
        if (row.length !== 1) {
            console.error('Error inserting photo of the day', row);
            throw new Error('Error inserting photo of the day');
        }
        const result = await row[0] as ApodModel;
        return result;
    } catch (error) {
        console.error('🚨 [Database]: Error inserting photo of the day: 🚨', error);
        throw error;
    }
}

async function select(date: string): Promise<ApodModel | null> {
    try {
        // Query the database for the photo of the day
        const query = `SELECT * FROM photoOfDay WHERE date = $1;`;
        const values = [date];
        const result = await dbQuery(query, values);

        if (result.length == 1) {
            return await result[0] as ApodModel;
        } else {
            return null;
        }
    } catch (error) {
        console.error('🚨 [Database]: Error getting photo of the day: 🚨', error);
        throw error;
    }
}

export default { select, insert };