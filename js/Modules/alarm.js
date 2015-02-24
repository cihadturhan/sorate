
delimeter = ",";

Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: highchartsLang[lang_array['lang']]
});

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
        // tickInterval: 5000,
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

Alarm = function(container) {
    this.response = {};
    this.container = container;
    this.timers = [];
    this.ready = false;
    this.xhrPool = [];
    this.chart = null;

    this.queryData = {
        keylist: [],
        isNew: [],
        interval: [],
        mobileNumbers: [],
        active: [],
        threshold: [],
        emails: [],
        triggerTimes: []

    };

    this.deleteData = {
        alarmname: ""
    };

    this.graphQueryData = {
        mod: 'detail',
        datatype: 'graph'
    };

    this.tweetQueryData = {
        mod: 'tweetinterval'
    };
    this.graphResponseData = {};

};

Alarm.prototype.$ = Common.prototype.$;
Alarm.prototype.animateContainers = Common.prototype.animateContainers;
Alarm.prototype.myGet = Common.prototype.myGet;
Alarm.prototype.pushFront = Common.prototype.pushFront;
Alarm.prototype.pushRecursively = Common.prototype.pushRecursively;

Alarm.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        This.prepareDOM();
        This.ready = true;
        This.getAlertList();

    });
};


Alarm.prototype.destroy = function() {
    this.alertData = null;
    this.clearHeatmap();
    if (this.chart)
        this.chart.destroy();
    this.stop();
    this.reset();
    this.container.html('');
};

Alarm.prototype.start = function() {

};

Alarm.prototype.stop = function(remove) {
    //this.stopTimer(SECONDS);
    this.abortRequests();
};

Alarm.prototype.reset = function(remove) {

};

Alarm.prototype.resume = function() {
    if (this.ready) {
        //this.updateGroupList();
    }
};

Alarm.prototype.abortRequests = function() {
    for (var i = 0; i < this.xhrPool.length; i++) {
        this.xhrPool[i].abort();
    }
    this.xhrPool.length = 0;
};


Alarm.prototype.prepareDOM = function() {
    var containers = ['.new_add_container', '.all_alerts_container', '.right_container'];
    this.animateContainers(containers);
    this.addCallbacks();
    //this.requestGraphData();
};

