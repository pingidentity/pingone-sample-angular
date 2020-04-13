import { Injectable } from '@angular/core';

import { ApiClient } from 'pingone-angular-sdk';

@Injectable({
  providedIn: 'root',
})
export class PingApiService {

  pingApiClient: ApiClient;

  constructor() {
    this.pingApiClient = new ApiClient({
      environmentID: '27c6efc5-82ab-461a-897e-dc49b4b917e9',
      clientID: '44391e61-983f-46f6-a08d-1ad1b25403b6',
      API_URI: 'https://api-staging.pingone.com',
      AUTH_URI: 'https://auth-staging.pingone.com'
    });
  }

}
