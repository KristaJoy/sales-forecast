// Part 1—Sales Forecast by Region 

////// Create DROP DOWN MENU ///////////
const regions = ["National", "West", "Central", "South", "East"];

// Select the drop down menu
const dropdownMenu = d3.select("#selectRegion");

// assign all the id's to the menu options
regions.forEach((id) => {
  const selRegion = dropdownMenu.append("option");
  selRegion.text(id);
});

//////// INIT /////////////
/// national data here to display on page load
let selectedOption = regions[0];

/// Raw Sales Data and Forecasted Data API Calls
const url = `/api/data?region=${selectedOption}`;
const url_mlregion = `/api/region?region=${selectedOption}`;

d3.json(url).then(function (data) {
  d3.json(url_mlregion).then(function (data_mlregion) {
    
    console.log(data);
    console.log(data_mlregion);

    /// This block is just test code to see it's working that can be erased
    const testrow = d3.select("#chart1");
    testrow.html("");
    testrow.append("h2").text(data[0]["category"]); //Connecting to data from first API call
    testrow.append("h2").text(data_mlregion[0]["yhat"]); ///Connecting to data from second API call
    testrow.append("p").text("hey!");
    
  });
});

/////// ON CHANGE //////////

// Select the drop down menu
d3.selectAll("#selectRegion").on("change", optionChanged);

// Function for change event

function optionChanged() {
  // Get value of the drop down menu
  const dropdownMenuChoice = d3.selectAll("#selectRegion").node();
  const selectedOption = dropdownMenuChoice.value;
  
  /// Raw Sales Data and Forecasted Data API Calls
  const url = `/api/data?region=${selectedOption}`;
  const url_mlregion = `/api/region?region=${selectedOption}`;

  d3.json(url).then(function (data) {
    d3.json(url_mlregion).then(function (data_mlregion) {
      
      console.log(data);
      console.log(data_mlregion);
  
      /// This block is just test code to see it's working that can be erased
      const testrow = d3.select("#chart1");
      testrow.html("");
      testrow.append("h2").text(data[0]["category"]); //Connecting to data from first API call
      testrow.append("h2").text(data_mlregion[0]["yhat"]); ///Connecting to data from second API call
      testrow.append("p").text("whoa!");
    
    });
  });
}




////////////////////////////////////////////
// Part 2—Product Forecast by Category

////// Create DROP DOWN MENU 
const cat_list = ["Furniture", "Office Supplies", "Technology"];

// Select the drop down menu
const dropdownMenuCat = d3.select("#selectCategory");

// assign all the id's to the menu options
cat_list.forEach((id) => {
  const selCategory = dropdownMenuCat.append("option");
  selCategory.text(id);
});

//////// INIT /////////////
/// Furniture category here to display on page load
let selectOption = cat_list[0];

/// Forecasted Categories API Call
const urlcat = `/api/cat?category=${selectOption}`;

d3.json(urlcat).then(function (data_cat) {
    
    console.log(data_cat);

    /// This block is just test code to see it's working that can be erased
    const testrow = d3.select("#chart2");
    testrow.html("");
    testrow.append("h2").text(data_cat[0]["category"]); 
    testrow.append("h2").text(data_cat[0]["yhat"]); 
    testrow.append("p").text("yay!");
    
});

/////// ON CHANGE //////////

// Select the drop down menu
d3.selectAll("#selectCategory").on("change", optionChangedCat);

// Function for change event

function optionChangedCat() {
  // Get value of the drop down menu
  const dropdownMenuChoice = d3.selectAll("#selectCategory").node();
  const selectOption = dropdownMenuChoice.value;
  
  /// Forecasted Categories API Call
  const urlcat = `/api/cat?category=${selectOption}`;

  d3.json(urlcat).then(function (data_cat) {
    
    console.log(data_cat);

    /// This block is just test code to see it's working that can be erased
    const testrow = d3.select("#chart2");
    testrow.html("");
    testrow.append("h2").text(data_cat[0]["category"]); 
    testrow.append("h2").text(data_cat[0]["yhat"]); 
    testrow.append("p").text("changed!");
    
  });
}