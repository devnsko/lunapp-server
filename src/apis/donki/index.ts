import axios from 'axios';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const _key = process.env.NASA_API_KEY || 'DEMO_KEY';
const __datapath = process.env.DATA_PATH || 'data'; // Path to store data
const __donkipath = path.join(__datapath, 'Donki'); // Path to store DONKI data

const base_url = 'https://api.nasa.gov/DONKI';

function isValidDateFormat(date: string): boolean {
    // Regular expression to match YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
        return false;
    }

    // Parse the date and check if it is valid
    const parsedDate = new Date(date);
    const [year, month, day] = date.split('-').map(Number);
    
    // Check if the parsed date components match the input components
    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() + 1 !== month || // getMonth() returns month index starting from 0
        parsedDate.getDate() !== day
    ) {
        return false;
    }

    return true;
}

async function ValidateDates(start_date: string, end_date: string){
    if (!start_date) {
        let start = new Date();
        start.setDate(start.getDate() - 7);
        start_date = start.toISOString().split('T')[0];
    }
    if (!end_date) {
        let end = new Date();
        end_date = end.toISOString().split('T')[0];
    }
    if (!isValidDateFormat(start_date) || !isValidDateFormat(end_date)) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
    }
    return [start_date, end_date];
}


async function GetCME(start_date: string, end_date: string): Promise<string> { 
    const folder = path.join(__donkipath, 'CME');
    const filename = `CME_${start_date}_${end_date}.json`;   
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/CME?start_date=${start_date}&end_date=${end_date}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}


// startDate: default 30 days prior to current UTC time
// endDate: default to current UTC time
// mostAccurateOnly: default is set to true
// completeEntryOnly: default is set to true
// speed (lower limit): default is set to 0
// halfAngle (lower limit): default is set to 0
// catalog: default is set to ALL (choices: ALL, SWRC_CATALOG, JANG_ET_AL_CATALOG)
// keyword: default is set to NONE (example choices: swpc_annex)

async function GetCMEAnalysis(
    startDate: string = '', //
    endDate: string = '',
    mostAccurateOnly: boolean = true,
    completeEntryOnly: boolean = true,
    speed: number = 0, 
    halfAngle: number = 0,
    catalog: string = 'ALL',
    keyword: string = 'NONE'
): Promise<string> {
    const folder = path.join(__donkipath, 'CMEAnalysis');
    const filename = 'CMEAnalysis.json';   
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/CMEAnalysis?startDate=${startDate}&endDate=${endDate}&mostAccurateOnly=${mostAccurateOnly}&completeEntryOnly=${completeEntryOnly}&speed=${speed}&halfAngle=${halfAngle}&catalog=${catalog}&keyword=${keyword}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

//Geomagnetic Storm (GST)
// startDate: default to 30 days prior to current UTC date
// endDate: default to current UTC date
async function GetGST(startDate: string = '', endDate: string = ''): Promise<string> {
    const folder = path.join(__donkipath, 'GST');
    const filename = `GST_${startDate}_${endDate}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/GST?startDate=${startDate}&endDate=${endDate}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

// Interplanetary Shock (IPS)
// startDate: default to 30 days prior to current UTC date
// endDate: default to current UTC date
// location: default to ALL (choices: Earth, MESSENGER, STEREO A, STEREO B)
// catalog: default to ALL (choices: SWRC_CATALOG, WINSLOW_MESSENGER_ICME_CATALOG)
async function GetIPS(
    startDate: string = '', 
    endDate: string = '',
    location: string = 'ALL',
    catalog: string = 'ALL'
): Promise<string> {
    const folder = path.join(__donkipath, 'IPS');
    const filename = `IPS_${startDate}_${endDate}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/IPS?startDate=${startDate}&endDate=${endDate}&location=${location}&catalog=${catalog}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

// Solar Flare (FLR)
// startDate: default to 30 days prior to current UTC date
// endDate: default to current UTC date
async function GetFLR(startDate: string = '', endDate: string = ''): Promise<string> {
    const folder = path.join(__donkipath, 'FLR');
    const filename = `FLR_${startDate}_${endDate}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

// Solar Energetic Particle (SEP)
// startDate: default to 30 days prior to current UTC date
// endDate: default to current UTC date
async function GetSEP(startDate: string = '', endDate: string = ''): Promise<string> {
    const folder = path.join(__donkipath, 'SEP');
    const filename = `SEP_${startDate}_${endDate}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/SEP?startDate=${startDate}&endDate=${endDate}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

// Magnetopause Crossing (MPC)
// startDate: default to 30 days prior to current UTC date
// endDate: default to current UTC date
async function GetMPC(startDate: string = '', endDate: string = ''): Promise<string> {
    const folder = path.join(__donkipath, 'MPC');
    const filename = `MPC_${startDate}_${endDate}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/MPC?startDate=${startDate}&endDate=${endDate}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

// Radiation Belt Enhancement (RBE)
// startDate: default to 30 days prior to current UTC date
// endDate: default to current UTC date
async function GetRBE(startDate: string = '', endDate: string = ''): Promise<string> {
    const folder = path.join(__donkipath, 'RBE');
    const filename = `RBE_${startDate}_${endDate}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/RBE?startDate=${startDate}&endDate=${endDate}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

// Hight Speed Stream (HSS)
// startDate: default to 30 days prior to current UTC date
// endDate: default to current UTC date
async function GetHSS(startDate: string = '', endDate: string = ''): Promise<string> {
    const folder = path.join(__donkipath, 'HSS');
    const filename = `HSS_${startDate}_${endDate}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/HSS?startDate=${startDate}&endDate=${endDate}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

// WSA+EnlilSimulation
// startDate: default to 7 days prior to current UTC date
// endDate: default to current UTC date
async function GetWSAEnlilSimulation(startDate: string = '', endDate: string = ''): Promise<string> {
    const folder = path.join(__donkipath, 'WSAEnlilSimulation');
    const filename = `WSAEnlilSimulation_${startDate}_${endDate}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/WSAEnlilSimulations?startDate=${startDate}&endDate=${endDate}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}

// Notifications
// 'startDate' and 'endDate' are in format 'yyyy-MM-dd' UT
// 'type' could be: all, FLR, SEP, CME, IPS, MPC, GST, RBE, report
// 'startDate' if left out would default to 7 days prior to the current UT date
// 'endDate' if left out would default to current UT date
// 'type' if left out would default to 'all'
async function GetNotifications(start_date: string = '', end_date: string = '', type: string = 'all'): Promise<string> {
    const folder = path.join(__donkipath, 'Notifications');
    const filename = `Notifications_${start_date}_${end_date}_${type}.json`;
    if (await exists(path.join(folder, filename))) {
        const file = await readFile(path.join(folder, filename), { encoding: 'utf-8' });
        return file;
    }
    
    const url = `${base_url}/notifications?startDate=${start_date}&endDate=${end_date}&type=${type}&api_key=${_key}`;
    const data = await axios.get(url);
    
    //create folder if not exists
    if (!(await exists(path.join(folder)))) {
        if (!(await exists(path.join(__donkipath)))) {
            await mkdir(path.join(__donkipath));
        }
        await mkdir(path.join(folder));
    }
    const jsonData = JSON.stringify(data.data, null, 4);
    await writeFile(path.join(folder, filename), jsonData, { encoding: 'utf-8' });
    return jsonData;
}


// Exports
export {
    GetCME,
    GetCMEAnalysis,
    GetGST,
    GetIPS,
    GetFLR,
    GetSEP,
    GetMPC,
    GetRBE,
    GetHSS,
    GetWSAEnlilSimulation,
    ValidateDates,
    GetNotifications
};