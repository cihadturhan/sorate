IMG_DIR = 'img/';
JS_DIR = 'js/Modules/';
CSS_DIR = 'css/';
HTML_DIR = '';

var OPEN = 0,
        CLOSE = 1,
        PAUSE = 2,
        RESET = 3,
        UNPAUSE = 4;



ModuleList = function(opts) {
    $.extend(this, {
        name: '',
        className: '',
        displayName: '',
        modules: [],
        maxTabs: 5,
        totalCount: -1,
        moduleCount: -1,
        thumbnailImg: '',
        $obj: null,
        functions: [],
        jsFiles: [],
        cssFiles: [],
        htmlFile: '',
        JSLoaded: false,
        CSSLoaded: false,
        htmlContent: '',
        cache: false
    }, opts);
    this.cssFiles.push(CSS_DIR + this.name + '.css');
    this.jsFiles.push(JS_DIR + this.name + '.js');
    this.htmlFile = this.name + '.html' + '?' + Math.random();

    return this;
}
;

ModuleList.prototype.loadCSS = function(f, l) {
    if (this.CSSLoaded) {
        l.css('transform', 'translateX(-60%)');
        this.loadJS(f, l);
        return;
    }

    var This = this;
    this.removeLoadedCSSs();
    var cssList = (this.cache) ? this.cssFiles : addSuffixIfNeeded(this.cssFiles);
    if (cssList.length === 0) {
        l.css('transform', 'translateX(-60%)');
        This.loadJS(f, l);
        This.CSSLoaded = true;
        return;
    }

    LazyLoad.css(cssList, function() {
        l.css('transform', 'translateX(-60%)');
        This.loadJS(f, l);
        This.CSSLoaded = true;
    });

};

ModuleList.prototype.loadJS = function(f, l) {
    var This = this;
    if (this.JSLoaded) {
        l.css('transform', 'translateX(-20%)');
        This.loadHTML(f, l);
        return;
    }

    this.removeLoadedJSs();
    var jsList = (this.cache) ? this.jsFiles : addSuffixIfNeeded(this.jsFiles);

    if (jsList.length == 0) {
        l.css('transform', 'translateX(-20%)');
        This.loadHTML(f, l);
        This.JSLoaded = true;
        return;
    }

    LazyLoad.js(jsList, function() {
        l.css('transform', 'translateX(-20%)');
        This.loadHTML(f, l);
        This.JSLoaded = true;
    });
};

ModuleList.prototype.loadHTML = function(f, l) {
    var This = this;
    if (this.HTMLLoaded) {
        l.css('transform', 'translateX(0%)');
        f();
        return;
    }

    $.get(HTML_DIR + this.name + '.php?' + Math.random(), function(data) {
        This.htmlContent = data;
        This.HTMLLoaded = true;
        l.css('transform', 'translateX(0%)');
        f();
    }, 'text');
};

ModuleList.prototype.removeLoadedCSSs = function() {
    for (var i = 0; i < allModuleList.length; i++) {
        var currML = allModuleList[i];
        if (this === currML || !currML.CSSLoaded)
            continue;
        for (var j = 0; j < currML.cssFiles.length; j++) {
            var currCss = currML.cssFiles[j];
            var index = this.cssFiles.indexOf(currCss);
            if (index !== -1) {
                this.cssFiles.splice(index, 1);
            }
        }
    }
};


ModuleList.prototype.removeLoadedJSs = function() {
    for (var i = 0; i < allModuleList.length; i++) {
        var currML = allModuleList[i];
        if (this === currML || !currML.JSLoaded)
            continue;
        for (var j = 0; j < currML.jsFiles.length; j++) {
            var currCss = currML.jsFiles[j];
            var index = this.jsFiles.indexOf(currCss);
            if (index !== -1) {
                this.jsFiles.splice(index, 1);
            }
        }
    }
};


ModuleList.prototype.add = function(module) {
    if (this.moduleCount > -1) {
        this.modules.validLast().next = module;
    }
    module.parent = this;
    module.id = ++this.totalCount;
    this.moduleCount++;
    this.modules[this.totalCount] = module;
};

