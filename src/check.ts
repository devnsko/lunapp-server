import { writeFile } from "fs";
import { readFile } from "fs/promises";

interface NeoData {
    [date: string]: any;
}



export default async function check() {
    const data = await readFile('data/Neo/NEO_year_2000.json', { encoding: 'utf-8' });
    
    // Step 2: Parse the JSON data
    const jsonData: NeoData[] = JSON.parse(data);

    // Step 3: Extract the dates
    const dates = jsonData.map(date => {
        
    });
    // Step 4: Write the dates to a file
    writeFile('data/Neo/TEST.json', JSON.stringify(jsonData[0], null, 4), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully!');
        }
    });
    return { message: 'Check completed' };
};
