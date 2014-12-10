var requirejs = require('requirejs');

requirejs.config({
  baseUrl:'script',
  nodeRequire: require
});

requirejs(['file'], function(file){
  var gui = require('nw.gui');
  $(function(){
    function clickInput(id) {
      $('#'+id).click();
    }

    $('#import').bind('change', function(e) {
      gui.Window.get().title = $(this).val();
      file.open($(this).val(), $);
    });

    $('#preview').hide();
    $('#showPreview').bind('click', function(e) {
      if ($(this).hasClass('active') === false) {
        $('#preview').show(700);
        $(this).addClass('active');
      } else {
        $('#preview').hide(700);
        $(this).removeClass('active');
      }
    });


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
});
