define('kg/kcharts/5.0.1/tools/template/index',["util"],function(require, exports, module) {


    var Util = require("util");

    var 
        templateCache = {},

    
        tagStartEnd = {
            '#': 'start',
            '@': 'start',
            '/': 'end'
        },

    
        KS_TEMPL_STAT_PARAM = 'KS_TEMPL_STAT_PARAM',
        KS_TEMPL_STAT_PARAM_REG = new RegExp(KS_TEMPL_STAT_PARAM, "g"),
        KS_TEMPL = 'KS_TEMPL',
        KS_DATA = 'KS_DATA_',
        KS_AS = 'as',

    
        PREFIX = '");',
        SUFFIX = KS_TEMPL + '.push("',

        PARSER_SYNTAX_ERROR = 'KISSY.Template: Syntax Error. ',
        PARSER_RENDER_ERROR = 'KISSY.Template: Render Error. ',

        PARSER_PREFIX = 'var ' + KS_TEMPL + '=[],' +
            KS_TEMPL_STAT_PARAM + '=false;with(',

        PARSER_MIDDLE = '||{}){try{' + KS_TEMPL + '.push("',

        PARSER_SUFFIX = '");}catch(e){' + KS_TEMPL + '=["' +
            PARSER_RENDER_ERROR + '" + e.message]}};return ' +
            KS_TEMPL + '.join("");',

    
        restoreQuote = function (str) {
            return str.replace(/\\"/g, '"');
        },

    
        escapeQuote = function (str) {
            return str.replace(/"/g, '\\"');
        },

        trim = Util.trim,

    // build a static parser
        buildParser = function (tpl) {
            var _parser,
                _empty_index;
            return escapeQuote(trim(tpl)
                .replace(/[\r\t\n]/g, ' ')
                // escape escape ... . in case \ is consumed when run tpl parser function
                // '{{y}}\\x{{/y}}' =>tmpl.push('\x'); => tmpl.push('\\x');
                .replace(/\\/g, '\\\\'))
                .replace(/\{\{([#/@]?)(?!\}\})([^}]*)\}\}/g,
                function (all, expr, body) {
                    _parser = "";
                    // must restore quote , if str is used as code directly
                    body = restoreQuote(trim(body));
                    // is an expression
                    if (expr) {
                        _empty_index = body.indexOf(' ');
                        body = _empty_index === -1 ?
                            [ body, '' ] :
                            [
                                body.substring(0, _empty_index),
                                body.substring(_empty_index)
                            ];

                        var operator = body[0],
                            fn,
                            args = trim(body[1]),
                            opStatement = Statements[operator];

                        if (opStatement && tagStartEnd[expr]) {
                            // get expression definition function/string
                            fn = opStatement[tagStartEnd[expr]];
                            _parser = String(Util.isFunction(fn) ?
                                fn.apply(this, args.split(/\s+/)) :
                                fn.replace(KS_TEMPL_STAT_PARAM_REG, args));
                        }
                    }
                    // return array directly
                    else {
                        _parser = KS_TEMPL +
                            '.push(' +
                            // prevent variable undefined error when look up in with, simple variable substitution
                            // with({}){alert(x);} => ReferenceError: x is not defined
                            'typeof (' + body + ') ==="undefined"?"":' + body +
                            ');';
                    }
                    return PREFIX + _parser + SUFFIX;

                });
        },

    // expression
        Statements = {
            'if': {
                start: 'if(typeof (' + KS_TEMPL_STAT_PARAM + ') !=="undefined" && ' + KS_TEMPL_STAT_PARAM + '){',
                end: '}'
            },

            'else': {
                start: '}else{'
            },

            'elseif': {
                start: '}else if(' + KS_TEMPL_STAT_PARAM + '){'
            },

            // KISSY.each function wrap
            'each': {
                start: function (obj, as, v, k) {
                    var _ks_value = '_ks_value',
                        _ks_index = '_ks_index';
                    if (as === KS_AS && v) {
                        _ks_value = v || _ks_value;
                        _ks_index = k || _ks_index;
                    }
                    return 'KISSY.each(' + obj +
                        ', function(' + _ks_value +
                        ', ' + _ks_index + '){';
                },
                end: '});'
            },

            // comments
            '!': {
                start: '/*' + KS_TEMPL_STAT_PARAM + '*/'
            }
        };

    /**
     * Template
     * @param {String} tpl template to be rendered.
     * @return {Object} return this for chain.
     */
    function Template(tpl) {
        if (!(templateCache[tpl])) {
            var _ks_data = Util.guid(KS_DATA),
                func,
                o,
                _parser = [
                    PARSER_PREFIX,
                    _ks_data,
                    PARSER_MIDDLE,
                    o = buildParser(tpl),
                    PARSER_SUFFIX
                ];

            try {
                func = new Function(_ks_data, _parser.join(""));
            } catch (e) {
                _parser[3] = PREFIX + SUFFIX +
                    PARSER_SYNTAX_ERROR + ',' +
                    e.message + PREFIX + SUFFIX;
                func = new Function(_ks_data, _parser.join(""));
            }

            templateCache[tpl] = {
                name: _ks_data,
                o: o,
                parser: _parser.join(""),
                render: func
            };
        }
        return templateCache[tpl];
    }

    Util.mix(Template, {
        /**
         * Logging Compiled Template Codes
         * @param {String} tpl template string.
         */
        log: function (tpl) {
            if (tpl in templateCache) {
            } else {
                Template(tpl);
            }
        },

        /**
         * add statement for extending template tags
         * @param {String} statement tag name.
         * @param {String} o extent tag object.
         */
        addStatement: function (statement, o) {
            if (typeof statement == 'string') {
                Statements[statement] = o;
            } else {
                Util.mix(Statements, statement);
            }
        }

    });


    return Template;

});
/**
 * TODO: check spec
 *  - http://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html
 *
 * 2012-04-24 yiminghe@gmail.com
 *      - support {{@if test}}t{{/if}} to prevent collision with velocity template engine
 *
 *
 * 2011-09-20 note by yiminghe :
 *      - code style change
 *      - remove reg cache , ugly to see
 *      - fix escape by escape
 *      - expect(T('{{#if a=="a"}}{{b}}\\"{{/if}}').render({a:"a",b:"b"})).toBe('b\\"');
 */