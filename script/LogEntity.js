define(['config', 'moment'], function(config, moment) {
  function LogEntity() {
    this.startLine = 0;
    this.endLine = 0;
    this.time = 0;
    this.formatTime = 0;
    this.threadId = '';
    this.producer = '';
    this.type = '';
    this.message = '';
    this.originLog = '';
  }

  function update(startLine, time, threadId, producer, type, message) {
    this.startLine = startLine;
    this.endLine = startLine + 1;
    this.time = time;
    this.threadId = threadId;
    this.producer = producer;
    this.type = type;
    this.message = message;
  }

  function getFormatTime() {
    if (this.formetTime > 0) {
      return this.formatTime;
    } else {
      this.formatTime = moment(this.time, config.fullFormat).format('x');
      return this.formatTime;
    }
  }

  LogEntity.prototype = {
    constructor : LogEntity,

    update : update,

    appendMessage : function(appendContent) {
      this.message = this.message + '\n' + appendContent;
    },

    getFormatTime : getFormatTime,

    toString : function() {
      return 'startLine' + this.startLine +
        '\nendLine' + this.endLine +
        '\ntime : ' + this.time +
        '\nthreadId : ' + this.threadId +
        '\nproducer : ' + this.producer +
        '\ntype : ' + this.type +
        '\nmessage : ' + this.message;
    }
  };

  return LogEntity;
});
