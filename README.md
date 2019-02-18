## BP2019 Jupiter Hall Pong Exhibit

This is a PONG game that can be controlled via the serial port connection by connected Arduinos. The Pong game is written in Javascript, using a NodeJS server for serial communication to the Arduino. The NodeJS server provides a websocket connection for the client Pong game running in a web browser, and receives JSON controller data. 

Many game and display parameters can be set by modifying `constants.js`. 

### First Time Installation

#### Prerequisites to install

You will need to have **NodeJS** and **Git** installed. To program the Arduino board, you'll need the **Arduino IDE** but the client/server will run without connected hardware.

#### Setup

Note: these instructions presume you are using a Unix-y system like Linux or MacOS. These instructions are tested on MacOS Mojave. It may be possible to use Windows SUbsystem for Linux (WSL) on Windows 10, but I have not tested it.

Get the Repo:

- open a terminal window
- cd to the folder you want to store the repo
- `git clone git@github.com:daveseah/bp2019-pong.git`
- `cd bp2019-pong/game`

Configure the web client software:

- `npm ci`
- if you are using nvm, type `nvm use`

## Running the Game Server

HARDWARE CONFIGURATION

If you have functioning hardware, you can change the source code to match your Arduino configuration. The game server will gracefully fail if no hardware is detected. The following instructions assume you have working hardware.

Program your Arduino with the contents of `arduino/serial-encoder` with the Arduino IDE if you haven't already, then modify the server code:

- Make sure you are in the `bp2019-pong/game` directory
- In the terminal, `npm run list:ports` to see the list of available serial ports
- Find the _serial port path_ for your arduino board and copy it to the clipboard.
- Edit `serial.js` in the `CONFIG` section at top, adding `COM1` and `COM2` paths to your serial ports. 

Now to run the SERVER itself:

- Open terminal window, and make sure you are in the `bp2019-pong/game` directory
- With Arduino connected, type `npm run server`.
- As you diddle the encoder, you should see number output in the terminal window.
- NOTE: The values are sent only if a change is detected

### Run the Game Client

Open a SECOND TERMINAL WINDOW, then:

- Make sure you are in the `bp2019-pong/game` directory
- `npm run client`
- Open Chrome and browse to `localhost:3000`
- Twiddle the encoder knob to see if the paddle moves
- Click on the play field to enable sound (this is a browser-enforced requirement)

To enter FULL SCREEN MODE, go to the Chrome browser's VIEW MENU and disable _Always Show Toolbar_ and _Always Show Bookmarks_, then choose _Full Screen Mode_.

The MacOS shortcut for full screen mode is `CTRL-CMD-F`.
