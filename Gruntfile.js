module.exports = function(grunt) {

  var widgets = [
    'animate',
    'barchart',
    'basechart',
    'datetime',
    'legend',
    'linechart',
    'mapchart',
    'piechart',
    'radar',
    'raphael',
    'dashboard',
    'scatterchart',
    'thermometer',
    'tip',
    "icons",
    "tools/color",
    "tools/graphtool",
    "tools/htmlpaper",
    "tools/touch"
  ];

  //kmc的文件队列
  var kmcFiles = widgets.map(function(widget){
               return {
                 src:'<%= pkg.version %>/' + widget + '/index.js',
                 dest:'<%= pkg.version %>/build/' + widget + '/index.js'
               }
             });

  var uglifyFiles = {};

  widgets.forEach(function(widget){
    uglifyFiles['<%= pkg.version %>/build/' + widget + '/index-min.js'] = ['<%= pkg.version %>/build/' + widget + '/index.js']
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('abc.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    kmc: {
      main: {
        options: {
          packages: [{
            name: 'gallery',
            path: '../../',
            charset: 'utf-8'
          }]
        },
        files:kmcFiles
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      base: {
        files: uglifyFiles
      }
    },
    cssmin:{
      compress: {
        files: {
          '<%= pkg.version %>/build/tip/assets/tip-min.css': ['<%= pkg.version %>/tip/assets/tip.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-kmc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // 注册任务
  grunt.registerTask('default', ['kmc', 'uglify', 'cssmin']);
};