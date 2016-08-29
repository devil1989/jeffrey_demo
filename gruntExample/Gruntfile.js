module.exports = function (grunt) {
    var banner = '/**\n* Date:<%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';// 添加banner

    //初始化设置，设置各个grunt插件参数，详见http://www.gruntjs.net/plugins，查询对应插件，获取插件的使用方法
    grunt.initConfig({
        'clean': {
            'release': {
                options: {
                    force: true
                },
                src: ['../dest']
            }
        },
        "copy": {

            //res文件的图片拷贝过来
            'res':{
                "files": [
                    {
                        "expand": true,
                        "cwd": "../res",
                        "src": ["**/*.png", "**/*.jpg","**/*.eot","**/*.svg","**/*.ttf","**/*.woff"],//css都需要压缩，所以不用移过来了
                        "dest": "../dest/res"
                    }
                ]
            },
            

            //include文件
            'inc':{
                "files": [
                    {
                        "expand": true,
                        "cwd": "../include",
                        "src": "**",
                        "dest": "../dest/include"
                    }
                ]
            },

            //需要复制的template文件
            'template': {
                "files": [
                    {
                        "expand": true,
                        "cwd": "../static",
                        "src": ["**/*.html", "**/*.png", "**/*.jpg"],
                        "dest": "../dest"
                    }
                ]
            },

            //需要复制的html(1级目录)
            'html':{
                "files": [
                    {
                        "expand": true,
                        "cwd": "../../flighthybrid",
                        "src": ["*.html"],
                        "dest": "../dest"
                    }
                ]
            }
        },
        'uglify': {
            'source->release': {
                'options': {
                    'preserveComments': false,// 删除全部注释
                    'mangle': {
                        'except': ['$super']
                    }
                },
                'files': [{
                    'expand': true,
                    'cwd': '../static',
                    'src': ['**/*.js', '*.js'],
                    'dest': '../dest'
                }]
            }

        },
        'cssmin': {
            // 文件头部输出信息
            options: {

                // 美化代码
                beautify: {
                    // 中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },
            otherstyle: {
                files: [{
                    expand: true,
                    // 相对路径
                    cwd: '../res/style',//当前工作目录current work directory
                    src: ['*.css'],//需要压缩的文件路径+文件名(一般工作目录就已经指到文件所在的文件夹，所以src仅仅只是文件名)
                    dest: '../dest/res/style'//文件压缩路径
                }]
            },

            //压缩iconfont下的css
            iconfont: {
                files: [{
                    expand: true,
                    // 相对路径
                    cwd: '../res/iconfont',//当前工作目录current work directory
                    src: '*.css',//需要压缩的文件路径+文件名(一般工作目录就已经指到文件所在的文件夹，所以src仅仅只是文件名)
                    dest: '../dest/res/iconfont'//文件压缩路径
                }]
            },

            //压缩合并style下的css
            my_target: {
                files: {'../dest/res/style/release.css': ['../res/style/fbase_main.css','../res/style/flighthybrid.css', '../res/style/icon-hfw@2x.css','../res/style/flthotel.css']}
            } 
        }

        // //压缩HTML
        // htmlmin: {
        //     options: {
        //         removeComments: true,
        //         collapseWhitespace: true,//折叠空格
        //         collapseBooleanAttributes: true,//折叠布尔属性的属性值
        //         removeComments: true,//删除注释
        //         removeRedundantAttributes: true,//删除冗余属性
        //         removeOptionalTags: false,//删除不需要的可选标签
        //         minifyJS: true,//压缩script标签中的js代码
        //         minifyCSS: true,//压缩style标签中的css代码
        //         // processScripts: ['text/lizard-template'],//不好优化，插件问题
        //         removeScriptTypeAttributes: true,//删除 type="text/javascript"
        //         removeStyleLinkTypeAttributes: true//删除 type="text/css"
        //     },
        //     html: {
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: '../../flighthybrid',//当前工作目录current work directory
        //                 // src: ['orderdetail.html','intlorderdetail.html'],//需要压缩的文件路径+文件名(一般工作目录就已经指到文件所在的文件夹，所以src仅仅只是文件名)
        //                 src: '*.html',
        //                 dest: '../dest'//文件压缩路径
        //             }
        //         ]
        //     },
        //     templateHtml:{
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: '../static/template/orderdetail',//当前工作目录current work directory
        //                 src: '*.html',//文件名
        //                 dest: '../dest/template/orderdetail'//文件压缩路径
        //             }
        //         ]
        //     }

        // }

    });

    //加载对应插件
    grunt.loadNpmTasks('grunt-curl');// npm install grunt-curl
    grunt.loadNpmTasks('grunt-contrib-requirejs');//requirejs加载//npm install grunt-contrib-requirejs --save-dev
    grunt.loadNpmTasks('grunt-contrib-cssmin');//css压缩//npm install grunt-contrib-cssmin --save-dev
    grunt.loadNpmTasks('grunt-contrib-clean');//清空文件夹//npm install grunt-contrib-clean --save-dev
    grunt.loadNpmTasks('grunt-contrib-copy');//复制文件和文件夹//npm install grunt-contrib-copy --save-dev
    grunt.loadNpmTasks('grunt-contrib-uglify');//压缩js//npm install grunt-contrib-uglify --save-dev
    grunt.loadNpmTasks('grunt-strip');//删除js中的console.log等浏览器调试语句//npm install grunt-strip
    grunt.loadNpmTasks('grunt-contrib-compress');//文件合并压缩//npm install grunt-contrib-compress --save-dev
    grunt.loadNpmTasks('grunt-replace');//文本替换//npm install grunt-replace --save-dev
    // grunt.loadNpmTasks('grunt-contrib-htmlmin');//压缩html //npm install grunt-contrib-htmlmin --save-dev
    // grunt.loadNpmTasks('grunt-closure-compiler');

    /**
     * 主入口：执行对应任务
     */
    grunt.registerTask('default', 'default task', function () {
        grunt.task.run(['clean:release']);
        grunt.task.run([ 'uglify:source->release' ]);

        grunt.task.run(['build']);
        grunt.task.run(['copy']);//需要把include文件夹也拷贝进来，inc文件被引用的时候走的是相对路径
        grunt.task.run(['combinecss']);//header.inc中把三个css替换成1个
        // // // grunt.task.run([ 'uglify:lizard.seed.src.js2lizard.seed.js' ]);
        // // // grunt.task.run([ 'uglify:lizard.defer.src.js2lizard.defer.js' ]);
        grunt.task.run(['cssmin']);//['cssmin:my_target']
        // grunt.task.run(['htmlmin']);
    });

    //任务：压缩html
    // grunt.registerTask('xmhtmlmin', 'xmhtmlmin task', function () {
    //     grunt.log.write('xm test log 1 ' + grunt.version);
    //     grunt.task.run(['htmlmin:html']);
    //     // //grunt.file.defaultEncoding = 'utf8';
    //     // var options = {
    //     //     encoding: 'utf8'
    //     // };


    //     // //遍历目录
    //     // grunt.file.recurse('../', function(abspath, rootdir, subdir, filename) {
    //     //     //只遍历当前目录
    //     //     if(subdir !=undefined) return;

    //     //     // //是html的话
    //     //     // if(/.html$/.test(filename)) {
    //     //     //     var txt = grunt.file.read(filename, []);
    //     //     //     //grunt.log.write(txt).ok();


    //     //     //     //替换style 标签
    //     //     //     function replace_style(txt) {

    //     //     //         var links = txt.match(/<link [^>]+>/g);
    //     //     //         var src, style;

    //     //     //         for(var i=0;i<links.length;i++) {

    //     //     //             //grunt.log.write('links ' + links[i]).ok();

    //     //     //             src = links[i].match(/href=["']([^"]+)["']/)[1];

    //     //     //             //grunt.log.write('src ' + src).ok();

    //     //     //             style = grunt.file.read(src, []);

    //     //     //             //grunt.log.write('style ' + style).ok();

    //     //     //             //txt = txt.replace(links[i], '\n<style>\n' + style + '\n</style>\n');
    //     //     //         }

    //     //     //         var write = grunt.file.write('../dest/' + filename + '.html', txt);
    //     //     //         grunt.log.write('/n write ' + write).ok();

    //     //     //     }
    //     //     //     replace_style(txt);
    //     //     // }

    //     //     // if(/.html$/.test(filename)) {
    //     //     //     grunt.log.write('abspath: ' + abspath + ' ,rootdir: ' + rootdir + ' ,subdir: ' + subdir + ' ,filename: ' + filename).ok();
    //     //     //     grunt.task.run(['htmlmin:html']);
    //     //     // }
    //     // });
    // });

    //合并多个css文件[把include中的header.inc中的css文件合并]
    grunt.registerTask("combinecss","combine some css files",function(){
        grunt.file.recurse("../include/",function(abspath, rootdir, subdir, filename){
            if(filename=="header.inc"||filename=="header_order_detail.inc"){
                var txt=grunt.file.read(abspath,{encoding:"utf8"}).toString();
                var txt=txt.replace(/\<link href[^>]+\>/g,"")+'<link href="@assetsCssPath()/res/style/release.css?v201510160308" rel="stylesheet" />';
                grunt.file.write('../dest/include/'+filename,txt);
                grunt.log.ok("finish change header.inc's css link");
            }
        });
    });
    
    //任务：执行requirejs插件任务
    grunt.registerTask('build', 'build task', function (platform, version) {
        var tasks = ["requirejs"];
        var config = {

            baseSrcDir: '../static/',//需要压缩的源文件的基础路径
            baseDestDir: '../dest/',//压缩后的文件的存放地址
        };
        grunt.config.set('config', config);
        grunt.task.run(tasks);
    });


    function erreorLog(e) {
        grunt.log.error(e);
        //grunt.file.writeln('build_error.log', e)
    }
}
