//<getWidth Height>--------------------------//
const id_Div = ".test_component";
var getW = $(id_Div).width();
var getH = $(id_Div).height();
//<setMargin>-------------------------------//
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = getW - margin.left - margin.right,
    height = getH - margin.top - margin.bottom;
var data_ = [
    {
        "name": "FWait",
        "value": 10
    },
    {
        "name": "RWait",
        "value": 20
    },
    {
        "name": "Stop",
        "value": 30
    },
    {
        "name": "Production",
        "value": 40
    },
];
var colorPalettes =
    [
        '#a878c0', '#f0a8c0', '#f0c0d8', '#c090c0', '#f09090', '#d87890', '#C1BDB3', '#7F7979',
        '#878787', '#A08794', '#BB7E8C', '#C9B6BE', '#d1becf'
    ];
export function setchart(/*data*/ /*dataSymp, dataLocation, column, columnBy, program*/) {
    console.log("w" + getW);
    console.log("h" + height)


    try {
        //$(id_Div + " div").remove();
        var program = "TEST"
        //getData = data;

        var radius = (width / 2) / 2;
        console.log("radius" + radius)
        var div_Selector = d3.select(id_Div)
        var svg = div_Selector.append("svg").attr("id", "pieLocation")
            .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom) + " ");

        var groupPie = svg.append("g").attr("id", "groupPie")
        //if (data != false) {
        //var data = JSON.parse(data).length == 0 ? dataNull : JSON.parse(data);
        var data = data_;
        var column = data.map(x => x.name);

        //var yText = margin.top / 2;
        //var textHead = d3.select("#pieLocation").append("g")
        //textHead.append("text").attr("id", "tesxt")
        //    .attr("x", 10)
        //    .attr("y", yText + 2)
        //    .text("DEFECT Qty By Location" /*+ program*/)
        //    .attr("fill", "#ffff")
        //    .style("text-anchor", "start")
        //    .style("font-family", "sans-serif")
        //    .style("font-weight", "bold")
        //    .style("font-size", "0.71rem");


        var dataNull = [
            { name: "N/A", value: 100 }/*, { name: "RC90", value: 0.20 }, { name: "FT100", value: 0.30 }, { name: "RT90", value: 0.8 }, { name: "RT200", value: 0.10 }*/
        ];

        var color = d3.scaleOrdinal()
            .domain(data)//<-------//
            .range(colorPalettes);

        const pie = d3.pie()
            .value(function (d) {
                return d[1].value;
            });
        const data_ready = pie(Object.entries(data));//<-------//

        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        //setColorChart------------------------------------------------------------//
        var setColor = [];
        $.each(/*JSON.parse(column)*/column, function (i, v) {
            if (i <= 6) { setColor.push(colorPalettes[i]) }
            else { setColor.push("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()) }
        });
        /*---->*/var arcOver = d3.arc().outerRadius(0).innerRadius(radius + 10);
        //CreateTooltip--------------------------------------------------//
        var tipPieDef = d3.select("body")
        var tootipPieDef = tipPieDef.append("div").attr("id", "TootipDefBy")
            .style("position", "absolute")
            .style("z-index", "9999999")
            .style("visibility", "hidden")
            .style("background", "#fff")
            .style("font-size", "10px")
            .style("color", "black")
            .attr("class", "p-1 rounded fw-bold");
        //DrawPieChart-----------------------------------------------//
        var path = groupPie.selectAll('slices')
            .data(data_ready)
            .enter()
            .append('path').attr("id", function (d) { return d["data"][1]["name"] })
            .attr('d', arcGenerator)
            .attr('stroke', 'none')
            .attr('fill', function (d) {
                return setColor[data_ready.indexOf(d)]
                //return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
                //return colorPalette[data_ready.indexOf(d)]
            })
            .style("color", function (d) { return setColor[data_ready.indexOf(d)] })


        var getMiddle = getH / 2;
        d3.select('#groupPie').attr("transform", "translate(" + (radius) + "," + (getMiddle) + ")");


        //ONMouseTooltip-----------------------------------------//
        path.on("mousemove", function (event, d) {
            var htmls = `<p class="fw-bold mb-0">${d["data"][1]["name"]} &nbsp;${d["data"][1]["value"]}% </p> `
            d3.select(this)
                .attr("stroke", "white")
                .transition()
                .duration(200)
                .attr("d", arcOver)
                .attr("stroke-width", 1);

            return tootipPieDef.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").html(htmls);
        })
            .on("mouseleave", function (d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("d", arcGenerator)
                    .attr("stroke", "none");
                return tootipPieDef.style("visibility", "hidden")
            })
            .on("mouseover", function () { return tootipPieDef.style("visibility", "visible") })
        var getLastWPie = d3.select('#groupPie').node().getBoundingClientRect().width
        var getWTip = getW - getLastWPie;
        /* Tips */
        var tipsRight = d3.select("#pieLocation").append("foreignObject").attr("transform", "translate(" + (getLastWPie) + "," + (margin.top) + ")")
            .attr("x", 0).attr("y", 0).attr("width", getWTip).attr("height", height).append("xhtml:div").style("overflow-y", "auto").style("height", (height - margin.bottom) + "px").attr("id", "innerDiv");
        var groupTipsRight = tipsRight.append("svg").attr("width", getWTip).attr("height", 1000).attr("id", "ssssss")
            .attr("transform", "translate(" + 0 + "," + (0) + ")");
        var tips = groupTipsRight.append("g").attr("transform",
            "translate(" + (10) + "," + (10) + ")");
        var pyCircle = 0;
        $.each(data_ready, function (i, v) {
            tips.append("circle").attr("cx", 0).attr("cy", pyCircle).attr("r", 5).attr("fill", setColor[data_ready.indexOf(v)]);
            tips.append("text")
                .text(v.data[1].name)
                .attr("transform", "translate(" + (10) + "," + (pyCircle + 5) + ")")
                .style("text-anchor", "start")
                .style("font-size", "0.61rem")
                .attr("fill", "#fff")
            tips.append("text")
                .text(v.data[1].value + "%")
                .attr("transform", "translate(" + (getWTip / 2) + "," + (pyCircle + 5) + ")")
                .style("text-anchor", "start")
                .style("font-size", "0.61rem")
                .attr("fill", "#fff")
            pyCircle += 20
        })

        //}
        //else {
        //    d3.select("#groupSVG").attr("transform",
        //        "translate(" + (0) + "," + (0) + ")");
        //    svg.append("text")
        //        .attr("x", (width / 2))
        //        .attr("y", (height / 2) + 25)
        //        .text("NO DATA")
        //        .attr("fill", "#ffff")
        //        .style("text-anchor", "middle")
        //        .style("font-family", "sans-serif")
        //        .style("font-weight", "bold")
        //        .style("font-size", "15px");
        //}
        //svg
        //    .selectAll('mySlices')
        //    .data(data_ready)
        //    .enter()
        //    .append('text')
        //    .text(function (d) { return (d.data[1].value) })
        //    .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        //    .style("text-anchor", "middle")
        //    .style("font-size", "0.71rem")
        //-------------------------------------------------------------------------------------------------//





    }
    catch (e) {
        console.log(e)
    }
}