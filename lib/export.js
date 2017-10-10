titleCase = function(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

jsonToCsvExport = function(jsonData, fields, reportTitle, fileName) {
  var NEW_LINE = '\r\n';
  var DELIM = ',';
  var WRAPPER = '"';

  var csvString = '';
  var columnKeys = [];
  var columnLabels = [];

  _.each(fields, function(e) {
    if (_.isString(e)) {
      columnKeys.push(e);
    } else {
      columnKeys.push(e.key);
      columnLabels.push(e.label);
    }
  });

  if (columnKeys.length === 0) {
    if (jsonData && jsonData.length > 0) {
      columnKeys = _.keys(jsonData[0]);
    }
  }

  if (columnLabels.length === 0) {
    _.each(columnKeys, function(e) {
      columnLabels.push(titleCase(e));
    });
  }

  if (reportTitle && reportTitle.length > 0) {
    csvString = csvString.concat(reportTitle);
    csvString = csvString.concat(NEW_LINE);
    csvString = csvString.concat(NEW_LINE);
  }

  for (var i = 0; i < columnLabels.length; i++) {
    csvString = csvString.concat(WRAPPER);
    csvString = csvString.concat(columnLabels[i]);
    csvString = csvString.concat(WRAPPER);

    if (i + 1 < columnLabels.length) {
      csvString = csvString.concat(DELIM);
    }
  }

  csvString = csvString.concat(NEW_LINE);

  var fieldValue;

  for (i = 0; i < jsonData.length; i++) {
    for (var j = 0; j < columnKeys.length; j++) {
      fieldValue = get(jsonData[i], columnKeys[j]);
      if (fieldValue == null) {
        fieldValue = '';
      }

      csvString = csvString.concat(WRAPPER);
      csvString = csvString.concat(fieldValue);
      csvString = csvString.concat(WRAPPER);

      if (j + 1 < columnLabels.length) {
        csvString = csvString.concat(DELIM);
      }
    }

    csvString = csvString.concat(NEW_LINE);
  }

  var now = new Date();

  fileName = fileName || reportTitle || 'Export';
  fileName += '_' + now.getFullYear() + (now.getMonth() + 1) +
    now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
  fileName = fileName.replace(/ /g, '_');

  var uri = 'data:text/csv;charset=utf-8,' + escape(csvString);
  var link = document.createElement('a');
  link.href = uri;
  link.style = 'visibility:hidden';
  link.download = fileName + '.csv';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
