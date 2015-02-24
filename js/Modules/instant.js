
// Global Variables
var delimeter = ',';

var SECONDS = 0,
        TWEETS = 1;

var MIN_WS = 8,
        MAX_WS = 30,
        ULTRA_WS = 200;

var tweetList = [];
var newAddedKeys = [];


Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: highchartsLang[lang_array['lang']]
});

Highcharts.Series.prototype.setState = (function(func) {
    return function() {
        if (arguments.length > 0) {
            func.apply(this, arguments);
        }
    };
}(Highcharts.Series.prototype.setState));


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
        useHTML: false,
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

var mainChartOverride = {
    xAxis: {
        tickInterval: 5 * 60000,
        labels: {
            enabled: true
        }
    }};



Instant = function(container) {
    this.response = {};
    this.hourlyResponse = {};
    this.tweetList = {};
    this.newAddedKeys = [];
    this.hourlyNewAddedKeys = [];
    this.currentTweetKey = "";
    this.container = container;
    this.chart = null;
    this.hourlyChart = null;
    this.timers = [];
    this.processing = false;
    this.tweetCount = 0;
    this.allKeylist = {};
    this.latestTweetId = 0;
    this.ready = false;
    this.resumeKeylist = [];
    this.multiplier = 1;

    this.tweetQueryData = {
        mod: 'tweet',
        tweet_id: 0,
        keylist: {},
        direction: 'up',
        viewport_size: MIN_WS
    };
    this.autoupdate = false;
    this.xhrPool = [];
};

Instant.prototype.stopTimer = Common.prototype.stopTimer;
Instant.prototype.pushBack = Common.prototype.pushBack;
Instant.prototype.pushFront = Common.prototype.pushFront;
Instant.prototype.popBack = Common.prototype.popBack;
Instant.prototype.popFront = Common.prototype.popFront;
Instant.prototype.myGet = Common.prototype.myGet;
Instant.prototype.animateContainers = Common.prototype.animateContainers;
Instant.prototype.addKeyGroupListeners = Common.prototype.addKeyGroupListeners;
Instant.prototype.$ = Common.prototype.$;
Instant.prototype.loadKeygroup = Common.prototype.loadKeyGroup;
Instant.prototype.resetKeygroup = Common.prototype.resetKeyGroup;
Instant.prototype.updateGroupList = Common.prototype.updateGroupList;
Instant.prototype.downloadKeylist = Common.prototype.downloadKeylist;
Instant.prototype.uploadKeylist = Common.prototype.uploadKeylist;

Instant.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        This.createSecondlyChart();
        This.createHourlyChart();
        This.chart.container.onclick = null;
        This.hourlyChart.container.onclick = null;
        This.downloadKeylist();
        This.prepareDOM();
        This.ready = true;
    });
};


Instant.prototype.destroy = function() {
    this.stop();
    this.chart.destroy();
    delete this.chart;
    this.hourlyChart.destroy();
    delete this.hourlyChart;
    this.container.html('');
    this.reset();
};



Instant.prototype.start = function() {

    this.updateGroupList();
    this.requestHourlyData();
};


Instant.prototype.stop = function(remove) {
    this.stopTimer(SECONDS);

    var isRemove = typeof remove === 'undefined' ? true : remove;

    if (isRemove) {
        this.stopTimer(TWEETS);
    }

    this.abortRequests();
    if (this.chart.series.length > 0)
        this.clearGraphs(isRemove);
};

Instant.prototype.resume = function() {
    if (this.ready && this.resumeKeylist.length > 0) {

        for (var i = 0; i < this.resumeKeylist.length; i++) {
            var key = this.resumeKeylist[i];
            this.addKeyword(key, false);
        }

        //this.$('.tweet_section select').val(this.currentTweetKey);
        this.$('.legend_main li[data-value=' + this.currentTweetKey + ']').addClass('selected');

        this.updateGroupList();
        this.requestHourlyData();
        this.resumeKeylist.length = 0;
    } else {
        //onCatchableError(printStackTrace());
        console.warn('module is not ready');
    }
};


