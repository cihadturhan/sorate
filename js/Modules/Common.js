//Common.js
//Ortak olarak calisan fonksiyon prototiplerinin bir arada oldugu yerdir.

//Bos constructor
Common = function() {
};


/************* jquery extendleri *************/

// jquery $ selectoru yerine kullanilir
// bu kullanim ile sadece o modulun icindeki elementler secilmis olur

Common.prototype.$ = function(selector) {
    return this.container.find(selector);
};

//jQuery.get fonksiyonun yerine kullanilir
//Bu fonksiyonla sorgu attiginizda, this.module degiskeni hangi modulden sorgu atildigini belirtmek icin server'a gonderilir
//Boylece kullanicinin sorgulari serverda loglanmis olur.

Common.prototype.myGet = function(url, query, success, error, datatype, always, beforeSend) {
    var This = this;
    query.module = this.name;
    $.ajax({
        type: 'GET',
        url: url,
        data: query,
        timeout: 60000,
        async: true,
        dataType: (datatype ? datatype : 'json'),
        success: function(data) {
            success(data);
        },
        error: function(data, textStatus) {
            if (data.responseText === '*') {
                window.alert(lang_array['you_will_be']);
                window.location.reload();
            }

            if (textStatus !== 'abort')
                $.post('phpmailer/responseFailure.php', {message: JSON.stringify(data), query: JSON.stringify(query), user_id: user_id, user_name: user_name, textStatus: textStatus})
            error(data, textStatus);
        },
        complete: function(jqXHR) {
            This.xhrPool.removeElement(jqXHR);
            if (always)
                always(jqXHR);
        },
        beforeSend: function(jqXHR) {
            This.xhrPool.push(jqXHR);
            if (beforeSend)
                beforeSend();
        }
    });
};

Common.prototype.abortRequests = function() {
    try {
        for (var i = 0; i < this.xhrPool.length; i++) {
            this.xhrPool[i].abort();
        }
    } catch (e) {
        onCatchableError(printStackTrace({e: e}));
    }
    this.xhrPool.length = 0;
};


/************* Dinamik tweet ekleme/silme fonsksiyonlari *************/

//.general_tweet_container icine en alta yeni tweet eklemek icin kullanilir
// Eger en son eklenmis tweet'de even class'i yoksa yeni eklenene bu class'i ekler
// Boylece zebra desenli tweet listesi elde edilir
// Transition fonksiyonu ile de yeni eklenen tweet en sona genisligi artarak eklenir
// scrollTo fonksiyonu ile yeni eklenmis tweet'i gostermek icin en asagiya scroll edilir
Common.prototype.pushBack = function(data, time, tweetContainer) {
    var time = typeof time !== 'undefined' ? time : 250;
    var newTweet = createFullTweetBlock(data, this.tweetQueryData.keylist);
    tweetContainer = tweetContainer ? tweetContainer : this.$('.general_tweet_container ul');
    var lastTweet = tweetContainer.find('li:last');

    if (!lastTweet.hasClass('even'))
        newTweet.addClass('even');
    tweetContainer.append(newTweet);

    if (time < 10) {
        newTweet.css({opacity: 1, height: "80px"});
        tweetContainer.scrollTo('max');
        return;
    }
    newTweet.css({opacity: 0, scale: [1, 0]}).transition({opacity: 1, scale: [1, 1], duration: time});
    tweetContainer.scrollTo('max', {duration: time / 2, easing: 'linear'});
};


// pushBack fonksiyonundan farki bu fonksiyon en uste yeni tweet ekler
// time degiskeni animasyon zamanini belirtir, eger belli bir degerin altindaysa animasyonsuz ekler
// nedeni ise, bazen 1000'lerce tweet gelir ve bu tweetlerin her birine 10 ms verince tum tweetleri 10+ saniyede ekleyecektir.
Common.prototype.pushFront = function(data, time, tweetContainer) {
    var time = typeof time !== 'undefined' ? time : 250;
    var newTweet = createFullTweetBlock(data, this.tweetQueryData.keylist);
    tweetContainer = tweetContainer ? tweetContainer : this.$('.general_tweet_container ul');

    var lastTweet = tweetContainer.find('li:first');

    if (!lastTweet.hasClass('even'))
        newTweet.addClass('even');
    tweetContainer.prepend(newTweet);
    if (time < 10) {
        newTweet.css({opacity: 1, height: "80px"});
        return;
    }
    newTweet.css({opacity: 0, height: 0}).transition({opacity: 1, height: "80px", duration: time});
};

