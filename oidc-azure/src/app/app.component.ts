import { Component } from '@angular/core';
import { OAuthService, JwksValidationHandler, AuthConfig, NullValidationHandler, OAuthErrorEvent } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://login.microsoftonline.com/<enter guid here>/v2.0',
  redirectUri: window.location.origin + '/oidc-azure',
  clientId: '<enter client id here>',
  strictDiscoveryDocumentValidation: false,
  userinfoEndpoint: 'https://<private proxy server>/angular2azure/userinfo'
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
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocument( 'https://<private proxy server>/angular2azure/openid-configuration?tenant=<enter guid here>' );
    this.oauthService.tryLogin({
    onTokenReceived: context => {
        console.debug("logged in");
        this.oauthService.loadUserProfile();
	console.info( this.oauthService.getAccessToken() );
      }
    });
    this.oauthService.responseType = 'code token id_token';
    this.oauthService.scope = 'openid';

    /* This needs to be set manually b/c ADFS and Azure AD do not support CORS */

    /*
    * From this url: https://login.microsoftonline.com/<enter domain name>/v2.0/.well-known/openid-configuration
    * you can find the loginUrl and tokenEndpoint
     */

    this.oauthService.loginUrl = 'https://login.microsoftonline.com/<enter guid here>/oauth2/v2.0/authorize';
    this.oauthService.tokenEndpoint = 'https://login.microsoftonline.com/<enter guid here>/oauth2/v2.0/token/';

    this.oauthService.events.subscribe(event => {
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
