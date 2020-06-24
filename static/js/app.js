function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(meatadata){
    // Use d3 to select the panel with id of `#sample-metadata`
    var pannel = d3.select("#sample-metadata");      
    // Use `.html("") to clear any existing metadata
    pannel.html("");      
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(meatadata).forEach(data => {
      pannel.append("h5").html(`<strong>${data[0]}</strong>: ${data[1]}`)
    });
    // BONUS: Build the Gauge Chart
     buildGauge(data.WFREQ);
    }); 
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`samples/${sample}`).then(data => {
    // @TODO: Build a Bubble Chart using the sample data
    var trace_Bubble = {
      x : data.otu_ids,
      y : data.sample_values,
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Bluered"
      },
      text: data.otu_labels,
      hovertemplate: "(%{x},%{y})<br><br>%{text}<extra></extra>"
    };

    var data_Bubble = [trace_Bubble];
    var layout_Bubble = {
      title: "<b>Micro-organism Type vs. Concentration</b>",
      titlefont: {size: 20},
      xaxis: {title: "Micro-organism Type / OTU ID"},
      yaxis: {title: "OTU (Operational Taxonomic Unit)"}
    };

    Plotly.newPlot("bubble", data_Bubble, layout_Bubble);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    var rating = ["1st", "2nd", "3rd", '4th','5th', '6th', '7th','8th', '9th', '10th']
    var trace_Pie = {
      // otu_ids, and labels (10 each).
      labels : data.otu_ids.slice(0,10),
      values : data.sample_values.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      text : rating,
      textinfo: "text + values",
      hovertemplate: "OTU ID: %{label}<br>OTU: %{value} <br>%{hovertext}<extra></extra>",
      type: "pie",
      rotation: 90
    }
    var data_Pie = [trace_Pie];
    var layout_Pie = {
      title: "<b>Top 10 Most Populated Micro-organism</b>",
      titlefont: {size: 20},
      showlegend: true
    }
    Plotly.newPlot("pie", data_Pie, layout_Pie);
  });
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();