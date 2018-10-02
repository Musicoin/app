#Musicoin App

###Setup

- The app is built on cross-platform framwork Ionic.
- Run `npm install` to install dependencies.
- Run `ionic serve -c` (-c for console logging) to run the app.
- Open browser at `localhost:8100` to view app.

###Notes
- For SSLv3 error, use later version of Node v10.
Issue with TLS transport for certificates in v8, fixed in later versions of Node.
- Tested using Node v10.9.
- API requests are proxied locally via `localhost:8100/api-testing` and `localhost:8100/api-streaming` - this is configured in `ionic.config.json` and `./src/app/env/***.ts`
