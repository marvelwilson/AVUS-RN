import User from "../models/user.model";

import magicService from "./magic.service";
import jwtService from "./jwt.service";
import sessionService from "./session.service";
import { emailToDisplayName } from "../utils/display-name";

class AuthService {
    /**
     * Login using Magic DID Token
     */
    async login(didToken: string, sessionDays = 1) {
        // Verify Magic DID Token
        const metadata = await magicService.verifyDidToken(didToken);
        const {
            issuer,
            email,
            publicAddress,
        } = metadata;

        // Find existing user
        let user = await User.findOne({
            issuer,
        });

        // Create new user
        if (!user) {
            user = await User.create({
                issuer: issuer ?? "N/A",
                email: email ?? "N/A",
                displayName: email
                    ? emailToDisplayName(email)
                    : "User",
                lastLoginAt: new Date(),
            });
        } else {
            user.lastLoginAt = new Date();

            if (!user.displayName && email) {
                user.displayName =
                    emailToDisplayName(email);
            }


            await user.save();
        }

        // Create Session
        const session = await sessionService.create(
            user.id,
            sessionDays,
        );

        // Generate JWT
        const accessToken = jwtService.generate({
            sub: user.id,
            sid: session.sessionId,
        }, sessionDays);

        return {
            user,
            session,
            accessToken,
            walletAddress: publicAddress,
        };
    }

    async updateSessionDuration(sessionId: string, userId: string, days: number) {
        const session = await sessionService.extend(sessionId, days);
        if (!session) throw new Error("Session not found.");
        return {
            accessToken: jwtService.generate({ sub: userId, sid: sessionId }, days),
            expiresAt: session.expiresAt,
        };
    }

    /**
     * Logout
     */
    async logout(sessionId: string) {
        await sessionService.revoke(sessionId);

        return true;
    }

    /**
     * Current User
     */
    async me(userId: string) {
        return User.findById(userId)
            .populate("wallet");
    }
}

export default new AuthService();
