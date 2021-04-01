---
title:  "Garage door controller – part 2"
date:   '2012-02-25'
URL: "/electronics/2012/02/25/garage_door_2.html"
category: electronics
---

The finished PCB has arrived quite a while ago now and has been assembled as well. Time to upload the final part of this project to see some results.

I selected [Beta Layout](http://www.pcb-pool.com/) as the PCB manufacturer for this project with quite satisfying results. I especially liked that they sent me automated pictures of the board after each manufacture step, which turned out to be very useful. Using those, I was able to detect that the holes had been drilled using the wrong drill sizes. They recognized this error and produced a new board with the correct hole sizes within the agreed delivery date.

The final board:

![The final PCB](/images/garage_door-2/20120316_181912.jpg "The final PCB")

The solder mask, silkscreen and the plated holes are features that make the board look so much better, compared to a home made board.

Assembling the board was easy, especially soldering with plated holes is fun. Except the miscalculated package for the 
trim-pot (I had to use the square blue pot instead of a round shaped one), everything worked out well. Here is the assembled board:

![Assembled 1](/images/garage_door-2/20120316_182215.jpg "Assembled 1")
![Assembled 2](/images/garage_door-2/20120316_182056.jpg "Assembled 2")

The orange wire is the antenna I’m using. It is good enough to bridge the distance to the garage. One of the LED’s blink when a RF 
signal has been received and the other LED blinks when a RF signal has been sent (such as the current status of the door and light).

This board fits nicely in the following case:

![Enclosure](/images/garage_door-2/20120316_182536.jpg "Enclosure")

The final controller is then connected via the 6p6c jack connector to the existing door opener like this:

![Installation](/images/garage_door-2/20120316_184012.jpg "Installation")

To open and close the garage door, I’ve written a simple Android app which talks to my home server via JSON/REST via wifi. 
This server has my [general purpose RF transceiver](/electronics/2010/10/10/rf_transceiver.html) connected to it which is used 
to communicate with this controller over 433Mhz RF. 

Here is a short demo of the final application:

<iframe id="ytplayer" type="text/html" allow="fullscreen;" src="https://www.youtube.com/embed/vr_u_xqNE3A"></iframe>

Thanks for comments and feedback.

