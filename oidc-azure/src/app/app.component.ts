import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService, JwksValidationHandler, AuthConfig, NullValidationHandler, OAuthErrorEvent } from 'angular-oauth2-oidc';

export const PRIVATE_PROXY_SERVER: string = '<private proxy server>';
export const TENANT_GUID: string = '<enter guid here>';

export const authConfig: AuthConfig = {
  issuer: 'https://login.microsoftonline.com/' + TENANT_GUID + '/v2.0',
  redirectUri: window.location.origin + '/oidc-azure',
  clientId: '<enter client id here>',
  strictDiscoveryDocumentValidation: false,
  userinfoEndpoint: 'https://' + PRIVATE_PROXY_SERVER + '/angular2azure/userinfo'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  raw = '';
  title = 'oidc-azure';

  constructor(private httpClient: HttpClient, private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocument( 'https://' + PRIVATE_PROXY_SERVER + '/angular2azure/openid-configuration?tenant=' + TENANT_GUID );
    this.oauthService.tryLogin({
    onTokenReceived: context => {
        console.debug("logged in");
        this.oauthService.loadUserProfile();
	console.info( this.oauthService.getAccessToken() );
	console.info( this.oauthService.getIdToken() );
      }
    });
    this.oauthService.responseType = 'code token id_token';
    this.oauthService.scope = 'openid email profile';

    /* This needs to be set manually b/c ADFS and Azure AD do not support CORS */

    /*
    * From this url: https://login.microsoftonline.com/<enter domain name>/v2.0/.well-known/openid-configuration
    * you can find the loginUrl and tokenEndpoint
     */

    this.oauthService.loginUrl = 'https://login.microsoftonline.com/' + TENANT_GUID + '/oauth2/v2.0/authorize';
    this.oauthService.tokenEndpoint = 'https://login.microsoftonline.com/' + TENANT_GUID + '/oauth2/v2.0/token/';

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

  get_private() {

       var headers = new HttpHeaders({
		"Authorization": "Bearer " + this.oauthService.getIdToken()
	});
	this.httpClient.get( 'https://' + PRIVATE_PROXY_SERVER + '/angular2azure/private?tenant=' + TENANT_GUID, { headers: headers } ).subscribe( (result) => {
		console.log( result );
		this.raw = JSON.stringify( result );
	});
    }
}
