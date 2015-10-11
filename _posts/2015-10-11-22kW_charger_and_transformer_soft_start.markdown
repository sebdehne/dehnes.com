---
layout: post
title:  "How to build a 22kW charging station + soft starter for a 25kVA transformer"
date:   2015-10-11 20:00:00
author: Sebastian Dehne
videoid: IALe5KcBb8c
categories: electronics
---

To enable faster charging of our EV, I needed 3 phase 400V. But in Norway, most houses only get 3 phase 230V (IT earthing system).
 In order to get 400V, a transformer is needed. In this project, you can see how I built my own 22kW charging station using 
 a cheap second hand transformer. I will also show you how you can soft start such a transformer to overcome the problem
 of high inrush current.
 
In the [previous post](/electronics/2015/10/08/soldering_thermal_fuse.html), I showed you how to solder those thermal fuses without damaging them.

Credits go to the helpful guys from the [EEVBlog forum](http://www.eevblog.com/forum/beginners/3-phase-isolating-transformer-shorted/) for helping
me building this.
  
{% include youtube.html %}

## High res photos
Here are some close up photos:

### 25kVA dYN transformer wiring
The terminal block on top is the primary side. The terminal at the button is the secondary side. The neutral output is connected to ground.

<a href="/assets/images/22kW_charger/01_transformer.jpg" data-lightbox="pic" data-title="25kVA dYN transformer wiring">
	<img src="/assets/images/22kW_charger/01_transformer.jpg" alt="board"/>
</a>

### Controller & soft starter box 

<a href="/assets/images/22kW_charger/02_controller_and_soft_starter.jpg" data-lightbox="pic" data-title="Controller and soft starter">
	<img src="/assets/images/22kW_charger/02_controller_and_soft_starter.jpg" alt="board"/>
</a>

### 400V box with 32A circuit breaker and earth fault switch 

<a href="/assets/images/22kW_charger/03_400V_box.jpg" data-lightbox="pic" data-title="400V box with 32A circuit breaker and earth fault switch">
	<img src="/assets/images/22kW_charger/03_400V_box.jpg" alt="board"/>
</a>

### 230V input split and 32A circuit breaker with earth fault switch 

<a href="/assets/images/22kW_charger/04_input_splitter.jpg" data-lightbox="pic" data-title="230V input split and 32A circuit breaker with earth fault switch">
	<img src="/assets/images/22kW_charger/04_input_splitter.jpg" alt="board"/>
</a>
