var requirejs = require('requirejs');

requirejs.config({
  baseUrl:'script',
  nodeRequire: require
});

requirejs(['node-syntaxhighlighter', 'file', 'config', 'LogEntity'], function(nsh, file, config, LogEntity){
  var gui = require('nw.gui');
  var allLogs = [];
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
        var lines = contents.split('\n');
        processLines(lines);
        for (var i=0; i<10; ++i) {
          console.log(allLogs[i].time);
        }
        var result = nextData(lines, currentCursor, 1000);

        if (result) {
          nsh.sh.defaults['auto-links'] = false;
          $('#previewContent').html(nsh.highlight(result.contents, nsh.getLanguage('plain')));
          currentCursor = result.endCursor;

          $('#filePath').val(path);
          $('.logDiv').show(700);

          var scrollFunc = function() {
            $('#previewContent div').first().on('scroll', function(e) {
              if ($('#previewContent div').first().scrollTop()+$('#previewContent div').first().height() > $('#previewContent div table').height() - 100) {
                var currentHeight = $('#previewContent div').first().scrollTop();
                var next = nextData(lines, currentCursor, 1000);
                if (next) {
                  $('#previewContent').html(nsh.highlight(next.contents, nsh.getLanguage('plain')));
                  $('#previewContent div').first().scrollTop(currentHeight);
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
    lines.forEach(function(line){
      var isNewLine = line.match(newLinePattern);
      if (isNewLine) {
        if (currentLog) {
          allLogs.push(currentLog);
        }
        currentLog = new LogEntity();
        var logMatch = line.match(logPattern);
        currentLog.update(logMatch[1], logMatch[2], logMatch[3],
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
      var startTime = $('#startTime').val();
      var endTime = $('#endTime').val();
      if (startTime === "" || endTime ==="") {
        return;
      }
      var result = [];
      var append =
      lines.forEach(function(line) {

      });
    });
  }
});
