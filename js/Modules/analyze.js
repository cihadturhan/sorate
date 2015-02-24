var minGraphHour = 8,
        minGraphTweet = 5,
        graphZoomCoeff = 4;
// Global Variables
var delimeter = ',';

Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: highchartsLang[lang_array['lang']]
});

Analyze = function(container) {
    this.reports = [];
    this.container = container;
    this.timers = [];
    this.processing = false;
    this.allKeylist = {};
    this.ready = false;
    this.resumeKeylist = [];
    this.xhrPool = [];
    this.selectData = {};
    this.programData = {};
    this.graphResponseData = {};
    this.summaryResponseData = {};
    this.graphQueryData = {
        mod: 'detail'
    };
    this.tweetQueryData = {
        mod: 'tweetinterval'
    };
    this.tweetList = {};
    this.key = '';

    this.filetype = 'xlsx';
    this.xlsData = [];
};


Analyze.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        This.prepareDOM();
        This.downloadKeylist();
        This.ready = true;
    });
};

Analyze.prototype.destroy = function() {
    for (var i = 0; i < this.reports.length; i++) {
        if (this.reports[i].chart) {
            this.removeChart(i);
        }
    }
    this.container.html('');
};

Analyze.prototype.stop = function() {

};

Analyze.prototype.start = function() {

};

Analyze.prototype.reset = function() {

};

Analyze.prototype.resume = function() {

};

Analyze.prototype.$ = Common.prototype.$;
Analyze.prototype.animateContainers = Common.prototype.animateContainers;
Analyze.prototype.addKeyGroupListeners = Common.prototype.addKeyGroupListeners;

Analyze.prototype.pushFront = Common.prototype.pushFront;
Analyze.prototype.pushRecursively = Common.prototype.pushRecursively;

Analyze.prototype.loadKeygroup = Common.prototype.loadKeyGroup;
Analyze.prototype.resetKeygroup = Common.prototype.resetKeyGroup;
Analyze.prototype.updateGroupList = Common.prototype.updateGroupList;
Analyze.prototype.downloadKeylist = Common.prototype.downloadKeylist;
Analyze.prototype.uploadKeylist = Common.prototype.uploadKeylist;

Analyze.prototype.datetimeIntervalPicker = Common.prototype.datetimeIntervalPicker;

Analyze.prototype.myGet = Common.prototype.myGet;
Analyze.prototype.addExportButton = Common.prototype.addExportButton;
Analyze.prototype.excelExport = Common.prototype.excelExport;



Analyze.prototype.prepareDOM = function() {
    var containers = ['.header'];
    this.animateContainers(containers);

    this.$('.tweet_container ul').css('max-height', this.$('.analyze_container').innerHeight() / 2 + 'px');
    this.addCallbacks();
    console.log(this.$('.export_container'));
};


Analyze.prototype.addCallbacks = function() {
    var This = this;

    this.addKeyGroupListeners({
        add: function(key) {
            This.addKeyword(key, true);
        }, remove: function(key) {

        }, select: function(key) {

        }, cancel: function(key) {

        },
        keyup: function(key) {
        }, save: function(newGroupName, newkeygroup, oldGroupName) {

        }
    });

    this.$('button.widget_export').click(function() {
        This.tweetWidgetExport();
    });



    this.$('button[name=add_report]').click(function() {
        This.$('.new_analyze_popup').myShow();
        return false;
    });

    this.$(".analyze_container").click(function() {
        //This.$(".new_analyze_popup").myHide();
        This.$('.new_report').click();
        This.$('.tweet_container').myHide();
    });


    /* INTERVAL LISTENER START */
    this.datetimeIntervalPicker({}, function(start, end) {
        This.setTimes(start, end);
    });


    /* INTERVAL LISTENER END */


    this.$('input.hasDatepicker, .new_report').click(function() {
        stopTransition(This.$(".group_list li"), 0);
        stopTransition(This.$(".kw_list_popup").children(), 0);
        setTransition(This.$(".kw_list_popup").children(), {opacity: 1}, 100);
        setTransition(This.$(".group_list li"), {opacity: 0}, 100);

        This.$(".group_list, .kw_list_popup ").myHide();
        return false;
    });

    this.$('.detail_wrapper').dragsort({
        itemSelector: 'li',
        dragSelector: 'li div.container_header',
        placeHolderTemplate: '<li class="report container" style="left:-10px"></li>',
        dragBetween: true,
        scrollContainer: This.$('.detail_wrapper'),
        scrollSpeed: 30
    });


    this.$('.detail_wrapper').mousewheel(function(e, delta, deltax, deltay) {
        This.$('.tweet_container').myHide();
    });
};


