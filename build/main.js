/*! Open-Logger 2014-12-11 */
var requirejs=require("requirejs");requirejs.config({baseUrl:"script",nodeRequire:require}),requirejs(["file"],function(a){function b(a,b,c){a.submenu.append(new d.MenuItem({label:b,click:c}))}function c(a){a.submenu.append(new d.MenuItem({type:"separator"}))}var d=require("nw.gui");$(function(){function e(a){$("#"+a).click()}$("#import").bind("change",function(){d.Window.get().title=$(this).val(),a.open($(this).val(),$)}),$("#preview").hide(),$("#showPreview").bind("click",function(){$(this).hasClass("active")===!1?($("#preview").show(700),$(this).addClass("active")):($("#preview").hide(700),$(this).removeClass("active"))});var f=new d.Menu({type:"menubar"});f.append(new d.MenuItem({label:"File",submenu:new d.Menu})),b(f.items[0],"Import",function(){e("import")}),b(f.items[0],"Export",function(){}),c(f.items[0]),b(f.items[0],"Exit",function(){d.Window.get().close()}),d.Window.get().menu=f})});