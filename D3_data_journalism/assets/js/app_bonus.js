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

//Append SVG group

var chartGroup = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial x-axis and y-axis

var chosenXaxis = "age";
var chosenYaxis = "smokes";


//Function for updating xaxis when clicked
function xScale(censusData, chosenXaxis) {

    // create xscales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, data => data[chosenXaxis]) * 0.8,
            d3.max(censusData, data => data[chosenXaxis]) * 1.2
        ])
        .range([0, width]);

        return xLinearScale;

};


//Function for updating yaxis when clicked
function yScale(censusData, chosenYaxis) {

  // create yscales
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

  var leftAxis = d3.axisLeft(newYScale);

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

//Function to update circlegroup with tootip

function updateToolTip(chosenXaxis, circleGroup, chosenYaxis) {
   
    //Assign variable to x labels
    var xlabel;

    //Use conditionals to update circle groups

    if (chosenXaxis === "poverty") {
        xlabel = "Percent Poverty";
    }
    else if (chosenXaxis === "income") {
        xlabel = "Average Income";
    }
    else {
        xlabel = "Age";
    }

    //Assign variable to y labels
    var ylabel;

    //Use conditionals to update circle groups
    if (chosenYaxis === "smokes") {
      ylabel = "Smokes";
    }
    else if (chosenYaxis === "obesity") {
      ylabel = "Obesity";
    }
    else {
      ylabel = "Healthcare";
    }

    //Create tooltip for circle group
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset(-8, -0)
      .html(function(data) {
            return (`${data.state} ${data[chosenXaxis]}<br>${data[chosenYaxis]}`)
      });

     circleGroup.call(toolTip);

    //mouseover event - show data

    circleGroup.on("mouseover", function(data, index) {
        toolTip.show(data);
    })

        //mouseout event - hide data
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

  

  //Create x and y scale fucntions
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
    .attr("cy", data => yLinearScale(data[chosenYaxis]))
    .attr("r", 10)
    .attr("fill", "maroon")
    .attr("opacity", ".25");
      
  //Append state abbreviations to circles
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
                       
  //Create group for x labels   
  var xlabelGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 30})`)

  var ageLabel =  xlabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("active", true)
    .text("State Average Age");

  var incomeLabel = xlabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .classed("inactive", true)
    .text("State Average income");

  var povertyLabel = xlabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("inactive", true)
    .text("Percecnt poverty");

  //Create group for y labels
  
  var ylabelGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)")
  
  var smokeLabel = ylabelGroup.append("text")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("active", true)
    .text("Number of Smokers");

  var obesityLabel = ylabelGroup.append("text")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Percent obese people");


  var healthcareLabel = ylabelGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Healthcare (%)");

  
    
  //Update tootip   
  var circleGroup = updateToolTip(chosenXaxis, circleGroup, chosenYaxis);

  //X axis event listener
  xlabelGroup.selectAll("text")

    .on("click", function() {

      //Get value of selection
      var value = d3.select(this).attr("value");

      if (value != chosenXaxis) {

        //Replace chosenXaxis with value
        chosenXaxis = value;

        xLinearScale = xScale(censusData, chosenXaxis);

        xAxis = changeXAxes(xLinearScale, xAxis);
        
             
        //Activate x axis when label is clicked
        if (chosenXaxis === "age") {
          ageLabel.classed("active", true)
            .classed("inactive", false);
          incomeLabel.classed("active", false)
            .classed("inactive", true);
          povertyLabel.classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXaxis === "income") {
          incomeLabel.classed("active", true)
            .classed("inactive", false);
          ageLabel.classed("active", false)
            .classed("inactive", true);
          povertyLabel.classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel.classed("active", true)
            .classed("inactive", false);
          incomeLabel.classed("active", false)
            .classed("inactive", true);
          ageLabel.classed("active", false)
            .classed("inactive", true);
        };
      };
    });


  ylabelGroup.selectAll("text")

    .on("click", function() {
  
      //Get value of selection
      var value = d3.select(this).attr("value"); 

      if (value != chosenYaxis) {
        chosenYaxis = value;

        YLinearScale = YScale(censusData, chosenYaxis);

        yAxis = changeYAxes(YLinearScale, YAxis);

            
        //Activate y axis when labels are clicked
        if (chosenYaxis === "smokes") {
          smokeLabel.classed("active", true)
            .classed("inactive", false);
          healthcareLabel.classed("active", false)
            .classed("inactive", true);
          obesityLabel.classed("active", false)
            .classed("inactive", true);
        }
        if (chosenYaxis === "obesity") {
          obesityLabel.classed("active", true)
            .classed("inactive", false);
          healthcareLabel.classed("active", false)
            .classed("inactive", true);
          smokesLabel.classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel.classed("active", true)
            .classed("inactive", false);
          obesityLabel.classed("active", false)
            .classed("inactive", true);
          smokesLabel.classed("active", false)
            .classed("inactive", true);
        }
      };
    });

  //Update circleGroup and Tooltip
  
  circleGroup = updateCircle(circleGroup, xLinearScale, xAxis, yAxis, chosenYaxis);

  circleGroup = updateToolTip(chosenXaxis, circleGroup, chosenYaxis);
      
  
});