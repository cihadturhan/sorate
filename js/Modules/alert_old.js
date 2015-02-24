
delimeter = ",";
var chartOptions = {
    chart: {
        renderTo: '',
        type: "spline",
        backgroundColor: 'hsla(0,0%,100%, 0.5)',
        margin: 30,
        spacingBottom: 850
    },
    title: {
        text: " ",
        align: "center"

    },
    subtitle: {
        enabled: false,
        text: ""
    },
    xAxis: {
        endOnTick: true,
        type: 'datetime',
        tickInterval: 5000,
        offset: 10,
        minPadding: 0,
        maxPadding: 0,
        plotBands: {// Light air
            from: moment("2013-08-29 10:08:25").valueOf(),
            to: moment("2013-08-29 10:08:30").valueOf(),
            color: 'hsla(0, 100%, 80%, 0.1)'
        },
        labels: {
            enabled: true
        }
    },
    yAxis: {
        title: {
            text: ""
        },
        startOnTick: false,
        min: -0.5,
        gridLineWidth: 1,
        gridLineColor: '#ddd',
        minTickInterval: 5,
        minorTickInterval: 'auto',
        minorGridLineColor: '#F7F7F7'
    },
    plotOptions: {
        spline: {
            lineWidth: 2,
            marker: {
                fillColor: 'transparent',
                lineColor: null,
                lineWidth: 4,
                radius: 1,
                symbol: 'circle'
            },
            states: {
                select: {
                    lineWidth: 3,
                    marker: {
                        radius: 4
                    }
                },
                hover: {
                    enabled: false
                }
            }
        }
    },
    tooltip: {
        useHTML: true,
        formatter: function() {
            return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 0) + ' ' + lang_array['tweets'];
        }
    },
    series: [],
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    }, legend: {
        enabled: false,
        layout: "vertical",
        backgroundColor: "#FFFFFF",
        align: "right",
        verticalAlign: "top",
        floating: true,
        shadow: true
    }
};

Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: highchartsLang[lang_array['lang']]
});

Alert = function(container) {
    this.response = {};
    this.container = container;
    this.timers = [];
    this.ready = false;
    this.xhrPool = [];
    this.chart = null;
    //this.chart = null;
    //this.processing = false;
};

Alert.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        This.prepareDOM();
        This.ready = true;
        This.requestAlertList();
    });
};

Alert.prototype.$ = Common.prototype.$;
Alert.prototype.animateContainers = Common.prototype.animateContainers;

Alert.prototype.myGet = Common.prototype.myGet;
Alert.prototype.pushFront = Common.prototype.pushFront;


Alert.prototype.prepareDOM = function() {
    var containers = ['.new_add_container', '.all_alerts_container', '.right_container'];
    this.animateContainers(containers);
    this.addCallbacks();
    this.createChart();
    // this.requestGraphData();


};

Alert.prototype.addCallbacks = function() {
    var This = this;
    /*this.$("button").click(function () {
     event.preventDefault();
     $(this).hide("slow");
     });*/



    this.$('.cb_container input[type="checkbox"]').click(function() {

        if ($(this).prop('checked')) {
            $('.threshold_text').hide();
            $('.threshold_select_container').show();
        }
        else
        {
            $('.threshold_text').show();
            $('.threshold_select_container').hide();
        }
    });
    this.$('.interval_select_container button.interval_select').click(function() {

        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    });
    this.$('.threshold_select_container button.threshold_select').click(function() {

        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    });
    this.$('.option_link').click(function() {
        var option = This.$('.options').css("display");

        if (option == 'none')// display değerine göre kıyasa gidiyorum.
        {
            $('.options').show();
            This.$('.all_alerts_container ').css('height', '-webkit-calc(100% - 623px)');

        } else {
            This.$('.options').hide();
            This.$('.all_alerts_container ').css('height', "");
        }

    });
    this.$(".text_input").tagsInput({height: "auto",
        width: "auto",
        delimiter: ",",
        defaultText: lang_array['new_keyword'],
        'minChars': 3,
        'maxChars': 40//if not provided there is no limit,
    });
    This.$(".email_input").tagsInput({height: "auto",
        width: "auto",
        delimiter: delimeter,
        defaultText: lang_array['new_keyword'],
        'minChars': 3,
        'onAddTag': checkEmail,
        'maxChars': 40 //if not provided there is no limit,

    });
    This.$(".phone_input").tagsInput({height: "auto",
        width: "auto",
        delimiter: delimeter,
        defaultText: lang_array['new_keyword'],
        'minChars': 3,
        'maxChars': 40, //if not provided there is no limit,
        'onAddTag': checkPhone
    });

};

