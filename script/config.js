define(['fs'], function(fs){
  var config = {};
  var hasError = false;
  config = JSON.parse(fs.readFileSync('config.ini', 'utf8'));
  config.fullFormat = config.dateFormat + ' ' + config.timeFormat + config.lastFormat;

  return config;
});
