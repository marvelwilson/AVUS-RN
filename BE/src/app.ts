import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";


import router from "./routes";

const app: Application = express();

/**
 * Security
 */
app.use(helmet());

/**
 * CORS
 */
app.use(
    cors({
        origin: "*", // Restrict in production
        credentials: true,
    })
);

/**
 * Parsers
 */
app.use(express.json({
    verify: (req, _res, buffer) => {
        (req as express.Request & { rawBody?: Buffer }).rawBody = Buffer.from(buffer);
    },
}));
app.use(express.urlencoded({ extended: true }));

/**
 * Performance
 */
app.use(compression());

/**
 * Logging
 */
app.use(morgan("dev"));

/**
 * Health Check
 */
app.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        message: "AVUS API is running.",
        timestamp: new Date().toISOString(),
    });
});

app.get("/gamefi", (_, res) => {
    res.type("html").send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AVUS GameFi</title></head>
<body><main><h1>AVUS GameFi</h1><p>Play, earn and use your AVUS wallet.</p><strong>Coming soon</strong></main></body></html>`);
});

/**
 * API Routes
 */
app.use("/api/v1", router);

/**
 * 404 Handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found.`,
    });
});

export default app;
