define([], function() {
  function doFilter(logToFilter, filterTarget) {
    var results = [];
    var filterValue = $('#' + filterTarget).val();
    logToFilter.forEach(function(logEntity) {
      if (filterValue === logEntity[filterTarget]) {
        results.push(logEntity);
      }
    });
    return results;
  }

  return {
    doFilter : doFilter
  };
});