Analyze.prototype.setTimes = function(start, end) {
    this.graphQueryData.starttime = start.format('YYYY-MM-DD HH:mm:ss');
    this.graphQueryData.endtime = end.format('YYYY-MM-DD HH:mm:ss');
};

Analyze.prototype.addKeyword = function(key) {
    var keyArray = Object.keys(this.allKeylist);

    if ($.inArray(key, keyArray) != -1) {
        this.allKeylist[key].drawn = true;
    } else {
        var newObject = {color: get_random_color(), keylist: [key], drawn: true};
        this.allKeylist[key] = newObject;
    }

    this.graphQueryData.keylist = JSON.stringify({'list': this.allKeylist[key].keylist});

    this.updateGroupList();
    this.requestGraphData();
    this.$("input[name=keyword]").val('');
    this.key = key;
};


Analyze.prototype.requestGraphData = function() {
    this.graphQueryData.datatype = 'graph';
    var This = this;
    this.myGet('data_manager', this.graphQueryData, function(data) {
        This.graphResponseData = data;
        var args = This.createGraph(This.graphQueryData);
        // This.$('.new_analyze_popup').myHide();
        This.requestSummaryData(args);
    }, function(data, textStatus) {
        console.warn('Graph data not recieved (' + textStatus + ')');
    }, 'json', function() {
        This.$('button[name=add_current]').removeAttr('disabled');
    });
};


Analyze.prototype.requestSummaryData = function(args) {
    this.graphQueryData.datatype = 'summary';
    var This = this;
    this.myGet('data_manager', this.graphQueryData, function(data) {
        This.summaryResponseData = data;
        This.createSummary(args);
        This.createXLSData(This.graphQueryData);
        if (This.$('button.export').length === 0)
            This.addExportButton(This.$('.export_container'));
        console.log(data);
    }, function(data, textStatus) {
        console.warn('Graph data not recieved (' + textStatus + ')');
    }, 'json', function() {
        This.$('button[name=add_current]').removeAttr('disabled');
    });
};

Analyze.prototype.createXLSData = function(queryData) {
    var obj = {
        queryDate: [queryData.starttime, queryData.endtime],
        groupName: this.key,
        keywords: this.allKeylist[this.key].keylist,
        graphData: this.graphResponseData,
        summaryData: this.summaryResponseData[0],
        picture: svg2bitmap(this.reports.last().chart,
                {
                    chart: {width: 720, height: 315,
                        events: {
                            load: function() {
                                $(this.container).find('.highcharts-input-group, .highcharts-button, svg>text').remove();
                            }
                        }
                    },
                    navigator: {enabled: false},
                    navigation: {
                        buttonOptions: {
                            enabled: false
                        }},
                    scrollbar: {enabled: false},
                    title: {text: ""},
                    xAxis: {events: {afterSetExtremes: function() {
                            }}}
                }
        )
    };
    this.xlsData.push(obj);
};

Analyze.prototype.createSummary = Common.prototype.createSummary;

Analyze.prototype.removeChart = function(index) {
    var report = this.reports[index];
    var cont = $(report.chart.container).closest('.report');
    cont.children('.maniplation, .close').unbind();
    if (!report.chart)
        console.error('no report found');

    report.chart.destroy();
    delete report.chart;
    report.chart = null;
    delete report;
    report = null;
    this.removeXLSData(index);
    cont.transition({height: 0, duration: 300}, function() {
        $(this).remove();
    });
};

