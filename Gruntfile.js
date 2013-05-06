module.exports = function(grunt) {
    grunt.initConfig({
        // 配置文件，参考package.json配置方式，必须设置项是
        // name, version, author
        // name作为gallery发布后的模块名
        // version是版本，也是发布目录
        // author必须是{name: "xxx", email: "xxx"}格式
        pkg: grunt.file.readJSON('abc.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // kmc打包任务，默认情况，入口文件是index.js，可以自行添加入口文件，在files下面
        // 添加
        kmc: {
            options: {
                packages: [
                    {
                        name:"gallery",
                        path: '../../'
                    }
                ],
                map: [["<%= pkg.name %>/", "gallery/<%= pkg.name %>/"]],
                // exclude :['base','event','template','anim']
                // ignoreFiles:[/tools/]
                // ignoreFiles:['/tools/*','/legend/*','/tip/*','/raphael/*','/ft/*','/basechart/*']
               exclude: ['event','template','/tools/*','/legend/*','/tip/*','/raphael/*','/ft/*','/basechart/*']
            },
            main: {
                files: [
                    {
                        src: "<%= pkg.version %>/areachart/index.js",
                        dest: "<%= pkg.version %>/build/areachart/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/barchart/index.js",
                        dest: "<%= pkg.version %>/build/barchart/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/basechart/index.js",
                        dest: "<%= pkg.version %>/build/basechart/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/dashboard/index.js",
                        dest: "<%= pkg.version %>/build/dashboard/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/ft/index.js",
                        dest: "<%= pkg.version %>/build/ft/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/label/index.js",
                        dest: "<%= pkg.version %>/build/label/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/legend/index.js",
                        dest: "<%= pkg.version %>/build/legend/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/mapchart/index.js",
                        dest: "<%= pkg.version %>/build/mapchart/index.js"
                    },

                    {
                        src: "<%= pkg.version %>/linechart/index.js",
                        dest: "<%= pkg.version %>/build/linechart/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/piechart/index.js",
                        dest: "<%= pkg.version %>/build/piechart/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/raphael/index.js",
                        dest: "<%= pkg.version %>/build/raphael/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/ratiochart/index.js",
                        dest: "<%= pkg.version %>/build/ratiochart/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/scatterchart/index.js",
                        dest: "<%= pkg.version %>/build/scatterchart/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/sumdetailchart/index.js",
                        dest: "<%= pkg.version %>/build/sumdetailchart/index.js"
                    },

                    {
                        src: "<%= pkg.version %>/tip/index.js",
                        dest: "<%= pkg.version %>/build/tip/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/tools/color/index.js",
                        dest: "<%= pkg.version %>/build/tools/color/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/tools/graphtool/index.js",
                        dest: "<%= pkg.version %>/build/tools/graphtool/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/tools/htmlpaper/index.js",
                        dest: "<%= pkg.version %>/build/tools/htmlpaper/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/tools/touch/index.js",
                        dest: "<%= pkg.version %>/build/tools/touch/index.js"
                    }
                ]
            }
        },
        // 打包后压缩文件
        // 压缩文件和入口文件一一对应
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            base: {
                files: {
                    '<%= pkg.version %>/build/areachart/index-min.js': ['<%= pkg.version %>/build/areachart/index.js'],
                    '<%= pkg.version %>/build/barchart/index-min.js': ['<%= pkg.version %>/build/barchart/index.js'],
                    '<%= pkg.version %>/build/basechart/index-min.js': ['<%= pkg.version %>/build/basechart/index.js'],
                    '<%= pkg.version %>/build/dashboard/index-min.js': ['<%= pkg.version %>/build/dashboard/index.js'],
                    '<%= pkg.version %>/build/ft/index-min.js': ['<%= pkg.version %>/build/ft/index.js'],
                    '<%= pkg.version %>/build/label/index-min.js': ['<%= pkg.version %>/build/label/index.js'],
                    '<%= pkg.version %>/build/legend/index-min.js': ['<%= pkg.version %>/build/legend/index.js'],
                    '<%= pkg.version %>/build/mapchart/index-min.js': ['<%= pkg.version %>/build/mapchart/index.js'],
                    '<%= pkg.version %>/build/linechart/index-min.js': ['<%= pkg.version %>/build/linechart/index.js'],
                    '<%= pkg.version %>/build/piechart/index-min.js': ['<%= pkg.version %>/build/piechart/index.js'],
                    '<%= pkg.version %>/build/raphael/index-min.js': ['<%= pkg.version %>/build/raphael/index.js'],
                    '<%= pkg.version %>/build/ratiochart/index-min.js': ['<%= pkg.version %>/build/ratiochart/index.js'],
                    '<%= pkg.version %>/build/scatterchart/index-min.js': ['<%= pkg.version %>/build/scatterchart/index.js'],
                    '<%= pkg.version %>/build/sumdetailchart/index-min.js': ['<%= pkg.version %>/build/sumdetailchart/index.js'],
                    '<%= pkg.version %>/build/tip/index-min.js': ['<%= pkg.version %>/build/tip/index.js'],
                   '<%= pkg.version %>/build/tools/color/index-min.js': ['<%= pkg.version %>/build/tools/color/index.js'],
                   '<%= pkg.version %>/build/tools/graphtool/index-min.js': ['<%= pkg.version %>/build/tools/graphtool/index.js'],
                   '<%= pkg.version %>/build/tools/htmlpaper/index-min.js': ['<%= pkg.version %>/build/tools/htmlpaper/index.js'],
                   '<%= pkg.version %>/build/tools/touch/index-min.js': ['<%= pkg.version %>/build/tools/touch/index.js']

                }
            }
        }
    });

    // 使用到的任务，可以增加其他任务
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-kmc');
    return grunt.registerTask('default', ['kmc', 'uglify']);
};