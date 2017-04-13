'use strict';

var fs = require('fs');

module.exports = function AssignHashWebpackPlugin(settings){
    var self = this;

    self.filename = settings.filename;
    self.outputDir = settings.outputDir;
    self.outputFilename = settings.outputFilename;
    self.configFile = settings.configFile;

    self.apply = function(compiler){
        compiler.plugin('done', function(){
            self.readConfig(self.configFile, function(err, config){
                self.readFile(self.filename, config);
            });
        });
    };

    self.replace = function(data, config){
        var result = data;
        for (var key in config){
            result = result.replace(key, config[key]);
        }

        return result;
    };

    self.writeFile = function(content, callback){
        fs.writeFile(self.outputDir + '/' + self.outputFilename, content, function(err){
            if (err) throw err;

            if (callback) callback();
        });
    };

    self.readFile = function(filename, config){
        fs.readFile(filename, 'utf8', function(err, data){
            var replacedString = data;
            if (config) {
                replacedString = self.replace(data, config);
            }

            self.writeFile(replacedString);
        });
    };

    self.readConfig = function(configPath, callback){
        fs.readFile(configPath, 'utf8', function(err, data){
            if (err) {
                console.log('Warning: ' + err);
                console.log('Not hashed filenames is using.');
                callback(err, null);
            } else {
                var configObject = {};

                try {
                    configObject = JSON.parse(data);
                } catch (err){
                    throw new Error('Invalid config JSON: ' + err);
                }

                callback(null, configObject);
            }
        });
    };
}
