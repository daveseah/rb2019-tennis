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
