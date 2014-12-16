define(['fs'], function(fs){
  var config = {};
  var hasError = false;
  config = JSON.parse(fs.readFileSync('config.ini', 'utf8'));

  return config;
});
