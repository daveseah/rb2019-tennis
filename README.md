## BP2019 Jupiter Hall Pong Exhibit

CURRENT STATUS: simple communication proof of concept

### First Time Installation

requirements: NodeJS 10.9

- flash arduino with serial encoder with code from `arduino/serial-encoder`
- open terminal
- `cd bp2019-pong/game`
- `npm ci`

### Running the Test Server

MODIFY `serial.js` with serial port path constant `SERIAL_PATH`:

- Run `npm run list:ports` in terminal to find your arduino's serial port path (tested in MacOS)
- Update the constant, then save the changes

RUN SERVER

- With arduino connected, go to terminal and `npm run server`.
- As you diddle the encoder, you should see number output in the terminal window.
- If the Test Client isn't running, you'll see a "client offline" status message
- The values are sent only if a change is detected

### Running the Test Client

Open a second terminal window, then:

- `npm run client`
- Open Chrome and go to `localhost:1234`
- Twiddle the encoder knob to see if the paddle moves

To enter FULL SCREEN MODE, go to the Chrome browser's VIEW MENU and disable _Always Show Toolbar_ and _Always Show Bookmarks_, then choose _Full Screen Mode_.
The MacOS shortcut for full screen mode is `CTRL-CMD-F`.
