+++
title = "Density Ridgeline Plots in D3.js"
description = "Using density ridgelines for fun and profit."
date = "2024-02-29"
author = "Xavier Tilley"
tags = ["javascript", "D3.js", "data visualization"]
categories = ["demos", "portfolio"]
draft = true
+++

One of the most important parts of a diesel engine, from an environmental perspective, is it's aftertreatment system. Specifically, the selective catalytic reduction or SCR system that is responsible for reducing nitrous oxide (NOx) emissions. Aftertreatment systems can also be very... finicky. To keep the NOx from flowing the aftertreatment system has to go through a regeneration cycle where the honeycomb-like mesh, catalyzed diesel particulate filter or DPF in diesel speak, that captures the NOx is superheated to burn off the contaminants. This cycle behaves differently depending on the state of the vehicle at the time a regeneration is needed and so the data that engine sensors collect looks different for different for different cycle types. This can make it difficult to diagnosis a problematic aftertreatment system.

So how do you know when something is wrong with the aftertreatment system? And how do display data about the SCR or DPF to a technician who may or may not have a robust statistics background so that they can intuitively understand what is happening in the aftertreatment system?

There's a sensor for measuring input and output NOx so you can get a measure of how efficiently the DPF is storing NOx. The lower the efficiency, the more likely something has gone wrong. When I was faced with this data visualization problem at my old day job, my solution was a ridgeline chart. The data science team generated a list of efficiencies calculated from the above sensor data for each day. Using those lists I created kernel density estimations of each day and then stacked several days worth of charts on top of each other. The original idea data science provided was based on histograms, but the shape of the data seemed more important than precision of data.

{{< d3 src="/scripts/dpf-ridgeline.js">}}

Let's dig into the code a bit. The general steps here are get the data, construct your scales, generate your density plots, throw it all together in an SVG.
```js
  // Getting data
  const dates = ridgelineData.map(d => new Date(d.date));

  // The redgeline values indexed and weighted here. I don't remember why that was important, but it was very important
  var ridgelineValues = ridgelineData.map(d => d.values);
  var indexedRidgeData = ridgelineValues.map(d => d.map((x, i) => [2 * i + 1, x]));

  // Construct scales
  // The x scale will be used as the x axis for every individual density plot
  const ridgeX = d3.scaleLinear()
    .domain([-10, 101]).nice()
    .range([margin.left, width - margin.right]);

  // The y scale is the y axis of the whole chart, each band is one day
  const ridgeY = d3.scaleBand()
    .domain(dates)
    .range([height - margin.bottom - margin.top, margin.top])
    .paddingInner(0)
    .paddingOuter(0.3)
    .align(1);

  // The z scale is the y axis of each individual density plot
    const ridgeZ = d3.scaleLinear()
    .domain([0, (d3.max(ridgelineData, d => (d3.max(d.values))) / 4)]).nice()
    .range([0, -overlap * ridgeY.step()]);
```

To generate KDE plots you need a kernel. I used the Epanechnikov kernel for it's ease of implementation.

```js
  function kernelDensityEstimator(kernel, thresholds) {
    return function(V) {
      return thresholds.map(function(x) {
        return [x, d3.mean(V, function(v) { return v[1] * kernel(x - v[0]); })];
      });
    };
  }

  function kernelEpanechnikov(bandwidth) {
    return function(v) {
      return Math.abs(v /= bandwidth) <= 1 ? 0.75 * (1 - v * v) / bandwidth : 0;
    };
  }
```

Once you have your kernel and estimator it's time to run your data through it. I chose a bandwidth of 2 and a threshold of `ridgeX.ticks(80)` through trial and error.

```js
// Compute densities
  const kde = kernelDensityEstimator(kernelEpanechnikov(2), ridgeX.ticks(80));
  var allDensity = []
  for (var i = 0; i < dates.length; i++) {
    var key = dates[i];
    var density = kde(indexedRidgeData[i]);
    allDensity.push({date: key, density: density, index: i})
```

The x axis of each chart will show the density plot of the efficiency values. The y axis will show the date and the z axis will be used to determine the y values of the curve.

```js
  // Draw x axis
  ridgelineSVG.append("g")
    .style("font-size", "16")
    .attr("transform", `translate(0, ${height - (margin.bottom * 1.5)})`)
    .call(
      d3.axisBottom(ridgeX)
      .tickValues([0,10,20,30,40,50,60,70,80,90,100]))
    .select(".domain").remove();

  // Draw y axis
  ridgelineSVG.append("g")
    .style("font-size", "16")
    .attr("transform", `translate(${margin.left + 10}, ${0 + (margin.top / 2)})`)
    .call(d3.axisLeft(ridgeY)
      .tickSize(0)
      .tickFormat(d3.timeFormat("%b %e")))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - margin.left - margin.right)
      .attr("stroke", "#000002")
      .attr("stroke-width", ridgeY.bandwidth() - 3)
      .attr("stroke-opacity", 0.1));

  // Draw areas
  ridgelineSVG.selectAll("areas")
    .data(allDensity)
    .enter()
    .append("path")
      .attr("transform", d => `translate(0, ${ridgeY(d.date) + margin.top + (margin.bottom / 2)})`)
      .attr("fill", d => colors[d.index])
      .datum(d => d.density)
      .attr("opacity", 0.65)
      .attr("stroke", d => colors[d.index])
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 0.1)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return ridgeX(d[0]);})
        .y(function(d) { return ridgeZ(d[1]);})
      );
```