Analyze.prototype.removeXLSData = function(index) {
    this.xlsData[index] = null;
};


Analyze.prototype.createGraph = function(queryData) {
    var This = this;
    var container = $('<li>').addClass('report container').appendTo(this.$('.detail_wrapper'));

    var header = $('<div>').addClass('container_header').appendTo(container);

    $('<span>').html(this.key).appendTo(header);
    $('<span>').html(this.allKeylist[this.key].keylist.join(', ')).css({color: SBTLBLUE, marginLeft: '15px'}).appendTo(header);

    var reportIndex = this.reports.length;

    var graphContainer = $('<div>').addClass('graph-container').appendTo(container);
    this.summaryContainer = $('<div>').addClass('info-container').appendTo(container);

    var programStart = moment(this.graphQueryData.starttime).format('LLL');
    var programEnd = moment(this.graphQueryData.endtime).format('LLL');

    var data = [];

    for (var key in this.graphResponseData) {
        data.push([
            moment(key).valueOf(),
            this.graphResponseData[key]['list']
        ]);
    }


    var groupList = this.allKeylist[this.key];
    var color = groupList.color;
    var name = this.key;
    var keylist = groupList.keylist;

    // arrange cursor
    var max = moment(this.graphQueryData.endtime);
    var min = moment(this.graphQueryData.starttime);
    var interval = max.diff(min, 'hours', true);
    var cursor;

    if (interval > minGraphHour) {
        cursor = 'ew-resize';
    } else {
        cursor = 'pointer';
    }


    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: graphContainer[0],
            type: 'spline',
            backgroundColor: 'hsla(0,0%,100%, 0.5)',
            margin: 30,
            zoomType: 'x',
            events: {
                click: function() {
                    This.$('.detail_wrapper').click();
                }
            }
        },
        title: {
            text: programStart + " - " + programEnd,
            style: {
                color: 'hsl(0,0%,40%)',
                fontSize: '16px'
            }
        },
        xAxis: {
            events: {
                afterSetExtremes: function(e) {
                    This.afterSetExtremes(e, this.chart);
                }
            },
            minRange: 20 * 60 * 1000 // twenty minute
        },
        yAxis: {
            title: {
                text: ""
            },
            startOnTick: false,
            min: -0.5,
            gridLineWidth: 0.5,
            gridLineColor: '#ddd',
            minTickInterval: 1

        },
        navigator: {
            adaptToUpdatedData: false,
            maskFill: 'hsla(0, 0%, 100%, 0.75)',
            series: {
                lineColor: color,
                type: 'spline',
                lineWidth: 3

            }
        },
        scrollbar: {
            liveRedraw: false
        },
        plotOptions: {
            series: {
                cursor: cursor,
                point: {
                    events: {
                        click: function(event) {
                            var chart = this.series.chart;
                            var axis = chart.xAxis[0];
                            var extremes = chart.xAxis[0].getExtremes();

                            var interval = moment(extremes.max).diff(moment(extremes.min), 'hours', true);


                            if (interval < minGraphHour) {
                                This.requestTweets(this.x, this.y, this.series.options.hashtags, this, chart);
                                event.preventDefault();
                                return false;
                            } else {
                                var intervalNum = extremes.max - extremes.min;
                                var segment = Math.round(intervalNum / 2 / graphZoomCoeff);
                                var min = this.x - segment;
                                var max = this.x + segment;
                                axis.setExtremes(min, max, true, true);
                            }

                        }
                    }
                },
                marker: {
                    enabled: true,
                    radius: 3,
                    fill: 'transparent',
                    states: {
                        select: {
                            fillColor: 'red',
                            lineWidth: 0
                        }
                    }
                }
            }
        },
        rangeSelector: {
            selected: 3,
            buttons: [{
                    type: 'minute',
                    count: 10,
                    text: '10' + lang_array['m']
                }, {
                    type: 'hour',
                    count: 1,
                    text: '1' + lang_array['hr']
                }, {
                    type: 'hour',
                    count: 6,
                    text: '6' + lang_array['hr']
                }, {
                    type: 'all',
                    text: lang_array['all']
                }],
            buttonSpacing: 2,
            buttonTheme: {
                width: 35,
                fill: {
                    linearGradient: {
                        x1: 0.5,
                        y1: 0,
                        x2: 0.5,
                        y2: 1
                    },
                    stops: [
                        [0, 'hsl(0,0%,95%)'],
                        [1, 'hsl(0,0%,90%)']
                    ]
                },
                stroke: 'hsl(0,0%,70%)',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    textShadow: '0px 1px 1px white'
                },
                states: {
                    hover: {
                        fill: {
                            linearGradient: {
                                x1: 0.5,
                                y1: 0,
                                x2: 0.5,
                                y2: 1
                            },
                            stops: [
                                [0, 'hsl(0,0%,100%)'],
                                [1, 'hsl(0,0%,85%)']
                            ]
                        },
                        cursor: 'pointer'
                    },
                    select: {
                        fill: {
                            linearGradient: {
                                x1: 0.5,
                                y1: 0,
                                x2: 0.5,
                                y2: 1
                            },
                            stops: [
                                [0, 'hsl(0,0%,60%)'],
                                [1, 'hsl(0,0%,85%)']
                            ]
                        },
                        style: {
                            color: 'white',
                            textShadow: '0px 1px 1px black'
                        }
                    }
                }
            }
        },
        series: [{
                name: name,
                data: data,
                color: color,
                hashtags: keylist
            }],
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });

    chart.queryData = queryData;

    var report = {
        chart: chart
    };
    this.reports.push(report);

    return {index: reportIndex, container: container};
};

