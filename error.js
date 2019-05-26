/**
 * Set of generic helper errors
 */

class CodeError extends Error {
	constructor(code, message, extra) {
		super(message);
		this.name = "CodeError";
		this.code = code;
		this.message = message ? message : null;
		this.extra = (extra) ? extra : null;
	}
}

class MissingAttributeError extends CodeError {
	constructor(message, attribute) {
		super(400, message, attribute);
		this.name = "MissingAttributeError";
	}
}

class IllegalAttributeError extends CodeError {
	constructor(message, attribute) {
		super(400, message, attribute);
		this.name = "IllegalAttributeError";
	}
}

class MySQLError extends CodeError {
	constructor(p1, attribute) {
		let _p1 = p1;
		if (typeof p1 == "object" && p1.sqlMessage) {
			p1 = p1.sqlMessage;
		}
		super(400, p1, typeof attribute == "undefined" ? null : attribute);

		// Clean up the error
		this.name = "MySQLError";

		if (_p1.code) {
			if (_p1.code == "ER_DUP_ENTRY") {
				this.message = "duplicate entry";
			} else if (_p1.code == "ER_PARSE_ERROR") {
				this.message = "invalid statement";
			} else if (_p1.code == "ER_NO_SUCH_TABLE") {
				this.message = "invalid table";
				this.extra = _p1.sqlMessage.substring(_p1.sqlMessage.indexOf("'") + 1, _p1.sqlMessage.indexOf("' "));
			}
		}

		this.sql = (_p1.sqlMessage) ? JSON.stringify(_p1) : null;
	}

	getServerCode() {
		return this.sql != null ? JSON.parse(this.sql).code : null;
	}

	getSQL() {
		return this.sql != null ? JSON.parse(this.sql).sql : null;
	}
}

class NotSupportedError extends CodeError {
	constructor(message, attribute) {
		super(403, message, attribute);
		this.name = "NotSupportedError";
	}
}


module.exports = {

	CodeError,
	MissingAttributeError,
	IllegalAttributeError,
	MySQLError,
	NotSupportedError

};