var checkEmail = function(text) {
    var mail = new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}");
    if (mail.test(text)) {

    } else
    {
        window.alert("Yanlıs formatta giris yaptınız");
        $('.email_input').removeTag(text);
    }

};

var checkPhone = function(text) {
    var phone = new RegExp("^[0-9]{9,10}$");
    if (phone.test(text)) {

    } else
    {
        window.alert("Yanlıs formatta giris yaptınız");
        $('.phone_input').removeTag(text);
    }
};
var thresholdText = function(text) {

    var text = new RegExp("");

};

Alert.prototype.createChart = function() {
    this.chart = new Highcharts.Chart(
            $.extend(true,
            {},
            chartOptions,
            {
                chart: {renderTo: this.$(".graph")[0]},
                series: [{
                        color: 'black',
                        name: 'testdata',
                        data: [{"x": 1377760080000, "y": 0}, {"x": 1377760081000, "y": 0}, {"x": 1377760082000, "y": 0}, {"x": 1377760083000, "y": 1}, {"x": 1377760084000, "y": 1}, {"x": 1377760085000, "y": 2}, {"x": 1377760086000, "y": 3}, {"x": 1377760087000, "y": 3}, {"x": 1377760088000, "y": 3}, {"x": 1377760089000, "y": 4}, {"x": 1377760090000, "y": 6}, {"x": 1377760091000, "y": 6}, {"x": 1377760092000, "y": 6}, {"x": 1377760093000, "y": 6}, {"x": 1377760094000, "y": 6}, {"x": 1377760095000, "y": 6}, {"x": 1377760096000, "y": 6}, {"x": 1377760097000, "y": 6}, {"x": 1377760098000, "y": 7}, {"x": 1377760099000, "y": 8}, {"x": 1377760100000, "y": 8}, {"x": 1377760101000, "y": 9}, {"x": 1377760102000, "y": 11}, {"x": 1377760103000, "y": 12}, {"x": 1377760104000, "y": 12}, {"x": 1377760105000, "y": 12}, {"x": 1377760106000, "y": 13}, {"x": 1377760107000, "y": 13}, {"x": 1377760108000, "y": 13}, {"x": 1377760109000, "y": 14}, {"x": 1377760110000, "y": 14}, {"x": 1377760111000, "y": 14}, {"x": 1377760112000, "y": 15}, {"x": 1377760113000, "y": 15}, {"x": 1377760114000, "y": 15}, {"x": 1377760115000, "y": 16}, {"x": 1377760116000, "y": 18}, {"x": 1377760117000, "y": 18}, {"x": 1377760118000, "y": 19}, {"x": 1377760119000, "y": 20}, {"x": 1377760120000, "y": 20}, {"x": 1377760121000, "y": 20}, {"x": 1377760122000, "y": 20}, {"x": 1377760123000, "y": 20}, {"x": 1377760124000, "y": 21}, {"x": 1377760125000, "y": 22}, {"x": 1377760126000, "y": 24}, {"x": 1377760127000, "y": 24}, {"x": 1377760128000, "y": 24}, {"x": 1377760129000, "y": 24}, {"x": 1377760130000, "y": 24}, {"x": 1377760131000, "y": 24}, {"x": 1377760132000, "y": 24}, {"x": 1377760133000, "y": 24}, {"x": 1377760134000, "y": 24}, {"x": 1377760135000, "y": 25}, {"x": 1377760136000, "y": 25}, {"x": 1377760137000, "y": 27}, {"x": 1377760138000, "y": 27}, {"x": 1377760139000, "y": 27}]
                    }]

            }
    ));
};


