XenApp
---------
[XenForo](https://xenforo.com) native app for Android & iOS using [React Native](https://facebook.github.io/react-native)

This is __NOT__ official app by XenForo Company.

## XenForo support versions:

* 1.5.x
* 2.0.x
* 2.1.x (not ready yet)

## Table of Contents:

* [Installation](#installation)
    * [Requirements](#requirements)
    * [MacOS](#mac-os-user)
    * [Windows](#windows-user)
* [Configuration](#configuration)
* [Run on device](#run-on-device)
* [Contribute node](#contribute-note)

Installation
---------------

### MAC OS User:

Step1: You must be install [brew](https://brew.sh) by running the following command:

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

Step 2: Install NodeJS and other tools by running the following command:

`brew install node watch`

To make sure the install was successfully just run a few commands to verify it:

* `node -v`: Should be output the version of node
* `npm -v`: Should be output the version of NPM

Step 3: Install react-native cli in global

`npm install -g react-native-cli`

Step 4: Go to project and run it:

`cd /path/to/this/repo && npm run ios`

### Windows User:

Step 1: You must be install [chocolatey](https://chocolatey.org/install), a popular package manager for Windows.

Step 2: Install NodeJS and some other tools

`choco install -y nodejs.install python2 jdk8`

Step 3: Install react-native cli in global

`npm install -g react-native-cli`

Step 4: Go to project and run it:

`cd /path/to/this/repo && npm run android`

##### Note:
On Window you can only run `android` simulator

Configuration
----------------
Create new file `Config.js` and save to `/src/` directory.

There are example:
```
export const CLIENT_ID = "";
export const CLIENT_SECRET = "";
export const BASE_URL = "";

```

Run on Device
-----------------
Please follow official document: [Running on device](https://facebook.github.io/react-native/docs/running-on-device#3-build-and-run-your-app)

Requirements
-------------
Your forum must installed this add-on: https://github.com/xfrocks/bdApi at branch `xenforo2` (this repo for dev only).
If you are not developer you can download the add-on for install at: https://xfrocks.com/resources/bd-api-for-xenforo-2-0.36/

Contribute Note
------------------
Before create an PR you may run the file `devhelper--precommit.sh` and resolve all issues if have.