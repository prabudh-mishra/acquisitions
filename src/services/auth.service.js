import bcrypt from "bcrypt";
import logger from "#config/logger.js";
import {db} from "#config/database.js";
import {users} from "#models/user.model.js";
import {eq} from "drizzle-orm";

export const hashPassword = async(password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        logger.error(`Error while hashing the password: ${e}`);
        throw new Error('Error Hashing Password');
    }
}

export const createUser = async ({ name, email, password, role = "user" }) => {
    try {
        const existingUser = db.select().from(users).where(eq(users.email, email)).limit(1)

        if (existingUser.length > 0) {
            throw new Error("User already exists");
        }

        const passwordHash = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({name, email, password: passwordHash, role})
            .returning({id: users.id, name: users.name, email: users.email, role: users.role, created_at: users.created_at});

        logger.info(`Successfully created user: ${newUser.id}`);

        return newUser;
    } catch (e) {
        logger.error(`Error while creating user: ${e}`);
        throw e
    }
}