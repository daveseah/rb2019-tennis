# BP-TENNIS on a PI4

The Pi4 doesn't run the browser client very quickly, managing between 20-30fps. The 2020 version of the client code has some additional optimizations to improve the framerate slightly, but it isn't anywhere close to our goal of 60fps.

That said, here's how you can install it on a Pi4. My test pi was a 4GB machine.

## Install Raspbian OS

* Download Noobs
* Copy content of Noobs archive to microSD card
* plug in hdmi, keyboard/mouse
* power-on system to boot
* pick "install raspbian full"

## Install Visual Studio Code for Raspberry Pi

Someone has compiled a [build of VSC](https://pimylifeup.com/raspberry-pi-visual-studio-code/)! Instructions at link. However, you don't need to install it if you use **Remote Editing** (see below).

## Remote Editing with Visual Studio Code
You can [remote edit files remote](https://code.visualstudio.com/docs/remote/ssh) on other hosts via SSH!
The hostname of the raspberry pi is `hostname`. I [edited the hostname](https://thepihut.com/blogs/raspberry-pi-tutorials/19668676-renaming-your-raspberry-pi-the-hostname) to be rbd01.
Current machines use [mDNS](https://en.wikipedia.org/wiki/Multicast_DNS) to resolve hostnames. It is of the form `hostname.local`. 

### 1. Enable SSH
Go to Raspberry Pi Config and enable the SSH interface.

### 2. Configure Visual Studio Code

On your host machine, install the Remote-SSH extension (the latest stable version; there may be several preview versions), then follow the instructions for [adding a remote](https://code.visualstudio.com/docs/remote/ssh).

* `ssh-keygen -t rsa -b 4096` (do not use passphrase, save as `rbd01_rsa`)
* `ssh-copy-id -i rbd01_rsa pi@rbd01.local`

Then:

* COMMAND-SHIFT-P: Remote-SSH: Open Configuration File and add IdentityFile ~/.ssh/rbd01_rsa
* connect to host using Remote-SSH: Connect to Host

## Setting up Node and NVM on Raspbian
Following instructions [here](https://linuxize.com/post/how-to-install-node-js-on-raspberry-pi/)

* `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
* `nvm install v10.19.0`

## Setting up Github Access on Raspberry Pi!

There's no need for the Raspberry Pi to have push access, though if necessary we can create a "machine user" on GitHub. For now I won't worry about it. So just do this:
* `git clone https://github.com/daveseah/bp2019-tennis.git`
* `cd bp2019-tennis/game`
* `nvm use`
* `npm ci`
* `npm run server; npm run client`

## Alternative: Install Raspbian on VM

untested

* download iso https://www.raspberrypi.org/downloads/raspberry-pi-desktop/
* install into virtual box

