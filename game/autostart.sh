#!/bin/bash
# kiosk mode: https://jonathanmh.com/raspberry-pi-4-kiosk-wall-display-dashboard/
# script control: https://spin.atomicobject.com/2017/08/24/start-stop-bash-background-process/
#
# see kiosk-mode.md for a description

# ctrl-c will kill all processes spawned by this script
trap "kill 0" EXIT

# disable monitor screen saving
xset s noblank
xset s off
xset -dpms

# disable mouse cursor
unclutter -idle 0.5 -root &

# rewrite chromium confirmation to not throw messy errors
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

# run the game client and server
cd /home/pi/RBD/btt2020/game/

npm run server &
npm run client &

# wait for the servers to spool up
sleep 10s

# launch chromium in kiosk mode
/usr/bin/chromium-browser --no-first-run --noerrdialogs --disable-infobars --kiosk http://localhost:3000 &

# (1) test that this script works
# (2) see kiosk-mode.md for details on adding systemd service
# (3) systemctl start rbd.service

# wait for all processes to complete, which never happens
# since they don't ever complete, waiting just makes it easier to
# debug this script
wait