# BP-TENNIS on a PI4

The Pi4 doesn't run the browser client very quickly, managing between 20-30fps. The 2020 version of the client code has some additional optimizations to improve the framerate slightly, but it isn't anywhere close to our goal of 60fps.

That said, here's how you can install it on a Pi4. My test pi was a 4GB machine.

## Install Raspbian OS

* Download Noobs
* Copy content of Noobs archive to microSD card
* plug in hdmi, keyboard/mouse
* power-on system to boot
* pick "install raspbian full"

## Initial Configuration

* connect to wifi, update os, configure locale
* optionally set screen configuration -> resolution
* in prefs, change hostname to `rbd01` and enable ssh.
* reboot when prompted

## Remote Editing with Visual Studio Code
You can [remote edit files remote](https://code.visualstudio.com/docs/remote/ssh) on other hosts via SSH!
Raspbian uses [mDNS](https://en.wikipedia.org/wiki/Multicast_DNS) to resolve hostnames, so it is reachable on the local net as `rbd01.local`.

On your Mac, install the Remote-SSH extension (the latest stable version; there may be several preview versions), then follow the instructions for [adding a remote](https://code.visualstudio.com/docs/remote/ssh).

* `ssh-keygen -t rsa -b 4096` (do NOT use passphrase, save as `rbd01_rsa`)
* `ssh-copy-id -i ~/.ssh/rbd01_rsa pi@rbd01.local`

Then:

* COMMAND-SHIFT-P: Remote-SSH: Open Configuration File and add IdentityFile ~/.ssh/rbd01_rsa
* connect to host using Remote-SSH: Connect to Host

## Setting up Node and NVM on Raspbian
Following instructions [here](https://linuxize.com/post/how-to-install-node-js-on-raspberry-pi/)

* `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
* `nvm install v10.19.0`
* `nvm alias default v10.19.0`

## Setting up Github Access on Raspberry Pi!

There's no need for the Raspberry Pi to have push access, though if necessary we can create a "machine user" on GitHub. For now I won't worry about it. So just do this:
* `git clone https://github.com/daveseah/bp2019-tennis.git`
* `cd bp2019-tennis/game`
* `nvm use`
* `npm ci`
* `npm run server; npm run client`

Next set global username and email for commits.
* `git config --global user.name "sri_rbd01"`
* `git config --global user.email "sri.nutmoon@gmail.com"`
