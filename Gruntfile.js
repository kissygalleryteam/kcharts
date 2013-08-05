module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('abc.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    return grunt.registerTask('default', [ 'uglify']);
};