Instant.prototype.abortRequests = Common.prototype.abortRequests;



Instant.prototype.clearGraphs = function(remove) {
    for (var key in this.allKeylist) {
        if (this.allKeylist[key].drawn === true) {
            this.resumeKeylist.push(key);
            this.removeSerie(key, remove);
        }
    }
};

Instant.prototype.reset = function() {
    this.tweetCount = 0;
    this.timers = [];
    this.response = {};
    this.hourlyResponse = {};
    this.tweetList = {};
    this.latestTweetId = 0;
};


Instant.prototype.createSecondlyChart = function() {
    var This = this;
    this.chart = new Highcharts.Chart(
            $.extend(true,
                    {},
                    chartOptions,
                    {chart: {renderTo: This.$(".detail_highcharts_container")[0]},
                        xAxis: {
                            min: current().subtract('seconds', 75).seconds(0).valueOf(),
                            max: current().subtract('seconds', 75).seconds(59).valueOf()
                        }
                    }
            ));
};

Instant.prototype.createHourlyChart = function() {
    var This = this;
    this.hourlyChart = new Highcharts.Chart(
            $.extend(true,
                    {},
                    chartOptions,
                    mainChartOverride,
                    {chart: {renderTo: This.$(".main_highcharts_container")[0]}}
            ));
};


Instant.prototype.addLegend = function(series, key) {
    var This = this;


//    var $legend = $(this.chart.container).children('ul');
    var $legend = this.$('.legend_main ul');
    var options = this.chart.options.legend;

    var $legendItem = $('<li>').css(options[series.visible ? 'itemStyle' : 'itemHiddenStyle'])
            .css({color: series.color})
            .html(series.name)
            .attr({
                'data-title': this.allKeylist[key]['keylist'].join(delimeter),
                'data-value': series.name
            })
            .append('<span class="close_button"> x </span>')
            .appendTo($legend);

    if ($legend.children().length === 1) {
        $legendItem.addClass('selected').mouseenter();
    }

    /*$legendItem.tooltip({
     content: function() {
     return $(this).attr('title');
     }
     });*/

    $legendItem.children('span').click(function() {
        This.removeSerie(key);
    });

    $legendItem.click(function() {
        var hseries = This.hourlyChart.series[This.findSeriePosByName(key)];
        This.clickItem(series, hseries, $legendItem, options);
    });
};

Instant.prototype.clickItem = function(series, hseries, $legendItem, options) {
    try {
        for (var i = 0; i < this.hourlyChart.series.length; i++) {
            this.hourlyChart.series[i].setState('');
            this.chart.series[i].setState('');
        }
    } catch (e) {
        printStackTrace({e: e});
    }

    hseries.setState('select');
    series.setState('select');

};



Instant.prototype.addNewSerie = function(color, name, time, timeData) {
    var This = this;
    var keys = Object.keys(timeData);
    var start = this.findMinuteStart(timeData);
    var end = findPlace(timeData, time);
    if (start > end)
        start = 0;

    var diff = end - start;


    this.chart.addSeries({
        color: color,
        name: name,
        data: (function() {
            // generate an array of random data
            var tempData = [];
            var prev = 0;

            if (diff != 60) {
                for (var i = 0; i < 60 - diff; i++) {
                    tempData.push({
                        x: moment(keys[start]).valueOf() - (60 - diff - i) * This.multiplier * 1000,
                        y: 0
                    });
                }
            }

            for (var i = start; i < end; i++) {
                tempData.push({
                    x: moment(keys[i]).valueOf(),
                    y: timeData[keys[i]][name] + prev
                });
                prev = tempData.last().y;

            }

            return tempData;
        })()
    }, false, true);
};

Instant.prototype.addNewHourlySerie = function(color, name) {
    var This = this;
    this.hourlyChart.addSeries({
        color: color,
        name: name,
        data: (function() {
            var tempData = [];
            for (var key in This.hourlyResponse) {
                tempData.push({
                    x: moment(key).valueOf(),
                    y: This.hourlyResponse[key][name]
                });
            }
            return tempData;
        })()
    }, true, true);
};

