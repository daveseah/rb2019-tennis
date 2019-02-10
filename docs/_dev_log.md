## DEVELOPMENT LOG

#### SATURDAY FEB 9 2019

I am grabbing the source code from here:
https://www.youtube.com/watch?v=KApAJhkkqkA
which provides this annotated source:
https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html

This is a pretty good basic implementation of PONG using a familiar update loop approach. I'll be updating it to use a more modular approach that doesn't use this style of Javascript object declaration.

For NodeJS Serial Port communications: https://serialport.io/

We got the basics working at Ryan's house with the following:

- A single Arduino counting pulses from an encoder and sending them over the serial port to...
- An instance of Node running code that receives data from the serial port and forwards to...
- A web client running the PONG game that implements...
- An onscreen paddle that is controlled by motion of the encoder

I also got the rudimentary development environment set up:

- basic configuration files for editorconfig, eslint, git, nvm, and prettier
- using Parcel to handle bundling
- github repo
- folder organization
- npm scripts for running the client, server, and listing serial ports

I'm currently using Visual Studio Code as my IDE, with the following plugins installed that affect source code:

- Arduino 0.2.25 (which installs the C/C++ 0.21.0 extension)
- EditorConfig for VS Code 0.12.8 - enforce indents line styles according to `.editorconfig`
- EJS Language support 0.4.1 - add EJS template support
- ESLint 1.8.0 - enforce linting rules interactively according to `.eslintrc.json`
- Prettier - Code formatter 1.8.1 - enforce source code formatting according to `.prettierrc`

I'm using nvm (node version manager)

Next, I have to:

- change the bundler so it launches a custom Express server
- refactor and parameterize the PONG game
- write detailed instructions for installing the dev enviroment
- copy circuit diagrams into the docs folder

#### SUNDAY FEB 10 2019

Visual Studio Code issues: Installing the visual studio Arduino extension requires

- choosing a board in the extension config so symbols (e.g. Serial) are recognized
- installing the 1.8.8 version of Arduino IDE

The problem output messages "cannot open source file" and "include errors detected, Please update your includePath" are due to a bug [reported here](https://github.com/Microsoft/vscode-cpptools/issues/2610) and should be fixed in an update to the plugin.
