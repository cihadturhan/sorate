
subModule.namelist = [{chart: ['area', 'bar', 'column', 'line', 'spline', 'pie']}, 'tweetTable', 'dataTable', 'wordCloud', 'imgSlider', 'videoPlayer'];
subModule.template = '<div class="item {cw} {ch}"> <div class="container"> <div class="container_header"> {title} </div> <div class="container_info"> <div class="middle">{info}</div> </div> <div class="container_overlay"><div class="loading icon-spinner"> </div> </div> <div class="graph"> </div> </div> {resize} </div>';
subModule.chartTemplate = {
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        title: {
            text: ''
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        startOnTick: false,
        min: -0.5,
        gridLineWidth: 1,
        gridLineColor: '#eee',
        minTickInterval: 5,
        minorTickInterval: 'auto',
        minorGridLineColor: '#FBFBFB'
    },
    tooltip: {
        borderWidth: 0,
        borderRadius: 0,
        shadow: false,
        useHTML: true,
        backgroundColor: "rgba(255,255,255,0)",
        formatter: function() {
            var borderColor = this.series.color;
            if (this.series.options.borderColor && this.series.options.borderColor !== '#FFFFFF') {
                borderColor = this.series.options.borderColor;
            }
            return ("<div class='tooltip' style='border-color:" + borderColor + "'>" + this.y + ' ' + lang_array['tweets'] + "</div>");
        }
    },
    credits: {enabled: false},
    legend: {enabled: false},
    plotOptions: {
        areaspline: {
            fillOpacity: 0.1
        },
        series: {
            marker: {
                enabled: true,
                radius: 2
            }
        },
        line: {
        },
        bar: {
            dataLabels: {
                enabled: true,
                useHTML: true,
                style: {
                    fontWeight: 'bold',
                    color: '#333'
                }
            }
        },
        pie: {
            dataLabels: {
                enabled: true,
                color: '#333',
                connectorColor: '#333'
            }
        }

    },
    exporting: {
        enabled: false
    }
};

function subModule(input) {
    $.extend(this, {
        default: '42',
        title: 'Default Heading',
        resize: 'e es s',
        initiated: false,
        worker: function() {
        }
    }, input);
    return this;
}
;



subModule.prototype.init = function() {
    this.container = this.createContainer();
    this.container.draggable({handle: '.container_header'});
    this.createSubView();
    this.initiated = true;
    return this;
};

subModule.prototype.request = function(callback, parentCallback) {
    var This = this;

    if (this.options && typeof this.options.update === 'boolean' && this.options.update === false) {
        if (parentCallback)
            parentCallback();
        callback.apply(This);
        return;
    }

    if (This.container) {
        This.container.find('.container_overlay').show();
        This.container.find('.container_info').hide();
    }

    subModule.parentModule.myGet('data_manager', $.extend({}, {
        mode: this.options.mode,
        size: this.options.size
    }, subModule.parentModule.dataQuery),
            function(data) {
                if (typeof data !== 'undefined' && data !== null && Object.keys(data).length !== 0) {
                    This.data = data;
                } else {
                    if (This.container)
                        This.container.find('.container_info').css({display: 'table'});
                    This.data = [];
                }
                if (parentCallback)
                    parentCallback();
                callback.apply(This);
                if (This.container)
                    This.container.find('.container_overlay').hide();
            }, function(a, b) {
        console.error('No data retrieved occured for ' + This.title + ' (' + b + ')');
    });
};

subModule.prototype.createContainer = function() {
    list = {
        e: '<div class="ew-resize"></div>',
        s: '<div class="ns-resize"></div>',
        es: '<div class="news-resize icon-pigpenj"></div>',
        '': ''
    };

    var resize = '', sizes = this.resize.split(' ');
    for (var i = 0; i < sizes.length; i++) {
        resize += list[sizes[i]];
    }

    var container = $(subModule.template
            .replace('{cw}', 'w' + this.default[0])
            .replace('{ch}', 'h' + this.default[1])
            .replace('{title}', this.title)
            .replace('{info}', lang_array['no_results'])
            .replace('{resize}', resize)
            ).appendTo(subModule.parent);
    subModule.parent.packery('appended', container[0]);
    subModule.parent.packery('bindUIDraggableEvents', container);
    return container;
};


subModule.prototype.createSubView = function() {
    var contentWrapper = this.container.find('.graph');
    this.obj = this[this.type](contentWrapper);
    this.addResizeListeners();
    this.generateXLSData();
};

