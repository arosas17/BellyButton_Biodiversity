function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  })};



// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    let samplesData = data.samples;
    let metaarray = data.metadata;
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let selectedSample = samplesData.filter(sampleFilter => sampleFilter.id == sample);
    let selectedMeta = metaarray.filter(sampleFilter => sampleFilter.id == sample);
    
    // Create a variable that holds the first sample in the array.
    let firstSample = selectedSample[0];  
    let metadata = selectedMeta[0]
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = firstSample.otu_ids;
    let otuLabels = firstSample.otu_labels;
    let otuValue = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    let washingFrq = parseFloat(metadata.wfreq);
    console.log(washingFrq)
    // Create the yticks for the bar chart.

    let yticks= otuIds.map(outIdSamples => `OTU ${outIdSamples}`).slice(0,10).reverse();
    console.log(yticks)
    let xticks= otuValue.slice(0,10).reverse();
    let reverseLabels= otuLabels.slice(0,10).reverse();

    // Use Plotly to plot the bar data and layout.
    var barData = [{
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: reverseLabels
  }];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
 
    Plotly.newPlot("bar", barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    var bubbleData = [{
      x: otuIds,
      y: otuValue,
      mode: "markers",
      marker: {
      
        size: otuValue,
        color: otuIds,
        colorscale: "Bluered"
    },
      text: otuLabels,
      type: "scatter"
  }];
    
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        width: 1087
    };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFrq,
      title: { text: "Belly Button Washing Fequency </b><br></br> Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkpurple"},
        bgcolor: "white",
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "blue" },
          { range: [2, 4], color: "royalblue" },
          { range: [4, 6], color: "pink" },
          { range: [6, 8], color: "red" },
          { range: [8, 10], color: "darkred" }
    ]}
    
  }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 450, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
