---
title:  "Secure wireless communication for IoT devices"
date:   '2021-04-18'
URL:     "/software/2021/04/18/secure-wireless-communication-for-iot-devices.html"
category: software
---

Secure communication for IoT devices is very important, especially if the data
which is being sent and received is used (directly or indirectly) to control things, like heating 
or door openers. You don't want your neighbour to be able to pretend he is your weather station 
and send fake temperatures data which makes your heater believe it is freezing temperatures outside.

This post will show how to use encryption in a microcontroller, like for example an 
[Arduino](https://www.arduino.cc/), for secure communication, assuming unsecure underlying transport 
is used such as [LoRa](https://en.wikipedia.org/wiki/LoRa) or any other unsecure wireless protocol.

## Secret key
I will be using AES-256 for encryption, but any cipher which provides strong enough protection can 
be used really. [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) cipher uses 
symmetric keys which means that the same key is used both for encryption and decryption. 

This key must therefore be kept secret and is only shared between 
the devices which need to communicate with each other. Preferable different keys should be used for each IoT device
(the hub or server will have to know which key belongs to which device). It can for example 
be embedded directly into the firmware or stored in the flash somewhere on the device.

Encrypting messages using the AES-256 algorithm works as follows: the key and the plain text
message is provided as input to the `encrypt`-function which produces the encrypted message
as output. This encrypted message can then be sent to the receiver over an unsecure communication
channel as shown here:
    
![Basic encryption](/images/secure-wireless-communication-iot/encryption_1.svg "Basic encryption")

The receiver on the other side, which has the same key as the sender, can then decrypt
this message by using the `decrypt`-function of the AES-256 and the same key. 

Anyone eavesdropping the unsecure communication won't be able to decipher and understand
the content of the message. 

However, there is still a problem with this way of doing encryption:

## Replay attacks
Even though a third party eavesdropping those encrypted messages does not understand the exact content
of the message, he might still record and re-transmit the exact same messages, and the receiver 
won't be able to tell whether the message really does originate from the 
stated sender device or from the attacker. For example, an attacker might have recorded a 
message and learned somehow that this message can open a door. Then it doesn't matter that the 
attacker cannot decrypt the content of that message, he can just re-send the exact same message to 
open the door anyway. In other words, *authenticity* is not guaranteed. 

## One-time Message Authentication Code
To fix this, some form of Message Authentication code ([MAC](https://en.wikipedia.org/wiki/Message_authentication_code))
needs to be included in the message and it needs *change* for *ever* message the sender sends (called
a one-time code hereafter). This ensures that the encrypted message is different each time, even if 
the original plain text stays the same. 

Including a one-time code looks something like this:

![Basic encryption with One-time code](/images/secure-wireless-communication-iot/encryption_2.svg "Basic encryption with One-time code")

By including such a one-time code we have addressed the fact that the data transmitted over the air
is never the same.

### Mode of Operation
Care must be taken to use a secure "[mode of operation](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)" to
ensure that the *entire* encrypted message changes and not only parts of it. For example AES-256 with `GCM` operation mode
will do the trick.

Now we need a way for the receiver to validate the one-time
code and ensure somehow that this one-time code has not been used previously. How?

### Remember all used one-time codes
One possible approach could be to let the sender simply pick a new number each time, and the receiver 
simply stores all those random numbers which he has seen so far. Then the next one-time code
is only validated as long as it has not been seen previously. 

Unfortunately that won't work very well because a) it is impractical to store all seen codes because 
of the limited storage on the IoT device side and b) this is still prone to a "jamming attache" (see below).

### Counter / "rolling code"
Another solution, which is often used, is to store a single number which is simply increased for 
each message. Storing a single number requires very little storage, and the receiver just needs 
to check that this one-time code received is larger than the previously seen one-time code.

### Jamming attack
However, there is a know type of attack against this type of rolling codes: An attacker can simply send a 
jamming signal simultaneously as the original data being sent, but at a slightly different frequency. 
The frequency has to be close enough to disturb the receiver but far enough
to still be able to distinguish the original message from the jamming signal. 

The attacker now has a valid message recoded which has been disregarded by the receiver. The sender 
then typically retries and sends a new message and the attacker repeats the same technique for this 
second message as well. Now the attacker has 2 valid messages recorded. 

In order to silence the sender and not cause any suspicion, the attacker actually re-transmits the 
first recorded message which then is received correctly, and the door opens. The result is that the 
attacker has a second message recorded which he then can use at some later point in time.

See [RF Hacking: How-To Bypass Rolling Codes](https://hackaday.com/2016/03/06/rf-hacking-how-to-bypass-rolling-codes/) for more details on
how this works.

## Solution: Time based 
To prevent this kind of jamming attacks and yet have a way to validate one-time codes, something that 
expires after use is needed: using a timestamp as the one-time code is a good way to do this. 
The only requirement for this to work is that both the sender and receiver have
to maintain a clock and keep them the in sync.

### Time window
There also needs to be a predefined time window within which the received timestamp is considered valid
because it takes some time for the sender to produce and transmit the message.  

### Clock drifting problem
But no clock is perfect (especially not those cheap(er) crystals which we are using in our devices), and
the clocks will drift apart from each other sooner or later, resulting in that none of the one-time 
codes can be validated anymore.

To address the clock drifting problem, the IoT device needs a way to adjust the time of its clock as soon
as it detects that the received timestamp drifts too close towards one of the ends of the valid time
window.

But care has to be taken as to when clock adjustment are allowed. You do not want to make clock adjustments
for each receive valid message because that again could be exploited by using a replay attach
to force the IoT device to make clock adjustments, potentially making its clock stand still.

Therefore, only allowing a clock adjustment once per day, or using special time-adjust commands, for example 
should be good compromise.

## Hardware
If your IoT device is battery power, you could use a dedicated [Maxim DS3231SN#](https://no.mouser.com/ProductDetail/Maxim-Integrated/DS3231SN?qs=1eQvB6Dk1vhUlr8%2FOrV0Fw%3D%3D) 
RTC IC for time keeping. Using an external clock like this has the following advantages: 

- It can directly be powered by a (backup) battery, which is really nice because the battery voltage 
  changes of course over time as it becomes more discharged. No voltage regulator required.
- Ultra low current draw of 0.9µA to maintain the clock - which should give a couple of years 
  life-span from a coin cell type battery.
- The RTC IC, in combination with a PNP MOSFET, can be used control the power to your main IoT
  device by setting an alarm. When the IoT device needs to sleep, the DS3231SN cuts power and only
  enables power periodically according to its alarm setting.

In other words, such a dedicated RTC IC has two functions: A) maintain the clock for our secure
communication and B) switch power to the IoT device periodically in order to achieve long battery life.  

## In practice
GCM, which is the mode of operation which I am using for this example, requires a Nonce 
(which is called IV here). This can be any number and the only requirement is that it has 
to be unique. It is 12 bytes long so it is perfect for our timestamp (which is 32bits/4 bytes). The following 
illustration shows the final encryption process using GCM with AES-256:

![Final encryption process](/images/secure-wireless-communication-iot/encryption_3.svg "Basic encryption")

### Code example in C++
I am using the [Arduino Cypto-library](https://github.com/rweather/arduinolibs) for the code below. 
Here is the Class definition:

```cpp
#include <Crypto.h>
#include <AES.h>
#include <GCM.h>
#include "secrets.h"

/*
 * AES-256 GCM
 */
class CryptUtilClass
{
private:
    const unsigned char key[32] = AES265_GCM_KEY;
    unsigned char iv[12] = {0};

    unsigned char tag[16];
    GCM<AES256> *gcmaes256 = 0;

public:
    CryptUtilClass();

    int encrypt(
        unsigned char plaintext[],
        const size_t plaintextLen,
        unsigned char *dstBuff,
        const size_t dstBuffLen,
        const unsigned long time);

    bool decrypt(
        unsigned char ciphertextAndTagAndTime[],
        const size_t ciphertextAndTagAndTimeLength,
        unsigned char dstBuff[],
        const size_t dstBuffLength,
        const unsigned long time);
};
```

#### Encryption
And the `encrypt()` method:

```cpp
#include "crypto.h"
#include "utils.h"

CryptUtilClass::CryptUtilClass()
{
    gcmaes256 = new GCM<AES256>();
}

int CryptUtilClass::encrypt(
    unsigned char *plaintext,
    const size_t plaintextLen,
    unsigned char *dstBuff,
    const size_t dstBuffLen,
    const unsigned long time)
{

    size_t totalLength = plaintextLen + sizeof(tag) + sizeof(iv);
    if (dstBuffLen < totalLength)
    {
        return -1;
    }

    // setup
    gcmaes256->clear();
    gcmaes256->setKey(key, gcmaes256->keySize());

    // use the time as the IV/Nonce
    memset(iv, 0, sizeof(iv)); // zero IV from previous usage
    writeUint32(time, iv, 0);  // copy time into IV
    gcmaes256->setIV(iv, sizeof(iv));

    // perform the encryption
    gcmaes256->encrypt(dstBuff, plaintext, plaintextLen);
    // compute the authentication tag
    gcmaes256->computeTag(tag, sizeof(tag));

    // append the authentication tag to dstBuff
    dstBuff += plaintextLen;           // move the pointer forward to the end of the cipher text
    memcpy(dstBuff, tag, sizeof(tag)); // and append computed tag

    // finally, append the IV/Nonce in clear text
    dstBuff += sizeof(tag);          // move the pointer to after the tag
    memcpy(dstBuff, iv, sizeof(iv)); // and append IV/Nonce

    return totalLength;
}

```

### Decryption
The decryption process is more or less the same an encryption but in reverse:

![Final decryption process](/images/secure-wireless-communication-iot/encryption_4.svg "Basic encryption")

And here is the code:

```cpp
bool CryptUtilClass::decrypt(
    unsigned char ciphertextAndTagAndTime[],
    const size_t ciphertextAndTagAndTimeLength,
    unsigned char dstBuff[],
    const size_t dstBuffLength,
    const unsigned long time)
{
    gcmaes256->clear();

    size_t ciphertextSize = ciphertextAndTagAndTimeLength - sizeof(tag) - sizeof(iv);

    unsigned char *ptr = ciphertextAndTagAndTime;

    // extract the tag
    ptr += ciphertextSize;         // move pointer to after the ciphertext / start og tag
    memcpy(tag, ptr, sizeof(tag)); // copy out tag

    // extract the IV/Nonce - which contains the time
    ptr += sizeof(tag);          // move pointer to after the tag
    memcpy(iv, ptr, sizeof(iv)); // copy out IV

    // setup cipher
    gcmaes256->setKey(key, gcmaes256->keySize());

    // set IV/Nonce
    gcmaes256->setIV(iv, sizeof(iv));

    // decrypt the data (doesn't validate the tag)
    gcmaes256->decrypt(dstBuff, ciphertextAndTagAndTime, ciphertextSize);

    // check the tag
    if (!gcmaes256->checkTag(tag, sizeof(tag)))
    {
        Serial.println("Tag-validation failed");
        return false;
    }

    // good so far, extract the time from the IV/Nonce
    unsigned long receivedTime = toUInt(iv, 0);

    // compare with local time
    long delta = time - receivedTime;

    // allow 30 second clock slew
    if (delta > 15 || delta < -15)
    {
        Serial.println("Time-validation failed");
        return false;
    }

    return true;
}
```

## Conclusion
Using a time based one-time code ensures that all previously sent data expires and 
cannot be reused at a later point in time.

The power saving technique with the external RTC IC (DS3231SN) makes it is possible 
to use more powerful microcontrollers (which typically draw too much power in sleep mode) 
even in battery powered devices. Those can handle encryption/decryption which make it possible
to secure communication over an unsecure medium. 
