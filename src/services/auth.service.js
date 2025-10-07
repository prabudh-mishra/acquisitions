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

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        logger.error(`Error while comparing password: ${e}`);
        throw new Error('Error comparing password');
    }
}

export const authenticateUser = async ({ email, password }) => {
    try {
        const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!existingUser) {
            throw new Error("User not found");
        }

        const isPasswordValid = await comparePassword(password, existingUser.password);

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        logger.info(`User authenticated successfully: ${existingUser.id}`);

        // Return user without password
        const { password: _, ...userWithoutPassword } = existingUser;
        return userWithoutPassword;
    } catch (e) {
        logger.error(`Error while authenticating user: ${e}`);
        throw e;
    }
}

export const createUser = async ({ name, email, password, role = "user" }) => {
    try {
        const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existingUser) {
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