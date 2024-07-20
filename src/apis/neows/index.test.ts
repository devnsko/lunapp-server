import { readFile } from "fs/promises";
import { NearEarthObjectOfYear } from ".";
import { readFileSync } from "fs";

describe('NearEarthObjectOfYear', () => {
    // Read json file test-data.json
    let testData: any;

    // Load the test data before running the tests
    // beforeAll(async () => {
    //     try {
    //         const rawData = await readFile('src/apis/neows/test-data.json', { encoding: 'utf-8' });
    //         testData = await JSON.parse(rawData);
    //     } catch (error) {
    //         console.error('Failed to load test data:', error);
    //         throw error; // Ensure Jest fails if test data cannot be loaded
    //     }
    // });

    const rawData = readFileSync('src/apis/neows/test-data.json', { encoding: 'utf-8' });
    testData = JSON.parse(rawData);
    // Use test.each to define tests dynamically
    test.each(Object.entries(testData))(
        'check %s',
        async (key: string, value: any) => {
            const data = await NearEarthObjectOfYear(key);
            const valueToCheck = +data.closestObject.close_approach_data[0].miss_distance.kilometers;
            expect(valueToCheck).toEqual(value); // Use toEqual for deep equality check
            expect(data).toMatchSnapshot(); // Use toMatchSnapshot to compare against a snapshot
        }
    );
});
