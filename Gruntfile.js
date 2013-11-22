module.exports = function(grunt) {
    var date = (function(){
        var _date = new Date(),
            year = _date.getFullYear(),
            month = _date.getMonth()+1,
            day = _date.getDate();
        return year+'/'+month+'/'+day;    
    })();
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
        transport: {        	
            dialog: {
            	options : {
            		paths : ['src']
		        },
                files : [
                    {	
                    	expand: true,
                    	cwd: 'src/',
                        src : '**/*.js',
                        dest : '.build',
                        filter : function(file){
                            //console.log(grunt.file.isDir(file));
                            return file.indexOf('node_modules')<0;
                        }
                    }
                ]
            }
        },
        concat: {
            dist: {
            	options : {
            		paths : ['.build'],
            		include : 'relative'
		        },
		        files : [
		        	{
		        		expand: true,
		        		cwd: '.build/',
		        		src : '**/*.js',
		        		dest : 'js'
		        	}
		        ]
            },
            nojs : {
                options : {
                    noncmd : true
                },
                files : {
                    'js/nojs/noJS.js' : ['src/nojs/noJS.js','src/conf.js'],
                    'js/conf.js' : ['src/conf.js']
                }
            },
            global : {   
                options : {
                    noncmd : true
                },             
                files : {
                    'js/nojs/jquery.js' : ['src/nojs/jquery.js','src/nojs/ui.js'],
                    'js/m/zepto.js' : ['.build/m/zepto.js','.build/m/ui.js']
                }
            }
        },
        clean : {
			build : ['.build','js/**/*-debug.js'] //清除
		},
        uglify : {
        	options: {
        		banner: '/*'+date+'-<%= pkg.docs %>*/',
		    	mangle: {
		        	except: ['require']
		    	}
		    },
        	main : {
                files : [
                	{
	                	expand : true,
	                	cwd: 'js/',
	                	src : "**/*.js",
	                	dest : 'js/',
	                	ext: ''
	                }
                ]
			},
        	min : {
                files : [
                	{
	                	expand : true,
	                	cwd: 'src/',
	                	src : "**/*.js",
	                	dest : 'min/',
	                	ext: ''
	                }
                ]
			}
        },
		watch: {			
			js : {
				files: ['src/**/*.js'],
				tasks: ['transport','concat','clean','uglify:main'],
				options: {
			        livereload: 1337,
				}
			}
		},
		jshint : {
		    js : ['src/conf.js']
		}
	});
	
	
	grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.registerTask('default',['transport','concat','clean']);
    grunt.registerTask('min',['uglify:min']);
    grunt.registerTask('check',['jshint']);
    
};