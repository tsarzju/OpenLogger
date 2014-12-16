/*! Open-Logger 2014-12-16 */
var requirejs=require("requirejs");requirejs.config({baseUrl:"script",nodeRequire:require}),requirejs(["fs","iconv-lite","lazy","file","config","LogEntity","moment","normalFilter"],function(a,b,c,d,e,f,g,h){function i(){var a=e.styles,b=0;a.forEach(function(a){$("#styleSelect").append('<option value="'+b+'">'+a.name+"</option>"),b++}),A=a[0],B=a[0],$("#styleSelect").on("change",function(){B=A,A=a[$("#styleSelect").val()],p(A)})}function j(a,b,c){a.submenu.append(new C.MenuItem({label:b,click:c}))}function k(a){a.submenu.append(new C.MenuItem({type:"separator"}))}function l(a){$("#"+a).click()}function m(){var a=new C.Menu({type:"menubar"});a.append(new C.MenuItem({label:"File",submenu:new C.Menu})),j(a.items[0],"Import",function(){l("import")}),j(a.items[0],"Export",function(){}),k(a.items[0]),j(a.items[0],"Exit",function(){C.Window.get().close()}),C.Window.get().menu=a}function n(){$("#type").empty(),$("#previewLogs").scrollTop(0),$("#previewLogs").text(""),$("#filterLogs").scrollTop(0),$("#filterLogs").text("")}function o(a,b){C.Window.get().title=a,$("#previewLogs").text(b.join("\n")),$(".logDiv").show()}function p(a){$(".dynamic").remove();var b=a.filters;b.forEach(function(b){"time"===b.type?($("#filterControl").append('<span class="dynamic">'+b.name+' : </span><input id="startTime" class="dynamic"></input><span class="dynamic"> - </span><input id="endTime" class="dynamic"></input>'),$("#startTime").datetimepicker({dateFormat:a.dateFormat,timeFormat:a.timeFormat}),$("#endTime").datetimepicker({dateFormat:a.dateFormat,timeFormat:a.timeFormat})):("normal"===b.type||"message"===b.type)&&$("#filterControl").append('<span class="dynamic">'+b.name+' : </span><input id="'+b.id+'" class="'+b.type+' dynamic" type="text"></input>')})}function q(){$("#import").on("change",function(){var a=$(this).val();z(a,e.previewSize,function(b,c){n(),o(a,s(1,c.split("\n"))),p(A),r(B,A)})})}function r(a,b){a.filters.forEach(function(a){delete f.prototype[a.id]}),b.filters.forEach(function(a){f.prototype[a.id]=""})}function s(a,b){var c=a,d=[],e=5;a.toString().length>5&&(e=a.toString().length);var f=new Array(e).join(" ");return b.forEach(function(a){d.push((f+c).slice(-e)+" | "+a.replace(/\t/g,"    ")),c++}),d}function t(){return new RegExp(A.starter)}function u(){var a=[];return A.filters.forEach(function(b){a.push(b.regex)}),new RegExp(a.join(A.separator))}function v(){$("#startFilter").on("click",function(){$("#filterLogs").text(""),$("#status").text("processing"),$("#resultCount").text("");var d,g=C.Window.get().title,i=[],j=[],k=1,l=0,m=t(),n=u(),o=0,p=function(a,b){var c=[];A.filters.forEach(function(b){"time"===b.type?a=x(a):("normal"===b.type||"message"===b.type)&&(a=h.doFilter($,a,b.id))}),a.forEach(function(a){c.push(a.originLog)}),$("#filterLogs").append(c.join("\n")),o+=c.length,$("#resultCount").text(o),b===!0&&$("#status").text("finished")};new c(a.createReadStream(g).pipe(b.decodeStream(A.encoding))).lines.map(String).forEach(function(a){var b=a.match(m);if(b){if(d){var c=s(k,i);k+=i.length,$("#lineCount").text(k),d.originLog=c.join("\n"),j.push(d),i.length=0}d=new f,i.push(a),l++,$("#logCount").text(l),l%e.blockSize===0&&(p(j,!1),j.length=0,$("#logCount").text(l));var g=a.match(n),h=1;A.filters.forEach(function(a){var b="";b="time"===a.type?g[h].substring(0,g[h].length+A.adjustSize-1):g[h],d[a.id]=b,h++})}else{if(void 0===d)return k++,void $("#lineCount").text(k);var o=A.filters[A.filters.length-1];d[o]=d[o]+a,i.push(a)}}).on("pipe",function(){var a=s(k,i);k+=i.length,d.originLog=a.join("\n"),j.push(d),p(j,!0)})})}function w(a){return a.dateFormat+" "+a.timeFormat+a.lastFormat}function x(a){var b,c,d=$("#startTime").val(),e=$("#endTime").val(),f=0,h=a.length,i=w(A);d&&(b=g(d,i).format("x"),f=y(a,b)),e&&(c=g(e,i).format("x"),h=y(a,c));var j=a.slice(f,h);return j}function y(a,b){for(var c,d,e=0,f=a.length-1,g=w(A);f>=e;)if(c=(e+f)/2|0,d=a[c].getFormatTime(g),b>d)e=c+1;else{if(!(d>b))return c;f=c-1}return c}function z(c,d,e){var f=a.createReadStream(c,{flags:"r",fd:null,mode:438,bufferSize:65536}),g="";f.on("data",function(a){var c=b.decode(a,A.encoding);g+=c;var h=g.split("\n");h.length>=d&&(f.destroy(),e(null,g))}),f.on("error",function(){e("Error",null)}),f.on("end",function(){e(null,g)})}var A,B,C=require("nw.gui");$(function(){m(),i(),q(),v()})});