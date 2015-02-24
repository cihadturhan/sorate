ANIMTIME = 5000;

Actual = function(container) {
    this.response = {};
    this.container = container;
    this.chart = null;
    this.timers = [];
    this.processing = false;
    this.ready = false;
    this.dataQuery = {};
    this.xhrPool = [];


};


Actual.prototype.initialize = function() {
    var This = this;
    setTimeout(function() {
        var container = This.$('.tiles');
        This.cwidth = container.innerWidth();
        This.cleft = container.offset().left;
        This.ctop = container.offset().top;
        This.prepareDOM();
        This.ready = true;
    }, 500);
};

Actual.prototype.$ = Common.prototype.$;
Actual.prototype.myGet = Common.prototype.myGet;
Actual.prototype.animateContainers = Common.prototype.animateContainers;

Actual.prototype.prepareDOM = function() {
    var This = this;
    var container = this.$('.tiles');

    for (var i = 0; i < jsonObj.length; i++) {
        var img_cont = $('<div>').addClass('img-container swiper-no-swiping');
        var tile = $('<div>').addClass('tile');
        var swiper_cont = $('<div>').addClass('swiper-container');

        var hasghtagDiv = $('<div>').addClass('hashtag-div');
        var hashtagSpan = $('<span>').addClass('hashtag-span');
        var countSpan = $('<span>').addClass('count-span');
        var subhashtagDiv = $('<div>').addClass('subhashtag-div');
        var tweetDiv = $('<div>').addClass('tweet-div');
        var enlargeButton = $('<button>').addClass('enlarge-btn icon-resize-full');

        var p = $('<p>').addClass('tile-meta').append(hasghtagDiv.append(hashtagSpan).append(countSpan)).append(subhashtagDiv).append(tweetDiv).append(enlargeButton);
        var a = $('<a>').attr('href', '#').addClass('container');

        container.append(a.append(tile.append(swiper_cont.append(img_cont)).append(p)));
        a.attr('data-size', jsonObj[i].size);

    }

    furnicator = new Furnisher(container, 'a.container', 3);

    This.requestActualData();

    This.$('.tiles>a').each(function() {
        var left = $(this).offset().left;
        var middle = This.cleft + This.cwidth / 2;

        if (left < middle) {
            $(this).removeClass('toright').addClass('toleft').css('transform-origin', This.cleft - left + 'px 50%');
        } else {
            $(this).removeClass('toleft').addClass('toright').css('transform-origin', This.cwidth + This.cleft - left + 'px 50%');
        }
    });

    This.addCallbacks();
};


Actual.prototype.addHoverCallback = function() {
    var This = this;
    this.$('.tiles').children(':not(.tile_overlay)').each(function(i) {
        $(this).on('mouseenter', function() {
            This.destroySlider();
            This.createSlider($(this));
            This.pauseRandomAnimation();
            This.$('.tile_overlay').stop().show().transition({opacity: 1}, 300);
            $(this).css('z-index', 4);
        }).on('mouseleave', function() {
            This.$('.tile_overlay').stop().transition({opacity: 0}, 50, function() {
                $(this).hide();
            });
            This.destroySlider();
            This.resumeRandomAnimation();
            $(this).css('z-index', '');
        });

    });
}

Actual.prototype.removeHoverCallback = function() {
    this.$('.tiles>:not(.tile_overlay)').unbind('mouseenter mouseleave');
};

Actual.prototype.destroySlider = function() {
    var This = this;
    if (This.currSwiper) {
        clearInterval(This.autoPlay);
        clearInterval(This.tweetautoPlay);

        var parent = $(This.currSwiper.container).closest('.hovered');
        This.currSwiper.destroy();
        parent.removeClass('hovered');
        parent.find('.swiper-wrapper').css(
                {
                    'transition': '',
                    'transform': '',
                    'width': '',
                    'height': ''
                }).removeClass('swiper-wrapper');
        parent.find('.swiper-slide').removeClass('swiper-slide').css({width: '', height: '', animation: ''});
        parent.find('.swiper-slide-visible').removeClass('swiper-slide-visible');
        parent.find('.swiper-slide-active').removeClass('swiper-slide-active');


        var img_cont = parent.find('.img-container');

        This.refillPictures(img_cont, This.data[img_cont.attr('data-index')]['pictures']);

        img_cont.find('.img-wrapper:not(:eq(0))').css({'-webkit-transform': 'rotateX(89deg)', opacity: 0});
        img_cont.find('.img-wrapper:eq(0)').addClass('middle');
        This.currSwiper = null;
    }
};

