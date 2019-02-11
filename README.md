## BP2019 Jupiter Hall Pong Exhibit

CURRENT PROGRESS:

- simple communication proof of concept
- refactored pong sample source into modular JS
- two player self-playing mode with paddle 0 override

### First Time Installation

#### Prerequisites to install

- NodeJS
- Git
- Arduino IDE

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

Program the Arduino (if you have one):

- upload `arduino/serial-encoder` to your Arduino board using the Arduino IDE

### Running the Test Server

CONFIGURATION

If you have functioning hardware, you can change the source code to match your Arduino configuration.

- Make sure you are in the `bp2019-pong/game` directory
- In the terminal, `npm run list:ports` to see the list of available serial ports
- Find the _serial port path_ for your arduino board and copy it to the clipboard.
- Modify the file `server/serial.js` so the constant `SERIAL_PATH` is set to the serial port path.

RUN THE SERVER

- Open terminal window, and make sure you are in the `bp2019-pong/game` directory
- With Arduino connected, type `npm run server`.
- As you diddle the encoder, you should see number output in the terminal window.
- NOTE: If the Test Client isn't running, you'll see a "client offline" status message
- NOTE: The values are sent only if a change is detected

### Running the Test Client

Open a SECOND TERMINAL WINDOW, then:

- Make sure you are in the `bp2019-pong/game` directory
- `npm run client`
- Open Chrome and browse to `localhost:3000`
- Twiddle the encoder knob to see if the paddle moves

To enter FULL SCREEN MODE, go to the Chrome browser's VIEW MENU and disable _Always Show Toolbar_ and _Always Show Bookmarks_, then choose _Full Screen Mode_.
The MacOS shortcut for full screen mode is `CTRL-CMD-F`.
