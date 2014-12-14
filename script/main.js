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

  function initPreview() {
    var currentCursor = 0;
    $('#import').on('change', function(e) {
      gui.Window.get().title = $(this).val();
      file.open($(this).val(), function(path, contents) {
        currentCursor = 0;
        var fileLines = contents.split('\n');
        linesWithNum = addLineNum(fileLines);
        processLines(fileLines);

        allTypes.forEach(function(type) {
          $("#type").append('<option value="'+type+'">'+type+'</option>');
        });

        var result = nextData(linesWithNum, currentCursor, 1000);
        if (result) {
          $('#previewLogs').html(result.contents);
          currentCursor = result.endCursor;

          $('#filePath').val(path);
          $('.logDiv').show(700);

          var scrollFunc = function() {
            $('#previewContent').on('scroll', function(e) {
              if ($('#previewContent').scrollTop()+$('#previewContent').height() > $('#previewLogs').height() - 100) {
                var currentHeight = $('#previewContent div').first().scrollTop();
                var next = nextData(linesWithNum, currentCursor, 1000);
                if (next) {
                  $('#previewLogs').html(result.contents);
                  $('#previewLogs').scrollTop(currentHeight);
                  currentCursor = next.endCursor;
                  scrollFunc();
                }
              }
            });
          };
          scrollFunc();
        }
      });
    });
  }

  function addLineNum(linesWithoutNum) {
    var count = 1;
    var result = [];
    var maxLength = linesWithoutNum.length.toString().length;
    var padding = new Array(maxLength).join(' ');
    linesWithoutNum.forEach(function(line) {
      result.push((padding+count).slice(-maxLength) + " | " +line);
      count++;
    });
    return result;
  }

  function nextData(lines, currentCursor, size) {
    var endCursor = currentCursor + size;
    if (endCursor >= lines.length) {
      endCursor = lines.length - 1;
    }
    if (endCursor === currentCursor) {
      return;
    } else {
      return {
        endCursor : endCursor,
        contents : lines.slice(0, endCursor).join('\n')
      };
    }
  }

  function processLines(lines) {
    var currentLog;
    var newLinePattern = new RegExp(/^\[([^\[\]]*)\]/);
    var logPattern = new RegExp(/\[([^\[\]]*)\]\s*(\S*)\s*(\S*)\s*(\S*)\s*(.*)/);
    lines.forEach(function(line, index){
      var isNewLine = line.match(newLinePattern);
      if (isNewLine) {
        if (currentLog) {
          allLogs.push(currentLog);
          if (allTypes.indexOf(currentLog.type) === -1) {
            allTypes.push(currentLog.type);
          }
        }
        currentLog = new LogEntity();
        var logMatch = line.match(logPattern);
        currentLog.update(index, logMatch[1], logMatch[2], logMatch[3],
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
      var filteredLogs = [];
      filteredLogs = filterTime(allLogs);

      normalFilterList.forEach(function(filterTarget) {
        filteredLogs = normalFilter.doFilter($, filteredLogs, filterTarget);
      });

      if ($('#message').val()) {
        filteredLogs = filterMessage(filteredLogs);
      }

      var finalResults = [];
      filteredLogs.forEach(function(result) {
        finalResults.push(linesWithNum[result.lineNumber]);
      });

      $('#filterLogs').html(finalResults.join('\n'));
    });
  }

  function filterTime(logToFilter) {
    var startTimeStr = $('#startTime').val();
    var endTimeStr = $('#endTime').val();
    var startTime;
    var endTime;
    if (startTimeStr) {
      startTime = moment(startTimeStr, config.fullFormat);
    }
    if (endTimeStr) {
      endTime = moment(endTimeStr, config.fullFormat);
    }
    var results = [];
    logToFilter.forEach(function(logEntity) {
      var logTime = moment(logEntity.time.substring(0, logEntity.time.length + config.adjustSize-1), config.fullFormat);
      if (betweenTime(logTime, startTime, endTime)) {
        results.push(logEntity);
      }
    });


    return results;
  }

  function betweenTime(target, start, end) {
    if (start && end) {
      return ((target.isAfter(start) || target.isSame(start)) && (target.isBefore(end) || target.isSame(end)));
    } else if (start) {
      return (target.isAfter(start) || target.isSame(start));
    } else if (end) {
      return (target.isBefore(end) || target.isSame(end));
    } else {
      return true;
    }
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

});
