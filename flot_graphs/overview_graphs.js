// JavaScript function for calling the api to get the graph data
// points and populating the flot graphs. This fucntion is specifically 
// for the ecg graphs on the overview page.
function ecg_graph(eb) {
    // We use an inline data source in the example, usually data would
    // be fetched from a server
    var data = [],
    totalPoints = 300;

    var updateInterval = 30;
    $("#updateInterval").val(updateInterval).change(function () {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1) {
                updateInterval = 1;
            } else if (updateInterval > 2000) {
                updateInterval = 2000;
            }
            $(this).val("" + updateInterval);
        }
    });

   // Take the api channles and turns there arguments into flot graphs 
    function callback(dat1, dat2, dat3, dat4) {
        [dat1, dat2, dat3, dat4].forEach(function(dats, id) {
            eb.registerHandler(dats[0], function(msg) {
                var dmsg = msg.data;
                for(var i = 0; i < msg.data.length; ++i)
                {
                    data.push([dmsg[i].TS, dmsg[i].SIGNAL]);
                    if (data.length > 45)
                        data.shift();
                    console.log(data);

                    var plot = $.plot("#patient" + (id+1), [ data ], {
                        series: {
                            shadowSize: 0, 
                            curvedLines: {
                                apply: true,
                                active: true,
                                monotonicFit: true
                            }
                        },
                        yaxis: {
                            min: 0,
                            max: 100
                        },
                        xaxis: {
                            show: false
                        },
                        colors: ["#00FF33", "#00FF33"]
                    });
                }                               
            });
        });
    }

    eb.onopen = function() {
        $.when($.ajax("http://api.s-pi-demo.com/stream/waveform/bp/1"),
                $.ajax("http://api.s-pi-demo.com/stream/waveform/bp/2"),
                $.ajax("http://api.s-pi-demo.com/stream/waveform/bp/3"),
                $.ajax("http://api.s-pi-demo.com/stream/waveform/bp/4")
            ).done(callback)
    }
}
