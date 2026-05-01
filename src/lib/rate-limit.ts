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
export const chatRateLimit = 
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(15, "1 m"),
        analytics: true,
      })
    : {
        // Mock fallback pour éviter de crasher en l'absence de configuration Redis
        limit: async (identifier: string) => ({ 
          success: true, 
          limit: 15, 
          remaining: 15, 
          reset: Date.now() + 60000 
        }),
      };
