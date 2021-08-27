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

/// Raw Sales Data API Call

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
  const dropdownMenuChoice = d3.selectAll("#selectRegion").node();
  // Assign the dropdown menu option to a variable
  const selectedOption = dropdownMenuChoice.value;

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
