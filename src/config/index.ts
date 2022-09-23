export default () => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    JWT: {
        SECRET: process.env.JWT_SECRET || 'shhh',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
    },
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    GLOBAL_PREFIX: 'v1',
    STRIPE: {
        SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
        API_VERSION: process.env.STRIPE_API_VERSION || ''
    },
    GUESTY: {
        BOOKING_ENGINE_API_URL:
            `${process.env.GUESTY_BOOKING_ENGINE_URL}/api` || '',
        BOOKING_ENGINE_AUTH_URL:
            `${process.env.GUESTY_BOOKING_ENGINE_URL}/oauth2/token` || '',
        BOOKING_ENGINE_CLIENT_ID:
            process.env.GUESTY_BOOKING_ENGINE_CLIENT_ID || '',
        BOOKING_ENGINE_CLIENT_SECRET:
            process.env.GUESTY_BOOKING_ENGINE_CLIENT_SECRET || '',
        OAI_API_URL: `${process.env.GUESTY_OAI_URL}/v1` || '',
        OAI_AUTH_URL: `${process.env.GUESTY_OAI_URL}/oauth2/token` || '',
        OAI_CLIENT_ID: process.env.GUESTY_OAI_CLIENT_ID || '',
        OAI_CLIENT_SECRET: process.env.GUESTY_OAI_CLIENT_SECRET || ''
    },
    MODE: process.env.APP_MODE || 'live',
    SMTP: {
        HOST: process.env.SMTP_HOST || '',
        PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
        USER: process.env.SMTP_USER || '',
        PASSWORD: process.env.SMTP_PASSWORD || ''
    },
    URL: {
        API: process.env.API_URL || '',
        CLIENT: process.env.CLIENT_URL || '',
        DASHBOARD: process.env.DASHBOARD_URL || ''
    },
    ACCOUNT: {
        ADMIN: process.env.ADMIN_EMAIL || 'admin@thevillalife.com',
        SUPPORT: process.env.SUPPORT_EMAIL || 'support@thevillalife.com'
    },
    FACEBOOK: {
        CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '',
        CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || ''
    },
    GOOGLE: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
    },
    SWAGGER: {
        USER: process.env.SWAGGER_USER || 'swagger',
        PASSWORD: process.env.SWAGGER_PASSWORD || 'swagger'
    },
    HUBSPOT: {
        API_KEY: process.env.HUBSPOT_API_KEY || '',
        PORTAL_ID: process.env.HUBSPOT_PORTAL_ID || '',
        FORM_ID: process.env.HUBSPOT_FORM_ID || ''
    },
    S3: {
        ACCESS_KEY: process.env.S3_ACCESS_KEY || '',
        ACCESS_SECRET: process.env.S3_ACCESS_SECRET || '',
        BUCKET_NAME: process.env.S3_BUCKET_NAME || ''
    }
});