//TO-DO
subModule.prototype.addResizeListeners = function() {
    var This = this;
    this.container.find('.ns-resize').bind('mousedown', function() {
        This.container.toggleClass('h2').toggleClass('h4');
        This.applyResize();
    });

    this.container.find('.ew-resize').bind('mousedown', function() {
        This.container.toggleClass('w2').toggleClass('w4');
        This.applyResize();
    });

    this.container.find('.news-resize').bind('mousedown', function() {
        This.container.toggleClass('w2').toggleClass('w4').toggleClass('h2').toggleClass('h4');
        This.applyResize();
    });
};


subModule.prototype.update = function() {
    var This = this;
    //container üretilmediyse bu henüz üretilmemiş demektir.
    // bu durumda init fonksiyonunu cagirmamiz gerekli
    if (!This.container) {
        this.init();
        return;
    }

    var wrapper = This.container.find('.graph');
    switch (this.type) {
        case 'chart':
            This.obj.destroy();
            This.obj = this.chart(wrapper);
            break;
        case 'tweetTable':
            this.obj.createTweetTable();
            break;
        case 'dataTable':
            this.obj.createTable();
            break;
        case 'wordCloud':
            This.obj.generate();
            break;
        case 'imgSlider':
            this.obj = this.createSwiper();
            break;
        case 'videoPlayer':
            var thumbnail = This.container.find('.swiper-active-switch');
            This.obj.embedVideo(thumbnail, false);
            This.obj.clearLinks();
            This.obj.generatePlayer();
            break;
        case 'spamTable':
            This.obj.createTable();
            break;
    }

    this.generateXLSData();
};


subModule.prototype.generateXLSData = function() {
    var This = this;
    if (this.options.export) {
        var place = this.options.exportOrder;
        var xlsData = subModule.parentModule.xlsData;
        var subData = {
            rawData: this.data
        };
        switch (this.type) {
            case 'chart':
                var opts = {
                    chart: {width: 735, height: 510}
                };

                if (this.subtype === 'bar') {
                    var fontSize = 13;
                    var y = -18;
                    var x = 5;

                    opts.xAxis = {};
                    opts.plotOptions = {bar: {}};

                    opts.chart.spacingLeft = 10;
                    opts.chart.spacingRight = 30;

                    var color = 'hsl(0,0%,20%)';

                    opts.xAxis.labels = {
                        align: 'left',
                        style: {
                            color: color,
                            fontSize: fontSize
                        },
                        x: x,
                        y: y
                    };

                    //hacking is good
                    opts.chart.events = {load: this.obj.callback = function() {
                            this.series[0].update(opts.plotOptions[This.subtype], false);
                            this.xAxis[0].update(opts.xAxis, false);
                            this.yAxis[0].update(opts.yAxis, false);
                            //this.options.chart = $.extend({},This.obj.options.chart, opts.chart);
                            this.redraw();
                        }
                    };

                    opts.xAxis.labels.useHTML = true;
                    opts.plotOptions.bar.pointWidth = 20;
                }

                subData.picture = svg2bitmap(this.obj, opts);
                opts = null;
                break;
            case 'tweetTable':
            case 'dataTable':
            case 'wordCloud':
            case 'imgSlider':
            case 'videoPlayer':

                break;
        }
        xlsData[place] = subData;
    }
};

subModule.prototype.applyResize = function() {
    var This = this,
            callback = function() {
            };

    switch (this.type) {
        case 'chart':
            callback = function() {
                var options = This.generateChartOptions();
                This.obj.series[0].update(options.plotOptions[This.subtype], false);
                This.obj.xAxis[0].update(options.xAxis, false);
                This.obj.yAxis[0].update(options.yAxis, false);
                This.obj.options.chart = $.extend(This.obj.options.chart, options.chart);

                This.obj.setSize(
                        obj[0].offsetWidth,
                        obj[0].offsetHeight, true);

            };
            break;
        case 'tweetTable':
            break;
        case 'dataTable':
            break;
        case 'wordCloud':
            callback = function() {
                if (This.container.hasClass('w2')) {
                    This.obj.opts.minFontSize = 10;
                    This.obj.opts.maxFontSize = 40;
                } else {
                    This.obj.opts.minFontSize = 20;
                    This.obj.opts.maxFontSize = 80;
                }
                This.obj.generate();
            };
            break;
        case 'imgSlider':
            callback = function() {
                This.obj.resizeFix();
            };
            break;
        case 'videoPlayer':
            callback = function() {
                var thumbnail = This.container.find('.swiper-active-switch');
                This.obj.embedVideo(thumbnail, false);
            };
            break;
    }

    This.container.siblings().css('z-index', 0);
    This.container.css('z-index', 1);
    var obj = This.container.find('.graph');
    obj.transition({opacity: 0}, 50);

    setTimeout(function() {
        This.container.parent().packery('layout');
        This.container.css('z-index', '');
        obj.transition({opacity: 1}, 150);
        callback();
    }, 350);

};

