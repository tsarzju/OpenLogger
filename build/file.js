/*! Open-Logger 2014-12-16 */
define(["fs","iconv-lite","config"],function(a,b,c){function d(d,e){a.readFile(d,function(a,f){if(!a){var g=b.decode(f,c.encoding);e(d,g)}})}function e(b,c){a.writeFile(b,c)}return{open:d,save:e}});