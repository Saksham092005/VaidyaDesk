import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { findUserByEmail, createUser } from "../repositories/userRepository.js";
import { AuthenticationError, ValidationError } from "../utils/errorTypes.js";

const SALT_ROUNDS = 10;

const buildToken = (user) => {
    const payload = {
        sub: user.id,
        role: user.role,
    };

    return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
};

export const register = async ({ name, email, password, role = "patient", practitionerId }) => {
    if (!name || !email || !password) {
        throw new ValidationError("Name, email, and password are required");
    }

    const existing = await findUserByEmail(email);
    if (existing) {
        throw new ValidationError("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await createUser({
        name,
        email,
        password: hashedPassword,
        role,
        practitionerId: practitionerId || null,
    });

    const token = buildToken(user);

    return {
        token,
        user: user.toSafeObject(),
    };
};

export const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new ValidationError("Email and password are required");
    }

    const user = await findUserByEmail(email);
    if (!user) {
        throw new AuthenticationError("Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw new AuthenticationError("Invalid credentials");
    }

    const token = buildToken(user);

    return {
        token,
        user: user.toSafeObject(),
    };
};
