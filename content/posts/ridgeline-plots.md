+++
title = "Density Ridgeline Plots in D3.js"
description = "Using density ridgelines for fun and profit."
date = "2024-02-29"
author = "Xavier Tilley"
tags = ["javascript", "D3.js", "data visualization"]
categories = ["demos", "portfolio"]
+++

One of the most important parts of a diesel engine, from an environmental perspective, is it's aftertreatment system. This system is designed to clean up the diesel and it's exhaust. The two major components of diesel emissions are particulate matter (PM) and nitrous oxide (NOx). These emissions are always in some kind of equilibrium. If there's more PM then there is less NOx and vice versa. The air-to-fuel ratio in the combustion chamber has the biggest impact on this emission mixture. To help reduce emissions a diesel engine has three major systems; EGR, DPF, and SCR. The EGR, or exhaust gas recirculation, recycles inert gases into the combustion chamber to lower temperatures and reduce NOx, which increases PM. That's where the DPF, or diesel particulate filter, comes into play. It captures PM in it's honeycomb structure to reburn later in a regeneration cycle. The SCR facilitates the chemical decomposition of NOx into nitrogen and water with the help of DEF (diesel exhaust fluid) which contains ammonia or urea. Some carbon dioxide and sulfurous compounds are also created, but they are less harmful than NOx, in general (I'm not a chemist).

All of these systems having such complex interactions make the aftertreatment system a very difficult system to troubleshoot and diagnose. So how to know what information is important? And what is the best way to effectively communicate that information to a diesel technician who might not be used to interpreting statistical data? Through collaborations with the technicians, listening about how a small change on a sensor upstream effects the data from a downstream sensor, understanding the shortcomings of current software and tools available to technicians diagnosing engines in the shop, and learning how the systems work from experienced technician, we identified two sensors that can inform the technicians on the health of the entire system by focusing on the NOx conversion of the SCR. The lower the efficiency of this conversion, the more likely something has gone wrong. I made a ridgeline plot to show the efficiency, measured as a rolling average over a day, for seven days so technicians could easily identify trends in the data.

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