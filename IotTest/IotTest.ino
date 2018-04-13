/************************************************************************************************/
/*                                                                                              */
/* Heavily inspired from and use the actual code base:                                          */
/* https://github.com/sillevl/Simple-LoRaWAN                                                    */
/* https://github.com/rocketscream/MiniUltraPro/blob/master/ttn-otaa-sleep.ino                  */
/* https://github.com/matthijskooijman/arduino-lmic/blob/master/examples/ttn-otaa/ttn-otaa.ino  */
/* https://github.com/tijnonlijn/RFM-node/blob/master/RFM-basic.ino                             */
/* https://www.thethingsnetwork.org/labs/story/build-the-cheapest-possible-node-yourself        */
/*                                                                                              */
/************************************************************************************************/


#include <LowPower.h>
#include <lmic.h>
#include <OOlmic.h>

// This EUI must be in little-endian format, so least-significant-byte
// first. When copying an EUI from ttnctl output, this means to reverse
// the bytes. For TTN issued EUIs the last bytes should be 0xD5, 0xB3,
// 0x70.
uint8_t APPEUI[8] = { 0x7F, 0xBA, 0x00, 0xD0, 0x7E, 0xD5, 0xB3, 0x70 };

// This should also be in little endian format, see above.
uint8_t DEVEUI[8] = { 0x53, 0xDD, 0x34, 0x94, 0x71, 0xF9, 0x10, 0x00 };

// This key should be in big endian format (or, since it is not really a
// number but a block of memory, endianness does not really apply). In
// practice, a key taken from ttnctl can be copied as-is.
// The key shown here is the semtech default key.
uint8_t APPKEY[16] = { 0x48, 0x29, 0xD7, 0xE8, 0xD6, 0x9D, 0xEF, 0x66, 0x7C, 0x19, 0x41, 0xFD, 0x88, 0xD6, 0x47, 0x73 };

OOlmic lorawan(APPEUI, DEVEUI, APPKEY); // Initialize the connection to The Things Network

boolean readyToSend = true;

int potVal = 0;
int tempVal = 0;

void setup() {
  Serial.begin(57600);
  lorawan.setTXCompleteHandler(&TXCompleteHandler); // A callback that is fired when a LoRaWAN transmission has finished
  lorawan.setRXHandler(&RXHandler); // A callback that is fired when a message is received from the gateway
}

void loop() {
  lorawan.updateLoRa(); //Needed to run every cycle in order to update the LoRaWAN implementation (the lmic library)

  tempVal = analogRead(A0);

	if (readyToSend)
	{
	  char *str = "AUROX";
      //sprintf(str, "%d", potVal);
      
      lorawan.send(str); // Send actual data to The Things Network
      readyToSend = false;
      delay(5000);
	}
  
  
}

//The actual callback function that is referenced above (remember to keep the "&" in the setTXCompleteHandler functoion above)
void TXCompleteHandler(){
  Serial.println(F("In TXCompleteHandler"));
  Serial.flush();
  //for(int i=0; i<10;i++)
    //LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF); // Puts the micro controller to sleep for 8 seconds

  readyToSend = true;
}

// The callback function that is fired when a message is received from the gateway
void RXHandler(char mess[]){
  Serial.print("In RXHandler: ");
  Serial.print(mess);
  Serial.println();
}