Alarm.prototype.addCallbacks = function() {
    var This = this;
    this.$('.cb_container input[type="checkbox"]').click(function() {

        This.$('.threshold_container .h4').removeClass('selected');
        if ($(this).prop('checked')) {
            This.$('.threshold_text').transition({x: '350px', opacity: 0, easing: 'easeOutExpo'}, 300);
            This.$('.threshold_select_container').transition({x: '0', opacity: 1, easing: 'easeOutExpo'}, 300);
            This.$('.threshold_container .h4[data-type=auto]').addClass('selected');
        }
        else
        {
            This.$('.threshold_text').transition({x: '0', opacity: 1, easing: 'easeOutExpo'}, 300, function() {
                $(this).focus();
            });
            This.$('.threshold_select_container').transition({x: '-350px', opacity: 0, easing: 'easeOutExpo'}, 300);
            This.$('.threshold_container .h4[data-type=man]').addClass('selected');
        }

    });

    this.$('.all_alerts_container').click(function() {
        This.$('.close_panel').click();
        This.$('.alert_list_popup').myHide('left');
        //This.$('.alert_list_popup').hide();
    });

    this.$('.interval_select_container button.interval_select').click(function() {

        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');

    });
    this.$('.threshold_select_container button.threshold_select').click(function() {

        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    });
    this.$('.alert_link').click(function() {
        This.openAddPanel();
        This.resetEdit();
        This.$('.button_size .icon-trash').css('display', 'none');
        This.$('.button_size .icon-edit').css('display', 'none');
        This.$('.button_size .icon-save').css('display', 'inline-block');
        This.$('input[name=alarmname]').removeAttr('disabled');

    });
    this.$('.close_panel').click(function() {
        This.closeAddPanel();
    });

    this.$('.button_size .icon-trash').click(function() {
        This.queryData.action = 'remove';
        This.prepareDeleteData();

        var r = confirm(lang_array['delete_alarm1'] + This.deleteData.alarmName + lang_array['delete_alarm2']);
        if (!r)
        {
            return;
        }

        This.deleteAlert();
    });

    this.$('.icon-save').click(function() {
        This.prepareQueryData();
        This.queryData.action = 'insert';
        This.uploadAlertData(function(data) {
            if (data) {
                var newAlert = {
                    alarmName: This.queryData.alarmName,
                    id: This.queryData.id,
                    userId: This.queryData.userId,
                    keylist: JSON.parse(This.queryData.keylist),
                    emails: JSON.parse(This.queryData.emails),
                    interval: This.queryData.interval,
                    mobileNumbers: JSON.parse(This.queryData.mobileNumbers),
                    threshold: This.queryData.threshold,
                    triggerTimes: []
                };
                This.alertData.push(newAlert);
                This.clearHeatmap();
                This.createHeatmap();
                This.closeAddPanel();
            } else {
                alert('error');
            }
        });
    });


    this.$('button[name=update_alert]').click(function() {
        This.prepareQueryData();
        var willReset = false;
        This.queryData.action = 'update';
        if (!arrays_equal(JSON.parse(This.queryData.keylist), This.currentAlert.keylist)) {
            var r = confirm(lang_array['change_in_words']);
            if (!r)
            {
                return;
            }
            willReset = true;
        } else if (This.queryData.threshold !== This.currentAlert.threshold) {
            var r = confirm(lang_array['change_in_treshold']);
            if (!r)
            {
                return;
            }
            willReset = true;
        }

        This.uploadAlertData(function(data) {
            if (data) {
                This.currentAlert.keylist = JSON.parse(This.queryData.keylist);
                This.currentAlert.emails = JSON.parse(This.queryData.emails);
                This.currentAlert.mobileNumbers = JSON.parse(This.queryData.mobileNumbers);
                This.currentAlert.threshold = This.queryData.threshold;
                This.currentAlert.interval = This.queryData.interval;
                if (willReset) {
                    This.currentAlert.triggerTimes = [];
                }
                This.closeAddPanel();
                This.clearHeatmap();
                This.createHeatmap();
            } else {
                alert('error');
            }
        });// dataları editlediğimiz fonksiyon
    });

    //This.$('.settings_threshold').css('display', 'none');

    This.$(".text_input").tagsInput({height: "auto",
        width: "auto",
        delimiter: ",",
        defaultText: lang_array['new_keyword'],
        'minChars': 3,
        'maxChars': 40//if not provided there is no limit,
    });
    This.$(".email_input").tagsInput({height: "auto",
        width: "auto",
        delimiter: delimeter,
        defaultText: lang_array['example_email'],
        'minChars': 3,
        'onAddTag': function(text) {
            This.checkEmail.call(This, text);
        },
        'maxChars': 40 //if not provided there is no limit,

    });
    This.$(".phone_input").tagsInput({height: "auto",
        width: "auto",
        delimiter: delimeter,
        defaultText: lang_array['example_mobile'],
        'minChars': 3,
        'maxChars': 40, //if not provided there is no limit,
        'onAddTag': function(text) {
            This.checkPhone.call(This, text);
        }
    });

    This.$('.header_settings').click(function() {
        if (This.$('.legend_container').css('display') === 'none')
            This.showLegend();
        else
            This.hideLegend();
    });

    This.$('.alerts').delegate("button[name=edit_alert]", "click", function() {
        var parent = $(this).closest('.alert');
        var index = parent.attr('data-index');
        This.setCurrentAlert(index);
        This.showCurrentAlert();
        This.$('.alert_list_popup').myHide('left');
        return false;
    });
};

Alarm.prototype.prepareQueryData = function() {
    var isAuto = this.$('.threshold_container input[type=checkbox]').prop('checked');
    var list = this.$('input[name= alerttext]').val().split(delimeter);
    var mail = this.$('input[name=emails]').val().split(delimeter);
    var mobil = this.$('input[name=mobilenumbers]').val().split(delimeter);
    var threshold = isAuto ? this.$('button.threshold_select.selected').attr('data-id') : this.$('.threshold_text').val();
    var interval = this.$('.interval_select_container button.selected').attr('data-id');

    this.queryData = {
        keylist: JSON.stringify(list),
        emails: JSON.stringify(mail),
        mobileNumbers: JSON.stringify(mobil),
        threshold: threshold,
        interval: interval,
        alarmName: this.$('input[name=alarmname]').val(),
        active: 1,
        id: this.$('input[name=alert_id]').val()
    };
};

