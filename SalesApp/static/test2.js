var a={'x':10,'y':2,'z':3};
t=[2,4,6,7]

var b=Object.values(a);
const reducer = (accumulator, currentValue) => accumulator + currentValue;
var c=Object.values(a).reduce(reducer);

var temp=0;
s=Object.values(a).map(k=>{
    //console.log(temp);
    return temp=temp+k
});
//console.log(s);
var tt=[];
Object.entries(a).forEach((element,index) => {
    tt.push([index,element[0]])
});
console.log(t.reduce((a,b)=>a+b))
