
# Badestellen a.k.a. badegewaesser-berlin.de

- [Website](https://badegewaesser-berlin.de/)
- [Launch-Blogpost](https://lab.technologiestiftung-berlin.de/projects/bathing-water/index.html)

## Overview

The repository consists of 5 folders:

### 1. processing

Scripts in this folder were used to generate the initial data set, mostly scrapers and image conversion tools.

### 2. material

Graphic source files

### 3. data

Initial data generated from the processing scripts

### 4. data-server

A node-js server which is handling data-uploads by the partners, and generates the necessary data-files for the actual application

### 5. app

The HTML web application (frontend)

## The data server

### Setup

Install dependencies

`npm install`

Update the info in config-sample.json and rename to config.json

``"path" : Folder where uploads are being stored
"export_path" : This path should lead to where the app-folder is stored, it allows the script to update the data files of the web app
"port" : Port the service runs on
"users" : the service requires two users one for kwb and one for bwb``

Start the service

`node index.js`

We recommend using a service which restarts this service if it stops, there are several tools out there to do this.

### What is happening in here?

#### Uploading and updating the app

External partners use the upload feature to upload data, which is then being processed and the web app is being updated. In this process the service is also checking the Lageso web server, if there is any new information available.

There is also a protected function, which can be initated to update the app, (e.g. if lageso has updated their info): SERVER:PORT/REFRESH_SECRET/update

In addition a cron-job should be set up, which should point to the following site:
SERVER:PORT/REFRESH_SECRET/update_cron

#### Feedback

The service also handles user-feedback, through the feedback form. This is stored in an sqlite database.

#### Data handling

All data is stored in a file-based sqlite database (badestellen.db).

## Support

We are part of BrowserStack's non-profit program, helping us deliver an even better user experience.

<a href="https://www.browserstack.com/">
  <img src="https://p14.zdusercontent.com/attachment/1015988/Hjnr3apa9OCplUi1GbaLiCVa7?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..QA4hJSE7NQfMjFDK1w6tog.0-YOVfCRjxpeHUf5tjKutEEoQn-U5peEUgQ6ZxBZugOJrShlKGm0lCgAURhV9T8Y-dIiFS9xTpdJ0UVPzSL1k4ka4emU3lzjerjHwhHt3Yl65Fs3S4JUWOhHvmiiG9-C0DvY7PJAEpwtGMNf-auRy84MUiYSMIriQzwkTTBJ7rdm7laryRnCGntFYfhs_GgGK38QEk8ZUhmx6M45yPoGTYrwjFPN85D3YmUA1zsEYEYKpIYOE2zdWT38wtQ6yyNWFTi6GyVQZ-p8nXAGbE5ZQR8XlKU2CquvZurSDtFeWhM.BIRFSvq27MoywSgtua3tYw" height="100">
</a>

