//TVtags modulunun sahte ismi

Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: highchartsLang[lang_array['lang']]
});


Detail = function(container) {
    this.reports = [];
    this.container = container;
    this.timers = [];
    this.processing = false;
    this.unloadedKeyGroup = {};
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
    this.channels = allChannels;
    this.tweetList = {};
    this.program = {};
    this.bandsShown = true;
    this.linesShown = true;

    this.filetype = 'xlsx';
    this.xlsData = [];
};


Detail.prototype.initialize = function(container) {
    var This = this;
    $().ready(function() {
        This.prepareDOM();
        This.getChannels();
        This.ready = true;
    });
};
Detail.prototype.destroy = function() {
    for (var i = 0; i < this.reports.length; i++) {
        if (this.reports[i].chart) {
            this.removeChart(i);
        }
    }
    this.container.html('');
};

Detail.prototype.stop = function() {

};

Detail.prototype.start = function() {

};

Detail.prototype.reset = function() {

};

Detail.prototype.resume = function() {

};

Detail.prototype.$ = Common.prototype.$;
Detail.prototype.animateContainers = Common.prototype.animateContainers;
Detail.prototype.createSummary = Common.prototype.createSummary;
Detail.prototype.createDropDown = Common.prototype.createDropDown;
Detail.prototype.excelExport = Common.prototype.excelExport;
Detail.prototype.addExportButton = Common.prototype.addExportButton;
Detail.prototype.createPartStr = Common.prototype.createPartStr;
Detail.prototype.requestRatingData = Common.prototype.requestRatingData;
Detail.prototype.abortRequests = Common.prototype.abortRequests;


Detail.prototype.prepareDOM = function() {

    var containers = ['.header'];
    this.animateContainers(containers);
    this.addCallbacks();

};

Detail.prototype.addCallbacks = function() {
    var This = this;
    var myPicker = new jscolor.color(this.$('input.color')[0]);
    myPicker.fromString(get_random_color());

    this.$(".detail_container").click(function() {
        This.$(".program_list, .tweet_container").myHide();
    });

    this.$('input[name=daypicker]').datepicker($.extend({
        minDate: new Date(2013, 5 - 1 /* january  =  0*/, 1),
        maxDate: "-1D",
        dateFormat: 'dd MM yy, DD',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    }, dateLang[lang_array['lang']]));

    this.$('input[name=daypicker], .new_report').click(function() {
        This.$('.channel_list, .program_list').myHide();
        stopTransition(This.$(".channel_list li"), 0);
        stopTransition(This.$(".program_list li").children(), 0);
        //setTransition(This.$(".channel_list li"), 0, {opacity: 0}, 100, 1);
        //setTransition(This.$(".program_list li").children(), 0, {opacity: 0}, 100, 1);
        return false;
    });
    this.$('input[name=daypicker]').change(function() {
        This.selectData.date = moment($(this).datepicker("getDate")).format('DD.MM.YYYY');
        This.getPrograms();
    });
    this.$('input[name=channel_input]').change(function() {
        This.selectData.channel = $(this).attr('data-value');
        This.getPrograms();
    });
    this.$('input[name=program_input]').change(function() {
        myPicker.fromString(get_random_color());
        var programId = $(this).attr('data-value');
        var program = This.programData[programId];
        This.program = program;
        var tempStartDate = moment(This.selectData.date, "DD.MM.YYYY");
        var tempEndDate = moment(This.selectData.date, "DD.MM.YYYY");

        This.graphQueryData.starttime = tempStartDate
                .add('seconds', parseInt(program['STARTSECOND']))
                .add('hours', 2)
                .format('YYYY-MM-DD HH:mm:ss');
        This.graphQueryData.endtime = tempEndDate
                .add('seconds', parseInt(program['ENDSECOND']))
                .add('hours', 2)
                .format('YYYY-MM-DD HH:mm:ss');
        var hashtag = program['hashtags'][0]['HASHTAG'].replace('@', '');
        This.graphQueryData.keylist = JSON.stringify({'list': [hashtag]}); // TODO ASSING MOST FREQUENT KEYWORD
        This.selectData.hashtag = hashtag;

    });

    this.$('button[name=add_current]').click(function() {
        $(this).attr('disabled', 'disabled');
        This.requestGraphData();
    });

    this.$('input[name=ads]').click(function() {
        This.bandsShown = $(this).prop('checked');
        This.updateBands();
    });

    this.$('input[name=tweet_launch]').click(function() {
        This.linesShown = $(this).prop('checked');
        This.updateLines();
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
        $(this).stop().scrollTo({
            top: (delta > 0 ? '-=' : '+=') + Math.abs(delta) * 420,
            left: 0,
            easing: 'easeOut'
        }, 200);
        return false;
    });
};

