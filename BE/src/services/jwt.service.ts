import jwt from "jsonwebtoken";

import { env } from "../config/env";

class JwtService {
  generate(
    payload: Record<string, any>,
    days = 7,
  ): string {
    return jwt.sign(
      payload,
      env.JWT_SECRET,
      {
        expiresIn: `${days}d` as any,
      }
    );
  }

  verify(token: string) {
    return jwt.verify(
      token,
      env.JWT_SECRET
    );
  }
}

export default new JwtService();
