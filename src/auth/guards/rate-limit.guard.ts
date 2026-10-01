import Redis from 'ioredis';
import { Request, Response } from 'express';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const api = request['user'];

    const { apiId, rateLimit, window } = api;

    const key = `rate-limit:${apiId}`;

    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, window);
    }

    const remaining = Math.max(rateLimit - count, 0);

    response.setHeader(
      'X-RateLimit-Limit',
      rateLimit,
    );

    response.setHeader(
      'X-RateLimit-Remaining',
      remaining,
    );

    if (count > rateLimit) {
      const retryAfter = await this.redis.ttl(key);

      response.setHeader(
        'Retry-After',
        retryAfter,
      );

      throw new HttpException(
        "Too Many Requests, rate limit exceeds", 
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}