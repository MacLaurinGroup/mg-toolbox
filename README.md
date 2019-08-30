# mg-toolbox

Small collection of utilities for node/lambda development; custom errors, logging and string sanitization.

To get installed, simply use the following:

```
npm i mg-toolbox --save
```

* Error classes
* log

## Error Classes

Since Javascript has only real one Error class, it is sometimes hard to be consistent and manage errors.  Not all errors are equal, not all require stack tracing.  A handful of helper Error classes are available:

* CodeError(code, message [,extra])
* MissingAttributeError(message [, extra])
* IllegalAttributeError(message [, extra])
* NotSupportedError(message [, extra])
* MySQLError(message [, extra])

You can easily wrap an existing Error in one of the above errors for help in processing up stream.

To use a stream, declare which ones you are going to use

```
const { MissingAttributeError, MySQLError } = require("mg-toolbox/error");
```

### CodeError

The CodeError is a class that is derived from the standard Error, that adds in a couple of extra parameters for easily identification.

```
// new CodeError( code, message, extra );

// Usage
{ CodeError } = require("mg-toolbox/error");

try{
  throw new CodeError(21, "Special Error", "Some Other Data");
}catch(e){
  if ( e.code == 21 ){
    // do something
  }else{
    log.severe(e, false);
  }
}
```


### MySQLError

The MySQLError is a special class for working with the mysql package.  This wraps up the error that it produces into something more accessible.  Particularly useful when used in conjunction with the the logging class of the mg-toolbox.

```
// new CodeError( code, message, extra );

// Usage
{ MySQLError } = require("mg-toolbox/error");

try {
  await this.dbConn.query("INSERT INTO `tableXXX` (`userId`,`object`,`objectId`,`payload`) VALUES (?,?,?,?)", [
    1,
    "tt",
    "21",
    "{}"
  ]);
} catch (e) {
  log.severe( new MySQLError(e) );
}
```

Extra MySQLErrormethods:

* getServerCode()
** Gets the original MySQL code; for example ER_NO_SUCH_TABLE
* getSQL()
** Returns the SQL statement that was attempted

In addition, when printing out this error, the stack trace of the mysql driver is not included, only relative to your code where the error actually originated.



## Logging

A very thin logging library that is based on the standard Java Logging library, with level control (ALL, SEVERE, WARNING, INFO, CONFIG, FINE, NONE).

The library was designed to be as lightweight as possible, with minimum processing going on.

Like Java, you can namespace your loggers to specific modules, that way when you look at a shared output, you know which area produced which entry (particularly useful inside of Lambda when CloudWatch groups all messages together).

```
// Create a standard logger
log = require("mg-toolbox/log");
log = new log();


// or Create a scoped logger
log = require("mg-toolbox/log");
log = new log("MyModule");

// or short hand with the require
log = new (require("mg-toolbox/log"))("MyModule");
```

Once you have done that you can then simply start using it:

```
// Standard level logging
log.severe("Sample Log");
log.warning("Sample Log");
log.info("Sample Log");
log.config("Sample Log");
log.fine("Sample Log");

// Specific Level
log.log( log.WARNING, "Sample Log");
```

Produces the following output: module level message

```
[MyModule][WARNING] Sample Log
```

### Level Setting

You can set the minimum logging level (defaulted at INFO):

```
log.level = log.WARNING;  // only log WARNING and above logs
```

To get the current level

```
if ( log.level == log.SEVERE){
	//...
}
```

In addition to setting the level through code, you can also set it via environment variable:

```
process.env.LOG=WARNING
```

In addition, there is a special environment variable for turning on all debugging:

```
process.env.LOG_DEBUG=true
```

### Special Output

In addition to setting the levels, the logger takes note of special object types that are passed in.  For example logging exceptions:

#### Errors

```
try{
  throw new Error("oops! something has gone wrong");
}catch(e){
  log.severe(e);
}
```

produces the following output, complete with stack trace.

```
[MyModule][SEVERE][Error] oops! something has gone wrong;
    at UserContext.<anonymous> (/home/mg/mg-toolbox/spec/log-spec.js:37:13)
    at QueueRunner.attempt (/home/mg/mg-toolbox/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:5505:44)
    at QueueRunner.run (/home/mg/mg-toolbox/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:5543:25)
    at runNext (/home/mg/mg-toolbox/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:5469:18)
```

#### Look!  No Stack Trace

Sometimes you don't want to see the stack trace; you just want the error logged.   You can control this with the additional parameter to the logger.

```
try{
  throw new Error("oops! something has gone wrong");
}catch(e){
  log.severe(e, false);
}
```

produces this instead:

```
[MyModule][SEVERE][ERROR] oops! something has gone wrong;
```

Please note, if you are logging out the CodeError (see below) then you will see the following:

```
try{
  throw new CodeError(21, "Special Error", "Some Other Data");
}catch(e){
  log.severe(e, false);
}
```

produces:

```
[MyModule][SEVERE][CODEERROR][21] Special Error; [extra] Some Other Data;
```

#### Objects

You can also pass in objects, which will attempt to produce readable output, even it can't be immediately produced, by creating a JSON version of it.

```
log.severe({age:2});
```

produces the following, with an indication that this was an object, and had to be converted to JSON to render it:

```
[MyModule][SEVERE][Obj-JSon] {"age":2}
```

It will only attempt to create a JSON output if the original object does not produce anything other than "[object Object]".

## Sanitization

This is a simple function that will clean up strings, and objects, of various filters.

```
options = {
  toLowerCase : true|false,  // default=false; lower cases the string
  encode : true|false,       // default=true; Encodes < > ' " to the HTML entity; otherwise removes them
  az09 : true|false,         // default=false; only permit a-z, A-Z, 0-9 and - in the string
  az09_ : true|false,        // default=false; only permit a-z, A-Z, 0-9 and - _ in the string
  fields : []                // If a map is passed in, then the list of fields to which this filter is applied; all if empty
}
```

* Can process a map of objects (typically a FORM post for example)
* Will ignore any non-string field, or null values


### Usage

```
const sanitizer = require("mg-toolbox/sanitizer");

const options = {
  toLowerCase : true
};

inData = "<h1>Hello</h1>";
outData = sanitizer.filter(inData, options);
// outData = &lt;h1&gt;hello&lt;/h1&gt;
```

Looping over an object

```
const sanitizer = require("mg-toolbox/sanitizer");

const options = {
  toLowerCase : true,
  encode : false,
  fields : ["a","b"]
};

inData = "<h1>Hello</h1>";
outData = sanitizer.filter({
      a : "<h1>Hello</h1>",
      b : "<h1>Hello</h1>",
      c : "<h1>Hello</h1>"
    }, options);
```