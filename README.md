## BP2019 Jupiter Hall Pong Exhibit

CURRENT STATUS: simple communication proof of concept

### First Time Installation

requirements: NodeJS 10.9

- flash arduino with serial encoder with code from `arduino/serial-encoder`
- open terminal and `cd bp2019-pong/game`
- `npm install -g parcel-bundler`
- `npm ci`

### Running the Test Server

With arduino connected, ensure it's working by running `npm run server`. As you diddle the encoder, you should see number output in the terminal window.

### Running the Test Client

Open a second terminal window, run `npm run client` and point Chrome to `localhost:1234`. Optionally open the Javascript console. Twiddle the encoder knob to see if the paddle moves.
