define(['node-syntaxhighlighter', 'fs'], function(nsh, fs){
  function open(path, $, callback) {
    fs.readFile(path, 'utf-8', function(error, contents) {
      callback(contents, path);
    });
  }

  function save(path, $) {
    var text = $('#editor').val();
    fs.writeFile(path, text);
  }

  return {
    open : open,
    save : save
  };
});
