var SBTRED = '#DC2E82',
        SBTLBLUE = '#28AAE2',
        SBTDBLUE = '#2F3293';

PREFIX = '-' + getVendorPrefix() + '-'; // -webkit-



(function() {
    var METHODS = ["log", "info", "warn", "error"];
    this.ALL = 0,
            this.INFO = 1,
            this.WARN = 2,
            this.ERROR = 3,
            this.NONE = 4;


    this.init = function() {
        for (var i = 0; i < METHODS.length; i++) {
            this.console[i] = window.console[METHODS[i]];
        }
        this.setDebugMode('NONE');
    };

    this.setDebugMode = (function(debug) {
        this.DEBUG = this[debug];

        for (var i = 0; i < METHODS.length; i++) {
            if (i >= this.DEBUG) {
                window.console[METHODS[i]] = this.console[i];
            } else
                window.console[METHODS[i]] = function() {
                };
        }
    });

    this.getDebugMode = (function() {
        return this.DEBUG;
    });

    this.init();

}).call(this);



(function() {
    'use strict';
    var DEFAULT_MAX_DEPTH = 6;
    var DEFAULT_ARRAY_MAX_LENGTH = 50;
    var seen; // Same variable used for all stringifications

    Date.prototype.toPrunedJSON = Date.prototype.toJSON;
    String.prototype.toPrunedJSON = String.prototype.toJSON;

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            meta = {// table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder, depthDecr, arrayMaxLength) {
        var i, // The loop counter.
                k, // The member key.
                v, // The member value.
                length,
                partial,
                value = holder[key];

        if (jQuery && value  instanceof jQuery)
            return '"-jQuery-"';

        if (isNode(value) || isElement(value))
            return '"-element-"';

        if (key === 'options' || key === 'plotOptions' || key === 'htmlContent' || key === 'ticks' || key === 'tooltipOptions' || key === 'renderer' || key === 'styles' || key === 'style')
            return '"-unnecessary-"';

        if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
            value = value.toPrunedJSON(key);
        }



        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                if (depthDecr <= 0 || seen.indexOf(value) !== -1) {
                    return '"-pruned-"';
                }
                seen.push(value);
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = Math.min(value.length, arrayMaxLength);
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value, depthDecr - 1, arrayMaxLength) || 'null';
                    }
                    v = partial.length === 0
                            ? '[]'
                            : '[' + partial.join(',') + ']';
                    return v;
                }
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        try {
                            v = str(k, value, depthDecr - 1, arrayMaxLength);
                            if (v)
                                partial.push(quote(k) + ':' + v);
                        } catch (e) {
                            // this try/catch due to some "Accessing selectionEnd on an input element that cannot have a selection." on Chrome
                        }
                    }
                }
                v = partial.length === 0
                        ? '{}'
                        : '{' + partial.join(',') + '}';
                return v;
        }
    }

    JSON.pruned = function(value, depthDecr, arrayMaxLength) {
        seen = [];
        depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
        arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
        return str('', {'': value}, depthDecr, arrayMaxLength);
    };

}());


//Returns true if it is a DOM node
function isNode(o) {
    return (
            typeof Node === "object" ? o instanceof Node :
            o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
            );
}

//Returns true if it is a DOM element    
function isElement(o) {
    return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
            );
}


if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
}

Array.prototype.validLast = function() {
    var i = this.length - 1;
    while (i > -1) {
        if (this[i])
            return this[i];
        i--;
    }
};
if (!Array.prototype.removeElement) {
    Array.prototype.removeElement = function(elem, splice) {
        splice = typeof splice !== 'undefined' ? splice : true;
        var index = this.indexOf(elem);
        if (index != -1)
            if (splice)
                this.splice(index, 1);
            else
                delete this[index];
    };
}

$.fn.fhtml = function(val, sign) {
    return this.html(((sign && val > 0) ? ('+') : ('')) + val.toFixed(2));
};

function getVendorPrefix()
{
    if ('result' in arguments.callee)
        return arguments.callee.result;
    var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
    var someScript = document.getElementsByTagName('script')[0];
    for (var prop in someScript.style)
    {
        if (regex.test(prop))
        {
            // test is faster than match, so it's better to perform
            // that on the lot and match only when necessary
            return arguments.callee.result = prop.match(regex)[0];
        }

    }

    // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
    // However (prop in style) returns the correct value, so we'll have to test for
    // the precence of a specific property
    if ('WebkitOpacity' in someScript.style)
        return arguments.callee.result = 'Webkit';
    if ('KhtmlOpacity' in someScript.style)
        return arguments.callee.result = 'Khtml';
    return arguments.callee.result = '';
}

(function($, self) {

    if (!$ || !self) {
        return;
    }

    for (var i = 0; i < self.properties.length; i++) {
        var property = self.properties[i],
                camelCased = StyleFix.camelCase(property),
                PrefixCamelCased = self.prefixProperty(property, true);
        $.cssProps[camelCased] = PrefixCamelCased;
    }

})(window.jQuery, window.PrefixFree);


function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var letters2 = '23456789ABCD'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        if (i % 2 === 0)
            color += letters2[Math.round(Math.random() * (letters2.length - 1))];
        else
            color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


function sorted_keys(object) {
    return Object.keys(object).sort();
}


findPlace = function(obj, keyToBeFound) {
    var counter = 0;
    for (var key in obj) {
        if (key === keyToBeFound) {
            return counter;
        }
        counter++;
    }
    return -1;
};

