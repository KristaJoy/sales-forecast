var date =['01/01/2019','01/02/2019','01/03/2019'];
var sales=[14,20,100,];

//console.log(date[0].split('/'))
var monthsLen={'01':31,'02':28,'03':31,'04':30,'05':31,'06':30,'07':31,'08':31,'09':30,'10':31,'11':30,'12':31};

function fillInDates(){
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
                
                //adds to the count the first day of the next year
                count=count+tempNextValue;
                
                if(count>0){
                    tempSales=fillInSales(count,currSales,nextSales);
                    tempSales.map(val=>newSales.push(val))
                }

                count=0;
                isNewMonth=true;
            }
        }     
        
    }
    console.log(newSales);
    console.log(newDates.length);
    return newDates;
    
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

console.log(fillInDates());