Instant.prototype.removeSerie = function(name, remove) {
    var isRemove = typeof remove === 'undefined' ? true : remove;
    this.$('.legend_main li[data-value="' + name + '"]').remove();
    this.hideShowTweetsButton();

    if (isRemove) {
        this.allKeylist[name].drawn = false;
        this.requestTweetIfNeeded();
        this.updateGroupList();
    }

    var pos = this.findSeriePosByName(name);
    if (pos != -1) {
        this.chart.series[pos].remove();
        this.hourlyChart.series[pos].remove();
    } else {
        console.error('non-existing serie is being tried to remove.');
    }

    if (this.chart.series.length == 0) {
        this.response = {};
        if (isRemove) {
            this.stop();
            this.reset();
        }

        this.$('.legend_sub ul').html('');
    }
};


Instant.prototype.prepareDOM = function() {
    this.addCallbacks();
    var This = this;
    var containers = ['.selection_container', '.main_graph_container', '.legend_container', '.detail_graph_container', '.tweet_container'];
    this.animateContainers(containers);
//this.$('selection_container, , .detail_graph_container, .tweet_section').transition({opacity: 1, rotateY: 0}, 500);
//this.$('.selection_container').transition({opacity: 1, rotateY:0}, 500);


    var changeGraphColors = function() {
        var currentKey = This.$("input[name=keyword]").val();
        var drawn = false;

        if (This.allKeylist[currentKey]) {
            drawn = This.allKeylist[currentKey].drawn;
        }

        var color = '#' + this.toString();

        if (drawn) {
            This.$('li[data-value=' + currentKey + ']').css('color', color);
            var pos = This.findSeriePosByName(currentKey);
            if (pos != -1) {
                This.chart.series[pos].update({color: color}, true);
                This.hourlyChart.series[pos].update({color: color}, true);
            }
        }
    };

    this.addKeyGroupListeners({
        add: function(key) {
            This.addKeyword(key, true);
        }, remove: function(key) {
            This.removeSerie(key);
        }, select: function(key) {
            if (This.allKeylist[key].drawn)
                This.$('button[name=add_kw]').attr('disabled', 'disabled');
            else
                This.$('button[name=add_kw]').removeAttr('disabled');
        }, cancel: function(key) {
            var drawn = false;

            if (This.allKeylist[key]) {
                drawn = This.allKeylist[key].drawn;
            }

            var color = This.allKeylist[key].color;

            if (drawn) {
                This.$('li[data-value=' + key + ']').css('color', color);
                var pos = This.findSeriePosByName(key);
                if (pos != -1) {
                    This.chart.series[pos].update({color: color}, true);
                    This.hourlyChart.series[pos].update({color: color}, true);
                }
            }
        },
        colorChange: changeGraphColors,
        keyup: function(key) {
            if (!This.allKeylist[key].drawn) {
                This.$('button[name=add_kw]').removeAttr('disabled');
            } else {
                This.$('button[name=add_kw]').attr('disabled', 'disabled');
            }
        }, save: function(newGroupName, newkeygroup, oldGroupName) {
            var keylist = newkeygroup.keylist;
            var color = newkeygroup.color;
            var existingKey = This.$('.legend_main li.selected').attr('data-value');

            This.allKeylist[newGroupName] = newkeygroup;
            This.tweetQueryData.keylist = JSON.stringify(keylist);
            This.requestTweetIfNeeded(false, oldGroupName == existingKey);

            if (newkeygroup.drawn) {
                $('li[data-value=' + newGroupName + ']').css('color', color).attr('data-title', keylist.join('<br/>'));
                var pos = This.findSeriePosByName(newGroupName);
                if (pos != -1) {
                    This.chart.series[pos].update({color: color}, true);
                    This.hourlyChart.series[pos].update({color: color}, true);
                }
            }
        }
    });
};





