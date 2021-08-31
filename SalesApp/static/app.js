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
let selectedOption = regions[0];
  
//const url = `/api/data?region=${selectedOption}`;
  const url = `/api/data?region=${selectedOption}`;
  const url_mlregion = `/api/region?region=${selectedOption}`;
  

/////// ON CHANGE //////////
optionChanged()//********************************!!!!!!!!!!temp
// Select the drop down menu
d3.selectAll("#selectRegion").on("change", optionChanged);

// Function for loading graphs
  
function optionChanged() {

  const dropdownMenuChoice = d3.selectAll("#selectRegion").node();
  // Assign the dropdown menu option to a variable
  const selectedOption = dropdownMenuChoice.value;//dropdownMenuChoice.value;   ********************************!!!!!!!!!!
  
  const url = `/api/data?region=${selectedOption}`;

  //d3.json(url).then(function(response) {
  d3.json(url).then(function (response) {
  d3.json(url_mlregion).then(function (response2) {
      
    //************************************************************************
    //SORT THE DATA AND STORY IN ARRAYS AND OBJECTS FOR GRAPHING
    //************************************************************************
    
    //create an array of dates for 2018 and sorts it
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

    //splits the date and and reassembles to make sorting easier
    let myDateSplit="";
    for (i=0;i<theDates.length;i++){
      myDateSplit=theDates[i].split('/');
      theDates[i]=`${myDateSplit[1]}/${myDateSplit[0]}/${myDateSplit[2]}`
    }
    theDates.sort();

    //after sorting reassembles to original format 
    //not the most efficient so if I have time I will adjust this but right I have a function dependent on this step
    myDateSplit="";
    for (i=0;i<theDates.length;i++){
      myDateSplit=theDates[i].split('/');
      theDates[i]=`${myDateSplit[1]}/${myDateSplit[0]}/${myDateSplit[2]}`
    }
    
    //creates an object with the dates as the keys (the values are null for now------
    var theProfits={};
    theDates.map(date=>{
      theProfits[date]=0;
    });
    
    //change the daily sales to an aggregate------
    for(i=1;i<response.length;i++){
      temp=response[i].order_date;
      if (temp in theProfits){
        theProfits[temp]=theProfits[temp]+response[i].sales
      };
    };
    

    //puts projected profits into its own object (adjust q-counter if previous predictions are needed)
    var theProjectedProfits={};
    
    for (q=1230;q<response2.length;q++){
      let tempDate=response2[q]['date'].split('/')
      let reorderedDate=""
      if (tempDate[1]<10){
        reorderedDate=`0${tempDate[1]}`
      }
      else {
        reorderedDate=`${tempDate[1]}`
      }
      if (tempDate[0]<10){
        reorderedDate=reorderedDate+`/0${tempDate[0]}`
      }
      else {
        reorderedDate=reorderedDate+`/${tempDate[0]}`
      }
      reorderedDate=reorderedDate+`/20${tempDate[2]}`
        theProjectedProfits[reorderedDate]=response2[q]['yhat']
    }
      
      

    //************************************************************************
    //SET UP THE SVG GRAPH
    //************************************************************************
    var monthsLen={'01':'Feb','02':'Mar','03':'Apr','04':'May','05':'Jun',
    '06':'Jul','07':'Aug','08':'Sep','09':'Oct','10':'Nov','11':'Dec','12':'Jan'};
    //set the graph size and margins
    var svgWidth = 690;
    var svgHeight = 400;
    var margin = {
      top: 20,
      right: 130,
      bottom: 80,
      left: 100
    };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    //set the graph size
    let myValue=0;

    //creates temporary arrays for the needed data
    var theX_original=Object.keys(theProfits);
    var theY_original=Object.values(theProfits).map(profit=>{return myValue=myValue+profit});
    var theX_proj_original=Object.keys(theProjectedProfits);
    var theY_proj_original=Object.values(theProjectedProfits).map(profit=>{return myValue=myValue+profit});

    //calls a function to normalize the data points and dates
    let myTempArray=fillInDates(theX_original,theY_original);

    //stores the normalized data and dates into new arrays
    var theX=myTempArray[0];
    var theY=myTempArray[1];

    //calls a function to normalize the data points and dates for the projected 
    myTempArray=fillInDates(theX_proj_original,theY_proj_original);

    //stores the normalized projected data and dates into new arrays
    var theXproj=myTempArray[0];
    var theYproj=myTempArray[1];


    //************************************************************************
    //Build The SVG Graph Structure
    //************************************************************************
    var svg = d3
      .select("#chart1")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    //set the graph group
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //create the scale of the graph
    var xScale = d3.scaleLinear().domain([0,theX.length+theXproj.length-90]).range([0, width]);
    var yScale = d3.scaleLinear().domain([0,theY[theY.length-1]+theY[theY.length-1]*.25]).range([height,0]);


    //sets up the graph points
    //currently myPoints and myCirclePoints are the same -- I may change onw to show more data points later on
    var myPoints=[];
    var myLine=[];
    var myLineProj=[];
    var myCirclePoints=[];
    
    for (c=0;c<theX.length;c++){
      if (theX[c].split('/')[1]==='01'){
        myPoints.push({'x':c,'y':theY[c]})
        if(c>=90)myLine.push({'x':c-90,'y':theY[c]})
      }
      if (theX[c].split('/')[1]==='01'){
        myCirclePoints.push([c,theY[c]])
      }
    }

    //sets up the projected graph points
    //currently myPointsProj and myCirclePointsPoints are the same -- I may change onw to show more data points later on
    var myPointsProj=[];
    
    var myCirclePointsProj=[];
    
    for (c=0;c<theXproj.length;c++){
      if (theX[c].split('/')[1]==='01'){
        myPointsProj.push({'x':c+theX.length-1-90,'y':theYproj[c]})
      }
      if (theX[c].split('/')[1]==='01'){
        myCirclePointsProj.push([c+theX.length-1,theYproj[c]])
      }
    }

    //finds only the 1st of the months and uses those dates as the x-axis tick labels
    myTickLabels=[];
    for (b=0;b<theX.length;b++){
      if(theX[b].split('/')[1]=='01'){
        if(b>=90)myTickLabels.push(theX[b])
      }
    }

    console.log(myPoints)
    console.log(myLine)
    //finds only the 1st of the projected months and uses those dates as the x-axis tick labels
    for (b=0;b<theXproj.length;b++){
      if(theX[b].split('/')[1]=='01'){
        myTickLabels.push(theXproj[b])
      }
    }
    console.log(myTickLabels)
    // Create initial axis functions
    var xAxisScale = d3.scaleLinear().domain([0,myTickLabels.length-1]).range([0, width]);
    var bottomAxis = d3.axisBottom(xAxisScale);
    var leftAxis = d3.axisLeft(yScale).tickSizeInner([-width]).tickFormat(d=>numFormatter(d))
    //adjust tick sizes
    bottomAxis.tickSizeOuter([15]);    
    
    //call the y axis
    chartGroup.append("g")
    .call(leftAxis);

    //tick labels x axis
    bottomAxis.tickFormat((d, i) =>myTickLabels[i])
    .tickValues(d3.range(myTickLabels.length))

    chartGroup.append('rect').attr('width',width).attr('height',height).attr('fill','white').attr('opacity',.7)


    // call the x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis).selectAll("text")	
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("font-size", "14px")
      .attr("transform", "rotate(-65)");

    //************************************************************************
    //Chart The SVG Graph Points
    //************************************************************************

      //set up the line function
      var line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCatmullRom.alpha(.5))

      //append the lines for the data points
      chartGroup.append('path') // add a path to the existing svg
      .datum(myLine)
      .attr("fill", "none")
      .attr("stroke", "#17CAE2")
      .attr("stroke-width", 2.5)
      .attr('d', line);

      //append the lines for the projected data points
      chartGroup.append('path') // add a path to the existing svg
      .datum(myPointsProj)
      .attr("fill", "none")
      .attr("stroke", "#F29025")
      .attr("stroke-width", 2.5)
      .attr('d', line);
    console.log(myPoints)
      //plot the circle points
      var circlesGroup = chartGroup.selectAll("circle")
      .data(myCirclePoints.slice(3,12))
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[0]-90))
      .attr("cy", d => yScale(d[1]))
      .attr("r", 3)
      .attr("stroke", "#17CAE2")
      .attr("stroke-width",2.5)
      .attr("fill", "white")
      .attr("opacity", "1");

      //plot the projected circle points
      var circlesGroupProj = chartGroup.selectAll(".projectedCircle")
      .data(myCirclePointsProj)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[0]-90))
      .attr("cy", d => yScale(d[1]))
      .attr("r", 3)
      .attr("stroke", "#F29025")
      .attr("stroke-width", 2.5)
      .attr("fill", "white")
      .attr("opacity", "1");

    //************************************************************************
    //Creates The SVG for the interactive elements
    //************************************************************************

    //add circle
    var mybox=svg.append("g");
  
    //the percentage bars created
    svg.append("rect").attr("id","firstS").attr("width", 90).attr("height", 320)
      .attr("x", 575).attr("y", -2).style("fill","white");

    svg.append("rect").attr("id","firstS").attr("width", 20).attr("height", 300)
      .attr("x", 611).attr("y", 0).style("fill","#17CAE2");
    


    svg.append("rect").attr("id","firstU").attr("width", 60).attr("height", 160)
      .attr("x", 600).attr("y", -4).style("fill","white").attr("opacity",1);
    svg.append("rect").attr("id","firstD").attr("width", 60).attr("height", 160)
      .attr("x", 600).attr("y", 161).style("fill","white").attr("opacity",1);

    //clip boxes
    //svg.append("rect").attr("id","clipU").attr("width", 70).attr("height", 110)
     // .attr("x", 598).attr("y", -97).style("fill","white")
    svg.append("rect").attr("id","clipD").attr("width", 70).attr("height", 100)
      .attr("x", 598).attr("y", 318).style("fill","white").attr("opacity",1);

    //text count positive
    svg.append("text").attr("id","firstUtext").text('0%')
      .attr("x", 600).attr("y", 120).style("fill","#17CAE2")
      .attr('font-size','25px').attr('opacity',0);

    //text count negative
    svg.append("text").attr("id","firstDtext").text('0%')
      .attr("x", 600).attr("y", 210).style("fill","#17CAE2")
      .attr('font-size','25px').attr('opacity',0);

    //text count negative
    svg.append("text").attr("id","header").text('Months Trend')
    .attr("x", 582).attr("y",20 ).style("fill","#17CAE2")
    .attr('font-size','12px').attr('opacity',1);

    //up arrow
    var aM=.07;
    var aX=595.5;
    var aY=125;
    var aU=[(110*aM)+aX,(450*aM)+aY,(360*aM)+aX,(50*aM)+aY,(610*aM)+aX,(450*aM)+aY]

    var upArrow=svg
    .append('polyline').attr('opacity',1)
    .attr('points', `${aU[0]} ${aU[1]}, ${aU[2]} ${aU[3]+10}, ${aU[4]} ${aU[5]}`)
    .style('fill', '#17CAE2');

    //arrow
    aX=595.5;
    aY=129;
    aD=[(110*aM)+aX,(450*aM)+aY,(360*aM)+aX,(880*aM)+aY,(610*aM)+aX,(450*aM)+aY]

    var downArrow=svg
    .append('polyline').attr('opacity',1)
    .attr('points', `${aD[0]} ${aD[1]}, ${aD[2]} ${aD[3]-30}, ${aD[4]} ${aD[5]}`)
    .style('fill', '#17CAE2');


    //creates bigger circle
    var myDataCircle=svg
    .append("circle")
    .attr("cx",620)
    .attr("cy",230)
    .attr("r", 46)
    .attr("stroke", "#17CAE2")
    .attr("stroke-width",4.5)
    .attr("fill", "white")
    .attr("opacity", "0");

    //counts up the the total sales
    var myNumTotalText=svg.append("text")
    .attr("x", 580).attr("opacity","0").attr("y", 250)
    .attr("font-size", "20px").attr("font-weight","bold")
    .attr("fill", "#17CAE2")


    //************************************************************************
    //Set Up Events The Interactivity for Graph
    //************************************************************************

    //Function Event For Mouse Over of Circles
    circlesGroup.on("mouseover", function() {
      
      //small circle gets bigger
      d3.select(this).transition()
        .duration(1500)
        .attr("r", 21);
      

      //***BAR GRAPH*** finds the value for current month and two previous months***
      var theMonthlyVal=d3.select(this).data()[0][1];
      var prevMonthVal=findPreviousMonth(theMonthlyVal,myCirclePoints);//an array of the money made the two last months
      console.log(prevMonthVal);
        
      //animates the bar at side to show percentage change for the mont
      var thePerc= generateBar(prevMonthVal,theMonthlyVal);
      

      
      //checks to see if percentage is positive or negative then grows accordingly
      var tempPerc;
      if (thePerc>0){
      
        //bigger circle with data appears
      myDataCircle
      .transition()
      .duration(1500)
      .attr("r", 50)
      .attr("opacity", "1")
      .attr("transform", `translate(0,-5)`)
      
      
      //counts up the the total sales
      theMonthlyVal=Math.round(d3.select(this).data()[0][1])
      myNumTotalText.text(numFormatter(Math.round(theMonthlyVal))).transition()
      .attr("opacity", "1")
      .duration(1500)
      .attr("transform", `translate(0,-3)`);
        if(thePerc>100) {tempPerc=100}
        else {tempPerc=thePerc}
        d3.selectAll("#firstU").transition()
          .attr("transform", `translate(0,${-1*tempPerc})`).duration(1500);
 
        d3.selectAll("#firstUtext")
          .text(0)
          .transition()
          .duration(100)
          .attr("opacity", "1")
          .tween("text", function() {
              var selection = d3.select(this);    // selection of node being transitioned
              var start = 0; // start value prior to transition
              var end = thePerc;                     // specified end value
              var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
        
             return function(t) { selection.text(`${Math.round(interpolator(t))}%`); };  // return value         
          })
        .attr("transform", `translate(0,${-1*tempPerc})`)
        .duration(1500);

      //transitions up arrow
      upArrow.transition()
      .duration(1500)
      .attr("transform", `translate(0,${-1*tempPerc})`)
      .attr('points', `${aU[0]} ${aU[1]}, ${aU[2]} ${aU[3]+10}, ${aU[4]} ${aU[5]}`)
      
    }
      else{
        if(thePerc>100) tempPerc=100;
        else {tempPerc=thePerc};
        d3.selectAll("#firstD").transition()
          .attr("transform", `translate(0,${-1*tempPerc*1.7})`).duration(1500);

        d3.selectAll("#firstDtext")
          .text(0)
          .transition()
          .duration(100)
          .attr("opacity", "1")
          .tween("text", function() {
              var selection = d3.select(this);    // selection of node being transitioned
              var start = 0; // start value prior to transition
              var end = thePerc;                     // specified end value
              var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
        
             return function(t) { selection.text(`${Math.round(interpolator(t))}%`); };  // return value         
          })
        .attr("transform", `translate(0,${-1*tempPerc*1.7})`)
        .duration(1500);

        //transitions down arrow
        downArrow.transition()
        .duration(1500)
        .attr('points', `${aD[0]} ${aD[1]}, ${aD[2]} ${aD[3]-10}, ${aD[4]} ${aD[5]}`)
        .attr("transform", `translate(0,${-1*tempPerc*1.7})`)

        upArrow.transition()
        .duration(1500)
        .attr('points', `${aU[0]} ${aU[1]}, ${aU[2]} ${aU[3]+27}, ${aU[4]} ${aU[5]}`)


      }


      
    });

    //Event For Mouse Out of Circles
    circlesGroup.on("mouseout", function() {
      d3.select(this).transition()
        .duration(600)
        .attr("r", 3);

      myDataCircle
      .transition()
      .duration(600)
      .attr("r", 46)
      .attr("opacity", "0")
      .attr("transform", `translate(0,3)`)

      mybox.selectAll("text")
        .transition()
        .duration(600)
        .attr("opacity", "0")

      myNumTotalText
        .transition()
        .duration(600)
        .attr("opacity", "0")
        .attr("transform", `translate(0,2)`)

      //white bar resets
      //checks to see if percentage is positive or negative then grows accordingly
      //***BAR GRAPH*** finds the value for current month and two previous months***
      var theMonthlyVal=d3.select(this).data()[0][1];
      var prevMonthVal=findPreviousMonth(theMonthlyVal,myCirclePoints);//an array of the money made the two last months
      console.log(prevMonthVal);
        
      //animates the bar at side to show percentage change for the mont
      var thePerc= generateBar(prevMonthVal,theMonthlyVal);
      var tempPerc;
      if (thePerc>0){
        if(thePerc>100) {tempPerc=100}
        else {tempPerc=thePerc}
        d3.selectAll("#firstU").transition()
          .attr("transform", `translate(0,${1/tempPerc})`).duration(500);
        d3.selectAll("#firstUtext").transition()
        .attr("transform", `translate(0,${1/tempPerc})`).duration(500);
        
        d3.selectAll("#firstUtext").transition().attr('opacity',0)
        .tween("text", function() {
              var selection = d3.select(this);    // selection of node being transitioned
              var start = thePerc; // start value prior to transition
              var end = 0;                     // specified end value
              var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
        
             return function(t) { selection.text(`${Math.round(interpolator(t))}%`); };  // return value         
          })
        .attr("transform", `translate(0,${1/tempPerc})`)
        .duration(500);
       
        upArrow.transition()
        .duration(500)
        .attr("transform", `translate(0,${1/tempPerc})`)
      }
      else{
        if(thePerc>100) tempPerc=100;
        else {tempPerc=thePerc};
        d3.selectAll("#firstD").transition()
          .attr("transform", `translate(0,${1/tempPerc*1.7})`).duration(500);
          d3.selectAll("#firstDtext").transition().attr('opacity',0)
          .attr("transform", `translate(0,${1/tempPerc*1.7})`).duration(500)
          .tween("text", function() {
            var selection = d3.select(this);    // selection of node being transitioned
            var start = thePerc; // start value prior to transition
            var end = 0;                     // specified end value
            var interpolator = d3.interpolateNumber(start,end); // d3 interpolator
      
           return function(t) { selection.text(`${Math.round(interpolator(t))}%`); };  // return value         
        })
      .attr("transform", `translate(0,${1/tempPerc})`)
      .duration(500);
     
      upArrow.transition()
      .duration(500)
      .attr('points', `${aU[0]} ${aU[1]}, ${aU[2]} ${aU[3]+10}, ${aU[4]} ${aU[5]}`)
          
      downArrow.transition()
      .duration(500)
      .attr("transform", `translate(0,${1/tempPerc})`)
      .attr('points', `${aD[0]} ${aD[1]}, ${aD[2]} ${aD[3]-30}, ${aD[4]} ${aD[5]}`)
      }
      
      


            
    });
  });




  });
};

