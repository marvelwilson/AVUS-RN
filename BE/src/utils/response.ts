import { Response } from "express";

export function success(res: Response, data: unknown, message = "Success") {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
}

export function error(res: Response, message = "Error", status = 500) {
    return res.status(status).json({
        success: false,
        message,
    });
}

export default {
    success,
    error,
};
