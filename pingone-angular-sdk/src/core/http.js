import { fetch } from 'cross-fetch';
import { OAuth } from './oauth';

const PUT_METHOD = "put";
const POST_METHOD = "post";

export class Http {
  constructor() {
    this.oauth = new OAuth();
  }

  prepareRequest(request) {
    if (!this.oauth) {
      return Promise.resolve();
    }

    let getToken;
    if (this.accessToken) {
      getToken = Promise.resolve(this.accessToken);
    } else {
      getToken = this.oauth
        .getAccessToken()
        .then(this.errorFilter)
        .then(res => res.json())
        .then(accessToken => {
          this.accessToken = accessToken;
          return accessToken;
        });
    }

    return getToken.then(accessToken => {
      request.headers.Authorization = `Bearer ${accessToken.access_token}`;
    });
  }

  errorFilter(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return response.json().then(body => {
        throw new Error(JSON.stringify(body));
      });
    }
  }

  http(uri, request) {
    request = request || {};
    request.method = request.method || "get";
    return this.prepareRequest(request)
      .then(() => fetch(uri, request))
      .then(this.errorFilter);
  }

  delete(uri, request) {
    return this.http(uri, Object.assign(request || {}, { method: "delete" }));
  }

  json(uri, request) {
    request = request || {};
    request.headers = Object.assign(
      {
        Accept: "application/json"
      },
      request.headers
    );
    return this.http(uri, request).then(res => res.json());
  }

  getJson(uri, request) {
    request = request || {};
    request.method = "get";
    return this.json(uri, request);
  }

  post(uri, request) {
    request = request || {};
    request.method = POST_METHOD;
    return this.http(uri, request);
  }

  postJson(uri, request) {
    request = request || {};
    request.method = POST_METHOD;
    request.body = JSON.stringify(request.body);
    return this.json(uri, request);
  }

  patchJson(uri, request) {
    request = request || {};
    request.method = "patch";
    request.body = JSON.stringify(request.body);
    return this.json(uri, request);
  }

  putJson(uri, request) {
    request = request || {};
    request.method = PUT_METHOD;
    request.body = JSON.stringify(request.body);
    return this.json(uri, request);
  }

  put(uri, request) {
    request = request || {};
    request.method = PUT_METHOD;
    return this.http(uri, request);
  }
}
