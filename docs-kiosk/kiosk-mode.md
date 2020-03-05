We enable a 'rbd.service' for systemd that launches our `autostart.sh` script after the GUI is initialized. This is based on [this article](https://jonathanmh.com/raspberry-pi-4-kiosk-wall-display-dashboard/). It's a little different from other articles which describe modify `/etc/xdg/lxsession/LXDE-pi/autostart` in that it's an os service rather than part of the window manager (LXDE = lightweight X11 desktop environment). 

These instructions were tested on a Pi4 running Raspbian 10 "buster". 

## Additional Setup

Assumed: you've already tested that the game compiles and runs before enabling the kiosk-style operaiton.

Next, we install some **prerequisites**. 

1. `sudo apt-get install unclutter` ... this hides the mouse cursor
2. In `~/.bashrc`, make sure `export DISPLAY=:0` is defined in it somewhere. This is required for the `xset` command.

## Installing Autostart Functions

Assuming that the repo is in `/home/pi/RBD/bp2019-tennis`:

1. Test `./autostart.sh`
   You may have to update the file to reflect the actual location of this file.
   If the browser comes up, great! It takes about 10 seconds for the process to complete after the desktop appears.
   Type CTRL-C to kill the process.
2. Create the rbd.service from the command line
3. `sudo touch /etc/systemd/system/rbd.service`
   `sudo nano /etc/systemd/system/rbd.service`
   Copy the lines from `rbd.service.example` into the real `rbd.service` file
4. `systemctl enable rbd.service`
5. `sudo reboot` to see if it works

## VIDEO

The Pi has to be rebooted after changing display modes or audio modes with `sudo raspi-config`. Forcing 1280x720 mode in `raspi-config` will make the machine boot in that mode. However, the window server sets its own resolution; set that in PREFERENCES -> SCREEN CONFIGURATION 

## BACKGROUND SCRENSHOT
TEST PATTERNS
https://www.doctorojiplatico.com/2012/12/please-stand-by-test-pattern-test-card.html

## AUDIO

First check that the audio speaker icon in the desktop is not muted! 

HDMI output is default routed to HDMI0 (the one closest to power plug), but it doesn't always enable.
Instructions online say to edit `/boot/config.txt` to force `hdmi_drive=2`, but this isn't guaranteed to work.
Check the headphone jack output to see if it's working. 