subModule.prototype.chart = function(contentWrapper) {
    var chartOptions = this.chartOptions ? this.chartOptions : {};

    return new Highcharts.Chart($.extend(true, {}, subModule.chartTemplate, {
        chart: {
            renderTo: contentWrapper[0],
            type: this.subtype
        },
        series: this.generateChartData()
    }, this.generateChartOptions(), chartOptions));
};


subModule.prototype.generateChartData = function() {
    var This = this;
    return (function() {
        var series = [];

        if (This.subtype === 'line' || This.subtype === 'spline' || This.subtype === 'area' || This.subtype === 'areaspline') {
            var keys = Object.keys(This.data[Object.keys(This.data)[0]]);

            for (var i = 0; i < keys.length; i++) {
                series[i] = {color: [SBTRED, SBTDBLUE, SBTLBLUE][i], data: [], name: keys[i]};
                for (var time in This.data) {
                    series[i].data.push([
                        moment(time).valueOf(),
                        This.data[time][keys[i]]
                    ]);
                }
            }
            console.log(series);
        } else {
            var data = [];
            for (var i = 0; i < This.data.length; i++) {
                data.push({
                    name: This.data[i].key,
                    y: parseInt(This.data[i].value),
                    id: This.data[i].id
                });
                if (This.subtype === 'bar') {
                    data.last().color = 'hsl(212, ' + (68 - i * 2) + '%, ' + (52 - i) + '%)';
                }

                if (This.subtype === 'pie') {
                    data.last().selected = true;
                    data.last().sliced = true;
                }
            }
            series.push({data: data});
        }
        return series;
    })();
};

subModule.prototype.generateChartOptions = function() {
    var This = this;
    var ish4 = this.container.hasClass('h4');
    var options = {
        chart: {},
        xAxis: {
            labels: {}
        }, plotOptions: {
            bar: {
                dataLabels: {}
            },
            pie: {
                dataLabels: {}
            },
            yAxis: {}
        }};

    if (This.subtype === 'line' || This.subtype === 'spline' || This.subtype === 'area' || This.subtype === 'areaspline') {
        options.xAxis.type = 'datetime';
    } else {
        if (this.subtype === 'bar') {

            var fontSize = ish4 ? 13 : 12;
            var y = ish4 ? -18 : 5;
            var x = ish4 ? 5 : -100;
            options.chart.spacingLeft = ish4 ? 10 : 110;
            options.chart.spacingRight = 30;
            var color = 'hsl(0,0%,20%)';


            options.xAxis.labels = {
                align: 'left',
                style: {
                    color: color,
                    fontSize: fontSize
                },
                x: x,
                y: y
            };

            var idArray = (function() {
                var ret = {};
                for (var i = 0; i < This.data.length; i++) {
                    ret[This.data[i].key] = This.data[i].id;
                }
                return ret;
            })();

            options.xAxis.labels.useHTML = true;
            if (this.options.tag) {
                switch (this.options.tag) {
                    case '<a>':
                        options.xAxis.labels.formatter = function() {
                            return '<a target="_blank" href="' + "http://twitter.com/intent/user?user_id=" + idArray[this.value] + '">' + this.value + '</a>';
                        };
                        break;
                }
            }
            options.plotOptions.bar.pointWidth = ish4 ? 20 : 7;
        }
        else if (this.subtype === 'pie') {
            options.plotOptions.pie.dataLabels.format = '<b>{point.name}</b><br/>{point.y}'
            options.plotOptions.pie.allowPointSelect = true;
        }
        options.xAxis.categories = [];
    }
    return options;
};


subModule.prototype.tweetTable = function(contentWrapper) {
    var This = this;
    var tweet_summary = $('<div>').addClass('tweet_summary');
    var general_tc = $('<div>').addClass('general_tweet_container').appendTo(tweet_summary);
    var ul = $('<ul>').appendTo(general_tc);
    tweet_summary.appendTo(contentWrapper);


    createTweetTable = function() {
        ul.html('');
        var keysSorted = Object.keys(This.data);
        if (keysSorted.length === 0)
            return;

        if (This.data[keysSorted[0]].count) {
            keysSorted = Object.keys(This.data).sort(function(a, b) {
                return This.data[a].count - This.data[b].count;
            })
        }


        for (var i = 0; i < keysSorted.length; i++) {
            var key = keysSorted[i];
            var data = This.data[key];
            data.tweetId = key;
            var newTweet = createFullTweetBlock(data, subModule.parentModule.keylist); //TO-DO
            var lastTweet = ul.find('li:first');
            if (!lastTweet.hasClass('even'))
                newTweet.addClass('even');
            ul.prepend(newTweet);
        }
    };

    createTweetTable();

    return {
        ul: ul,
        createTweetTable: createTweetTable
    };
};


