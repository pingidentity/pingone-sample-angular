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

3. Configure your Application Settings in `/src/app/pingone-api.service.ts` and `./in server.js`

4. Run Application `npm start`

5. Open `http://localhost:4200`
