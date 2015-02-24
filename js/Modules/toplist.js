var timepickerOptions = $.extend({
    showMinute: false,
    dateFormat: 'dd MM yy, DD',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: true,
    yearSuffix: '',
    changeYear: true,
    defaultDate: "-1D",
    changeMonth: true,
    showOtherMonths: true,
    selectOtherMonths: false,
    stepHour: 1,
    numberOfMonths: 1,
    showButtonPanel: false,
    autoSizeType: true
}, dateLang[lang_array['lang']]);

var program_categories = {
    1: lang_array['series'],
    2: lang_array['news'],
    3: lang_array['entertainment'],
    4: lang_array['others']
};

Toplist = function(container) {
    this.container = container;
    this.timers = [];
    this.processing = false;
    this.ready = false;
    this.resumeKeylist = [];
    this.xhrPool = [];
    this.channels = allChannels;

    this.presponseData = {};
    this.qresponseData = {};

    this.pqueryData = {
        mod: 'table',
        starttime: '',
        endtime: '',
        category: "1111",
        columns: '2111111'
    };

    this.tqueryData = {
        mod: 'table',
        starttime: '',
        endtime: '',
        category: "0000",
        columns: '1000000'

    };

    this.programDates = {};
    this.topicDates = {};
    this.calendarTimer = 0;
    this.currMode = 'program';
    this.columns =
            {
                program: {
                    prefix: 'p',
                    list: {
                        1: {name: 'tweet', longName: lang_array['total_tweets']},
                        2: {name: 'unique', longName: lang_array['unique_users']},
                        3: {name: 'share', longName: lang_array['share']},
                        4: {name: 'reach', longName: lang_array['social_reach']},
                        5: {name: 'rating', longName: lang_array['social_rating']},
                        6: {name: 'ratio', longName: lang_array['interaction_ratio']},
                        7: {name: 'engagement', longName: lang_array['total_engagement']}
                    }
                },
                topic: {
                    prefix: 't',
                    list: {
                        1: {name: 'top_users', order: [{name: 'totalcount', title: lang_array['count']}, {name: 'text', title: lang_array['user_name']}], longName: lang_array['top_users']},
                        2: {name: 'top_mentions', order: [{name: 'totalcount', title: lang_array['mention']}, {name: 'text', title: lang_array['user_name']}], longName: lang_array['top_mentions']},
                        3: {name: 'hashtag', order: [{name: 'totalcount', title: lang_array['count']}, {name: 'text', title: lang_array['hashtag']}], longName: lang_array['related_hashtags']},
                        4: {name: 'retweet', order: [{name: 'totalcount', title: lang_array['count']}, {name: 'user_fullname', title: lang_array['user_name']}, {name: 'text', title: lang_array['tweet_text']}], longName: lang_array['top_retweets']},
                        5: {name: 'picture', order: [{name: 'totalcount', title: lang_array['count']}, {name: 'text', title: lang_array['link'], tag: '<a>'}], longName: lang_array['related_pictures']},
                        6: {name: 'url', order: [{name: 'totalcount', title: lang_array['count']}, {name: 'text', title: lang_array['link'], tag: '<a>'}], longName: lang_array['top_url']},
                        7: {name: 'count', order: [{name: 'totalcount', title: lang_array['video']}, {name: 'text', title: lang_array['link'], tag: '<a>'}], longName: lang_array['related_videos']}
                    }
                }
            };
    this.name = 'toplist';
    this.xlsData = {};
    this.filetype = 'xlsx';
};


Toplist.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        This.prepareDOM();
        This.ready = true;
    });
};

Toplist.prototype.destroy = function() {
    //TODO - Delete any other variables if exists...
    this.container.html('');
};

Toplist.prototype.stop = function() {

};

Toplist.prototype.start = function() {

};


Toplist.prototype.reset = function() {

};

Toplist.prototype.$ = function(selector) {
    return this.container.find(selector);
};



Toplist.prototype.prepareDOM = function() {

    var containers = ['.acordion_container', '.result_table_container'];
    this.animateContainers(containers);
    this.addTimeCallbacks();
    this.addCallbacks();
};

Toplist.prototype.resume = function() {

};


