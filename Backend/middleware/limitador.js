import { rateLimit } from 'express-rate-limit'

export const traduccionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 peticiones por IP
  message: { error: 'Demasiadas peticiones. Inténtalo más tarde.' },
});