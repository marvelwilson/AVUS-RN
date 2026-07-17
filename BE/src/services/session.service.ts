import Session from "../models/session.model";
import { v4 as uuidv4 } from "uuid";
class SessionService {
    async create(userId: string, days = 7) {
        const session = await Session.create({
            user: userId,
            sessionId: uuidv4(),
            expiresAt: new Date(
                Date.now() + days * 24 * 60 * 60 * 1000
            ),
        });

        return session;
    }


    async revoke(sessionId: string) {
        return Session.findOneAndUpdate(
            {
                sessionId,
            },
            {
                revokedAt: new Date(),
            }
        );
    }

    async get(sessionId: string) {
        return Session.findOne({
            sessionId,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        }).populate("user");
    }

    async extend(sessionId: string, days: number) {
        return Session.findOneAndUpdate(
            { sessionId, revokedAt: null },
            { expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000) },
            { new: true },
        );
    }
}

export default new SessionService();
