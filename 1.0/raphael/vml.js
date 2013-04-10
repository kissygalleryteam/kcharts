KISSY.add('gallery/kcharts/1.0/raphael/vml',function(S){
  var doc   = document,
        win = window,
      proto = "prototype",
        ap  = "apply",
        ln  = "length",
        pf  = "parseFloat"
  return {
    init:function(paper,R,Util,NameSpace){
        var path2vml = function (path) {
            var pa = R.path2curve(path);
            for (var i = 0, ii = pa[ln]; i < ii; i++) {
                pa[i][0] = (pa[i][0] + "").toLowerCase();
                pa[i][0] == "z" && (pa[i][0] = "x");
                for (var j = 1, jj = pa[i][ln]; j < jj; j++) {
                    pa[i][j] = ~~(pa[i][j] + .5);
                }
            }
            return (pa + "");
        };
        R.toString = function () {
            return  "Your browser doesn\u2019t support SVG. Assuming it is Internet Explorer and falling down to VML.\nYou are running Rapha\u00ebl " + this.version;
        };
        var thePath = function (pathString, VML) {
            var g = createNode("group"), gl = g.style;
            gl.position = "absolute";
            gl.left = 0;
            gl.top = 0;
            gl.width = VML.width + "px";
            gl.height = VML.height + "px";
            g.coordsize = VML.coordsize;
            g.coordorigin = VML.coordorigin;
            var el = createNode("shape"), ol = el.style;
            ol.width = VML.width + "px";
            ol.height = VML.height + "px";
            el.path = "";
            el.coordsize = this.coordsize;
            el.coordorigin = this.coordorigin;
            g.appendChild(el);
            var p = new Element(el, g, VML);
            p.isAbsolute = true;
            p.type = "path";
            p.path = [];
            p.Path = "";
            if (pathString) {
                p.attrs.path = R.parsePathString(pathString);
                p.node.path = path2vml(p.attrs.path);
            }
            setFillAndStroke(p, {fill: "none", stroke: "#000"});
            p.setBox();
            VML.canvas.appendChild(g);
            return p;
        };
        var setFillAndStroke = function (o, params) {
            o.attrs = o.attrs || {};
            var node = o.node,
                a = o.attrs,
                s = node.style,
                xy,
                res = o;
            for (var par in params) if (params.hasOwnProperty(par)) {
                a[par] = params[par];
            }
            params.href && (node.href = params.href);
            params.title && (node.title = params.title);
            params.target && (node.target = params.target);
            if (params.path && o.type == "path") {
                a.path = R.parsePathString(params.path);
                node.path = path2vml(a.path);
            }
            if (params.rotation != null) {
                o.rotate(params.rotation, true);
            }
            if (params.translation) {
                xy = (params.translation + "").split(Util.separator);
                o.translate(xy[0], xy[1]);
            }
            if (params.scale) {
                xy = (params.scale + "").split(Util.separator);
                o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, +xy[2] || null, +xy[3] || null);
            }
            if ("clip-rect" in params) {
                var rect = (params["clip-rect"] + "").split(Util.separator);
                if (rect[ln] == 4) {
                    rect[2] = +rect[2] + (+rect[0]);
                    rect[3] = +rect[3] + (+rect[1]);
                    var div = node.clipRect || doc.createElement("div"),
                        dstyle = div.style,
                        group = node.parentNode;
                    dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                    if (!node.clipRect) {
                        dstyle.position = "absolute";
                        dstyle.top = 0;
                        dstyle.left = 0;
                        dstyle.width = o.paper.width + "px";
                        dstyle.height = o.paper.height + "px";
                        group.parentNode.insertBefore(div, group);
                        div.appendChild(group);
                        node.clipRect = div;
                    }
                }
                if (!params["clip-rect"]) {
                    node.clipRect && (node.clipRect.style.clip = "");
                }
            }
            if (o.type == "image" && params.src) {
                node.src = params.src;
            }
            if (o.type == "image" && params.opacity) {
                node.filterOpacity = " progid:DXImageTransform.Microsoft.Alpha(opacity=" + (params.opacity * 100) + ")";
                s.filter = (node.filterMatrix || "") + (node.filterOpacity || "");
            }
            params.font && (s.font = params.font);
            params["font-family"] && (s.fontFamily = '"' + params["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, "") + '"');
            params["font-size"] && (s.fontSize = params["font-size"]);
            params["font-weight"] && (s.fontWeight = params["font-weight"]);
            params["font-style"] && (s.fontStyle = params["font-style"]);
            if (params.opacity != null ||
                params["stroke-width"] != null ||
                params.fill != null ||
                params.stroke != null ||
                params["stroke-width"] != null ||
                params["stroke-opacity"] != null ||
                params["fill-opacity"] != null ||
                params["stroke-dasharray"] != null ||
                params["stroke-miterlimit"] != null ||
                params["stroke-linejoin"] != null ||
                params["stroke-linecap"] != null) {
                node = o.shape || node;
                var fill = (node.getElementsByTagName("fill") && node.getElementsByTagName("fill")[0]),
                    newfill = false;
                !fill && (newfill = fill = createNode("fill"));
                if ("fill-opacity" in params || "opacity" in params) {
                    var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1);
                    opacity < 0 && (opacity = 0);
                    opacity > 1 && (opacity = 1);
                    fill.opacity = opacity;
                }
                params.fill && (fill.on = true);
                if (fill.on == null || params.fill == "none") {
                    fill.on = false;
                }
                if (fill.on && params.fill) {
                    var isURL = params.fill.match(/^url\(([^\)]+)\)$/i);
                    if (isURL) {
                        fill.src = isURL[1];
                        fill.type = "tile";
                    } else {
                        fill.color = R.getRGB(params.fill).hex;
                        fill.src = "";
                        fill.type = "solid";
                        if (R.getRGB(params.fill).error && (res.type in {circle: 1, ellipse: 1} || (params.fill + "").charAt(0) != "r") && addGradientFill(res, params.fill)) {
                            a.fill = "none";
                            a.gradient = params.fill;
                        }
                    }
                }
                newfill && node.appendChild(fill);
                var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
                newstroke = false;
                !stroke && (newstroke = stroke = createNode("stroke"));
                if ((params.stroke && params.stroke != "none") ||
                    params["stroke-width"] ||
                    params["stroke-opacity"] != null ||
                    params["stroke-dasharray"] ||
                    params["stroke-miterlimit"] ||
                    params["stroke-linejoin"] ||
                    params["stroke-linecap"]) {
                    stroke.on = true;
                }
                (params.stroke == "none" || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
                stroke.on && params.stroke && (stroke.color = R.getRGB(params.stroke).hex);
                var opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1);
                opacity < 0 && (opacity = 0);
                opacity > 1 && (opacity = 1);
                stroke.opacity = opacity;
                params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
                stroke.miterlimit = params["stroke-miterlimit"] || 8;
                params["stroke-linecap"] && (stroke.endcap = {butt: "flat", square: "square", round: "round"}[params["stroke-linecap"]] || "miter");
                params["stroke-width"] && (stroke.weight = (win[pf](params["stroke-width"]) || 1) * 12 / 16);
                if (params["stroke-dasharray"]) {
                    var dasharray = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    stroke.dashstyle = dasharray[params["stroke-dasharray"]] || "";
                }
                newstroke && node.appendChild(stroke);
            }
            if (res.type == "text") {
                var s = res.paper.span.style;
                a.font && (s.font = a.font);
                a["font-family"] && (s.fontFamily = a["font-family"]);
                a["font-size"] && (s.fontSize = a["font-size"]);
                a["font-weight"] && (s.fontWeight = a["font-weight"]);
                a["font-style"] && (s.fontStyle = a["font-style"]);
                res.node.string && (res.paper.span.innerHTML = res.node.string.replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
                res.W = a.w = res.paper.span.offsetWidth;
                res.H = a.h = res.paper.span.offsetHeight;
                res.X = a.x;
                res.Y = a.y + ~~(res.H / 2 + .5);

                // text-anchor emulation
                switch (a["text-anchor"]) {
                    case "start":
                        res.node.style["v-text-align"] = "left";
                        res.bbx = ~~(res.W / 2 + .5);
                    break;
                    case "end":
                        res.node.style["v-text-align"] = "right";
                        res.bbx = -~~(res.W / 2 + .5);
                    break;
                    default:
                        res.node.style["v-text-align"] = "center";
                    break;
                }
            }
        };
        var addGradientFill = function (o, gradient) {
            o.attrs = o.attrs || {};
            var attrs = o.attrs,
                fill = o.node.getElementsByTagName("fill"),
                type = "linear",
                fxfy = ".5 .5";
            o.attrs.gradient = gradient;
            gradient = (gradient + "").replace(/^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/, function (all, fx, fy) {
                type = "radial";
                if (fx && fy) {
                    fx = win[pf](fx);
                    fy = win[pf](fy);
                    if (Math.pow(fx - .5, 2) + Math.pow(fy - .5, 2) > .25) {
                        fy = Math.sqrt(.25 - Math.pow(fx - .5, 2)) + .5;
                    }
                    fxfy = fx + " " + fy;
                }
                return "";
            });
            gradient = gradient.split(/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -win[pf](angle);
                if (isNaN(angle)) {
                    return null;
                }
            }
            var dots = R.parseDots(gradient);
            if (!dots) {
                return null;
            }
            o = o.shape || o.node;
            fill = fill[0] || createNode("fill");
            if (dots[ln]) {
                fill.on = true;
                fill.method = "none";
                fill.type = (type == "radial") ? "gradientradial" : "gradient";
                fill.color = dots[0].color;
                fill.color2 = dots[dots[ln] - 1].color;
                var clrs = [];
                for (var i = 0, ii = dots[ln]; i < ii; i++) {
                    dots[i].offset && clrs.push(dots[i].offset + " " + dots[i].color);
                }
                if (clrs[ln] && fill.colors) {
                    fill.colors.value = clrs.join(",");
                } else {
                    fill.colors.value = "0% " + fill.color;
                }
                if (type == "radial") {
                    fill.focus = "100%";
                    fill.focussize = fxfy;
                    fill.focusposition = fxfy;
                } else {
                    fill.angle = (270 - angle) % 360;
                }
            }
            return 1;
        };
        var Element = function (node, group, vml) {
            var Rotation = 0,
                RotX = 0,
                RotY = 0,
                Scale = 1;
            this[0] = node;
            this.node = node;
            node.raphael = this;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.Group = group;
            this.paper = vml;
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg:0},
                sx: 1,
                sy: 1
            };
        };
        Element[proto].rotate = function (deg, cx, cy) {
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy].join(" ");
                }
                return this._.rt.deg;
            }
            deg = (deg + "").split(Util.separator);
            if (deg[ln] - 1) {
                cx = win[pf](deg[1]);
                cy = win[pf](deg[2]);
            }
            deg = win[pf](deg[0]);
            if (cx != null) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            cy == null && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            this.setBox(this.attrs, cx, cy);
            this.Group.style.rotation = this._.rt.deg;
            // gradient fix for rotation. TODO
            // var fill = (this.shape || this.node).getElementsByTagName("fill");
            // fill = fill[0] || {};
            // var b = ((360 - this._.rt.deg) - 270) % 360;
            // !R.is(fill.angle, "undefined") && (fill.angle = b);
            return this;
        };
        Element[proto].setBox = function (params, cx, cy) {
            var gs = this.Group.style,
                os = (this.shape && this.shape.style) || this.node.style;
            params = params || {};
            for (var i in params) if (params.hasOwnProperty(i)) {
                this.attrs[i] = params[i];
            }
            cx = cx || this._.rt.cx;
            cy = cy || this._.rt.cy;
            var attr = this.attrs,
                x,
                y,
                w,
                h;
            switch (this.type) {
                case "circle":
                    x = attr.cx - attr.r;
                    y = attr.cy - attr.r;
                    w = h = attr.r * 2;
                    break;
                case "ellipse":
                    x = attr.cx - attr.rx;
                    y = attr.cy - attr.ry;
                    w = attr.rx * 2;
                    h = attr.ry * 2;
                    break;
                case "rect":
                case "image":
                    x = attr.x;
                    y = attr.y;
                    w = attr.width || 0;
                    h = attr.height || 0;
                    break;
                case "text":
                    this.textpath.v = ["m", ~~(attr.x + .5), ", ", ~~(attr.y - 2 + .5), "l", ~~(attr.x + .5) + 1, ", ", ~~(attr.y - 2 + .5)].join("");
                    x = attr.x - ~~(this.W / 2 + .5);
                    y = attr.y - this.H / 2;
                    w = this.W;
                    h = this.H;
                    break;
                case "path":
                    if (!this.attrs.path) {
                        x = 0;
                        y = 0;
                        w = this.paper.width;
                        h = this.paper.height;
                    } else {
                        var dim = R.pathDimensions(this.attrs.path);
                        x = dim.x;
                        y = dim.y;
                        w = dim.width || this.paper.width;
                        h = dim.height || this.paper.height;
                    }
                    break;
                default:
                    x = 0;
                    y = 0;
                    w = this.paper.width;
                    h = this.paper.height;
                    break;
            }

            // cx = (cx == null) ? x + w / 2 : cx;
            // cy = (cy == null) ? y + h / 2 : cy;
            cx = cx ? cx : x + w / 2;
            cy = cy ? cy : y + h / 2;
            var left = cx - this.paper.width / 2,
                top = cy - this.paper.height / 2;

            if (this.type == "path" || this.type == "text") {
                (gs.left != left + "px") && (gs.left = left + "px");
                (gs.top != top + "px") && (gs.top = top + "px");
                this.X = this.type == "text" ? x : -left;
                this.Y = this.type == "text" ? y : -top;
                this.W = w;
                this.H = h;
                (os.left != -left + "px") && (os.left = -left + "px");
                (os.top != -top + "px") && (os.top = -top + "px");
            } else {
                (gs.left != left + "px") && (gs.left = left + "px");
                (gs.top != top + "px") && (gs.top = top + "px");
                this.X = x;
                this.Y = y;
                this.W = w;
                this.H = h;
                (gs.width != this.paper.width + "px") && (gs.width = this.paper.width + "px");
                (gs.height != this.paper.height + "px") && (gs.height = this.paper.height + "px");
                (os.left != x - left + "px") && (os.left = x - left + "px");
                (os.top != y - top + "px") && (os.top = y - top + "px");
                (os.width != w + "px") && (os.width = w + "px");
                (os.height != h + "px") && (os.height = h + "px");
                var arcsize = (+params.r || 0) / (Math.min(w, h));
                if (this.type == "rect" && this.arcsize != arcsize && (arcsize || this.arcsize)) {
                    // We should replace element with the new one
                    var o = createNode(arcsize ? "roundrect" : "rect");
                    o.arcsize = arcsize;
                    this.Group.appendChild(o);
                    this.node.parentNode.removeChild(this.node);
                    this.node = o;
                    this.arcsize = arcsize;
                    setFillAndStroke(this, this.attrs);
                    this.setBox(this.attrs);
                }
            }
        };
        Element[proto].hide = function () {
            this.Group.style.display = "none";
            return this;
        };
        Element[proto].show = function () {
            this.Group.style.display = "block";
            return this;
        };
        Element[proto].getBBox = function () {
            if (this.type == "path") {
                return R.pathDimensions(this.attrs.path);
            }
            return {
                x: this.X + (this.bbx || 0),
                y: this.Y,
                width: this.W,
                height: this.H
            };
        };
        Element[proto].remove = function () {
            this[0].parentNode.removeChild(this[0]);
            this.Group.parentNode.removeChild(this.Group);
            this.shape && this.shape.parentNode.removeChild(this.shape);
        };
        Element[proto].attr = function () {
            if (arguments[ln] == 1 && R.is(arguments[0], "string")) {
                if (arguments[0] == "translation") {
                    return this.translate();
                }
                if (arguments[0] == "rotation") {
                    return this.rotate();
                }
                if (arguments[0] == "scale") {
                    return this.scale();
                }
                return this.attrs[arguments[0]];
            }
            if (this.attrs && arguments[ln] == 1 && R.is(arguments[0], "array")) {
                var values = {};
                for (var i = 0, ii = arguments[0][ln]; i < ii; i++) {
                    values[arguments[0][i]] = this.attrs[arguments[0][i]];
                };
                return values;
            }
            var params;
            if (arguments[ln] == 2) {
                params = {};
                params[arguments[0]] = arguments[1];
            }
            if (arguments[ln] == 1 && R.is(arguments[0], "object")) {
                params = arguments[0];
            }
            if (params) {
                if (params.gradient && (this.type in {circle: 1, ellipse: 1} || (params.gradient + "").charAt(0) != "r")) {
                    addGradientFill(this, params.gradient);
                }
                if (params.text && this.type == "text") {
                    this.node.string = params.text;
                }
                setFillAndStroke(this, params);
                this.setBox(this.attrs);
            }
            return this;
        };
        Element[proto].toFront = function () {
            this.Group.parentNode.appendChild(this.Group);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.Group.parentNode.firstChild != this.Group) {
                this.Group.parentNode.insertBefore(this.Group, this.Group.parentNode.firstChild);
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (element.Group.nextSibling) {
                element.Group.parentNode.insertBefore(this.Group, element.Group.nextSibling);
            } else {
                element.Group.parentNode.appendChild(this.Group);
            }
            return this;
        };
        Element[proto].insertBefore = function (element) {
            element.Group.parentNode.insertBefore(this.Group, element.Group);
            return this;
        };

        var theCircle = function (vml, x, y, r) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            g.appendChild(o);
            var res = new Element(o, g, vml);
            res.type = "circle";
            setFillAndStroke(res, {stroke: "#000", fill: "none"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.r = r;
            res.setBox({x: x - r, y: y - r, width: r * 2, height: r * 2});
            vml.canvas.appendChild(g);
            return res;
        };
        var theRect = function (vml, x, y, w, h, r) {
            var g = createNode("group"),
                o = createNode(r ? "roundrect" : "rect"),
                arcsize = (+r || 0) / (Math.min(w, h));
            o.arcsize = arcsize;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            g.appendChild(o);
            var res = new Element(o, g, vml);
            res.type = "rect";
            setFillAndStroke(res, {stroke: "#000"});
            res.arcsize = arcsize;
            res.setBox({x: x, y: y, width: w, height: h, r: +r});
            vml.canvas.appendChild(g);
            return res;
        };
        var theEllipse = function (vml, x, y, rx, ry) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            g.appendChild(o);
            var res = new Element(o, g, vml);
            res.type = "ellipse";
            setFillAndStroke(res, {stroke: "#000"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.rx = rx;
            res.attrs.ry = ry;
            res.setBox({x: x - rx, y: y - ry, width: rx * 2, height: ry * 2});
            vml.canvas.appendChild(g);
            return res;
        };
        var theImage = function (vml, src, x, y, w, h) {
            var g = createNode("group"),
                o = createNode("image"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            o.src = src;
            g.appendChild(o);
            var res = new Element(o, g, vml);
            res.type = "image";
            res.attrs.src = src;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = w;
            res.attrs.h = h;
            res.setBox({x: x, y: y, width: w, height: h});
            vml.canvas.appendChild(g);
            return res;
        };
        var theText = function (vml, x, y, text) {
            var g = createNode("group"),
                el = createNode("shape"),
                ol = el.style,
                path = createNode("path"),
                ps = path.style,
                o = createNode("textpath");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            path.v = R.format("m{0},{1}l{2},{1}", ~~(x + .5), ~~(y + .5), ~~(x + .5) + 1);
            path.textpathok = true;
            ol.width = vml.width;
            ol.height = vml.height;
            o.string = String(text);
            o.on = true;
            el.appendChild(o);
            el.appendChild(path);
            g.appendChild(el);
            var res = new Element(o, g, vml);
            res.shape = el;
            res.textpath = path;
            res.type = "text";
            res.attrs.text = text;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = 1;
            res.attrs.h = 1;
            setFillAndStroke(res, {font: R.availableAttrs.font, stroke: "none", fill: "#000"});
            res.setBox();
            vml.canvas.appendChild(g);
            return res;
        };
        var theGroup = function(vml){
          var g = createNode("group"),gl = g.style
            ,ret
          vml.canvas.appendChild(g);
          gl.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
          g.coordsize = vml.coordsize;
          g.coordorigin = vml.coordorigin;
          ret = new Element(g,g,vml);
          ret.type = "group";
          ret.clear = S.noop;
          ret.canvas = g;
          S.mix(ret,paper,false,["remove","circle","rect","ellipse","path","image","text"]);
          S.mix(ret,vml,false,['container','raphael','width','height','coordsize','coordorigin']);
          return ret;
        };
        var setSize = function (width, height) {
            var cs = this.canvas.style;
            this.width = win[pf](width || this.width);
            this.height = win[pf](height || this.height);
            cs.width = this.width + "px";
            cs.height = this.height + "px";
            cs.clip = "rect(0 " + this.width + "px " + this.height + "px 0)";
            this.coordsize = this.width + " " + this.height;
            return this;
        };
        doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            var createNode = function (tagName) {
                return doc.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            var createNode = function (tagName) {
                return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        }
        var create = function () {
            var con = R.getContainer[ap](null, arguments),
                container = con.container,
                height = con.height,
                s,
                width = con.width,
                x = con.x,
                y = con.y;
            if (!container) {
                throw new Error("VML container not found.");
            }
            var res = {},
                div = doc.createElement("div"),
                c = res.canvas = div,
                cs = c.style;
            width = win[pf](width) || 512;
            height = win[pf](height) || 342;
            res.width = width;
            res.height = height;
            res.coordsize = width + " " + height;
            res.coordorigin = "0 0";
            res.span = doc.createElement("span");
            res.span.style.cssText = "position:absolute;left:-9999px;top:-9999px;padding:0;margin:0;line-height:1;display:inline;";
            c.appendChild(res.span);
            cs.cssText = R.format("width:{0}px;height:{1}px;position:absolute;clip:rect(0 {0}px {1}px 0)", width, height);
            if (container == 1) {
                doc.body.appendChild(c);
                cs.left = x + "px";
                cs.top = y + "px";
                container = {
                    style: {
                        width: width,
                        height: height
                    }
                };
            } else {
                container.style.width = width;
                container.style.height = height;
                if (container.firstChild) {
                    container.insertBefore(c, container.firstChild);
                } else {
                    container.appendChild(c);
                }
            }
            for (var prop in paper) if (paper.hasOwnProperty(prop)) {
                res[prop] = paper[prop];
            }
            R.plugins.call(res, res, R.fn);
            res.clear = function () {
                while (c.firstChild) {
                    c.removeChild(c.firstChild);
                }
            };
            res.container = div;//容器
            res.raphael = R;
            return res;
        };
        paper.remove = function () {
            this.canvas.parentNode.removeChild(this.canvas);
        };
        //export namespace
        S.mix(NameSpace,{
          Element : Element,
          create:create,
          setSize:setSize,
          thePath:thePath,
          theRect:theRect,
          theCircle:theCircle,
          theEllipse:theEllipse,
          theText:theText,
          theImage:theImage,
          theGroup:theGroup
        });
    }
  };
});
