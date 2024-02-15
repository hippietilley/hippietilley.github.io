+++
title = "Interactive D3.js charts with HTMX"
description = """An example of how to use HTMX inside of a D3.js chart."""
date = "2024-02-15"
author = "Xavier Tilley"
tags = ["javascript", "D3.js", "HTMX", "data visualization"]
categories = ["demos", "portfolio"]
+++

In late 2022 I started working on a new data visualization at the day job. It was my first foray into D3.js, which I had been looking for an excuse to play with for a while. I was also having a lot of fun with HTMX, using it to load partial page templates in a cascading fashion. Cascading HTML sheets, if you will. These explorations led to a really nifty visualization, a timeline that used HTMX to load in charts of a specific occurence when you clicked on it.

{{< video src="htmx-and-d3-demo.mp4"
  title="A demo of the above described chart."
>}}