Toplist.prototype.animateContainers = Common.prototype.animateContainers;
Toplist.prototype.myGet = Common.prototype.myGet;
Toplist.prototype.addExportButton = Common.prototype.addExportButton;
Toplist.prototype.excelExport = Common.prototype.excelExport;

Toplist.prototype.addCallbacks = function() {
    var This = this;

    this.prepareColumnSelectors();
    this.$('.acordion button.header').click(function() {
        var body = $(this).siblings('.body');
        var other_body = $(this).parent().siblings('.acordion').children('.body');
        var other_header = $(this).parent().siblings('.acordion').children('.header');

        if (body.is(':hidden')) {
            This.currMode = $(this).parent().attr('data-id');
            $(this).addClass('selected');
            other_header.removeClass('selected');
            body.stop();
            other_body.stop();
            body.show().transition({height: '600px', duration: 400});
            other_body.transition({height: 0, duration: 400}, function() {
                $(this).hide();
            });
            var index = other_body.parent().index();

            This.scrollProcessing = true;
            This.$('.result_table_container').stop().scrollTo(This.$('.result_table_container').children('.container:eq(' + (1 - index) + ')'),
                    {duration: 300,
                        onAfter: function() {
                            This.scrollProcessing = false;
                        }
                    });
        }
    });




    this.$('.result_table_container').mousewheel(function() {
        return false;
    });

    this.$('.result_table_container .result').mousewheel(function(e, delta, deltax, deltay) {
        $(this).stop().scrollTo({
            top: (delta > 0 ? '-=' : '+=') + Math.abs(delta) * 400,
            left: 0,
            easing: 'easeOut'
        }, 100);
        return false;
    });

    this.$('.title input[type="checkbox"]').click(function() {
        var parentTitle = $(this).closest('.title');
        if (!$(this).prop('checked')) {
            var checkedList = parentTitle.find('input[type="checkbox"]:checked');
            var totalChecked = checkedList.length;
            if (totalChecked <= 0) {
                return false;
            }

            var parent = $(this).parents().get(1);
            if (parent.tagName.toLowerCase() === 'tr') {
                if ($(parent).find('input[type=radio]').prop('checked') === true) {
                    var firstChecked = checkedList.first();
                    var firstcheckedNumber = firstChecked.attr('name').replace(/[a-z]/, '');
                    parentTitle.find('input[type=radio][value=' + firstcheckedNumber + ']').click();
                }
            }
        }

        var char = $(this).attr('name')[0];
        var dataName = ((char === "s") ? "p" : char) + "queryData";
        switch (char) {
            case 's':
                This[dataName].category = encodeCBResult(parentTitle);
                break;
            case 'p':
            case 't':
                This[dataName].columns = encodeCBResult(parentTitle);
                This[dataName].columns = encodeRBResult(parentTitle, This[dataName].columns), char;
                break;
        }

    });


    this.$('.title input[type="radio"]').click(function() {
        var value = $(this).val();
        var parentTitle = $(this).closest('.title');
        var char = $(this).attr('name')[0];
        var dataName = char + "queryData";
        This[dataName].columns = encodeCBResult(parentTitle);
        This[dataName].columns = encodeRBResult(parentTitle, This[dataName].columns, char);

        var checkbox = parentTitle.find('input[type="checkbox"][name$=' + value + ']');
        if (!checkbox.prop('checked')) {
            checkbox.click();
        }
        console.log(This[dataName].columns);
    });

    this.$('.list_button').click(function() {
        var dataName = $(this).closest('.acordion').attr('data-id')[0] + "queryData";
        var firstLetter = dataName[0];
        This.requestTableData(dataName, firstLetter);
    });

    var parent = this.$('.p_table_container');
    /*var container = parent.find('.result');
     container.delegate('tr', 'click', function() {
     
     This.$('.graph_tr').transition({height: '0px'}, 300, function() {
     $(this).remove();
     });
     
     var elem = $('<tr>').addClass('graph_tr').attr('colspan', $(this).children().length).insertAfter($(this));
     elem.css('height', 0).transition({height: '300px'}, 300);
     });*/

};

