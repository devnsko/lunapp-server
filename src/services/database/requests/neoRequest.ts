import { dbQuery } from "../database";
import { NeoData, NeoModel } from "../schemas";

export async function insert(object: NeoData): Promise<NeoModel> {
    try {
        // Insert the near earth object into the database
        const query = `INSERT INTO neo 
        (neo_id, name, nasa_jpl_url, absolute_magnitude_h, estimated_diameter_kilometers_min, estimated_diameter_kilometers_max, estimated_diameter_meters_min, estimated_diameter_meters_max, estimated_diameter_miles_min, estimated_diameter_miles_max, estimated_diameter_feet_min, estimated_diameter_feet_max, is_potentially_hazardous_asteroid, close_approach_date, close_approach_date_full, epoch_date_close_approach, relative_velocity_kilometers_per_second, relative_velocity_kilometers_per_hour, relative_velocity_miles_per_hour, miss_distance_astronomical, miss_distance_lunar, miss_distance_kilometers, miss_distance_miles, orbital_data, is_sentry_object) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) 
        RETURNING *;`;
        const values = [
            object.neo_id,
            object.name,
            object.nasa_jpl_url,
            object.absolute_magnitude_h,
            object.estimated_diameter_kilometers_min,
            object.estimated_diameter_kilometers_max,
            object.estimated_diameter_meters_min,
            object.estimated_diameter_meters_max,
            object.estimated_diameter_miles_min,
            object.estimated_diameter_miles_max,
            object.estimated_diameter_feet_min,
            object.estimated_diameter_feet_max,
            object.is_potentially_hazardous_asteroid,
            object.close_approach_date,
            object.close_approach_date_full,
            object.epoch_date_close_approach,
            object.relative_velocity_kilometers_per_second,
            object.relative_velocity_kilometers_per_hour,
            object.relative_velocity_miles_per_hour,
            object.miss_distance_astronomical,
            object.miss_distance_lunar,
            object.miss_distance_kilometers,
            object.miss_distance_miles,
            object.orbital_data,
            object.is_sentry_object
        ];
        const request = await dbQuery(query, values);
        if (request.length !== 1) {
            console.error('Error inserting near earth object', request);
            throw new Error('Error inserting near earth object');
        }
        return await request[0] as NeoModel;
    } catch (error) {
        console.error('🚨 [Database]: Error inserting near earth object: 🚨', error);
        throw error;        
    }
}

export async function selectClosestByYear(year: string): Promise<NeoModel | null> {
    try {
        // Query the database for the closest near earth object of the year
        const request = await dbQuery(`SELECT * FROM neo 
            WHERE EXTRACT(YEAR FROM to_date(close_approach_date, 'YYYY-MM-DD')) = $1
            ORDER BY miss_distance_lunar ASC
            LIMIT 1;`, [year]);

        if (request.length == 1) {
            return await request[0] as NeoModel;
        } else {
            return null;
        }
    } catch (error) {
        console.error('🚨 [Database]: Error getting closest near earth object: 🚨', error);
        throw error;
    }
}

export default { insert, selectClosestByYear };