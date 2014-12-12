define([], function() {
  function LogEntity() {
    this.time = 0;
    this.threadId = '';
    this.producer = '';
    this.type = '';
    this.message = '';
  }

  function update(time, threadId, producer, type, message) {
    this.setTime(time);
    this.setThreadId(threadId);
    this.setProducer(producer);
    this.setType(type);
    this.setMessage(message);
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