// en alttaki tweet'i siler
Common.prototype.popBack = function() {
    this.$('.general_tweet_container ul li:last').remove();
};

// en ustteki tweet'i siler
Common.prototype.popFront = function() {
    this.$('.general_tweet_container ul li:first').remove();
};

//recursive olarak yeni tweet eklemek icin kullanilir. 
// ornek icin live modulune bakiniz.
// gelen zaman 10 ms'den kucukse beklemeden yeni bir recursive fonksiyonu cagirir
Common.prototype.pushRecursively = function(time, container, callback) {
    var This = this;
    
    

    /*if (time < 10) {
     This.pushRecursively(time, container);
     return;
     }*/
    var result = true;
    if (time > 10) {
        var timer = setInterval(function() {
            if (!pushCurrent()) {
                clearInterval(timer);
                if (callback)
                    callback();
            }
        }, time);
    } else {
        while (result) {
            result = pushCurrent();
        }
    }

    function pushCurrent() {
        var keys = Object.keys(This.tweetList);
        if (keys.length == 0) {
            return false;
        }

        var key = keys.sort()[0];
        var data = This.tweetList[key];
        data.tweetId = key;

        This.pushFront(data, time, container);
        delete This.tweetList[key];
        return true;
    }

    /*setTimeout(function() {
     This.pushRecursively(time, container);
     }, time);*/
};

Common.prototype.pushBackRecursively = function(time, container, callback) {
    var This = this;

    var timer = setInterval(function() {
        var keys = Object.keys(This.tweetList);
        if (keys.length == 0) {
            clearInterval(timer);
            if (callback)
                callback();
            return;
        }

        var key = keys.sort()[0];
        var data = This.tweetList[key];
        data.tweetId = key;

        This.pushBack(data, time, container);
        delete This.tweetList[key];

    }, time);

};


Common.prototype.stopTimer = function(val) {
    clearInterval(this.timers[val]);
    this.timers[val] = 0;
};

Common.prototype.createDropDown = function(container, selector) {
    var ul = container.find('ul');
    var button = container.find('button[name=list_kw]');
    var input = container.find('input[type=text]');
    var popup = container.children('div');
    var This = this;
    button.click(function() {
        input.click();
        return false;
    });
    input.click(function() {
        This.$('.list').each(function(a, b) {
            if (this != popup[0])
                $(this).myHide();
        });
        popup.myShow();
        stopTransition(container.find('li'), 0);
        //setTransition(container.find('li'), 0, {opacity: 1}, 100);
        return false;
    });
    ul.delegate('li', 'click', function() {
        var elem = (selector) ? ($(this).find(selector)) : $(this);
        input.val(elem.text()).attr('data-value', $(this).attr('data-value'));
        input.change();
        popup.myHide();
        stopTransition(container.find('li'), 0);
        This.$('button[name=add_current]').removeAttr('disabled');
    });
};


Common.prototype.loadKeyGroup = function(key) {
    this.$("input[name=keyword]").val(key).addClass('included_kw');
    this.$("button[name=save_kw]").removeClass("icon-save").addClass("icon-edit");
    this.$(".kw_list_input").importTags(this.allKeylist[key].keylist.join(delimeter));
    this.$('.color').css('background-color', this.allKeylist[key].color);
    this.$('input[name=group_name]').val(key);
};

Common.prototype.resetKeyGroup = function(key) {
    this.$("input[name=keyword]").removeClass('included_kw');
    this.$("button[name=save_kw]").removeClass("icon-edit").addClass("icon-save");
    if (key.length > 3)
        this.$(".kw_list_input").importTags(key);
    else
        this.$(".kw_list_input").importTags('');
    this.$('.color').css('background-color', get_random_color());
    this.$('input[name=group_name]').val(key);
};

