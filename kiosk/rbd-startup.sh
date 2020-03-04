#!/bin/bash
# kiosk mode: https://jonathanmh.com/raspberry-pi-4-kiosk-wall-display-dashboard/
# script control: https://spin.atomicobject.com/2017/08/24/start-stop-bash-background-process/
#
# 1. Copy this file to ~pi/rbd-startup.sh and chmod +x it
# 2. Then setup dashboard.service file to point to it
#    sudo nano /etc/systemd/system/dashboard.service
#    See example 'dashboard.service-ex'
# 3. Test with ./rbd-startup.sh
# 4. If it works, then
#    systemctl enable dashboard.service
# 5. Reboot to see if it works

trap "kill 0" EXIT

xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &

sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

cd RalphBaerDay/bp2019-tennis/game
npm run server &
npm run client &
/usr/bin/chromium-browser --no-first-run --noerrdialogs --disable-infobars --kiosk http://localhost:3000 &

# to test: sh ./rbd-startup
# systemctl start dashboard.service to enable
# systemctl stop dashboard.service

wait