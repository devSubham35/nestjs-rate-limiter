import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/utils/config';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { ApiKeyGuard } from './guards/apiKey.guard';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [
    UserModule,
    ApiKeyModule,
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ApiKeyGuard],
})
export class AuthModule {}
