# mg-toolbox

Small collection of utilities for node/lambda development; custom errors, logging

To get installed, simply use the following:

```
npm i mg-toolbox --save
```


## Logging

A very thin logging library that is based on the standard Java Logging library, with level control (ALL, SEVERE, WARNING, INFO, CONFIG, FINE, NONE).

The library was designed to be as lightweight as possible, with minimum processing going on.

Like Java, you can namespace your loggers to specific modules, that way when you look at a shared output, you know which area produced which entry (particularly useful inside of Lambda when CloudWatch groups all messages together).

```
// Create a standard logger
log = require("mg-toolbox/log");

// or Create a scoped logger
log = require("mg-toolbox/log")("MyModule");
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

Produces the following output: [<module>][<level>]<message>

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
[MyModule][SEVERE][ERROR] oops! something has gone wrong;
    at UserContext.<anonymous> (/home/mg/mg-toolbox/spec/log-spec.js:37:13)
    at QueueRunner.attempt (/home/mg/mg-toolbox/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:5505:44)
    at QueueRunner.run (/home/mg/mg-toolbox/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:5543:25)
    at runNext (/home/mg/mg-toolbox/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:5469:18)
```

#### Objects

You can also pass in objects, which will attempt to produce readable output, even it can't be immediately produced, by creating a JSON version of it.

```
log.severe({age:2});
```

produces the following, with an indication that this was an object, and had to be converted to JSON to render it:

```
[MyModule][SEVERE][OBJECT-JSON] {"age":2}
```

It will only attempt to create a JSON output if the original object does not produce anything other than "[object Object]".