ModuleList.prototype.remove = function(module) {
    if (module.prev)
        module.prev.next = module.next;
    if (module.next)
        module.next.prev = module.prev;


    this.modules.removeElement(module, false);
    this.moduleCount--;
    this.setModuleNum();
    if (countTotalModules() === 1) {
        $('aside ul #Panel').click();
    }
};

ModuleList.prototype.setModuleNum = function() {
    var count = 1;
    for (var i = 0; i < this.modules.length; i++) {
        if (this.modules[i]) {
            this.modules[i].setHeadingNo(count++);
        }
    }

};

ModuleList.prototype.initialize = function() {
    if (this.thumbnailImg && ModuleList.$parentObj) {
        this.$obj = $('<li> </li>').append($('<button>')).append($('<span>').html(this.displayName)).attr('id', this.displayName);
        this.$obj.appendTo(ModuleList.$parentObj).find('button').css({'background-image': "url('" + IMG_DIR + this.thumbnailImg + "')"});
        var This = this;
        if (this.disabled) {
            this.$obj.addClass('disabled');
        } else {
            this.$obj.click(function() {
                This.onclickEvent();
            });
        }
    }
    allModuleList.push(this);
};

ModuleList.prototype.createModule = function() {
    return new Module({
        id: this.moduleCount,
        onOpened: null,
        onClosed: null
    });
};

ModuleList.prototype.onclickEvent = function() {
    if (this.moduleCount < this.maxTabs - 1) {
        var module = this.createModule();
        this.add(module);
        module.initialize();
    }
    $('aside ul li.selected').click();
};

// Module Class
// - Create Module
// - Add it to a parent
// - Initialize

function Module(opts) {
    $.extend(this, {
        moduleId: 0,
        onOpened: null,
        onClosed: null,
        timerList: [],
        parent: null,
        $obj: null,
        prev: null,
        next: null,
        pauseFlag: false,
        obj: null,
        id: 0
    }, opts);
    return this;
}
;

Module.prototype.initialize = function() {
    var This = this,
            label = '<img src=" ' + IMG_DIR + this.parent.thumbnailImg + ' "></img>',
            headerId = this.parent.name + "-" + this.id,
            id = "tabs-" + this.parent.name + '-' + this.id,
            color = this.parent.$obj.css('border-left-color'),
            li = $(tabTemplate
                    .replace(/#\{id\}/g, headerId)
                    .replace(/#\{label\}/g, label)
                    .replace(/#\{href\}/g, '#' + id)
                    .replace(/#\{no\}/g, '#' + (this.parent.moduleCount + 1))
                    ).css('border-top', '4px solid transparent');
    li.append(tabLoadingTemplate);
    li.find('.before, .progress-bar span').css('background-color', color);
    var container = $("<div id='" + id + "'></div>");

    tabs.find(".ui-tabs-nav").append(li);
    tabs.append(container);
    this.$obj = li;

    var loading = li.find('.progress-bar span');

    li.children('span.ui-icon-close').click(function() {
        var panelId = $(this).closest("li").remove().attr("aria-controls");
        This.close(panelId);
    });
    tabs.tabs("refresh");
    lock();
    this.parent.loadCSS(function() {
        container.html(This.parent.htmlContent);
        This.obj = new window[This.parent.className](container);
        This.obj.name = This.parent.name;
        li.children('a').click();
        This.obj.initialize();
        setTimeout(function() {
            li.css('border-top', '4px solid ' + color);
            li.find('.progress-container').remove();
            unlock();
        }, 200);
    }, loading);
};

Module.prototype.setHeadingNo = function(num) {
    var span = this.$obj.find('a span');
    span.html('#' + num);
};


Module.prototype.close = function(panelId) {
    this.obj.destroy();
    delete this.obj;
    this.obj = null;
    $("#" + panelId).remove();
    tabs.tabs("refresh");
    this.parent.remove(this);
};

Module.prototype.start = function() {
    if (this.obj)
        this.obj.start();
};

Module.prototype.stop = function() {
    this.obj.stop();
    this.obj.reset();
};

Module.prototype.resume = function() {
    $(window).resize();
    subModule.parentModule = this.obj;
    this.obj.resume();
};

