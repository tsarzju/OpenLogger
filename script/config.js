define(['fs', 'path'], function(fs, path){
  var config = {};
  var fileName = process.cwd() + '\\config.ini';
  try {
    fs.accessSync(fileName, fs.F_OK);
  } catch(err) {
    var execPath = path.dirname( process.execPath );
    fileName = execPath+'/'+'config.ini';
  }

  config = JSON.parse(fs.readFileSync(fileName, 'utf8'));

  return config;
});
