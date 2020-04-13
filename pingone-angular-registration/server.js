#!/usr/bin/env node
const fetch = require("cross-fetch");
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

/**
 * For local testing only!  Enables CORS for all domains
 */
app.use(cors());

class OAuth {
  constructor(httpConfig) {
    this.httpConfig = httpConfig;
  }

  getAccessToken() {
    const params = {
      grant_type: "client_credentials",
      scope: this.httpConfig.scopes,
      client_id: this.httpConfig.clientID,
      client_secret: this.httpConfig.clientSecret
    };
    const body = Object.entries(params)
      .map(p => encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1]))
      .join("&");

    const issuer = `${
      this.httpConfig.AUTH_URI ? this.httpConfig.AUTH_URI : "https://auth.pingone.com"
    }/${this.httpConfig.environmentID}/as`;

    return fetch(`${issuer}/token`, {
      method: "POST",
      body: body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }
};

const oAuth = new OAuth({
  clientID: '44391e61-983f-46f6-a08d-1ad1b25403b6',
  clientSecret: 'O4SVGuIXEilgO9Pc_E5JS1id-nUZVVmwRzQl8usFBS_gUCUQUC9~_k1WbV2QvnpY',
  environmentID: '27c6efc5-82ab-461a-897e-dc49b4b917e9',
  API_URI: 'https://api-staging.pingone.com',
  AUTH_URI: 'https://auth-staging.pingone.com',
});

app.get('/token', (req, res) => {

  oAuth.getAccessToken()
       .then(res => {
          if (res.status >= 400) {
            throw new Error("Bad response from server");
          }
          return res.json();
        })
        .then(data => {
          res.json(data);
        })

});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