Detail.prototype.stopTimer = Common.prototype.stopTimer;

Detail.prototype.updateBands = function() {
    if (!this.bandsShown) {
        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].bands) {
                for (var j = 0; j < this.reports[i].bands.length; j++) {
                    this.reports[i].chart.xAxis[0].removePlotBand(this.reports[i].bands[j].id);
                }
            }
        }
    } else {
        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].bands) {
                for (var j = 0; j < this.reports[i].bands.length; j++) {
                    var currband = this.reports[i].bands[j];
                    var band = {
                        from: currband.from,
                        to: currband.to,
                        id: currband.id,
                        color: currband.color
                    };
                    this.reports[i].chart.xAxis[0].addPlotBand(band);
                }
            }
        }
    }
};

Detail.prototype.updateLines = function() {
    if (!this.linesShown) {
        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].lines) {
                for (var j = 0; j < this.reports[i].lines.length; j++) {
                    this.reports[i].chart.xAxis[0].removePlotLine(this.reports[i].lines[j].id);
                }
            }
        }
    } else {
        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].lines) {
                for (var j = 0; j < this.reports[i].lines.length; j++) {
                    this.reports[i].chart.xAxis[0].addPlotLine(this.reports[i].lines[j]);
                }
            }
        }
    }
};

Detail.prototype.getChannels = function() {
    var channel_select = this.$('.channel_list ul');
    for (var key in this.channels) {
        if (key === '24')
            continue;
        var img = $('<img>').attr('src', 'img/new_channels/' + key + '.png');
        var span = $('<span>').html(this.channels[key][1]);
        $('<li>').append(img).append(span).attr('data-value', key).appendTo(channel_select);
    }

    var container = this.$('.channel_select');
    if (container.css('display') === 'none') {
        container.css({display: 'inline-block', 'opacity': 1});
        this.createDropDown(container);
    }
};

//Program listelerini getirmek icin cagrilir
Detail.prototype.getPrograms = function() {
    this.$('button[name=add_current]').attr('disabled', 'disabled');
    this.$('input[name=program_input]').val('');

    if (this.selectData.date && this.selectData.channel) {

        var This = this;
        var jqXHR = $.get('program_manager.php', this.selectData, function(data) {
            console.log(data);
            This.programData = data;
            This.updatePrograms();
        }, 'json').always(function() {
            This.xhrPool.removeElement(jqXHR);
        });
        this.xhrPool.push(jqXHR);
    }
};


Detail.prototype.myGet = Common.prototype.myGet;


//Grafik datasini talep etmek icin kullanilir.
//Grafik datasinin cevabi geldikten sonra sirayla programin reyting datasi ve twitter datalari talep edilir
Detail.prototype.requestGraphData = function() {
    var This = this;
    this.graphQueryData.datatype = 'graph';
    this.myGet('data_manager', this.graphQueryData, function(data) {
        console.log(data);
        This.graphResponseData = data;
        var args = This.createGraph();
        This.requestSummaryData(args);
        This.$('.new_detail_popup').myHide();
    }, function(data, textStatus) {
        console.warn('Graph data not recieved (' + textStatus + ')');
    }, 'json', function() {
        This.$('button[name=add_current]').removeAttr('disabled');
    });
};

