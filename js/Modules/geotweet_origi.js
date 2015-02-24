
// Global Variables
var delimeter = ',',
        heatmapOptions =
        {
            radius: 10,
            opacity: 0.75,
            gradient: {
                0.20: "rgb(0,0,255)",
                0.40: "rgb(0,255,255)",
                0.60: "rgb(0,255,0)",
                0.75: "rgb(255,255,0)",
                1.0: "rgb(255,0,0)"
            }
        };

GeoTweet = function(container) {
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
    this.rectangleList = []
    this.cluster = [];

    this.clusterLayer = 0;

    this.numClusters = 20;
    this.grid = null;
    this.heatmapLayer = null;
    this.googlelayer = null;
    this.renderMode = 'cluster';

};

GeoTweet.prototype.animateContainers = Common.prototype.animateContainers;
GeoTweet.prototype.$ = Common.prototype.$;
GeoTweet.prototype.myGet = Common.prototype.myGet;

GeoTweet.prototype.initialize = function() {
    var This = this;


    $().ready(function() {
        This.prepareMap();
        This.prepareDOM();
    });
}

GeoTweet.prototype.destroy = function() {

}

GeoTweet.prototype.stop = function() {

}

GeoTweet.prototype.resume = function() {

}



GeoTweet.prototype.prepareMap = function() {
    this.map = new L.Map(this.$('.map')[0], {center: new L.LatLng(38.963745, 35.243322), zoom: 6, maxZoom: 14, zoomAnimation: false, zoomControl: false});

    this.googlelayer = new L.Google('ROADMAP', {mapTypeId: 'styles'});
    this.map.addLayer(this.googlelayer);
    this.googlelayer.setOptions();

    //layer.setCoordMap();
    //map.addLayer(markers);
    //map.addLayer(heatmapLayer);
    //heatmapLayer._cache.max = 2; //heatmapLayer._calculateMaxValue(heatmapLayer._data)
    // heatmapLayer.redraw();

    var southWest = new L.LatLng(30, 16);
    var northEast = new L.LatLng(48, 55);
    var bounds = new L.LatLngBounds(southWest, northEast);
    this.map.setMaxBounds(bounds);

};


GeoTweet.prototype.setMarkers = function() {

    var points = [],
            markerList = [];

    if (this.renderMode == 'cluster')
    {

        if (this.clusterLayer) {
            this.clusterLayer.clearLayers();
            this.clusterLayer = null;
        }

        if (this.heatmapLayer && this.heatmapLayer._data.length > 0) {
            this.heatmapLayer._data = [];
            this.heatmapLayer.redraw();
        }

        for (var i = 0; i < this.cluster.length; i++) {
            var a = this.cluster[i];
            var icon = defaultIconCreate(i, [parseInt(a["count"])]);
            markerList[i] = L.marker([a["posX"], a["posY"]], {icon: icon});
        }
        this.clusterLayer = L.layerGroup(markerList).addTo(this.map);



    } else {

        if (this.clusterLayer) {
            this.clusterLayer.clearLayers();
            this.clusterLayer = null;
        }

        if (this.heatmapLayer == null) {
            this.heatmapLayer = L.TileLayer.heatMap(heatmapOptions);
            this.map.addLayer(this.heatmapLayer);
        }

        if (this.heatmapLayer._data.length > 0) {
            this.heatmapLayer._data = [];
        }

        var max = 0;

        for (var i = 0; i < this.cluster.length; i++) {
            if (this.cluster[i].count > max)
                max = this.cluster[i].count;
        }

        for (var i = 0; i < this.cluster.length; i++) {
            var a = this.cluster[i];
            var value = Math.max(0.2, Math.log(a.count) / Math.log(max));
            //Math.max(30, 20 * Math.log(a.count) / Math.log(3))
            points.push({lat: a["posX"], lon: a["posY"], value: value});
        }

        //this.heatmapLayer = L.TileLayer.heatMap(heatmapOptions);
        //this.map.addLayer(this.heatmapLayer);
        this.heatmapLayer.addData(points);
        this.heatmapLayer.redraw();
    }

};



GeoTweet.prototype.prepareDOM = function() {


    //TODO - Uncomment this after selecting right containers
    /*var containers = ['.toplist_summary', '.main_graph_container', '.instant_summary', '.main_right'];
     this.animateContainers(containers);*/

    this.addListeners();


};

GeoTweet.prototype.addListeners = function() {
    var This = this;

    This.$("button[name=save_kw]").click(function() {
        This.$(".kw_list_popup").transition({display: 'block', duration: 0}).transition({opacity: 1, transform: "translateY(10px)", duration: 500});
        setTimeout(function() {
            setTransition(This.$(".kw_list_popup").children(), 0, {opacity: 1}, 600, 50);
        }, 100);
        return false;
    });

    This.$("button[name=list_kw]").click(function() {
        This.$(".group_list").transition({display: 'block', duration: 0, 'scale': '1,0.5'}).transition({opacity: 1, transform: "translateY(0px)", 'scale': '1', duration: 500});
        setTimeout(function() {
            setTransition(This.$(".group_list li"), 0, {opacity: 1}, 600, 80, 0.95);
        }, 150);
        return false;
    });

    This.$(".kw_list_input").tagsInput({height: "auto",
        width: "auto",
        delimiter: delimeter,
        defaultText: lang_array['new_keyword'],
        'minChars': 3,
        'maxChars': 40 //if not provided there is no limit,
    });


    this.map.whenReady(function() {
        This.requestMapData();

    });


    this.map.on("zoomend dragend", function(e) {
        This.requestMapData();
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
        var count = parseInt(dataObj.html());
        var curr = This.cluster[index];

        if ($(this).hasClass('marker-cluster-small')) {

        } else {
            This.map.setView(new L.LatLng(curr.posX, curr.posY), This.map.getZoom() + 1);
        }
    });


};

GeoTweet.prototype.reset = function() {
    this.tweetCount = 0;
    this.timers = [];
    this.response = {};
};


GeoTweet.prototype.requestMapData = function() {
    var This = this;

    var bounds = This.map.getBounds();
    var nelat = bounds._northEast.lat,
            nelng = bounds._northEast.lng,
            swlat = bounds._southWest.lat,
            swlng = bounds._southWest.lng,
            zoomLevel = This.map.getZoom();
    $('.x1').val(nelat);
    $('.y1').val(nelng);
    $('.x2').val(swlat);
    $('.y2').val(swlng);

    $.get('data_manager.php', {
        mod: 'map',
        endX: nelat,
        endY: nelng,
        startX: swlat,
        startY: swlng,
        numClusters: this.numClusters,
        zoom: zoomLevel,
        mode: this.renderMode
    }, function(data) {
        //$('.output').val(JSON.stringify(data));
        This.cluster = data;
        console.log(This.cluster);
        This.setMarkers();
    }, 'json');
};

//Helper Functions for map functions
L.TileLayer.HeatMap.prototype.addPoint = function(lat, lon) {
    this._data.push({lat: lat, lon: lon, value: 1});
};

defaultIconCreate = function(i, childCount) {

    var c = ' marker-cluster-';
    if (childCount < 10) {
        c += 'small';
    } else if (childCount < 100) {
        c += 'medium';
    } else {
        c += 'large';
    }

    var rad = Math.log(childCount) / Math.log(2) * 4;

    var radius = parseInt(Math.max(30, rad));

    return new L.DivIcon({html: '<div><span data-index="' + i + '">' + childCount + '</span></div>', className: 'mc marker-cluster' + c, iconSize: new L.Point(radius, radius)});
};

google.maps.visualRefresh = true;

L.Google.prototype.setOptions = function() {

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