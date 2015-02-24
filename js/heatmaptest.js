(function() {
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

    this.HeatmapLayer = (function(_super) {

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

    this.OSMHeatmapRenderer = (function() {
        var addPoints, init, removePoints;
        init = function() {
            this.heatmap = new HeatmapLayer();
            return this.heatmap.init();
        };
        addPoints = function(points, mapSystem, max) {
            var count, dx, dy, point, radius, time, val, weight, zoom, _i, _len, _ref;
            time = (new Date).getTime();
            zoom = mapSystem.getZoom();
            _ref = points.sort(function(a, b) {
                return a.count() - b.count();
            });
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                point = _ref[_i];
                count = point.count();
                weight = Math.max(0.2, Math.log(count) / Math.log(max));
                val = mapSystem.getZoom() * weight * 2;
                dx = mapSystem.fromLatLngToPixel(point.bounds.getNorthEast()).x - mapSystem.fromLatLngToPixel(point.bounds.getSouthWest()).x;
                dy = mapSystem.fromLatLngToPixel(point.bounds.getNorthEast()).y - mapSystem.fromLatLngToPixel(point.bounds.getSouthWest()).y;
                if (zoom >= 12) {
                    radius = Math.max(val, 8) + Math.max(dx, dy);
                } else if (zoom > 10) {
                    radius = Math.max(val, 0) + Math.max(dx, dy) / 2;
                } else {
                    radius = Math.max(dx, dy);
                }
                this.heatmap.addPoint(point.latLng, {
                    radius: radius,
                    weight: weight
                });
            }
            return map.addLayer(this.heatmap);
        };
        removePoints = function(points, mapSystem) {
            this.heatmap.clear();
            return map.removeLayer(this.heatmap);
        };
        return {
            addPoints: addPoints,
            removePoints: removePoints,
            init: init
        };
    })();

}).call(this);