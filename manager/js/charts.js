function callGraph1() {

    var options = {
        colors: [ "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee","#DDDF0D"],
        chart: {
            borderWidth: 0,
            borderRadius: 15,
            backgroundColor: 'hsla(0,0%,95%,0.5)',
            plotBackgroundColor: null,
            plotShadow: false,
            plotBorderWidth: 0,
            margin: 30,
            marginLeft: 60,
            zoomType: 'x',
            renderTo: 'graph_container_1'
        },
        title: {
            style: {
                color: '#555',
                font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            },
            text: totalSesssionNo
        },
        xAxis: {
            minTickInterval: 2000,
            ordinary: false,
            gridLineWidth: 0,
            lineColor: '#999',
            tickColor: '#999',
            type: 'datetime',
            labels: {
                style: {
                    color: '#999',
                    fontWeight: 'bold'
                }
            },
            
            title: {
                style: {
                    color: '#AAA',
                    font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                }
            },
            offset: -20
        },
        
        yAxis: {
            min: -1,
            max: 7,
            title: {
                enabled: false,
                text: '',
                style: {
                    color: '#AAA',
                    font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                }
            },
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: [
            { // Login
                from: -0.2,
                to: 0.2,
                color: 'hsla(0, 0%, 50%, 0.1)',
                label: {
                    text: 'Login',
                    x: -30,
                    style: {
                        color: '#606060'
                    }
                }
            },

            { // Bar
                from: 0.8,
                to: 1.2,
                color: 'hsla(0, 0%, 50%, 0.1)',
                label: {
                    text: 'Bar',
                    x: -30,
                    style: {
                        color: '#606060'
                    }
                }
            },

            { // Line
                from: 1.8,
                to: 2.2,
                color: 'hsla(0, 0%, 50%, 0.1)',
                label: {
                    text: 'Line',
                    x: -30,
                    style: {
                        color: '#606060'
                    }
                }
            },

            { // Share
                from: 2.8,
                to: 3.2,
                color: 'hsla(0, 0%, 50%, 0.1)',
                label: {
                    text: 'Share',
                    x: -30,
                    style: {
                        color: '#606060'
                    }
                }
            },
            { // Target
                from: 3.8,
                to: 4.2,
                color: 'hsla(0, 0%, 50%, 0.1)',
                label: {
                    text: 'Target',
                    x: -30,
                    style: {
                        color: '#606060'
                    }
                }
            },
            { // Strong breeze
                from: 4.8,
                to: 5.2,
                color: 'hsla(0, 0%, 50%, 0.1)',
                label: {
                    text: 'Peaklist',
                    x: -30,
                    style: {
                        color: '#606060'
                    }
                }
            },
            { // Monitor
                from: 5.8,
                to: 6.2,
                color: 'hsla(0, 0%, 50%, 0.1)',
                label: {
                    text: 'Monitor',
                    x: -30,
                    style: {
                        color: '#606060'
                    }
                }
            },
            { // Other
                from: 6.8,
                to: 7.2,
                color: 'hsla(0, 0%, 50%, 0.1)',
                label: {
                    text: 'Diğer',
                    x: -30,
                    style: {
                        color: '#606060'
                    }
                }
            }],
            minorTickInterval: null,
            gridLineColor: 'rgba(255, 255, 255, .1)',
            lineWidth: 0,
            tickWidth: 0,
            labels: {
                enabled: false,
                style: {
                    color: '#999',
                    fontWeight: 'bold'
                }
            }
        },
        legend: {
            enabled: false,
            itemStyle: {
                color: '#CCC'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#333'
            }
        },
        labels: {
            style: {
                color: '#CCC'
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: {
                linearGradient: [0, 0, 0, 50],
                stops: [
                [0, 'rgba(96, 96, 96, .8)'],
                [1, 'rgba(16, 16, 16, .8)']
                ]
            },
            borderWidth: 0,
            style: {
                color: '#FFF'
            }
        },


        plotOptions: {
            line: {
                marker: {
                    enabled: true,
                    lineColor: '#333',
                    symbol: 'circle',
                    radius: 5
                },
                dataLabels: {
                    color: '#CCC'
                },
                step:true
            },
            series: {
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 5
                    }
                }
            }
        },

        toolbar: {
            itemStyle: {
                color: '#CCC'
            }
        },

        // scroll charts
        rangeSelector: {
            buttons:[{
                type: 'minute',
                count: 60,
                text: '1sa'
            }, {
                type: 'day',
                count: 1,
                text: '1g'
            }, {
                type: 'day',
                count: 3,
                text: '3g'
            },{
                type: 'week',
                count: 1,
                text: '1hf'
            }, {
                type: 'week',
                count: 2,
                text: '2hf'
            },  {
                type: 'all',
                text: 'Tüm'
            }],
            selected: 5,
            inputDateFormat: '%m-%d %H:%M:%S',
            inputEditDateFormat: '%Y-%m-%d %H:%M:%S',
            buttonTheme: {
                fill: {
                    linearGradient: [0, 0, 0, 20],
                    stops: [
                    [0.4, 'hsl(0,0%,80%)'],
                    [0.6, 'hsl(0,0%,70%)']
                    ]
                },
                width: 32,
                stroke: 'hsl(0,0%,50%)',
                style: {
                    color: 'white',
                    fontWeight: 'bold'
                },
                states: {
                    hover: {
                        fill: {
                            linearGradient: [0, 0, 0, 20],
                            stops: [
                            [0.4, '#BBB'],
                            [0.6, '#888']
                            ]
                        },
                        stroke: 'hsl(0, 0%, 50%)'

                    },
                    select: {
                        fill: {
                            linearGradient: [0, 0, 0, 20],
                            stops: [
                            [0.1, 'hsl(0, 0%, 40%)'],
                            [0.3, 'hsl(0, 0%, 50%)']
                            ]
                        },
                        stroke: 'hsl(0, 0%, 50%)',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputStyle: {
                backgroundColor: '#333',
                color: 'hsl(0,0%,40%)',
                width: 120
            },
            labelStyle: {
                color: 'hsl(0,0%,40%)'
            },
            inputEnabled: false
        },

        navigator: {
            enabled: false,
            bottom:0,
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'hsla(0, 0%, 97%, 0.7)',
            series: {
                color: 'hsl(0,0%,80%)',
                lineColor: 'hsl(0,0%,10%)'
            }
        },

        scrollbar: {
            barBackgroundColor: {
                linearGradient: [0, 0, 0, 20],
                stops: [
                [0.2, '#EEE'],
                [0.4, '#DDD'],
                [0.6, '#cecece']
                ]
            },
            barBorderColor: '#777',
            buttonArrowColor: '#444',
            buttonBackgroundColor: {
                linearGradient: [0, 0, 0, 20],
                stops: [
                [0.2, '#EEE'],
                [0.3, '#DDD'],
                [0.6, '#D0D0D0']
                ]
            },
            buttonBorderColor: '#777',
            rifleColor: '#dfdfdf',
            trackBackgroundColor: {
                linearGradient: [0, 0, 0, 10],
                stops: [
                [0, 'hsl(0,0%,70%)'],
                [1, 'hsl(0,0%,72%)']
                ]
            },
            trackBorderColor: '#CCC'
        },
        lang: {
            months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            shortMonths: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
            weekdays: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
            downloadJPEG: 'JPEG olarak kaydet',
            downloadPDF: 'PDF olarak kaydet',
            downloadPNG: 'PNG olarak kaydet',
            downloadSVG: 'SVG olarak kaydet',
            exportButtonTitle: 'Vektör veya resim formatında kaydet',
            printButtonTitle: 'Grafiği yazdır',
            rangeSelectorFrom: '',
            rangeSelectorTo: '-',
            rangeSelectorZoom: 'Aralık: '
        },
        credits: {
            enabled: false
        },

        // special colors for some of the demo examples
        legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
        legendBackgroundColorSolid: 'rgb(70, 70, 70)',
        dataLabelsColor: '#444',
        textColor: '#E0E0E0',
        maskColor: 'rgba(255,255,255,0.3)',
        series: lineData
    };
    
    
    chart = new Highcharts.StockChart(options);
}


function callGraph2(){
    
    var options = {
        chart: {
            borderWidth: 0,
            borderRadius: 15,
            backgroundColor: 'hsla(0,0%,95%,0.5)',
            plotShadow: true,
            plotBorderWidth: 0,
            renderTo: 'graph_container_2'
        },
        title: {
            text: totalSesssionNo2,
            style: {
                color: '#555',
                font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        },
        xAxis: {
            categories: ['Login', 'Bar', 'Line', 'Share', 'Target', 'Peaklist', 'Monitor', 'Diğer'],
            minTickInterval: 1,
            gridLineWidth: 0,
            lineColor: '#999',
            tickColor: '#999',
            labels: {
                style: {
                    color: '#444',
                    fontWeight: 'bold'
                }
            },
            
            title: {
                style: {
                    color: '#AAA',
                    font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                }
            },
            offset: 0
        },
        
        yAxis: {
            
            alternateGridColor: null,
            minorTickInterval: 1,
            type: 'logarithmic',
            dateTimeLabelFormats:{
                second: '%M:%S',
                minute: '%M:%S',
                hour: '%H:%M:%S',
                day: '%e. %b',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
            
            gridLineColor: 'hsla(0, 0%, 60%,.8)',
            lineWidth: 0,
            tickWidth: 1,
            labels: {
                style: {
                    color: '#999',
                    fontWeight: 'bold'
                }
            },
            
            title: {
                text: 'Toplam Süre (Dakika)',
                style: {
                    color: '#333',
                    font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                }
            }
        },
        labels: {
            style: {
                color: '#CCC'
            }
        },
        tooltip: {
            enabled: false
        },
        
        plotOptions: {
            column: {
                borderRadius: 3,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        var secs = this.y*60;
                        var hours = Math.floor(secs / (60 * 60));
   
                        var divisor_for_minutes = secs % (60 * 60);
                        var minutes = Math.floor(divisor_for_minutes / 60);
 
                        var divisor_for_seconds = divisor_for_minutes % 60;
                        var seconds = Math.ceil(divisor_for_seconds);
   
                        var obj = {
                            "h": hours,
                            "m": minutes,
                            "s": seconds
                        };
                        return obj.h+'s '+obj.m+'d '+ obj.s +'s';
                    }
                }
            }
        },
        
        toolbar: {
            itemStyle: {
                color: '#CCC'
            }
        },

        lang: {
            months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            shortMonths: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
            weekdays: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
            downloadJPEG: 'JPEG olarak kaydet',
            downloadPDF: 'PDF olarak kaydet',
            downloadPNG: 'PNG olarak kaydet',
            downloadSVG: 'SVG olarak kaydet',
            exportButtonTitle: 'Vektör veya resim formatında kaydet',
            printButtonTitle: 'Grafiği yazdır',
            rangeSelectorFrom: '',
            rangeSelectorTo: '-',
            rangeSelectorZoom: 'Aralık: '
        },
        
        // special colors for some of the demo examples
        dataLabelsColor: '#444',
        textColor: '#E0E0E0',
        maskColor: 'rgba(255,255,255,0.3)',
        
        series: [{
            type: 'column',
            name: 'Toplam ziyaret süresi',
            data: barData,
            color: '#7798BF'
        }],
        legend:{
            enabled: false
        },
        credits:{
            enabled: false
        }
        
    };
    
    
    
    chart2 = new Highcharts.Chart(options);
}

var chart,chart2;
var lineData, barData;
var totalSesssionNo, totalSesssionNo2;