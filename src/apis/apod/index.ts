import axios from 'axios';
import fs from 'fs';
import path from 'path';
import config from '../../config';
import util from 'util';
import IPhotoOfDay from '../../types/photoOfDay';

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const _key = config.nasa_api_key || 'DEMO_KEY';
const __datapath = config.data || 'data';

export default async function photoOfDay(inputDate: string = ''): Promise<object> {
    try {
        let today = new Date();
        if (inputDate) {
            today = new Date(inputDate);
        }
        const date = today.toISOString().split('T')[0];
        if (await exists(path.join(__datapath, 'photoOfDay', `photoOfDay-${date}.json`))) {
            const file = await readFile(path.join(__datapath, 'photoOfDay', `photoOfDay-${date}.json`), { encoding: 'utf-8' });
            const data: IPhotoOfDay = JSON.parse(file);
            return ({
                title: data.title,
                date: data.date,
                explanation: data.explanation,
                media_type: data.media_type,
                hdurl: data.hdurl,
                url: data.url
            })
        }
        
        const url = `https://api.nasa.gov/planetary/apod?api_key=${_key}&date=${date}`;
        const res = await axios.get(url);

        const data: IPhotoOfDay = res.data;
        
        //create folder if not exists
        if (!(await exists(path.join(__datapath, 'photoOfDay')))) {
            await mkdir(path.join(__datapath, 'photoOfDay'));
        }
        const jsonData = JSON.stringify(data, null, 4);
        await writeFile(path.join(__datapath, 'photoOfDay', `photoOfDay-${date}.json`), jsonData, { encoding: 'utf-8' });
        return ({
            title: data.title,
            date: data.date,
            explanation: data.explanation,
            media_type: data.media_type,
            hdurl: data.hdurl,
            url: data.url
        });

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
