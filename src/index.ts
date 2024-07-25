import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import * as apis from './apis';

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
});

async function main() {
    // const today = new Date();
    // const weekAgo = new Date();
    // weekAgo.setDate(weekAgo.getDate() - 7);
    // const monthAgo = new Date();
    // monthAgo.setDate(monthAgo.getDate() - 30);
    //Random date for testing
    // const randomYear = Math.floor(Math.random() * (2024 - 1995 + 1)) + 1995;
    // const randomMonth = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
    // const randomDay = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
    // const date = `${randomYear}-${randomMonth}-${randomDay}`;
    // const photoUrl = await apis.photoOfDay(date);
    const photoUrl = await apis.photoOfDay();
    console.log(photoUrl);
    // await apis.NearEarthObject();
    // await apis.NearEarthObjectLookUp('3542519');
    // await apis.NearEarthObjectBrowse();
    // await apis.donki.GetCME(today.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetCMEAnalysis(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetGST(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetIPS(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetFLR(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetSEP(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetMPC(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetRBE(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetHSS(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetWSAEnlilSimulation(weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    // await apis.donki.GetNotifications(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
}

// main();

import('./app.js')