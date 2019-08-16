## RBD2019 Jupiter Hall TABLE TENNIS Exhibit

This is a PONG-style game that can be controlled via the serial port connected to two Arduino boards, created for the Ralph Baer Day 2019 in Manchester, New Hampshire over a few weekends. It is modeled after the Atari PONG game, as usable source code for game logic was available (see [credits](#credits-and-license) below). I wasn't aware at the time that there was [considerable competitive conflict between Baer and Nolan Bushnell](https://en.wikipedia.org/wiki/Ralph_H._Baer), so a future revision of this codebase would move toward Baer's original *TABLE TENNIS* implementation on the [Magnavox Odyssey](http://www.pong-story.com/odyssey.htm).

This project was implemented in Javascript, using a NodeJS server for serial communication to the Arduino. The NodeJS server provides a websocket connection for the client Pong game running in a web browser, and receives JSON controller data. 

Many game and display parameters can be set by modifying `constants.js`. 

### First Time Installation

Here's a **demo installation video**:

[![](http://img.youtube.com/vi/POdXbry-Qc4/0.jpg)](http://www.youtube.com/watch?v=POdXbry-Qc4 "Installation Demo")

#### Prerequisites to install

Note: these instructions presume you are using a Unix-y system like Linux or MacOS. [These instructions are tested on MacOS Mojave](https://github.com/daveseah/bp2019-pong/wiki/Installing-on-MacOS). You *CAN* [run on Windows 10 WSL or via Scoop](https://github.com/daveseah/bp2019-pong/wiki/Installing-on-Windows), but the serial port "list:ports" command does not yet work.

You will need to have **NodeJS** and **Git** installed. To program the Arduino board, you'll need the **Arduino IDE** but the client/server will run in "autoplay" mode without connected hardware.

#### Setup

Get the Repo:

- open a terminal window
- cd to the folder you want to store the repo
- `git clone git@github.com:daveseah/bp2019-pong.git`
- `cd bp2019-pong/game`

One-time configuration the web client development software:

- `npm ci`
- if you are using nvm, type `nvm use`

### Run the Game Server

HARDWARE CONFIGURATION

If you have functioning hardware, you can change the source code to match your Arduino configuration. The game server will gracefully fail if no hardware is detected. The following instructions assume you have working hardware.

Program your Arduino with the contents of `arduino/serial-encoder` with the Arduino IDE if you haven't already, then modify the server code:

- Make sure you are in the `bp2019-pong/game` directory
- In the terminal, `npm run list:ports` to see the list of available serial ports (note: this code **does not work on Windows** using either WSL or Scoop)
- Find the _serial port path_ for your arduino board and copy it to the clipboard.
- Edit `server/serial.js` in the `CONFIG` section at top, adding `COM1` and `COM2` paths to your serial ports. 

Now to run the SERVER itself:

- Open terminal window, and make sure you are in the `bp2019-pong/game` directory
- `npm run server`
- You will see some text appear describing what the server is doing. If you have compatible hardware plugged into the USB port and you have configured `server/serial.js`, you should see a successful connection message.
- Next you will run the Game Client to see if the data is being received

### Run the Game Client

Open a SECOND TERMINAL WINDOW, then:

- Make sure you are in the `bp2019-pong/game` directory
- `npm run client`
- Open Chrome and browse to `localhost:3000`
- Twiddle the encoder knob to see if the paddle moves
- Click on the play field to enable sound (this is a browser-enforced requirement)

The game runs in an attract mode, AI players that take turns beating each other. If an Arduino paddle controller is moved, however, it will take over the player. When a player reachers 9 points, the game is over and the player reverts to AI control unless the Arduino paddle is again moved.

#### Operating Notes

* To enter FULL SCREEN MODE, go to the Chrome browser's VIEW MENU and disable _Always Show Toolbar_ and _Always Show Bookmarks_, then choose _Full Screen Mode_. The MacOS shortcut for full screen mode is `CTRL-CMD-F`.
* You can change the screen size by editing `game/constants.js` and adjusting the WIDTH and HEIGHT. The game board and elements sizes are defined relative to WIDTH and HEIGHT.
* You can run the server on a separate computer from game client. In `serial.js` change the `CONFIG` to match your network and serial port configuration and select it. NOTE: The client/server code is not optimized AT ALL, so weaker servers (e.g. Raspberry Pi) may not handle the load well.

## Credits and License

This code is released under the **MIT license**.

* The main pong game logic is based on Max Wihlborg's cool [YouTube tutorial](https://www.youtube.com/watch?v=KApAJhkkqkA) (source at [github](https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html)). 
* Conversion to modular Javascript, Arduino control, and websocket connection by Dave Seah and Ryan Sutton. 

Here's a video showing the construction of the [Ralph Baer Day](http://ralphbaerday.com) exhibit: 

[![](http://img.youtube.com/vi/RF0mv2btJL0/0.jpg)](http://www.youtube.com/watch?v=RF0mv2btJL0 "Construction Montage")

