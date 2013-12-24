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
            		paths : ['public/src'],
            		alias : {
            		    'b' : 'test/lottery'
            		}
		        },
                files : [
                    {	
                    	expand: true,
                    	cwd: 'public/src/',
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
		        		dest : 'public/js'
		        	}
		        ]
            },
            nojs : {
                options : {
                    noncmd : true
                },
                files : {
                    'public/js/nojs/noJS.js' : ['public/src/nojs/noJS.js','public/src/conf.js'],
                    'public/js/conf.js' : ['public/src/conf.js']
                }
            },
            global : {   
                options : {
                    noncmd : true
                },             
                files : {
                    'public/js/nojs/jquery.js' : ['public/src/nojs/jquery.js','public/src/nojs/ui.js'],
                    'public/js/m/zepto.js' : ['.build/m/zepto.js','.build/m/ui.js']
                }
            }
        },
        clean : {
			build : ['.build','public/js/**/*-debug.js'] //清除
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
	                	cwd: 'public/js/',
	                	src : "**/*.js",
	                	dest : 'public/js/',
	                	ext: ''
	                }
                ]
			},
        	min : {
                files : [
                	{
	                	expand : true,
	                	cwd: 'public/src/',
	                	src : "**/*.js",
	                	dest : 'public/min/',
	                	ext: ''
	                }
                ]
			}
        },
		watch: {			
			js : {
				files: ['public/src/**/*.js'],
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