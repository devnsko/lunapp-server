import { dbQuery } from "../database";
import { UserData, UserModel } from "../schemas";

async function getOne(email: string): Promise<UserModel> {
    const query = `
        SELECT * FROM users WHERE email = $1;
    `;
    const result = await dbQuery(query, [email]);
    return result[0] as UserModel;
}

async function getOneByActivationLink(activationlink: string): Promise<UserModel> {
    const query = `
        SELECT * FROM users WHERE activationlink = $1;
    `;
    const result = await dbQuery(query, [activationlink]);
    return result[0] as UserModel;
}

async function updateIsactivated(userId: number, isactivated: boolean): Promise<UserModel> {
    const query = `
        UPDATE users SET isactivated = $2 WHERE id = $1 RETURNING *;
    `;
    const result = await dbQuery(query, [userId, isactivated]);
    return result[0] as UserModel;
}


async function create(object: UserData): Promise<UserModel> {
    const query = `
        INSERT INTO users (email, password, activationlink) VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await dbQuery(query, [object.email, object.password, object.activationlink]);
    return result[0] as UserModel;
}

export default { getOne, getOneByActivationLink, updateIsactivated, create }