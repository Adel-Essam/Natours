class AppError extends Error {
	constructor() {
		super();
	}
	create(message, statusCode) {
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.message = message;
		this.isOperational = true;
		return this;
	}
	// Error.captureStackTrace(this, this.create);
	// this.isOperational = true;
}

module.exports = new AppError();
