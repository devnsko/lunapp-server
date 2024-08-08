import { dbQuery } from "./database";

// Interfaces for the photo of the day based on the table schema
export interface ApodData {
    title: string;
    date: string;
    explanation: string;
    media_type: string;
    hdurl?: string; // Optional
    url: string;
} 

export interface ApodModel {
    id: number;
    data: ApodData;
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
            hdurl TEXT,
            url TEXT NOT NULL,
            CONSTRAINT date_unique UNIQUE (date),
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await dbQuery(query);
    console.log('🛰️  [Database] \'Photo of the day\' table created successfully!');
}

// Interfaces for the Near Earth Object based on the table schema

export interface NeoData {
    neo_id: string;
    name: string;
    nasa_jpl_url: string;
    absolute_magnitude_h?: number;
    estimated_diameter_kilometers_min?: number;
    estimated_diameter_kilometers_max?: number;
    estimated_diameter_meters_min?: number;
    estimated_diameter_meters_max?: number;
    estimated_diameter_miles_min?: number;
    estimated_diameter_miles_max?: number;
    estimated_diameter_feet_min?: number;
    estimated_diameter_feet_max?: number;
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

export interface NeoModel {
    id: number;
    data: NeoData;
}

// Function to create a 'Neo' table in the database if it does not exist
export async function creatNeoTable(): Promise<void> {
    const query = `
        CREATE TABLE IF NOT EXISTS neo (
            id SERIAL PRIMARY KEY,
            neo_id TEXT NOT NULL,
            name TEXT NOT NULL,
            nasa_jpl_url TEXT NOT NULL,
            absolute_magnitude_h REAL,
            estimated_diameter_kilometers_min REAL,
            estimated_diameter_kilometers_max REAL,
            estimated_diameter_meters_min REAL,
            estimated_diameter_meters_max REAL,
            estimated_diameter_miles_min REAL,
            estimated_diameter_miles_max REAL,
            estimated_diameter_feet_min REAL,
            estimated_diameter_feet_max REAL,
            is_potentially_hazardous_asteroid BOOLEAN NOT NULL,
            close_approach_date TEXT NOT NULL,
            close_approach_date_full TEXT NOT NULL,
            epoch_date_close_approach BIGINT NOT NULL,
            relative_velocity_kilometers_per_second TEXT NOT NULL,
            relative_velocity_kilometers_per_hour TEXT NOT NULL,
            relative_velocity_miles_per_hour TEXT NOT NULL,
            miss_distance_astronomical TEXT NOT NULL,
            miss_distance_lunar TEXT NOT NULL,
            miss_distance_kilometers TEXT NOT NULL,
            miss_distance_miles TEXT NOT NULL,
            orbital_data TEXT NOT NULL,
            is_sentry_object BOOLEAN NOT NULL,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE neo ALTER COLUMN absolute_magnitude_h DROP NOT NULL;
        ALTER TABLE neo ALTER COLUMN estimated_diameter_kilometers_min DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_kilometers_max DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_meters_min DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_meters_max DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_miles_min DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_miles_max DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_feet_min DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_feet_max DROP NOT NULL;ALTER TABLE neo ALTER COLUMN estimated_diameter_kilometers_min DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_kilometers_max DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_meters_min DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_meters_max DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_miles_min DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_miles_max DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_feet_min DROP NOT NULL; ALTER TABLE neo ALTER COLUMN estimated_diameter_feet_max DROP NOT NULL;  
    `;
    await dbQuery(query);
    console.log('🛰️  [Database] \'Neo\' table created successfully!');
}

export interface UserInput {
    email: string;
    password: string;
}

export interface UserData {
    name?: string;
    email: string;
    password: string;
    isactivated: boolean;
    activationlink: string;
}

// Interface for user data after it's saved to the database (with ID)
export interface UserModel extends UserData {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export async function createUserTable(): Promise<void> {
    const query = `
        DROP TABLE IF EXISTS users CASCADE;
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            isactivated BOOLEAN DEFAULT FALSE,
            activationlink TEXT NOT NULL,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await dbQuery(query);
    console.log('🛰️  [Database] \'Users\' table created successfully!');
}

export interface TokenData {
    userId: number;
    refreshToken: string;
}

export async function createTokenTable(): Promise<void> {
    const query = `
        DROP TABLE IF EXISTS tokens CASCADE;
        CREATE TABLE IF NOT EXISTS tokens (
            userId INT PRIMARY KEY NOT NULL,
            refreshToken TEXT NOT NULL,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
        );
    `;
    await dbQuery(query);
    console.log('🛰️  [Database] \'Tokens\' table created successfully!');
}