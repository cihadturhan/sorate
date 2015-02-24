ModuleName = function(container) {
    this.response = {};
    this.container = container;
    this.timers = [];
    this.ready = false;
    this.xhrPool = [];
    //this.chart = null;
    //this.processing = false;
};

ModuleName.prototype.stopTimer = Common.prototype.stopTimer;
ModuleName.prototype.$ = Common.prototype.$;
ModuleName.prototype.animateContainers = Common.prototype.animateContainers;
ModuleName.prototype.myGet = Common.prototype.myGet;

ModuleName.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        //This.downloadKeylist();
        This.prepareDOM();
        This.ready = true;
    });
};

ModuleName.prototype.destroy = function() {
    this.stop();
    this.reset();
};
ModuleName.prototype.prepareDOM = function() {

};


ModuleName.prototype.start = function() {
    //this.updateGroupList();
};



ModuleName.prototype.stop = function(remove) {
    //this.stopTimer(SECONDS);
    this.abortRequests();
};

ModuleName.prototype.reset = function(remove) {

};

ModuleName.prototype.resume = function() {
    if (this.ready) {
        //this.updateGroupList();
    }
};



ModuleName.prototype.abortRequests = function() {
    for (var i = 0; i < this.xhrPool.length; i++) {
        this.xhrPool[i].abort();
    }
    ;
    this.xhrPool.length = 0;
};
