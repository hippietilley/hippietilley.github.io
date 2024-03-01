import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const themeButton = document.querySelector('.theme-toggle');
const wrapper = d3.select('#chart-wrapper');

const colors = ["#FA5659", "#FB824B", "#F5A24B", "#EEC842", "#6BC456", "#7DA1EF", "#685DEA"];

const margin = {top: 50, left:50, bottom: 50, right: 30};

const width = 900;
const height = 600;
const overlap = 70;

let fontColor = getComputedStyle(document.querySelector('.theme-container')).color;
const ridgelineData = [
  {'date': '2024-01-21', 'values': [0.72, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.56, 0.0, 0.0, 0.0, 1.08, 0.0, 0.76, 0.83, 1.58, 1.51, 9.49, 34.26, 49.22]},
  {'date': '2024-01-22', 'values': [1.07, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.72, 1.98, 0.93, 0.0, 2.6, 2.08, 0.91, 1.01, 1.77, 2.98, 3.91, 2.98, 4.6, 6.77, 6.8, 5.47, 3.88, 8.6, 8.02, 7.71, 19.43, 2.79, 0.0]},
  {'date': '2024-01-23', 'values': [0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.54, 0.0, 0.0, 0.55, 0.0, 0.65, 0.0, 0.0, 0.0, 0.49, 0.0, 0.66, 0.52, 1.04, 0.46, 2.36, 2.11, 3.03, 8.19, 10.51, 18.35, 22.99, 20.2, 6.54]},
  {'date': '2024-01-24', 'values': [4.77, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 9.63, 9.43, 13.88, 0.0, 5.26, 4.92, 0.0, 0.0, 10.18, 16.24, 10.42, 10.13, 5.13, 0.0, 0.0]},
  {'date': '2024-01-25', 'values': [2.29, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.86, 0.0, 0.0, 1.24, 1.67, 1.18, 2.27, 3.43, 5.69, 20.61, 49.1, 11.66, 0.0]},
  {'date': '2024-01-26', 'values': [18.4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 8.11, 8.43, 0.0, 9.97, 0.0, 0.0, 0.0, 0.0, 9.38, 18.57, 9.4, 0.0, 0.0, 0.0, 7.86, 9.88, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]},
  {'date': '2024-01-27', 'values': [0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.15, 0.0, 0.91, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.85, 0.86, 4.71, 4.49, 9.25, 21.74, 38.59, 14.65, 1.8]}
]

// Common vars
const dates = ridgelineData.map(d => new Date(d.date));

// Ridgeline
// Index data
var ridgelineValues = ridgelineData.map(d => d.values);
var indexedRidgeData = ridgelineValues.map(d => d.map((x, i) => [2 * i + 1, x]));

// Scales
const ridgeX = d3.scaleLinear()
  .domain([-10, 101]).nice()
  .range([margin.left, width - margin.right]);

const ridgeY = d3.scaleBand()
  .domain(dates)
  .range([height - margin.bottom - margin.top, margin.top])
  .paddingInner(0)
  .paddingOuter(0.3)
  .align(1);

const ridgeZ = d3.scaleLinear()
  .domain([0, (d3.max(ridgelineData, d => (d3.max(d.values))) / 4)]).nice()
  .range([0, -overlap * ridgeY.step()]);

// Compute densities
const kde = kernelDensityEstimator(kernelEpanechnikov(2), ridgeX.ticks(80));
var allDensity = []
for (var i = 0; i < dates.length; i++) {
  var key = dates[i];
  var density = kde(indexedRidgeData[i]);
  allDensity.push({date: key, density: density, index: i})
}

// KDE generator
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return v[1] * kernel(x - v[0]); })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

function buildSVG() {
  // Build ridgeline
  const ridgelineSVG = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height]);

  // Draw x axis
  ridgelineSVG.append("g")
    .style("font-size", "16")
    .attr("transform", `translate(0, ${height - (margin.bottom * 1.5)})`)
    .call(
      d3.axisBottom(ridgeX)
      .tickValues([0,10,20,30,40,50,60,70,80,90,100]))
    .select(".domain").remove();

  ridgelineSVG.append("text")
    .style("font-size", "20")
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("y", height - 10)
    .attr("fill", fontColor)
    .attr("text-anchor", "center")
    .text("Efficiency (%)");

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
  wrapper.node().appendChild(ridgelineSVG.node());
}

buildSVG();

themeButton.addEventListener('click', (e) => {
  wrapper.select("svg").remove();
  fontColor = getComputedStyle(document.querySelector('.theme-container')).color;
  buildSVG();
});