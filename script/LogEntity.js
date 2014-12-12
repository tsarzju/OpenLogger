define([], function() {
  function LogEntity() {
    this.lineNumber = 0;
    this.time = 0;
    this.threadId = '';
    this.producer = '';
    this.type = '';
    this.message = '';
  }

  function update(lineNumber, time, threadId, producer, type, message) {
    this.lineNumber = lineNumber;
    this.time = time;
    this.threadId = threadId;
    this.producer = producer;
    this.type = type;
    this.message = message;
  }

  LogEntity.prototype = {
    constructor : LogEntity,

    update : update,

    appendMessage : function(appendContent) {
      this.message = this.message + '\n' + appendContent;
    },

    toString : function() {
      return 'time : ' + this.time +
        '\nthreadId : ' + this.threadId +
        '\nproducer : ' + this.producer +
        '\ntype : ' + this.type +
        '\nmessage : ' + this.message;
    }
  };

  return LogEntity;
});
