
// Global Variables
var delimeter = ',',
        heatmapOptions =
        {
            radius: 10,
            opacity: 0.75,
            gradient: {
                "0.20": "rgb(0,0,255)",
                "0.40": "rgb(0,255,255)",
                "0.60": "rgb(0,255,0)",
                "0.75": "rgb(255,255,0)",
                "1.0": "rgb(255,0,0)"
            }
        };

Geotweet = function(container) {
    this.response = {};
    this.tweetList = {};
    this.newAddedKeys = [];
    this.currentTweetKey = "";
    this.container = container;
    this.chart = null;
    this.timers = [];
    this.processing = false;
    this.ready = false;
    this.dataQuery = {};
    this.xhrPool = [];

    this.map = null;
    this.markerList = [];
    this.cluster = [];

    this.clusterLayer = 0;

    this.numClusters = 20;
    this.grid = null;
    this.heatmapLayer = null;
    this.googlelayer = null;
    this.renderMode = 'cluster';

    this.currentKeylist = {};
    this.id = "";
    this.idChanged = true;
    this.queuedRequest = null;
};

Geotweet.prototype.animateContainers = Common.prototype.animateContainers;
Geotweet.prototype.$ = Common.prototype.$;
Geotweet.prototype.myGet = Common.prototype.myGet;
Geotweet.prototype.stopTimer = Common.prototype.stopTimer;

Geotweet.prototype.pushBack = Common.prototype.pushBack;
Geotweet.prototype.pushFront = Common.prototype.pushFront;
Geotweet.prototype.popBack = Common.prototype.popBack;
Geotweet.prototype.popFront = Common.prototype.popFront;
Geotweet.prototype.pushRecursively = Common.prototype.pushRecursively;

Geotweet.prototype.addKeyGroupListeners = Common.prototype.addKeyGroupListeners;
Geotweet.prototype.addDayListener = Common.prototype.addDayListener;

Geotweet.prototype.loadKeygroup = Common.prototype.loadKeyGroup;
Geotweet.prototype.resetKeygroup = Common.prototype.resetKeyGroup;
Geotweet.prototype.updateGroupList = Common.prototype.updateGroupList;
Geotweet.prototype.downloadKeylist = Common.prototype.downloadKeylist;
Geotweet.prototype.uploadKeylist = Common.prototype.uploadKeylist;

Geotweet.prototype.abortRequests = function() {
    for (var i = 0; i < this.xhrPool.length; i++) {
        this.xhrPool[i].abort();
    }
    this.xhrPool.length = 0;
};


Geotweet.prototype.initialize = function() {
    var This = this;

    $().ready(function() {
        This.prepareMap();
        This.prepareDOM();
    });
};

Geotweet.prototype.destroy = function() {
    this.cluster = null;
    this.map.removeLayer(this.googlelayer);
    if (this.heatmapLayer)
        this.map.removeLayer(this.heatmapLayer);
    if (this.clusterLayer)
        this.map.removeLayer(this.clusterLayer);
    this.googlelayer = null;
    this.heatmapLayer = null;
    this.clusterLayer = null;
    this.stop();
    this.reset();
    this.container.html('');
};

Geotweet.prototype.stop = function() {
    this.abortRequests();
};

Geotweet.prototype.resume = function() {

};



Geotweet.prototype.prepareMap = function() {
    this.map = new L.Map(this.$('.map')[0], {center: new L.LatLng(38.963745, 35.243322), zoom: 6, maxZoom: 20, zoomAnimation: false, zoomControl: false});

    this.googlelayer = new L.Google('ROADMAP', {mapTypeId: 'styles'});
    this.map.addLayer(this.googlelayer);
    this.googlelayer.setOptions();
    var southWest = new L.LatLng(30, 16);
    var northEast = new L.LatLng(48, 55);
    var bounds = new L.LatLngBounds(southWest, northEast);
    this.map.setMaxBounds(bounds);
};