subModule.prototype.dataTable = function(contentWrapper) {
    var This = this;
    var table_container = $('<div>').addClass('table_container');
    var table = $('<table>').addClass('result_table').appendTo(table_container);
    var createTable = function() {
        table.html('');
        var tr = $('<tr>');
        var keys = sorted_keys(This.columns);
        for (var i = 0; i < keys.length; i++) {
            var th = $('<th>').html(This.columns[keys[i]].text);
            if (This.columns[keys[i]].w4)
                th.addClass('w2-hide');
            tr.append(th);
        }
        table.append(tr);

        var keys = Object.keys(This.data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            tr = $('<tr>');
            var values = sorted_keys(This.columns);
            for (var j = 0; j < values.length; j++) {
                var value = values[j];
                var text = This.data[key][value];//This.data[i][j].length > 35 ? This.data[i][j].substring(0, 35) + '...' : This.data[i][j];
                var content = function() {
                    if (This.columns[value].tag) {
                        return  $(This.columns[value].tag).attr({'href': This.data[i][value], 'target': '_blank'}).html(text);
                    } else if (This.columns[value].builder) {
                        return This.columns[value].builder(key, value, This.data);
                    } else {
                        return text;
                    }
                }();
                var td = $('<td>').html(content);
                if (This.columns[value].w4)
                    td.addClass('w2-hide');
                tr.append(td);
            }
            table.append(tr);
        }
        table_container.appendTo(contentWrapper);
    };

    createTable();
    return {createTable: createTable};
};


