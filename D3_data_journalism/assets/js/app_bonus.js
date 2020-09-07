//Create scatter plot between two variables

//Set size and margins for chart

var svgwidth = 960;
var svgheight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,
}

var width = svgwidth - margin.left - margin.right;
var height = svgheight - margin.top - margin.bottom;

//Create svg wrapper

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgwidth)
  .attr("height", svgheight);

var chartGroup = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial xaxis

var chosenXaxis = "age";


//Function for updating xaxis when clicked
function xScale(censusData, chosenXaxis) {
    // create xscales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, data => data[chosenXaxis]) * 0.8,
            d3.max(censusData, data => data[chosenXaxis]) *1.2
        ])
        .range([0, width]);

        return xLinearScale

};

//Function for updating xAxis variable on click
function changeAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1500)
      .call(bottomAxis);

    return xAxis
};

//Function to update circles
function updateCircle(circleGroup, newXScale, chosenXaxis) {

    circleGroup.transition()
      .duration(1500)
      .attr("cx", data => newXScale(data[chosenXaxis]));

    return circleGroup;
}

function updateToolTip(chosenXaxis, circleGroup){
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

    var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset(-8, -0)
      .html(function(data) {
            return (`${label} ${data[chosenXaxis]}`)
        });

    svg.call(tool_tip);

    circleGroup.on("mouseover", function(data, index) {
        tool_tip.show(data);
    })
        .on("mouseout", function(data, index) {
            tool_tip.hide(data);
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
  var xLinearScale = xScale(censusData, chosenXaxis);

  var yLinearScale = d3.scaleLinear()
    .domain([7, d3.max(censusData, data => data.smokes)])
    .range([height, 0]);

  //Create axes functions for left and bottom axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //Create circles
  var circleGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", data => xLinearScale(data[chosenXaxis]))
    .attr("cy", data => yLinearScale(data.smokes))
    .attr("r", 15)
    .attr("fill", "maroon")
    .attr("opacity", ".25");
      

  chartGroup.selectAll("g")
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", data => xLinearScale(data[chosenXaxis]))
    .attr("y", data => yLinearScale(data.smokes))
    .attr("font-size", "1em" )
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text(function(data) {
      return data.abbr;
    }); 
                       

  var labelGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 30})`)

  var ageLabel =  labelGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("active", true)
    .text("State Average Age");

  var incomeLabel = labelGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income")
    .classed("active", true)
    .text("State Average income");
    
    
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

  var circleGroup = updateToolTip(chosenXaxis, circleGroup);

  labelGroup.selectAll("text")
    .on(click, function(){

      var value = d3.select(this).attr("value");
      if (value != chosenXaxis) {
        chosenXaxis = value;

        xLinearScale = xScale(censusData, chosenXaxis);

        xAxis = changeAxes(xLinearScale, xAxis);

        circleGroup = updateCircle(circleGroup, xLinearScale, xAxis);

        circleGroup = updateToolTip(chosenXaxis, circleGroup);
      }
      
      if (chosenXaxis === "age") {
        ageLabel.classed("active", true)
          .classed("inactive", false);
        incomeLabel.classed("active", false)
          .classed("inactive", true);
      }
                
    });
});