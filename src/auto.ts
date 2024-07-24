import axios from "axios";
import { Request, Response } from "express";

export default async function generate(req: Request, res: Response) {
    
    for (let i = 1990; i < 2016; i++) {
        
        const data = await axios.get(`http://localhost:${process.env.PORT}/near?year=${i}`);
        console.log(`⚡️⚡️⚡️ year: ${i} parsed!`);
    }
    return res.json({ message: 'Auto generation complete' });
}