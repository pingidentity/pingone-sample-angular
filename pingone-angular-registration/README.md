# PingOne for Customers Angular Registration Sample

This sample demonstrates how to:
 - **register a new user**
 - **recover a forgotten password**

# Setup & Running
1. Copy this source code: `git clone https://github.com/pingidentity/pingone-customers-sample-angular.git`

2. Link not published package

```
cd pingone-angular-sdk
npm link
cd ../pingone-angular-registration
npm link pingone-angular-sdk
npm install
```

3. Configure your Application Settings in `/src/app/pingone-api.service.ts` 

```js
    this.pingApiClient = new ApiClient({
      environmentID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      clientID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      API_URI: 'https://api.pingone.com',
      AUTH_URI: 'https://auth.pingone.com'
    });
```

4. Add environment-specific variables in .env file

```properties
environmentID=PINGONE_ENV_ID
clientID=PINGONE_CLIENT_ID
clientSecret=PINGONE__CLIENT_SECRET
API_URI=PINGONE_API_URI
AUTH_URI=PINGONE_AUTH_URI
```

5. Run Application `npm start` and `npm run server`

6. Open `http://localhost:4200`