//Grafigin sag tarafindaki gelen ozet bilgiler icin kullanilir
//Data geldikten sonra excel datasi da uretilir
Detail.prototype.requestSummaryData = function(args) {
    this.graphQueryData.datatype = 'summary';
    this.summaryResponseData = {};
    var This = this;

    //rating datasi
    this.requestRatingData(function(data) {
        This.summaryResponseData['1'] = data;
        checkBothRetrieved();
    });

    this.myGet('data_manager', this.graphQueryData, function(data) {
        console.log(data);
        $.extend(This.summaryResponseData, data);
        checkBothRetrieved();
    }, function(data, textStatus) {
        console.warn('Graph data not recieved (' + textStatus + ')');
    }, 'json', function() {
        This.$('button[name=add_current]').removeAttr('disabled');
    });

    function checkBothRetrieved() {
        if (typeof This.summaryResponseData['0'] !== 'undefined' &&
                typeof This.summaryResponseData['1'] !== 'undefined') {
            This.createSummary(args);
            This.createXLSData(This.graphQueryData);
            if (This.$('button.export').length === 0)
                This.addExportButton(This.$('.export_container'));
        }
    }
};


Detail.prototype.createXLSData = function(queryData) {
    var obj = {
        queryDate: [queryData.starttime, queryData.endtime],
        channelName: this.channels[this.selectData.channel][1],
        programName: this.program['PNAME'],
        keywords: [this.selectData.hashtag],
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

Detail.prototype.updatePrograms = function() {
    var progListUl = this.$('.program_list ul');
    progListUl.html('');
    var count = 0;

    for (var key in this.programData) {
        var curr = this.programData[key];
        if (curr.hashtags) {
            var li = $('<li>').append($('<h1>').html(curr['PNAME']));
            var hashtag = findGetFreuqentHashTag(curr);
            li.append($('<h2>').html(hashtag));
            li.attr('data-value', key);
            li.appendTo(progListUl);
            count++;
        }
    }

    if (count == 0) {
        this.$('input[name=program_input]').val(lang_array['no_program']);
        this.$('button[name=add_current]').attr('disabled', 'disabled');
    }

    var container = this.$('.group_select');
    if (container.css('display') === 'none') {
        container.css({display: 'inline-block'}).css('opacity', 1);
        this.createDropDown(container, 'h1');
    }
};

Detail.prototype.removeChart = function(index) {
    var report = this.reports[index];
    var cont = $(report.chart.container).closest('.report');
    cont.children('.maniplation, .close').unbind();
    if (!report.chart)
        console.error('no report found');

    report.chart.destroy();
    delete report.chart;
    delete report.lines;
    delete report.bands;
    delete report;
    report = null;
    this.removeXLSData(index);
    cont.transition({height: 0, duration: 300}, function() {
        $(this).remove();
    });
};

Detail.prototype.removeXLSData = function(index) {
    this.xlsData[index] = null;
};

Detail.prototype.createGraph = function() {
    var This = this;
    var container = $('<li>').addClass('report container').appendTo(this.$('.detail_wrapper'));
    this.currentContainer = container;

    var header = $('<div>').addClass('container_header').appendTo(container);

    $('<span>').html(this.program.PNAME).appendTo(header);
    $('<span>').html(this.selectData.hashtag).css({color: SBTLBLUE, marginLeft: '15px'}).appendTo(header);

    var reportIndex = this.reports.length;


    var graphContainer = $('<div>').addClass('graph-container').appendTo(container);
    this.summaryContainer = $('<div>').addClass('info-container').appendTo(container);

    var data = [],
            bands = [],
            lines = [];

    var programStart = moment(this.graphQueryData.starttime).format('LLL');
    var programEnd = moment(this.graphQueryData.endtime).format('HH:mm');

    for (var key in this.graphResponseData) {
        data.push([
            moment(key).valueOf(),
            this.graphResponseData[key]['list']
        ]);
    }

    var hashtags = JSON.parse(this.graphQueryData.keylist).list;

    bands = this.calculateAds();
    lines = this.calculateHashtags();

    var color = this.$('input.color').css('background-color');

    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: graphContainer[0],
            type: 'spline',
            backgroundColor: 'hsla(0,0%,100%, 0.5)',
            margin: 30,
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
            plotLines: This.linesShown ? lines : [],
            plotBands: This.bandsShown ? bands : []
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
            maskFill: 'hsla(0, 0%, 100%, 0.75)',
            series: {
                lineColor: color,
                type: 'spline',
                lineWidth: 3

            }
        },
        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function(event) {
                            This.requestTweets(this.x, this.y, this.series.options.hashtags, this, this.series.chart);
                            event.preventDefault();
                            return false;
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
                name: This.program['PNAME'],
                data: data,
                color: color,
                hashtags: hashtags
            }],
        credits: {
            enabled: false
        }, exporting: {
            enabled: false
        }
    });

    var report = {
        chart: chart,
        lines: lines.clone(),
        bands: bands.clone()
    };
    this.reports.push(report);

    return {index: reportIndex, container: container};
};


