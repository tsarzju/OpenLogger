define(['config', 'moment'], function(config, moment) {
  function LogEntity() {
    this.originLog = '';
    this.formetTime = 0;
  }

  function getFormatTime(fullFormat) {
    if (this.formetTime > 0) {
      return this.formatTime;
    } else {
      this.formatTime = moment(this.time, fullFormat);
      console.log('formatTime ' + this.formatTime);
      return this.formatTime;
    }
  }

  LogEntity.prototype = {
    constructor : LogEntity,
    getFormatTime : getFormatTime
  };

  return LogEntity;
});
