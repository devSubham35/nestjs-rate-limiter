import bcrypt from "bcrypt";
import { Request } from 'express';
import { ApiKeyService } from 'src/api-key/api-key.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {

  constructor(private readonly apiKeyService: ApiKeyService) { }

  private extractApiKey(request: Request): string | undefined {
    return request.headers['x-api-key'] as string | undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractApiKey(request);

    if (!token) {
      throw new UnauthorizedException("Missing API token");
    }

    const [apiId, apiKey] = token.split(".")

    if (!apiId || !apiKey) {
      throw new UnauthorizedException('Invalid API token');
    }

    const api = await this.apiKeyService.findByApiId(apiId);

    if (!api) {
      throw new UnauthorizedException('Invalid API token');
    }

    const isHashedKeyMatched = await bcrypt.compare(apiKey, api?.keyHash as string)

    if (!isHashedKeyMatched) {
      throw new UnauthorizedException('Invalid API token');
    }

    if (!api.isActive) {
      throw new UnauthorizedException('API key revoked');
    }

    request['api'] = api

    return true;
  }

}
