import Redis from 'ioredis';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(process.env.REDIS_URL!);
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}