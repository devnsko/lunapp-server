import axios from 'axios';
import INearEarthObject from '../../types/neo';

const _key = process.env.NASA_API_KEY || 'DEMO_KEY';

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

export async function fetcLookUp(asteroid_id: string): Promise<string> {
    const url = `${base_url}/neo/${asteroid_id}?api_key=${_key}`;
    const data = await axios.get(url);
    
    const jsonData = JSON.stringify(data.data, null, 4);
    return jsonData;
}

export async function fetcBrowse(): Promise<string> {    
    const url = `${base_url}/neo/browse?api_key=${_key}`;
    const data = await axios.get(url);
    
    const jsonData = JSON.stringify(data.data, null, 4);
    return jsonData;
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