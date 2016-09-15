define(['fs', 'path'], function(fs, path){
  var fileName = path.resolve(__dirname, 'recent.dat');
  try {
    fs.accessSync(fileName, fs.F_OK);
  } catch(err) {
    var execPath = path.dirname( process.execPath );
    fileName = execPath+'/'+'recent.dat';
  }

  this.list = fs.readFileSync(fileName, 'utf8').trim().split('\n');
  this.list.forEach(function(path, index) {
    if (path.length === 0) {
      this.list.splice(index, 1);
    }
  });

  function writeList() {
    var exists = fs.accessSync(fileName, fs.F_OK);
    if (exists) {
      fileName = execPath+'/'+fileName;
    }

    fs.writeFileSync(fileName, this.list.join('\n') ,'utf8');
  }

  this.addRecent = function(recentPath) {
    var idx = this.list.indexOf(recentPath);
    if (idx >= 0) {
      this.list.splice(idx, 1);
    }
    if (this.list.length > 15) {
      this.list.splice(14, 1);
    }
    this.list.unshift(recentPath);
    writeList();
  };

  this.clearRecent = function() {
    this.list = [];
    writeList();
  };

  return {
    list : this.list,
    addRecent : this.addRecent,
    clearRecent : this.clearRecent
  };
});