Alarm.prototype.uploadAlertData = function(callback) {
    var This = this;
    this.myGet('data_manager.php',
            $.extend({
        mod: 'alert_list',
        userId: user_id
    }, this.queryData),
            callback,
            function(e, errorcode) {
                console.log('Get list not retrieved (' + errorcode + ')');
            }
    );
};




Alarm.prototype.prepareDeleteData = function() {
    this.deleteData = {
        mod: 'alert_list',
        action: 'delete',
        userId: user_id,
        alarmName: this.$('input[name=alarmname]').val()
    };
};


Alarm.prototype.deleteAlert = function() {
    var This = this;
    this.myGet('data_manager.php', this.deleteData,
            function(data) {
                if (data) {
                    This.alertData.removeElement(This.currentAlert);
                    This.closeAddPanel();
                    This.clearHeatmap();
                    This.createHeatmap();
                } else {
                    alert('not success..!');
                }
            },
            function(e, errorcode) {
                console.log('Get list not retrieved (' + errorcode + ')');
            }
    );
};

Alarm.prototype.openAddPanel = function() {
    //$('.left_container').css('position', 'relative').css('z-index', '2');
    this.$('.rght_container').transition({x: '400px', easing: 'easeOutExpo'}, 200, function() {
        $(this).css('z-index', 1);
        $('.left_container').css('z-index', 2);
    });
};

Alarm.prototype.closeAddPanel = function() {
    this.$('.left_container').css('position', 'absolute').css('z-index', '');
    this.$('.rght_container').transition({x: '0', easing: 'easeOutExpo'}, 200, function() {
        $(this).css('z-index', '');
        $('.left_container').css('z-index', '');
    });
};

Alarm.prototype.checkEmail = function(text) {
    var mail = new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}");
    if (mail.test(text)) {
        //todo
    } else {
        alert(lang_array['wrong_format']);
        this.$('.email_input').removeTag(text);
    }
};
Alarm.prototype.checkPhone = function(text) {
    var phone = new RegExp("^[059]{0,2}5[0-9]{9,10}$");

    if (phone.test(text)) {
        if (text.indexOf('90') === 0)
            return;
        this.$('.phone_input').removeTag(text);
        var beginning = new RegExp('[9]{0,1}[0]{0,1}[5]{0,1}');
        var text = '905' + text.replace(beginning, '');
        this.$('.phone_input').addTag(text);
    } else
    {
        window.alert(lang_array['wrong_format']);
        this.$('.phone_input').removeTag(text);
    }
};


Alarm.prototype.resetEdit = function() {
    this.$('input[name=alarmname]').val('').attr('disabled', 'disabled');
    this.$('input[name=alert_id]').val('0');
    this.$('input[name=emails]').importTags('');
    this.$('input[name=alerttext]').importTags('');
    this.$('input[name=mobilenumbers]').importTags('');
    this.$('.threshold_select, .interval_select').removeClass('selected');
    this.$('.threshold_select:eq(1), .interval_select:eq(1)').addClass('selected');
};

