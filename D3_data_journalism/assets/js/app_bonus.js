//Create scatter plot between two variables

//Set size and margins for chart

var svgwidth = 960;
var svgheight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,
}

var width = svgwidth - margin.left - margin.right;
var height = svgheight - margin.top - margin.bottom;

//Create svg wrapper

var svg = d3.select(".scatter")
            .append("svg")
            .attr("width", svgwidth)
            .attr("height", svgheight);

var chartGroup = svg.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.bottom})`);

//Initial xaxis

var chosenXaxis = "age";


//Function for updating xaxis when clicked
function xScale(censusData, chosenXaxis) {
    // create xscales
    var xLinearScale = d3.scaleLinear()
        domain([d3.min(censusData, data => data[chosenXaxis]) * 0.8,
            d3.max(censusData, data => data[chosenAxis]) *1.2
        ])
        range([0, width]);

        return xLinearScale

};

//Function for updating xAxis variable on click
function changeAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
    .duration(500)
    .call(bottomAxis);

    return xAxis
};

//Function to update circles
function updateCircle(circleGroup, newXScale, chosenAxis) {

    circleGroup.transition()
    .duration(500)
    .attr("cx", data => newXScale(data[chosenXaxis]));

    return circleGroup;
}

function toolTip(chosenXaxis, circlegroup){
    var label;

    if (chosenXaxis === "age"){
        label = "Age";
    }
    else if (chosenXaxis === "income") {
        label = "Income";
    }
    else {
        label = "healthcare";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset(80, -60)
        .html(function(data) {
            return (`${label} ${data{chosenXaxis}}`)
        });

    circleGroup.call(toolTip);

    circleGroup.on("mouseover", function(data, index) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circleGroup;
}
//Read data from csv file

d3.csv("assets/data/data.csv").then(function(censusData) {

    //Parse data
    censusData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
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

    chartGroup.selectAll("g")
                        .data(censusData)
                        .enter()
                        .append("text")
                        
                        .attr("x", data => xLinearScale(data.age))
                        .attr("y", data => yLinearScale(data.smokes))
                        .attr("font-size", "1em" )
                        .attr("fill", "black")
                        .attr("text-anchor", "middle")
                        .text(function(data) {
                            return data.abbr;
                        }); 
                       

    //Initialize tooltip

    // var toolTip = d3.tip ()
    //     .attr("class", "tooltip")
    //     .offset(70, -50)
    //     .html(function(d) {
    //         return (`${data.state}<br>Age: ${data.age}<br>Smokes: ${data.smokes}`);
    //     });

    // // //Create tooltip on chart
    // chartGroup.call(toolTip);

    // //Create event listeners to control tooltip display

    // circleGroup.on("click", function(data) {
    //     toolTip.show(data, this);
    // })
        //hide tooltip with mouseoout

        // .on("mouseout", function(data) {
        //     toolTip.hide(data);
        // });

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