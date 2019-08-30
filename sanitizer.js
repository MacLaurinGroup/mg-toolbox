/**
 * (c) 2019 MacLaurin Group
 */


module.exports = {

  filter: function (data, options) {
    // Default the options
    options = options || {};
    options.fields = options.fields || [];
    options.fieldsIgnored = options.fieldsIgnored || [];
    options.toLowerCase = options.toLowerCase || false;
    options.encode = options.encode || true;
    options.az09 = options.az09 || false;
    options.az09_ = options.az09_ || false;

    if (data !== null && typeof data === "object") {
      for (const field in data) {
        if (options.fields.length === 0 || options.fields.includes(field)) {
          if ( options.fieldsIgnored.length === 0 || !options.fieldsIgnored.includes(field) ){
            data[field] = _filter(data[field], options);
          }
        }
      }
    } else {
      data = _filter(data, options);
    }
    return data;
  },

  htmlTagFilter: function (data, options) {
    options.toLowerCase = options.toLowerCase || false;
    options.fields = options.fields || [];

    return data;
  }
};


function _filter(data, options) {
  if (typeof data !== "string" || data === null || data === "") {
    return data;
  }

  if ( options.az09_ ){
    data = data.replace(/[^a-zA-Z0-9-_]/g, "");
  } else if ( options.az09 ){
    data = data.replace(/[^a-zA-Z0-9-]/g, "");
  }

  if (options.encode) {
    data = data.replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  } else {
    data = data.replace(/\'/g, "").replace(/\"/g, "").replace(/</g, "").replace(/>/g, "");
  }

  if (options.toLowerCase) {
    data = data.toLowerCase();
  }

  return data;
}