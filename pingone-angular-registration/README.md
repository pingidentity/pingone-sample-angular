# PingOne for Customers Angular Registration Sample

This sample demonstrates how to:
 - **register a new user**
 - **recover a forgotten password**

# Setup & Running
1. Copy this source code: `git clone https://github.com/pingidentity/pingone-customers-sample-angular.git`

2. Link not published package

```
cd pingone-customers-sample-angular/pingone-angular-registration
npm install
cd ../pingone-angular-sdk
npm link
npm install
cd ../pingone-angular-registration
npm link pingone-angular-sdk
```

3. Create `Single Page App` with:
    - `Token` and `ID Token` response types
    - `Implicit` grant type
    - `None` token authentication method
    - `http://localhost:4200` redirect URI
    - `http://localhost:4200` signoff URL
 
4. Enable applications in the PingOne admin console.

5. Configure your Application Settings in `/src/app/pingone-api.service.ts` 

```js
    this.pingApiClient = new ApiClient({
      environmentID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      clientID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      API_URI: 'https://api.pingone.com',
      AUTH_URI: 'https://auth.pingone.com'
    });
```

6. Create `Worker` application with:
    - `Client Credentials` grant type
    - `Client Secret Post` token authentication method

7. Enable applications in the PingOne admin console.

8. Add environment-specific variables in .env file

```properties
environmentID=PINGONE_ENV_ID
clientID=PINGONE_CLIENT_ID_WORKER_APP
clientSecret=PINGONE_CLIENT_SECRET_WORKER_APP
API_URI=https://api.pingone.com
AUTH_URI=https://api.pingone.com
```

9. Run Application `npm start` and `npm run server`

10. Open `http://localhost:4200`