Instant.prototype.changeInterval = function(multiplier) {
    var mult = parseInt(multiplier);
    if (mult === this.multiplier)
        return;
    this.multiplier = mult;
    this.stop(false);
    var chart = this.chart;
    var hchart = this.hourlyChart;

    chart.xAxis[0].update({tickInterval: mult * 5000}, true);
    hchart.xAxis[0].update({tickInterval: mult * 60 * 5000}, true);
    this.$('.multiplier').text(multiplier);

    this.resume();
};

Instant.prototype.addCallbacks = function() {
    var This = this;


    This.$('.time_select').click(function() {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        This.changeInterval($(this).html());
    });


    This.$('.legend_main').on('mouseout', function() {
        $(this).find('ul .selected').mouseenter();
    });

    This.$('button[name=show_tweets]').click(function() {
        This.requestUpdatedTweets();
    });

    setTimeout(function() {
        This.$('.general_container').click();
    });

    This.bindMouseWheel();

    $('input[name=autoupdate]').click(function() {
        if ($(this).prop('checked')) {
            This.autoupdate = true;
            This.stopTimer(TWEETS);
            This.unbindMouseWheel();
            This.$('button[name=show_tweets]').attr('disabled', 'disabled');
        } else {
            This.autoupdate = false;
            This.bindMouseWheel();
            This.$('button[name=show_tweets]').removeAttr('disabled').click();
            ;
        }
    });


    this.$('.legend_main ul').delegate('li', 'mouseenter', function() {
        if ($(this).hasClass('.hovered'))
            return;

        This.$('.legend_main ul li').removeClass('hovered');
        $(this).addClass('hovered');


        var subCont = This.$('.legend_sub ul').html('');
        var keywords = $(this).attr('data-title').split(delimeter);

        for (var i = 0; i < keywords.length; i++) {
            $('<li>').html(keywords[i]).appendTo(subCont);
        }
    });

    this.$('.legend_main ul').delegate('li', 'click', function() {
        if ($(this).hasClass('selected'))
            return;

        This.$('.legend_main ul li').removeClass('selected');
        $(this).addClass('selected');

        This.requestTweetIfNeeded();

    });
};

Instant.prototype.requestUpdatedTweets = function() {
    var tweetNum = this.autoupdate ? ULTRA_WS : Math.min(MAX_WS, parseInt(this.$('.new_tweet_no').html()));
    this.tweetQueryData.viewport_size = tweetNum;
    this.tweetQueryData.direction = 'up';
    this.tweetQueryData.tweet_id = this.$('.general_tweet_container ul').find('li:first').attr('data-id');
    this.requestTweetData();
};

Instant.prototype.bindMouseWheel = function() {
    var This = this;
    This.$('.general_tweet_container ul').mousewheel(function(e, delta, deltax, deltay) {
        if (This.processing)
            return;

        if (delta > 0) {
            if ($(this).scrollTop() <= 0) {
                This.tweetQueryData.direction = 'up';
                This.tweetQueryData.viewport_size = MIN_WS;
                This.tweetQueryData.tweet_id = $(this).children('li:first').attr('data-id');
                This.requestTweetData();
            }
        }
        else {
            if ($(this).scrollTop() >= ($(this).prop("scrollHeight") - $(this).height())) {
                This.tweetQueryData.direction = 'down';
                This.tweetQueryData.viewport_size = MIN_WS;
                This.tweetQueryData.tweet_id = $(this).children('li:last').attr('data-id');
                This.requestTweetData();
            }
        }
    });
};

Instant.prototype.unbindMouseWheel = function() {
    this.$('.general_tweet_container ul').unmousewheel();
};

Instant.prototype.addKeyword = function(key, update) {
    var keyArray = Object.keys(this.allKeylist);

    if ($.inArray(key, keyArray) !== -1) {
        this.allKeylist[key].drawn = true;
    } else {
        var newObject = {color: get_random_color(), keylist: [key], drawn: true};
        this.allKeylist[key] = newObject;
    }

    if (update) {
        this.updateGroupList();
        this.requestHourlyData();
        this.$("input[name=keyword]").val('');
    }

    this.newAddedKeys.push(key);
    this.hourlyNewAddedKeys.push(key);

};

