import type { FanIntentType } from "./intent";

export interface FanResponse {

    /**
     * AI explanation
     */
    message: string;

    /**
     * Detected intent
     */
    intent: FanIntentType;

    /**
     * Confidence
     */
    confidence: number;

    /**
     * Extracted parameters
     */
    arguments: Record<string, unknown>;

    /**
     * Suggested follow-up questions
     */
    followUps?: string[];

}