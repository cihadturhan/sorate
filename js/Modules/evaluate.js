Evaluate = function(container) {
    this.response = {};
    this.container = container;
    this.timers = [];
    this.ready = false;
    this.xhrPool = [];
    this.tweetQueryData = {};
    //this.chart = null;
    //this.processing = false;
};

Evaluate.prototype.stopTimer = Common.prototype.stopTimer;
Evaluate.prototype.$ = Common.prototype.$;
Evaluate.prototype.animateContainers = Common.prototype.animateContainers;
Evaluate.prototype.myGet = Common.prototype.myGet;
Evaluate.prototype.pushRecursively = Common.prototype.pushRecursively;
Evaluate.prototype.pushBackRecursively = Common.prototype.pushBackRecursively;
Evaluate.prototype.pushFront = Common.prototype.pushFront;
Evaluate.prototype.pushBack = Common.prototype.pushBack;
Evaluate.prototype.popFront = Common.prototype.popFront;
Evaluate.prototype.popBack = Common.prototype.popBack;

Evaluate.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        //This.downloadKeylist();
        This.prepareDOM();
        This.ready = true;
    });
};

Evaluate.prototype.destroy = function() {
    this.stop();
    this.reset();
};

Evaluate.prototype.prepareDOM = function() {
    var This = this;
    this.addListeners();

    this.tweetQueryData.keylist = {test: ['a']};
    this.tweetList = sampleTweetData;
    this.notEval = this.$('.general_tweet_container.notevaluated>ul');
    this.pos = this.$('.general_tweet_container.positive>ul');
    this.neg = this.$('.general_tweet_container.negative>ul');
    this.notr = this.$('.general_tweet_container.notr>ul');

    this.pushBackRecursively(30, this.notEval, function() {
        This.$("li", This.notEval).draggable({
            cancel: "a.ui-icon", // clicking an icon won't initiate dragging
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
        });




        This.pos.droppable({
            accept: This.notEval.find('li'),
            activeClass: "dropping",
            drop: function(event, ui) {
                assignPositive(ui.draggable);
            }
        });

        This.neg.droppable({
            accept: This.notEval.find('li'),
            activeClass: "dropping",
            drop: function(event, ui) {
                assignNegative(ui.draggable);
            }
        });

        This.notr.droppable({
            accept: This.notEval.find('li'),
            activeClass: "dropping",
            drop: function(event, ui) {
                assignNotr(ui.draggable);
            }
        });

        This.setActive();

    });



    function assignPositive($item) {
        $item.fadeOut(function() {
            var $list = This.pos;
            $item.prependTo($list).fadeIn(function() {
            });
            This.setActive();
        });

    }

    function assignNotr($item) {
        $item.fadeOut(function() {
            var $list = This.notr;
            $item.prependTo($list).fadeIn(function() {
            });
            This.setActive();
        });
    }

    function assignNegative($item) {
        $item.fadeOut(function() {
            var $list = This.neg;
            $item.prependTo($list).fadeIn(function() {

            });
            This.setActive();
        });
    }


};

Evaluate.prototype.addListeners = function() {
    var This = this;
    this.container.on('keydown', function(e) {
        var target;
        switch (e.keyCode) {
            case 40: //down
                target = This.notr;
                break;
            case 37: //left
                target = This.neg;
                break;
            case 39: //right
                target = This.pos;
                break;
            default:
                return;
        }
        This.notEval.find('li.active').prependTo(target);
        This.setActive();
        return false;
    });
};


Evaluate.prototype.setActive = function() {
    this.$('.general_tweet_container>ul li.active').removeClass('active');
    this.$('.general_tweet_container.notevaluated>ul li:last-child').addClass('active');
};


Evaluate.prototype.start = function() {
    //this.updateGroupList();
};



Evaluate.prototype.stop = function(remove) {
    //this.stopTimer(SECONDS);
    this.abortRequests();
};

Evaluate.prototype.reset = function(remove) {

};

Evaluate.prototype.resume = function() {
    if (this.ready) {
        //this.updateGroupList();
    }
};



Evaluate.prototype.abortRequests = function() {
    for (var i = 0; i < this.xhrPool.length; i++) {
        this.xhrPool[i].abort();
    }
    ;
    this.xhrPool.length = 0;
};