Common.prototype.animateContainers = function(containers, timeout, duration) {
    var This = this;
    var i = 0;
    var container;

    var timer = setInterval(function() {
        if (i == containers.length) {
            clearInterval(timer);
            return;
        }

        if (jQuery && containers instanceof jQuery) {
            container = $(containers[i]);
        } else {
            container = This.$(containers[i]);
        }

        container.transition({opacity: 1, rotateY: 0}, duration ? duration : 300, function() {
            $(this).css('-webkit-transform', 'none');
        });
        i++;
    }, timeout ? timeout : 80);
};

Common.prototype.downloadKeylist = function() {
    var This = this;
    $.get('keylist_manager.php', {mode: 'get', user_id: user_id}, function(data) {
        This.allKeylist = data;
        for (var key in This.allKeylist) {
            This.allKeylist[key].drawn = false;
        }
        This.updateGroupList();
    }, 'json');
};

Common.prototype.updateGroupList = function() {
    var This = this;
    This.$('.group_list ul').html('');
    var keys = sorted_keys(this.allKeylist);
    for (var i = 0; i < keys.length; i++) {
        var li = $('<li>').prepend(keys[i]).append($('<div>').addClass('icon-multiply').attr('title', lang_array['remove']));
        if (This.allKeylist[keys[i]].drawn) {
            li.addClass('drawn');
        }
        This.$('.group_list ul').append(li);
    }

    This.$("input[name=keyword]").val('');
    This.resetKeygroup('');
    if (This.$('.group_list ul').css('opacity') === '1') {
        setTransition(This.$(".group_list li"), {opacity: 1}, 100);
    }
};

Common.prototype.uploadKeylist = function() {
    this.myGet('keylist_manager.php', {mode: 'set', user_id: user_id, data: JSON.stringify(this.allKeylist)}, function() {
    }, function() {
    });
};


