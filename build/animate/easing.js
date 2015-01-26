define('kg/kcharts/5.0.1/animate/easing',[],function(require, exports, module) {


    var PI = Math.PI,
        pow = Math.pow,
        sin = Math.sin,
        parseNumber = parseFloat,
        CUBIC_BEZIER_REG = /^cubic-bezier\(([^,]+),([^,]+),([^,]+),([^,]+)\)$/i,
        BACK_CONST = 1.70158;

    function easeNone(t) {
        return t;
    }

    var Easing = {
        
        swing: function (t) {
            return ( -Math.cos(t * PI) / 2 ) + 0.5;
        },

        
        'easeNone': easeNone,

        'linear': easeNone,

        
        'easeIn': function (t) {
            return t * t;
        },

        'ease': cubicBezierFunction(0.25, 0.1, 0.25, 1.0),

        'ease-in': cubicBezierFunction(0.42, 0, 1.0, 1.0),

        'ease-out': cubicBezierFunction(0, 0, 0.58, 1.0),

        'ease-in-out': cubicBezierFunction(0.42, 0, 0.58, 1.0),

        'ease-out-in': cubicBezierFunction(0, 0.42, 1.0, 0.58),

        toFn: function (easingStr) {
            var m;
            if ((m = easingStr.match(CUBIC_BEZIER_REG))) {
                return cubicBezierFunction(
                    parseNumber(m[1]),
                    parseNumber(m[2]),
                    parseNumber(m[3]),
                    parseNumber(m[4])
                );
            }
            return Easing[easingStr] || easeNone;
        },

        
        easeOut: function (t) {
            return ( 2 - t) * t;
        },

        
        easeBoth: function (t) {
            return (t *= 2) < 1 ?
                0.5 * t * t :
                0.5 * (1 - (--t) * (t - 2));
        },

        
        'easeInStrong': function (t) {
            return t * t * t * t;
        },

        
        easeOutStrong: function (t) {
            return 1 - (--t) * t * t * t;
        },

        
        'easeBothStrong': function (t) {
            return (t *= 2) < 1 ?
                0.5 * t * t * t * t :
                0.5 * (2 - (t -= 2) * t * t * t);
        },

        

        'elasticIn': function (t) {
            var p = 0.3, s = p / 4;
            if (t === 0 || t === 1) {
                return t;
            }
            return -(pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
        },

        
        elasticOut: function (t) {
            var p = 0.3, s = p / 4;
            if (t === 0 || t === 1) {
                return t;
            }
            return pow(2, -10 * t) * sin((t - s) * (2 * PI) / p) + 1;
        },

        
        'elasticBoth': function (t) {
            var p = 0.45, s = p / 4;
            if (t === 0 || (t *= 2) === 2) {
                return t;
            }

            if (t < 1) {
                return -0.5 * (pow(2, 10 * (t -= 1)) *
                    sin((t - s) * (2 * PI) / p));
            }
            return pow(2, -10 * (t -= 1)) *
                sin((t - s) * (2 * PI) / p) * 0.5 + 1;
        },

        
        'backIn': function (t) {
            if (t === 1) {
                t -= 0.001;
            }
            return t * t * ((BACK_CONST + 1) * t - BACK_CONST);
        },

        
        backOut: function (t) {
            return (t -= 1) * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1;
        },

        
        'backBoth': function (t) {
            var s = BACK_CONST;
            var m = (s *= 1.525) + 1;

            if ((t *= 2 ) < 1) {
                return 0.5 * (t * t * (m * t - s));
            }
            return 0.5 * ((t -= 2) * t * (m * t + s) + 2);

        },

        
        bounceIn: function (t) {
            return 1 - Easing.bounceOut(1 - t);
        },

        
        'bounceOut': function (t) {
            var s = 7.5625, r;

            if (t < (1 / 2.75)) {
                r = s * t * t;
            }
            else if (t < (2 / 2.75)) {
                r = s * (t -= (1.5 / 2.75)) * t + 0.75;
            }
            else if (t < (2.5 / 2.75)) {
                r = s * (t -= (2.25 / 2.75)) * t + 0.9375;
            }
            else {
                r = s * (t -= (2.625 / 2.75)) * t + 0.984375;
            }

            return r;
        },

        
        'bounceBoth': function (t) {
            if (t < 0.5) {
                return Easing.bounceIn(t * 2) * 0.5;
            }
            return Easing.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        }
    };

    
    
    
    
    var ZERO_LIMIT = 1e-6,
        abs = Math.abs;

    
    
    
    
    function cubicBezierFunction(p1x, p1y, p2x, p2y) {
        
        
        var ax = 3 * p1x - 3 * p2x + 1,
            bx = 3 * p2x - 6 * p1x,
            cx = 3 * p1x;

        var ay = 3 * p1y - 3 * p2y + 1,
            by = 3 * p2y - 6 * p1y,
            cy = 3 * p1y;

        function sampleCurveDerivativeX(t) {
            
            return (3 * ax * t + 2 * bx) * t + cx;
        }

        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx ) * t;
        }

        function sampleCurveY(t) {
            return ((ay * t + by) * t + cy ) * t;
        }

        
        function solveCurveX(x) {
            var t2 = x,
                derivative,
                x2;

            
            
            
            for (var i = 0; i < 8; i++) {
                
                x2 = sampleCurveX(t2) - x;
                if (abs(x2) < ZERO_LIMIT) {
                    return t2;
                }
                derivative = sampleCurveDerivativeX(t2);
                
                if (abs(derivative) < ZERO_LIMIT) {
                    break;
                }
                t2 -= x2 / derivative;
            }

            
            
            
            var t1 = 1,
                t0 = 0;
            t2 = x;
            while (t1 > t0) {
                x2 = sampleCurveX(t2) - x;
                if (abs(x2) < ZERO_LIMIT) {
                    return t2;
                }
                if (x2 > 0) {
                    t1 = t2;
                } else {
                    t0 = t2;
                }
                t2 = (t1 + t0) / 2;
            }

            
            return t2;
        }

        function solve(x) {
            return sampleCurveY(solveCurveX(x));
        }

        return solve;
    }

    return Easing;
});