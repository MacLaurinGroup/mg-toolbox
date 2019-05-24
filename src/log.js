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
if (process.env.LOG) {
    log.l = process.env.LOG
}

// Override; we are logging everything
if (process.env.DEBUG) {
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

log.severe = function(v) {
    log.log(LEVEL.SEVERE, v);
}

log.warning = function(v) {
    log.log(LEVEL.WARNING, v);
}

log.info = function(v) {
    log.log(LEVEL.INFO, v);
}

log.config = function(v) {
    log.log(LEVEL.CONFIG, v);
}

log.fine = function(v) {
    log.log(LEVEL.FINE, v);
}

log.log = function(lvl, v) {
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
        // Handling an ERROR
        let s = v.stack;
        if (s.indexOf("   at") > -1)
            s = s.substring(s.indexOf("    at"));

        v = "[ERROR] " + v.message + ";\r\n" + s;
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