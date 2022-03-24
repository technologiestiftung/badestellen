![](https://img.shields.io/badge/Build%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiesitftung%20Berlin-blue)

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

![[](https://www.browserstack.com/)](https://github.com/technologiestiftung/badestellen/raw/master/docs/browserstack.svg)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/CityLAB Slides/commits?author=ff6347" title="Code">💻</a> <a href="https://github.com/technologiestiftung/CityLAB Slides/commits?author=ff6347" title="Documentation">📖</a></td>
    <td align="center"><a href="https://vogelino.com/"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/CityLAB Slides/commits?author=vogelino" title="Documentation">📖</a></td>
    <td align="center"><a href="http://tobiasjordans.de/"><img src="https://avatars.githubusercontent.com/u/111561?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Tobias</b></sub></a><br /><a href="https://github.com/technologiestiftung/CityLAB Slides/commits?author=tordans" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/fdnklg"><img src="https://avatars.githubusercontent.com/u/9034032?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian</b></sub></a><br /><a href="https://github.com/technologiestiftung/CityLAB Slides/commits?author=fdnklg" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


## Content Licencing

Texts and content available as [CC BY](https://creativecommons.org/licenses/by/3.0/de/). 

## Credits

<table>
  <tr>
    <td>
      Made by <a src="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://citylab-berlin.org/wp-content/uploads/2021/05/citylab-logo.svg" />
      </a>
    </td>
    <td>
      A project by <a src="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://citylab-berlin.org/wp-content/uploads/2021/05/tsb.svg" />
      </a>
    </td>
    <td>
      Supported by <a src="https://www.browserstack.com/">
        <br />
        <br />
        <img width="80" src="https://citylab-berlin.org/wp-content/uploads/2021/12/B_RBmin_Skzl_Logo_DE_V_PT_RGB-300x200.png" />
        &amp; 
        <img width="150" src="https://github.com/technologiestiftung/badestellen/raw/master/docs/browserstack.svg" />
      </a>
    </td>
  </tr>
</table>

