var requirejs = require('requirejs');

requirejs.config({
  baseUrl:'script',
  nodeRequire: require
});

requirejs(['node-syntaxhighlighter', 'file', 'config'], function(nsh, file, config){
  var gui = require('nw.gui');
  $(function(){
    var lines = [];

    initPreview();
    initMenu();

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
    });
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
        lines = contents.split('\n');

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
});