Common.prototype.addKeyGroupListeners = function(opts) {
    var template = '<div class="group_select"><input type="text" name="keyword" value="" placeholder="' + lang_array["type_to"] + '" /><button  name="list_kw" class="icon-uniF48B" > </button><div class="group_list">\n\<ul>                     </ul>                </div>            </div>            <button name="add_kw" class="icon-plus" disabled="disabled" > </button>            <div class="add_edit_container">                <button type="button" name="save_kw" class="icon-save" > </button><div class="kw_list_popup container">                    <div class="name"><span class="header">' + lang_array["group_name"] + ' </span> <input type="text" name="group_name" placeholder=" "> <input class="color">  </div>                    <div class="kw_list"> <span class="header">' + lang_array["words"] + ' </span>                        <input class="kw_list_input" value="" />                    </div>                    <div class="popup_button_container"> <button name="save_group" class="icon-checkmark" ></button> <button name="cancel_group" class="icon-multiply" ></button> </div></div></div>';

    var This = this;
    this.$('.selection_container').prepend(template);

    //show edit popup
    This.$("button[name=save_kw]").click(function() {
        This.$(".kw_list_popup").myShow();
        return false;
    });
    //show keyword list
    This.$("button[name=list_kw]").click(function() {
        This.$(".group_list").transition({display: 'block', duration: 0}).myShow();
        setTimeout(function() {
            This.$(".group_list li").css('transform', 'translateY(-10px)');
            //stopTransition(This.$(".group_list li"), 0);
            setTransition(This.$(".group_list li"), {opacity: 1, transform: 'translateY(0px)'}, 300, 10, 0.95);
        }, 150);
        return false;
    });
    This.$("input[name=keyword]").keyup(function(e) {
        switch (e.which) {
            case 220:
                return;
                break;
        }
        var key = $(this).val();//.replace(/[-$%^&*()_+|~=`{}\[\]:";'<>?,.]+/, ''); //TODO !(exclamation mark) may need to be inserted
        var minLength = typeof opts.minLength !== 'undefined' ? opts.minLength : 2;
        if (key.length > minLength) {
            This.$('button[name=add_kw]').removeAttr('disabled');
            if (e.which === 13) {
                This.$("button[name=add_kw]").click();
                return;
            }
        } else {
            This.$('button[name=add_kw]').attr('disabled', 'disabled');
        }

        var keyArray = Object.keys(This.allKeylist);
        if ($.inArray(key, keyArray) === -1) {
            This.resetKeygroup(key);
        } else {
            This.loadKeygroup(key);
            This.$('button[name=add_kw]').removeAttr('disabled');
            if (opts.keyup)
                opts.keyup(key);
        }
    });


    This.$(".kw_list_popup").click(function() {
        return false;
    });

    This.$("button[name=add_kw]").click(function() {
        var key = This.$("input[name=keyword]").val();
        $(this).attr('disabled', 'disabled');
        if (opts.add) {
            opts.add(key);
        }
    });
    This.container.delegate('.highcharts-container', 'click', function() {
        This.container.click();
    });

    This.container.click(function(e) {
        This.$(".kw_list_popup, .group_list").myHide();
        //stopTransition(This.$(".group_list li"), 0);
        setTransition(This.$(".group_list li"), {opacity: 0}, 100, 1, 0.9);
    });

    This.$(".group_list ul").delegate("li", 'click', function(e) {
        var key = $.trim($(this).text());
        This.loadKeygroup(key);
        This.$(".group_list").myHide();
        This.$('button[name=add_kw]').removeAttr('disabled');
        //stopTransition(This.$(".group_list li"));
        setTransition(This.$(".group_list li"), {opacity: 0}, 100, 1, 0.9);
        e.stopPropagation();

        if (opts.select) {
            opts.select(key);
        }
    });

    This.$('button[name=save_group]').click(function() {
        if (This.$('input[name=group_name]').val() === '') {
            This.$('input[name=group_name]')
                    .stop()
                    .transition({'border-color': SBTRED, duration: 300})
                    .transition({'border-color': '', duration: 1000});
            return;
        }

        var oldGroupName = This.$("input[name=keyword]").val();
        var drawn = false;
        if (This.allKeylist[oldGroupName]) {
            drawn = This.allKeylist[oldGroupName].drawn;
            delete This.allKeylist[oldGroupName];
        }

        var newGroupName = This.$('input[name=group_name]').val();
        var keylist = This.$('.kw_list_input').val().split(delimeter);
        var color = This.$('.color').css('background-color');
        var newkeygroup = {keylist: keylist, color: color, drawn: drawn};
        This.allKeylist[oldGroupName] = newkeygroup;
        if (opts.save) {
            opts.save(newGroupName, newkeygroup, oldGroupName);
        }

        This.updateGroupList();
        This.uploadKeylist();
        This.loadKeygroup(newGroupName);
    });

    This.$('button[name=cancel_group]').click(function() {
        var currentKey = This.$("input[name=keyword]").val();
        var keyArray = Object.keys(This.allKeylist);
        if ($.inArray(currentKey, keyArray) !== -1)
            This.loadKeygroup(currentKey);
        This.$(".kw_list_popup, .group_list").myHide();
        setTransition(This.$(".group_list li"), {opacity: 0}, 100, 1, 0.9);
        if (opts.cancel) {
            opts.cancel(currentKey);
        }
    });

    This.$(".kw_list_input").tagsInput({height: "auto",
        width: "auto",
        delimiter: delimeter,
        defaultText: lang_array['new_keyword'],
        'minChars': 3,
        'maxChars': 40 //if not provided there is no limit,
    });
    //TODO Add Callback Here
    This.$('.group_list ul').delegate('li .icon-multiply', 'click', function() {
        var currentKey = $(this).parent().text();
        if (opts.remove)
            opts.remove(currentKey);
        delete This.allKeylist[currentKey];
        This.uploadKeylist();
        This.updateGroupList();
        return false;
    });
    var myPicker = new jscolor.color(This.$('input.color')[0], {onImmediateChange: opts.colorChange ? opts.colorChange : null});
    myPicker.fromString('99FF33');
    this.downloadKeylist();
};

/**Daha okunakli bir sayi yazdirmak icin kullanilir.Ornegin: 0.003 => <0.001, 11231.123123 => 11231, 0.00000123 => 0
 * @param value number <p> Degerine gore icerigi yazdirir. live peaklist ve live monitorde oldugu gibi zamani ve gerisayimi yazdirir.</p>
 * @return string html formatinda string geri verir.
 */