Instant.prototype.requestTweetIfNeeded = function(key, forceUpdate) {
    //var val = this.$(".tweet_section select").val() || key;
    if (this.$('.legend_main li').length > 0 && this.$('.legend_main li.selected').length == 0)
        this.$('.legend_main li:eq(0)').addClass('selected');

    var val = this.$('.legend_main li.selected').attr('data-value') || key;
    if (!val) {
        this.$('.general_tweet_container ul').html('');
        return;
    }

    if (val !== this.currentTweetKey || forceUpdate) {
        var keylist = this.allKeylist[val].keylist;
        this.tweetQueryData.keylist = JSON.stringify(keylist);
        this.currentTweetKey = val;
        this.latestTweetId = 0;
        this.tweetQueryData.viewport_size = MIN_WS;
        this.tweetQueryData.direction = 'up';
        this.tweetQueryData.tweet_id = 0;
        this.requestTweetData();
        this.$('.general_tweet_container ul').html('');
    }
};

Instant.prototype.startPointAdd = function() {
    this.startPlotGraph();
};




Instant.prototype.startPlotGraph = function() {
    if (this.timers[SECONDS]) {
        console.warn('graph timer already started');
        return;
    }
    console.log('startPlotGraph called');

    var This = this;
    var timer = setInterval(function() {
        This.addCurrentPoints();
    }, this.multiplier * 1000);
    this.timers[SECONDS] = timer;
};

Instant.prototype.startTweetCount = function() {
    if (this.timers[TWEETS]) {
        console.warn('tweet timer already started');
        return;
    }

    var This = this;
    //this.countTweets();
    var timer2 = setInterval(function() {
        This.countTweets();
    }, 10000);
    this.timers[TWEETS] = timer2;

};




