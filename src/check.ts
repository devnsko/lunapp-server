import { writeFile } from "fs";
import { readFile } from "fs/promises";

interface NeoData {
    [date: string]: any;
}

export default async function check() {
    const data = await readFile('data/Neo/NEO_year_2022.json', { encoding: 'utf-8' });
    
    // Step 2: Parse the JSON data
    const jsonData: NeoData[] = JSON.parse(data);

    // Step 3: Extract the dates
    const dates = jsonData.map(entry => Object.keys(entry).map(date => date)).flat();

    // Step 4: Count the unique dates
    const uniqueDates = new Set(dates);
    console.log('Unique dates count:', uniqueDates.size);
    console.log('Total dates count:', dates.length);
    for (const date of dates) {
        console.log(date);
    }
};
