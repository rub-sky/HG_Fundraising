var svgBarGraph = d3.select("svg.svgBarGraph");

var sbgWidth = 960;
var sbgHeight = 500;
var totalGoal = 440000; // Total Goal to collect

var svg = d3.select("div.bar_container");
var margin = {top: 20, right: 20, bottom: 30, left: 60};

var width = svgBarGraph.attr("width") - margin.left - margin.right;
var height = svgBarGraph.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var y = d3.scaleLinear().rangeRound([height, 0]);

var g = svgBarGraph.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./TotalCollected.csv",
    function(error, data) {
        if (error) throw error;

        data.forEach(function(d){
            d.Amount_Collected = +d.Amount_Collected;
        });

        console.log(data);

        x.domain(data.map(function(d) { return d.Date; }));
        y.domain([0, 450000]);

        g.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis-y")
            .call(d3.axisLeft(y).ticks(7))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 100)
            .attr("dy", "100px")
            .attr("text-anchor", "end")
            .text("Amount Collected");

        var barGroup = g.append("g")
            .attr("class", "bar-group")
            .selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar-set");

        barGroup.append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Date); })
            .attr("y", function(d) { return y(d.Amount_Collected); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.Amount_Collected); });

        barGroup.append("text")
            .attr("class", "bar-percent")
            .attr("x", function (d) { return x(d.Date)+ (x.bandwidth() / 2); })
            .attr("y", function (d) { return y(d.Amount_Collected)-10; })
            .text(function (d) { return (((d.Amount_Collected / totalGoal) * 100).toFixed(0)) +'%'; });
    }
);