Alert.prototype.destroy = function() {
    this.stop();
    this.reset();
};
Alert.prototype.start = function() {
    //this.updateGroupList();
};
Alert.prototype.stop = function(remove) {
    //this.stopTimer(SECONDS);
    this.abortRequests();
};
Alert.prototype.reset = function(remove) {

};
Alert.prototype.resume = function() {
    if (this.ready) {
        //this.updateGroupList();
    }
};
Alert.prototype.abortRequests = function() {
    for (var i = 0; i < this.xhrPool.length; i++) {
        this.xhrPool[i].abort();
    }
    ;
    this.xhrPool.length = 0;
};


//popup hareketinde gerekli...
Alert.prototype.createAndMovePoints = function() {
    var chart = this.heatmap;
    var hchart = this.hourlyChart;

    var cont = $(chart.container);
    var hcont = $(hchart.container);

    var padding = parseInt(cont.css('padding').replace('px', ''));
    var totalLeft = chart.plotLeft + cont.offset().left + padding;
    var totalTop = chart.plotTop + cont.offset().top + padding;

    var hpadding = parseInt(hcont.css('padding').replace('px', ''));
    var htotalLeft = hchart.plotLeft + hcont.offset().left + hpadding;
    var htotalTop = hchart.plotTop + hcont.offset().top + hpadding;

    for (var i = 0; i < chart.series.length; i++) {
        if (!chart.series[i].visible)
            continue;
        var lastpoint = chart.series[i].data.last();
        var x = lastpoint.plotX, y = lastpoint.plotY;
        var totalx = totalLeft + x - 5, totaly = totalTop + y - 5;

        //TODO - Make x as the minute start
        hchart.series[i].addPoint([lastpoint.x - 59 * 1000 * this.multiplier, lastpoint.y], false, true);

        var hlastpoint = hchart.series[i].data.last();
        var hx = hlastpoint.plotX, hy = hlastpoint.plotY;
        var htotalx = htotalLeft + hx - 5, htotaly = htotalTop + hy - 5;



        var animatedPoint = $('<div>').addClass('animated_point').css({left: totalx + 'px', top: totaly + 'px', backgroundColor: chart.series[i].options.color});
        animatedPoint.appendTo($('body'));
        animatedPoint.transition({opacity: 1, duration: 500}).transition({x: htotalx - totalx, y: htotaly - totaly, duration: 1000}).transition({opacity: 0, duration: 500}, function() {
            $(this).remove();
            hchart.redraw(true);
        });
    }
};



Alert.prototype.requestData = function() {
    var This = this;
    this.myGet('data_manager.php',
            {
                mod: 'alert',
                timeInterval: 'minute',
                timeMultiplier: this.multiplier,
                keylist: This.toRequestJSON(this.allKeylist)
            },
    function(data) {
        var keys = Object.keys(data);
        var lastElem = keys[keys.length - 14];
        var currDate = Object.keys(This.response)[0] || lastElem;

        if (This.newAddedKeys.length > 0) {
            for (var i = 0; i < This.newAddedKeys.length; i++) {
                var key = This.newAddedKeys[i];
                This.addNewSerie(This.allKeylist[key].color, key, currDate, data);
                var serie = This.chart.series.last();
                This.addLegend(serie, key);
            }
            This.newAddedKeys = [];
        }

        if (currDate) {
            for (var passed in data) {
                if (passed < currDate) {
                    delete data[passed];
                }
            }
        }

        console.info(data);
        $.extend(This.response, data);

        if (!This.timers[SECONDS]) {
            var keys = Object.keys(This.response);
            var currTime = keys[0];
            This.startPointAdd();
            This.setExtremes(currTime);
        }

        if (!This.timers[TWEETS]) {
            //This.requestTweetData();
            This.requestTweetIfNeeded(false, !This.processing && !This.autoupdate);
        }

    }, function(data, textStatus) {
        console.error('A problem occured, instant data is not retrived (' + textStatus + ')');
    }, 'json');

};


