// DELTA PADDLE
// sends accumulated delta values that clear

// PIN ASSIGNMENTS
#define ENCODER0PINA 2 // Must support interupts
#define ENCODER0PINB 3 // Must support interupts
#define LOCSWITCH0 5 // Controller L/R detect pin; default to L

// CONSTANTS
#define MAX 32000
#define MIN -32000

// GLOBALS
volatile int encoder0Pos = 0;
volatile boolean encoderChanged = true;
volatile char controlLoc = 'X'; // overwritten during setup

// SETUP
void setup()
{
  pinMode(ENCODER0PINA, INPUT);
  pinMode(ENCODER0PINB, INPUT);
  pinMode(LOCSWITCH0, INPUT);

  // encoder pin on interrupt 0 (pin 2)
  // encoder pin on interrupt 1 (pin 3)
  attachInterrupt(0, doEncoderA, CHANGE);
  attachInterrupt(1, doEncoderB, CHANGE);

  // serial port connection to computer
  Serial.begin(115200);
  Serial.println("!BP2020-DELTA-ENCODER");
  if (digitalRead(LOCSWITCH0) == LOW) {
    controlLoc = 'R';
    Serial.println("!Starting Right Controller");
  } else {
    controlLoc = 'L';
    Serial.println("!Starting Left Controller");
  }
}

// MAIN RUN-LOOP
void loop() {
  // Output current position and controller location
  // ex: "R3034\n" for right controller
  // ex: "L3034\n" for left controller
  if (encoderChanged) {
    Serial.print(controlLoc);
    Serial.println(encoder0Pos, DEC);
    encoder0Pos = 0;
    encoderChanged = false;
  } else {
    // limit input rate to 60fps-ish
    delay(16);
  }
}

// HELPER FUNCTIONS
int incrementPos() {
  if (encoder0Pos < MAX)
    ++encoder0Pos;
  encoderChanged = true;
  return encoder0Pos;
}

int decrementPos() {
  if (encoder0Pos > MIN)
    --encoder0Pos;
  encoderChanged = true;
  return encoder0Pos;
}

// INTERRRUPT FUNCTIONS
// Channel A Interupt Routine
void doEncoderA() {
  // look for a low-to-high on channel A
  if (digitalRead(ENCODER0PINA) == HIGH) {
    // check channel B to see which way encoder is turning
    if (digitalRead(ENCODER0PINB) == LOW) decrementPos();
   else incrementPos();
  } else { 
    // Must be a high-to-low transistion
    if (digitalRead(ENCODER0PINB) == HIGH) decrementPos();
    else incrementPos();
  }
}

// Channel B Interupt Routine
void doEncoderB() {
  // look for a low-to-high on channel B
  if (digitalRead(ENCODER0PINB) == HIGH) {
    // check channel A to see which way encoder is turning
    if (digitalRead(ENCODER0PINA) == HIGH) decrementPos();
    else incrementPos();
  } else { // Must be a high-to-low transistion
    if (digitalRead(ENCODER0PINA) == LOW) decrementPos();
    else incrementPos();
  }
}