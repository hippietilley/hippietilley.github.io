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

The first element of this visualization is a timeline of events (aftertreatment regenerations on a diesel engine). These event are categorized into six different categories with an additional "uncategorized" category. So we have a y axis for categories and an x axis for dates.

```js
const y = d3.map(data, d => {
  if (d.regen_category == '') {
    return 'uncategorized';
  } else {
    return d.regen_category;
  }
});
const yDomain = categories.map(d => d[0]);
const yDisplay = categories.map(d => d[1]);
const yScale = d3.scaleBand()
  .domain(yDomain)
  .rangeRound([margin.top, height - margin.bottom])
  .paddingInner(0.3)
  .paddingOuter(0.2)
  .align(0);
// The colorScale is used to color code the different categories
const colorScale = d3.scaleOrdinal()
  .domain(yDomain)
  .range(categoryColors.map(d => d[1]));

const x = d3.map(data, d => new Date(d.start_date));
const xDomain = [Date.now() - 12 * 24 * 60 * 60 * 1000, Date.now()];
const xScale = d3.scaleTime()
  .domain(xDomain)
  .range([margin.left, width - margin.right]);
```

During development, I noticed that sometimes there would be events that overlapped in the timeline. To keep the individual events clickable, I made the timeline zoomable on the x axis only.

```js
// Add scaleable axis
const gx = svg.append("g");

// z holds a copy of the previous transform, so we can track its changes
let z = d3.zoomIdentity;

// set up the ancillary zooms and an accossor for their transforms
const zoomX = d3.zoom().scaleExtent([1, 5]);
const tx = () => d3.zoomTransform(gx.node());
gx.call(zoomX).attr("pointer-events", "none");

// active zooming
const zoom = d3.zoom().on("zoom", function(e) {
  const t = e.transform;
  const k = t.k / z.k;
  const point = center(e, this);

  // is it on an axis?
  const doX = point[0] > xScale.range()[0];

  if (k === 1) {
    // pure translation?
    doX && gx.call(zoomX.translateBy, (t.x - z.x) / tx().k, 0);
  } else {
    // if not, we're zooming on a fixed point
    doX && gx.call(zoomX.scaleBy, 1 / k)
  }
  z = t;
  redraw();
});

// Zoom helper functions
// Find the center of the pointer(s), handles multitouch
function center(event, target) {
  if (event.sourceEvent) {
    const p = d3.pointers(event, target);
    return [d3.mean(p, d => d[0]), d3.mean(p, d => d[1])];
  }
  return [width / 2, height / 2];
}

function redraw() {
  const xRescaled = tx().rescaleX(xScale);
  gx.call(xAxis, xRescaled);
  regens.attr("cx", i => xRescaled(X[i]));
}

// Add zoom to svg
svg.call(zoom)
  .call(zoom.transform, d3.zoomIdentity.scale(0.8))
  .node();
```

Each event has it's own chart which is loaded below the timeline whenever an event is clicked. HTMX is used to handle this request and load a partial template.

```js
function regenClicked(event) {
  const regenId = event.target.attributes.title.value;
  htmx.ajax('GET', `/regen-chart/${regenId}/`, '#regen-chart');
}
```

This visualization was a lot of fun to build.