import { Component } from '@angular/core';
import { OAuthService, JwksValidationHandler, AuthConfig, NullValidationHandler, OAuthErrorEvent } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
issuer: 'https://login.microsoftonline.com/<enter guid here>/v2.0',
  redirectUri: window.location.origin,
  clientId: '<enter client id here>'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'oidc-azure';

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.strictDiscoveryDocumentValidation = false;
    this.oauthService.responseType = 'code token id_token';
    this.oauthService.scope = 'openid';

    /* This needs to be set manually b/c ADFS and Azure AD do not support CORS */

    /*
    * From this url: https://login.microsoftonline.com/<enter domain name>/v2.0/.well-known/openid-configuration
    * you can find the loginUrl and tokenEndpoint
     */

    this.oauthService.userinfoEndpoint = 'https://graph.microsoft.com/oidc/userinfo';
    this.oauthService.loginUrl = 'https://login.microsoftonline.com/<enter guid here>/oauth2/v2.0/authorize';
    this.oauthService.tokenEndpoint = 'https://login.microsoftonline.com/<enter guid here>/oauth2/v2.0/token/';

    this.oauthService.tokenValidationHandler = new NullValidationHandler();

    this.authService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        console.error(event);
      } else {
        console.warn(event);
      }
    });
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  get givenName() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims['name'];
  }
}