subModule.prototype.spamTable = function(contentWrapper) {
    var This = this;
    var target = This.options.bindTo;
    if (target) {
        target.options.bindTo = this;
    }

    var createTable = function() {
        table.html('');
        var thead = $('<thead>').appendTo(table);
        var tbody = $('<tbody>').appendTo(table);
        var tr = $('<tr>').appendTo(thead);
        This.createAndAppendTableHeader(tr);
        This.createAndAppendTableBody(tbody);
    };

    var createButton = function() {
        var button = $('<button>').html(This.options.buttonText);
        $('<div>').addClass('button-container').append(button).appendTo(contentWrapper);
        var isSpam = This.options.isSpam;
        //if(this.)


        var prepareQuery = function(q) {
            var ret = $.extend({}, q);
            ret.query = JSON.stringify(ret.query);
            return ret;
        };

        var buildUserQuery = function(q, type) {
            return {
                boolType: 'should',
                field: 'user',
                operation: type ? type : 'term',
                value: q
            };
        };


        var buildUserList = function(arr) {
            var ret = [];
            $.each(arr, function(i, d) {
                ret.push(buildUserQuery(d));
            });
            return ret;
        };

        var buildUrlQuery = function(q) {
            return {
                boolType: 'should',
                field: 'links',
                operation: 'term',
                value: q
            };
        };

        var buildUrlList = function(arr) {
            var ret = [];
            $.each(arr, function(i, d) {
                ret.push(buildUrlQuery(d));
            });
            return ret;
        };
        var buildPictureQuery = function(q) {
            return {
                boolType: 'should',
                field: 'media',
                operation: 'term',
                value: q
            };
        };


        var buildPictureList = function(arr) {
            var ret = [];
            $.each(arr, function(i, d) {
                ret.push(buildPictureQuery(d));
            });
            return ret;
        };

        var buildTweetQuery = function(q, field) {
            return {
                boolType: 'should',
                field: field,
                operation: 'term',
                value: q
            };
        };

        var buildTweetList = function(arr) {
            var ret = [];
            $.each(arr, function(i, d) {
                ret.push(buildTweetQuery(d, 'retweet_id'));
                ret.push(buildTweetQuery(d, 'id'));
            });
            return ret;
        };


        var buildDeviceQuery = function(q) {
            return {
                boolType: 'should',
                field: 'device',
                operation: 'term',
                value: q
            };
        };

        var buildDeviceList = function(arr) {
            var ret = [];
            $.each(arr, function(i, d) {
                ret.push(buildDeviceQuery(d));
            });
            return ret;
        };

        var moveItems = function(arr) {
            $.each(arr, function(i, d) {
                d.myHide();
                setTimeout(function() {
                    d.prependTo(This.options.bindTo.container.find('table tbody')).myShow();
                }, 400);
            });
        };


        button.click(function() {
            var dq = subModule.parentModule.dataQuery, removeList;
            var checkedList = contentWrapper.find('input[type=checkbox]:checked');

            var queries = {
                starttime: dq.starttime,
                endtime: dq.endtime,
                mod: 'spamAssign',
                type: isSpam ? 'delete' : 'add',
                query: [
                    dq.query[0], //created_at
                    {
                        boolType: 'must',
                        field: 'is_spam',
                        operation: 'term',
                        value: isSpam ? 1 : 0
                    }
                ]
            };

            switch (This.subType) {
                case 'users':
                    removeList = (function() {
                        var data = [];
                        checkedList.each(function(d) {
                            data.push({
                                td: $(this).parents('tr'),
                                item: $(this).parents('tr').find('td:eq(0)>a').attr('data-userid')
                            });

                        });
                        queries.query = queries.query.concat(buildUserList(data.map(function(d, i) {
                            return d.item;
                        })));
                        return data;
                    })();
                    break;
                case 'urls':
                    removeList = (function() {
                        var data = [];
                        checkedList.each(function(d) {
                            data.push({
                                td: $(this).parents('tr'),
                                item: $(this).parents('tr').find('td:eq(0)>a').html()
                            });

                        });

                        queries.query = queries.query.concat(buildUrlList(data.map(function(d, i) {
                            return d.item;
                        })));
                        return data;
                    })();
                    break;
                case 'pictures':
                    removeList = (function() {
                        var data = [];
                        checkedList.each(function(d) {
                            data.push({
                                td: $(this).parents('tr'),
                                item: $(this).parents('tr').find('td:eq(0)>a').html()
                            });

                        });

                        queries.query = queries.query.concat(buildPictureList(data.map(function(d, i) {
                            return d.item;
                        })));
                        return data;
                    })();
                    break;
                case 'retweets':
                    removeList = (function() {
                        var data = [];
                        checkedList.each(function(d) {
                            data.push({
                                td: $(this).parents('tr'),
                                item: $(this).parents('tr').find('td:eq(1)>a').attr('data-tweetid')
                            });

                        });
                        queries.query = queries.query.concat(buildTweetList(data.map(function(d, i) {
                            return d.item;
                        })));
                        return data;
                    })();
                    break;
                case 'devices':
                    removeList = (function() {
                        var data = [];
                        checkedList.each(function(d) {
                            data.push({
                                td: $(this).parents('tr'),
                                item: $(this).parents('tr').find('td:eq(0)').html()
                            });

                        });
                        queries.query = queries.query.concat(buildDeviceList(data.map(function(d, i) {
                            return d.item;
                        })));
                        return data;
                    })();
                    break;
            }

            var loading = subModule.parentModule.$('.loading_overlay');
            loading.show();
            //Convert this to myGet so module will send to server
            $.get('data_manager.php', prepareQuery(queries), function(data) {
                if (data && (data.trim() === 'Success')) {
                    moveItems(removeList.map(function(d, i) {
                        return d.td;
                    }));
                } else if (data.trim() === 'Fail') {
                    alert(data + ' Hatalı cevap döndü.');
                } else {
                    alert(data + ' Cevap dönmedi');
                }
                console.log(data);
            }).fail(
                    function(data, status) {
                        alert(data + status);
                    }
            ).always(function() {
                loading.hide();
            });
            ;
        });
    };


    var table_container = $('<div>').addClass('table_container').html('');
    createButton();
    table_container.appendTo(contentWrapper);
    var table = $('<table>').addClass('result_table').appendTo(table_container);

    return {table: table, createTable: createTable};
};

subModule.prototype.createAndAppendTableHeader = function(tr) {
    for (var i = 0; i < this.columns.length; i++) {
        var th = $('<th>').html(this.columns[i].text);
        if (this.columns[i].w4)
            th.addClass('w2-hide');
        tr.append(th);
    }
};

subModule.prototype.createAndAppendTableBody = function(tbody) {
    var tr;
    for (var i = 0; i < this.data.length; i++) {
        tr = $('<tr>');
        for (var j = 0; j < this.columns.length; j++) {
            var content;
            switch (typeof this.columns[j].tpl) {
                case 'function':
                    content = this.columns[j].tpl(this.data[i], i);
                    break;
                case 'string':
                    content = this.columns[j].tpl;
                    break;
                case 'undefined':
                    content = this.data[i][j];
                    break;
                default:
                    console.error('Error');
            }
            var td = $('<td>').html(content);
            if (this.columns[j].w4)
                td.addClass('w2-hide');
            tr.append(td);
        }
        tbody.append(tr);
    }
};


