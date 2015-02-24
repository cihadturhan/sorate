var Furnisher = function(mainDiv, selector, margin) {
    margin = margin ? margin : 0;
    selector = selector ? selector : ".tile";
    var tileSize = {
        "9": {w: 3, h: 3},
        "6": {w: 3, h: 2},
        "4": {w: 2, h: 2},
        "3": {w: 3, h: 1},
        "2": {w: 2, h: 1},
        "1": {w: 1, h: 1}
    };
    var baseWH = 75;
    var $tileList = mainDiv.children(selector);
    var tileRatio = 7 / 5;
    var gr;
    var prevWinRatio = -1;

    /*	Directions
     0=>up
     1=>left
     2=>down
     3=>right
     */
    var Directer = function() {
        var dir = 0;
        var ways = [
            [-1, 0], //up
            [0, -1], //left
            [1, 0], //down
            [0, 1] //right
        ];
        this.next = function() {
            return ways[(dir + 1) & 3];//(dir+1)%4
        };
        this.prev = function() {
            return ways[(dir + 3) & 3];//(dir-1)%4
        };
        this.turnCCW = function() {
            dir = (dir + 1) & 3;
        };
        this.turnCW = function() {
            dir = (dir + 3) & 3;
        };
        this.set = function(ndir) {
            if (ndir < 0 || ndir > 3)
                return null;
            dir = ndir;
        };
        this.get = function(d) {
            d = d || dir;
            return ways[d];
        };
        this.getVal = function() {
            return dir;
        };
        this.toString = function(d) {
            d = d || dir;
            switch (d) {
                case 0:
                    return "up";
                case 1:
                    return "left";
                case 2:
                    return "down";
                case 3:
                    return "right";
            }
        };
    };

    /* Coordinates
     x => horizontal
     y => vertical
     */

    var tileGrid = function(firstRect, winRatio) {
        // keep min max rows and columns empty for safe search
        var me = this;
        var size;
        grid = []; // ar[y][x] => order is y x
        var scoreLists = [];
        function initialize() {
            size = {w: 15, h: 15};

            //generate array
            var i, j;
            for (i = 0; i < size.h + 2; i++) {
                grid.push([]);
                for (j = 0; j < size.w + 2; j++)
                    grid[i].push(-1);
            }
            var rSize = tileSize[firstRect.size];
            firstRect.x = (size.w - rSize.w) >> 1;
            firstRect.y = (size.h - rSize.h) >> 1;
            me.fillGrid(firstRect);
            calculateScores(firstRect, winRatio);

            //clean borders
            for (i = 0; i < size.h + 2; i++)
                grid[i][0] = grid[i][size.w + 1] = -1;
            for (i = 0; i < size.h + 2; i++)
                grid[0][i] = grid[size.h + 1][i] = -1;
        }
        function checkGrid(x, y, rSize) {
            if (x < 1 || y < 1 || x + rSize.w > size.w || y + rSize.h > size.h)
                return false;
            for (var i = 0; i < rSize.h; i++)
                for (var j = 0; j < rSize.w; j++)
                    if (grid[i + y][j + x] != -1)
                        return false;
            return true;
        }
        function markGrid(x, y, id, rSize) {
            for (var i = 0; i < rSize.h; i++)
                for (var j = 0; j < rSize.w; j++)
                    grid[i + y][j + x] = id;
        }
        this.fillGrid = function(rect, d) {
            rect.x++;
            rect.y++;
            d = (d === undefined) ? 3 : d;
            var rSize = tileSize[rect.size];

            // change start x,y depending on direction
            if (d == 0 || d == 1)
                rect.y -= rSize.h - 1;
            if (d == 1 || d == 2)
                rect.x -= rSize.w - 1;

            var status = checkGrid(rect.x, rect.y, rSize);
            if (!status)
                return false;
            markGrid(rect.x, rect.y, rect.id, rSize);
            return true;
        };
        this.getPointsByScore = function(score) {
            return scoreLists[score];
        };
        function calculateScores(rect, winRatio) {
            winRatio = winRatio || 1;
            winRatio = winRatio | 0;
            var x = rect.x;
            var y = rect.y - 1;
            var score = 1;
            var sty = y + tileSize[rect.size].h;
            scoreLists = [];
            var sGrid = [];
            for (var i = 0; i < size.h + 2; i++) {
                sGrid.push([]);
                for (var j = 0; j < size.w + 2; j++)
                    sGrid[i][j] = grid[i][j];
            }

            for (var stx = x + tileSize[rect.size].w; stx <= size.w; stx++) {
                var i = stx;
                var j = sty;
                var dir = new Directer();
                var cWay = dir.get();
                var nWay = dir.next();
                scoreLists[score] = [];
                while (sGrid[j][i] == -1)
                {
                    var nY = j + nWay[0];
                    var nX = i + nWay[1];
                    if (score % winRatio == 0 || sGrid[nY][nX] != -1 && dir.getVal() % 2 == 0) {
                        sGrid[j][i] = score;
                        scoreLists[score].push({x: i - 1, y: j - 1, 'dir': dir.getVal()});
                    }
                    if (nY == sty && nX == stx)
                        break;
                    if (sGrid[nY][nX] == -1) {
                        dir.turnCCW();
                        j += nWay[0];
                        i += nWay[1];
                        cWay = dir.get();
                        nWay = dir.next();
                    } else {
                        j += cWay[0];
                        i += cWay[1];
                    }
                }
                score++;
            }
        }
        this.getStartPoints = function() {
            var pts = [];
            for (var i = 0; i < size.w + 2; i++)
                for (var j = 0; j < size.h + 2; j++)
                    if (grid[j][i] != -1 && !pts[grid[j][i]])
                        pts[grid[j][i]] = {x: i, y: j};
            return pts;
        };
        this.getFinishPoints = function() {
            var pts = [];
            for (var i = size.w + 1; i >= 0; i--)
                for (var j = size.h + 1; j >= 0; j--)
                    if (grid[j][i] != -1 && !pts[grid[j][i]])
                        pts[grid[j][i]] = {x: i, y: j};
            return pts;
        };

        initialize();
    };

    // Furnisher functions
    // set tiles sizes
    function setTileSizes() {
        $tileList = mainDiv.find(selector);
        for (var i = 0; i < $tileList.length; i++) {
            var size = $tileList.eq(i).attr("data-size");
            var wdt = tileRatio * baseWH * tileSize[size].w-margin;
            var hgh = baseWH * tileSize[size].h-margin;
            $tileList.eq(i).css({"width": wdt, "height": hgh}).addClass('w' + tileSize[size].w + ' ' + 'h' + tileSize[size].h);
        }
    }

    function setTilePositions(stPts) {
        stPts = stPts || null;
        if (stPts === null) {
            console.error("Positions not given");
            return;
        }
        for (var i in stPts)
            $tileList.eq(i).css({"left": stPts[i].x, "top": stPts[i].y});
    }

    function furnate(winRatio) {
        if (winRatio)
            prevWinRatio = winRatio;
        var $first = $tileList.first();
        var firstRect = {id: 0, size: $first.attr("data-size")};

        gr = new tileGrid(firstRect, winRatio);

        var stx = firstRect.x;
        var sty = firstRect.w;
        var dir = new Directer();

        for (var x = 1; x < $tileList.length; x++) {
            var placed = false;
            var score = 0;
            var tileSize = $tileList.eq(x).attr("data-size");
            while (!placed) {
                var pointList = gr.getPointsByScore(++score);

                if (!pointList) {
                    console.error("Couldn't fit tiles");
                    gr.printGrid();
                    return false;
                }
                for (var i = 0; i < pointList.length; i++)
                    if (gr.fillGrid({x: pointList[i].x, y: pointList[i].y, id: x, size: tileSize}, pointList[i].dir))
                    {
                        placed = true;
                        break;
                    }
            }
        }
        var stPts = gr.getStartPoints();
        var min = {x: -1, y: -1};
        for (var i in stPts) {
            if (stPts[i].x < min.x || min.x == -1)
                min.x = stPts[i].x;
            if (stPts[i].y < min.y || min.y == -1)
                min.y = stPts[i].y;
        }
        min.x--;
        min.y--;

        for (i in stPts) {
            stPts[i].x = (stPts[i].x - min.x) * tileRatio * baseWH;
            stPts[i].y = (stPts[i].y - min.y) * baseWH;
        }
        setTilePositions(stPts);
    }

    this.refurnate = function() {
        var winRatio = Math.round(mainDiv.innerWidth() / mainDiv.innerHeight());
        if (prevWinRatio != winRatio)
            furnate(winRatio);
        this.fitToMain(tileRatio);
    };

    this.fitToMain = function(tileRatio) {
        tileRatio = tileRatio || 1;

        var mainWidth = mainDiv.innerWidth() / tileRatio;
        var mainHeight = mainDiv.innerHeight();

        var stPts = gr.getStartPoints();
        var fnPts = gr.getFinishPoints();
        var min = {x: -1, y: -1};
        var max = {x: -1, y: -1};

        for (var i in stPts) {
            if (stPts[i].x < min.x || min.x == -1)	//minx
                min.x = stPts[i].x;
            if (stPts[i].y < min.y || min.y == -1)	//miny
                min.y = stPts[i].y;
            if (fnPts[i].x > max.x)			//maxx
                max.x = fnPts[i].x;
            if (fnPts[i].y > max.y)			//maxy
                max.y = fnPts[i].y;
        }
        var diffx = max.x - min.x + 1;
        diffx = diffx ? diffx : 1;
        var diffy = max.y - min.y + 1;
        diffy = diffy ? diffy : 1;

        wid = mainWidth / diffx;
        hgt = mainHeight / diffy;

        baseWH = wid < hgt ? wid : hgt;

        var offset = {x: 0, y: 0};
        if (wid < hgt) {
            offset.y = (mainHeight - baseWH * diffy) >> 3;
        } else {
            offset.x = (mainWidth - baseWH * diffx) * tileRatio >> 1;
        }

        for (i in stPts) {
            stPts[i].x = (stPts[i].x - min.x) * tileRatio * baseWH + offset.x;
            stPts[i].y = (stPts[i].y - min.y) * baseWH + offset.y;
        }
        setTileSizes();
        setTilePositions(stPts);
    };

    this.refurnate();
    $(window).resize({furn: this}, function(evt) {
        evt.data.furn.refurnate();
    });
};
