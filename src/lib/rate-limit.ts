import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Limiteur de requêtes pour protéger l'API Chat (Anthropic) des abus.
 * 
 * Si les clés Upstash ne sont pas définies dans le .env, 
 * le limiteur laissera passer les requêtes (mode "bypass" pour le dev local).
 * 
 * Configuration recommandée pour le chat : 15 requêtes par minute par utilisateur.
 */
const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const mockLimiter = (limit: number) => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  limit: async (_identifier: string) => ({
    success: true,
    limit,
    remaining: limit,
    reset: Date.now() + 60000,
  }),
});

export const chatRateLimit = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(15, "1 m"),
      analytics: true,
    })
  : mockLimiter(15);

// 5 uploads par minute par utilisateur (chaque upload appelle un LLM)
export const uploadRateLimit = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
    })
  : mockLimiter(5);

// 10 analyses job-match par minute par utilisateur
export const optimizeRateLimit = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
    })
  : mockLimiter(10);
