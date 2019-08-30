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
      _filterObject(data, options);
    } else if ( Array.isArray(data) ){
      _filterArray( data, options );
    } else {
      data = _filter(data, options);
    }
    return data;
  }

};


function _filterObject(data, options){
  for (const field in data) {
    if (options.fields.length === 0 || options.fields.includes(field)) {
      if ( options.fieldsIgnored.length === 0 || !options.fieldsIgnored.includes(field) ){

        if ( typeof data[field] === "object" ){
          _filterObject( data[field], options );
        } else if ( Array.isArray(data[field]) ){
          _filterArray( data[field], options );
        } else {
          data[field] = _filter(data[field], options);
        }
        
      }
    }
  }
}


function _filterArray(data, options){
  for ( let x = 0; x < data.length; x++ ){
    if ( typeof data[x] === "object" ){
      _filterObject( data[x], options );
    } else if ( Array.isArray(data[x]) ){
      _filterArray( data[x], options );
    } else {
      data[x] = _filter(data[x], options);
    }
  }
}


function _filter(data, options) {
  if (typeof data !== "string" || data === null || data === "") {
    return data;
  }

  if ( options.az09_ ){
    data = data.replace(/[^a-zA-Z0-9-_\.]/g, "");
  } else if ( options.az09 ){
    data = data.replace(/[^a-zA-Z0-9-\.]/g, "");
  } else if (options.encode) {
    data = data.replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  } else {
    data = data.replace(/\'/g, "").replace(/\"/g, "").replace(/</g, "").replace(/>/g, "");
  }

  if (options.toLowerCase) {
    data = data.toLowerCase();
  }

  return data;
}