import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { findUserById } from "../repositories/userRepository.js";
import { AuthenticationError } from "../utils/errorTypes.js";

const extractToken = (req) => {
	const authHeader = req.headers.authorization;
	if (authHeader?.startsWith("Bearer ")) {
		return authHeader.substring(7);
	}
	return null;
};

export const authenticate = async (req, _res, next) => {
	try {
		const token = extractToken(req);
		if (!token) {
			throw new AuthenticationError();
		}

		const decoded = jwt.verify(token, env.jwt.secret);

		const user = await findUserById(decoded.sub);
		if (!user) {
			throw new AuthenticationError();
		}

		req.user = {
			id: user.id,
			role: user.role,
			name: user.name,
			email: user.email,
		};

		next();
	} catch (error) {
		if (error instanceof AuthenticationError) {
			next(error);
		} else {
			next(new AuthenticationError());
		}
	}
};
