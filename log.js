/**
 * Logging class
 *
 * (c) 2019 MacLaurin Group
 */

module.exports = class log {

    constructor(_module) {
        this.module = (typeof _module != "undefined") ? _module : null;

        this.ALL = 10000;
        this.SEVERE = 1000;
        this.WARNING = 900;
        this.INFO = 800;
        this.CONFIG = 700;
        this.FINE = 500;
        this.NONE = 0;

        this.level = this.INFO;

        const LEVEL = { ALL: 10000, SEVERE: 1000, WARNING: 900, INFO: 800, CONFIG: 700, FINE: 500, NONE: 0 };
        if (process.env.LOG && LEVEL[process.env.LOG]) {
            this.level = LEVEL[process.env.LOG];
        }

        // Override; we are logging everything
        if (process.env.LOG_DEBUG) {
            this.level = LEVEL.FINE;
        }
    }


    severe(v, st) {
        this.log(this.SEVERE, v, st);
    }

    warning(v, st) {
        this.log(this.WARNING, v, st);
    }

    info(v, st) {
        this.log(this.INFO, v, st);
    }

    config(v, st) {
        this.log(this.CONFIG, v, st);
    }

    fine(v, st) {
        this.log(this.FINE, v, st);
    }

    log(lvl, v, stackTrace) {
        if (typeof lvl == "undefined" && typeof v == "undefined") {
            lvl = this.INFO;
            v = "undefined";
        } else if (typeof v == "undefined") {
            v = lvl;
            lvl = this.INFO;
        }

        // Only log from this level and below
        if (lvl < this.level) return;

        if (typeof v == "object" && v.stack && v.name) {
            stackTrace = (typeof stackTrace != "undefined") ? stackTrace : true;

            let b = "";
            if (v.code && v.message && v.extra) {
                b = "[" + v.name + "][" + v.code + "] " + v.message;

                if (v.extra != null) {
                    let s = String(v.extra);
                    if (s == "[object Object]")
                        b += "; [extra-Json] " + JSON.stringify(v.extra);
                    else
                        b += "; [extra] " + s;
                }

            } else {
                b = "[Error] " + v.message;
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
                const s = String(v);
                if (s == "[object Object]")
                    v = "[Obj-JSon] " + JSON.stringify(v);
                else
                    v = s;
            } catch (e) {
                console.log(e)
                v = "[Obj] " + v;
            }
        } else {
            v = " " + v;
        }

        const a = (this.module != null) ? "[" + this.module + "]" : "";
        console.log(a + "[" + LABEL[lvl] + "]" + v);
    }
}

const LABEL = { "1000": "SEVERE", "900": "WARNING", "800": "INFO", "700": "CONFIG", "500": "FINE" };