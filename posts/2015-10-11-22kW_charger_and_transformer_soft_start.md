---
title:  "How to build a 22kW charging station + soft starter for a 25kVA transformer"
date:   '2015-10-11'
URL: "/electronics/2015/10/11/22kW_charger_and_transformer_soft_start.html"
category: electronics
---

To enable faster charging of our EV, I needed 3 phase 400V. But in Norway, most houses only get 3 phase 230V (IT earthing system).
 In order to get 400V, a transformer is needed. In this project, you can see how I built my own 22kW charging station using 
 a cheap second hand transformer. I will also show you how you can soft start such a transformer to overcome the problem
 of high inrush current.
 
In the [previous post](/electronics/2015/10/08/soldering_thermal_fuse.html), I showed you how to solder those thermal fuses without damaging them.

Credits go to the helpful guys from the [EEVBlog forum](http://www.eevblog.com/forum/beginners/3-phase-isolating-transformer-shorted/) for helping
me building this.

<iframe src="https://www.youtube.com/embed/IALe5KcBb8c"></iframe>

## High res photos
Here are some close up photos:

The terminal block on top is the primary side. The terminal at the button is the secondary side. The neutral output is connected to ground.

![25kVA dYN transformer wiring](/images/22kW_charger/01_transformer.jpg "25kVA dYN transformer wiring")
![25kVA dYN transformer wiring](/images/22kW_charger/02_controller_and_soft_starter.jpg "Controller and soft starter")
![400V box with 32A circuit breaker and earth fault switch](/images/22kW_charger/03_400V_box.jpg "400V box with 32A circuit breaker and earth fault switch")
![230V input split and 32A circuit breaker with earth fault switch](/images/22kW_charger/04_input_splitter.jpg "230V input split and 32A circuit breaker with earth fault switch")
![Schematic](/images/22kW_charger/05_schematic.png "Schematic")
