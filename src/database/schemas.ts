import { dbQuery } from "./database";

// Interface for the photo of the day based on the table schema
export interface PhotoOfDayModel {
    id: number;
    title: string;
    date: string;
    explanation: string;
    media_type: string;
    hdurl: string;
    url: string;
}

// Function to create a table in the database if it does not exist
export async function creatPhotoOfDayTable(): Promise<void> {
    const query = `
        CREATE TABLE IF NOT EXISTS photoofday (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            date DATE NOT NULL,
            explanation TEXT NOT NULL,
            media_type TEXT NOT NULL,
            hdurl TEXT NOT NULL,
            url TEXT NOT NULL
        );
    `;
    await dbQuery(query);
}

// Interface for the Near Earth Object based on the table schema
export interface NeoModel {
    id: number;
    neo_id: string;
    name: string;
    nasa_jpl_url: string;
    absolute_magnitude_h: number;
    estimated_diameter_kilometers_min: number;
    estimated_diameter_kilometers_max: number;
    estimated_diameter_meters_min: number;
    estimated_diameter_meters_max: number;
    estimated_diameter_miles_min: number;
    estimated_diameter_miles_max: number;
    estimated_diameter_feet_min: number;
    estimated_diameter_feet_max: number;
    is_potentially_hazardous_asteroid: boolean;
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity_kilometers_per_second: string;
    relative_velocity_kilometers_per_hour: string;
    relative_velocity_miles_per_hour: string;
    miss_distance_astronomical: string;
    miss_distance_lunar: string;
    miss_distance_kilometers: string;
    miss_distance_miles: string;
    orbital_data: string;
    is_sentry_object: boolean;
}

// Function to create a 'Neo' table in the database if it does not exist
export async function creatNeoTable(): Promise<void> {
    const query = `
        CREATE TABLE IF NOT EXISTS neo (
            id SERIAL PRIMARY KEY,
            neo_id TEXT NOT NULL,
            name TEXT NOT NULL,
            nasa_jpl_url TEXT NOT NULL,
            absolute_magnitude_h REAL NOT NULL,
            estimated_diameter_kilometers_min REAL NOT NULL,
            estimated_diameter_kilometers_max REAL NOT NULL,
            estimated_diameter_meters_min REAL NOT NULL,
            estimated_diameter_meters_max REAL NOT NULL,
            estimated_diameter_miles_min REAL NOT NULL,
            estimated_diameter_miles_max REAL NOT NULL,
            estimated_diameter_feet_min REAL NOT NULL,
            estimated_diameter_feet_max REAL NOT NULL,
            is_potentially_hazardous_asteroid BOOLEAN NOT NULL,
            close_approach_date TEXT NOT NULL,
            close_approach_date_full TEXT NOT NULL,
            epoch_date_close_approach INTEGER NOT NULL,
            relative_velocity_kilometers_per_second TEXT NOT NULL,
            relative_velocity_kilometers_per_hour TEXT NOT NULL,
            relative_velocity_miles_per_hour TEXT NOT NULL,
            miss_distance_astronomical TEXT NOT NULL,
            miss_distance_lunar TEXT NOT NULL,
            miss_distance_kilometers TEXT NOT NULL,
            miss_distance_miles TEXT NOT NULL,
            orbital_data TEXT NOT NULL,
            is_sentry_object BOOLEAN NOT NULL
        );
    `;
    await dbQuery(query);
}