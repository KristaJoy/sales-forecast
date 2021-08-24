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
  
  d3.json(url).then(function(response) {
    
    /// This block is just test code to see it's working that can be erased
    console.log(response); // HERE IS WHERE YOU CAN SEE THE DATA BEING BROUGHT IN
    const testrow = d3.select("#chart1");
    testrow.html("");
    testrow.append("h2").text(response[0]['category']);
    testrow.append("p").text("hey!")
    /////
    
  })


  /////// ON CHANGE //////////
  
  // Select the drop down menu
  d3.selectAll("#selectRegion").on("change", optionChanged);

  // Function for change event
  
  function optionChanged() {

    let dropdownMenuChoice = d3.selectAll("#selectRegion").node();
    // Assign the dropdown menu option to a variable
    const selectedOption = dropdownMenuChoice.value;
    
    const url = `/api/data?region=${selectedOption}`;
    
    d3.json(url).then(function(response) {
      
      /// This block is just test code to see it's working that can be erased
      console.log(response); // HERE IS WHERE YOU CAN SEE THE DATA BEING BROUGHT IN
      const testrow = d3.select("#chart1");
      testrow.html("");
      testrow.append("h2").text(response[0]['category']);
      /////

    })
  }
