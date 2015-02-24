Quickgrid = function(container) {
    this.response = {};
    this.container = container;
    this.timers = [];
    this.ready = false;
    this.xhrPool = [];
    this.rawQueryData = {};
    this.queryData = {};
};

Quickgrid.prototype.stopTimer = Common.prototype.stopTimer;
Quickgrid.prototype.$ = Common.prototype.$;
Quickgrid.prototype.animateContainers = Common.prototype.animateContainers;
Quickgrid.prototype.myGet = Common.prototype.myGet;
Quickgrid.prototype.datetimeIntervalPicker = Common.prototype.datetimeIntervalPicker;

Quickgrid.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        //This.downloadKeylist();
        This.prepareDOM();
        This.ready = true;
    });
};

Quickgrid.prototype.prepareDOM = function(){
    
};

Quickgrid.prototype.destroy = function() {
    this.stop();
    this.reset();
};


Quickgrid.prototype.start = function() {
    //this.updateGroupList();
};

Quickgrid.prototype.stop = function(remove) {
    //this.stopTimer(SECONDS);
    this.abortRequests();
};

Quickgrid.prototype.reset = function(remove) {
   
};

Quickgrid.prototype.resume = function() {
    if (this.ready) {
        //this.updateGroupList();
    }
};

Quickgrid.prototype.abortRequests = function() {
    for (var i = 0; i < this.xhrPool.length; i++) {
        this.xhrPool[i].abort();
    };
    this.xhrPool.length = 0;
};
