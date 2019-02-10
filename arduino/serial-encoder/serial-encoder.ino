// PIN ASSIGNMENTS
#define ENCODER0PINA 2 // Must support interupts
#define ENCODER0PINB 3 // Must support interupts
#define HOMESWITCH0 4  // Comment out if no home switch

// CONSTANTS
#define MAX 65535
#define MIN 0

// GLOBALS
volatile unsigned int encoder0Pos = 0;

// SETUP
void setup()
{
  pinMode(ENCODER0PINA, INPUT);
  pinMode(ENCODER0PINB, INPUT);
#ifdef HOMESWITCH0
  pinMode(HOMESWITCH0, INPUT);
#endif
  // encoder pin on interrupt 0 (pin 2)
  attachInterrupt(0, doEncoderA, CHANGE);

  // encoder pin on interrupt 1 (pin 3)
  attachInterrupt(1, doEncoderB, CHANGE);

  Serial.begin(115200);
  Serial.println("BP2019-ENCODER");
}

// MAIN RUN-LOOP
void loop()
{
// Check the home switch status
// if activated, zero position
#ifdef HOMESWITCH0
  if (digitalRead(HOMESWITCH0) == LOW)
  {
    encoder0Pos = 0;
  }
#endif

  // Output current position
  Serial.println(encoder0Pos, DEC);
}

// FUNCTIONS
int incrementPos()
{
  if (encoder0Pos < MAX)
    ++encoder0Pos;
  return encoder0Pos;
}

int decrementPos()
{
  if (encoder0Pos > MIN)
    --encoder0Pos;
  return encoder0Pos;
}

// Channel A Interupt Routine
void doEncoderA()
{
  // look for a low-to-high on channel A
  if (digitalRead(ENCODER0PINA) == HIGH)
  {
    // check channel B to see which way encoder is turning
    if (digitalRead(ENCODER0PINB) == LOW)
      incrementPos();
    else
      decrementPos();
  }
  else
  { // Must be a high-to-low transistion
    if (digitalRead(ENCODER0PINB) == HIGH)
      incrementPos();
    else
      decrementPos();
  }
}

// Channel B Interupt Routine
void doEncoderB()
{
  // look for a low-to-high on channel B
  if (digitalRead(ENCODER0PINB) == HIGH)
  {
    // check channel A to see which way encoder is turning
    if (digitalRead(ENCODER0PINA) == HIGH)
      incrementPos();
    else
      decrementPos();
  }
  else
  { // Must be a high-to-low transistion
    if (digitalRead(ENCODER0PINA) == LOW)
      incrementPos();
    else
      decrementPos();
  }
}
