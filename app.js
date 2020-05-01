function buildMetadata(sample){
    d3.json('samples.json').then((data)=>{
        var samplePanel=data.metadata;
        var resultsArray=samplePanel.filter(sampleObj=>sampleObj.id==sample);
        var firstResult=resultsArray[0];
        var sampleResult=d3.select('#sample-metadata');
        sampleResult.html("");
        Object.entries(firstResult).forEach(([key, value])=>{
            sampleResult.append("h5").text(`${key}:${value}`);
        })
    });
}

function buildCharts(sample){
    d3.json('samples.json').then((data)=>{
        var samples=data.samples;
        var ids=samples.filter(sampleObj=>sampleObj.id==sample);
        // console.log(ids);
        var results= ids[0];

        var otu_ids=results.otu_ids;
        var otu_labels=results.otu_labels;
        var sample_values=results.sample_values;
        
        var bubbleChart=[{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids 
            }
        }];
        
        var bubbleLayout={
            hovermode: 'closest',
            xaxis: {title: 'OTU ID'}
        };
        
        Plotly.purge('bubble', 0)
        

        Plotly.plot("bubble", bubbleChart, bubbleLayout)
        
    
            var valuePie=results.sample_values.slice(0,10);
            var labelPie=results.otu_ids.slice(0,10);
            var hoverPie=results.otu_labels.slice(0,10);

            var pieChart=[{
                values: valuePie,
                labels: labelPie,
                hovertext: hoverPie,
                type: 'pie'
            }];
        
        Plotly.purge('pie', 0)
        Plotly.plot("pie", pieChart);
        
    });
};

function init(){
    var dropDown=d3.select("#selDataset");
    d3.json("samples.json").then((data)=>{
        var sampleresultNames=data.names;
        sampleresultNames.forEach((sample)=>{
            dropDown.append("option").text(sample).property("value", sample);
        
        });
    
        var returnsample=sampleresultNames[0];
        buildCharts(returnsample);
        buildMetadata(returnsample);
    });
};
function optionChanged(options){
    buildCharts(options);
    buildMetadata(options);
};
init();