Alarm.prototype.createChart = function() {
    var This = this;
    var data = [];
    for (var key in this.graphResponseData) {
        data.push([
            moment(key).valueOf(),
            this.graphResponseData[key]['list']
        ]);
    }

    var bandColor = 'hsla(0, 80%, 60%, 0.3)';
    var band = {
        from: moment(This.currentTime).subtract('minutes', 1).startOf('minute').valueOf(),
        to: moment(This.currentTime).add('minutes', 1).startOf('minute').valueOf(),
        color: bandColor
    };

    this.chart = new Highcharts.Chart(
            $.extend(true,
            {},
            chartOptions,
            {
                chart: {renderTo: this.$(".graph")[0]},
                series: [{
                        color: '#333',
                        name: ' ',
                        data: data
                    }],
                xAxis: {
                    plotBands: [band]
                }
            }
    ));

    var fullWidth = this.chart.series[0].points.last().plotX - this.chart.series[0].points[0].plotX;
    var gridWidth = fullWidth / (data.length - 1);

    var offset = $(This.chart.container).position().left + This.chart.plotLeft;
    var sliderLine = $('<div>').addClass('graph_line').draggable(
            {
                grid: [gridWidth, gridWidth],
                axis: "x",
                containment: this.$('.graph')[0],
                stop: function(event, ui) {
                    var tolerance = 5;// (px)
                    var sliderpos = parseInt($(this).css('left').replace('px', ''));
                    var points = This.chart.series[0].points;
                    for (var i = 0; i < points.length; i++) {
                        if (Math.abs(points[i].plotX + offset - sliderpos) < tolerance) {
                            points[i].select();
                            This.requestTweets(points[i].x, points[i].y);
                            break;
                        }
                    }
                }
            }).css({
        left: offset + parseInt(data.length / 2) * gridWidth,
        position: ''
    });
    this.$(".graph").prepend(sliderLine);
    //After all set emulate drag event
    sliderLine.draggable('option', 'stop').apply(sliderLine);
};

Alarm.prototype.requestTweets = function(timestamp, value) {
    var This = this;
    if (value === 0) {
        this.$('.general_tweet_container ul').html(lang_array['no_tweet']);
        return;
    }

    var momentObj = moment(timestamp);
    this.tweetQueryData.starttime = momentObj.format('YYYY-MM-DD HH:mm:ss');
    this.tweetQueryData.endtime = momentObj.add('minutes', 1).format('YYYY-MM-DD HH:mm:ss');
    this.tweetQueryData.keylist = JSON.stringify(this.keylist);
    this.$('.general_tweet_container .buttons .icon-spinner').show();
    this.$('.general_tweet_container ul').html('');

    this.myGet('data_manager', this.tweetQueryData, function(data) {
        console.info(data);
        This.tweetList = data;
        This.$('.general_tweet_container .buttons .icon-spinner').hide();
        This.pushRecursively(0);
    }, function(data, textStatus) {
        console.warn('Tweet data not recieved (' + textStatus + ')');
    });
};

Alarm.prototype.getAlertList = function() {
    var This = this;

    this.myGet('data_manager.php',
            {
                mod: 'alert_list',
                action: 'getList',
                userId: user_id
            }, function(data) {
        This.alertData = data;
        This.createHeatmap();
    }, function(e, errorcode) {
        console.log('Get list not retrieved (' + errorcode + ')');
    }
    );

};

Alarm.prototype.requestGraphData = function(data) {
    var This = this;
    this.myGet('data_manager.php', this.graphQueryData, function(data) {

        console.log(data);
        This.graphResponseData = data;
        This.createChart();


    }, function(data, textStatus) {

        console.warn('Graph data not recieved (' + textStatus + ')');
    }, 'json', function() {
        //This.$('button[name=add_current]').removeAttr('disabled');
    });

};



Alarm.prototype.createInterval = function(timeStr) {
    this.graphQueryData.starttime = moment(timeStr).subtract('minute', 15).format('YYYY-MM-DD HH:mm:ss');
    this.graphQueryData.endtime = moment(timeStr).add('minute', 15).format('YYYY-MM-DD HH:mm:ss');
};

