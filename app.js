
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
                                            bplist.push(v1.key);
                                            
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

        bp2017 = [];
        bp2018 = [];
        bp2019 = [];
        bp2020 = [];
        demand2017 = [];
        demand2018 = [];
        demand2019 = [];
        demand2020 = [];
        var index = 0;

        bplist.forEach(wk => {
            if (index < 52){
                bp2017.push(bplist[index].toString().substring(4));
                demand2017.push(demadlist[index]);
            } 
            if((index > 51) && (index < 104)){
                bp2018.push(bplist[index].toString().substring(4));
                demand2018.push(demadlist[index]);                
            }
            if((index > 103) && (index < 156)){
                bp2019.push(bplist[index].toString().substring(4));
                demand2019.push(demadlist[index]);                
            }
            if((index > 155) && (index < 208)){
                bp2020.push(bplist[index].toString().substring(4));
                demand2020.push(demadlist[index]);                
            }            
            index ++;
        });

        var trace1 = {
            type: "scatter",
            mode: "lines+markers",
            name: '2017',
            x: bp2017,
            y: demand2017
          };

          var trace2 = {
            type: "scatter",
            mode: "lines+markers",
            name: '2018',
            x: bp2018,
            y: demand2018
          };  
          var trace3 = {
            type: "scatter",
            mode: "lines+markers",
            name: '2019',
            x: bp2019,
            y: demand2019
          };  
          var trace4 = {
            type: "scatter",
            mode: "lines+markers",
            name: '2020',
            x: bp2020,
            y: demand2020
          };                          
      
          var data = [trace1,trace2,trace3,trace4];
      
          var layout = {
            xaxis: {
                title: {
                  text: 'Billing Period Weeks'
                  }
            },
            yaxis: {
                title: {
                    text: 'MWh'
                    },
              autorange: true,
              type: "linear"
            }
        };
      
          Plotly.newPlot("chartDiv", data, layout);        
    });

}  

function init(){
    buildPlot('CONTACTA','ACT', 'CnI','C');
}

init();

