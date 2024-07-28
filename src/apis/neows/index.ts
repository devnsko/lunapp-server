import axios from 'axios';
import fs from 'fs';
import path from 'path';
import util from 'util';
import INearEarthObject from '../../types/neo';

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const _key = process.env.NASA_API_KEY || 'DEMO_KEY';
const __datapath = process.env.DATA_PATH || 'data'; // Path to store data
const __neopath = path.join(__datapath, 'Neo'); // Path to store NEO data

const base_url = 'https://api.nasa.gov/neo/rest/v1';

function isValidDateFormat(date: string): boolean {
    // Regular expression to match YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
        return false;
    }

    // Parse the date and check if it is valid
    const parsedDate = new Date(date);
    const [year, month, day] = date.split('-').map(Number);
    
    // Check if the parsed date components match the input components
    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() + 1 !== month || // getMonth() returns month index starting from 0
        parsedDate.getDate() !== day
    ) {
        return false;
    }

    return true;
}

async function ValidateDates(start_date: string, end_date: string){
    if (!start_date) {
        let start = new Date();
        start.setDate(start.getDate() - 7);
        start_date = start.toISOString().split('T')[0];
    }
    if (!end_date) {
        let end = new Date();
        end_date = end.toISOString().split('T')[0];
    }
    if (!isValidDateFormat(start_date) || !isValidDateFormat(end_date)) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
    }
    return [start_date, end_date];
}
   

async function GetFeed(start_date: string, end_date: string): Promise<string> { 
    // const folder = path.join(__neopath, 'Feed');
    // const filename = `Feed_${start_date}_${end_date}.json`;   
    // if (await exists(path.join(folder, filename))) {
    //     const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
    //     return file;
    // }
    
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${_key}`;
    const data = await axios.get(url);
    
    // //create folder if not exists
    // if (!(await exists(path.join(folder)))) {
    //     if (!(await exists(path.join(__neopath)))) {
    //         await mkdir(path.join(__neopath));
    //     }
    //     await mkdir(path.join(folder));
    // }
    // await writeFile(path.join(folder, filename), JSON.stringify(jsonData, null, 4), { encoding: 'utf-8' });
    const jsonData = data.data;
    return jsonData;
}

async function GetLookUp(asteroid_id: string): Promise<string> {
    const folder = path.join(__neopath, 'LookUp');
    const filename = `Asteroid_${asteroid_id}.json`;
    if (await exists(path.join(folder ,filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `https://api.nasa.gov/neo/rest/v1/neo/${asteroid_id}?api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__neopath)))) {
            await mkdir(path.join(__neopath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

async function GetBrowse(): Promise<string> {
    const folder = path.join(__neopath, 'Browse');
    const filename = 'Browse.json';
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__neopath)))) {
            await mkdir(path.join(__neopath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;

}


export async function NearEarthObjectLookUp(asteroid_id: string): Promise<string> {
    const res = await GetLookUp(asteroid_id);
    return res;
}

export async function NearEarthObjectBrowse(): Promise<string> {
    const res = await GetBrowse();
    return res;
}

export async function fetchNEO(start_date: string, end_date: string): Promise<INearEarthObject[]> {
    const url = `${base_url}/feed?start_date=${start_date}&end_date=${end_date}&api_key=${_key}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
        throw new Error('Failed to fetch NEO data');
    }
    const objects: INearEarthObject[] = [];
    const week = response.data.near_earth_objects;
    try {
        for (const day in week) {
            if (Array.isArray(week[day])) {
                week[day].forEach((neo: INearEarthObject) => {
                    objects.push(neo);
                });
            } else {
                console.error(`Expected an array for day ${day}, but got`, week[day]);
            }
        }
        if (objects.length != response.data.element_count) {
            console.error('Failed to fetch all NEO data', {parsed: objects.length, responsed: response.data.element_count});
        }
        if (objects.length == 0) {
            throw new Error('FUCK!');
        }
    } catch (error) {
        console.error('[NO MISS]', JSON.stringify(week, null, 4));
    }
    return objects;
}
