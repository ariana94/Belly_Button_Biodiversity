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

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    console.log(samplesArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    console.log(resultsArray);

    // Deliv 3 (1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata
    var resultMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var results = resultsArray[0];
    console.log(results);

    // Deliv 3 (2. Create a variable that holds the first sample in the metadata array.
    var firstMetaData = resultMetadata[0];
    console.log(firstMetaData);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = results.otu_ids;
    var otuLabels = results.otu_labels;
    var sampleValues = results.sample_values;

    // Deliv 3 (3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(firstMetaData.wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0, 10).map(id => "OTU " + id + " ").reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: sampleValues.slice(0, 10).reverse(),
        colorscale: "Rainbow"
      }
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: { text: "<b>Top Ten Bacterial Cultures</b>", font: { size: 22} },
      margin: {
        l: 100,
        r: 50,
        t: 100,
        b: 50
      }
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      type: "scatter",
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Rainbow"
      }
    }
   ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: { text: "<b>Bacteria Cultures Per Sample</b>", font: {size: 22} },
      xaxis: {title: "OTU ID"},
      margins: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {text: "Washes Weekly", font: {size: 18}},
      type: "indicator",
      mode: "gauge+number",
      value: washFreq,
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: 'black' },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "yellow"},
          {range: [4, 6], color: "green"},
          {range: [6, 8], color: "blue"},
          {range: [8, 10], color: "indigo"}
        ]
      }

    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "<b>Belly Button Washing Frequency</b>",
      font: { size: 16},
      width: 500,
      height: 400
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}




