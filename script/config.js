define(['fs'], function(fs){
  var config = {};
  var hasError = false;
  try {
    config = JSON.parse(fs.readFileSync('config.ini', 'utf8'));
  } catch(error) {
    hasError = true;
  }
  if (config.encoding === undefined || hasError) {
    config.encoding = 'utf8';
  }

  return config;
});
