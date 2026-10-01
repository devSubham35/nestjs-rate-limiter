import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { PLAN_TYPE } from './apiKey.types';
import { InjectModel } from '@nestjs/mongoose';
import { APIKey } from './schemas/apiKeySchema';
import { customAlphabet, nanoid } from "nanoid";
import { CreateAPIKeyDto } from './dto/apiKey.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ApiKeyService {

  constructor(@InjectModel(APIKey.name) private apiKeyModel: Model<APIKey>) { }

  /// Get all Api ApiKey
  async getAllApiKeysService(userId: string){

    const apiKeys = await this.apiKeyModel.find({ userId })

    return {
      "data": apiKeys,
      "message": "Api keys fetched successfully"
    }
  }

  /// Create API Key Service
  async createApiKeyService(userId: string, createAPIKeyDto: CreateAPIKeyDto) {

    const nanoIdCustom = customAlphabet('1234567890abcdef', 25)

    const apiId = nanoid()
    const rawApiKey = nanoIdCustom()
    const hashedApiKey = await bcrypt.hash(rawApiKey, 10)

    const createdKey = await this.apiKeyModel.create({
      apiId,
      userId,
      plan: PLAN_TYPE.FREE,
      keyHash: hashedApiKey,
      title: createAPIKeyDto.title,
    })

    const result = {
      _id: createdKey._id,
      userId: createdKey.userId,
      title: createdKey.title,
      plan: createdKey.plan,
      api_id: createdKey.apiId,
      api_key: `${apiId}.${rawApiKey}`
    };

    return {
      "data": result,
      "message": "API key created successfully"
    }
  }

  /// Verify API key
  async verifyApiKeyService(apiId: string) {

    const [key_id, api_key] = apiId.split(".")

    const existingData = await this.apiKeyModel.findOne({
      api_id: key_id
    })

    if (!existingData) {
      throw new BadRequestException("Invalid API key")
    }

    const isMatched = await bcrypt.compare(api_key, existingData.keyHash)

    if (!isMatched) {
      throw new BadRequestException("Invalid API key")
    }

    return {
      "message": "Api key validated successfully"
    }
  }

  /// Find API key data by api id
  async findByApiId(apiId: string) {
    return await this.apiKeyModel.findOne({ apiId })
  }

  /// Revoke api key
  async revokeApiKeyService(apiId: string) {

    const apiKey = await this.apiKeyModel.findOne({ apiId })

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    if (!apiKey.isActive) {
      throw new BadRequestException('API key is already revoked');
    }

    apiKey.isActive = false
    await apiKey.save();

    return {
      apiId: apiKey.apiId,
      isActive: apiKey.isActive,
      message: 'API key revoked successfully',
    }

  }

}
