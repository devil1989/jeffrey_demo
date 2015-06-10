module.exports=function(grunt){
	grunt.config.init({
		pkg:grunt.flie.readJSON('package.json'),//因为package.json和Gruntfile文件都在根目录文件夹，而所有文件的草找路径都是参照Gruntfile 文件的相对路径
		uglify:{
			options:{
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build:{
				src:'',
				dest:''
			}
		}
	})
	
};