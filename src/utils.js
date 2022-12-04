const pc = require("picocolors");

function logError(errorMessage) {
	console.error(pc.bgRed(errorMessage));
}

module.exports = {
	logError,
};