Analyze.prototype.afterSetExtremes = function(e, chart) {

    var max = moment(Math.round(e.max));
    var min = moment(Math.round(e.min));

    if (!chart.queryData)
        return;

    chart.queryData.starttime = min.format('YYYY-MM-DD HH:mm:ss');
    chart.queryData.endtime = max.format('YYYY-MM-DD HH:mm:ss');
    chart.queryData.datatype = 'graph';
    chart.showLoading('Loading data from server...');

    var interval = max.diff(min, 'hours', true);

    if (interval > minGraphHour) {
        chart.series[0].update(
                {
                    cursor: 'ew-resize',
                }
        , true);
    } else {
        chart.series[0].update(
                {
                    cursor: 'pointer',
                }
        , true);
    }


    this.myGet('data_manager', chart.queryData, function(data) {
        var graphData = [];
        for (var key in data) {
            graphData.push([
                moment(key).valueOf(),
                data[key]['list']
            ]);
        }
        chart.series[0].setData(graphData);
        chart.hideLoading();

    }, function(data, textStatus) {
        console.warn('Graph detail data not recieved (' + textStatus + ')');
    }, 'json', function() {
        // nothing to do...
    });
};


Analyze.prototype.requestTweets = function(timestamp, value, hashtags, point, chart) {

    if (value == 0) {
        this.$('.general_tweet_container ul').html(lang_array['no_tweet']);
        this.adjustPopupPosition(point, chart);
        return;
    }

    var momentObj = moment(timestamp);
    this.tweetQueryData.starttime = momentObj.format('YYYY-MM-DD HH:mm:ss');
    this.tweetQueryData.endtime = momentObj.add('minutes', 1).format('YYYY-MM-DD HH:mm:ss');
    this.tweetQueryData.keylist = JSON.stringify(hashtags);
    this.$('.general_tweet_container .buttons .icon-spinner').show();
    this.$('.general_tweet_container .buttons .widget_export_container').hide();
    this.$('.general_tweet_container ul').html('');
    this.adjustPopupPosition(point, chart);


    this.tweetWidgetData = {};
    this.tweetWidgetData = {
        groupName: '',
        keywords: hashtags,
        queryDate: [this.tweetQueryData.starttime, this.tweetQueryData.endtime]
    };

    var This = this;

    this.myGet('data_manager', this.tweetQueryData, function(data) {
        var length = Object.keys(data).length;
        if (length === 0) {
            This.$('button.widget_export').attr('disabled', 'disabled');
        } else {
            This.$('button.widget_export').removeAttr('disabled');
        }
        
        This.$('.numOfTweets').html(length);
        This.tweetWidgetData.rawData = $.extend({}, data);
        This.tweetList = data;
        This.$('.general_tweet_container .buttons .icon-spinner').hide();
        This.$('.general_tweet_container .buttons .widget_export_container').show();

        var maxTime = 100;
        var minTime = 5;
        var keys = Object.keys(data);

        var avgtime = parseInt(600 / keys.length);
        avgtime = Math.min(avgtime, maxTime);
        avgtime = Math.max(avgtime, minTime);

        This.pushRecursively(avgtime);

    }, function(data, textStatus) {
        console.warn('Tweet data not recieved (' + textStatus + ')');
    });

};