//************************************************************************
//FUNCTIONS
//************************************************************************

//function to find the value of the month previous
function findPreviousMonth(theVal,monthData){

  for (t=0;t<monthData.length;t++){
    if (monthData[t].includes(theVal)) {

      return [monthData[t-1],monthData[t-2]]

    }
  }
  console.log(monthData)
}

function generateBar(prevMonth,currMonth){
  console.log(prevMonth[0])
  console.log(currMonth)
  var growthOld=prevMonth[0][1]-prevMonth[1][1];
  var growthNew=currMonth-prevMonth[0][1];

  var percChange=(growthNew/growthOld-1)*100
  return percChange
}


//function to normalize dates and data
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
    return [newDates,newSales];    
}


//for the filInDates function -- to build dates in mm/dd/yyyy format
function buildDate(day,month,year){
    if (day<10){
        day=`${month}/0${day}/${year}`;
    }
    else {
        day=`${month}/${day}/${year}`;
    }
    return day;
}

//for the filInDates function -- interpolates the sales to fill in missing dates
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

function numFormatter(num) {
  if(num > 999 && num < 1000000){
      return (num/1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million 
  }else if(num > 1000000){
      return (num/1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million 
  }else if(num < 900){
      return num; // if value < 1000, nothing to do
  }
}
  

  
