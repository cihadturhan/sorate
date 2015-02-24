//Panel modulunun sahte ismi
delimeter = ',';
Spamfilter = function(container) {
    this.response = {};
    this.tweetList = {};
    this.newAddedKeys = [];
    this.currentTweetKey = "";
    this.container = container;
    this.chart = null;
    this.timers = [];
    this.processing = false;
    this.ready = false;
    this.dataQuery = {
        query: [{
                boolType: 'must',
                field: 'created_at',
                operation: 'range',
                lowOperation: 'from',
                highOperation: 'to',
                lowValue: current().subtract('days', 1).format('YYYY-MM-DDTHH:mm:ss.000Z'),
                highValue: current().format('YYYY-MM-DDTHH:mm:ss.000Z')
            },
            {
                boolType: 'must',
                field: 'is_spam',
                operation: 'term',
                value: '0'
            }
        ],
        facetSize: 30,
        starttime: current().subtract('days', 1).format('YYYY-MM-DD HH:mm:ss'),
        endtime: current().format('YYYY-MM-DD HH:mm:ss'),
        mod: 'spamfilter'
    };

    this.keylist = [""];
    this.xhrPool = [];
    this.subModules = [];
    this.allKeylist = {};
    this.key = "";
    this.filetype = 'xlsx';
    this.xlsData = {
        general: {},
        0: null,
        1: null,
        2: null,
        3: null
    };
};
Spamfilter.prototype.animateContainers = Common.prototype.animateContainers;
Spamfilter.prototype.$ = Common.prototype.$;
Spamfilter.prototype.myGet = Common.prototype.myGet;
Spamfilter.prototype.loadKeygroup = Common.prototype.loadKeyGroup;
Spamfilter.prototype.resetKeygroup = Common.prototype.resetKeyGroup;
Spamfilter.prototype.downloadKeylist = Common.prototype.downloadKeylist;
Spamfilter.prototype.uploadKeylist = Common.prototype.uploadKeylist;
Spamfilter.prototype.updateGroupList = Common.prototype.updateGroupList;
Spamfilter.prototype.addKeyGroupListeners = Common.prototype.addKeyGroupListeners;
Spamfilter.prototype.datetimeIntervalPicker = Common.prototype.datetimeIntervalPicker;
Spamfilter.prototype.excelExport = Common.prototype.excelExport;
Spamfilter.prototype.addExportButton = Common.prototype.addExportButton;
Spamfilter.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        This.prepareDOM();
    });
};

