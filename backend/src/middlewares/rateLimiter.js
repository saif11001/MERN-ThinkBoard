import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});