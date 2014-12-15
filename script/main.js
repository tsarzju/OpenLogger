var requirejs = require('requirejs');

requirejs.config({
  baseUrl:'script',
  nodeRequire: require
});

requirejs(['fs','iconv-lite','lazy', 'file', 'config', 'LogEntity', 'moment', 'normalFilter'],
  function(fs, iconv, Lazy, file, config, LogEntity, moment, normalFilter){
  var gui = require('nw.gui');
  var normalFilterList = ['threadId', 'producer', 'type'];
  $(function(){
    initPreview();
    initMenu();
    initFilter();
  });

  function appendSubmenu(menuItem, label, callback) {
    menuItem.submenu.append(new gui.MenuItem({
      label: label,
      click: callback
    }));
  }

  function appendSeparator(menuItem) {
    menuItem.submenu.append(new gui.MenuItem({
      type : 'separator'
    }));
  }

  function clickInput(id) {
    $('#'+id).click();
  }

  function initMenu() {
    var menu = new gui.Menu({type : 'menubar'});

    menu.append(new gui.MenuItem({
      label : 'File',
      submenu: new gui.Menu()
    }));

    appendSubmenu(menu.items[0], 'Import', function(){
      clickInput('import');
    });

    appendSubmenu(menu.items[0], 'Export', function(){

    });

    appendSeparator(menu.items[0]);

    appendSubmenu(menu.items[0], 'Exit', function(){
      gui.Window.get().close();
    });

    gui.Window.get().menu = menu;
  }

  function clear() {
    $("#type").empty();
    $('#previewLogs').scrollTop(0);
    $('#previewLogs').text('');
    $('#filterLogs').scrollTop(0);
    $('#filterLogs').text('');
  }

  function updatePreview(path, numLines) {
    gui.Window.get().title = path;
    $('#previewLogs').text(numLines.join('\n'));
    $('.logDiv').show();
  }

  function initPreview() {
    $('#import').on('change', function(e) {
      var path = $(this).val();
      getPreview(path, config.previewSize, function(err, fileData){
        clear();
        updatePreview(path, addLineNum(1, fileData.split('\n')));
      });
    });
  }

  function addLineNum(startIndex, linesWithoutNum) {
    var count = startIndex;
    var result = [];
    var maxLength = 5;
    if (startIndex.toString().length > 5) {
      maxLength = startIndex.toString().length;
    }
    var padding = new Array(maxLength).join(' ');
    linesWithoutNum.forEach(function(line) {
      result.push((padding+count).slice(-maxLength) + " | " +line.replace(/\t/g, '    '));
      count++;
    });
    return result;
  }

  function initFilter() {
    $('#startTime').datetimepicker({
      dateFormat: config.dateFormat,
      timeFormat: config.timeFormat,
    });

    $('#endTime').datetimepicker({
      dateFormat: config.dateFormat,
      timeFormat: config.timeFormat,
    });

    $('#startFilter').on('click', function(){
      var path = gui.Window.get().title;
      var fileLines = [];

      var allLogs = [];
      var currentLog;

      var lineCount = 1;
      var logCount = 0;

      var newLinePattern = new RegExp(/^\[([^\[\]]*)\]/);
      var logPattern = new RegExp(/\[([^\[\]]*)\]\s*(\S*)\s*(\S*)\s*(\S*)\s*(.*)/);

      var filterData = function(LogsToFilter){
        var resultLogs = [];

        filteredLogs = filterTime(LogsToFilter);

        normalFilterList.forEach(function(filterTarget) {
          filteredLogs = normalFilter.doFilter($, filteredLogs, filterTarget);
        });

        if ($('#message').val()) {
          filteredLogs = filterMessage(filteredLogs);
        }

        filteredLogs.forEach(function(result) {
          resultLogs.push(result.originLog);
        });

        $('#filterLogs').append(resultLogs.join('\n'));
      };

      new Lazy(fs.createReadStream(path).pipe(iconv.decodeStream(config.encoding)))
        .lines
        .map(String)
        .forEach(function(line) {
          fileLines.push(line);
          var isNewLine = line.match(newLinePattern);
          if (isNewLine) {
            if (currentLog) {
              var linesWithNum = addLineNum(lineCount, fileLines);
              lineCount = lineCount + fileLines.length;
              currentLog.originLog = linesWithNum.join('\n');
              allLogs.push(currentLog);
              fileLines.length = 0;
            }
            currentLog = new LogEntity();
            logCount++;
            var logMatch = line.match(logPattern);
            currentLog.update(logMatch[1].substring(0, logMatch[1].length + config.adjustSize-1) , logMatch[2], logMatch[3],
            logMatch[4], logMatch[5]);
          } else {
            if (currentLog === undefined) {
              return;
            } else {
              currentLog.appendMessage(line);
            }
          }
          if (logCount % config.blockSize === 0) {
            filterData(allLogs);
            allLogs.length = 0;
          }
        })
        .on('end', function() {
          var linesWithNum = addLineNum(lineCount, fileLines);
          lineCount = lineCount + fileLines.length;
          currentLog.originLog = linesWithNum.join('\n');
          allLogs.push(currentLog);
          filterData(allLogs);
        });
    });
  }

  function filterTime(logToFilter) {
    var startTimeStr = $('#startTime').val();
    var endTimeStr = $('#endTime').val();
    var startTime;
    var endTime;
    var startIndex = 0;
    var endIndex = logToFilter.length;
    if (startTimeStr) {
      startTime = moment(startTimeStr, config.fullFormat).format('x');
      startIndex = binaryIndexOf(logToFilter, startTime);
    }
    if (endTimeStr) {
      endTime = moment(endTimeStr, config.fullFormat).format('x');
      endIndex = binaryIndexOf(logToFilter, endTime);
    }
    var results = logToFilter.slice(startIndex, endIndex);
    return results;
  }

  function filterMessage(logToFilter) {
    var results = [];
    var message = $('#message').val();
    logToFilter.forEach(function(logEntity) {
      if (logEntity.message.toLowerCase().indexof(message.toLowerCase()) > -1) {
        results.push(logEntity);
      }
    });
    return results;
  }

  function binaryIndexOf(logToFilter, searchElement) {
    var minIndex = 0;
    var maxIndex = logToFilter.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = logToFilter[currentIndex].getFormatTime();

      if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
      }
      else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
      }
      else {
        return currentIndex;
      }
    }

    return currentIndex;
  }

  function getPreview(filename, size, callback) {
    var stream = fs.createReadStream(filename, {
      flags: 'r',
      fd: null,
      mode: 0666,
      bufferSize: 64 * 1024
    });

    var fileData = '';
    stream.on('data', function(contents){
      var data = iconv.decode(contents, config.encoding);
      fileData += data;

      // The next lines should be improved
      var lines = fileData.split("\n");

      if(lines.length >= size){
        stream.destroy();
        callback(null, fileData);
      }
    });

    stream.on('error', function(){
      callback('Error', null);
    });

    stream.on('end', function(){
      callback(null, fileData);
    });

  }

});
