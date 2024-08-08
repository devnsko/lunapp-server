import { Request, Response } from 'express';
import UserService from '../services/user-service';

export default {
    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const userData = await UserService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            console.log(e)
        }
    },
    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            console.log(e)
        }
    },
    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            console.log(e)
        }
    },
    async activate(req: Request, res: Response) {
        const activationLink = req.params.link;
        await UserService.activate(activationLink);
        return res.redirect('https://devnsko.com');
    },
    async refresh(req: Request, res: Response) {

    },
    async forgotPassword(req: Request, res: Response) {

    },
    async resetPassword(req: Request, res: Response) {

    },
    async getUser(req: Request, res: Response) {
    
    }
}