// değişecek ve yeniden yazılacak fonksiyonlar
Alert.prototype.requestGraphData = function() {
    var This = this;
    this.graphQueryData.datatype = 'graph';
    this.myGet('data_manager', this.graphQueryData, function(data) {
        console.log(data);
        This.graphResponseData = data;
        This.createChart();
        This.requestSummaryData();
        This.$('.new_detail_popup').myHide();// ??
    }, function(data, textStatus) {
        console.warn('Graph data not recieved (' + textStatus + ')');
    }, 'json', function() {
        This.$('graph').removeAttr('disabled');
    });

};

/*
 Detail.prototype.requestSummaryData = function() {
 this.graphQueryData.datatype = 'summary';
 var This = this;
 this.myGet('data_manager', this.graphQueryData, function(data) {
 console.log(data);
 This.summaryResponseData = data;
 This.createSummary();
 }, function(data, textStatus) {
 console.warn('Graph data not recieved (' + textStatus + ')');
 }, 'json', function() {
 This.$('button[name=add_current]').removeAttr('disabled');
 });
 };
 
 
 Detail.prototype.createSummary = function() {
 var infoContainer = this.summaryContainer;
 var summ = this.summaryResponseData[0];
 $('<h1>').addClass('tweet_count').html(lang_array['total_tweets']).appendTo(infoContainer);
 $('<h2>').addClass('count').html(summ.tweetCount).appendTo(infoContainer);
 $('<h1>').addClass('unique_user').html(lang_array['unique_users']).appendTo(infoContainer);
 $('<h2>').addClass('unique').html(summ.uniqueUser).appendTo(infoContainer);
 
 if (summ.rating.length > 0) {
 $('<h1>').addClass('tweet_order').html(lang_array['rank']).appendTo(infoContainer);
 for (var i = 0; i < summ.rating.length; i++) {
 var current = summ.rating[i];
 if (current.location === 'Turkey') {
 var h1 = $('<h3>').addClass('turkey position').html('#' + current.position).appendTo(infoContainer);
 $('<span>').addClass('time').html(moment(current.date).format('LLL')).appendTo(h1);
 } else if (current.location === 'World') {
 var h1 = $('<h3>').addClass('world position').html('#' + current.position).appendTo(infoContainer);
 $('<span>').addClass('time').html(moment(current.date).format('LLL')).appendTo(h1);
 }
 }
 
 }
 };
 */

Alert.prototype.toRequestJSON = function(obj) {
    var retObj = {};
    for (var key in obj) {
        if (obj[key].drawn)
            retObj[key] = obj[key]['keylist'];
    }
    return JSON.stringify(retObj);
};


Alert.prototype.requestAlertList = function() {
    var This = this;

    this.myGet('data_manager.php',
            {
                mod: 'alert_list',
                action: 'get_list',
                user_id: user_id
            }, function(data) {
        console.log(data);
        This.alertData = data.result;
        This.createHeatmap();
    }, function(e, errorcode) {
        console.log('Get list not retrieved (' + errorcode + ')');
    }
    );

};