subModule.prototype.wordCloud = function(contentWrapper) {
    var This = this;
    var opts = {
        w: contentWrapper.width(),
        h: contentWrapper.height()
    };

    var svg = d3.select(contentWrapper[0]).append("svg")
            .attr("width", opts.w)
            .attr("height", opts.h);

    var background = svg.append("g"),
            vis = svg.append("g")
            .attr("transform", "translate(" + [opts.w >> 1, opts.h >> 1] + ")");

    var layout = d3.layout.cloud()
            .size([opts.w, opts.h])
            .fontSize(function(d) {
                return opts.fontSize(+d.value);
            })
            .text(function(d) {
                return d.key;
            })
            .rotate(0).on("end", draw);


    function generate() {
        var isw2 = This.container.hasClass('w2');

        var tags;
        if (This.data && This.data.length)
            tags = This.data;
        else {
            tags = [{key: ' ', value: 1}];
        }
        opts = {max: tags[0].value,
            min: tags.last().value,
            font: "Impact",
            spiral: "archimedean", //""; //rectangular
            scaleFcn: 'sqrt', //sqrt', //'log';//sqrt linear
            minFontSize: isw2 ? 10 : 20,
            maxFontSize: isw2 ? Math.min((500 / tags[0].key.length), 20) : Math.min((1000 / tags[0].key.length), 40),
            fontSize: 12,
            words: [],
            w: contentWrapper.width(),
            h: contentWrapper.height()
        };

        layout
                .font(opts.font)
                .spiral(opts.spiral)
                .size([opts.w, opts.h]);


        opts.fontSize = d3.scale[opts.scaleFcn]().range([opts.minFontSize, opts.maxFontSize]);
        if (tags.length)
            opts.fontSize.domain([+tags.last().value || 1, +tags[0].value]);
        opts.words = [];
        layout.stop().words(tags.slice(0)).start();
    }

    function draw(data, bounds) {
        var scale = bounds ? Math.min(
                opts.w / Math.abs(bounds[1].x - opts.w / 2),
                opts.w / Math.abs(bounds[0].x - opts.w / 2),
                opts.h / Math.abs(bounds[1].y - opts.h / 2),
                opts.h / Math.abs(bounds[0].y - opts.h / 2)) / 2 : 1;
        opts.words = data;
        var text = vis.selectAll("text")
                .data(opts.words, function(d) {
                    return d.text.toLowerCase();
                })

        text.transition()
                .duration(1000)
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("font-size", function(d) {
                    return d.size + "px";
                });
        text.enter().append("text")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("font-size", function(d) {
                    return d.size + "px";
                })
                .style("opacity", 1e-6)
                .transition()
                .duration(1000)
                .style("opacity", 1);
        text.style("font-family", function(d) {
            return d.font;
        })
                .style("fill", function(d) {
                    return pct2rgb(opts.min, opts.max, d.value);
                })
                .text(function(d) {
                    return d.text;
                }).append("svg:title")
                .text(function(d) {
                    return d.value + ' ' + lang_array['tweets'];
                });
        var exitGroup = background.append("g")
                .attr("transform", vis.attr("transform"));
        var exitGroupNode = exitGroup.node();
        text.exit().each(function() {
            exitGroupNode.appendChild(this);
        });
        exitGroup.transition()
                .duration(1000)
                .style("opacity", 1e-6)
                .remove();
        vis.transition()
                .delay(100)
                .duration(750)
                .attr("transform", "translate(" + [opts.w >> 1, opts.h >> 1] + ")scale(" + scale + ")");
        setInterval(function() {
            svg.attr("width", opts.w)
                    .attr("height", opts.h);
        }, 900);
    }

    generate();

    return {
        generate: generate,
        draw: draw,
        opts: opts
    };

};

subModule.prototype.imgSlider = function(contentWrapper) {
    var nav_cont = $('<div>').addClass('nav-container');
    var nav_wrapper = $('<div>').addClass('nav-wrapper');
    var img_cont = $('<div>').addClass('img-container swiper-wrapper');
    var swiper_cont = $('<div>').addClass('swiper-container');
    contentWrapper.append(swiper_cont.append(img_cont)).append(nav_cont.append(nav_wrapper));
    this.container.mousewheel(function(e, delta) {
        if (delta > 0) {
            nav_cont.stop().scrollTo({'left': '-=250px', top: 0}, 200)
        } else {
            nav_cont.stop().scrollTo({'left': '+=250px', top: 0}, 200)
        }
        return false;
    });
    return this.createSwiper(swiper_cont, nav_wrapper, img_cont, nav_cont);
};


