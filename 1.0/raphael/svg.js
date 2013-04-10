KISSY.add('gallery/kcharts/1.0/raphael/svg',function(S){
  var doc   = document,
        win = window,
      proto = "prototype",
        ap  = "apply",
        ln  = "length",
        pf  = "parseFloat",
        pi  = "parseInt";
  return {
    init:function(paper,R,Util,NameSpace){
        paper.svgns = "http://www.w3.org/2000/svg";
        paper.xlink = "http://www.w3.org/1999/xlink";
        var round = function (num) {
            return +num + (Math.floor(num) == num) * .5;
        };
        var roundPath = function (path) {
            for (var i = 0, ii = path[ln]; i < ii; i++) {
                if (path[i][0].toLowerCase() != "a") {
                    for (var j = 1, jj = path[i][ln]; j < jj; j++) {
                        path[i][j] = round(path[i][j]);
                    }
                } else {
                    path[i][6] = round(path[i][6]);
                    path[i][7] = round(path[i][7]);
                }
            }
            return path;
        };
        var $ = function (el, attr) {
            if (attr) {
                for (var key in attr) if (attr.hasOwnProperty(key)) {
                    var attrval;
                    if(key === 'd'){
                      //只能处理两级数组
                      attrval = S.isArray(attr[key]) ? [].concat.apply([],attr[key]).join(' ') : attr[key];
                    }else{
                      attrval = attr[key];
                    }
                    el.setAttribute(key,attrval);
                }
                return el;
            } else {
                return doc.createElementNS(paper.svgns, el);
            }
        };
        R.toString = function () {
            return  "Your browser supports SVG.\nYou are running Rapha\u00ebl " + this.version;
        };
        var thePath = function (pathString, SVG) {
            var el = $("path");
            SVG.canvas && SVG.canvas.appendChild(el);
            var p = new Element(el, SVG);
            p.type = "path";
            setFillAndStroke(p, {fill: "none", stroke: "#000", path: pathString});
            return p;
        };
        var addGradientFill = function (o, gradient, SVG) {
            var type = "linear",
                fx = .5, fy = .5,
                s = o.style;
            gradient = (gradient + "").replace(/^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/, function (all, _fx, _fy) {
                type = "radial";
                if (_fx && _fy) {
                    fx = win[pf](_fx);
                    fy = win[pf](_fy);
                    if (Math.pow(fx - .5, 2) + Math.pow(fy - .5, 2) > .25) {
                        fy = Math.sqrt(.25 - Math.pow(fx - .5, 2)) + .5;
                    }
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
                var vector = [0, 0, Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180)],
                    max = 1 / (Math.max(Math.abs(vector[2]), Math.abs(vector[3])) || 1);
                vector[2] *= max;
                vector[3] *= max;
                if (vector[2] < 0) {
                    vector[0] = -vector[2];
                    vector[2] = 0;
                }
                if (vector[3] < 0) {
                    vector[1] = -vector[3];
                    vector[3] = 0;
                }
            }
            var dots = R.parseDots(gradient);
            if (!dots) {
                return null;
            }
            var el = $(type + "Gradient");
            el.id = "r" + (R.idGenerator++).toString(36);
            type == "radial" ? $(el, {fx: fx, fy: fy}) : $(el, {x1: vector[0], y1: vector[1], x2: vector[2], y2: vector[3]});
            SVG.defs.appendChild(el);
            for (var i = 0, ii = dots[ln]; i < ii; i++) {
                var stop = $("stop");
                $(stop, {
                    offset: dots[i].offset ? dots[i].offset : !i ? "0%" : "100%",
                    "stop-color": dots[i].color || "#fff"
                });
                el.appendChild(stop);
            };
            $(o, {
                fill: "url(#" + el.id + ")",
                opacity: 1,
                "fill-opacity": 1
            });
            s.fill = "";
            s.opacity = 1;
            s.fillOpacity = 1;
            return 1;
        };
        var updatePosition = function (o) {
            var bbox = o.getBBox();
            $(o.pattern, {patternTransform: R.format("translate({0},{1})", bbox.x, bbox.y)});
        };
        var setFillAndStroke = function (o, params) {
            var dasharray = {
                    "": [0],
                    "none": [0],
                    "-": [3, 1],
                    ".": [1, 1],
                    "-.": [3, 1, 1, 1],
                    "-..": [3, 1, 1, 1, 1, 1],
                    ". ": [1, 3],
                    "- ": [4, 3],
                    "--": [8, 3],
                    "- .": [4, 3, 1, 3],
                    "--.": [8, 3, 1, 3],
                    "--..": [8, 3, 1, 3, 1, 3]
                },
                node = o.node,
                attrs = o.attrs,
                rot = o.attr("rotation"),
                addDashes = function (o, value) {
                    value = dasharray[(value + "").toLowerCase()];
                    if (value) {
                        var width = o.attrs["stroke-width"] || "1",
                            butt = {round: width, square: width, butt: 0}[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                            dashes = [];
                        var i = value[ln];
                        while (i--) {
                            dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
                        }
                        $(node, {"stroke-dasharray": dashes.join(",")});
                    }
                };
            win[pf](rot) && o.rotate(0, true);
            for (var att in params) if (params.hasOwnProperty(att)) {
                if (!(att in R.availableAttrs)) {
                    continue;
                }
                var value = params[att];
                attrs[att] = value;
                switch (att) {
                    // Hyperlink
                    case "href":
                    case "title":
                    case "target":
                        var pn = node.parentNode;
                        if (pn.tagName.toLowerCase() != "a") {
                            var hl = $("a");
                            pn.insertBefore(hl, node);
                            hl.appendChild(node);
                            pn = hl;
                        }
                        pn.setAttributeNS(o.paper.xlink, att, value);
                      break;
                    case "clip-rect":
                        var rect = (value + "").split(Util.separator);
                        if (rect[ln] == 4) {
                            o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                            var el = $("clipPath"),
                                rc = $("rect");
                            el.id = "r" + (R.idGenerator++).toString(36);
                            $(rc, {
                                x: rect[0],
                                y: rect[1],
                                width: rect[2],
                                height: rect[3]
                            });
                            el.appendChild(rc);
                            o.paper.defs.appendChild(el);
                            $(node, {"clip-path": "url(#" + el.id + ")"});
                            o.clip = rc;
                        }
                        if (!value) {
                            var clip = doc.getElementById(node.getAttribute("clip-path").replace(/(^url\(#|\)$)/g, ""));
                            clip && clip.parentNode.removeChild(clip);
                            $(node, {"clip-path": ""});
                            delete o.clip;
                        }
                    break;
                    case "path":
                        if (value && o.type == "path") {
                            attrs.path = roundPath(R.pathToAbsolute(value));
                            $(node, {d: attrs.path});
                        }
                        break;
                    case "width":
                        node.setAttribute(att, value);
                        if (attrs.fx) {
                            att = "x";
                            value = attrs.x;
                        } else {
                            break;
                        }
                    case "x":
                        if (attrs.fx) {
                            value = -attrs.x - (attrs.width || 0);
                        }
                    case "rx":
                        if (att == "rx" && o.type == "rect") {
                            break;
                        }
                    case "cx":
                        node.setAttribute(att, value);
                        o.pattern && updatePosition(o);
                        break;
                    case "height":
                        node.setAttribute(att, value);
                        if (attrs.fy) {
                            att = "y";
                            value = attrs.y;
                        } else {
                            break;
                        }
                    case "y":
                        if (attrs.fy) {
                            value = -attrs.y - (attrs.height || 0);
                        }
                    case "ry":
                        if (att == "ry" && o.type == "rect") {
                            break;
                        }
                    case "cy":
                        node.setAttribute(att, value);
                        o.pattern && updatePosition(o);
                        break;
                    case "r":
                        if (o.type == "rect") {
                            $(node, {rx: value, ry: value});
                        } else {
                            node.setAttribute(att, value);
                        }
                        break;
                    case "src":
                        if (o.type == "image") {
                            node.setAttributeNS(o.paper.xlink, "href", value);
                        }
                        break;
                    case "stroke-width":
                        node.style.strokeWidth = value;
                        // Need following line for Firefox
                        node.setAttribute(att, value);
                        if (attrs["stroke-dasharray"]) {
                            addDashes(o, attrs["stroke-dasharray"]);
                        }
                        break;
                    case "stroke-dasharray":
                        addDashes(o, value);
                        break;
                    case "rotation":
                        rot = value;
                        o.rotate(value, true);
                        break;
                    case "translation":
                        var xy = (value + "").split(Util.separator);
                        o.translate((+xy[0] + 1 || 2) - 1, (+xy[1] + 1 || 2) - 1);
                        break;
                    case "scale":
                        var xy = (value + "").split(Util.separator);
                        o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, +xy[2] || null, +xy[3] || null);
                        break;
                    case "fill":
                        var isURL = (value + "").match(/^url\(['"]?([^\)]+)['"]?\)$/i);
                        if (isURL) {
                            var el = $("pattern"),
                                ig = $("image");
                            el.id = "r" + (R.idGenerator++).toString(36);
                            $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse"});
                            $(ig, {x: 0, y:0});
                            ig.setAttributeNS(o.paper.xlink, "href", isURL[1]);
                            el.appendChild(ig);

                            var img = doc.createElement("img");
                            img.style.cssText = "position:absolute;left:-9999em;top-9999em";
                            img.onload = function () {
                                $(el, {width: this.offsetWidth, height: this.offsetHeight});
                                $(ig, {width: this.offsetWidth, height: this.offsetHeight});
                                doc.body.removeChild(this);
                                paper.safari();
                            };
                            doc.body.appendChild(img);
                            img.src = isURL[1];
                            o.paper.defs.appendChild(el);
                            node.style.fill = "url(#" + el.id + ")";
                            $(node, {fill: "url(#" + el.id + ")"});
                            o.pattern = el;
                            o.pattern && updatePosition(o);
                            break;
                        }
                        if (!R.getRGB(value).error) {
                            delete params.gradient;
                            delete attrs.gradient;
                            if (!R.is(attrs.opacity, "undefined") && R.is(params.opacity, "undefined") ) {
                                node.style.opacity = attrs.opacity;
                                // Need following line for Firefox
                                $(node, {opacity: attrs.opacity});
                            }
                            if (!R.is(attrs["fill-opacity"], "undefined") && R.is(params["fill-opacity"], "undefined") ) {
                                node.style.fillOpacity = attrs["fill-opacity"];
                                // Need following line for Firefox
                                $(node, {"fill-opacity": attrs["fill-opacity"]});
                            }
                        } else if ((o.type in {circle: 1, ellipse: 1} || (value + "").charAt(0) != "r") && addGradientFill(node, value, o.paper)) {
                            attrs.gradient = value;
                            attrs.fill = "none";
                            break;
                        }
                    case "stroke":
                        node.style[att] = R.getRGB(value).hex;
                        // Need following line for Firefox
                        node.setAttribute(att, R.getRGB(value).hex);
                        break;
                    case "gradient":
                        (o.type in {circle: 1, ellipse: 1} || (value + "").charAt(0) != "r") && addGradientFill(node, value, o.paper);
                        break;
                    case "opacity":
                    case "fill-opacity":
                        if (attrs.gradient) {
                            var gradient = doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, ""));
                            if (gradient) {
                                var stops = gradient.getElementsByTagName("stop");
                                stops[stops[ln] - 1].setAttribute("stop-opacity", value);
                            }
                            break;
                        }
                    default:
                        att == "font-size" && (value = win[pi](value, 10) + "px");
                        var cssrule = att.replace(/(\-.)/g, function (w) {
                            return w.substring(1).toUpperCase();
                        });
                        node.style[cssrule] = value;
                        // Need following line for Firefox
                        node.setAttribute(att, value);
                        break;
                }
            }

            tuneText(o, params);
            win[pi](rot, 10) && o.rotate(rot, true);
        };
        var leading = 1.2;
        var tuneText = function (el, params) {
            if (el.type != "text" || !("text" in params || "font" in params || "font-size" in params || "x" in params || "y" in params)) {
                return;
            }
            var a = el.attrs,
                node = el.node,
                fontSize = node.firstChild ? win[pi](doc.defaultView.getComputedStyle(node.firstChild, "").getPropertyValue("font-size"), 10) : 10;

            if ("text" in params) {
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                var texts = (params.text + "").split("\n");
                for (var i = 0, ii = texts[ln]; i < ii; i++) {
                    var tspan = $("tspan");
                    i && $(tspan, {dy: fontSize * leading, x: a.x});
                    tspan.appendChild(doc.createTextNode(texts[i]));
                    node.appendChild(tspan);
                }
            } else {
                var texts = node.getElementsByTagName("tspan");
                for (var i = 0, ii = texts[ln]; i < ii; i++) {
                    i && $(texts[i], {dy: fontSize * leading, x: a.x});
                }
            }
            $(node, {y: a.y});
            var bb = el.getBBox(),
                dif = a.y - (bb.y + bb.height / 2);
            dif && $(node, {y: a.y + dif});
        };
        var Element = function (node, svg) {
            var X = 0,
                Y = 0;
            this[0] = node;
            this.node = node;
            node.raphael = this;
            this.paper = svg;
            this.attrs = this.attrs || {};
            this.transformations = []; // rotate, translate, scale
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg: 0, cx: 0, cy: 0},
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
            var bbox = this.getBBox();
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
            (cy == null) && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            cx = cx == null ? bbox.x + bbox.width / 2 : cx;
            cy = cy == null ? bbox.y + bbox.height / 2 : cy;
            if (this._.rt.deg) {
                this.transformations[0] = R.format("rotate({0} {1} {2})", this._.rt.deg, cx, cy);
                this.clip && $(this.clip, {transform: R.format("rotate({0} {1} {2})", -this._.rt.deg, cx, cy)});
            } else {
                this.transformations[0] = "";
                this.clip && $(this.clip, {transform: ""});
            }
            $(this.node, {transform: this.transformations.join(" ")});
            return this;
        };
        Element[proto].hide = function () {
            this.node.style.display = "none";
            return this;
        };
        Element[proto].show = function () {
            this.node.style.display = "block";
            return this;
        };
        Element[proto].remove = function () {
            this.node.parentNode.removeChild(this.node);
        };
        Element[proto].getBBox = function () {
            if (this.type == "path") {
                return R.pathDimensions(this.attrs.path);
            }
            if (this.node.style.display == "none") {
                this.show();
                var hide = true;
            }
            var bbox = {};
            try {
                bbox = this.node.getBBox();
            } catch(e) {
                // Firefox 3.0.x plays badly here
            } finally {
                bbox = bbox || {};
            }
            if (this.type == "text") {
                bbox = {x: bbox.x, y: Infinity, width: bbox.width, height: 0};
                for (var i = 0, ii = this.node.getNumberOfChars(); i < ii; i++) {
                    var bb = this.node.getExtentOfChar(i);
                    (bb.y < bbox.y) && (bbox.y = bb.y);
                    (bb.y + bb.height - bbox.y > bbox.height) && (bbox.height = bb.y + bb.height - bbox.y);
                }
            }
            hide && this.hide();
            return bbox;
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
            if (arguments[ln] == 1 && R.is(arguments[0], "array")) {
                var values = {};
                for (var j in arguments[0]) if (arguments[0].hasOwnProperty(j)) {
                    values[arguments[0][j]] = this.attrs[arguments[0][j]];
                }
                return values;
            }
            if (arguments[ln] == 2) {
                var params = {};
                params[arguments[0]] = arguments[1];
                setFillAndStroke(this, params);
            } else if (arguments[ln] == 1 && R.is(arguments[0], "object")) {
                setFillAndStroke(this, arguments[0]);
            }
            return this;
        };
        Element[proto].toFront = function () {
            this.node.parentNode.appendChild(this.node);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (element.node.nextSibling) {
                element.node.parentNode.insertBefore(this.node, element.node.nextSibling);
            } else {
                element.node.parentNode.appendChild(this.node);
            }
            return this;
        };
        Element[proto].insertBefore = function (element) {
            var node = element.node;
            node.parentNode.insertBefore(this.node, node);
            return this;
        };

        var theCircle = function (svg, x, y, r) {
            x = round(x);
            y = round(y);
            var el = $("circle");
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, r: r, fill: "none", stroke: "#000"};
            res.type = "circle";
            $(el, res.attrs);
            return res;
        };
        var theRect = function (svg, x, y, w, h, r) {
            x = round(x);
            y = round(y);
            var el = $("rect");
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, r: r || 0, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000"};
            res.type = "rect";
            $(el, res.attrs);
            return res;
        };
        var theEllipse = function (svg, x, y, rx, ry) {
            x = round(x);
            y = round(y);
            var el = $("ellipse");
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000"};
            res.type = "ellipse";
            $(el, res.attrs);
            return res;
        };
        var theImage = function (svg, src, x, y, w, h) {
            var el = $("image");
            $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
            el.setAttributeNS(svg.xlink, "href", src);
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, src: src};
            res.type = "image";
            return res;
        };
        var theText = function (svg, x, y, text) {
            var el = $("text");
            $(el, {x: x, y: y, "text-anchor": "middle"});
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, "text-anchor": "middle", text: text, font: R.availableAttrs.font, stroke: "none", fill: "#000"};
            res.type = "text";
            setFillAndStroke(res, res.attrs);
            return res;
        };
        var theGroup = function(svg){
          var el = $("g")
            ,ret;
          svg.canvas && svg.canvas.appendChild(el);
          ret = new Element(el,svg);
          ret.type = "group";

          ret.canvas = el;
          //todo:remove all children
          ret.clear = function(){}
          ret.container = svg.container;
          S.mix(ret,paper,false,["remove","safari","circle","rect","ellipse","path","image","text"]);
          return ret;
        };
        var setSize = function (width, height) {
            this.width = width || this.width;
            this.height = height || this.height;
            this.canvas.setAttribute("width", this.width);
            this.canvas.setAttribute("height", this.height);
            return this;
        };

        var create = function () {
            var con = R.getContainer[ap](null, arguments),
                container = con && con.container,
                x = con.x,
                y = con.y,
                width = con.width,
                height = con.height;
            if (!container) {
                throw new Error("SVG container not found.");
            }
            paper.canvas = $("svg");
            var cnvs = paper.canvas,
                stl = cnvs.style;
            cnvs.setAttribute("width", width || 512);
            paper.width = width || 512;
            cnvs.setAttribute("height", height || 342);
            paper.height = height || 342;
            if (container == 1) {
                doc.body.appendChild(cnvs);
                stl.position = "absolute";
                stl.left = x + "px";
                stl.top = y + "px";
            } else {
                if (container.firstChild) {
                    container.insertBefore(cnvs, container.firstChild);
                } else {
                    container.appendChild(cnvs);
                }
            }
            container = {
                canvas: cnvs,
                clear: function () {
                    while (this.canvas.firstChild) {
                        this.canvas.removeChild(this.canvas.firstChild);
                    }
                    this.desc = $("desc");
                    this.defs = $("defs");
                    this.desc.appendChild(doc.createTextNode("Created with Rapha\u00ebl"));
                    this.canvas.appendChild(this.desc);
                    this.canvas.appendChild(this.defs);
                },
                container:cnvs.parentNode
            };
            for (var prop in paper) if (paper.hasOwnProperty(prop)) {
                if (prop != "create") {
                    container[prop] = paper[prop];
                }
            }
            R.plugins.call(container, container, R.fn);
            container.clear();
            container.raphael = R;
            return container;
        };
        paper.remove = function () {
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
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