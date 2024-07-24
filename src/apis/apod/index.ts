import axios from 'axios';
import IPhotoOfDay from '../../types/photoOfDay';
import { getPhotoOfDay, insertPhotoOfDay } from '../../controllers/apodController';

const _key = process.env.NASA_API_KEY || 'DEMO_KEY';

export default async function photoOfDay(inputDate: string = ''): Promise<object> {
    try {
        let today = new Date();
        if (inputDate) {
            today = new Date(inputDate);
        }
        const date = today.toISOString().split('T')[0];
        let data: IPhotoOfDay | null = await getPhotoOfDay(date);
        if (!data) {
            const url = `https://api.nasa.gov/planetary/apod?api_key=${_key}&date=${date}`;
            const res = await axios.get(url);
            
            if (res.status !== 200){
                return {message: 'Invalid date'}
            }
            data = res.data;
            if(data)
                await insertPhotoOfDay(data);
        }
        else {
            console.log('Photo of the day found in the database!');
        }
        
        if (data) {
            return ({
                title: data.title,
                date: data.date,
                explanation: data.explanation,
                media_type: data.media_type,
                hdurl: data.hdurl,
                url: data.url
            });
        }
        return {
            message: 'No data found'
        }

    } catch (error) {
        // console.error('Error:', error);
        throw new Error('Error fetching data');
    }
}
