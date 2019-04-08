import { JwksValidationHandler, ValidationParams } from 'angular-oauth2-oidc';

export class SignatureValidationHandler extends JwksValidationHandler {
   validateAtHash(validationParams: ValidationParams): Promise<boolean> {
    return Promise.resolve(true);
  }
}
