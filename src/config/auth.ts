import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Auth0 Configuration
export const authConfig = {
  domain: process.env.AUTH0_DOMAIN ?? '',
  clientId: process.env.AUTH0_CLIENT_ID ?? '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
  audience: process.env.AUTH0_AUDIENCE ?? '',
  jwtToken: process.env.JWT_SECRET ?? '',
  get issuer() {
    return `https://${authConfig.domain}/`
  },
}

export default authConfig
