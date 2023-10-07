import pc from "picocolors";

export function logError(errorMessage) {
	console.error(pc.bgRed(errorMessage));
}