Geotweet.prototype.updateTT = function() {
    var This = this;

    for (var i = 0; i < this.tt.length; i++) {
        this.tt[i] = '#' + this.tt[i];
    }

    var addDelayedClass = function(obj, i) {
        setTimeout(function() {
            obj.addClass('prior' + i).removeClass('in');
        }, 10);
    };

    this.$('.hashtag_container a').each(function() {
        if ($.inArray($(this).attr('title'), This.tt) === -1) {
            $(this).removeClass($(this).attr('class'))
                    .addClass('out')
                    .on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
                        $(this).remove();
                    });
        }
    });

    for (var i = 0; i < This.tt.length; i++) {
        var obj = This.$('.hashtag_container').find('a[title="' + This.tt[i] + '"]');
        if (obj.length > 0) {
            var place = parseInt(obj.attr('class').replace('prior', ''), 10);
            if (place !== i) {
                obj.addClass('prior' + i).removeClass('prior' + place);
            }
        } else {
            var ht = This.tt[i];
            var newA = $('<a>').html(ht)
                    .attr('title', ht)
                    .addClass('in')
                    .appendTo(This.$('.hashtag_container'));
            addDelayedClass(newA, i);

        }

    }

};


Geotweet.prototype.setMarkers = function() {

    var points = [],
            markerList = [];

    if (this.renderMode === 'cluster')
    {
        if (this.clusterLayer) {
            this.clusterLayer.clearLayers();
            this.clusterLayer = null;
        }

        if (this.heatmapLayer) {
            this.HeatmapRemovePoints();
        }

        for (var i = 0; i < this.cluster.length; i++) {
            var a = this.cluster[i];
            var icon = defaultIconCreate(i, this.cluster[i], [parseInt(a["count"])]);
            markerList[i] = L.marker([a["posX"], a["posY"]], {icon: icon});
        }
        this.clusterLayer = L.layerGroup(markerList).addTo(this.map);

    } else {


        if (this.clusterLayer) {
            this.clusterLayer.clearLayers();
            this.clusterLayer = null;
        }

        if (this.heatmapLayer === null) {
            this.HeatmapRenderer();
        }

        this.HeatmapRemovePoints();
        this.HeatmapAddPoints(this.cluster);
    }
};



Geotweet.prototype.prepareDOM = function() {


    //TODO - Uncomment this after selecting right containers
    /*var containers = ['.toplist_summary', '.main_graph_container', '.instant_summary', '.main_right'];
     this.animateContainers(containers);*/

    this.addListeners();

};


Geotweet.prototype.requestTweets = function(data) {
    var This = this;
    this.tweetQueryData = {};
    this.tweetQueryData.keylist = [];
    this.$('.general_tweet_container .buttons .icon-spinner').show();
    this.$('.general_tweet_container ul').html('');

    This.myGet('data_manager.php', $.extend(data, {
        mode: 'gettweets',
        mod: 'tweetid',
        starttime: this.startDay,
        endtime: this.endDay,
        keylist: JSON.stringify(this.currentKeylist)
    }), function(data) {
        This.$('.general_tweet_container .buttons .icon-spinner').hide();
        console.log(data);
        This.tweetList = data;
        var maxTime = 100;
        var minTime = 5;
        var keys = Object.keys(data);

        var avgtime = parseInt(600 / keys.length);
        avgtime = Math.min(avgtime, maxTime);
        avgtime = Math.max(avgtime, minTime);
        This.pushRecursively(avgtime);

    }, function(i, errorText) {
        console.log('Tweets with tweet id not retrieved (' + errorText + ')');
    });
};


Geotweet.prototype.adjustPopupPosition = function(totalx, totaly) {
    var This = this;
    var tweet_cont = this.$('.tweet_container');
    var vertical_prop = 'top';
    var vertical_compl = 'bottom';
    var horizontal_prop = 'left';
    var wrapper = this.container;

    tweet_cont.removeClass('p_lefttop p_righttop p_leftbottom p_rightbottom');

    if (totalx > wrapper.innerWidth() / 2) {
        totalx -= tweet_cont.outerWidth() + 10;
        horizontal_prop = 'right';
    } else {
        totalx += 10;
    }

    if (totaly > wrapper.height() / 2) {
        totaly = wrapper.height() - totaly;
        totaly -= 50;
        vertical_prop = 'bottom';
        vertical_compl = 'top';
    } else {
        totaly -= 50;
    }

    //TODO - Make x as the minute start... DONE
    var options = {duration: 300};
    options[vertical_prop] = totaly + 'px';
    options[vertical_compl] = 'auto';
    options['left'] = totalx + 'px';

    tweet_cont.transition(options, function() {
        This.$(".tweet_container").myShow();
    });
    tweet_cont.addClass('p_' + horizontal_prop + vertical_prop);
};

