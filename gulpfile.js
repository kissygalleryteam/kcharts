var gulp = require('gulp');
var kmc = require('gulp-kmc');
var src = "./src",
  dest = "./build/";

kmc.config({
  depFilePath: dest + 'mods-dep.js', //全局依赖文件关系，此处配置后下面的各个模块将不会再生成
  packages: [{
    name: 'kg/kcharts/5.0.1/',
    // combine: true,
    base: './src/' 
  }]
});



gulp.task('kmc', function() {

  gulp.src(src + "/**/*.js")
  //转换cmd模块为kissy模块
  .pipe(kmc.convert({
    seajs:true,
    fixModuleName:true,
    minify: true, //是否压缩
    //ext:"-min.js",//转换后文件扩展名，如果minify 为true则是压缩文件扩展名,同时也支持下面这种配置
    ext: {
      src: "-debug.js", //kissy1.5后添加debug参数会默认加载-debug.js
      min: ".js"
    },
    exclude: [], //忽略该目录
    ignoreFiles: ['.combo.js', '-min.js'], //忽略该类文件
  }))
  //合并文件
  // .pipe(kmc.combo({
  //   minify: true,
  //   ext: "-min.js",
  //   files: [{
  //     // src: src + '/index.js',
  //     // dest: dest + '/core.js'
  //   }]
  // }))
    .pipe(gulp.dest(dest));



});

gulp.task('watch',function(){
  gulp.watch('src/**/*.js', ['kmc'])
})

gulp.task('default', ['kmc']);