subModule.prototype.createSwiper = function(swiper_cont, nav_wrapper, img_cont) {
    var This = this;

    if (This.obj) {
        This.obj.stopAutoplay();
        This.obj.destroy(true);
        swiper_cont = This.container.find('.swiper-container');
        nav_wrapper = This.container.find('.nav-wrapper').html('');
        img_cont = This.container.find('.img-container.swiper-wrapper').html('');
    }

    for (var i = 0; i < This.data.length; i++) {
        var slide = $('<div>').addClass('img-wrapper swiper-slide swiper-no-swiping').appendTo(img_cont);
        var imgDiv = $('<div>').addClass('img').css('background-image', 'url(' + This.data[i][0] + ')');
        $('<div>').addClass('outer-img').append(imgDiv).appendTo(slide);
    }

    var currSwiper = new Swiper(swiper_cont[0], {
        mode: 'horizontal',
        speed: 500,
        autoplay: 5000,
        loop: true,
        loopAdditionalSlides: 0,
        slidesPerView: 1,
        calculateHeight: false,
        initialSlide: 0,
        noSwiping: true,
        noswipingClass: 'swiper-no-swiping',
        centeredSlides: true,
        pagination: '.nav-wrapper',
        paginationClickable: true,
        createPagination: true
    });

    nav_wrapper.children().each(function(i) {
        $(this).addClass('nav-img').css('background-image', 'url(' + This.data[i][0] + ')').append($('<div>').addClass('hit-count-div').html(This.data[i][1]));
    });

    img_cont.find('.img').click(function() {
        This.obj.stopAutoplay();
        This.lightbox.show().css('background-image', $(this).css('background-image')).click(function() {
            This.obj.startAutoplay();
            $(this).hide();
        });
    });
    return currSwiper;
};