Geotweet.prototype.addListeners = function() {
    var This = this;


    this.addKeyGroupListeners({
        add: function(key) {
            This.currentKeylist = {};
            This.currentKeylist[key] = [key];
            This.regenerateId();
            This.requestMapData();
        }, remove: function(key) {
        }, select: function(key) {
            This.$('button[name=add_kw]').removeAttr('disabled');
        }, cancel: function(key) {

        },
        colorChange: function() {
        },
        minLength: -1
    });

    This.addDayListener(function(date) {
        This.setDates(moment(date));
        This.regenerateId();
    });
    This.$('input[name=daypicker]').datepicker(('setDate'), current().format('YYYY-MM-DD'));
    This.setDates(current());



    this.map.whenReady(function() {
        This.regenerateId();
        This.requestMapData();
    });


    this.map.on("zoomend dragend", function(e) {
        This.requestMapData();
        This.$(".tweet_container").myHide();
    });

    this.map.on('click', function() {
        This.$(".tweet_container").myHide();
    });

    this.$('.mode_select').click(function() {
        if (!$(this).hasClass('selected')) {
            This.$('.mode_select').removeClass('selected');
            $(this).addClass('selected');
            This.renderMode = $(this).attr('data-mode');
            This.requestMapData();
        }
    });

    this.$('.map').delegate('.marker-cluster', 'click', function() {
        var dataObj = $(this).find('span');
        var index = dataObj.attr('data-index');
        var curr = This.cluster[index];
        var count = parseInt(dataObj.html());

        //if ($(this).hasClass('marker-cluster-small')) {
        if (count < 30) {
            coords = dataObj.attr('data-coords').replace(/'/g, "\"");
            var coords = JSON.parse(coords);

            var totalx = $(this).outerWidth() / 2 + $(this).offset().left - This.container.offset().left;
            var totaly = $(this).outerHeight() / 2 + $(this).offset().top - This.container.offset().top;

            This.adjustPopupPosition(totalx, totaly);
            This.requestTweets(coords);
            return false;
        } else {
            This.map.setView(new L.LatLng(curr.posX, curr.posY), This.map.getZoom() + 1);
        }
    });

    this.$('.hashtag_container').delegate('a', 'click', function() {
        var key = $(this).attr('title');
        This.$('input[name=keyword]').val(key);
        This.$('button[name=add_kw]').click();
    });

};

Geotweet.prototype.setDates = function(momentObj) {
    var formatStr = 'YYYY-MM-DD HH:mm:ss';
    this.startDay = momentObj.clone().startOf('day').subtract('days', 1).format(formatStr);
    this.endDay = momentObj.clone().startOf('day').format(formatStr);
};

Geotweet.prototype.regenerateId = function() {

    var key = (Object.keys(this.currentKeylist).length > 0) ? Object.keys(this.currentKeylist)[0] : "";
    var starttime = moment(this.startDay).valueOf();
    var endtime = moment(this.endDay).valueOf();
    this.id = key + user_id + starttime + endtime;
    this.idChanged = true;
};

Geotweet.prototype.reset = function() {
    this.tweetCount = 0;
    this.timers = [];
    this.response = {};
};



Geotweet.prototype.requestMapData = function() {
    var This = this;

    var bounds = This.map.getBounds();
    var nelat = bounds._northEast.lat,
            nelng = bounds._northEast.lng,
            swlat = bounds._southWest.lat,
            swlng = bounds._southWest.lng,
            zoomLevel = This.map.getZoom();


    var qR = {
        mod: 'map',
        endX: nelat,
        endY: nelng,
        startX: swlat,
        startY: swlng,
        keylist: JSON.stringify(this.currentKeylist),
        starttime: this.startDay,
        endtime: this.endDay,
        id: this.id,
        zoom: zoomLevel,
        mode: this.renderMode
    };

    if (!this.processing) {
        this.showLoading(this.idChanged);
        var tempId = this.id;
        This.processing = true;
        this.myGet('data_manager.php', qR, function(data) {

            This.cluster = data.cluster;
            This.tt = data.tt;
            This.setMarkers();
            This.updateTT();
            This.processing = false;
            This.idChanged = (tempId !== This.id) ? true : false;
            This.showLoading(This.idChanged);
            if (This.queuedRequest) {
                This.queuedRequest = false;
                This.requestMapData();
            }
        }, function(error, errorcode) {
            console.log('map data not recieved (' + errorcode + ')');
            This.processing = false;
        });
    } else {
        this.queuedRequest = true;
    }
};




//Helper Functions for map functions
L.TileLayer.HeatMap.prototype.addPoint = function(lat, lon) {
    this._data.push({lat: lat, lon: lon, value: 1});
};

defaultIconCreate = function(i, cluster, childCount) {

    var c = ' marker-cluster-';
    if (childCount < 30) {
        c += 'small';
    } else if (childCount < 100) {
        c += 'medium';
    } else {
        c += 'large';
    }

    var rad = Math.log(childCount) / Math.log(2) * 4;

    var radius = parseInt(Math.max(30, rad));
    var coords = JSON.stringify({
        'topX': cluster.topX,
        'topY': cluster.topY,
        'botX': cluster.botX,
        'botY': cluster.botY
    });

    coords = coords.replace(/"/g, "'");

    return new L.DivIcon({html: '<div><span data-coords="' + coords + '" data-index="' + i + '">' + childCount + '</span></div>', className: 'mc marker-cluster' + c, iconSize: new L.Point(radius, radius)});
};


L.Google.prototype.setOptions = function() {
    google.maps.visualRefresh = true;

    var styles = [
        {
            "stylers": [
                {"saturation": -60}
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text",
            "stylers": [
                {"visibility": "off"}
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {"visibility": "off"}
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {"color": "#E1EFF6"}
            ]
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {color: '#EFEFEF'},
                {visibility: "on"}
            ]
        }, {
            featureType: "road",
            elementType: "labels",
            stylers: [
                {visibility: "off"}
            ]
        }, {
            featureType: "landscape.natural.terrain",
            elementType: "geometry",
            stylers: [
                {visibility: "off"}
            ]
        }, {
            "featureType": "transit",
            "stylers": [
                {"visibility": "off"}
            ]
        }, {
            "featureType": "poi",
            "stylers": [
                {"visibility": "off"}
            ]
        }
    ];

    this._google.setOptions({styles: styles});
};





var Heatmap,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };



Heatmap = (function() {

    function Heatmap() {
        this.createPalette();
    }

    Heatmap.prototype.createPalette = function() {
        var canvas, ctx, data, hi, rgb, theta, v, _i;
        canvas = document.createElement("canvas");
        canvas.width = "1";
        canvas.height = "256";
        ctx = canvas.getContext("2d");
        data = ctx.createImageData(1, 256);
        for (v = _i = 0; _i <= 256; v = ++_i) {
            theta = (1 - v / 255) * 270;
            rgb = this.hsl2rgb(theta / 260, 1, 0.5);
            hi = v * 4;
            data[hi] = rgb[0];
            data[hi + 1] = rgb[1];
            data[hi + 2] = rgb[2];
            data[hi + 3] = v;
        }
        return this.gradient = data;
    };

    Heatmap.prototype.createHeatmap = function(canvas, context) {
        var heat, height, hi, hx, hy, offset, v, values, vi, width, _i, _j;
        width = canvas.width;
        height = canvas.height;
        values = context.getImageData(0, 0, width, height);
        heat = context.createImageData(width, height);
        for (hy = _i = 0; 0 <= height ? _i <= height : _i >= height; hy = 0 <= height ? ++_i : --_i) {
            for (hx = _j = 0; 0 <= width ? _j <= width : _j >= width; hx = 0 <= width ? ++_j : --_j) {
                vi = 4 * (hy * width + hx);
                hi = 4 * (hy * width + hx);
                v = values.data[vi + 3];
                offset = v << 2;
                heat.data[hi] = this.gradient[offset];
                heat.data[hi + 1] = this.gradient[offset + 1];
                heat.data[hi + 2] = this.gradient[offset + 2];
                heat.data[hi + 3] = v;
            }
        }
        return context.putImageData(heat, 0, 0);
    };

    Heatmap.prototype.hsl2rgb = function(h, s, l) {
        var i, rgb, t1, t2, t3, val, _i;
        if (s === 0) {
            val = l * 255;
            return [val, val, val];
        }
        if (l < 0.5) {
            t2 = l * (1 + s);
        } else {
            t2 = l + s - l * s;
        }
        t1 = 2 * l - t2;
        rgb = [0, 0, 0];
        for (i = _i = 0; _i <= 3; i = ++_i) {
            t3 = h + 1 / 3 * -(i - 1);
            t3 < 0 && t3++;
            t3 > 1 && t3--;
            if (6 * t3 < 1) {
                val = t1 + (t2 - t1) * 6 * t3;
            } else if (2 * t3 < 1) {
                val = t2;
            } else if (3 * t3 < 2) {
                val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
            } else {
                val = t1;
            }
            rgb[i] = val * 255;
        }
        return rgb;
    };

    return Heatmap;

})();


HeatmapLayer = (function(_super) {

    __extends(HeatmapLayer, _super);

    function HeatmapLayer() {
        HeatmapLayer.__super__.constructor.apply(this, arguments);
        this.drawn = false;
    }

    HeatmapLayer.prototype.init = function() {
        this.points = [];
        return this.heatmap = new Heatmap;
    };

    HeatmapLayer.prototype.clear = function() {
        this.points = [];
        return this.drawn = false;
    };

    HeatmapLayer.prototype._addTilesFromCenterOut = function(bounds) {
        if (this.drawn) {
            return;
        }
        HeatmapLayer.__super__._addTilesFromCenterOut.apply(this, arguments);
        return this.drawn = true;
    };

    HeatmapLayer.prototype.drawTile = function(canvas, tilePoint, zoom) {
        var a, context, g, p, point, radius, radius2, start, x, y, _i, _len, _ref;
        context = canvas.getContext('2d');
        start = tilePoint.multiplyBy(this.options.tileSize);
        _ref = this.points;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            point = _ref[_i];
            p = this._map.project(point.latLng);
            x = Math.round(p.x - start.x);
            y = Math.round(p.y - start.y);
            radius = point.params.radius;
            radius2 = radius << 1;
            if (x < -radius2 || x > this.options.tileSize + radius2 || y < -radius2 || y > this.options.tileSize + radius2) {
                continue;
            }
            g = context.createRadialGradient(x, y, 0, x, y, radius);
            a = point.params.weight || (1 / 10);
            g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = g;
            context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
        return this.heatmap.createHeatmap(canvas, context);
    };

    HeatmapLayer.prototype.addPoint = function(latLng, params) {
        if (params == null) {
            params = {};
        }

        return this.points.push({
            latLng: latLng,
            params: params
        });
    };

    return HeatmapLayer;

})(L.TileLayer.Canvas);


Geotweet.prototype.HeatmapRenderer = function() {
    this.heatmapLayer = new HeatmapLayer();
    this.heatmapLayer.init();
};

Geotweet.prototype.showLoading = function(flag) {
    if (flag) {
        this.$('.loading_overlay').show();
    } else {
        this.$('.loading_overlay').hide();
    }
};

Geotweet.prototype.HeatmapAddPoints = function(points) {
    var count, dx, dy, point, radius, time, val, weight, zoom, _i, _len, _ref, latLng, crs, ne, sw;
    crs = this.map.options.crs;
    time = (new Date).getTime();
    zoom = this.map.getZoom();
    _ref = points.sort(function(a, b) {
        return a.count - b.count;
    });

    var max = _ref.last()?_ref.last().count:0;

    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        count = point.count;
        latLng = new L.LatLng(point['posX'], point['posY']);
        ne = new L.LatLng(point.topX, point.botY);
        sw = new L.LatLng(point.botX, point.topY);
        weight = (max === 0) ? 0 : Math.max(0.2, Math.log(count) / Math.log(max));
        val = this.map.getZoom() * weight;
        dx = this.map.latLngToLayerPoint(ne).x - this.map.latLngToLayerPoint(sw).x;
        dy = this.map.latLngToLayerPoint(ne).y - this.map.latLngToLayerPoint(sw).y;

        radius = Math.sqrt(dx * dx + dy * dy) / 4;
        /*if (zoom >= 12) {
         radius = Math.max(val, 8) + Math.max(dx, dy);
         } else if (zoom > 10) {
         radius = Math.max(val, 0) + Math.max(dx, dy) / 2;
         } else {
         radius = Math.max(dx, dy);
         }*/

        this.heatmapLayer.addPoint(latLng, {
            radius: radius,
            weight: weight
        });
    }
    return this.map.addLayer(this.heatmapLayer);
};

Geotweet.prototype.HeatmapRemovePoints = function() {
    this.heatmapLayer.clear();
    return this.map.removeLayer(this.heatmapLayer);
};