Analyze.prototype.tweetWidgetExport = function() {
    var This = this;

    this.$('button.widget_export').attr('disabled', 'disabled');
    var query = {
        module: 'tweetWidget',
        xlsdata: JSON.stringify(this.tweetWidgetData),
        filetype: 'xls'
    };

    $.ajax({
        type: 'POST',
        url: 'export/excel_printer.php',
        data: query,
        timeout: 60000,
        async: true,
        success: function(url) {
            if (url) {
                var hiddenIframeClass = "hiddenDownloader", iframe = This.$('.' + hiddenIframeClass);
                if (iframe.length === 0) {
                    iframe = $('<iframe>').addClass(hiddenIframeClass).css({'display': 'none'}).appendTo(This.container);
                }
                iframe.attr('src', url);
            } else {
                console.error('Something went wrong');
            }
        },
        error: function(data, textStatus) {
            console.error('Excel URL not retrieved (' + textStatus + ')');
        },
        complete: function(jqXHR) {
            This.$('button.widget_export').removeAttr('disabled');
        }
    });


}

Analyze.prototype.adjustPopupPosition = function(selectedPoint, chart) {
    var This = this;
    var analyze_wrppr = this.$('.detail_wrapper');
    var tweet_cont = this.$('.tweet_container');
    var detail_cont = this.$('.analyze_container');


    var vertical_prop = 'top';
    var vertical_compl = 'bottom';
    var horizontal_prop = 'left';

    var cont = $(chart.container);
    var report_cont = cont.closest('.report');

    var padding = parseInt(cont.css('padding').replace('px', ''));
    var totalLeft = chart.plotLeft + cont.offset().left + padding;
    var totalTop = chart.plotTop + cont.offset().top + padding;

    var relTop = chart.plotTop + report_cont.position().top + selectedPoint.plotY - parseInt(detail_cont.css('padding-top'));

    var x = selectedPoint.plotX, y = selectedPoint.plotY;
    var totalx = totalLeft + x - this.container.offset().left, totaly = totalTop + y - this.container.offset().top;

    tweet_cont.removeClass('p_lefttop p_righttop p_leftbottom p_rightbottom');

    if (totalx > analyze_wrppr.innerWidth() / 2) {
        totalx -= tweet_cont.outerWidth() + 10;
        horizontal_prop = 'right';
    } else {
        totalx += 10;
    }

    if (relTop > analyze_wrppr.height() / 2) {
        totaly = detail_cont.height() - totaly;
        totaly += 60;
        vertical_prop = 'bottom';
        vertical_compl = 'top';

    } else {
        totaly -= 50;
    }

    //TODO - Make x as the minute start... DONE
    var options = {duration: 300};
    options[vertical_prop] = totaly + 'px';
    options[vertical_compl] = 'auto';
    options['left'] = totalx + 'px';

    tweet_cont.transition(options, function() {
        This.$(".tweet_container").myShow();
    });
    tweet_cont.addClass('p_' + horizontal_prop + vertical_prop);
};
