/*
 * Raphael 1.0 - JavaScript Vector Library
 *
 * Copyright (c) 2008 - 2009 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
/*
 * modified by yuanhuang
 * 按照kissy的模块来组织代码：支持svg的浏览器只加载core.svg.js，ie<9加载core.vml.js
 * RaphaelJS有自己的事件、动画实现，考虑迁移到kissy的实现
 */
   // var rendererType = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
   // var renderer = rendererType === 'SVG' ? './core.svg':'./core.vml';

   KISSY.add('gallery/kcharts/1.0/raphael/index',function(S,SVG,VML){
    var separator = /[, ]+/,
        doc = document,
        win = window,
        R = function () {
            if (R.is(arguments[0], "array")) {
                var a = arguments[0],
                    cnv = NameSpace.create[ap](R, a.splice(0, 3 + R.is(a[0], "number"))),
                    res = cnv.set();
                for (var i = 0, ii = a[ln]; i < ii; i++) {
                    var j = a[i] || {};
                    j.type in {circle:1, rect:1, path:1, ellipse:1, text:1, image:1} && res.push(cnv[j.type]().attr(j));
                }
                return res;
            }
            return NameSpace.create[ap](R, arguments);
        },
        paper = {},
        availableAttrs = {"clip-rect": "0 0 10e9 10e9", cx: 0, cy: 0, fill: "#fff", "fill-opacity": 1, font: '10px "Arial"', "font-family": '"Arial"', "font-size": "10", "font-style": "normal", "font-weight": 400, gradient: 0, height: 0, href: "http://raphaeljs.com/", opacity: 1, path: "M0,0", r: 0, rotation: 0, rx: 0, ry: 0, scale: "1 1", src: "", stroke: "#000", "stroke-dasharray": "", "stroke-linecap": "butt", "stroke-linejoin": "butt", "stroke-miterlimit": 0, "stroke-opacity": 1, "stroke-width": 1, target: "_blank", "text-anchor": "middle", title: "Raphael", translation: "0 0", width: 0, x: 0, y: 0},
        availableAnimAttrs = {"clip-rect": "csv", cx: "number", cy: "number", fill: "colour", "fill-opacity": "number", "font-size": "number", height: "number", opacity: "number", path: "path", r: "number", rotation: "csv", rx: "number", ry: "number", scale: "csv", stroke: "colour", "stroke-opacity": "number", "stroke-width": "number", translation: "csv", width: "number", x: "number", y: "number"},
        events = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup"],
        proto = "prototype",
        ap = "apply",
        ln = "length",
        pf = "parseFloat",
        pi = "parseInt";

    R.version = "1.0";
    R.type = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    R.svg = !(R.vml = R.type == "VML");
    R.idGenerator = 0;
    R.fn = {};
    R.availableAttrs = availableAttrs;

    R.is = function (o, type) {
        type = (type + "").toLowerCase();
        if ((type == "object" || type == "undefined") && typeof o == type) {
            return true;
        }
        if (o == null && type == "null") {
            return true;
        }
        return Object[proto].toString.call(o).replace(/^\[object\s+|\]$/gi, "").toLowerCase() == type;
    };
    R.setWindow = function (newwin) {
        win = newwin;
        doc = win.document;
    };
    // colour utilities
    R.hsb2rgb = cacher(function (hue, saturation, brightness) {
        if (R.is(hue, "object") && "h" in hue && "s" in hue && "b" in hue) {
            brightness = hue.b;
            saturation = hue.s;
            hue = hue.h;
        }
        var red,
            green,
            blue;
        if (brightness == 0) {
            return {r: 0, g: 0, b: 0, hex: "#000"};
        }
        if (hue > 1 || saturation > 1 || brightness > 1) {
            hue /= 255;
            saturation /= 255;
            brightness /= 255;
        }
        var i = Math.floor(hue * 6),
            f = (hue * 6) - i,
            p = brightness * (1 - saturation),
            q = brightness * (1 - (saturation * f)),
            t = brightness * (1 - (saturation * (1 - f)));
        red = [brightness, q, p, p, t, brightness, brightness][i];
        green = [t, brightness, brightness, q, p, p, t][i];
        blue = [p, p, t, brightness, brightness, q, p][i];
        red *= 255;
        green *= 255;
        blue *= 255;
        var rgb = {r: red, g: green, b: blue},
            r = (~~red).toString(16),
            g = (~~green).toString(16),
            b = (~~blue).toString(16);
        if (r[ln] == 1) {
            r = "0" + r;
        }
        if (g[ln] == 1) {
            g = "0" + g;
        }
        if (b[ln] == 1) {
            b = "0" + b;
        }
        rgb.hex = "#" + r + g + b;
        return rgb;
    }, R);
    R.rgb2hsb = cacher(function (red, green, blue) {
        if (R.is(red, "object") && "r" in red && "g" in red && "b" in red) {
            blue = red.b;
            green = red.g;
            red = red.r;
        }
        if (R.is(red, "string")) {
            var clr = R.getRGB(red);
            red = clr.r;
            green = clr.g;
            blue = clr.b;
        }
        if (red > 1 || green > 1 || blue > 1) {
            red /= 255;
            green /= 255;
            blue /= 255;
        }
        var max = Math.max(red, green, blue),
            min = Math.min(red, green, blue),
            hue,
            saturation,
            brightness = max;
        if (min == max) {
            return {h: 0, s: 0, b: max};
        } else {
            var delta = (max - min);
            saturation = delta / max;
            if (red == max) {
                hue = (green - blue) / delta;
            } else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            } else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            if (hue < 0) {
                hue += 1;
            }
            if (hue > 1) {
                hue -= 1;
            }
        }
        return {h: hue, s: saturation, b: brightness};
    }, R);
    R._path2string = function () {
        var res = "",
            item;
        for (var i = 0, ii = this[ln]; i < ii; i++) {
            for (var j = 0, jj = this[i][ln]; j < jj; j++) {
                res += this[i][j];
                j && j != jj - 1 && (res += ",");
            }
            i != ii - 1 && (res += "\n");
        }
        return res.replace(/,(?=-)/g, "");
    };
    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array[proto].splice.call(arguments, 0, arguments[ln]),
                args = arg.join("\u25ba");
            newf.cache = newf.cache || {};
            newf.count = newf.count || [];
            if (args in newf.cache) {
                return postprocessor ? postprocessor(newf.cache[args]) : newf.cache[args];
            }
            if (newf.count[ln] > 1000) {
                delete newf.cache[newf.count.unshift()];
            }
            newf.count.push(args);
            newf.cache[args] = f[ap](scope, arg);
            return postprocessor ? postprocessor(newf.cache[args]) : newf.cache[args];
        }
        return newf;
    }

    R.getRGB = cacher(function (colour) {
        var htmlcolors = {none: "none", aliceblue: "#f0f8ff", amethyst: "#96c", antiquewhite: "#faebd7", aqua: "#0ff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000", blanchedalmond: "#ffebcd", blue: "#00f", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#0ff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgreen: "#006400", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#f0f", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", green: "#008000", greenyellow: "#adff2f", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#789", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#0f0", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#f0f", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", red: "#f00", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#fff", whitesmoke: "#f5f5f5", yellow: "#ff0", yellowgreen: "#9acd32"},
            res;
        colour = htmlcolors[(colour + "").toLowerCase()] || colour;
        if (!colour) {
            return {r: -1, g: -1, b: -1, hex: "none", error: 1};
        }
        if (colour == "none") {
            return {r: -1, g: -1, b: -1, hex: "none"};
        }
        var red,
            green,
            blue,
            rgb = (colour + "").match(/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgb\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|rgb\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\)|hs[bl]\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hs[bl]\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\))\s*$/i);
        if (rgb) {
            if (rgb[2]) {
                blue = win[pi](rgb[2].substring(5), 16);
                green = win[pi](rgb[2].substring(3, 5), 16);
                red = win[pi](rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = win[pi](rgb[3].substring(3) + rgb[3].substring(3), 16);
                green = win[pi](rgb[3].substring(2, 3) + rgb[3].substring(2, 3), 16);
                red = win[pi](rgb[3].substring(1, 2) + rgb[3].substring(1, 2), 16);
            }
            if (rgb[4]) {
                rgb = rgb[4].split(/\s*,\s*/);
                red = win[pf](rgb[0]);
                green = win[pf](rgb[1]);
                blue = win[pf](rgb[2]);
            }
            if (rgb[5]) {
                rgb = rgb[5].split(/\s*,\s*/);
                red = win[pf](rgb[0]) * 2.55;
                green = win[pf](rgb[1]) * 2.55;
                blue = win[pf](rgb[2]) * 2.55;
            }
            if (rgb[6]) {
                rgb = rgb[6].split(/\s*,\s*/);
                red = win[pf](rgb[0]);
                green = win[pf](rgb[1]);
                blue = win[pf](rgb[2]);
                return R.hsb2rgb(red, green, blue);
            }
            if(rgb[7]) {
                rgb = rgb[7].split(/\s*,\s*/);
                red = win[pf](rgb[0]) * 2.55;
                green = win[pf](rgb[1]) * 2.55;
                blue = win[pf](rgb[2]) * 2.55;
                return R.hsb2rgb(red, green, blue);
            }
            rgb = {r: red, g: green, b: blue};
            var r = (~~red).toString(16),
                g = (~~green).toString(16),
                b = (~~blue).toString(16),
                rg = /^(?=\d$)/,
                rp = "replace";
            r = r[rp](rg, "0");
            g = g[rp](rg, "0");
            b = b[rp](rg, "0");
            rgb.hex = "#" + r + g + b;
            res = rgb;
        } else {
            res = {r: -1, g: -1, b: -1, hex: "none", error: 1};
        }
        return res;
    }, R);
    R.getColor = function (value) {
        var start = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || .75},
            rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += .075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= .2;
            if (start.s <= 0) {
                this.getColor.start = {h: 0, s: 1, b: start.b};
            }
        }
        return rgb.hex;
    };
    R.getColor.reset = function () {
        delete this.start;
    };
    // path utilities
    R.parsePathString = cacher(function (pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0},
            data = [];
        if (R.is(pathString, "array") && R.is(pathString[0], "array")) { // rough assumption
            data = R.pathClone(pathString);
        }
        if (!data[ln]) {
            (pathString + "").replace(/([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig, function (a, b, c) {
                var params = [],
                    name = b.toLowerCase();
                c.replace(/(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig, function (a, b) {
                    b && params.push(+b);
                });
                while (params[ln] >= paramCounts[name]) {
                    data.push([b].concat(params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    };
                }
            });
        }
        data.toString = R._path2string;
        return data;
    });
    var pathDimensions = cacher(function (path) {
        if (!path) {
            return {x: 0, y: 0, width: 0, height: 0};
        }
        path = path2curve(path);
        var x = 0,
            y = 0,
            X = [],
            Y = [];
        for (var i = 0, ii = path[ln]; i < ii; i++) {
            if (path[i][0] == "M") {
                x = path[i][1];
                y = path[i][2];
                X.push(x);
                Y.push(y);
            } else {
                var dim = curveDim(x, y, path[i][1], path[i][2], path[i][3], path[i][4], path[i][5], path[i][6]);

                X = X.concat(dim.min.x, dim.max.x);
                Y = Y.concat(dim.min.y, dim.max.y);
            }
        }

        var xmin = Math.min[ap](0, X) || 0,
            ymin = Math.min[ap](0, Y) || 0;

        return {
            x: xmin,
            y: ymin,
            width: Math.max[ap](0, X) - xmin,
            height: Math.max[ap](0, Y) - ymin
        };
    }),
        pathClone = function (pathArray) {
            var res = [];
            if (!R.is(pathArray, "array") || !R.is(pathArray && pathArray[0], "array")) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            for (var i = 0, ii = pathArray[ln]; i < ii; i++) {
                res[i] = [];
                for (var j = 0, jj = pathArray[i][ln]; j < jj; j++) {
                    res[i][j] = pathArray[i][j];
                }
            }
            res.toString = R._path2string;
            return res;
        },
        pathToRelative = cacher(function (pathArray) {
            if (!R.is(pathArray, "array") || !R.is(pathArray && pathArray[0], "array")) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res.push(["M", x, y]);
            }
            for (var i = start, ii = pathArray[ln]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != pa[0].toLowerCase()) {
                    r[0] = pa[0].toLowerCase();
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
                        default:
                            for (var j = 1, jj = pa[ln]; j < jj; j++) {
                                r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa[ln]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i][ln];
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res.toString = R._path2string;
            return res;
        }, 0, pathClone),
        pathToAbsolute = cacher(function (pathArray) {
            if (!R.is(pathArray, "array") || !R.is(pathArray && pathArray[0], "array")) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            for (var i = start, ii = pathArray[ln]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != (pa[0] + "").toUpperCase()) {
                    r[0] = (pa[0] + "").toUpperCase();
                    switch (r[0]) {
                        case "A":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] + x);
                            r[7] = +(pa[7] + y);
                            break;
                        case "V":
                            r[1] = +pa[1] + y;
                            break;
                        case "H":
                            r[1] = +pa[1] + x;
                            break;
                        case "M":
                            mx = +pa[1] + x;
                            my = +pa[2] + y;
                        default:
                            for (var j = 1, jj = pa[ln]; j < jj; j++) {
                                r[j] = +pa[j] + ((j % 2) ? x : y);
                            }
                    }
                } else {
                    for (var k = 0, kk = pa[ln]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                switch (r[0]) {
                    case "Z":
                        x = mx;
                        y = my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    default:
                        x = res[i][res[i][ln] - 2];
                        y = res[i][res[i][ln] - 1];
                }
            }
            res.toString = R._path2string;
            return res;
        }, null, pathClone),
        l2c = function (x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        },
        q2c = function (x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [
                    _13 * x1 + _23 * ax,
                    _13 * y1 + _23 * ay,
                    _13 * x2 + _23 * ax,
                    _13 * y2 + _23 * ay,
                    x2,
                    y2
                ];
        },
        a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            // for more information of where this math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var PI = Math.PI,
                _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy,
                rotate = cacher(function (x, y, rad) {
                    var X = x * Math.cos(rad) - y * Math.sin(rad),
                        Y = x * Math.sin(rad) + y * Math.cos(rad);
                    return {x: X, y: Y};
                });
            if (!recursive) {
                xy = rotate(x1, y1, -rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, -rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = Math.cos(PI / 180 * angle),
                    sin = Math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                rx = Math.max(rx, Math.abs(x));
                ry = Math.max(ry, Math.abs(y));
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) *
                        Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = Math.asin((y1 - cy) / ry),
                    f2 = Math.asin((y2 - cy) / ry);

                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (Math.abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * Math.cos(f2);
                y2 = cy + ry * Math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = Math.cos(f1),
                s1 = Math.sin(f1),
                c2 = Math.cos(f2),
                s2 = Math.sin(f2),
                t = Math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4].concat(res);
            } else {
                res = [m2, m3, m4].concat(res).join(",").split(",");
                var newres = [];
                for (var i = 0, ii = res[ln]; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        },
        findDotAtSegment = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var x = Math.pow(1 - t, 3) * p1x + Math.pow(1 - t, 2) * 3 * t * c1x + (1 - t) * 3 * t * t * c2x + Math.pow(t, 3) * p2x,
                y = Math.pow(1 - t, 3) * p1y + Math.pow(1 - t, 2) * 3 * t * c1y + (1 - t) * 3 * t * t * c2y + Math.pow(t, 3) * p2y,
                mx = p1x + 2 * t * (c1x - p1x) + t * t * (c2x - 2 * c1x + p1x),
                my = p1y + 2 * t * (c1y - p1y) + t * t * (c2y - 2 * c1y + p1y),
                nx = c1x + 2 * t * (c2x - c1x) + t * t * (p2x - 2 * c2x + c1x),
                ny = c1y + 2 * t * (c2y - c1y) + t * t * (p2y - 2 * c2y + c1y),
                ax = (1 - t) * p1x + t * c1x,
                ay = (1 - t) * p1y + t * c1y,
                cx = (1 - t) * c2x + t * p2x,
                cy = (1 - t) * c2y + t * p2y;
            return {x: x, y: y, m: {x: mx, y: my}, n: {x: nx, y: ny}, start: {x: ax, y: ay}, end: {x: cx, y: cy}};
        }),
        curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                c = p1x - c1x,
                t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a,
                t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a,
                y = [p1y, p2y],
                x = [p1x, p2x],
                dot1 = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1 > 0 && t1 < 1 ? t1 : 0),
                dot2 = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2 > 0 && t2 < 1 ? t2 : 0);
            x = x.concat(dot1.x, dot2.x);
            y = y.concat(dot1.y, dot2.y);
            a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
            b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
            c = p1y - c1y;
            t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
            t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;

            dot1 = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1 > 0 && t1 < 1 ? t1 : 0);
            dot2 = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2 > 0 && t2 < 1 ? t2 : 0);

            x = x.concat(dot1.x, dot2.x);
            y = y.concat(dot1.y, dot2.y);
            return {
                min: {x: Math.min[ap](Math, x), y: Math.min[ap](Math, y)},
                max: {x: Math.max[ap](Math, x), y: Math.max[ap](Math, y)}
            };
        }),
        path2curve = cacher(function (path, path2) {
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                processPath = function (path, d) {
                    var nx, ny;
                    if (!path) {
                        return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                    }
                    !(path[0] in {T:1, Q:1}) && (d.qx = d.qy = null);
                    switch (path[0]) {
                        case "M":
                            d.X = path[1];
                            d.Y = path[2];
                            break;
                        case "A":
                            path = ["C"].concat(a2c[ap](0, [d.x, d.y].concat(path.slice(1))));
                            break;
                        case "S":
                            nx = d.x + (d.x - (d.bx || d.x));
                            ny = d.y + (d.y - (d.by || d.y));
                            path = ["C", nx, ny].concat(path.slice(1));
                            break;
                        case "T":
                            d.qx = d.x + (d.x - (d.qx || d.x));
                            d.qy = d.y + (d.y - (d.qy || d.y));
                            path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;
                        case "Q":
                            d.qx = path[1];
                            d.qy = path[2];
                            path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;
                        case "L":
                            path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
                            break;
                        case "H":
                            path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
                            break;
                        case "V":
                            path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
                            break;
                        case "Z":
                            path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
                            break;
                    }
                    return path;
                },
                fixArc = function (pp, i) {
                    if (pp[i][ln] > 7) {
                        pp[i].shift();
                        var pi = pp[i];
                        while (pi[ln]) {
                            pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
                        }
                        pp.splice(i, 1);
                        ii = Math.max(p[ln], p2 && p2[ln] || 0);
                    }
                },
                fixM = function (path1, path2, a1, a2, i) {
                    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                        path2.splice(i, 0, ["M", a2.x, a2.y]);
                        a1.bx = 0;
                        a1.by = 0;
                        a1.x = path1[i][1];
                        a1.y = path1[i][2];
                        ii = Math.max(p[ln], p2 && p2[ln] || 0);
                    }
                };
            for (var i = 0, ii = Math.max(p[ln], p2 && p2[ln] || 0); i < ii; i++) {
                p[i] = processPath(p[i], attrs);
                fixArc(p, i);
                p2 && (p2[i] = processPath(p2[i], attrs2));
                p2 && fixArc(p2, i);
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg[ln],
                    seg2len = p2 && seg2[ln];
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = win[pf](seg[seglen - 4]) || attrs.x;
                attrs.by = win[pf](seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (win[pf](seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (win[pf](seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            return p2 ? [p, p2] : p;
        }, null, pathClone),
        parseDots = cacher(function (gradient) {
            var dots = [];
            for (var i = 0, ii = gradient[ln]; i < ii; i++) {
                var dot = {},
                    par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = R.getRGB(par[1]);
                if (dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                par[2] && (dot.offset = par[2] + "%");
                dots.push(dot);
            }
            for (var i = 1, ii = dots[ln] - 1; i < ii; i++) {
                if (!dots[i].offset) {
                    var start = win[pf](dots[i - 1].offset || 0),
                        end = 0;
                    for (var j = i + 1; j < ii; j++) {
                        if (dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if (!end) {
                        end = 100;
                        j = ii;
                    }
                    end = win[pf](end);
                    var d = (end - start) / (j - i + 1);
                    for (; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            return dots;
        }),
        getContainer = function () {
            var container,
                x,
                y,
                width,
                height;
            if (R.is(arguments[0], "string") || R.is(arguments[0], "object")) {
                if (R.is(arguments[0], "string")) {
                    container = doc.getElementById(arguments[0]);
                } else {
                    container = arguments[0];
                }
                if (container.tagName) {
                    if (arguments[1] == null) {
                        return {
                            container: container,
                            width: container.style.pixelWidth || container.offsetWidth,
                            height: container.style.pixelHeight || container.offsetHeight
                        };
                    } else {
                        return {container: container, width: arguments[1], height: arguments[2]};
                    }
                }
            } else if (R.is(arguments[0], "number") && arguments[ln] > 3) {
                return {container: 1, x: arguments[0], y: arguments[1], width: arguments[2], height: arguments[3]};
            }
        },
        plugins = function (con, add) {
            var that = this;
            for (var prop in add) if (add.hasOwnProperty(prop) && !(prop in con)) {
                switch (typeof add[prop]) {
                    case "function":
                        (function (f) {
                            con[prop] = con === that ? f : function () { return f[ap](that, arguments); };
                        })(add[prop]);
                    break;
                    case "object":
                        con[prop] = con[prop] || {};
                        plugins.call(this, con[prop], add[prop]);
                    break;
                    default:
                        con[prop] = add[prop];
                    break;
                }
            }
        };
     S.mix(R,{
       pathDimensions:pathDimensions,
       pathClone:pathClone,
       pathToRelative:pathToRelative,
       pathToAbsolute:pathToAbsolute,
       path2curve:path2curve,
       parseDots:parseDots,
       getContainer:getContainer,
       plugins:plugins
     });

    var Util = {},
    NameSpace = {};//导出kissy包中的命名空间
    S.mix(Util,{
      separator:separator
    });

    // SVG VML renderer init
    R.svg ? SVG.init(paper,R,Util,NameSpace) : VML.init(paper,R,Util,NameSpace);
    var Element = NameSpace.Element;
    // rest
    // Safari or Chrome (WebKit) rendering bug workaround method
    if ({"Apple Computer, Inc.": 1, "Google Inc.": 1}[navigator.vendor]) {
        paper.safari = function () {
            var rect = this.rect(-99, -99, this.width + 99, this.height + 99);
            setTimeout(function () {rect.remove();});
        };
    } else {
        paper.safari = function () {};
    }

    /******************** event begin ********************/
    var addEvent = (function () {
        if (doc.addEventListener) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    return fn.call(element, e);
                };
                obj.addEventListener(type, f, false);
                return function () {
                    obj.removeEventListener(type, f, false);
                    return true;
                };
            };
        } else if (doc.attachEvent) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    return fn.call(element, e || win.event);
                };
                obj.attachEvent("on" + type, f);
                var detacher = function () {
                    obj.detachEvent("on" + type, f);
                    return true;
                };
                if (type == "mouseover") {
                    obj.attachEvent("onmouseenter", f);
                    return function () {
                        obj.detachEvent("onmouseenter", f);
                        return detacher();
                    };
                } else if (type == "mouseout") {
                    obj.attachEvent("onmouseleave", f);
                    return function () {
                        obj.detachEvent("onmouseleave", f);
                        return detacher();
                    };
                }
                return detacher;
            };
        }
    })();
    for (var i = events[ln]; i--;) {
        (function (eventName) {
            Element[proto][eventName] = function (fn) {
                if (R.is(fn, "function")) {
                    this.events = this.events || {};
                    this.events[eventName] = this.events[eventName] || {};
                    this.events[eventName][fn] = this.events[eventName][fn] || [];
                    this.events[eventName][fn].push(addEvent(this.shape || this.node, eventName, fn, this));
                }
                return this;
            };
            Element[proto]["un" + eventName] = function (fn) {
                this.events &&
                this.events[eventName] &&
                this.events[eventName][fn] &&
                this.events[eventName][fn][ln] &&
                this.events[eventName][fn].shift()() &&
                !this.events[eventName][fn][ln] &&
                delete this.events[eventName][fn];
            };

        })(events[i]);
    }
    /******************** event end ********************/

     //kissy事件移植
     var EVENT_INCLUDES = [
       "on",
       "detach",
       "fire",
       "fireHandler",
       "delegate",
       "undelegate"
     ];

     S.each(EVENT_INCLUDES,function(k){
       Element.prototype[k] = function () {
         var self = this
           ,args = S.makeArray(arguments);
         args.unshift(self[0]);
         S.Event[k].apply(S.Event, args);
         return self;
       }
     });
     //end


    paper.circle = function (x, y, r) {
        return NameSpace.theCircle(this, x || 0, y || 0, r || 0);
    };

       paper.rect = function (x, y, w, h, r) {
           return NameSpace.theRect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
       };
    paper.ellipse = function (x, y, rx, ry) {
        return NameSpace.theEllipse(this, x || 0, y || 0, rx || 0, ry || 0);
    };
    paper.path = function (pathString) {
        pathString && !R.is(pathString, "string") && !R.is(pathString[0], "array") && (pathString += "");
        return NameSpace.thePath(R.format[ap](R, arguments), this);
    };
    paper.image = function (src, x, y, w, h) {
        return NameSpace.theImage(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
    };
    paper.text = function (x, y, text) {
        return NameSpace.theText(this, x || 0, y || 0, text || "");
    };
    paper.group = function(){
      return NameSpace.theGroup(this);
    };
    paper.set = function (itemsArray) {
        arguments[ln] > 1 && (itemsArray = Array[proto].splice.call(arguments, 0, arguments[ln]));
        return new Set(itemsArray);
    };
    paper.setSize = NameSpace.setSize;

    Element[proto].stop = function () {
        clearTimeout(this.animation_in_progress);
        return this;
    };
    Element[proto].scale = function (x, y, cx, cy) {
        if (x == null && y == null) {
            return {x: this._.sx, y: this._.sy, toString: function () { return this.x + " " + this.y; }};
        }
        y = y || x;
        !+y && (y = x);
        var dx,
            dy,
            dcx,
            dcy,
            a = this.attrs;
        if (x != 0) {
            var bb = this.getBBox(),
                rcx = bb.x + bb.width / 2,
                rcy = bb.y + bb.height / 2,
                kx = x / this._.sx,
                ky = y / this._.sy;
            cx = (+cx || cx == 0) ? cx : rcx;
            cy = (+cy || cy == 0) ? cy : rcy;
            var dirx = ~~(x / Math.abs(x)),
                diry = ~~(y / Math.abs(y)),
                s = this.node.style,
                ncx = cx + (rcx - cx) * dirx * kx,
                ncy = cy + (rcy - cy) * diry * ky;
            switch (this.type) {
                case "rect":
                case "image":
                    var neww = a.width * dirx * kx,
                        newh = a.height * diry * ky,
                        newr = a.r * Math.min(kx, ky),
                        newx = ncx - neww / 2,
                        newy = ncy - newh / 2;
                    this.attr({
                        width: neww,
                        height: newh,
                        x: newx,
                        y: newy,
                        r: newr
                    });
                    break;
                case "circle":
                case "ellipse":
                    this.attr({
                        rx: a.rx * kx,
                        ry: a.ry * ky,
                        r: a.r * Math.min(kx, ky),
                        cx: ncx,
                        cy: ncy
                    });
                    break;
                case "path":
                    var path = R.pathToRelative(a.path),
                        skip = true;
                    for (var i = 0, ii = path[ln]; i < ii; i++) {
                        var p = path[i];
                        if (p[0].toUpperCase() == "M" && skip) {
                            continue;
                        } else {
                            skip = false;
                        }
                        if (R.svg && p[0].toUpperCase() == "A") {
                            p[path[i][ln] - 2] *= kx;
                            p[path[i][ln] - 1] *= ky;
                            p[1] *= kx;
                            p[2] *= ky;
                            p[5] = +(dirx + diry ? !!+p[5] : !+p[5]);
                        } else {
                            for (var j = 1, jj = p[ln]; j < jj; j++) {
                                p[j] *= (j % 2) ? kx : ky;
                            }
                        }
                    }
                    var dim2 = R.pathDimensions(path),
                        dx = ncx - dim2.x - dim2.width / 2,
                        dy = ncy - dim2.y - dim2.height / 2;
                    path[0][1] += dx;
                    path[0][2] += dy;

                    this.attr({path: path});
                break;
            }
            if (this.type in {text: 1, image:1} && (dirx != 1 || diry != 1)) {
                if (this.transformations) {
                    this.transformations[2] = "scale(".concat(dirx, ",", diry, ")");
                    this.node.setAttribute("transform", this.transformations.join(" "));
                    dx = (dirx == -1) ? -a.x - (neww || 0) : a.x;
                    dy = (diry == -1) ? -a.y - (newh || 0) : a.y;
                    this.attr({x: dx, y: dy});
                    a.fx = dirx - 1;
                    a.fy = diry - 1;
                } else {
                    this.node.filterMatrix = " progid:DXImageTransform.Microsoft.Matrix(M11=".concat(dirx,
                        ", M12=0, M21=0, M22=", diry,
                        ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')");
                    s.filter = (this.node.filterMatrix || "") + (this.node.filterOpacity || "");
                }
            } else {
                if (this.transformations) {
                    this.transformations[2] = "";
                    this.node.setAttribute("transform", this.transformations.join(" "));
                    a.fx = 0;
                    a.fy = 0;
                } else {
                    this.node.filterMatrix = "";
                    s.filter = (this.node.filterMatrix || "") + (this.node.filterOpacity || "");
                }
            }
            a.scale = [x, y, cx, cy].join(" ");
            this._.sx = x;
            this._.sy = y;
        }
        return this;
    };

    // animation easing formulas
    R.easing_formulas = {
        linear: function (n) {
            return n;
        },
        "<": function (n) {
            return Math.pow(n, 3);
        },
        ">": function (n) {
            return Math.pow(n - 1, 3) + 1;
        },
        "<>": function (n) {
            n = n * 2;
            if (n < 1) {
                return Math.pow(n, 3) / 2;
            }
            n -= 2;
            return (Math.pow(n, 3) + 2) / 2;
        },
        backIn: function (n) {
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut: function (n) {
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic: function (n) {
            if (n == 0 || n == 1) {
                return n;
            }
            var p = .3,
                s = p / 4;
            return Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1;
        },
        bounce: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + .75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + .9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        }
    };

    Element[proto].animate = function (params, ms, easing, callback) {
        clearTimeout(this.animation_in_progress);
        if (R.is(easing, "function") || !easing) {
            callback = easing || null;
        }
        var from = {},
            to = {},
            diff = {},
            t = {x: 0, y: 0};
        for (var attr in params) if (params.hasOwnProperty(attr)) {
            if (attr in availableAnimAttrs) {
                from[attr] = this.attr(attr);
                (from[attr] == null) && (from[attr] = R.availableAttrs[attr]);
                to[attr] = params[attr];
                switch (availableAnimAttrs[attr]) {
                    case "number":
                        diff[attr] = (to[attr] - from[attr]) / ms;
                        break;
                    case "colour":
                        from[attr] = R.getRGB(from[attr]);
                        var toColour = R.getRGB(to[attr]);
                        diff[attr] = {
                            r: (toColour.r - from[attr].r) / ms,
                            g: (toColour.g - from[attr].g) / ms,
                            b: (toColour.b - from[attr].b) / ms
                        };
                        break;
                    case "path":
                        var pathes = R.path2curve(from[attr], to[attr]);
                        from[attr] = pathes[0];
                        to[attr] = pathes[1];
                        diff[attr] = [];
                        for (var i = 0, ii = from[attr][ln]; i < ii; i++) {
                            diff[attr][i] = [0];
                            for (var j = 1, jj = from[attr][i][ln]; j < jj; j++) {
                                diff[attr][i][j] = (to[attr][i][j] - from[attr][i][j]) / ms;
                            }
                        }
                        break;
                    case "csv":
                        var values = (params[attr] + "").split(Util.separator),
                            from2 = (from[attr] + "").split(Util.separator);
                        switch (attr) {
                            case "translation":
                                from[attr] = [0, 0];
                                diff[attr] = [values[0] / ms, values[1] / ms];
                            break;
                            case "rotation":
                                from[attr] = (from2[1] == values[1] && from2[2] == values[2]) ? from2 : [0, values[1], values[2]];
                                diff[attr] = [(values[0] - from[attr][0]) / ms, 0, 0];
                            break;
                            case "scale":
                                params[attr] = values;
                                from[attr] = (from[attr] + "").split(Util.separator);
                                diff[attr] = [(values[0] - from[attr][0]) / ms, (values[1] - from[attr][1]) / ms, 0, 0];
                            break;
                            case "clip-rect":
                                from[attr] = (from[attr] + "").split(Util.separator);
                                diff[attr] = [];
                                var i = 4;
                                while (i--) {
                                    diff[attr][i] = (values[i] - from[attr][i]) / ms;
                                }
                            break;
                        }
                        to[attr] = values;
                }
            }
        }
        var start = +new Date,
            prev = 0,
            upto255 = function (color) {
                return color > 255 ? 255 : color;
            },
            that = this;
        (function tick() {
            var time = new Date - start,
                set = {},
                now;
            if (time < ms) {
                var pos = R.easing_formulas[easing] ? R.easing_formulas[easing](time / ms) : time / ms;
                for (var attr in from) if (from.hasOwnProperty(attr)) {
                    switch (availableAnimAttrs[attr]) {
                        case "number":
                            now = +from[attr] + pos * ms * diff[attr];
                            break;
                        case "colour":
                            now = "rgb(" + [
                                upto255(~~(from[attr].r + pos * ms * diff[attr].r + .5)),
                                upto255(~~(from[attr].g + pos * ms * diff[attr].g + .5)),
                                upto255(~~(from[attr].b + pos * ms * diff[attr].b + .5))
                            ].join(",") + ")";
                            break;
                        case "path":
                            now = [];
                            for (var i = 0, ii = from[attr][ln]; i < ii; i++) {
                                now[i] = [from[attr][i][0]];
                                for (var j = 1, jj = from[attr][i][ln]; j < jj; j++) {
                                    now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                }
                                now[i] = now[i].join(" ");
                            }
                            now = now.join(" ");
                            break;
                        case "csv":
                            switch (attr) {
                                case "translation":
                                    var x = diff[attr][0] * (time - prev),
                                        y = diff[attr][1] * (time - prev);
                                    t.x += x;
                                    t.y += y;
                                    now = [x, y].join(" ");
                                break;
                                case "rotation":
                                    now = +from[attr][0] + pos * ms * diff[attr][0];
                                    from[attr][1] && (now += "," + from[attr][1] + "," + from[attr][2]);
                                break;
                                case "scale":
                                    now = [+from[attr][0] + pos * ms * diff[attr][0], +from[attr][1] + pos * ms * diff[attr][1], (2 in params[attr] ? params[attr][2] : ""), (3 in params[attr] ? params[attr][3] : "")].join(" ");
                                break;
                                case "clip-rect":
                                    now = [];
                                    var i = 4;
                                    while (i--) {
                                        now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                    }
                                break;
                            }
                            break;
                    }
                    set[attr] = now;
                }
                that.attr(set);
                that.animation_in_progress = setTimeout(tick);
                R.svg && paper.safari();
            } else {
                (t.x || t.y) && that.translate(-t.x, -t.y);
                that.attr(params);
                clearTimeout(that.animation_in_progress);
                R.svg && paper.safari();
                (R.is(callback, "function")) && callback.call(that);
            }
            prev = time;
        })();
        return this;
    };
    Element[proto].translate = function (x, y) {
        if (x == null) {
            return {x: this._.tx, y: this._.ty};
        }
        this._.tx += +x;
        this._.ty += +y;
        switch (this.type) {
            case "circle":
            case "ellipse":
                this.attr({cx: +x + this.attrs.cx, cy: +y + this.attrs.cy});
                break;
            case "rect":
            case "image":
            case "text":
                this.attr({x: +x + this.attrs.x, y: +y + this.attrs.y});
                break;
            case "path":
                var path = R.pathToRelative(this.attrs.path);
                path[0][1] += +x;
                path[0][2] += +y;
                this.attr({path: path});
			    break;
        }
        return this;
    };
    Element[proto].toString = function () {
        return "Rapha\u00ebl\u2019s object";
    };
    // Set
    var Set = function (items) {
        this.items = [];
        this[ln] = 0;
        if (items) {
            for (var i = 0, ii = items[ln]; i < ii; i++) {
                if (items[i] && (items[i].constructor == Element || items[i].constructor == Set)) {
                    this[this.items[ln]] = this.items[this.items[ln]] = items[i];
                    this[ln]++;
                }
            }
        }
    };
    Set[proto].push = function () {
        var item,
            len;
        for (var i = 0, ii = arguments[ln]; i < ii; i++) {
            item = arguments[i];
            if (item && (item.constructor == Element || item.constructor == Set)) {
                len = this.items[ln];
                this[len] = this.items[len] = item;
                this[ln]++;
            }
        }
        return this;
    };
    Set[proto].pop = function () {
        delete this[this[ln]--];
        return this.items.pop();
    };
    for (var method in Element[proto]) if (Element[proto].hasOwnProperty(method)) {
        Set[proto][method] = (function (methodname) {
            return function () {
                for (var i = 0, ii = this.items[ln]; i < ii; i++) {
                    this.items[i][methodname][ap](this.items[i], arguments);
                }
                return this;
            };
        })(method);
    }
    Set[proto].attr = function (name, value) {
        if (name && R.is(name, "array") && R.is(name[0], "object")) {
            for (var j = 0, jj = name[ln]; j < jj; j++) {
                this.items[j].attr(name[j]);

            }
        } else {
            for (var i = 0, ii = this.items[ln]; i < ii; i++) {
                this.items[i].attr[ap](this.items[i], arguments);
            }
        }
        return this;
    };
    Set[proto].animate = function (params, ms, easing, callback) {
        if (R.is(easing, "function") || !easing) {
            callback = easing || null;
        }
        var len = this.items[ln],
            i = len,
            set = this;
        if (callback) {
            var collector = function () {
                !--len && callback.call(set);
            };
            while (i--) {
                this.items[i].animate(params, ms, easing || collector, collector);
            }
        } else {
            while (i--) {
                this.items[i].animate(params, ms, easing);
            }
        }
        return this;
    };

    Set[proto].getBBox = function () {
        var x = [],
            y = [],
            w = [],
            h = [];
        for (var i = this.items[ln]; i--;) {
            var box = this.items[i].getBBox();
            x.push(box.x);
            y.push(box.y);
            w.push(box.x + box.width);
            h.push(box.y + box.height);
        }
        x = Math.min[ap](Math, x);
        y = Math.min[ap](Math, y);
        return {
            x: x,
            y: y,
            width: Math.max[ap](Math, w) - x,
            height: Math.max[ap](Math, h) - y
        };
    };

    R.registerFont = function (font) {
        if (!font.face) {
            return font;
        }
        this.fonts = this.fonts || {};
        var fontcopy = {
                w: font.w,
                face: {},
                glyphs: {}
            },
            family = font.face["font-family"];
        for (var prop in font.face) if (font.face.hasOwnProperty(prop)) {
            fontcopy.face[prop] = font.face[prop];
        }
        if (this.fonts[family]) {
            this.fonts[family].push(fontcopy);
        } else {
            this.fonts[family] = [fontcopy];
        }
        if (!font.svg) {
            fontcopy.face["units-per-em"] = win[pi](font.face["units-per-em"], 10);
            for (var glyph in font.glyphs) if (font.glyphs.hasOwnProperty(glyph)) {
                var path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {},
                    d: path.d && "M" + path.d.replace(/[mlcxtrv]/g, function (command) {
                            return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[command] || "M";
                        }) + "z"
                };
                if (path.k) {
                    for (var k in path.k) if (path.hasOwnProperty(k)) {
                        fontcopy.glyphs[glyph].k[k] = path.k[k];
                    }
                }
            }
        }
        return font;
    };
    paper.getFont = function (family, weight, style, stretch) {
        stretch = stretch || "normal";
        style = style || "normal";
        weight = +weight || {normal: 400, bold: 700, lighter: 300, bolder: 800}[weight] || 400;
        var font = R.fonts[family];
        if (!font) {
            var name = new RegExp("(^|\\s)" + family.replace(/[^\w\d\s+!~.:_-]/g, "") + "(\\s|$)", "i");
            for (var fontName in R.fonts) if (R.fonts.hasOwnProperty(fontName)) {
                if (name.test(fontName)) {
                    font = R.fonts[fontName];
                    break;
                }
            }
        }
        var thefont;
        if (font) {
            for (var i = 0, ii = font[ln]; i < ii; i++) {
                thefont = font[i];
                if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                    break;
                }
            }
        }
        return thefont;
    };
    paper.print = function (x, y, string, font, size) {
        var out = this.set(),
            letters = (string + "").split(""),
            shift = 0,
            path = "",
            scale;
        R.is(font, "string") && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face["units-per-em"];
            for (var i = 0, ii = letters[ln]; i < ii; i++) {
                var prev = i && font.glyphs[letters[i - 1]] || {},
                    curr = font.glyphs[letters[i]];
                shift += i ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) : 0;
                curr && curr.d && out.push(this.path(curr.d).attr({fill: "#000", stroke: "none", translation: [shift, 0]}));
            }
            out.scale(scale, scale, 0, y).translate(x, (size || 16) / 2);
        }
        return out;
    };

    R.format = function (token) {
        var args = R.is(arguments[1], "array") ? [0].concat(arguments[1]) : arguments;
        token && R.is(token, "string") && args[ln] - 1 && (token = token.replace(/\{(\d+)\}/g, function (str, i) {
            return args[++i] == null ? "" : args[i];
        }));
        return token || "";
    };
    R.el = Element[proto];
    return R;
   },{requires:['./svg','./vml']});
