module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		dirs: {  
			src: 'js/nojs.module',  
		    dest: 'dist' 
		},  
        transport: {
        	 options : {
		        paths : ['js']
		        //alias: '<%= pkg.spm.alias %>',
		        
		    },
            dialog: {
            	options : {
		            idleading : ''
		        },
                files : [
                    {
                        src : 'js/nojs.module/*.js',
                        dest : '.build'
                    }
                ]
            }
        },
        concat: {
            dist: {
            	options : {
            		paths : ['js'],
		            include : 'all'
		        },
		       
		        files : {
		        	'dist/main.js' : ['js/main.js','js/nojs.module/color.js']
		        }
            }
        },
        uglify : {
        	main : {
                files : {
                     'dist/noJS.js' : ["js/noJS.js"] 
                }
           }
        },
		clean : {
			build : ['dist'] //清除
		}
	});
	
	grunt.loadNpmTasks('grunt-cmd-transport');//grunt-contrib-uglify
    grunt.loadNpmTasks('grunt-cmd-concat');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['concat']);
};