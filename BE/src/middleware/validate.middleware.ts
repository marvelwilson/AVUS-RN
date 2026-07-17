import { Request, Response, NextFunction } from "express";

export function validateRequest(schema: any) {

    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        /**
         * Zod schema
         */
        if (schema && typeof schema.safeParse === "function") {

            const result = schema.safeParse({

                body: req.body,

                params: req.params,

                query: req.query,

            });

            if (!result.success) {

                return res.status(400).json({

                    success: false,

                    message: "Validation failed.",

                    errors: result.error.flatten(),

                });

            }

            req.body = result.data.body ?? req.body;
            req.params = result.data.params ?? req.params;
            return next();

        }

        /**
         * Legacy function validator
         */
        if (typeof schema === "function") {

            const validation = schema(req.body);

            if (validation?.error) {

                return res.status(400).json({

                    success: false,

                    message: validation.error.message,

                    details: validation.error.details,

                });

            }

            return next();

        }

        return res.status(500).json({

            success: false,

            message: "Invalid validation schema.",

        });

    };

}

export default validateRequest;