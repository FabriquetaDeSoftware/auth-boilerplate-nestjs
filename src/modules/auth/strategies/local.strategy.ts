import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { SignInDto } from '../dto/sign_in.dto';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'email',
    });
  }

  @Inject('IValidateUserService')
  private validateUserService: IGenericExecute<SignInDto, Auth>;

  public async validate(email: string, password: string): Promise<Auth> {
    const user = await this.validateUserService.execute({ email, password });

    if (!user || !user.is_verified_account) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return user;
  }
}
