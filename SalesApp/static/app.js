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
  optionChanged()//********************************!!!!!!!!!!temp
  // Select the drop down menu
  d3.selectAll("#selectRegion").on("change", optionChanged);

  // Function for change event
  
  function optionChanged() {

    const dropdownMenuChoice = d3.selectAll("#selectRegion").node();
    // Assign the dropdown menu option to a variable
    const selectedOption = 'East'//dropdownMenuChoice.value;   ********************************!!!!!!!!!!
    
    const url = `/api/data?region=${selectedOption}`;

    d3.json(url).then(function(response) {
      
      /// This block is just test code to see it's working that can be erased
      //console.log(response); // HERE IS WHERE YOU CAN SEE THE DATA BEING BROUGHT IN
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

      //splits the date and reorders to sort
      let myDateSplit="";
      for (i=0;i<theDates.length;i++){
        myDateSplit=theDates[i].split('/');
        theDates[i]=`${myDateSplit[1]}/${myDateSplit[0]}/${myDateSplit[2]}`
      }
      theDates.sort();

      //resets the dates to the original order after sorting
      myDateSplit="";
      for (i=0;i<theDates.length;i++){
        myDateSplit=theDates[i].split('/');
        theDates[i]=`${myDateSplit[1]}/${myDateSplit[0]}/${myDateSplit[2]}`
      }
      
      console.log(theDates);
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

var theX_original=Object.keys(theProfits);
var theY_original=Object.values(theProfits).map(profit=>{return myValue=myValue+profit});

let myTempArray=fillInDates(theX_original,theY_original);

var theX=myTempArray[0];
var theY=myTempArray[1];

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
//chartGroup.append("rect").attr("width", width).attr("height", height).attr("opacity", ".5");

//create the scale of the graph
var xScale = d3.scaleLinear().domain([0,theX.length]).range([0, width]);
var yScale = d3.scaleLinear().domain([0,theY[theY.length-1]+theY[theY.length-1]*.25]).range([height,0]);
console.log(xScale(theX.length))
//sets up the graph points
var myPoints=[];
for (c=0;c<theX.length;c++){
  myPoints.push([c,theY[c]])
}


console.log(myPoints)

// Create initial axis functions
var bottomAxis = d3.axisBottom(xScale).ticks(10)
var leftAxis = d3.axisLeft(yScale);

//okay here I need to sort throught the dates and just pick certain ones
//add in missing dat24
myTickLabels=[];
for (b=0;b<theX.length;b++){
  if(theX[b].split('/')[1]=='01'){
    myTickLabels.push(theX[b])
  }
  else {
    myTickLabels.push("")
  }
}
console.log(myTickLabels)
//}

//tick labels x axis
bottomAxis.tickFormat((d, i) =>myTickLabels[i])
 .tickValues(d3.range(myTickLabels.length))

//okay leaving off here have to figure out how to clean it up


chartGroup.append("g")
.call(leftAxis);

// append bottom axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis).selectAll("text")	
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");



//plot the graph points
var circlesGroup = chartGroup.selectAll("circle")
.data(myPoints)
.enter()
.append("circle")
.attr("cx", d => xScale(d[0]))
.attr("cy", d => yScale(d[1]))
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

//var date =['04/02/2018','08/02/2018','10/02/2018','14/02/2018','20/02/2018'];
//var sales=[14,20,100,110,210];

//console.log(date[0].split('/'))


function fillInDates(date,sales){
  var monthsLen={'01':31,'02':28,'03':31,'04':30,'05':31,'06':30,'07':31,'08':31,'09':30,'10':31,'11':30,'12':31};
    var newSales=[];
    var newDates=[];
    var tempValue=0;
    var tempNextValue=0;
    var currMonth;
    var nextMonth;
    var currMonthLen;
    var isNewMonth=true;
    var isFinalEntry=false;
    var currYear=2018;
    var currSales=0;
    var nextSales=0;
    
    //iterate through all the dates, find the missing ones and fill in accordingly
    for (i=0;i<date.length;i++){

        //on the last run-through it just runs this one
        if (i===date.length-1){  
            if (isNewMonth===true){
                for (p=1;p<tempNextValue;p++){
                    newDates.push(buildDate(p,nextMonth,currYear))
                }
            }
            newDates.push(buildDate(tempNextValue,nextMonth,currYear));
            newSales.push(nextSales);
        }

        //if it isn't the last run-through, run this
        else{
            //set temporary values
            tempValue=parseInt(date[i].split("/")[0]);//the day of the month
            tempNextValue=parseInt(date[i+1].split("/")[0]);//the day of the month in the next string
            currMonth=date[i].split("/")[1];//the current month
            currMonthLen=monthsLen[currMonth];//the number of calendar days in the current month
            nextMonth=date[i+1].split("/")[1];//the month in the next string (which may or may not be the same as the current)
            currYear=date[i].split("/")[2];
            currSales=sales[i];
            nextSales=sales[i+1];
            var count=0;//count the number of days that are filled in
            var tempSales=[];

            //if this is the first entry in the month but it isn't the 1st, fill in the missing days.
            if (isNewMonth && tempValue!=1 && i!=0){
                for (p=1;p<tempValue;p++){
                    newDates.push(buildDate(p,currMonth,currYear))
                }
            }
            
            isNewMonth=false;

            //filling in the missing dates between this entry and the next entry
            if (currMonth===nextMonth){
                for (j=tempValue;j<tempNextValue;j++){
                    newDates.push(buildDate(j,currMonth,currYear))
                    count=count+1
                }

                newSales.push(currSales);
                if(count>0){
                    tempSales=fillInSales(count,currSales,nextSales);
                    tempSales.map(val=>newSales.push(val))
                }
                count=0;               
            }

            //if the final entry of the month isn't the last day of the month, fill these in
            else {
                count=0;
                newDates.push(buildDate(tempValue,currMonth,currYear));
                for (k=tempValue+1;k<=currMonthLen;k++){
                    newDates.push(buildDate(k,currMonth,currYear))
                    count=count+1;
                }
                newSales.push(currSales);
                
                //adds to the count
                count=count+tempNextValue

                if(count>0){
                    tempSales=fillInSales(count,currSales,nextSales);
                    tempSales.map(val=>newSales.push(val))
                }

                count=0;
                isNewMonth=true;
            }
        }     
        
    }
    console.log('ohno');
    console.log(newSales.length);
    console.log(newDates.length);
    console.log('ohno');
    return [newDates,newSales];
    
}

//new functions

function buildDate(day,month,year){

    if (day<10){
        day=`${month}/0${day}/${year}`;
    }
    else {
        day=`${month}/${day}/${year}`;
    }
    return day;

}

function fillInSales(count,salesA,salesZ){
    let difference=(salesZ-salesA)/count;
    let newNum=salesA;
    let tempSales=[];

    for (g=1;g<count;g++){
        newNum=newNum+difference;
        tempSales.push(newNum);
    }
    return tempSales;
}
  

  
