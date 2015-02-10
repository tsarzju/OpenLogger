define(['fs', 'path'], function(fs, path){
  var config = {};
  var hasError = false;
  var execPath = path.dirname( process.execPath );
  var fileName = 'config.ini';
  var exists = fs.accessSync(fileName, fs.F_OK);
  if (exists) {
    fileName = execPath+'/'+fileName;
  }

  config = JSON.parse(fs.readFileSync(fileName, 'utf8'));

  return config;
});
