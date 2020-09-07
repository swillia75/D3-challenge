//Create scatter plot between two variables

//Set size and margins for chart

var svgwidth = 960;
var svgheight = 500;

var margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
};

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
var chosenYaxis = "smokes";


//Function for updating xaxis when clicked
function xScale(censusData, chosenXaxis) {
    // create xscales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, data => data[chosenXaxis]) * 0.8,
            d3.max(censusData, data => data[chosenXaxis]) *1.2
        ])
        .range([0, width]);

        return xLinearScale;

};


//Function for updating yaxis when clicked
function yScale(censusData, chosenYaxis) {
  // create xscales
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, data => data[chosenYaxis]) * 0.8,
          d3.max(censusData, data => data[chosenXaxis]) *1.2
      ])
      .range([height, 0]);

      return yLinearScale;
};
//Function for updating xAxis variable on click
function changeXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1500)
      .call(bottomAxis);

    return xAxis;
};

//Function for updating xAxis variable on click
function changeYAxes(newYScale, yAxis) {
  var leftAxis = d3.axis(newYScale);

  yAxis.transition()
    .duration(1500)
    .call(leftAxis);

  return yAxis;
};

//Function to update circles
function updateCircle(circleGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

    circleGroup.transition()
      .duration(1500)
      .attr("cx", data => newXScale(data[chosenXaxis]))
      .attr("cy", data => newYScale(data[chosenYaxis]));

    return circleGroup;
};

function updateToolTip(chosenXaxis, circleGroup, chosenYaxis) {
    var xlabel;

    if (chosenXaxis === "Healthcare"){
        xlabel = "Healthcare";
    }
    else if (chosenXaxis === "income") {
        xlabel = "Average Income";
    }
    else {
        xlabel = "Age";
    }

    var ylabel;

    if (chosenYaxis === "smokes"){
      ylabel = "Smokes";
    }
    else if (chosenYaxis === "obesity") {
      ylabel = "Obesity";
    }
    else {
      ylabel = "Poverty";
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset(-8, -0)
      .html(function(data) {
            return (`${label} ${data[chosenXaxis]}`)
      });

    circleGroup.call(tool_tip);

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
  var xLinearScale = xScale(censusData, chosenXaxis);

  var yLinearScale = yScale(censusData, chosenYaxis);
  //Create axes functions for left and bottom axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
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
      

  chartGroup.selectAll(".text")
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
    .attr("y", 60)
    .attr("value", "income")
    .classed("active", true)
    .text("State Average income");

  var healthcareLabel = labelGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Healthcare (%)");
// append y axis

  var smokeLabel = labelGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 80)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Number of Smokers");

  var obesityLabel = labelGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Percent obese people");


  var povertyLabel = labelGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Percent Poverty");

  
    
    
  var circleGroup = updateToolTip(chosenXaxis, circleGroup, chosenYaxis);

  labelGroup.selectAll("text")

    .on(click, function() {

      var value = d3.select(this).attr("value");

      if (value != chosenXaxis) {
        chosenXaxis = value;

        xLinearScale = xScale(censusData, chosenXaxis);

        xAxis = changeXAxes(xLinearScale, xAxis);
        
             
      
        if (chosenXaxis === "age") {
          ageLabel.classed("active", true)
            .classed("inactive", false);
          incomeLabel.classed("active", false)
            .classed("inactive", true);
          healthcareLabel.classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXaxis === "income") {
          incomeLabel.classed("active", true)
            .classed("inactive", false);
          ageLabel.classed("active", false)
            .classed("inactive", true);
          healthcareLabel.classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel.classed("active", true)
            .classed("inactive", false);
          incomeLabel.classed("active", false)
            .classed("inactive", true);
          ageLabel.classed("active", false)
            .classed("inactive", true);
        };
      };

      if (value != chosenYaxis) {
        chosenYaxis = value;

        YLinearScale = YScale(censusData, chosenYaxis);

        yAxis = changeYAxes(YLinearScale, YAxis);

            
      
        if (chosenYaxis === "smokes") {
          smokeLabel.classed("active", true)
            .classed("inactive", false);
          povertyLabel.classed("active", false)
            .classed("inactive", true);
          obesityLabel.classed("active", false)
            .classed("inactive", true);
        }
        if (chosenYaxis === "obesity") {
          obesityLabel.classed("active", true)
            .classed("inactive", false);
          povertyLabel.classed("active", false)
            .classed("inactive", true);
          smokesLabel.classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel.classed("active", true)
            .classed("inactive", false);
          obesityLabel.classed("active", false)
            .classed("inactive", true);
          smokesLabel.classed("active", false)
            .classed("inactive", true);
        }
      };
      circleGroup = updateCircle(circleGroup, xLinearScale, xAxis, yAxis, chosenYaxis);

      circleGroup = updateToolTip(chosenXaxis, circleGroup, chosenYaxis);
      
    });
});