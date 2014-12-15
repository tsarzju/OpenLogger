var requirejs = require('requirejs');

requirejs.config({
  baseUrl:'script',
  nodeRequire: require
});

requirejs(['file', 'config', 'LogEntity', 'moment', 'normalFilter'],
  function(file, config, LogEntity, moment, normalFilter){
  var allTypes = [];
  var gui = require('nw.gui');
  var linesWithNum = [];
  var allLogs = [];
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
    allLogs = [];
    allTypes = [];
    linesWithNum = [];
    currentCursor = 0;

    $("#type").empty();
    $('#previewLogs').scrollTop(0);
    $('#previewLogs').text('');
    $('#filterLogs').scrollTop(0);
    $('#filterLogs').text('');
  }

  function update(path) {
    gui.Window.get().title = path;
    $("#type").append('<option value=""></option>');
    allTypes.forEach(function(type) {
      $("#type").append('<option value="'+type+'">'+type+'</option>');
    });
    $('#previewLogs').text(linesWithNum.slice(0, config.previewSize).join('\n'));
    $('.logDiv').show();
  }

  function initPreview() {
    $('#import').on('change', function(e) {
      file.open($(this).val(), function(path, contents) {
        clear();
        var time = new Date().getTime();
        var fileLines = contents.split('\n');
        console.log('split time : ' + (new Date().getTime() - time));
        time = new Date().getTime();
        linesWithNum = addLineNum(fileLines);
        console.log('add line : ' + (new Date().getTime() - time));
        time = new Date().getTime();
        processLines(fileLines);
        console.log('process lines : ' + (new Date().getTime() - time));
        time = new Date().getTime();
        update(path);
        console.log('update view : ' + (new Date().getTime() - time));
      });
    });
  }

  function addLineNum(linesWithoutNum) {
    var count = 1;
    var result = [];
    var maxLength = linesWithoutNum.length.toString().length;
    var padding = new Array(maxLength).join(' ');
    linesWithoutNum.forEach(function(line) {
      result.push((padding+count).slice(-maxLength) + " | " +line.replace(/\t/g, '    '));
      count++;
    });
    return result;
  }

  function processLines(lines) {
    var currentLog;
    var newLinePattern = new RegExp(/^\[([^\[\]]*)\]/);
    var logPattern = new RegExp(/\[([^\[\]]*)\]\s*(\S*)\s*(\S*)\s*(\S*)\s*(.*)/);
    lines.forEach(function(line, index){
      var isNewLine = line.match(newLinePattern);
      if (isNewLine) {
        if (currentLog) {
          currentLog.endLine = index;
          currentLog.originLog = linesWithNum.slice(currentLog.startLine, currentLog.endLine).join('\n');
          allLogs.push(currentLog);
          if (allTypes.indexOf(currentLog.type) === -1) {
            allTypes.push(currentLog.type);
          }
        }
        currentLog = new LogEntity();
        var logMatch = line.match(logPattern);
        currentLog.update(index, logMatch[1].substring(0, logMatch[1].length + config.adjustSize-1) , logMatch[2], logMatch[3],
          logMatch[4], logMatch[5]);
      } else {
        if (currentLog === undefined) {
          return;
        } else {
          currentLog.appendMessage(line);
        }
      }
    });
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
      $('#filterLogs').scrollTop(0);
      $('#filterLogs').text('');
      var filteredLogs = [];

      var time = new Date().getTime();

      filteredLogs = filterTime(allLogs);

      console.log('filter time : ' + (new Date().getTime() - time));
      time = new Date().getTime();

      normalFilterList.forEach(function(filterTarget) {
        filteredLogs = normalFilter.doFilter($, filteredLogs, filterTarget);
      });

      console.log('filter normal : ' + (new Date().getTime() - time));
      time = new Date().getTime();

      if ($('#message').val()) {
        filteredLogs = filterMessage(filteredLogs);
      }

      console.log('filter message : ' + (new Date().getTime() - time));
      time = new Date().getTime();

      var finalResults = [];
      filteredLogs.forEach(function(result) {
        finalResults.push(result.originLog);
      });

      console.log('concat time : ' + (new Date().getTime() - time));
      time = new Date().getTime();

      $('#filterLogs').text(finalResults.join('\n'));

      console.log('render time : ' + (new Date().getTime() - time));
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

  function filterThreadId(logToFilter) {
    var results = [];
    var threadId = $('#threadId').val();
    logToFilter.forEach(function(logEntity) {
      if (threadId === logEntity.threadId) {
        results.push(logEntity);
      }
    });
    return results;
  }

  function filterProduce(logToFilter) {
    var results = [];
    var producer = $('#producer').val();
    logToFilter.forEach(function(logEntity) {
      if (producer === logEntity.producer) {
        results.push(logEntity);
      }
    });
    return results;
  }

  function filterType(logToFilter) {
    var results = [];
    var type = $('#type').val();
    logToFilter.forEach(function(logEntity) {
      if (type === logEntity.type) {
        results.push(logEntity);
      }
    });
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

    if (logToFilter[currentIndex].getFormatTime() > searchElement) {
      return currentIndex;
    } else {
      return currentIndex + 1;
    }
  }
});
