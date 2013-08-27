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
    'scatterchart',
    'thermometer',
    'tip',
    "radar",
    "icons",
    "tools/color",
    "tools/graphtool",
    "tools/htmlpaper",
    "tools/touch"
  ];
  //kmc的文件队列
  var kmcFiles = (function() {
                    var tmp = [];
                    for (var i = 0; i < widgets.length; i++) {
                      tmp.push({
                        src: '<%= pkg.version %>/' + widgets[i] + '/index.js',
                        dest: '<%= pkg.version %>/build/' + widgets[i] + '/index.js'
                      });
                    }
                    return tmp;
                  })();

  // TEST
  //除了第一个能打包成功，后面的都不行
  kmcFiles = [{
    src: '1.2/barchart/index.js',
    dest: '1.2/build/barchart/index.js'
  },{
    src: '1.2/basechart/index.js',
    dest: '1.2/build/basechart/index.js'
  }]

  var uglifyFiles = (function(){
                       var tmp = {};
                       for (var i = 0; i < widgets.length; i++) {
                         tmp['<%= pkg.version %>/build/' + widgets[i] + '/index-min.js'] = ['<%= pkg.version %>/build/' + widgets[i] + '/index.js']
                       }
                       return tmp;
                     })();

  grunt.initConfig({
    pkg: grunt.file.readJSON('abc.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    kmc: {
      main: {
        options: {
          packages: [{
            name: 'gallery',
            path: '1.2/',
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