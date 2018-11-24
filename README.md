XenApp
---------
XenForo native applications for Android & iOS using [React Native](https://facebook.github.io/react-native)

Installation
---------------
Just run this command to install all dependencies.
`npm install`

Configuration
----------------
Create new file `Config.js` and save to `/src/` directory.

There are example:
```
export const CLIENT_ID = "";
export const CLIENT_SECRET = "";
export const BASE_URL = "";

```

Run on Device?
-----------------
Please follow official document: [Running on device](https://facebook.github.io/react-native/docs/running-on-device#3-build-and-run-your-app)

Requirements
-------------
Your forum must installed this add-on: https://github.com/xfrocks/bdApi at branch `xenforo2` (this repo for dev only).
If you are not developer you can download the add-on for install at: https://xfrocks.com/resources/bd-api-for-xenforo-2-0.36/

Contribute Note
------------------
Before create an PR you may run the file `devhelper--precommit.sh` and resolve all issues if have.