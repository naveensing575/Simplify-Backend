import { expressjwt, GetVerificationKey } from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import { authConfig } from '../config/auth'

// Middleware to validate JWT tokens from Auth0
export const authMiddleware = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
})