setTransition = function(elem, to, duration, timeout, multiplier) {
    timeout = timeout || 50;
    var currtimeout = timeout;
    var cumulative = 0;

    for (var i = 0; i < elem.length; i++) {
        var child = $(elem[i]);
        child.transition($.extend({}, to, {delay: cumulative}), duration);
        currtimeout = parseInt((multiplier || 0.8) * currtimeout);
        cumulative += currtimeout;
    }
};

stopTransition = function(elem, num) {
    if (num == elem.length)
        return;
    $(elem[num]).stop();
    if ($(elem[num]).children().length > 1) {
        stopTransition($(elem[num]).children(), 0);
    }
    stopTransition(elem, ++num);
};

Array.prototype.clone = function() {
    return this.slice(0);
};

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
};

addSuffixIfNeeded = function(arr) {
    var retArr = [];
    for (var i = 0; i < arr.length; i++) {
        retArr.push(arr[i] + '?' + Math.random());
    }
    return retArr;
};

$.fn.myShow = function(dir) {
    dir = dir ? dir : 'top';
    var axis = 'y';
    switch (dir) {
        case 'left':
        case 'right':
            axis = 'x';
            break;
    }

    var opts = {opacity: 1, duration: 300};
    opts[axis] = 0;

    this.css({transition: '', 'pointer-events': 'none'});
    if (this.css('display') === 'none' || parseFloat(this.css('opacity')) < 0.3)
        this.css({display: 'block'}).transition(opts, function() {
            $(this).css('pointer-events', "");
        });
};
$.fn.myHide = function(dir) {
    dir = dir ? dir : 'top';
    var axis = 'y';
    var amount = -30;
    switch (dir) {
        case 'top':
            break;
        case 'bottom':
            amount = -amount;
            break;
        case 'left':
            axis = 'x';
            break;
        case 'right':
            axis = 'x';
            amount = -amount;
            break;
    }

    var opts = {opacity: 0, duration: 300};
    opts[axis] = amount;

    this.css({transition: '', 'pointer-events': 'none'});
    this.transition(opts, function() {
        this.hide();
        $(this).css('pointer-events', "");
    });
};

randomSort = function(length) {
    var arr = [];
    for (var i = 0; i < length; i++) {
        arr[i] = i;
    }
    arr.sort(function() {
        return 0.5 - Math.random();
    });
    return arr;
};

String.prototype.tr2eng = function() {
    var tr = 'çğıöşüÇĞİÖŞÜ';
    var eng = 'cgiosuCGIOSU', result = this;
    for (var i = 0; i < result.length; i++) {
        var index = tr.indexOf(result[i]);
        if (index > -1) {
            result = result.replaceAt(i, eng[index]);
        }
    }
    return result;
};

Array.prototype.arrTr2eng = function() {
    for (var i = 0; i < this.length; i++) {
        this[i] = this[i].tr2eng();
    }
};

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

function pct2rgb(min, max, value) {
    var percent = (Math.log(value - min)) / (Math.log(max - min)) * 200;
    percent = percent > 190 ? 190 : percent;
    percent = percent < 0 ? 0 : percent;
    return "hsl(" + (200 - percent) + ", 80%, 50%)";
}

function svg2bitmap(chart, opts) {
    if (!opts)
        opts = {};

    var canvas = document.getElementById("canvas");

    try {
        canvg(canvas, chart.getSVG(opts));
        return canvas.toDataURL("image/png").replace("data:image/png;base64,", ""); //TODO:uncomment 
    } catch (e) {
        onCatchableError(printStackTrace({e: e}));
    }
}

function arrays_equal(a, b) {
    return !(a < b || b < a);
}


/* TWITTER HELPERS */
function createUserNameLink(screenName, id) {
    var link = $('<a>').attr({
        href: 'https://twitter.com/' + screenName,
        target: '_blank',
        class: 'mention',
        'data-userId': id ? id : ''
    }).html(screenName);
    return  link.wrap('<div>').parent().html();
}

function findKeyBySubkey(obj, subkey, value) {
    var place = null;
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) {
            for (var skey in obj[i]) {
                if (skey !== subkey)
                    continue;
                if (obj[i][skey] === value) {
                    return i;
                }
            }
        }
    } else {

        for (var key in obj) {
            for (var skey in obj[key]) {
                if (skey !== subkey)
                    continue;
                if (obj[key][skey] === value) {
                    return key;
                }
            }
        }
    }
    return place;
}


//sistemin offline olup olmadığını kontrol eden bir fonksiyon.
//Kullanım:
//networkListener(both);
//networkListener(online, 'online');
//networkListener(offline, 'offline');

function networkListener(a, b) {
    var offlineF, onlineF;
    if (a instanceof Function && b instanceof Function) {
        onlineF = a;
        offlineF = b;
    } else if (a instanceof Function) {
        if (typeof b === "string") {
            if (b === "online") {
                onlineF = a;
            } else if (b === "offline") {
                offlineF = a;
            }
        } else {
            onlineF = a;
            offlineF = a;
        }
    }
    if (typeof onlineF !== "undefined") {
        window.addEventListener('online', onlineF, false);
    }
    if (typeof offlineF !== "undefined") {
        window.addEventListener('offline', offlineF, false);
    }
}

// Her çağrıldığında otomatik artan sayıyı veren foksiyon
var autoIncrement = (function() {
    var i = 0;
    return function() {
        return i++;
    };
})();