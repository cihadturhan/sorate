Settings = function(container) {
    this.response = {};
    this.tweetList = {};
    this.newAddedKeys = [];
    this.currentTweetKey = "";
    this.container = container;
    this.chart = null;
    this.timers = [];
    this.processing = false;
    this.ready = false;
    this.dataQuery = {    };
    this.xhrPool = [];
};

Settings.prototype.initialize = function() {
    
};

Settings.prototype.destroy = function(){
    
};

Settings.prototype.stop = function() {
    
};

Settings.prototype.resume = function() {
    
};

Settings.prototype.reset = function() {
    this.tweetCount = 0;
    this.timers = [];
    this.response = {};
};

