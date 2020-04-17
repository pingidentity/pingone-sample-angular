import { Injectable } from '@angular/core';

import { ApiClient } from 'pingone-angular-sdk';

@Injectable({
  providedIn: 'root',
})
export class PingApiService {

  pingApiClient: ApiClient;

  constructor() {
    this.pingApiClient = new ApiClient({
      environmentID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      clientID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      API_URI: 'https://api-staging.pingone.com',
      AUTH_URI: 'https://auth-staging.pingone.com'
    });
  }

}
