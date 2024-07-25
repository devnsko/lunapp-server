import { dbQuery } from "../database";
import IPhotoOfDay from "../../types/photoOfDay";

export async function insertPhotoOfDay(photo: IPhotoOfDay): Promise<void> {
    try {
        // Insert the photo into the database
        const query = `INSERT INTO photoOfDay 
        (title, date, explanation, media_type, hdurl, url) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (date) DO UPDATE SET
        (title, date, explanation, media_type, hdurl, url) = ($1, $3, $4, $5, $6)
        ;`;
        const values = [
            photo.title,
            photo.date,
            photo.explanation,
            photo.media_type,
            photo.hdurl,
            photo.url
        ]
        await dbQuery(query, values);

        console.log('Photo of the day inserted successfully!');
    } catch (error) {
        console.error('Error inserting photo of the day:', error);
    }
}