# Block Change
- a full stack crowdfunding app for humanitarian causes that is built on the blockchain with an actual test ethereum blockchain

![Alt text](/public/main-page.png?raw=true "Main Page" =720x450)

![Alt text](/public/donation-page.png?raw=true "Donation Page" =720x450)

### Tech Stack
- React, Redux, Node, Express, Ethereum util libraries, PostgresSQL

### Team Members
- Ming Feng, Shawn Feng, Carlo Las Marias, Karel Luwena, Yvonne Zhang

## Install
1. `npm install` or `yarn install`
2. Install Ethereum testnet: `npm install -g ethereumjs-testrpc`

## Scripts

### Development Environment

**Start DB**
1. Start DB: `npm run db`
  - Stop DB: `npm run db:stop`
2. Seed DB: `npm run db:seed`

**Start Servers**
1. Run Ethereum testnet: `npm run ethereum`
2. Run webpack build to generate front end: `npm run build`
3. Run server: `npm run start` => *http://localhost:3000*

**Alternative Front End: For React Debugging**
1. Start front-end dev server (web-dev-server): `npm run start:wds` => *http://localhost:1337*
  - *Note: main server still required*

### Deploy
1. Run build: `npm run build:prod` 
2. Run server: `npm run start:prod`

## Test