Instant.prototype.createAndMovePoints = function() {
    var chart = this.chart;
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



Instant.prototype.findSeriePosByName = function(name) {
    for (var i = 0; i < this.chart.series.length; i++) {
        if (this.chart.series[i].name == name) {
            return i;
        }
    }
    return -1;
};

Instant.prototype.addCurrentPoints = function() {
    var keys = Object.keys(this.response);
    var currTime = keys[0];
    var currMoment = moment(currTime);
    if (typeof currTime === 'undefined')
        return;

    var currDateObj = currMoment.toDate();
    var timeInMs = currMoment.valueOf();
    console.log(currMoment.format('H:m:s') + "  " + timeInMs);

    if (this.isEqual(currDateObj, 0)) {
        for (var i = 0; i < this.chart.series.length; i++) {
            for (var j = 0; j < this.chart.series[i].data.length; j++) {
                this.chart.series[i].data[j].update(0, false);
            }
        }
    }

    for (var groupName in this.response[currTime]) {
        var pos = this.findSeriePosByName(groupName);
        var currValue = this.response[currTime][groupName];


        if (pos != -1) {
            var prev = 0;
            try {
                prev = this.chart.series[pos].yData.last();
            } catch (e) {
                console.error('couln\'t find position');
            }
            ;

            this.chart.series[pos].addPoint([timeInMs, prev + currValue], false, true);
        } else {
            console.warn('this chart is not inside our etc.');
        }
    }



    var extremes = this.chart.xAxis[0].getExtremes();
    if (timeInMs < extremes.min || timeInMs > extremes.max) {
        this.setExtremes(currTime);
    }

    if (this.isGreater(currDateObj, 0)) {
        this.chart.setTitle({text: currMoment.format('HH:mm:ss')});
        this.chart.redraw();
    }

    if (this.isEqual(currDateObj, 59)) {
        this.createAndMovePoints();
    }

    delete this.response[currTime];

    // TODO - Assign a variable and check each second 
    if (keys.length == 3) {
        this.requestData();
    }

    if (this.autoupdate) {
        this.checkAndPushTweets(currMoment);
    }
};

Instant.prototype.checkAndPushTweets = function(currMoment) {
    var tweetKeys = sorted_keys(this.tweetList);
    var lastMoment = currMoment.clone().subtract('seconds', 6);
    if (tweetKeys.length > 0)
        lastMoment = moment(this.tweetList[tweetKeys.last()].tweetTime);

    var currPastKeys = this.getCurrentAndPastKeys(tweetKeys, currMoment);
    this.setTweetCount(currPastKeys.length, 500);

    for (var subkey = 0; subkey < currPastKeys.length; subkey++) {
        var currKey = currPastKeys[subkey];
        var data = this.tweetList[currKey];
        data.tweetId = currKey;
        this.setLatestTweetId(data.tweetId);

        if (this.$('.general_tweet_container ul li').length >= 30)
            this.popBack();

        this.pushFront(data);
        delete this.tweetList[currKey];
    }
    if (lastMoment.diff(currMoment, 'seconds') < 5) {
        this.requestUpdatedTweets();
    }
};

Instant.prototype.getCurrentAndPastKeys = function(tweetKeys, currMoment) {
    var retArr = [];
    for (var i = 0; i < tweetKeys.length; i++) {
        var keytime = this.tweetList[tweetKeys[i]].tweetTime;
        var keyMoment = moment(keytime);
        if (keyMoment.isBefore(currMoment, 'seconds') || keyMoment.isSame(currMoment, 'seconds')) {
            retArr.push(tweetKeys[i]);
        }
    }
    return retArr;
};


Instant.prototype.setExtremes = function(currTime) {
    var subtracted = moment(currTime).minutes() % this.multiplier;
    var added = this.multiplier - subtracted - 1;

    var min = moment(currTime).subtract('minutes', subtracted).seconds(0);
    var max = moment(currTime).add('minutes', added).seconds(59);

    this.chart.xAxis[0].setExtremes(min.valueOf(), max.valueOf(), true, true);
};



Instant.prototype.requestHourlyData = function() {
    var This = this;
    this.myGet('data_manager.php',
            {
                mod: 'instant',
                timeInterval: 'hour',
                timeMultiplier: this.multiplier,
                keylist: This.toRequestJSON(this.allKeylist)
            },
    function(data) {
        This.requestData();
        This.hourlyResponse = data;

        if (This.hourlyNewAddedKeys.length > 0) {
            for (var i = 0; i < This.hourlyNewAddedKeys.length; i++) {
                var key = This.hourlyNewAddedKeys[i];
                This.addNewHourlySerie(This.allKeylist[key].color, key);
            }
            This.hourlyNewAddedKeys = [];
        }
    }, function(data, textStatus) {
        console.error('A problem occured, instant hourly data is not retrived (' + textStatus + ')');
    }, 'json');


};

Instant.prototype.requestData = function() {
    var This = this;
    this.myGet('data_manager.php',
            {
                mod: 'instant',
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

Instant.prototype.requestTweetData = function() {
    if (this.processing) {
        console.warn('new request data is permitted while one is running');
        return;
    }

    this.stopTimer(TWEETS);
    this.processing = true;
    this.$('.' + this.tweetQueryData.direction + "_tweets").css('display', 'inline-block');
    if (!this.autoupdate)
        this.hideShowTweetsButton();

    var This = this;
    var jqXHR = this.myGet('data_manager.php',
            this.tweetQueryData,
            function(data) {
                console.info(data);
                This.tweetList = data;
                if (!This.autoupdate)
                    This.pushRecursively(true);

            },
            function(data) {
                console.error('A problem occured, tweet data is not retrived (' + data.statusText + ')');
                if (data.status != 0 && !This.autoupdate)
                    This.startTweetCount();
            },
            'json',
            function() {
                This.processing = false;
                This.xhrPool.removeElement(jqXHR);
                This.$('.' + This.tweetQueryData.direction + "_tweets").hide();
            });
    ;
    this.xhrPool.push(jqXHR);

};

Instant.prototype.requestTweetCount = function() {
    var This = this;
    var queryObj = {mod: 'count'};
    //var currTweetKey = this.$('.tweet_section select').val();
    var currTweetKey = this.$('.legend_main li.selected').attr('data-value');
    queryObj.keylist = JSON.stringify(this.allKeylist[currTweetKey].keylist);

    var liList = this.$('.general_tweet_container ul li');
    if (liList.length > 0) {
        queryObj.tweet_id = this.latestTweetId;

        var jqXHR = this.myGet('data_manager.php',
                queryObj,
                function(data) {
                    console.info('currentTweets: ' + data);
                    This.tweetCount = parseInt(data);
                    This.updateTweetCountButton();
                },
                function(data) {
                    console.error('A problem occured, tweet count is not retrived (' + data.statusText + ')');
                },
                'json',
                function() {
                    This.xhrPool.removeElement(jqXHR);
                });
        ;
        this.xhrPool.push(jqXHR);
    }
};


Instant.prototype.hideShowTweetsButton = function() {
    var container = this.$('div.new_tweets');
    container.transition({
        height: '0px',
        opacity: 0,
        duration: 300
    }, function() {
        this.hide();
    });
};

Instant.prototype.showShowTweetsButton = function(count, duration) {
    var container = this.$('div.new_tweets');
    container.css('display', 'inline-block').transition({
        height: '30px',
        opacity: 1,
        duration: 300
    });
    this.setTweetCount(this.tweetCount, 5000);

};

Instant.prototype.setTweetCount = function(count, duration) {
    var container = this.$('div.new_tweets');
    container.find('.new_tweet_no').html(count).css({color: SBTRED}).transition({color: '#666', duration: duration});
};


Instant.prototype.updateTweetCountButton = function() {
    if (this.tweetCount != 0) {
        this.showShowTweetsButton();
    }
};

Instant.prototype.countTweets = function() {
    this.requestTweetCount();
};

Instant.prototype.pushRecursively = function(isFirst) {
    var dir = this.tweetQueryData.direction;
    var keys = Object.keys(this.tweetList);

    if (keys.length == 0) {
        return;
    }

    var key = dir == 'up' ? keys.sort()[0] : keys.sort().last();
    var data = this.tweetList[key];
    data.tweetId = key;
    this.setLatestTweetId(data.tweetId);

    if (this.$('.general_tweet_container ul li').length >= 30)
        this.tweetQueryData.direction == 'up' ? this.popBack() : this.popFront();

    this.tweetQueryData.direction == 'up' ? this.pushFront(data) : this.pushBack(data);
    delete this.tweetList[key];
    var This = this;

    if (isFirst) {
        this.startTweetCount();
    }

    setTimeout(function() {
        This.pushRecursively();
    }, 50);
};

Instant.prototype.setLatestTweetId = function(idString) {
    if (idString > this.latestTweetId)
        this.latestTweetId = idString;
};




/*************************** STATIC FUNCTIONS **********************************/
Instant.prototype.toRequestJSON = function(obj) {
    var retObj = {};
    for (var key in obj) {
        if (obj[key].drawn)
            retObj[key] = obj[key]['keylist'];
    }
    return JSON.stringify(retObj);
};


Instant.prototype.getMinDatetime = function(data) {
    var keys = Object.keys(data);
    var currDate = keys[0];
    return currDate ? (currDate) : false;
};

Instant.prototype.findMinuteStart = function(data) {
    var counter = 0;
    for (var key in data) {
        if (this.isEqual(moment(key).toDate(), 0))
            return counter;
        counter++;
    }
    return -1;
};

Instant.prototype.isEqual = function(dateObj, num) {
    var seconds = dateObj.getSeconds();
    var minutes = dateObj.getMinutes();
    var current = num * this.multiplier;
    var remMinutes = minutes % this.multiplier;
    return ((remMinutes * 60 + seconds) == current);
};

Instant.prototype.isGreater = function(dateObj, num) {
    var seconds = dateObj.getSeconds();
    var minutes = dateObj.getMinutes();
    var current = num * this.multiplier;
    var remMinutes = minutes % this.multiplier;
    return ((remMinutes * this.multiplier * 60 + seconds) > current);
};

Instant.prototype.isLess = function(dateObj, num) {
    return dateObj.getSeconds() < num && dateObj.getMinutes() % this.multiplier == 0;
};
