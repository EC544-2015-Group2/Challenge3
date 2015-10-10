#include <QueueArray.h>
QueueArray <uint8_t> rxQueue;
void setup() {
  Serial.begin(9600);
  for(int i=0; i<5; i++)
    rxQueue.enqueue((uint8_t)i);
  delay(1000);
  while(!rxQueue.isEmpty())
    Serial.print(rxQueue.dequeue());
}

void loop() {
  // put your main code here, to run repeatedly:

}
