var chart = new Highcharts.Chart({
    chart: {
        renderTo: $('.graph_container container')[0],
        type: 'spline'
    },
    title: {
        text: ' 2012',
        align: 'center'

    },
    subtitle: {
        text: 'Anlık tweet değerleri'
    },
    xAxis: {
        labels: {
            enabled: false,
        }/*, categories: categories*/
    },
    yAxis: {
        title: {
            text: 'Tweet degerleri'
        }
    },
    plotOptions: {
        column: {
            cursor: 'pointer',
            groupPadding: 0,
            pointPadding: 0.3,
            dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                    fontWeight: 'bold'
                },
                formatter: function() {
                    return this.y;
                }
            }
        }
    },
    tooltip: {
        formatter: function() {
            var s = this.x + ':<b>' + this.y + '% tweets <br/>';
            return s;
        }
    },
    colors: ["#DF5353", 'blue'],
    series: [
        {data: [0, 120, 590, 1300, 2500, 5541], color: color_first, name: 'lorem'},
        {data: [0, 299, 1400, 1500, 1900, 2163], color: color_others, name: 'ipsum'},
        {data: [1, 100, 123, 200, 400, 1194], color: color_others, name: 'dolor'}],
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    legend: {
        layout: 'vertical',
        backgroundColor: '#FFFFFF',
        align: 'right',
        verticalAlign: 'top',
        floating: true,
        shadow: true
    },
});