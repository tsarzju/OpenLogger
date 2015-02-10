define(['fs', 'path'], function(fs, path){
  var execPath = path.dirname( process.execPath );
  var fileName = 'recent.dat';
  var exists = fs.accessSync(fileName, fs.F_OK);
  if (exists) {
    fileName = execPath+'/'+fileName;
  }

  this.list = fs.readFileSync(fileName, 'utf8').trim().split('\n');

  this.addRecent = function(recentPath) {
    var idx = this.list.indexOf(recentPath);
    if (idx >= 0) {
      this.list.splice(idx, 1);
    }
    if (this.list.length > 15) {
      this.list.splice(14, 1);
    }
    this.list.unshift(recentPath);
    var exists = fs.accessSync(fileName, fs.F_OK);
    if (exists) {
      fileName = execPath+'/'+fileName;
    }

    fs.writeFileSync(fileName, this.list.join('\n') ,'utf8');
  };

  this.clearRecent = function() {
    this.list = [];
  };

  return {
    list : this.list,
    addRecent : this.addRecent,
    clearRecent : this.clearRecent
  };
});
