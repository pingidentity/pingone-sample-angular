import { fetch } from 'cross-fetch';

export class OAuth {
  constructor() { }

  getAccessToken() {

    return fetch('http://localhost:3000/token');
  }
}
