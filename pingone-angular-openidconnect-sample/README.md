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
cd ../pingone-angular-openidconnect-sample
npm link pingone-angular-sdk
```

3. Configure your Application Settings in `/src/app/app.component.ts`

```js
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
```

4. Run Application `npm start`

5. Open `http://localhost:4200`
