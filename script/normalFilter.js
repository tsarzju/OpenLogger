define([], function() {
  function doFilter($, logsToFilter, filterTarget) {
    var results = [];
    var filterValue = $('#' + filterTarget).val().trim();
    if (filterValue) {
      logsToFilter.forEach(function(logEntity) {
        if (logEntity[filterTarget].toString().toLowerCase().indexOf(filterValue.toString().toLowerCase()) > -1) {
          results.push(logEntity);
        }
      });
    } else {
      return logsToFilter;
    }
    return results;
  }

  return {
    doFilter : doFilter
  };
});
