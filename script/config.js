define(['fs'], function(fs){
  var config = {};
  config = JSON.parse(fs.readFileSync('config.ini', 'utf8'));
  console.log(config);
  return config;
});
