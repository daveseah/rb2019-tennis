#define encoder0PinA  2
#define encoder0PinB  3
#define homeswitch0   4
#define MAX 65535
#define MIN 0

volatile unsigned int encoder0Pos = 0;

void setup() {
  pinMode(encoder0PinA, INPUT);
  pinMode(encoder0PinB, INPUT);
  pinMode(homeswitch0, INPUT);

  // encoder pin on interrupt 0 (pin 2)
  attachInterrupt(0, doEncoderA, CHANGE);

  // encoder pin on interrupt 1 (pin 3)
  attachInterrupt(1, doEncoderB, CHANGE);


  Serial.begin (115200);
  Serial.println ("BP2019-ENCODER");
}

void loop() {
  // Do stuff here
  if (digitalRead(homeswitch0) == LOW) {
    encoder0Pos = 0;
  }
  Serial.println (encoder0Pos, DEC);
}

int incrementPos() {
  if (encoder0Pos<MAX) ++encoder0Pos;
  return encoder0Pos;
}

int decrementPos() {
  if (encoder0Pos>MIN) --encoder0Pos;
  return encoder0Pos;
}

void doEncoderA() {
  // look for a low-to-high on channel A
  if (digitalRead(encoder0PinA) == HIGH) {
    // check channel B to see which way encoder is turning
    if (digitalRead(encoder0PinB) == LOW) incrementPos();
    else decrementPos();
  }
  // must be a high-to-low edge on channel A  
  else 
  {
    // check channel B to see which way encoder is turning
    if (digitalRead(encoder0PinB) == HIGH) incrementPos();
    else decrementPos();
  }
  // Serial.println (encoder0Pos, DEC);
}

void doEncoderB() {
  // look for a low-to-high on channel B
  if (digitalRead(encoder0PinB) == HIGH) {
    // check channel A to see which way encoder is turning
    if (digitalRead(encoder0PinA) == HIGH) incrementPos();
    else decrementPos();
  }
  // Look for a high-to-low on channel B
  else 
  {
    // check channel B to see which way encoder is turning
    if (digitalRead(encoder0PinA) == LOW) incrementPos();
    else decrementPos();
  }
}
