The general idea is pulled from [this article](https://jonathanmh.com/raspberry-pi-4-kiosk-wall-display-dashboard/) and [this](https://toms3d.org/2019/09/19/building-a-digital-dashboard-software-setup/)

1. `sudo apt-get install unclutter`
2. `sudo nano /etc/xdg/lxsession/LXDE-pi/autostart` 
3. add the following lines
```
@xscreensaver -no-splash # disable screensaver
@xset s 0 0
@xset s noblank
@xset s noexpose
@xset dpms 0 0 0
@unclutter -idle 0
@chromium-browser --kiosk --incognito http://localhost:3000
```
Make sure that `export DISPLAY=:0` is in `.bashrc` or somewhere.
