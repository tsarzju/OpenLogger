define(['node-syntaxhighlighter', 'fs'], function(nsh, fs){
  function open(path, $) {
    fs.readFile(path, 'utf-8', function(error, contents) {
      nsh.sh.defaults['auto-links'] = false;
      $('#preview').html(nsh.highlight(contents, nsh.getLanguage('plain')));
      $('#filePath').val(path);
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
