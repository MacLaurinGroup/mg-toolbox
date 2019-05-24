/**
 * (c) 2019 Maclaurin Group
 */
log = function(_module) {
    log.module = (typeof _module != "undefined") ? _module : null;
    return log;
};

const LEVEL = { ALL: 10000, SEVERE: 1000, WARNING: 900, INFO: 800, CONFIG: 700, FINE: 500, NONE: 0 };
const LABEL = { "1000": "SEVERE", "900": "WARNING", "800": "INFO", "700": "CONFIG", "500": "FINE" };

log.module = null;
log.l = 800; // Default it to INFO

// Set the initial ones
if (process.env.LOG && LEVEL[process.env.LOG]) {
    log.l = LEVEL[process.env.LOG];
}

// Override; we are logging everything
if (process.env.LOG_DEBUG) {
    log.l = LEVEL.FINE;
}

for (const key in LEVEL) {
    log[key] = LEVEL[key];
}

Object.defineProperty(log, "level", {
    get: function() { return log.l; },
    set: function(n) {
        for (const key in LEVEL) {
            if (LEVEL[key] == Number(n)) {
                log.l = Number(n);
            }
        }
    }
})

log.severe = function(v, st) {
    log.log(LEVEL.SEVERE, v, st);
}

log.warning = function(v, st) {
    log.log(LEVEL.WARNING, v, st);
}

log.info = function(v, st) {
    log.log(LEVEL.INFO, v, st);
}

log.config = function(v, st) {
    log.log(LEVEL.CONFIG, v, st);
}

log.fine = function(v, st) {
    log.log(LEVEL.FINE, v, st);
}

log.log = function(lvl, v, stackTrace) {
    if (typeof lvl == "undefined" && typeof v == "undefined") {
        lvl = LEVEL.INFO;
        v = "undefined";
    } else if (typeof v == "undefined") {
        v = lvl;
        lvl = LEVEL.INFO;
    }


    // Only log from this level and below
    if (lvl < log.l) return;


    if (typeof v == "object" && v.stack && v.name) {
        stackTrace = (typeof stackTrace != "undefined") ? stackTrace : true;

        let b = "";
        if (v.name == "CodeError") {
            b = "[CODEERROR][" + v.code + "] " + v.message;

            if (v.otherData != null) {
                let s = String(v.otherData);
                if (s == "[object Object]")
                    b += "; [CUSTOMDATA-JSON] " + JSON.stringify(v.otherData);
                else
                    b += "; [CUSTOMDATA] " + s;
            }

        } else {
            b = "[ERROR] " + v.message;
        }

        // Handling an ERROR
        let s = "";
        if (stackTrace) {
            s = v.stack;
            if (s.indexOf("   at") > -1)
                s = ";\r\n" + s.substring(s.indexOf("    at"));
        }
        v = b + s;
    } else if (typeof v == "object") {
        try {
            s = String(v);
            if (s == "[object Object]")
                v = "[OBJECT-JSON] " + JSON.stringify(v);
            else
                v = s;
        } catch (e) {
            v = "[OBJECT] " + v;
        }
    } else {
        v = " " + v;
    }

    const a = (log.module != null) ? "[" + log.module + "]" : "";

    console.log(a + "[" + LABEL[lvl] + "]" + v);
}

module.exports = log;