Actual.prototype.createSlider = function(parent) {
    var This = this;
    if (parent.find('.img-wrapper').length < 2) {
        This.currSwiper = null;
        return;
    }
    var tweetDiv = parent.find('.tweet-div');

    parent.addClass('hovered');
    parent.find('.img-container').addClass('swiper-wrapper');
    parent.find('.img-wrapper').addClass('swiper-slide');


    This.currSwiper = new Swiper(parent.find('.swiper-container')[0], {
        mode: 'vertical',
        speed: 1000,
        loop: true,
        loopAdditionalSlides: 0,
        slidesPerView: 2,
        calculateHeight: false,
        initialSlide: 0,
        noSwiping: true
    });



    This.currSwiper.swipePrev();
    This.autoPlay = setInterval(function() {
        This.currSwiper.swipePrev();
    }, 2500);

    var orders = ['.even', ':not(.even)'];
    var curr = 0;
    This.tweetautoPlay = setInterval(function() {
        var currOrder = orders[curr];

        var front = tweetDiv.find('li' + currOrder + '.front');
        var nextFront = tweetDiv.find('li' + currOrder + '.front~li' + currOrder + ':first');
        front.transition({rotateX: '180deg'}, 800, function() {
            $(this).css('transform', 'rotateX(-180deg)');
        });

        if (nextFront.length == 0)
            nextFront = tweetDiv.find('li' + currOrder + ':eq(0)');
        nextFront.transition({rotateX: '0deg'}, 800);

        front.removeClass('front');
        nextFront.addClass('front');
        curr = Math.abs(curr - 1);
    }, 3000)
};

Actual.prototype.addCallbacks = function() {
    var This = this;

    This.flipped = true;

    This.$('.tiles a.container .enlarge-btn').click(function() {
        if (This.flipped) {
            This.removeHoverCallback();
            var parent = $(this).closest('.tiles a.container');
            var maxLength = This.$('.tile').length;
            leftRotate(This.$('.tiles'), 0, 100, maxLength, parent);
            var top = parent.offset().top;
            var left = parent.offset().left;
            //parent.children().hide();

            var fw = This.$('.tile_container').innerWidth();
            var fh = This.$('.tile_container').innerHeight();

            var iw = parent.outerWidth();
            var ih = parent.outerHeight();
            var trOrig = parent.css('transform-origin');
            parent.attr('data-origin', trOrig);
            parent.css('transform-origin', '0 0');
            parent.delay(300).transition({y: This.ctop - top}, 500).transition({x: This.cleft - left, scale: [fw / iw, fh / ih]}, 500);
            parent.find('.tile').delay(800).transition({opacity:0},400);
            
        } else {
            var parent = $(this).closest('.tiles a.container');
            parent.transition({x: 0, scale: 1}, 500).transition({y: 0}, 500, function() {
                $(this).css('transform-origin', $(this).attr('data-origin'));
            });

            $(this).children().show();
            This.addHoverCallback();
            setTimeout(function() {
                This.$('.tiles>a').show().transition({rotateY: 0, opacity: 1});
            }, 800);
            parent.find('.tile').transition({opacity:1},400);
        }
        This.flipped = !This.flipped;
    }
    );
    /*
     This.$('.tiles').delegate('a', 'mouseenter', function() {
     $(this).css({'z-index': 1000}).stop().transition({width: '49.3%', height: '471px'}, 200,function(){
     });
     });
     
     This.$('.tiles').delegate('a', 'mouseleave', function() {
     $(this).css({width: '', height: ''}).css({'z-index': ''});
     })*/


    function leftRotate(elem, count, timer, maxLength, $ref) {
        if (count >= maxLength) {
            return;
        }

        var $obj = elem.find('>a:eq(' + count + ')');
        console.log($obj);

        if (!$obj.is($ref))
            if ($obj.hasClass('toleft')) {
                $obj.transition({rotateY: '-90deg', opacity: 0}, 400, function() {
                    $(this).hide();
                });
            } else {
                $obj.transition({rotateY: '90deg', opacity: 0}, 400, function() {
                    $(this).hide();
                });
            }
        var currTimer = parseInt(timer * 0.8);
        setTimeout(function() {
            leftRotate(elem, ++count, currTimer, maxLength, $ref);
        }, timer);
    }

    This.$('.tiles>a.toleft').hide().transition({rotateY: '-90deg', opacity: 0}, 0);
    This.$('.tiles>a.toright').hide().transition({rotateY: '90deg', opacity: 0}, 0);
    This.$('.tiles>a').show().transition({rotateY: 0, opacity: 1});


};

