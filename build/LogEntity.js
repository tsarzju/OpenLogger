/*! Open-Logger 2014-12-16 */
define(["config","moment"],function(a,b){function c(){this.originLog="",this.formetTime=0}function d(a){return this.formetTime>0?this.formatTime:(this.formatTime=b(this.time,a).format("x"),this.formatTime)}return c.prototype={constructor:c,getFormatTime:d},c});