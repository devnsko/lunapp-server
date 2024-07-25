import axios from 'axios';
import IPhotoOfDay from '../../types/photoOfDay';

const _key = process.env.NASA_API_KEY || 'DEMO_KEY';
export default async function fetchAPOD(date: string = ''): Promise<IPhotoOfDay> {
    try {
        const data = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${_key}${date?'&date='+date : ''}`);
        return {
            title: data.data.title,
            date: data.data.date,
            explanation: data.data.explanation,
            media_type: data.data.media_type,
            hdurl: data.data.hdurl,
            url: data.data.url,
        } as IPhotoOfDay;
    } catch (error) {
        console.error('Error fetching photo of the day:', error);
        throw error;
    }
}