Actual.prototype.destroy = function() {

};

Actual.prototype.stop = function() {

};

Actual.prototype.resume = function() {

};

Actual.prototype.requestActualData = function() {
    var This = this;

    this.myGet('data_manager.php', {mod: 'tile'}, function(data) {
        This.data = jsonObj;
        console.log(This.data);
        for (var i = 0; i < This.data.length; i++) {
            var tile = This.$('.tiles>a:eq(' + i + ') .tile');
            var imgCont = tile.find('.img-container').attr('data-index', i);
            var hashtagCont = tile.find('.hashtag-div');
            var hashtagSpan = hashtagCont.find('.hashtag-span');
            var countSpan = hashtagCont.find('.count-span');
            var subhashtagCont = tile.find('.subhashtag-div');
            var tweetCont = $('<ul>').appendTo(tile.find('.tweet-div'));
            var hitcount = This.data[i]['hitCount'];
            hitcount = hitcount > 1000 ? Math.round(hitcount / 1000) + 'k' : hitcount;

            hashtagSpan.html('#' + This.data[i]['main_hashtag']);
            countSpan.html(hitcount);

            This.refillPictures(imgCont, This.data[i]['pictures']);

            for (var j = 0; j < This.data[i]['sub_hashtags'].length; j++) {
                subhashtagCont.append($('<span>').html('#' + This.data[i]['sub_hashtags'][j]['hashtag']));
            }
            var isEven = true;
            for (var key in This.data[i]['tweets']) {
                var tweetBlock = createFullTweetBlock(This.data[i]['tweets'][key], [This.data[i]['main_hashtag']]);
                if (isEven)
                    tweetBlock.addClass('even');
                tweetCont.append(tweetBlock);
                isEven = !isEven;
            }

            tweetCont.find('li:not(.even):eq(0)').addClass('front');
            tweetCont.find('li.even:eq(0)').addClass('front');

            tweetCont.find('li:not(.front)').css('transform', 'rotateX(-180deg)');

        }
        This.randomlyAnimatePictures();
        This.addHoverCallback();
    }, function(data, message) {
        console.error('Actual data is not recieved (' + message + ')');
    });
};