readableNumber = function(value) {

    if (parseInt(value) >= 1000) {
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    } else if (parseFloat(value) >= 100 && parseFloat(value) < 1000) {
        value = parseInt(value);
    } else if (parseFloat(value) >= 30 && parseFloat(value) < 100) {
        value = parseFloat(value).toFixed(1);
    } else if (parseFloat(value) >= 1 && parseFloat(value) < 30) {
        value = parseFloat(value).toFixed(2);
    } else if (parseFloat(value) < 1) {
        value = parseFloat(value).toFixed(4);
        if (parseFloat(value) < 0.001) {
            value = '<0.001';
            if (value < 0.0001) {
                value = '0';
            }
        }
    }
    return value;
};


/**Wordmeter ve TVtags icin grafik yaninda ozet bilgisini bastirmakta kullanilir
 * @return null
 */
Common.prototype.createSummary = function(args) {

    var sections = {
        basic: {
            strings: ['tweetCount', 'uniqueUser', 'mean'],
            btn: $('<button>').html('Basic').addClass('selected'),
            cont: $('<div>').addClass('swiper-slide')
        },
        inter: {
            strings: ['retweetCount', 'repliesCount', 'interactionRatio'],
            btn: $('<button>').html('Interaction'),
            cont: $('<div>').addClass('swiper-slide')
        },
        social: {
            strings: ['share', 'socialRating', 'socialReach', 'totalEngagement'],
            btn: $('<button>').html('Social'),
            cont: $('<div>').addClass('swiper-slide')
        }
    };

    var This = this;

    $('<div>').addClass('close icon-multiply').appendTo(args.container).click(function() {
        This.removeChart(args.index);
    });

    var infoContainer = args.container.find('.info-container');
    var summ = this.summaryResponseData[0];
    var rat = this.summaryResponseData[1];
    //TODO - Delete the followings

    var inlineOpt = $('<div>').addClass('inline_option').appendTo(infoContainer);
    var content = $('<div>').addClass('tabscontent swiper-container').appendTo(infoContainer);
    var wrapper = $('<div>').addClass('swiper-wrapper').appendTo(content);

    var count = 0;
    for (var section in sections) {
        inlineOpt.append(sections[section].btn.attr('data-id', count++));
        wrapper.append(sections[section].cont);
        var str = sections[section].strings, cont = sections[section].cont;
        for (var i = 0; i < str.length; i++) {
            var innerWrapper = $('<div>').addClass('info').attr('title', lang_array[str[i] + 'Expl']).appendTo(cont);
            $('<h2>').addClass(str[i]).html(readableNumber(summ[str[i]])).appendTo(innerWrapper);
            $('<h1>').addClass(str[i]).html(lang_array[str[i]]).appendTo(innerWrapper);
        }
    }

    //twitter siralamasi sadece analiz modulunde verilir.
    if (summ.rating.length > 0) { //&& this.name === 'analyze' // TODO 
        $('<h1>').addClass('rating').html('').appendTo(infoContainer);
        for (var i = 0; i < summ.rating.length; i++) {
            var current = summ.rating[i];
            if (current.location === 'Turkey') {
                var h1 = $('<h3>').addClass('turkey position info').html('#' + current.position).appendTo(infoContainer).attr('title', lang_array['turkeyExpl']);
                $('<span>').addClass('time info').html(moment(current.date).format('DD MMM HH:mm')).appendTo(h1);
            } else if (current.location === 'World') {
                var h1 = $('<h3>').addClass('world position info').html('#' + current.position).appendTo(infoContainer).attr('title', lang_array['worldExpl']);
                $('<span>').addClass('time').html(moment(current.date).format('DD MMM HH:mm')).appendTo(h1);
            }
        }
    }

    // kanal reyting degerleri sadece (dogal olarak) detail modulunde verilir.
    if (rat) {
        $('<h1>').addClass('rating').html('').appendTo(infoContainer);
        for (var key in rat) {
            var h1, span;
            if (key === 'amr') {
                h1 = $('<h3>');
                span = $('<span>').addClass('time').html('AMR%');
            } else if (key === 'shr') {
                h1 = $('<h3>').addClass(key + ' info');
                span = $('<span>').addClass('time').html('SHR');
            }
            h1.addClass(key + ' info').html(readableNumber(rat[key])).append(span).appendTo(infoContainer).attr('title', lang_array[key + 'Expl']);
        }
    }


    //TODO - Add destructor of this.
    var currSwiper = new Swiper(content[0], {
        mode: 'horizontal',
        speed: 500,
        slidesPerView: 1,
        calculateHeight: false,
        initialSlide: 0,
        noSwiping: true,
        noswipingClass: 'swiper-slide',
        centeredSlides: true
    });

    this.$('.info-container .info').tooltip({
        position: {
            my: "center top",
            at: "center bottom"
        },
        show: {
            delay: 0,
            duration: 200

        },
        hide: {
            delay: 0,
            duration: 0

        }
    });

    inlineOpt.addInlineOption(function(count) {
        currSwiper.swipeTo(count);
    });

};

