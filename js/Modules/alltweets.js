Alltweets = function(container) {
    this.response = {};
    this.container = container;
    this.timers = [];
    this.ready = false;
    this.xhrPool = [];
    this.tweetList = {};
    this.xlsdata = {};
    this.avgtime = 0;
    //this.chart = null;
    //this.processing = false;
};

Alltweets.prototype.initialize = function(callback) {
    var This = this;
    $().ready(function() {
        //This.downloadKeylist();
        This.prepareDOM();
        This.ready = true;
        if(callback)
            callback();
    });
};

Alltweets.prototype.prepareDOM = function() {
    var This = this;
    this.container.on('scroll', function() {
        if ((This.container.innerHeight() + $(this).scrollTop()) >= This.$('.alltweets').outerHeight() - 50) {
            This.pushRecursively();
        }
    });

    this.$('input[type=submit]').click(function() {
        This.requestData();

        This.$('.general_tweet_container .buttons .numOfTweetContainer').hide();
        This.$('.general_tweet_container .buttons .icon-spinner').show();
        This.$('.general_tweet_container .export_container').hide();
        This.$('.general_tweet_container ul').html('');

    });

    this.$('textarea.input').jStepper({minValue: 0});
    this.$('textarea.input').keydown(function(event) {
        if (event.which === 13) {
            this.$('input[type=submit]').click();
            return false;
        }
    });

};

Alltweets.prototype.requestData = function() {
    var This = this;

    var inputDiv = this.$('.input');
    var sentence = inputDiv.val();
    if (sentence === '') {
        inputDiv.stop().transition({'border-color': SBTRED, duration: 300}).transition({'border-color': '', duration: 1000});
        return;
    }

    this.myGet("data_manager.php",
            {mod: 'first', sentence: sentence},
    function(data) {
        This.generateXLSData(data);
        This.tweetList = data;
        This.$('.general_tweet_container .buttons .icon-spinner').hide();
        This.$('.general_tweet_container .buttons .numOfTweets').html(Object.keys(data).length);
        This.$('.general_tweet_container .buttons .numOfTweetContainer').show();
        This.$('.general_tweet_container .export_container').show();
        var maxTime = 100;
        var minTime = 5;
        var keys = Object.keys(data);
        This.avgtime = parseInt(600 / keys.length);
        This.avgtime = Math.min(This.avgtime, maxTime);
        This.avgtime = Math.max(This.avgtime, minTime);

        This.pushRecursively();
    }, function() {
        console.log('error');
    });


    this.$('.export_container button').click(function() {
        This.xlsdata.filetype = $(this).attr('class');
        $.post('phpexcel/print_excel.php', {data: JSON.stringify(This.xlsdata)}, function(url) {
            if (url) {
                var hiddenIframeClass = "hiddenDownloader", iframe = This.$('.'+hiddenIframeClass);
                if (iframe.length === 0) {
                    iframe = $('<iframe>').addClass(hiddenIframeClass).css({'display': 'none'}).appendTo(This.container);
                }
                iframe.attr('src',url);
            } else {
                alert('Something went wrong');
            }
        }, 'text');
    });
};

Alltweets.prototype.destroy = function() {
    this.stop();
    this.reset();
};


Alltweets.prototype.start = function() {
    //this.updateGroupList();
};



Alltweets.prototype.stop = function(remove) {
    //this.stopTimer(SECONDS);
    this.abortRequests();
};

Alltweets.prototype.reset = function(remove) {
};

Alltweets.prototype.resume = function() {
    if (this.ready) {
        //this.updateGroupList();
    }
};



Alltweets.prototype.abortRequests = function() {
    for (var i = 0; i < this.xhrPool.length; i++) {
        this.xhrPool[i].abort();
    };
    this.xhrPool.length = 0;
};

Alltweets.prototype.stopTimer = Common.prototype.stopTimer;
Alltweets.prototype.$ = Common.prototype.$;
Alltweets.prototype.animateContainers = Common.prototype.animateContainers;
Alltweets.prototype.myGet = Common.prototype.myGet;

Alltweets.prototype.pushRecursively = function() {
    var This = this;
    this.time = this.avgtime;
    var end = Math.min(Object.keys(this.tweetList).length, 50);
    if (end === 0) {
        return false;
    }

    if (this.time < 10) {
        for (var i = 0; i < end; i++) {
            This.selectAndPush(this.time);
        }
    } else {
        var i = 0;
        var timer = setInterval(function() {
            if (i >= end) {
                clearInterval(timer);
                return;
            }
            This.selectAndPush(this.time);
            i++;
        }, this.time);
    }
};

Alltweets.prototype.selectAndPush = function(time) {
    var keys = Object.keys(this.tweetList);
    var key = keys.sort()[0];
    var data = this.tweetList[key];
    data.tweetId = key;

    this.pushBack(data, time);
    delete this.tweetList[key];
};


Alltweets.prototype.pushFront = function(data, time) {
    var sentence = [this.$('.input').val()];
    var newTweet = createFullTweetBlock(data, JSON.stringify(sentence), 'DD MMMM HH:mm');
    var tweetContainer = this.$('.general_tweet_container ul');
    var lastTweet = tweetContainer.find('li:first');

    if (!lastTweet.hasClass('even'))
        newTweet.addClass('even');
    tweetContainer.prepend(newTweet);
    if (time < 10) {
        newTweet.css({opacity: 1, height: "80px"});
        return;
    }
    newTweet.css({opacity: 0}).transition({opacity: 1, height: "80px", duration: time ? time : 250});
};

Alltweets.prototype.pushBack = function(data, time) {
    var sentence = [this.$('.input').val()];
    var newTweet = createFullTweetBlock(data, JSON.stringify(sentence), 'DD MMMM HH:mm');
    var tweetContainer = this.$('.general_tweet_container ul');
    var lastTweet = tweetContainer.find('li:last');

    if (!lastTweet.hasClass('even'))
        newTweet.addClass('even');
    tweetContainer.append(newTweet);
    if (time < 10) {
        newTweet.css({opacity: 1, height: "80px"});
        return;
    }
    newTweet.css({opacity: 0}).transition({opacity: 1, height: "80px", duration: time ? time : 250});
};


Alltweets.prototype.generateXLSData = function(data) {
    var first = data[Object.keys(data)[0]];
    this.xlsdata = {
        file_name: verify(first.userName),
        filetype: 'xlsx',
        data: {
            title: [
                ['Kullanıcı ID', 'Tam İsim', 'Profil İsmi', 'Rapor Tarihi'],
                [first.userId, verify(first.fullName), verify(first.userName), current().format('LLL')]
            ],
            header: ['Sıra', ' Tarih', 'Tweet'],
            rows: []
        }
    };
    var count = 1;
    for (var key in data) {
        var elem = data[key];
        this.xlsdata.data.rows.push([count, moment(elem.tweetTime).format('LLL'), elem.tweetText]);
        count++;
    }
};

verify = function(val) {
    return(val ? val : 'protected user');
};