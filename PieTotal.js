var pieWidth = 200,
    pieHeight = 200,
    radius = Math.min(pieWidth, pieHeight) / 2;

var svg = d3.select("div.pie_container").append("canvas")
    .attr("class", "arcCanvas")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

var canvas = document.querySelector("canvas.arcCanvas");
var context = canvas.getContext("2d");

var color = ["#1497B4", "#cfcfcf"];

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70)
    .padAngle(0.01)
    .context(context);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40)
    .context(context);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.CollectedAmount; });

context.translate(pieWidth / 2, pieHeight / 2);

d3.csv("./TotalPieData.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d){
        d.CollectedAmount = +d.CollectedAmount;
    });

    console.log("Pie Data");
    console.log(data);

    var arcs = pie(data);

    arcs.forEach(function(d, i) {
        context.beginPath();
        arc(d);
        context.fillStyle = color[i];
        context.fill();
    });

    context.beginPath();
    arcs.forEach(arc);
    context.strokeStyle = "#fff";
    context.stroke();

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#000";
    context.fontWeight = "bold";
    arcs.forEach(function(d) {
        var c = labelArc.centroid(d);
        context.fillText(d.data.CollectedAmount, c[0], c[1]);
    });
});