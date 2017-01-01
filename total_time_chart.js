var svgBarGraph = d3.select("svg.svgBarGraph");

var sbgWidth = 500;
var sbgHeight = 300;
var ibHeight = 30;
var ibWeight = 100;
var totalGoal = 440000; // Total Goal to collect

var svg = d3.select("div.bar-container");
var margin = {top: 20, right: 20, bottom: 30, left: 60};

var width = svgBarGraph.attr("width") - margin.left - margin.right;
var height = svgBarGraph.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var y = d3.scaleLinear().rangeRound([height, 0]);

var g = svgBarGraph.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var infoBubble = svgBarGraph.append("g")
    .attr("class", "svg-info-bubble-cont");

var infoBubbleRect = infoBubble.append("rect")
        .attr("class", "svg-info-bubble-rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 7)
        .attr("ry", 7)
        .attr("height", 30)
        .attr("width", 100);

var infoBubbleText = infoBubble.append("text")
    .attr("x", 50)
    .attr("y", 30)
    .attr("class", "svg-info-bubble-text")
    .text("Info Bubble");

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
            .attr("class", "bar-set")
            .on("mouseover", barMouseOver)
            .on("mouseout", barMouseOut);

        var bar = barGroup.append("rect")
            .attr("class", function (d) {
                return Math.max(d.Amount_Collected) ? "bar" : "bar highest-value";
            })
            .attr("x", function(d) { return x(d.Date); })
            .attr("y", function(d) { return y(d.Amount_Collected); })
            .attr("width", x.bandwidth())
            .transition().delay(function (d,i){ return i * 600;})
                .duration(800)
                .attr("height", function(d) {
                    return height - y(d.Amount_Collected);
                })
                .attr("y", function(d) {
                    return y(d.Amount_Collected);
                });

        barGroup.append("text")
            .attr("class", "bar-percent")
            .attr("x", function (d) { return x(d.Date)+ (x.bandwidth() / 2); })
            .attr("y", function (d) { return y(d.Amount_Collected)-10; })
            .text(function (d) { return (((d.Amount_Collected / totalGoal) * 100).toFixed(0)) +'%'; });

        var coors = getMaxItemPosition(); // Get the max value
        infoBubbleRect.transition()
            .duration(300)
            .attr("x", coors.x)
            .attr("y", coors.y);


    // Function for bar mouse over event
    function barMouseOver(d) {

        // Move the info bubble over the item that the mouse is currently over
        d3.select(".svg-info-bubble-rect")
            .transition()
            .duration(1000)
            .attr("x", x(d.Date) + x.bandwidth()-10)
            .attr("y", y(d.Amount_Collected) - ibHeight);

        d3.select(".svg-info-bubble-text")
            .transition()
            .duration(1000)
            .attr("x", x(d.Date) + x.bandwidth()*2)
            .attr("y", function() {
                return y(d.Amount_Collected)-10;
            })
            .text('$' + d.Amount_Collected.toLocaleString());

    }

    // Function for bar mouse over event
    function barMouseOut(d) {
        // console.log("Bar Mouse Out");

        // Move Info bubble back to the right most bar
        d3.select(".svg-info-bubble-rect").transition()
            .duration(1000)
            .attr("x", function(d) {
                return coors.x;
            });

        console.log(coors);

        d3.select(".svg-info-bubble-text")
            .transition()
            .duration(1000)
            .attr("x", function(d) {
                return coors.x;
            })
            .text(data.Amount_Collected);

    }

    // Gets the x position of the max value
    // Returns the x and y coordinate of the max value
    function getMaxItemPosition() {
        console.log("getMaxItemPosition");
        var maxVal = d3.max(data, function(d) { return d; });
        var maxValItem = d3.selectAll("bar").filter(function(d) { return d.Amount_Collected == maxVal.Amount_Collected; });
        console.log(maxValItem);
        console.log(maxVal);
        return { x: x(maxVal.Date), y: y(maxVal.Amount_Collected) };
    }

});
