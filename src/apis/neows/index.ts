import axios from 'axios';
import fs from 'fs';
import path from 'path';
import config from '../../config';
import util from 'util';

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const _key = config.nasa_api_key || 'DEMO_KEY';
const __datapath = config.data || 'data'; // Path to store data
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

// calculate the closest object to earth
async function GetClosestObject(objects: any): Promise<any> {
    let closestObject = null;
    let closestDistance = Infinity;
    let i = 0;
    for (const entry of objects) {
        for (const date in entry) {
            for (const asteroid of entry[date]) {
                
                const missDistanceKm = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers);
                if (missDistanceKm < closestDistance) {
                    closestDistance = missDistanceKm;
                    closestObject = asteroid;
                }
            }
        }
    }
    
    return {
        closestObject
    };
};

export async function NearEarthObject(start_date: string = '', end_date: string = ''): Promise<string> {
    [start_date, end_date] = await ValidateDates(start_date, end_date);
    const res = await GetFeed(start_date, end_date);

    const near = await GetClosestObject(res);

    return near;
}


export async function NearEarthObjectLookUp(asteroid_id: string): Promise<string> {
    const res = await GetLookUp(asteroid_id);
    return res;
}

export async function NearEarthObjectBrowse(): Promise<string> {
    const res = await GetBrowse();
    return res;
}

export async function NearEarthObjectOfYear(year: string): Promise<any> {
    // let closestObjectKilometers: number = -1;
    let closestObject
    try {
        if(year.length !== 4 || isNaN(Number(year)) || Number(year) < 1950 || Number(year) > 2023){
            return 'Invalid year. Please enter a year between 1950 and 2023.';
        }
        const filename = path.join(__neopath, `NEO_year_${year}.json`);

        if (await exists(filename)) {
            const file = await readFile(filename, { encoding: 'utf-8' });
            
            const objects = JSON.parse(file);
            //check objects on the closest one by date>close_approach_data>miss_distance>kilometers
            closestObject = await GetClosestObject(objects);

            // closestObjectKilometers = closestObject.closestObject.close_approach_data[0].miss_distance.kilometers;
        } else {

            const days = days_of_a_year(Number(year));
            let objects = [];
            let start_date = new Date(`${year}-01-01`);
            //cycle for all days by step of 7
            for (let i = 0; i < days; i += 7) {
                const end_date = new Date(start_date);
                end_date.setDate(start_date.getDate() + 6);

                const parsed_start_date = start_date.toISOString().split('T')[0];
                let parsed_end_date = end_date.toISOString().split('T')[0];
                if (end_date.getFullYear() > Number(year)) {
                    parsed_end_date = `${year}-12-31`;
                }
                
                const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${parsed_start_date}&end_date=${parsed_end_date}&api_key=${_key}`;
                const data = await axios.get(url);
                
                console.log([url, start_date, end_date, `${i}/${days}`]);
                objects.push({...data.data.near_earth_objects});
                start_date.setDate(start_date.getDate() + 7);
            }
            await writeFile(filename, JSON.stringify(objects, null, 4), { encoding: 'utf-8' });

            //check objects on the closest one by date>close_approach_data>miss_distance>kilometers
            closestObject = await GetClosestObject(objects);
            
            //save the closest object to the test-data.json file
            const readRaw = await readFile('src/apis/neows/test-data.json', { encoding: 'utf-8' });
            let testData = JSON.parse(readRaw);
            testData[year] = +closestObject.closestObject.close_approach_data[0].miss_distance.kilometers;
            await writeFile(`src/apis/neows/test-data.json`, JSON.stringify(testData, null, 4), { encoding: 'utf-8' });
        }
    } catch (error) {
        console.log(year, error);
    }
    // return +closestObjectKilometers;
    return closestObject;
}

// Define a JavaScript function called days_of_a_year with parameter year
function days_of_a_year(year: number): number {
   // Return 366 if the given year is a leap year, otherwise return 365
  return isLeapYear(year) ? 366 : 365;
}

// Define a JavaScript function called isLeapYear with parameter year
function isLeapYear(year: number): boolean {
    // Return true if the given year is divisible by 400 or divisible by 4 but not divisible by 100
     return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}