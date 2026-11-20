import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service.js';
import { SigninInput } from './dto/signin.input.js';
import { AuthPayload } from './entities/auth-payload.entities.js';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signIn(@Args('signInInput') signinInput: SigninInput) {
    const user = await this.authService.validateLocalUser(signinInput);

    return await this.authService.login(user);
  }
}