Spamfilter.prototype.destroy = function() {

};
Spamfilter.prototype.stop = function() {

};
Spamfilter.prototype.resume = function() {
    subModule.parent = this.$('.packery:eq(0)');

};
Spamfilter.prototype.prepareDOM = function() {
    var This = this;
    var popup = This.$('.dialog');
    var popupOverlay = popup.find('.dialog_overlay');


    this.$('.preview').click(function() {

        var w = popup.outerWidth(), h = popup.outerHeight();
        var buttonSize = $(this).outerWidth();
        var px = popup.position().left + popup.parent().offset().left,
                py = popup.position().top + popup.parent().offset().top;

        var clickPos = $(this).offset();
        var by = clickPos.top;
        var bx = clickPos.left;

        if (This.$('.dialog').css('display') === 'none') {

            popup.css({
                opacity: 1,
                display: 'block',
                transform: 'none'}
            );

            setTimeout(function() {
                px = popup.position().left + popup.parent().offset().left,
                        py = popup.position().top + popup.parent().offset().top;
                popup.css({
                    x: bx - px,
                    y: by - py,
                    scale: [buttonSize / w, buttonSize / h]
                });
                popupOverlay.transition({opacity: 0, duration: 300}, function() {
                    $(this).hide();
                });
                popup.transition({y: 0, x: 0, scale: 1, opacity: 1, duration: 300}, 'easeOutExpo');//myShow('left');

                /*popup.find('.blackout')
                 .css({'background-color': svg.css('fill'), display: 'block', opacity: 1})
                 .transition({opacity: 0, duration: 300}, 'easeOutExpo', function() {
                 $(this).hide();
                 });*/

            }, 1);

        } else {
            setTimeout(function() {
                popupOverlay.show().transition({opacity: 1, duration: 300});
                popup.transition({x: bx - px, y: by - py, scale: [buttonSize / w, buttonSize / h], opacity: 0, duration: 300}, 'easeOutExpo',
                        function() {
                            $(this).hide();
                        });//myShow('left');

                /*popup.find('.blackout')
                 .css({'background-color': svg.css('fill'), display: 'block', opacity: 1})
                 .transition({opacity: 0, duration: 300}, 'easeOutExpo', function() {
                 $(this).hide();
                 });*/

            }, 1);
        }
    });




    this.$('.dialog').draggable({handle: '.container_header'}).resizable();
    this.container.delegate('a.img', 'mouseenter', function() {
        if (This.$('.dialog').css('display') === 'none')
            return;
        if (This.currRequest)
            This.currRequest.abort();
        var elem = $('<img>').attr('src', $(this).attr('href'));
        This.$('.dialog .dialog_content').html(elem);
        //This.$('.dialog').html() iframe').attr('src', 'page_display.php');//$(this).attr('href')
    });
    this.container.delegate('a.mention', 'mouseenter', function() {
        if (This.$('.dialog').css('display') === 'none')
            return;
        if (This.currRequest)
            This.currRequest.abort();
        var id = $(this).attr('data-userid');
        This.$('.dialog .dialog_content').html('');
        $.get('page_display.php', {id: id}, function(d) {
            This.$('.dialog .dialog_content').html($('<div>').append(d.html));
        }, 'json');
        //This.$('.dialog').html() iframe').attr('src', 'page_display.php');//$(this).attr('href')
    });

    this.container.delegate('a.url', 'mouseenter', function() {
        if (This.$('.dialog').css('display') === 'none')
            return;
        if (This.currRequest)
            This.currRequest.abort();
        var url = $(this).attr('href');
        This.$('.dialog .dialog_content').html($('<iframe>').attr('src', url));
    });

    var containers = ['.toplist_summary', '.main_graph_container', '.instant_summary', '.main_right'];
    this.animateContainers(containers);

    subModule.parentModule = This;

    function assignPackageryContainer(i) {
        var $container = This.$('.submodule-container:eq(' + i + ') .packery');
        subModule.parent = $container;
        $container.packery({
            columnWidth: 330,
            rowHeight: 330,
            isResizeBound: false
        });
        $container.packery('bindUIDraggableEvents', $container.children());
        var pckry = $container.data('packery');
        var gutter = pckry.options.gutter || 0;
        var columnWidth = pckry.options.columnWidth + gutter;
        return function onResize() {
            var outsideSize = $container.parent().innerWidth();
            var cols = Math.floor(outsideSize / (columnWidth));
            // set container width to columns
            $container.css('width', (cols * columnWidth - gutter) + 'px');
            if (cols === 1) {
                $container.find('.item').removeClass('w4').addClass('w2');
            } else {
                $container.find('.item').removeClass('w2').addClass('w4');
            }
            setTimeout(function() {
                // manually trigger layout
                pckry.layout();
            }, 100);
        };
    }

    var resize0 = assignPackageryContainer(0);


    var checkbox = function() {
        var Arg = arguments;
        return function(d) {
            var obj = d;
            for (var i = 0; i < Arg.length; i++) {
                obj = obj[Arg[i]];
            }
            return $('<input>').attr({type: 'checkbox', 'data-id': obj}).addClass('style2');
        };
    };

    function createUserNameLink(screenName, fullName, id) {
        var fName = $('<span/>').html(' (' + fullName + ')').addClass('full-name');
        var link = $('<a>').attr({
            href: 'https://twitter.com/' + screenName,
            target: '_blank',
            class: 'mention',
            'data-userId': id ? id : ''
        }).html(screenName).append(fName);
        return link;
    }

    function createTweetLink(text, username, id) {
        return $('<a>').attr({
            href: 'https://twitter.com/' + username + '/status/' + id,
            class: 'statuslink',
            target: '_blank',
            title: 'Kullanıcı durumu',
            'data-tweetid': id
        }).html(text);
    }

    this.usersObj = {
        title: lang_array['top_users'],
        resize: 'es e',
        order: 3,
        default: '24',
        data: [],
        type: 'spamTable',
        subType: 'users',
        columns: [
            {text: lang_array['users'], tpl: function(d, i) {
                    return createUserNameLink(d.term.userName, d.term.fullName, d.term.id);
                }},
            {text: 'Hits', tpl: function(d) {
                    return d.count;
                }},
            {text: lang_array['spam'], tpl: checkbox(['term', 'id'])}
        ],
        options: {
            export: false,
            updateButton: true,
            buttonText: lang_array['save_spam'],
            bindTo: null
        }
    };


    this.picturesObj = {
        title: lang_array['related_pictures'],
        resize: 'es e',
        default: '24',
        order: 2,
        data: [],
        type: 'spamTable',
        subType: 'pictures',
        columns: [
            {text: lang_array['pictures'], tpl: function(d, i) {
                    d.term = d.term.replace(',', '');
                    return $('<a>').attr({href: d.term, target: '_blank'}).addClass('img').html(d.term);
                }},
            {text: 'Hits', tpl: function(d) {
                    return d.count;
                }},
            {text: lang_array['spam'], tpl: checkbox('term')}],
        options: {
            export: false,
            updateButton: true,
            buttonText: lang_array['save_spam'],
            bindTo: null
        }
    };

    this.urlsObj = {
        title: lang_array['top_url'],
        resize: 'es e',
        default: '24',
        order: 1,
        data: [],
        type: 'spamTable',
        subType: 'urls',
        columns: [
            {text: lang_array['url'], tpl: function(d, i) {
                    return $('<a>').attr({href: d.term, target: '_blank'}).addClass('url').html(d.term);
                }},
            {text: 'Hits', tpl: function(d) {
                    return d.count;
                }},
            {text: lang_array['spam'], tpl: checkbox('term')}
        ],
        options: {
            export: false,
            updateButton: true,
            buttonText: lang_array['save_spam'],
            bindTo: null
        }};

    this.retweetsObj = {
        title: lang_array['top_retweets'],
        resize: 'es e',
        default: '24',
        order: 4,
        data: [],
        type: 'spamTable',
        subType: 'retweets',
        columns: [
            {text: lang_array['user'], tpl: function(d, i) {
                    return createUserNameLink(d.term.user.userName, d.term.user.fullName, d.term.user.id);
                },
                w4: true
            },
            {text: lang_array['text'], tpl: function(d, i) {
                    return createTweetLink(d.term.text, d.term.user.userName, d.term.stringId);
                }},
            {text: 'Hits', tpl: function(d) {
                    return d.count;
                }},
            {text: lang_array['spam'], tpl: checkbox('term')}
        ],
        options: {
            export: false,
            buttonText: lang_array['save_spam'],
            bindTo: null
        }
    };

    this.devicesObj = {
        title: lang_array['top_device'],
        resize: 'es e',
        default: '24',
        order: 0,
        data: [],
        type: 'spamTable',
        subType: 'devices',
        columns: [
            {text: lang_array['devices'], tpl: function(d, i) {
                    return d.term;
                }
            },
            {text: 'Hits', tpl: function(d) {
                    return d.count;
                }
            },
            {text: lang_array['spam'], tpl: checkbox(['term', 'term'])}
        ],
        options: {
            export: false,
            buttonText: lang_array['save_spam'],
            bindTo: null
        }
    };



    this.subModules = {
        devices: new subModule(this.devicesObj),
        users: new subModule(this.usersObj),
        pictures: new subModule(this.picturesObj),
        urls: new subModule(this.urlsObj),
        retweets: new subModule(this.retweetsObj)
    };


    var keys = Object.keys(This.subModules).sort(function(a, b) {
        return This.subModules[a].order - This.subModules[b].order;
    });
    for (var i = 0, key = keys[i]; i < keys.length; key = keys[++i]) {
        this.subModules[key].init();
    }


    this.spamModules = {};

    for (var key in this.subModules) {
        var spamOverride = {
            options: {
                isSpam: true,
                buttonText: lang_array['remove_spam'],
                bindTo: this.subModules[key]
            }
        };
        this.spamModules[key] = new subModule($.extend(true, {}, this[key + 'Obj'], spamOverride));
    }

    var resize1 = assignPackageryContainer(1);

    keys = Object.keys(This.subModules).sort(function(a, b) {
        return This.subModules[a].order - This.subModules[b].order;
    });
    for (var i = 0, key = keys[i]; i < keys.length; key = keys[++i]) {
        this.spamModules[key].init();
    }

    // debounce resize event
    var resizeTimeout;
    $(window).on('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(onResize, 100);
    });

    function onResize() {
        resize0();
        resize1();
    }

    this.downloadKeylist();
    this.addKeyGroupListeners({
        minLength: -1,
        add: function(key) {
            var keyArray = Object.keys(This.allKeylist), keylist;
            if ($.inArray(key, keyArray) >= 0) {
                keylist = This.allKeylist[key].keylist;
            } else {
                keylist = [key];
            }
            This.key = key;
            This.keylist = keylist;
            var obj = {};
            if (key.length === 0) {
                key = 'list';
            }
            obj[key] = keylist;
            This.dataQuery.keylist = JSON.stringify(obj);
            This.request();
            This.requestSpams();
        }
    });

    this.$('button[name=add_kw]').removeAttr('disabled');
    this.datetimeIntervalPicker({}, function(start, end) {
        This.dataQuery.starttime = moment(start).format(MDATETIME);
        This.dataQuery.endtime = moment(end).format(MDATETIME);
        This.dataQuery.query[0].lowValue = moment(start).format(MDATETIMET);
        This.dataQuery.query[0].highValue = moment(end).format(MDATETIMET);
    });
    This.$('input[name=daypicker]').datepicker(('setDate'), current().format('YYYY-MM-DD'));

    this.requestSpams();
    this.request();
    onResize();

    this.$('.submodule-container').scroll(function(d) {
        var val = $(this).scrollTop();
        $(this).siblings().scrollTop(val);
    });
};

