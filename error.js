module.exports = class CodeError extends Error {
    constructor(code, message, otherData) {
        super(message);
        this.name = "CodeError";
        this.code = code;
        this.message = message ? message : null;
        this.otherData = (otherData) ? otherData : null;
    }
}