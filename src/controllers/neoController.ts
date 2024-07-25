import { dbQuery } from "../database/database";
import INearEarthObject from "../types/neo";
import { NeoModel } from "../database/schemas";
import { Request, Response } from "express";
import * as apis from "../apis";

export async function NeoYear (req: Request, res: Response) {
    const { year } = req.query;
    const closestEarthObject = await apis.NearEarthObjectOfYear(year as string);
    res.json(closestEarthObject);
}

// // Function to insert near earth object into the database
// export async function insertNeo(neo: INearEarthObject): Promise<void> {
//     try {
//         // Insert the near earth object into the database
//         const query = `INSERT INTO neo 
//         (neo_id, name, nasa_jpl_url, absolute_magnitude_h, estimated_diameter_kilometers_min, estimated_diameter_kilometers_max, estimated_diameter_meters_min, estimated_diameter_meters_max, estimated_diameter_miles_min, estimated_diameter_miles_max, estimated_diameter_feet_min, estimated_diameter_feet_max, is_potentially_hazardous_asteroid, close_approach_date, close_approach_date_full, epoch_date_close_approach, relative_velocity_kilometers_per_second, relative_velocity_kilometers_per_hour, relative_velocity_miles_per_hour, miss_distance_astronomical, miss_distance_lunar, miss_distance_kilometers, miss_distance_miles, orbital_data, is_sentry_object) 
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24);`;
//         const Model = await convertToNeoModel(neo);
//         const values = [
//             Model.neo_id,
//             Model.name,
//             Model.nasa_jpl_url,
//             Model.absolute_magnitude_h,
//             Model.estimated_diameter_kilometers_min,
//             Model.estimated_diameter_kilometers_max,
//             Model.estimated_diameter_meters_min,
//             Model.estimated_diameter_meters_max,
//             Model.estimated_diameter_miles_min,
//             Model.estimated_diameter_miles_max,
//             Model.estimated_diameter_feet_min,
//             Model.estimated_diameter_feet_max,
//             Model.is_potentially_hazardous_asteroid,
//             Model.close_approach_date,
//             Model.close_approach_date_full,
//             Model.epoch_date_close_approach,
//             Model.relative_velocity_kilometers_per_second,
//             Model.relative_velocity_kilometers_per_hour,
//             Model.relative_velocity_miles_per_hour,
//             Model.miss_distance_astronomical,
//             Model.miss_distance_lunar,
//             Model.miss_distance_kilometers,
//             Model.miss_distance_miles,
//             Model.orbital_data,
//             Model.is_sentry_object
//         ]
//         await dbQuery(query, values);

//         console.log('Near Earth Object inserted successfully!');
//     } catch (error) {
//         console.error('Error inserting near earth object:', error);
//     }
// }

// export async function convertToNeoModel(neo: INearEarthObject): Promise<NeoModel> {
//     return {
//         neo_id: neo.neo_id,
//         name: neo.name,
//         nasa_jpl_url: neo.nasa_jpl_url,
//         absolute_magnitude_h: neo.absolute_magnitude_h,
//         estimated_diameter_kilometers_min: neo.estimated_diameter.kilometers.estimated_diameter_min,
//         estimated_diameter_kilometers_max: neo.estimated_diameter.kilometers.estimated_diameter_max,
//         estimated_diameter_meters_min: neo.estimated_diameter.meters.estimated_diameter_min,
//         estimated_diameter_meters_max: neo.estimated_diameter.meters.estimated_diameter_max,
//         estimated_diameter_miles_min: neo.estimated_diameter.miles.estimated_diameter_min,
//         estimated_diameter_miles_max: neo.estimated_diameter.miles.estimated_diameter_max,
//         estimated_diameter_feet_min: neo.estimated_diameter.feet.estimated_diameter_min,
//         estimated_diameter_feet_max: neo.estimated_diameter.feet.estimated_diameter_max,
//         is_potentially_hazardous_asteroid: neo.is_potentially_hazardous_asteroid,
//         close_approach_date: neo.close_approach_data[0].close_approach_date,
//         close_approach_date_full: neo.close_approach_data[0].close_approach_date_full,
//         epoch_date_close_approach: neo.close_approach_data[0].epoch_date_close_approach,
//         relative_velocity_kilometers_per_second: neo.close_approach_data[0].relative_velocity.kilometers_per_second,
//         relative_velocity_kilometers_per_hour: neo.close_approach_data[0].relative_velocity.kilometers_per_hour,
//         relative_velocity_miles_per_hour: neo.close_approach_data[0].relative_velocity.miles_per_hour,
//         miss_distance_astronomical: neo.close_approach_data[0].miss_distance.astronomical,
//         miss_distance_lunar: neo.close_approach_data[0].miss_distance.lunar,
//         miss_distance_kilometers: neo.close_approach_data[0].miss_distance.kilometers,
//         miss_distance_miles: neo.close_approach_data[0].miss_distance.miles,
//         orbital_data: neo.close_approach_data[0].orbiting_body,
//         is_sentry_object: neo.is_sentry_object
//     } as NeoModel;
// }
