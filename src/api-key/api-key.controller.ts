import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { CreateAPIKeyDto } from './dto/apiKey.dto';
import { AuthGuard } from "src/auth/guards/auth.guard";
import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@Controller("api-key")
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) { }

  @Get("")
  async get(@Request() req) {
    return await this.apiKeyService.getAllApiKeysService(req.user.sub);
  }

  @Post("")
  async create(@Request() req, @Body() createAPIKeyDto: CreateAPIKeyDto) {
    return await this.apiKeyService.createApiKeyService(req.user.sub, createAPIKeyDto);
  }

  @Post("/:apiId/verify")
  async verify(@Param('apiId') apiId: string) {
    return await this.apiKeyService.verifyApiKeyService(apiId);
  }

  @Patch("/:apiId/revoke")
  async revoke(@Param('apiId') apiId: string) {
    return await this.apiKeyService.revokeApiKeyService(apiId);
  }

}