$.fn.addInlineOption = function(callback) {
    this.find('button').click(function() {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        if (callback)
            callback($(this).attr('data-id'));
    });
};

Common.prototype.addExportButton = function() {
    var This = this;
    this.$('.export_container button').click(function() {
        This.filetype = $(this).attr('class');
        This.$('.export_container button').attr('disabled', 'disabled');
        This.excelExport();
    });
};


Common.prototype.excelExport = function() {
    var This = this;

    this.$('button.export').attr('disabled', 'disabled');
    this.$('button.export .icon-export').myHide();
    this.$('button.export .icon-spinner').myShow();
    var query = {
        module: this.name,
        xlsdata: JSON.stringify(this.xlsData),
        filetype: this.filetype
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
            This.$('button.export').removeAttr('disabled');
            This.$('button.export .icon-export').myShow();
            This.$('button.export .icon-spinner').myHide();
        }
    });
};

Common.prototype.addExportButton = function(container) {
    var icon = $('<div>').addClass('icon-export');
    var icon2 = $('<div>').addClass('icon-spinner');
    var downloadButton = $('<button>').addClass('export').attr('data-text', lang_array['export']).append(icon).append(icon2);
    container.append(downloadButton);
    var This = this;
    downloadButton.click(function() {
        This.excelExport();
    });
};

Common.prototype.addDayListener = function(callback) {
    this.$('input[name=daypicker]').datepicker($.extend({
        minDate: new Date(2013, 8 - 1 /* january  =  0*/, 1),
        maxDate: "-1D",
        dateFormat: 'dd MM yy, DD',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    }, dateLang[lang_array['lang']]));

    this.$('input[name=daypicker], .new_detail_popup').click(function() {
        return false;
    });

    this.$('input[name=daypicker]').change(function() {
        callback($(this).datepicker("getDate"));
    });
};


Common.prototype.createPartStr = function() {
    var ch = this.selectData.channel,
            partStr = '';

    for (var key in this.program.parts) {
        var part = this.program.parts[key];
        if (part['PARTTYPE'] === '1')
            partStr += ch + ',0,' + part['STARTSECOND'] + ',' + part['ENDSECOND'] + '#';
    }
    return partStr;
};

Common.prototype.requestRatingData = function(callback) {
    var date = moment(this.selectData.date, 'DD.MM.YYYY').format('YYYYMMDD');
    $.get('rating_manager.php', {date: date, partStr: this.createPartStr()}, function(data) {
        if (callback)
            callback(data);
    }, 'json');
};

