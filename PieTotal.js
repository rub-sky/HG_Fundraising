var pieWidth = 275,
    pieHeight = 200,
    radius = Math.min(pieWidth, pieHeight) / 2;

var svg = d3.select("div.pie-container").append("canvas")
    .attr("class", "arcCanvas")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

var canvas = document.querySelector("canvas.arcCanvas");
var context = canvas.getContext("2d");

var color = ["#4f4f4f", "#1497B4"];

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 45)
    .context(context);

var labelArc = d3.arc()
    .outerRadius(radius + 20)
    .innerRadius(radius + 20)
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
    context.strokeStyle = "#3f3f3f";
    context.stroke();

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#fff";
    context.font = "bold 0.7em Sans-Serif";

    arcs.forEach(function(d) {
        var c = labelArc.centroid(d);
        context.fillText('$' + d.data.CollectedAmount.toLocaleString(), c[0], c[1]);
    });

    // Add a percentage in the middle
    context.font = "bold 2.5em Sans-Serif";
    context.fillStyle = "#afafaf";
    context.fillText((((data[1].CollectedAmount)/440000)*100).toFixed(0) + '%', 0, 3);
})

function displayText() {
    context.save();
    context.font = "bold 2.0em Sans-Serif";
}

;