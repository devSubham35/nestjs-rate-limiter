import { Module } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyController } from './api-key.controller';
import { APIKey, APIKeySchema } from './schemas/apiKeySchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: APIKey.name, schema: APIKeySchema }]),
  ],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
