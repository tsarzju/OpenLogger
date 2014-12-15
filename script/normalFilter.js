define([], function() {
  function doFilter($, logToFilter, filterTarget) {
    var results = [];
    var filterValue = $('#' + filterTarget).val();
    if (filterValue) {
      logToFilter.forEach(function(logEntity) {
        if (logEntity[filterTarget].toString().toLowerCase().indexOf(filterValue) > -1) {
          results.push(logEntity);
        }
      });
    } else {
      return logToFilter;
    }
    return results;
  }

  return {
    doFilter : doFilter
  };
});
