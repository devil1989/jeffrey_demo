module.exports = function (grunt) {
    var banner = '/**\n* Date:<%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';// 添加banner
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
                        "cwd": "../../flighttrain",
                        "src": ["**/*.html", "**/*.json","**/*.jpg","**/*.png"],//css和js需要压缩，所以不拷贝
                        "dest": "../dest"
                    }
                ]
            }
        },
        'uglify': {
            'target': {
                'options': {
                    'preserveComments': false,// 删除全部注释
                    'mangle': {
                        'except': ['$super']
                    }
                },
                'files': [{
                    'expand': true,
                    'cwd': '../../flighttrain/',
                    'src': ['*.js','*/*.js','*/*/*.js','*/*/*/*.js','*/*/*/*/*.js','*/*/*/*/*/*.js','*/*/*/*/*/*/*.js','!grunt**.js'],
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
            my_target: {
                files: [{
                    expand: true,
                    // 相对路径
                    cwd: '../res/style',
                    src: '*.css',
                    dest: '../dest/res/style'
                }]
            } 
        }

    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');//复制文件和文件夹//npm install grunt-contrib-copy --save-dev
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    

    /**
     * 主入口
     */
    grunt.registerTask('default', 'default task', function () {
        grunt.task.run(['clean']);
        grunt.task.run(['copy']);
        grunt.task.run(['uglify']);
        grunt.task.run(['cssmin']);
    });

    function erreorLog(e) {
        grunt.log.error(e);
        //grunt.file.writeln('build_error.log', e)
    }
}
