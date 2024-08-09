import userDB from "./database/requests/userRequest";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { UserData, UserModel } from "./database/schemas";
import tokenService from "./token-service";
import { UserDto } from "../dtos/userDto";
import ApiError from "../exceptions/api-error";
import mailService from "./mail-service";

class UserService {
    async registration(email: string, password: string) {
        const candidate = await userDB.getOne(email);
        if (candidate) {
            throw ApiError.BadRequestError(`User with email ${email} already exists`);
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const activationlink = uuidv4();
        const user: UserModel = await userDB.create({ email, password: hashPassword, isactivated: false, activationlink} as UserData);
        await mailService.sendMail(email, `${process.env.API_URL}/auth/activate/${activationlink}`);

        const userDto: UserDto = new UserDto({...user});
        const token = tokenService.generateTokens({ userId: userDto.id });
        await tokenService.saveToken(userDto.id, token.refreshToken);

        return {...token, user: userDto};
    }

    async activate(activationLink: string) {
        const user = await userDB.getOneByActivationLink(activationLink);
        if (!user) {
            throw ApiError.BadRequestError('Incorrect activation link');
        }
        await userDB.updateIsactivated(user.id, true);
    }

    async login(email: string, password: string) {
        const user: UserModel = await userDB.getOne(email);
        if (!user) {
            throw ApiError.BadRequestError('User with this email does not exist');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequestError('Incorrect password');
        }
        const userDto: UserDto = new UserDto({...user});
        const token = tokenService.generateTokens({ userId: userDto.id });
        await tokenService.saveToken(userDto.id, token.refreshToken);

        return {...token, user: userDto};
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
}

export default new UserService();