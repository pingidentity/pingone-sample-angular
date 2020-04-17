import { Component, OnInit } from '@angular/core';
import { AuthOIDC } from 'pingone-angular-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  authClient: AuthOIDC;
  userDetails: string;
  tokenDetails: string;

  constructor() {
    this.authClient = new AuthOIDC(
      {
        environment_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        client_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        redirect_uri: 'http://localhost:4200',
        post_logout_redirect_uri: 'http://localhost:4200',
        api_uri: 'https://api-staging.pingone.com',
        auth_uri: 'https://auth-staging.pingone.com'
      }
    );
  }

  ngOnInit() {
    this.authClient.init()
        .then(data => {
          this.userDetails = this.authClient.formatIntoTable(data);
          this.tokenDetails = this.authClient.showTokenClaimsInfo();
        })
        .catch(error => console.log(error));
  }

  signIn() {
    this.authClient.signIn({
      scope: 'openid profile email address',
      response_type: 'token id_token'
    });
  }

  signOff() {
    this.authClient.signOff();
  }

}