Alarm.prototype.createHeatmap = function() {
    var This = this;
    var margin = {top: 20, right: 0, bottom: 0, left: 20},
    fillTable = function(data) {
        var tbody = This.$('.alert_list_popup table tbody').css('cursor', 'pointer');
        tbody.html('');

        var tempTr, tempTd1, tempTd2, link;

        for (var i = 0; i < data.popup.length; i++) {
            tempTr = $('<tr>').attr('data-time', data.popup[i].date);

            tempTd1 = $('<td>').html((moment(data.popup[i].date).format(' HH:mm'))).addClass('chartValue');
            tempTd2 = $('<td>').html(data.popup[i].count).addClass('chartValue');

            tempTr.append(tempTd1, tempTd2);

            tbody.append(tempTr);
            $('.alert_list_popup .header').html((moment(data.popup[i].date).format('DD.MM.YYYY')));
        }

        This.$('.alert_list_popup tr').click(function() {
            var timeStr = $(this).attr('data-time');
            This.currentTime = timeStr;
            This.createInterval(timeStr);
            This.graphQueryData.keylist = JSON.stringify({'list': data.keylist});
            This.keylist = data.keylist;
            This.requestGraphData(data);
            This.$('.alert_list_popup').myHide('left');
        });
    };

    createAlarm = function(alarmname, k) {
        var wrapper = $('<div>').addClass('alert').attr('data-name', alarmname).attr('data-index', k);

        var title_bar = $("<div>").addClass('title_bar');
        var all_alerts_pop = $('<div>').addClass('all_alerts_pop_container');

        var title_text = $('<span>').addClass('header title_text').html(alarmname);
        var edit_button = $('<button>').addClass('icon-edit right_edit_button').attr({name: 'edit_alert', title: lang_array['edit_text'] + alarmname}).attr('data-index', k).css('color', '#28AAE2');

        title_bar.append(title_text).append(edit_button);
        wrapper.append(title_bar).append(all_alerts_pop);
        This.$('.alerts').append(wrapper);

        return all_alerts_pop;
    };

    heatmap = function(data, container) {

        var svg = d3.select(container[0]).append("svg")
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
            var svg = $(this);
            var popup = This.$('.alert_list_popup');
            if (d.value === 0) {
                popup.myHide('left');
                return false;
            }
            //console.log(d);

            var tiklanan = $(this).position();
            var y = tiklanan.top + 30;
            var x = tiklanan.left + 10;
            popup.css({left: x, top: y}, 100);

            var parent = $(this).closest('.alert');
            var titlename = parent.attr('data-name');
            var index = parent.attr('data-index');
            This.$('.alert_list_popup .container_header').html(titlename);
            var containerWidth = 374;
            var w = popup.outerWidth(), h = popup.outerHeight();

            if (popup.css('display') === 'none') {
                popup.css({
                    opacity: 0.3,
                    display: 'block'
                });
                setTimeout(function() {

                    popup.css({
                        scale: [gridSize / w, gridSize / (2 * h)],
                        x: 0,
                        y: 0,
                        'transform-origin': '0 0%'
                    });
                    popup.transition({y: 0, x: containerWidth - x, scale: 1, opacity: 1, duration: 300}, 'easeOutExpo');//myShow('left');
                    popup.find('.blackout')
                            .css({'background-color': svg.css('fill'), display: 'block', opacity: 1})
                            .transition({opacity: 0, duration: 300}, 'easeOutExpo', function() {
                        $(this).hide();
                    });
                }, 1);

                //popup.transition({opacity: 1});//myShow('left');
            } else {
                popup.transition({y: 0 + 'px', x: containerWidth - x, duration: 0});
            }

            //var data = moment(d.index[0].date, "DD.MM.YYYY");
            var data = {
                popup: [],
                graph: {}
            };


            var curr_alert = This.alertData[index];
            for (var i = 0; i < d.index.length; i++)
            {
                var pos = d.index[i];
                var trigger = curr_alert.triggerTimes[pos];
                data.popup.push(trigger);
            }
            data.keylist = curr_alert.keylist;
            fillTable(data);
            d3.event.stopPropagation();
        });

        heatMap.append("title").text(function(d) {
            if (d.value !== 0)
                return current().subtract(29 - (d.day - 1) * 7 - d.hour, 'days').format('D MMMM') + ' \n' + d.value + lang_array['alerts'];
            else
                return current().subtract(29 - (d.day - 1) * 7 - d.hour, 'days').format('D MMMM') + ' \n' + lang_array['no_alert'];
        });
    };

    var createLegend = function(container) {
        var height = 50;

        var legend = d3.select(container[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", gridSize + margin.top + margin.bottom)
                .selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) {
            return d;
        });


        legend = legend.enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + 40 + "," + 0 + ")");

        legend.append("rect")
                .attr("x", function(d, i) {
            return gridSize * i;
        })
                .attr("y", 10)// renk scalasını y eksenine göre konumu
                .attr("width", gridSize)
                .attr("height", gridSize / 2)
                .style('stroke', 'hsl(0,0%,80%)')
                .style('stroke-width', 2)
                .style("fill", function(d, i) {
            return colors[i];
        });

        legend.append("text")
                .attr("class", "legend-mono")
                .text(function(d) {
            return Math.round(d);
        })
                .attr("x", function(d, i) {
            return gridSize * i + gridSize / 2;
        })
                .attr("y", gridSize);// renk scalasının yazılarının konumu
    };




    var width = 320 - margin.left - margin.right,
            height = 120 - margin.top - margin.bottom,
            gridSize = Math.floor(width / 7),
            colors = ["#ffffff", "#FFFFB2", "#FECC5C", "#FD8D3C", "#F03B20", "#BD0026"], // alternatively colorbrewer.YlGnBu[9]
            days = ["1", "2", "3", "4"],
            times = ["1", "2", "3", "4", "5", "6", "7"],
            colorScale = d3.scale.quantile().domain([0, 3, 6]).range(colors);

    var legend = This.$('.legend_container');
    createLegend(legend);

    if (this.alertData.length == 0) {
        var info = $('<div>').addClass('info').html(lang_array['no_alerts']);
        this.$('.alerts').html(info);
    }

    for (var k = 0; k < this.alertData.length; k++) {

        var template = [];
        for (var i = 0; i < 28; i++) {
            template[i] = {
                day: Math.floor(i / 7) + 1,
                hour: 1 + i % 7,
                value: 0,
                index: []
            };

        }

        var ttimes = this.alertData[k].triggerTimes;
        var alarmName = this.alertData[k].alarmName;

        for (var i = 0; i < ttimes.length; i++) {

            var diff = current().startOf('day').diff(moment(ttimes[i].date), 'days');
            if (diff < 28)
            {
                template[template.length - 1 - diff].value++;
                template[template.length - 1 - diff].index.push(i);
            }
        }

        var heatmap_container = createAlarm(alarmName, k);
        heatmap(template, heatmap_container);
    }
};

