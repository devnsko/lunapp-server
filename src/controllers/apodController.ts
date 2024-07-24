import { dbQuery } from "../database/database"; 
import IPhotoOfDay from "../types/photoOfDay";

// Function to insert photo of the day into the database
export async function insertPhotoOfDay(photo: IPhotoOfDay): Promise<void> {
    try {
        // Insert the photo into the database
        const query = `INSERT INTO photoOfDay 
        (title, date, explanation, media_type, hdurl, url) 
        VALUES ($1, $2, $3, $4, $5, $6);`;
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

export async function getPhotoOfDay(date: string): Promise<IPhotoOfDay | null> {
    try {
        // Query the database for the photo of the day
        const query = `SELECT * FROM photoOfDay WHERE date = $1;`;
        const values = [date];
        const result = await dbQuery(query, values);

        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting photo of the day:', error);
        return null;
    }
}

// // Usage example
// const photo: IPhotoOfDay = {
//     date: '2022-01-01',
//     explanation: 'This is a test photo of the day',
//     media_type: 'image',
//     service_version: 'v1',
//     title: 'Test Photo of the Day',
//     hdurl: 'https://example.com/image.jpg',
//     url: 'https://example.com'
// };

// insertPhotoOfDay(photo);