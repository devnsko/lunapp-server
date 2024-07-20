import dotenv from 'dotenv';
dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    nasa_api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
    data: process.env.DATA || 'data',
};

export default config;