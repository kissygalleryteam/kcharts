module.exports = function(grunt) {
  grunt.initConfig({
    kmc: {
      main:{
        options: {
          packages: [
            {
              name: 'gallery',
              path: '/home/tom/Dropbox/gits/gallery',
              charset: 'utf-8'
            }
          ]
        },
        files: [{
          src: '1.2/basechart/index.js',
          dest: '1.2/build/basechart/index.js'
        },{
          src: '1.2/barchart/index.js',
          dest: '1.2/build/barchart/index.js'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-kmc');
  grunt.registerTask('default', ['kmc']);
}