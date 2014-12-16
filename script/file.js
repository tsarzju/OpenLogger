define(['fs', 'iconv-lite', 'config'], function(fs, iconv, config){
  function open(path, callback, encoding) {
    fs.readFile(path, function(error, contents) {
      if (error) return;
      var data = iconv.decode(contents, encoding);
      callback(path, data);
    });
  }

  function save(path, contents, encoding) {
    var data = iconv.encode(contents, encoding);
    fs.writeFile(path, data);
  }

  return {
    open : open,
    save : save
  };
});
