define(['fs', 'iconv-lite', 'config'], function(fs, iconv, config){
  function open(path, callback) {
    fs.readFile(path, function(error, contents) {
      if (error) return;
      var data = iconv.decode(contents, config.encoding);
      callback(path, data);
    });
  }

  function save(path, contents) {
    fs.writeFile(path, contents);
  }

  return {
    open : open,
    save : save
  };
});