encodeCBResult = function(parent) {
    var str = "";
    var selector = parent.find('input[type=checkbox]');
    if(selector.length == 0){
        return '0000000';
    }
    
    parent.find('input[type=checkbox]').each(function() {
        str += $(this).prop('checked') ? 1 : 0;
    });
    return str;
};

encodeRBResult = function(parent, str, char) {
    var count = 0;
    var result = (char === 'p') ? str : str.replace(/1/g, 0);
    parent.find('input[type=radio]').each(function() {
        if ($(this).prop('checked')) {
            result = result.replaceAt(count, char === 'p' ? '2' : '1');
        }
        count++;
    });
    return result;
};


Toplist.prototype.requestTableData = function(queryData, letter) {
    var This = this;
    if (this.$('button.export').length === 0)
        this.addExportButton(this.$('.export_container'));

    var parent = this.$('.' + letter + '_table_container');
    var container = parent.find('.result');
    container.html('');

    this.myGet('data_manager.php', this[queryData],
            function(data) {
                console.log('data success');

                This[letter + 'responseData'] = data;
                This.printTable(letter, data);
            },
            function(data, textStatus) {
                console.log('Data request FAILED. (' + textStatus + ')');
            }
    );
};

Toplist.prototype.printTable = function(letter, data) {
    var queryData = this[letter + 'queryData'];
    var columns = queryData.columns;
    var currentContainer = this.$('.acordion .header.selected').siblings('.body');
    var startTime = currentContainer.find('label[class$=start]').html();
    var endTime = currentContainer.find('label[class$=end]').html();
    var interval = currentContainer.find('.time_select.selected').html();


    var parent = this.$('.' + letter + '_table_container');
    var container = parent.find('.result');
    container.html('');
    parent.find('h2').html(interval);
    parent.find('h3').html(startTime + ' - ' + endTime);


    var tr = $('<tr>');
    var table = $('<table>').addClass('result_table tablesorter');
    var thead = $('<thead>').appendTo(table);
    var tbody = $('<tbody>').appendTo(table);

    tr.append($('<th>').html(lang_array['rank']));
    if (letter === 'p') {
        tr.append($('<th>').html(lang_array['programs']));
        tr.append($('<th>').html(lang_array['date']));
        tr.append($('<th>').html(lang_array['channels']));
        tr.append($('<th>').html(lang_array['categories']));
        this.addProgramColumns(tr, columns, 'th');
    } else {
        this.addTopicColumns(tr, columns, 'th');
    }



    thead.append(tr);

    var count = 1;
    for (var i = 0; i < data.length; i++) {
        var tr = $('<tr>').css('opacity', '0');
        tr.append($('<td>').html(count++));

        if (letter === 'p') {
            var cid = data[i]['cid'], cat = parseInt(data[i]['category']);
            tr.append($('<td>').addClass('program_td').html('<h1>' + data[i]['pname'] + '</h1> <h2>' + data[i]['hashtag'] + '</h2>'));
            tr.append($('<td>').addClass('date_td').html(moment(data[i]['time']).format('LL')));
            var img = $('<img>').attr('src', 'img/new_channels/' + cid + '.png');
            tr.append($('<td>').addClass('channel_td').append(img).append($('<span>').html(this.channels[cid][1])));
            tr.append($('<td>').html(program_categories[cat]));
            this.addProgramColumns(tr, columns, 'td', data[i]);
        } else {
            this.addTopicColumns(tr, columns, 'td', data[i]);
        }
        tbody.append(tr);
    }
    container.append(table);
    table.tablesorter();

    this.xlsData[letter] = {
        queryData: queryData,
        head: (function() {
            var data = [];
            table.find('thead th').each(function(i) {
                data.push($(this).text());
            });
            return data;
        })(),
        body: (function() {
            var data = [];
            table.find('tbody tr').each(function(i) {
                var subData = [];
                $(this).children().each(function(j) {
                    subData.push($(this).text());
                });
                data.push(subData);
            });
            return data;
        })()
    };
    console.log('end: ', Date.now());
    //table.stickyTableHeaders({fixedOffset: table.offset().top + 1});
    setTransition(table.find('tr'), {opacity: 1}, 800, 10);
};

