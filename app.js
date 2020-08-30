
// d3.csv("data.csv", function(data){
//     console.log(data)
// });

d3.select("#submit").on("click", handleSubmit);

function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
  
    // Select the input value from the form
    var participant = d3.select("#selParticipant").node().value;
    var jurisdiction = d3.select("#selJurisdiction").node().value;
    var custType = d3.select("#selCustType").node().value;
    var meterType = d3.select("#selMeterType").node().value;
  
    // Build the plot with the new stock
    buildPlot(participant,jurisdiction,custType,meterType);
  }

function buildPlot(participant,jurisdiction,custType,meterType) {
    d3.json("data.json").then((data) => {
        filtered = data.filter(function(d) {
            return ((d.participant == participant) && (d.jurisdiction == jurisdiction) && (d.MM_CNI == custType) && (d.data_id_type == meterType)); 
         });

        var groupedDemand = d3.nest()
            .key(function (d) {return d.participant;})
            .key(function (d) {return d.billing_period;})            
            .key(function (d) {return d.data_id_type;})
            .key(function (d) {return d.jurisdiction;})
            .key(function (d) {return d.MM_CNI;})
            .rollup(function(v) { return d3.sum(v, function(d) { return parseFloat(d.week20_diff_mwh); }); })
            .entries(filtered);        
  
        bplist = [];  
        demadlist = [];
        var parseDate = d3.timeParse("%Y%W");
        var keys = d3.values(groupedDemand[0]).slice(1);
        for (const [k, v] of Object.entries(keys)) {
            for (const [k1, v1] of Object.entries(v)) {
                
                for (const [k2, v2] of Object.entries(v1)) {
                    for (const [k3, v3] of Object.entries(v2)) {
                        for (const [k4, v4] of Object.entries(v3)) {
                            for (const [k5, v5] of Object.entries(v4)) {
                                for (const [k6, v6] of Object.entries(v5)) {
                                    for (const [k7, v7] of Object.entries(v6)) { 
                                        if(v7.value){
                                            bplist.push(parseDate(v1.key));
                                            
                                            demadlist.push(v7.value);  
                                        }   
                                                    
                                    }                   
                                }                  
                            }                      
                        }    
               
                    }                  
                }
            }
        }
        console.log(bplist);
        console.log(demadlist);

        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: name,
            x: bplist,
            y: demadlist,
            line: {
              color: "#17BECF"
            }
          };
      
          var data = [trace1];
      
          var layout = {
            xaxis: {
                title: {
                  text: 'Billing Period'
                  }
            },
            yaxis: {
                title: {
                    text: 'MW'
                    },
              autorange: true,
              type: "linear"
            }
        };
      
          Plotly.newPlot("chartDiv", data, layout);        
    });

}  

