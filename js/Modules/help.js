Help = function(container) {
    this.response = {};
    this.container = container;
    this.timers = [];
    this.ready = false;
    this.xhrPool = [];
    //this.chart = null;
    //this.processing = false;
};

Help.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        //This.downloadKeylist();
        This.ready = true;
    });
};

Help.prototype.destroy = function() {
    this.stop();
    this.reset();
};


Help.prototype.start = function() {
    //this.updateGroupList();
};



Help.prototype.stop = function(remove) {
    //this.stopTimer(SECONDS);
    this.abortRequests();
};

Help.prototype.reset = function(remove) {
   
};

Help.prototype.resume = function() {
    if (this.ready) {
        //this.updateGroupList();
    }
};



Help.prototype.abortRequests = function() {
    for (var i = 0; i < this.xhrPool.length; i++) {
        this.xhrPool[i].abort();
    };
    this.xhrPool.length = 0;
};
