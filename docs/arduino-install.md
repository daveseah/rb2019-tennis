## Padding Encoder Wiring Setup

```
DIGITAL PIN2:
    encoder WHITE to 10K to VCC
DIGITAL PIN3:
    encoder GREEN to 10K to VCC
VCC:
    encoder RED
GRND:
    encoder BLACK

DIGITAL PIN5
    GND = LEFT
    VCC = RIGHT
```

## Prepping Arduino

Load `arduino/controller-paddle.ino` into the IDE.
Plugin the Arduino board you're using.
Send code to the board.
Turn on SERIAL MONITOR to debug.
Twiddle knob to see encoder values changing.