Toplist.prototype.prepareColumnSelectors = function() {
    for (var key in this.columns) {
        var col = this.columns[key];
        var columnThead = this.$('tbody[data-type=' + key + ']');
        for (var subkey in col.list) {
            var td1 = $('<td>').html(col.list[subkey].longName);
            if (key !== 'topic')
                var td2 = $('<td>').append($('<input>').attr({type: 'checkbox', name: col.prefix + subkey}).html(col.list[subkey].longName));
            else
                var td2 = '';
            var td3 = $('<td>').append($('<input>').attr({type: 'radio', name: col.prefix + '0', value: subkey}));
            columnThead.append($('<tr>').append(td1).append(td2).append(td3));
        }
        columnThead.find('tr td:nth-child(2) input').attr('checked', 'checked');
        columnThead.find('input[type=radio]:eq(0)').attr('checked', 'checked');

    }

};

Toplist.prototype.addProgramColumns = function(tr, columns, type, data) {
    var columnList = this.columns[this.currMode].list;
    for (var i = 0; i < columns.length; i++) {
        if (columns[i] !== '0') {
            var elem = $('<' + type + '>');
            elem.html(type === 'th' ? columnList[i + 1].longName : data[i + 1]);
            if (columns[i] === '2')
                elem.addClass('headerSortUp');
            tr.append(elem);
        }
    }
};

Toplist.prototype.addTopicColumns = function(tr, columns, type, data) {
    var columnList = this.columns[this.currMode].list;

    for (var i = 0; i < columns.length; i++) {
        if (columns[i] !== '0') {
            for (var j = 0; j < columnList[i + 1].order.length; j++) {
                var currOrder = columnList[i + 1].order[j];
                var elem = $('<' + type + '>');

                if (type === 'th') {
                    elem.html(currOrder.title);
                } else {
                    if (currOrder.tag) {
                        var subElem = $(currOrder.tag).html(data[currOrder.name]);
                        if (currOrder.tag === '<a>') {
                            subElem.attr({'href': data[currOrder.name], target: '_blank'});
                        }
                        elem.html(subElem);
                    } else {
                        elem.html(data[currOrder.name]);

                    }
                }

                if (currOrder.name === 'count')
                    elem.addClass('headerSortUp');
                tr.append(elem);
            }
        }
    }
};



Toplist.prototype.addTimeCallbacks = function() {
    var This = this;

    var programDatePicker = this.$("div.program_date");
    var topicDatePicker = this.$("div.topic_date");

    programDatePicker.hide();
    topicDatePicker.hide();



    var start = current().subtract('days', 1).startOf('hour').subtract('hours', 1);
    var currDate = start.toDate();

    this.pDates = {
        start: start,
        date: currDate,
        startDate: start.clone().startOf('week'), //moment([currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - currDate.getDay()]),
        endDate: start.clone().add('days', 6), //moment([currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - currDate.getDay() + 6]),
        interval: 'week',
        minDate: moment('2013-05-01 00:00'),
        maxDate: current().endOf('day').subtract('day', 1)
    };

    this.tDates = $.extend(
            {},
            this.pDates,
            {
                minDate: moment('2013-04-01 00:00'),
                maxDate: current().subtract('hours', 1)
            });



    this.$('.acordion button.time_select').click(function() {
        var interval = $(this).attr('data-id');
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        var programDatePicker = $(this).closest('.title').find('.hasDatepicker');
        programDatePicker.slideDown(300);
        var name = $(this).closest('.acordion').attr('data-id');
        This.currMode = name;
        This[name[0] + 'Dates'].interval = interval;

        programDatePicker.datetimepicker('option',
                {
                    showTimepicker: interval === 'hour',
                    timeFormat: ((interval === 'hour') ? ('HH:mm') : '')
                }
        );
    });

    this.setTimePicker(programDatePicker, 'program', this.$("label.program_start"), this.$("label.program_end"));
    this.setTimePicker(topicDatePicker, 'topic', this.$("label.topic_start"), this.$("label.topic_end"));

};


Toplist.prototype.selectCurrentWeek = function() {
    var This = this;
    window.setTimeout(function() {
        This.$('.ui-datepicker-current-day a').addClass('ui-state-active');
    }, 1);

};