Alarm.prototype.clearHeatmap = function() {
    this.$('.alerts').html('');
    this.$('.legend_container').html('');
};


Alarm.prototype.setCurrentTrigger = function(index) {

};

Alarm.prototype.setCurrentAlert = function(index) {
    this.currentAlert = this.alertData[index];
    this.tempAlert = $.extend({}, this.alertData[index]);
};

Alarm.prototype.showCurrentAlert = function() {
    var This = this;
    var d = this.currentAlert;

    this.resetEdit();
    this.$('button[name=update_alert], button[name=delete_alert]').css('display', 'inline-block');
    this.$('button[name=save_alert]').css('display', 'none');


    this.$('input[name=alert_id]').val(d.id);
    this.$('input[name=alarmname]').val(d.alarmName);
    this.$('input[name= alerttext]').importTags(d.keylist.join(delimeter));
    this.$('input[name= emails]').importTags(d.emails.join(delimeter));
    this.$('input[name = mobilenumbers]').importTags(d.mobileNumbers.join(delimeter));

    var interval = d.interval;
    var threshold = d.threshold;
    var active = d.active;
    //console.log(active);

    var autoChecked = this.$('.cb_container input[type="checkbox"]').prop('checked');
    switch (threshold) {
        case 'low':
        case 'medium':
        case 'high':
            this.$('button[data-id=' + threshold + ']').click();
            if (!autoChecked)
                This.$('.cb_container input[type="checkbox"]').click();
            break;
        default:
            This.$('.threshold_text').val(threshold);
            if (autoChecked)
                This.$('.cb_container input[type="checkbox"]').click();
    }

    switch (interval) {
        case '00-08':
        case '08-24':
        case '00-24':
            $('button[data-id=' + interval + ']').click();
            break;
        default:
            console.log('wrong interval!');
    }
    This.openAddPanel();
};

Alarm.prototype.showLegend = function() {
    var This = this;
    this.$('.all_alerts_container').css({'padding-top': '105px'});
    this.$('.legend_container').myShow();
};

Alarm.prototype.hideLegend = function() {
    this.$('.legend_container').myHide();
    this.$('.all_alerts_container').css({'padding-top': ''});
};