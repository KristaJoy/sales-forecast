////// Create DROP DOWN MENU ///////////
const regions = ['National', 'West', 'Central', 'South', 'East']

// Select the drop down menu
const dropdownMenu = d3.select("#selectRegion");
  
// assign all the id's to the menu options
regions.forEach(id => {
    const selRegion = dropdownMenu.append("option");
    selRegion.text(id);
  });

      

  //////// INIT /////////////
  /// national data here to display on page load
  let selectedOption = regions[0]
    
  const url = `/api/data?region=${selectedOption}`;
  



  /////// ON CHANGE //////////
  
  // Select the drop down menu
  d3.selectAll("#selectRegion").on("change", optionChanged);

  // Function for change event
  
  function optionChanged() {

    const dropdownMenuChoice = d3.selectAll("#selectRegion").node();
    // Assign the dropdown menu option to a variable
    const selectedOption = dropdownMenuChoice.value;
    
    const url = `/api/data?region=${selectedOption}`;

    d3.json(url).then(function(response) {
      
      /// This block is just test code to see it's working that can be erased
      console.log(response); // HERE IS WHERE YOU CAN SEE THE DATA BEING BROUGHT IN
      const testrow = d3.select("#chart1");
      testrow.html("");
      testrow.append("h2").text(response[0]['category']);



      //create an array of dates for 2018 and sort---------------------------------
      var theDates=[];
      for(i=1;i<response.length;i++){
        temp=response[i].order_date;
        if (temp.split('/')[2]==='2018'){
          if (theDates.includes(temp)){
            
          }
          else {
            
            theDates.push(temp)
          }

        };
      };
      theDates.sort();

      //creates an object with the dates as key and the value an empty array------
      var theProfits={};
      theDates.map(date=>{
        theProfits[date]=0;
      });
      
      //adds the sales totals to the object------
    
      for(i=1;i<response.length;i++){
        temp=response[i].order_date;
        if (temp in theProfits){
          theProfits[temp]=theProfits[temp]+response[i].sales

        };
      };
      console.log(theProfits)

      //graphs
      layout = {
        title: 'Profits 2018',
        title_x: 0,
        autosize: false,
        width: 1000,
        height: 500,
        margin: {
            l: 70,
            r: 200,
            b: 100,
            t: 30,
            pad: 4
        }
      }

      let myValue=0;
      Plotly.newPlot('chart1', [{
        x: Object.keys(theProfits),
        y: Object.values(theProfits).map(profit=>{return myValue=myValue+profit}),
        line: {simplify: false},
      }], layout, {showSendToCloud:true});
      

//SVG GRAPH ************************************************************************

//set the graph size
var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

myValue=0;

var theX=Object.keys(theProfits);
var theY=Object.values(theProfits).map(profit=>{return myValue=myValue+profit});

//create the SVG graph
var svg = d3
  .select("#chart4")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//set the graph group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//create a temporary bg so I can see the actual size of graph - will delete this later
chartGroup.append("rect").attr("width", width).attr("height", height).attr("opacity", ".5");

//create the scale of the graph
var xScale = d3.scaleLinear().domain([0,theX.length]).range([0, width]);
var yScale = d3.scaleLinear().domain([0,theY[theY.length-1]+theY[theY.length-1]*.25]).range([height,0]);

//sets up the graph points
var myPoints=[];
Object.entries(theProfits).forEach((element,index)=> {
  myPoints.push([index,element[1]])
});

//plot the graph points
myValue=0;
var circlesGroup = chartGroup.selectAll("circle")
.data(myPoints)
.enter()
.append("circle")
.attr("cx", d => xScale(d[0]))
.attr("cy", d => yScale(myValue=myValue+d[1]))
.attr("r", 5)
.attr("fill", "pink")
.attr("opacity", ".5");

  });

};


      /////Main Graph
/*
      layout = {
        title: 'Covid Info',
        title_x: 0,
        autosize: false,
        width: 1000,
        height: 500,
        margin: {
            l: 70,
            r: 200,
            b: 100,
            t: 30,
            pad: 4
        }
      }



  Plotly.newPlot('chart1', [{
    x: [1, 2, 3],
    y: [0, 0.5, 1],
    line: {simplify: false},
  }], layout, {showSendToCloud:true});
  
  function randomize() {
    Plotly.animate('chart1', {
      data: [{y: [Math.random(), Math.random(), Math.random()]}],
      traces: [0],
      layout: {}
    }, {
      transition: {
        duration: 500,
        easing: 'cubic-in-out'
      },
      frame: {
        duration: 500
      }
    })
  }

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#chart4")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

svg.append("circle")
  .style("stroke", "gray")
  .style("fill", "black")
  .attr("r", 40)
  .attr("cx", 90)
  .attr("cy", 40);

  //var svgGraph1=svg.
  chartGroup.append("rect").attr("width", width).attr("height", height)

  var xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
  var yScale = d3.scaleLinear().domain([0, 100]).range([height,0]);

  var hairData=[10,30,33,40,50,60];
  
  var circlesGroup = chartGroup.selectAll("circle")
  .data(hairData)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d))
  .attr("cy", d => yScale(d))
  .attr("r", 10)
  .attr("fill", "pink")
  .attr("opacity", ".5");
*/
  

  
