//Create scatter plot between two variables

//Set size and margins for chart

var svgwidth = 960;
var svgheight = 600;

var margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30,
}

var width = svgwidth - margin.left - margin.right;
var height = svgheight - margin.top - margin.bottom;

//Create svg wrapper

var svg = d3.select("body")
            .append("svg")
            .attr("width", svgwidth)
            .attr("height", svgheight);

var chartGroup = svg.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.bottom})`);

//Read data from csv file

d3.csv("assets/data/data.csv").then(function(censusData) {

    //Parse data
    censusData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    //Create scales fucntions
    var xLinearScale = d3.scaleLinear()
            .domain([28, d3.max(censusData, data => data.age)])
            .range([0, width]);

    var yLinearScale = d3.scaleLinear()
            .domain([7, d3.max(censusData, data => data.smokes)])
            .range([height, 0]);

    //Create axes functions for left and bottom axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //Create circles
    var circleGroup = chartGroup.selectAll("circle")
                        .data(censusData)
                        .enter()
                        .append("circle")
                        .attr("cx", data => xLinearScale(data.age))
                        .attr("cy", data => yLinearScale(data.smokes))
                        .attr("r", 15)
                        .attr("fill", "maroon")
                        .attr("opacity", ".25");

    var textGroup = chartGroup.selectAll("g")
                        .data(censusData)
                        .enter()
                        .append("text")
                        .text(data => data.abbr)
                        .attr("x", data => xLinearScale(data.age))
                        .attr("y", data => yLinearScale(data.smokes))
                        .attr("font-size", "0.8em" )
                        .attr("fill", "black")
                        .attr("text-anchor", "middle")
                        ;
                       

    //Initialize tooltip

    // var toolTip = d3.tip ()
    //     .attr("class", "tooltip")
    //     .offset(70, -50)
    //     .html(function(d) {
    //         return (`${data.state}<br>Age: ${data.age}<br>Smokes: ${data.smokes}`);
    //     });

    // //Create tooltip on chart
    // chartGroup.call(toolTip);

    //Create event listeners to control tooltip display

    circleGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
        //hide tooltip with mouseoout

        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    //Create axes labels

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Number of Smokers");
    
    chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Age of Smokers");



        
}).catch(function(error) {
    console.log(error);
});



