# PingOne for Customers Angular OpenID Connect Sample

This sample shows you how to authenticate to PingOne for Customers platform using [OpenID Connect](http://openid.net/connect/) in your Angular applications.

# Setup & Running
1. Copy this source code: `https://github.com/pingidentity/pingone-customers-sample-angular.git`

2. Link not published package

```
cd pingone-customers-sample-angular/pingone-angular-openidconnect-sample
npm install
cd ../pingone-angular-sdk
npm link
npm install
cd ../pingone-angular-openidconnect-sample
npm link pingone-angular-sdk
```

3. Create `Single Page App` with:
    - `Token` and `ID Token` response types
    - `Implicit` grant type
    - `None` token authentication method
    - `http://localhost:4200` redirect URI
    - `http://localhost:4200` signoff URL
 
4. Enable applications in the PingOne admin console.

5. Configure your Application Settings in `/src/app/app.component.ts`

```js
    this.authClient = new AuthOIDC(
      {
        environment_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        client_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        redirect_uri: 'http://localhost:4200',
        post_logout_redirect_uri: 'http://localhost:4200',
        api_uri: 'https://api.pingone.com',
        auth_uri: 'https://auth.pingone.com'
      }
    );
```

6. Run Application `npm start`

7. Open `http://localhost:4200`
