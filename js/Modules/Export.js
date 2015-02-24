


//http://phpexcel.codeplex.com/discussions/271473



canvg(document.getElementById('canvas'), chart.getSVG(
        {
            chart: {width: 700, height: 300},
            navigator: {enabled: false},
            navigation: {
                buttonOptions: {
                    enabled: false
                }},
            scrollbar: {enabled: false},
            title: {text: ""},
            xAxis: {events: {afterSetExtremes: function() {
                    }}}
        }));
var canvas = document.getElementById("canvas");
canvas.toDataURL("image/png");