subModule.prototype.videoPlayer = function(contentWrapper) {
    var This = this;
    var player_cont = $('<div>').addClass('player-container');
    var nav_cont = $('<div>').addClass('nav-container');
    var nav_wrapper = $('<div>').addClass('video-nav-wrapper');
    contentWrapper.append(player_cont).append(nav_cont.append(nav_wrapper));

    var videolinks, links;

    function clearLinks() {
        videolinks = [];
        links = {
            youtube: [],
            dailymotion: [],
            vimeo: []
        };
        var link = "http[s]*://[a-z./?=-_-A-Z0-9]*(youtu|dailymotion|vimeo)[a-z./?=-_-A-Z0-9]+";
        var pat1 = new RegExp(link);
        var i = 0;
        for (var key in This.data) {
            console.log(key);
            if (pat1.test(key)) {
                videolinks[i] = [pat1.exec(key)[0], This.data[key]];
                i++;
            } else {
                console.log(false);
            }
        }

        var youtube1 = new RegExp("http[s]*://[a-z./?=-_-A-Z0-9]*(youtube)[a-z./?=-_-A-Z0-9]+"),
                youtube2 = new RegExp("http[s]*://[a-z./?=-_-A-Z0-9]*(youtu.be)[a-z./?=-_-A-Z0-9]+"),
                dailymotion = new RegExp("http[s]*://[a-z./?=-_-A-Z0-9]*(dailymotion)[a-z./?=-_-A-Z0-9]+"),
                vimeo = new RegExp("http[s]*://[a-z./?=-_-A-Z0-9]*(vimeo)[a-z./?=-_-A-Z0-9]+");

        var yt1 = new RegExp("http[s]*://[a-z./?=-_-A-Z0-9]*(youtube)[a-z./?=-_-A-Z0-9]+="),
                yt2 = new RegExp("http[s]*://[a-z./?=-_-A-Z0-9]*(youtu.be)/"),
                dm = new RegExp("http[s]*://[a-z./?=-_-A-Z0-9]*(dailymotion)[a-z./?=-_-A-Z0-9]+video/"),
                vm = new RegExp("http[s]*://[a-z./?=-_-A-Z0-9]*(vimeo).com/");

        for (var i = 0; i < videolinks.length; i++) {
            if (youtube1.test(videolinks[i][0])) {
                links.youtube.push([videolinks[i][0].replace(yt1, ""), videolinks[i][1]]);
            } else if (youtube2.test(videolinks[i][0])) {
                links.youtube.push([videolinks[i][0].replace(yt2, ""), videolinks[i][1]]);
            } else if (dailymotion.test(videolinks[i][0])) {
                var base = videolinks[i][0].replace(dm, "");
                links.dailymotion.push([base.substring(0, base.indexOf('_')), videolinks[i][1]]);
            } else if (vimeo.test(videolinks[i][0])) {
                links.vimeo.push([videolinks[i][0].replace(vm, "").substring(0, 6), videolinks[i][1]]);
            }
        }
    }

    function embedVideo($obj, autostart) {

        var videoTemplates = {
            dailymotion: '<iframe src="http://www.dailymotion.com/embed/video/{VIDEO_ID}?autoplay={AUTOPLAY}&controls=0" width="{WIDTH}" height="{HEIGHT}" frameborder="0"></iframe>',
            youtube: '<iframe src="http://www.youtube.com/embed/{VIDEO_ID}?color=white&autoplay={AUTOPLAY}&controls=0" width="{WIDTH}" height="{HEIGHT}" ></iframe>',
            vimeo: '<iframe src="http://player.vimeo.com/video/{VIDEO_ID}?autoplay={AUTOPLAY}&portrait=0&byline=0&title=0" width="{WIDTH}" height="{HEIGHT}" frameborder="0"></iframe>'
        };

        var autoplay = autostart ? 1 : 0, iframe;
        if ($obj.length > 0) {
            iframe = $(videoTemplates[$obj.attr('data-site')]
                    .replace('{VIDEO_ID}', $obj.attr('data-id'))
                    .replace('{WIDTH}', player_cont.width())
                    .replace('{HEIGHT}', player_cont.height())
                    .replace('{AUTOPLAY}', autoplay));
        } else {
            iframe = $('<iframe>');
        }
        player_cont.html(iframe);
    }

    function printThumbnails(id, site) {
        var thumbnailTemplates = {
            youtube: 'http://img.youtube.com/vi/{VIDEO_ID}/default.jpg',
            dailymotion: 'http://www.dailymotion.com/thumbnail/video/{VIDEO_ID}',
            vimeo: function(id) {
                var url = "http://vimeo.com/api/v2/video/" + id + ".json";
                var imgObj = nav_wrapper.find('div[data-id=' + id + ']');
                $.get(url, function(data) {
                    var src = data[0].thumbnail_large;
                    imgObj.css('background-image', 'url(' + src + ')');
                }, 'jsonp');
            }
        };

        var thumbnail = $('<div>').addClass('video-thumb').appendTo(nav_wrapper).attr({'data-id': id[0], 'data-site': site});
        thumbnail.append($('<div>').addClass('hit-count-div').html(id[1]));
        if (typeof thumbnailTemplates[site] === 'string') {
            var src = thumbnailTemplates[site].replace('{VIDEO_ID}', id[0]);
            thumbnail.css('background-image', 'url(' + src + ')');
        } else {
            thumbnailTemplates[site](id[0]);
        }
        return thumbnail;
    }

    generatePlayer = function() {

        nav_wrapper.html('');
        player_cont.html('');
        var count = 0;
        for (var key in links) {
            for (var i = 0; i < links[key].length; i++) {
                var id = links[key][i];
                var thumbnail = printThumbnails(id, key);
                thumbnail.click(function() {
                    nav_wrapper.find('.swiper-active-switch').removeClass('swiper-active-switch');
                    $(this).addClass('swiper-active-switch');
                    embedVideo($(this), true);
                });
                if (count === 0 && i === 0) {
                    embedVideo(thumbnail, false);
                    thumbnail.addClass('swiper-active-switch');
                }
            }
            count++;
        }
    };

    This.container.mousewheel(function(e, delta) {
        if (delta > 0) {
            nav_cont.stop().scrollTo({'left': '-=250px', top: 0}, 100);
        } else {
            nav_cont.stop().scrollTo({'left': '+=250px', top: 0}, 100);
        }
        return false;
    });


    clearLinks();
    generatePlayer();

    return {
        links: links,
        embedVideo: embedVideo,
        clearLinks: clearLinks,
        generatePlayer: generatePlayer
    };

};

function showThumb(data) {
    var id = data[0].id;
    var imgObj = $('div[data-id=' + id + ']');
    imgObj.attr('src', data[0].thumbnail_medium);
}

function checkImage(src, yes, argsyes, no, argsno) {
    var img = new Image();
    img.onload = function() {
        yes.apply(window, argsyes);
    };
    img.onerror = function() {
        no.apply(window, argsno);
    };
    img.src = src;
}