Alert.prototype.createHeatmap = function() {

    var template = [];

    for (var i = 0; i < 28; i++) {
        template[i] = {
            day: Math.floor(i / 7) + 1,
            hour: 1 + i % 7,
            data: 0
        };
    }
    console.log(template);
        

    var This = this;
    var margin = {top: 25, right: 0, bottom: 0, left: 30},
    // width = 420 - margin.left - margin.right,
    //       height = 150 - margin.top - margin.bottom,
    //     gridSize = Math.floor(width / 30),
    //   legendElementWidth = gridSize * 2,
    //buckets = 9,

    //colors = ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"], // alternatively colorbrewer.YlGnBu[9]
    //days = ["4", "8", "12", "16", "20", "24"],
    //times = ["1", "", "", "", "", "", "7", "", "", "", "", "", "", "14", "", "", "", "", "", "", "21", "", "", "", "", "", "", "28", "", ""];

    width = 320 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom,
            gridSize = Math.floor(width / 7),
            legendElementWidth = gridSize,
            buckets = 9,
            colors = ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"], // alternatively colorbrewer.YlGnBu[9]
            days = ["1", "2", "3", "4"],
            times = ["1", "2", "3", "4", "5", "6", "7"];


    d3.tsv("data.tsv",
            function(d) {
                return {
                    day: +d.day,
                    hour: +d.hour,
                    value: +d.value
                };
            },
            function(error, data) {
                var colorScale = d3.scale.quantile()
                        .domain([0, buckets - 1, d3.max(data, function(d) {
                        return d.value;
                    })])
                        .range(colors);

                var i;

                var container = This.$(".all_alerts_pop_container")[0];





                var svg = d3.select(container).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var titleContainer = svg.selectAll(".title_bar")
                        .attr("width", "100%");


                var dayLabels = svg.selectAll(".dayLabel")
                        .data(days)
                        .enter().append("text")
                        .text(function(d) {
                    return d;
                })
                        .attr("x", 0)
                        .attr("y", function(d, i) {
                    return i * gridSize / 2 - gridSize / 4;
                })
                        .style("text-anchor", "end")
                        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                        .attr("class", function(d, i) {
                    return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
                });

                var timeLabels = svg.selectAll(".timeLabel")
                        .data(times)
                        .enter().append("text")
                        .text(function(d) {
                    return d;
                })
                        .attr("x", function(d, i) {
                    return i * gridSize;
                })
                        .attr("y", 0)
                        .style("text-anchor", "middle")
                        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                        .attr("class", function(d, i) {
                    return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
                });

                var heatMap = svg.selectAll(".hour")
                        .data(data)
                        .enter().append("rect")
                        .attr("x", function(d) {
                    return (d.hour - 1) * gridSize;
                })// üst saat değerlerinin x olan uzaklık değeri
                        .attr("y", function(d) {
                    return (d.day - 1) * gridSize / 2;
                })//gün değerlerinn y ye olan uzaklık değeri
                        .attr("rx", 2)// x için radius değeri
                        .attr("ry", 2)// y için radius değeri
                        .attr("class", "hour bordered")
                        .attr("width", gridSize)
                        .attr("height", gridSize / 2)
                        .style("fill", colors[0]);


                heatMap.transition().duration(1000)
                        .style("fill", function(d) {
                    return colorScale(d.value);
                });

                svg.selectAll(".hour").on("click", function(d) {

                    This.$('.alert_list_popup').show();


                });

                heatMap.append("title").text(function(d) {
                    return d.value;
                });

                var legend = svg.selectAll(".legend")
                        .data([0].concat(colorScale.quantiles()), function(d) {
                    return d;
                })
                        .enter().append("g")
                        .attr("class", "legend");

                legend.append("rect")
                        .attr("x", function(d, i) {
                    return legendElementWidth * i;
                })
                        .attr("y", height - 30)// renk scalasını y eksenine göre konumu
                        .attr("width", legendElementWidth)
                        .attr("height", gridSize / 2)
                        .style("fill", function(d, i) {
                    return colors[i];
                });

                legend.append("text")
                        .attr("class", "mono")
                        .text(function(d) {
                    return "≥ " + Math.round(d);
                })
                        .attr("x", function(d, i) {
                    return legendElementWidth * i;
                })
                        .attr("y", height - 10);// renk scalasının yazılarının konumu

            });

};