Toplist.prototype.setTimePicker = function(container, date, startDateLabel, endDateLabel) {
    var This = this;
    var dateChar = date[0];
    var dateName = dateChar + 'Dates';

    var minDate = this[dateName].minDate;
    var maxDate = this[dateName].maxDate;


    var picker = container.datetimepicker(
            $.extend({}, timepickerOptions,
            {
                minDate: This[dateName].minDate.toDate(),
                maxDate: This[dateName].maxDate.toDate(),
                onSelect: function(dateText, inst) {
                    var interval = This[dateName].interval;
                    var date = $(this).datepicker('getDate');
                    var startMom = moment(date).startOf(interval);
                    var endMom = moment(date).add(interval + 's', 1).startOf(interval);

                    updateDate(startMom, endMom, interval, inst);
                },
                beforeShowDay: function(date) {

                    var interval = This[dateName].interval;
                    var cssClass = '';
                    var mom = moment(date);

                    if (mom.isSame(This[dateName].startDate, interval)) {
                        cssClass = 'ui-datepicker-current-day';
                    }

                    return [true, cssClass];
                },
                onChangeMonthYear: function(year, month, inst, inst2) {
                    return;
                    var interval = This[dateName].interval;
                    var startMom = moment(year + '-' + month + '-' + This[dateName].startDate.date() + ' ' + inst2.formattedTime).startOf(interval);
                    var endMom = moment(year + '-' + month + '-' + This[dateName].startDate.date() + ' ' + inst2.formattedTime).add(interval + 's', 1).startOf(interval);
                    console.log(startMom.format('MM-DD'));
                    updateDate(startMom, endMom, interval, inst);
                }
            }));


    container.find('div.ui-datepicker-inline').mouseleave(function() {
        var timer = setTimeout(function() {
            container.slideUp(300);
            This.calendarTimer = 0;
        }, 400);
        This.calendarTimer = timer;
    });

    container.find('div.ui-datepicker-inline').mouseenter(function() {
        if (This.calendarTimer) {
            clearInterval(This.calendarTimer);
            This.calendarTimer = 0;
        }
    });



    var updateDate = function(startMom, endMom, interval, inst) {


        This[dateName].startDate = (startMom.isBefore(minDate) ? minDate : startMom).clone();
        This[dateName].endDate = (endMom.isAfter(maxDate) ? maxDate : endMom).clone();

        var timeFormat = ' ';
        inst = inst.inst ? inst.inst : inst;

        timeFormat += inst.settings.timeFormat;


        startDateLabel.text(This[dateName].startDate.format('DD MMMM YYYY, dddd' + timeFormat));
        endDateLabel.text(This[dateName].endDate.format('DD MMMM YYYY, dddd' + timeFormat));
        //startDateLabel.text($.datepicker.formatDate(dateFormat, This[dateName].startDate.toDate(), inst.settings) + This[dateName].startDate.format(timeFormat));
        //endDateLabel.text($.datepicker.formatDate(dateFormat, This[dateName].endDate.toDate(), inst.settings) + This[dateName].endDate.format(timeFormat));

        var queryData = This[dateChar + "queryData"];
        queryData.starttime = This[dateName].startDate.format('YYYY-MM-DD HH:mm:ss');
        queryData.endtime = This[dateName].endDate.format('YYYY-MM-DD HH:mm:ss');

        This.selectCurrentWeek();
        startDateLabel.closest('.body').find('button.list_button').removeAttr('disabled');

    };

    container.datepicker('option', 'showTimepicker', false);
    container.datepicker('setDate', this[dateName].start.toDate());
    container.append($('<div>').addClass('close icon-multiply'));



    container.on('mousemove', '.ui-datepicker-calendar td', function() {
        var currMom = moment([$(this).attr('data-year'), $(this).attr('data-month'), $(this).find('a').text()]);

        $(this).closest('table').find('td').each(function() {
            var interval = This[dateName].interval;
            var mom = moment([$(this).attr('data-year'), $(this).attr('data-month'), $(this).find('a').text()]);
            if (mom.isSame(currMom, interval)) {
                $(this).find('a').addClass('ui-state-hover');
            }

        });
    });
    container.on('mouseleave', '.ui-datepicker-calendar', function() {
        $(this).find('.ui-state-hover').removeClass('ui-state-hover');
    });
};