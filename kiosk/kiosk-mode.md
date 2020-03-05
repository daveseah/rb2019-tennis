The general ideas are pulled from [this article](https://jonathanmh.com/raspberry-pi-4-kiosk-wall-display-dashboard/) and [this](https://toms3d.org/2019/09/19/building-a-digital-dashboard-software-setup/). We enable a 'dashboard.service' for systemd that will launch a script after the GUI is initialized.

REQUIRED INSTALLATION on top of RASPBIAN (Release 10 buster as of this writing):

1. `sudo apt-get install unclutter`
2. Make sure that `export DISPLAY=:0` is in `.bashrc` or somewhere so you can run `xset` if you need to. Test with `xset q`.

Assuming that the repo is in `~pi/RalphBaerDay/bp2019-tennis`:

* Copy the file `rbd-startup.sh` from the `kiosk` directory to `~pi` directory and `chmod +x` it
* Edit the file `/etc/systemd/system/dashboard.service` so it resembles the file from `kiosk/dashboard.service-ex`. The critical lines are `Requires=graphical.target`, `Environment=DISPLAY=:0.0`, `Type=simple`
* Test the script with `./rbd-startup` and ensure the browser launchers.
* Enable the service with `systemctl start dashboard.service` and use pi credentials twice until it's done
* `sudo reboot` to see that the pi comes up correctly
* Make sure the thing doesn't sleep

## VIDEO

The Pi has to be rebooted after changing display modes or audio modes with `sudo raspi-config`. Forcing 1280x720 mode in `raspi-config` will make the machine boot in that mode. However, the window server sets its own resolution; set that in PREFERENCES -> SCREEN CONFIGURATION 

## AUDIO

First check that the audio speaker icon in the desktop is not muted!

From terminal, `sudo raspi-config` and in _advanced options_ force the sound mode. The Pi4 supports audio over HDMI or headphone jack.
Note that the application must be CLICKED for sound to play (this is a Browser thing)

If your projector is saying DVI mode, then no sound is being sent. 

ON Pi4, audio is routed to HDMI0
https://github.com/raspberrypi/firmware/issues/1243
xrandr --listmonitors

I tried forcing /boot/config.txt to force hdmi drive, but that didn't work. As a last resort:
https://www.element14.com/community/message/269373/l/re-raspberry-pi-3-no-audio-through-hdmi#269373

```
sudo apt-get remove --purge alsa-utils*
sudo apt-get clean
sudo apt-get autoremove
sudo apt-get remove --purge alsamixer*
sudo apt-get clean
sudo apt-get autoremove

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install alsa-utils
sudo apt-get install alsamixer

sudo reboot

Then select the HDMI output using the speaker icon in the taskbar and that's it. I hope it works for you !
```