Actual.prototype.refillPictures = function(imgCont, pictures) {
    var template = 'url(#site)';
    imgCont.html('');
    for (var i = 0; i < pictures.length; i++) {
        var img = $('<div>').addClass('img').css('background-image', template.replace(/#site/g, pictures[i]));
        var imgDiv = $('<div>').addClass('img-wrapper').append($('<div>').addClass('outer-img').append(img));
        imgCont.append(imgDiv);
    }


};

Actual.prototype.reset = function() {
    this.tweetCount = 0;
    this.timers = [];
    this.response = {};
};

Actual.prototype.randomlyAnimatePictures = function() {
    var This = this;
    var length = this.$('.tiles>a').length;
    this.randomArray = randomSort(length);

    this.$('.img-wrapper').css({'-webkit-transform': 'rotateX(89deg)', opacity: 0});
    var firstElems = $('.img-wrapper:first-child');
    firstElems.addClass('middle');
    this.animateContainers($('.img-wrapper:first-child'), 100);

    this.animcount = 0;
    this.animtimer = setInterval(function() {
        This.animateTiles();
    }, ANIMTIME);

};

Actual.prototype.pauseRandomAnimation = function() {
    clearInterval(this.animtimer);
};

Actual.prototype.resumeRandomAnimation = function() {
    var This = this;
    this.animtimer = setInterval(function() {
        This.animateTiles();
    }, ANIMTIME);
};

Actual.prototype.animateTiles = function() {
    if (this.animcount >= this.randomArray.length)
        this.animcount = 0;

    var parent = this.$('.tile:eq(' + this.randomArray[this.animcount] + ')');
    var childrenLength = parent.find('.img-container').children().length;
    if (childrenLength <= 1) {
        this.animcount++;
        return;
    }
    var middleElem = parent.find('.middle');
    var nextElem = middleElem.next();
    if (nextElem.length == 0) {
        nextElem = middleElem.parent().find('.img-wrapper:eq(' + 0 + ')');
    }

    nextElem.removeClass('behind').addClass('middle').css({'-webkit-transform': 'rotateX(89deg)', opacity: 0});
    middleElem.removeClass('middle').addClass('behind');


    if (middleElem.length > 0)
        var middle2behind = Morf.transition(middleElem[0], {
            '-webkit-transform': 'rotateX(-89deg)',
            opacity: 0
        }, {
            duration: '700ms',
            timingFunction: 'easeInExpo'
        });

    setTimeout(function() {
        if (nextElem.length > 0)
            var front2middle = Morf.transition(nextElem[0], {
                '-webkit-transform': 'rotateX(0deg)',
                opacity: 1
            }, {
                duration: '1500ms',
                timingFunction: 'swingTo'
            });
    }, 600);
    this.animcount++;
};


jsonObj = [
    {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "stoplyingcnn",
        "sub_hashtags":
                [
                    {"hashtag": "wearegokcek", "score": 69}
                    , {"hashtag": "sunuherkesbilsin", "score": 8}
                    , {"hashtag": "stoplyingbbc", "score": 8}
                    , {"hashtag": "lafiburdan1koyuyorum", "score": 6}
                    , {"hashtag": "genclertakiplesiyor", "score": 6}
                    , {"hashtag": "aslindasadece", "score": 6}
                    , {"hashtag": "justshutupmelihgokcek", "score": 5}
                    , {"hashtag": "wearegoekcek", "score": 4}
                    , {"hashtag": "oryantalkirca", "score": 4}
                    , {"hashtag": "adaletdemek", "score": 4}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 39598
                , "size": 9, "pictures": [
            "http://pbs.twimg.com/media/BNpMqoXCEAEQPSQ.jpg"
                    , "http://pbs.twimg.com/media/BLtJh0ZCEAEq_D-.jpg"
                    , "http://pbs.twimg.com/media/BNoTVALCYAAXutg.jpg"
                    , "http://pbs.twimg.com/media/BNo1tTQCAAEF6Wl.jpg"
                    , "http://pbs.twimg.com/media/BNogtsUCcAAhUye.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "sonkuzeyguneyaksami",
        "sub_hashtags":
                [
                    {"hashtag": "kiymetlimizcagatayulusoy", "score": 16}
                    , {"hashtag": "wimbledon", "score": 14}
                    , {"hashtag": "kuzeyguneyveda", "score": 4}
                    , {"hashtag": "kuzeyvecemre", "score": 3}
                    , {"hashtag": "kanald", "score": 3}
                    , {"hashtag": "cirkinvesari", "score": 3}
                    , {"hashtag": "2sezonunsonundagelenmutluluk", "score": 3}
                    , {"hashtag": "shoutout", "score": 2}
                    , {"hashtag": "nerdesincanimatam", "score": 2}
                    , {"hashtag": "kuzeyguney", "score": 2}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 35561
                , "size": 4, "pictures": [
            "http://pbs.twimg.com/media/BNtgWJ5CAAE50A-.jpg"
                    , "http://pbs.twimg.com/media/BNthafMCUAAR2lG.png"
                    , "http://pbs.twimg.com/media/BNthAALCQAEZS9-.png"
                    , "http://pbs.twimg.com/media/BNtlURZCIAAcz_n.jpg"
                    , "http://pbs.twimg.com/media/BNtqJzjCcAEvDp-.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "tumhayrangruplaritakiplessin",
        "sub_hashtags":
                [
                    {"hashtag": "fav", "score": 39}
                    , {"hashtag": "sozbidaha", "score": 14}
                    , {"hashtag": "guleoynayatakipleselim", "score": 10}
                    , {"hashtag": "genclertakiplesiyor", "score": 6}
                    , {"hashtag": "smiler", "score": 3}
                    , {"hashtag": "selenator", "score": 3}
                    , {"hashtag": "lovatic", "score": 3}
                    , {"hashtag": "gumburgumburtakipleselim", "score": 3}
                    , {"hashtag": "tumhayranlarcilgincatakiplesiyor", "score": 2}
                    , {"hashtag": "shoutout", "score": 2}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 34444
                , "size": 4, "pictures": [
            "http://pbs.twimg.com/media/BNsgbK7CIAQZc9C.jpg"
                    , "http://pbs.twimg.com/media/BNsN5K6CcAAecLJ.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "direnmuezzin",
        "sub_hashtags":
                [
                    {"hashtag": "direnbeyin", "score": 55}
                    , {"hashtag": "dayanimamefendi", "score": 5}
                    , {"hashtag": "muezzinifuatyildirim", "score": 4}
                    , {"hashtag": "boyunegmemuezzin", "score": 2}
                    , {"hashtag": "provokatoertayyip", "score": 1}
                    , {"hashtag": "ileridemokrasi", "score": 1}
                    , {"hashtag": "direnturkiye", "score": 1}
                    , {"hashtag": "direnimam", "score": 1}
                    , {"hashtag": "direngezi", "score": 1}
                    , {"hashtag": "akpdinine", "score": 1}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 28468
                , "size": 4, "pictures": [
            "http://pbs.twimg.com/media/BNsgbK7CIAQZc9C.jpg"
                    , "http://pbs.twimg.com/media/BNsN5K6CcAAecLJ.jpg"
                    , "http://pbs.twimg.com/media/BNXVY5HCIAAzzCU.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "birazgulmekicin",
        "sub_hashtags":
                [
                    {"hashtag": "yeterartiklutfen", "score": 59}
                    , {"hashtag": "bilmembiliyormusun", "score": 56}
                    , {"hashtag": "adaletdemek", "score": 33}
                    , {"hashtag": "banagore_evlilik", "score": 11}
                    , {"hashtag": "yedirtmeyiz", "score": 5}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 25881
                , "size": 4, "pictures": [
            "http://pbs.twimg.com/media/BNsknz8CQAICquv.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "doksanlar",
        "sub_hashtags":
                [
                    {"hashtag": "90lar", "score": 92}
                    , {"hashtag": "seksenler", "score": 14}
                    , {"hashtag": "nerdesincanimatam", "score": 6}
                    , {"hashtag": "kiymetlimizcagatayulusoy", "score": 1}
                    , {"hashtag": "ikibinler", "score": 1}
                    , {"hashtag": "atv", "score": 1}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 25713
                , "size": 4, "pictures": [
            "http://pbs.twimg.com/media/BNs-FEzCEAAaVn3.jpg"
                    , "http://pbs.twimg.com/media/BNtSGoZCMAILgV-.jpg"
                    , "http://pbs.twimg.com/media/BNtF_rPCMAEAKXb.jpg"
                    , "http://pbs.twimg.com/media/BNtBwa2CUAAe-rf.jpg"
                    , "http://pbs.twimg.com/media/BNs8bhICIAEmoVZ.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "bizakpartiliyiz",
        "sub_hashtags":
                [
                    {"hashtag": "boykot_facebook", "score": 12}
                    , {"hashtag": "taksim", "score": 6}
                    , {"hashtag": "shoutout", "score": 6}
                    , {"hashtag": "kiymetlimizcagatayulusoy", "score": 4}
                    , {"hashtag": "tfb", "score": 2}
                    , {"hashtag": "geziparki", "score": 2}
                    , {"hashtag": "dindargenclikseninlerte", "score": 2}
                    , {"hashtag": "bizgotununkiliyik", "score": 2}
                    , {"hashtag": "takiplesiyoruz", "score": 1}
                    , {"hashtag": "sonkuzeyguneyaksami", "score": 1}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 25641
                , "size": 4, "pictures": [
            "http://pbs.twimg.com/media/BNsyWdBCAAAqvnV.png"
                    , "http://pbs.twimg.com/media/BNsWcbOCcAEYeCZ.jpg"
                    , "http://pbs.twimg.com/media/BL6pjaJCYAA2CxN.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "boykot_facebook",
        "sub_hashtags":
                [
                    {"hashtag": "busiralarruhhalim", "score": 53}
                    , {"hashtag": "okadarsicakki", "score": 42}
                    , {"hashtag": "bizakpartiliyiz", "score": 6}
                    , {"hashtag": "tfb", "score": 1}
                    , {"hashtag": "boykotbasliyor", "score": 1}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 22237
                , "size": 1, "pictures": [
            "http://pbs.twimg.com/media/BNspo3BCQAALNlW.jpg"
                    , "http://pbs.twimg.com/media/BNsQXXuCIAIL9kw.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "kiymetlimizcagatayulusoy",
        "sub_hashtags":
                [
                    {"hashtag": "sonkuzeyguneyaksami", "score": 9}
                    , {"hashtag": "shoutout", "score": 4}
                    , {"hashtag": "bizakpartiliyiz", "score": 3}
                ]
                ,
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 20575
                , "size": 1, "pictures": [
            "http://pbs.twimg.com/media/BNs4CDfCEAAsvOd.jpg"
        ]
    }, {
        "start_date": "2013/06/26", "finish_date": "2013/06/27",
        "main_hashtag": "adaletdemek",
        "sub_hashtags":
                [
                    {"hashtag": "yeterartiklutfen", "score": 74}
                    , {"hashtag": "bilmembiliyormusun", "score": 45}
                    , {"hashtag": "birazgulmekicin", "score": 32}
                    , {"hashtag": "direndikmen", "score": 16}
                    , {"hashtag": "lafiburdan1koyuyorum", "score": 3}
                    , {"hashtag": "shoutout", "score": 2}
                ],
        "tweets": {"351653178774802432": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "22894318", "userName": "ahmetyaza", "tweetTime": "2013-07-01T13:47:05.000+03:00", "fullName": "Ahmet Yazar"}, "351653187549274115": {"tweetText": "Hemen simdi sandiga ihtiyaci var bu ulkenin diyorsan imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:07.000+03:00", "fullName": "Murat Taşdemir"}, "351653283980509184": {"tweetText": "D.E. devam ediyor:\u0027Kasklari yokken yuzleri vardi,konusuyorlardi.Cok sarsildim\u0027 Yeni yazi:Siddeti gordum http://t.co/E8v4CQoUF1 #direnankara", "userId": "95873084", "userName": "emavioglu", "tweetTime": "2013-07-01T13:47:30.000+03:00", "fullName": "Ertugrul Mavioglu"}, "351653308550742016": {"tweetText": "Sana biber kullanma demedik, salca olarak yine kullan #direngezi #direnankara #direnmezun #TurkeyWithTahrir http://t.co/NoNxzAHvcG", "userId": "1479654662", "userName": "AntiTeyyipAkp", "tweetTime": "2013-07-01T13:47:36.000+03:00", "fullName": "ozgur"}, "351653383624597504": {"tweetText": "Bu haliyle TBMM seni temsil etmiyorsa eger imzala... http://t.co/tIRRu5hZHK … #direnankara #direngeziparki", "userId": "242899484", "userName": "muratasdemir", "tweetTime": "2013-07-01T13:47:54.000+03:00", "fullName": "Murat Taşdemir"}, "351653395435761664": {"tweetText": "My heart is with Turkish people who are defending their rights #occupygezi #direngeziparki #taksim #direnankara", "userId": "393848254", "userName": "ilker_gokal", "tweetTime": "2013-07-01T13:47:57.000+03:00", "fullName": "ilker gökal"}, "351653429116018688": {"tweetText": "#direngeziparki #occupygezi #memetalialaborayanindayiz http://t.co/BL0A9GJsRo", "userId": "515496836", "userName": "cansukirdi", "tweetTime": "2013-07-01T13:48:05.000+03:00", "fullName": "Cansu Kırdı"}, "351653540210552832": {"tweetText": "Tayyip\u0027in caresizligi... #DirenLice #DirenGeziParki #OccupyGezi #DirenAmed #DirenAnkara #DirenGezi http://t.co/fXGijuO3Eh", "userId": "258122352", "userName": "belgincr", "tweetTime": "2013-07-01T13:48:32.000+03:00", "fullName": "Belgin Acar"}},
        "hitCount": 19923,
        "size": 1,
        "pictures": [
            "http://pbs.twimg.com/media/BNqaIxaCcAAQfnu.jpg"
                    , "http://pbs.twimg.com/media/BNsGWf4CIAEyIOD.jpg"
                    , "http://pbs.twimg.com/media/BNraSwjCMAAmMR1.gif"
                    , "http://pbs.twimg.com/media/BNrBeCOCIAERL82.jpg"
                    , "http://pbs.twimg.com/media/BNqo-TmCIAAgEkP.jpg"
        ]
    }
]