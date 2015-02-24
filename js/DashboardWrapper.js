//Clone ModuleList...

DashboardWrapper = function(args) {
    //inherit properties
    ModuleList.call(this, args);
};

//inherit methods
DashboardWrapper.prototype = new ModuleList();

//Change prototypes
DashboardWrapper.prototype.createModule = function() {
    return new DashboardModule({
        id: this.moduleCount,
        onOpened: null,
        onClosed: null
    });
};

DashboardWrapper.prototype.onclickEvent = function() {
    var dm = dashboard.modules[0], am = getActiveModule();

    if (this.$obj.hasClass('selected')) {
        //check if there is a module
        dm && dm.stop();
        if (countTotalModules() > 1) {
            am && am.resume();
            this.$obj.removeClass('selected');
            $('#dashboard').css('z-index', '').transition({scale: 0.8, duration: 400, easing: 'cubic-bezier(1,0,0,1)'}, function() {
                $(this).hide();
            });
            $('#dashboard .shadow').show().transition({opacity: 0.05, duration: 400, easing: 'cubic-bezier(1,0,0,1)'});

            $('#main').stop().transition({x: '0%', duration: 400, easing: 'cubic-bezier(1,0,0,1)'}, function() {
                $(this).css('-webkit-transform', 'none');
            });
        }
    } else {

        dm && dm.resume();
        am && am.stop();
        this.$obj.addClass('selected');
        $('#dashboard').show().transition({scale: 1, duration: 400, easing: 'cubic-bezier(1,0,0,1)'});
        $(window).resize();
        $('#dashboard .shadow').transition({opacity: 0, duration: 400, easing: 'cubic-bezier(1,0,0,1)'}, function() {
            $(this).hide();
        });
        $('#main').stop().transition({x: '100%', duration: 400, easing: 'cubic-bezier(1,0,0,1)'}, function() {
            $('#dashboard').css('z-index', 2);
        });
    }

    if (this.moduleCount < this.maxTabs - 1) {
        var module = this.createModule();
        this.add(module);
        module.initialize();
    }
};

countTotalModules = function() {
    var count = 0;
    for (var i = 0; i < allModuleList.length; i++) {
        count += allModuleList[i].moduleCount + 1;
    }
    return count;
};





DashboardModule = function(args) {
    //inherit properties
    Module.call(this, args);
};

DashboardModule.prototype = new Module();

DashboardModule.prototype.initialize = function() {
    var This = this;
    var container = $("#dashboard");


    this.parent.loadCSS(function() {
        container.html(This.parent.htmlContent);
        This.obj = new window[This.parent.className](container);
        This.obj.name = This.parent.name;
        This.obj.initialize();
        setTimeout(function() {
            unlock();
        });
    }, $('<div>'));
};