Common.prototype.datetimeIntervalPicker = function(override, callback) {

    var opts = {
        minDate: moment('2013-05-28 00:00'),
        maxDate: current(),
        maxInterval: 30,
        minInterval: 1,
        startDateTextBox: this.$('input[name=timepicker_start]'),
        endDateTextBox: this.$('input[name=timepicker_end]')
    };

    $.extend(true, opts, override);

    var minDate = opts.minDate;
    var maxDate = opts.maxDate;
    var maxInterval = opts.maxInterval; //days
    var minInterval = opts.minInterval; //minutes

    var startDateTextBox = opts.startDateTextBox;
    var endDateTextBox = opts.endDateTextBox;

    var timeOpts = $.extend({
        minDate: minDate.toDate(),
        maxDate: maxDate.toDate(),
        dateFormat: 'dd MM yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        stepHour: 1,
        stepMinute: 10
    }, dateLang[lang_array['lang']]);


    onSelectHandler = function() {
        var start = moment(startDateTextBox.val(), 'DD MMMM YYYY HH:mm'); //moment(startDateTextBox.datetimepicker('getDate'));
        var end = moment(endDateTextBox.val(), 'DD MMMM YYYY HH:mm');

        if (!start || !end) {
            return;
        }
        if ($(this).is(startDateTextBox)) {
            if (end.diff(start, 'hours', true) < minInterval) {
                end = start.clone().add('hours', minInterval);
                endDateTextBox.datetimepicker('setDate', end.toDate());
            }

            if (end.diff(start, 'days', true) > maxInterval) {
                end = start.clone().add('days', maxInterval);
                endDateTextBox.datetimepicker('setDate', end.toDate());
            }
        } else if ($(this).is(endDateTextBox)) {
            if (end.diff(start, 'hours', true) < minInterval) {
                start = end.clone().subtract('hours', minInterval);
                startDateTextBox.datetimepicker('setDate', start.toDate());
            }

            if (end.diff(start, 'days', true) > maxInterval) {
                start = end.clone().subtract('days', maxInterval);
                startDateTextBox.datetimepicker('setDate', start.toDate());
            }
        }

        callback(start, end);
    };

    startDateTextBox.datetimepicker($.extend(true, {}, timeOpts, {
        onSelect: onSelectHandler,
        onChangeMonthYear: onSelectHandler,
        maxDate: maxDate.clone().subtract('hours', minInterval).toDate()
    }));

    endDateTextBox.datetimepicker($.extend(true, {}, timeOpts, {
        onSelect: onSelectHandler,
        onChangeMonthYear: onSelectHandler,
        minDate: minDate.clone().add('hours', minInterval).toDate()
    }));


    var start = current().subtract('days', 1).startOf('day');
    var end = current().startOf('day');

    startDateTextBox.datetimepicker('setDate', start.toDate());
    endDateTextBox.datetimepicker('setDate', end.toDate());
    onSelectHandler();

};



Common.prototype.addIntervalListener = function(opts) {
    /*
     var startd = this.$('input[name=startdate]'), startt = this.$('input[name=starttime]'),
     endd = this.$('input[name=enddate]'), endt = this.$('input[name=endtime]');
     
     var dateDefaults = {
     minDate: '',
     maxDate: '',
     startDate: '',
     endDate: '',
     callback: function(s, e) {
     },
     mode: 'day'
     };
     
     var timeDefaults = {
     'timeFormat': 'H:i',
     'step': 30,
     'forceRoundTime': true
     };
     
     $.extend(dateDefaults, opts);
     
     startt.timepicker(timeDefaults);
     endt.timepicker(timeDefaults);
     
     
     var start = 0, end = 1;
     callback(start, end);
     };
     
     
     */

};
Common.prototype.selectCurrentWeek = function() {
    var This = this;
    window.setTimeout(function() {
        This.$('.ui-datepicker-current-day a').addClass('ui-state-active');
    }, 1);

    //datepicker.setOption('showWeek',showWeek: true, weekHeader: 'W', numberOfMonths: 3,)ş

};

//4 tane ayrı picker tanimlanir

Common.prototype.setTimePicker = function(container, opts, interval) {

    var d1 = $('<input>').attr({type: 'text'});

    container.append();

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

    var setType = function(type) {
        switch (type) {
            case 'hour':
                break;
            case 'day':
                break;
            case 'week':
                break;
            case 'month':
                break;
        }
    };


    var This = this;
    var dateChar = date[0];
    var dateName = dateChar + 'Dates';

    var minDate = opts.minDate;
    var maxDate = opts.maxDate;
    var interval = opts.interval;


    var picker = container.datetimepicker(
            $.extend({}, timepickerOptions,
                    {
                        minDate: minDate.toDate(),
                        maxDate: maxDate.toDate(),
                        onSelect: function(dateText, inst) {
                            var interval = This[dateName].interval;
                            var date = $(this).datepicker('getDate');
                            var startMom = moment(date).startOf(interval);
                            var endMom = moment(date).add(interval + 's', 1).startOf(interval);
                            updateDate(startMom, endMom, interval, inst);
                        },
                        beforeShow: function() {
                            setTimeout(function() {
                                $('.ui-datepicker-calendar').addClass('superHide');
                            }, 1);
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
                            //TODO
                            return;
                            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                            $(this).datepicker('setDate', new Date(year, month, 1));
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

    return {setType: setType};
};