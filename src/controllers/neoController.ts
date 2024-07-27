import { Request, Response } from "express";
import neoDB from "../services/database/requests/neoRequest";
import { NeoModel, NeoData } from "../services/database/schemas";
import { fetchNEO } from "../apis/neows";
import { connectRedis, disconnectRedis } from "../services/redis/redisClient";

export async function NeoClosest (req: Request, res: Response) {
    try {
        
        let { year } = req.query;
        if (!year) {
            year = new Date().getFullYear().toString();
        }

        // Redis connection
        const redis = await connectRedis();

        // Check if the data is in the cache
        const cacheKey = `neo:${year}`;
        const cachedData = await redis.get(cacheKey);
        let closestEarthObject: NeoModel | null = await JSON.parse(cachedData as string);

        if(!closestEarthObject) {
            // DB 
            closestEarthObject = await neoDB.selectClosestByYear(year as string);

            if (!closestEarthObject) {
                // Fetch from API
                const today = new Date();
                
                let start_date = new Date(`${year}-01-01`);
                const begin_date = new Date(start_date);
                let end_date = new Date(start_date);
                
                let objects: NeoData[] = [];
                
                const days = days_of_a_year(Number(year));
                let i = 0;
                //cycle for all days by step of 7
                while (i < days) {
                    i += 7;
                    end_date = new Date(start_date);
                    end_date.setDate(start_date.getDate() + 6);
            
                    if (end_date > today) {
                        if (start_date > today) {
                            break;
                        }else {
                            end_date.setDate(today.getDate());
                            i = days;
                        }
                    }
                    
                    const parsed_start_date = start_date.toISOString().split('T')[0];
                    let parsed_end_date = end_date.toISOString().split('T')[0];
                    if (end_date.getFullYear() > Number(year)) {
                        parsed_end_date = `${year}-12-31`;
                    }
                    
                    const fetchData = await fetchNEO(parsed_start_date, parsed_end_date);
                    
                    console.log([fetchData.length, start_date, end_date, `${i}/${days}`]);
                    fetchData.forEach((neo) => {
                        //convert neo to NeoModel
                        const obj = {
                            neo_id: neo.neo_reference_id,
                            name: neo.name,
                            nasa_jpl_url: neo.nasa_jpl_url,
                            absolute_magnitude_h: neo.absolute_magnitude_h,
                            estimated_diameter_kilometers_min: neo.estimated_diameter.kilometers.estimated_diameter_min,
                            estimated_diameter_kilometers_max: neo.estimated_diameter.kilometers.estimated_diameter_max,
                            estimated_diameter_meters_min: neo.estimated_diameter.meters.estimated_diameter_min,
                            estimated_diameter_meters_max: neo.estimated_diameter.meters.estimated_diameter_max,
                            estimated_diameter_miles_min: neo.estimated_diameter.miles.estimated_diameter_min,
                            estimated_diameter_miles_max: neo.estimated_diameter.miles.estimated_diameter_max,
                            estimated_diameter_feet_min: neo.estimated_diameter.feet.estimated_diameter_min,
                            estimated_diameter_feet_max: neo.estimated_diameter.feet.estimated_diameter_max,
                            is_potentially_hazardous_asteroid: neo.is_potentially_hazardous_asteroid,
                            close_approach_date: neo.close_approach_data[0].close_approach_date,
                            close_approach_date_full: neo.close_approach_data[0].close_approach_date_full,
                            epoch_date_close_approach: neo.close_approach_data[0].epoch_date_close_approach,
                            relative_velocity_kilometers_per_second: neo.close_approach_data[0].relative_velocity.kilometers_per_second,
                            relative_velocity_kilometers_per_hour: neo.close_approach_data[0].relative_velocity.kilometers_per_hour,
                            relative_velocity_miles_per_hour: neo.close_approach_data[0].relative_velocity.miles_per_hour,
                            miss_distance_astronomical: neo.close_approach_data[0].miss_distance.astronomical,
                            miss_distance_lunar: neo.close_approach_data[0].miss_distance.lunar,
                            miss_distance_kilometers: neo.close_approach_data[0].miss_distance.kilometers,
                            miss_distance_miles: neo.close_approach_data[0].miss_distance.miles,
                            orbital_data: neo.close_approach_data[0].orbiting_body,
                            is_sentry_object: neo.is_sentry_object
                        } as NeoData;

                        objects.push({...obj});
                    });
            
                    start_date.setDate(start_date.getDate() + 7);
                }

                // //insert objects into db by chunks
                // let chunk = 100;
                // let j = 0;
                // while (i < objects.length) {
                //     await neoDB.insert(...objects.slice(i, i + chunk));
                //     j += chunk;
                // }
                let dbObjects: NeoModel[] = [];
                objects.forEach(async (neo) => {
                    dbObjects.push(await neoDB.insert(neo));
                });
            
                closestEarthObject = await neoDB.selectClosestByYear(year as string);
                
                if (!closestEarthObject) {
                    throw new Error('Wrong');
                }
            }
            
            // Save to cache
            await redis.set(cacheKey, JSON.stringify(closestEarthObject), { EX: 60 * 60 * 24 }); 
        }
        
        res.json(closestEarthObject);
    } catch (error) {
        console.error('🚨 [NeoController]: Error getting closest near earth object: 🚨', error);
        res.status(500).json({ error: (error as Error).message });
    }
}

// calculate the closest object to earth
async function GetClosestObject(objects: NeoModel[]): Promise<NeoModel> {
    let closestObject: NeoModel = objects[0];
    let closestDistance = Infinity;
    let i = 0;
    for (const asteroid of objects) {
        const missDistanceKm = parseFloat(asteroid.data.miss_distance_kilometers);
        if (missDistanceKm < closestDistance) {
            closestDistance = missDistanceKm;
            closestObject = asteroid;
        }
    }
    
    return closestObject;
};

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