//TO-DO
findGetFreuqentHashTag = function(data) {
    if (data.hashtags) {
        return '#' + data.hashtags[0]["HASHTAG"].replace('@', '').replace('#', '');
    }
    return 'UNDEFINED';
};

Detail.prototype.requestTweets = function(timestamp, value, hashtags, point, chart) {

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
    this.$('.general_tweet_container ul').html('');
    this.adjustPopupPosition(point, chart);

    var This = this;

    this.myGet('data_manager', this.tweetQueryData, function(data) {
        console.info(data);
        This.tweetList = data;
        This.$('.general_tweet_container .buttons .icon-spinner').hide();
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

Detail.prototype.adjustPopupPosition = function(selectedPoint, chart) {
    var This = this;
    var detail_wrppr = this.$('.detail_wrapper');
    var tweet_cont = this.$('.tweet_container');
    var detail_cont = this.$('.detail_container');


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

    if (totalx > detail_wrppr.innerWidth() / 2) {
        totalx -= tweet_cont.outerWidth() + 10;
        horizontal_prop = 'right';
    } else {
        totalx += 10;
    }

    if (relTop > detail_wrppr.height() / 2) {
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


Detail.prototype.pushRecursively = function(time) {
    var keys = Object.keys(this.tweetList);

    if (keys.length == 0) {
        return;
    }

    var key = keys.sort()[0];
    var data = this.tweetList[key];
    data.tweetId = key;

    this.pushFront(data, time);
    delete this.tweetList[key];
    var This = this;

    if (time < 10) {
        This.pushRecursively(time);
        return;
    }

    setTimeout(function() {
        This.pushRecursively(time);
    }, time);
};


Detail.prototype.pushFront = Common.prototype.pushFront;


Detail.prototype.calculateAds = function() {
    var data = [];
    var parts = this.program.parts;
    var partkeys = Object.keys(parts);
    var color = 'hsla(127, 63%, 47%, 0.3)';

    for (var i = 0; i < partkeys.length; i++) {
        var key = partkeys[i];

        var startDate = moment(parts[key]['PROGRAMDATE'], "DD/MM/YYYY")
                .add('seconds', parseInt(parts[key]['STARTSECOND']))
                .add('hours', 2);

        if (parts[key]['PARTORDER'] === '-1') {
            if (typeof data.last() === 'undefined' || (typeof data.last() !== 'undefined' && data.last().to)) {
                var band = {
                    from: startDate.valueOf(),
                    color: color,
                    id: 'band' + i
                };
                data.push(band);
            }
        } else {
            if (typeof data.last() !== 'undefined' && typeof data.last().to === 'undefined') {
                data.last().to = startDate.valueOf();
            }
        }
    }

    if (typeof data.last() !== 'undefined' && typeof data.last().to === 'undefined') {
        data.last().to = startDate.valueOf();
    }
    console.log(data);
    return data;
};

Detail.prototype.calculateHashtags = function() {
    var data = [];
    var hashtags = this.program.hashtags;
    var def = {
        width: 1,
        color: 'red',
        label: {
            enabled: false,
            text: '',
            align: 'right'
        }};

    for (var i = 0; i < hashtags.length; i++) {
        var programDate = moment(this.$('input[name=daypicker]').datepicker("getDate"));

        var startDate = programDate
                .add('seconds', parseInt(hashtags[i]['STARTSECOND']))
                .add('hours', 2);

        // TODO - Write an if statemement which checks each hashtag word
        var line = $.extend(true, {}, {
            value: startDate.valueOf(),
            id: 'line' + i
        }, def);
        data.push(line);
    }
    return data;
};