Spamfilter.prototype.request = function() {
    var This = this;
    This.container.find('.container_overlay').show();

    This.myGet('data_manager.php', this.prepareQuery(0), function(data) {
        //sort submodules according to order
        var keys = Object.keys(This.subModules).sort(function(a, b) {
            return This.subModules[a].order - This.subModules[b].order;
        });
        for (var i = 0, key = keys[i]; i < keys.length; key = keys[++i]) {
            var sm = This.subModules[key];
            sm.data = (data && data[key]) ? data[key] : [];
            if (!sm.initiated)
                sm.init();
            else
                sm.update();
        }
    }, function(error) {
        alert(error);
    }, 'json', function(always) {
        This.container.find('.container_overlay').show();
        This.$('button[name=add_kw]').removeAttr('disabled');
        This.$('.container_overlay').hide();
    });
};

Spamfilter.prototype.requestSpams = function() {
    this.container.find('.container_overlay').show();

    var This = this;

    This.myGet('data_manager.php', this.prepareQuery(1), function(data) {
//sort submodules according to order
        var keys = Object.keys(This.spamModules).sort(function(a, b) {
            return This.spamModules[a].order - This.spamModules[b].order;
        });
        for (var i = 0, key = keys[i]; i < keys.length; key = keys[++i]) {
            var sm = This.spamModules[key];
            sm.data = data[key] ? data[key] : [];
            if (!sm.initiated)
                sm.init();
            else
                sm.update();
        }
    }, function(error) {
        alert(error);
    }, 'json', function(always) {
        This.container.find('.container_overlay').show();
        This.$('button[name=add_kw]').removeAttr('disabled');
        This.$('.container_overlay').hide();
    });
};

Spamfilter.prototype.prepareQuery = function(i) {
    var q = $.extend({}, this.dataQuery);
    q.query[1].value = i;
    q.query = JSON.stringify(this.dataQuery.query);
    return q;
};


Spamfilter.prototype.reset = function() {
    this.tweetCount = 0;
    this.timers = [];
    this.response = {};
};