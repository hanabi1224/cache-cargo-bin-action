import * as core from "@actions/core";
import * as cache from "@actions/cache";
import * as utils from "./utils";

async function main() {
	try {
		const restoreKey = utils.getRestoreKey();
		const restoredCacheKey = await cache.restoreCache(
			utils.getCachePaths(),
			restoreKey,
			[`${restoreKey}-`],
		);
		core.info(`restoreKey: ${restoreKey}`);
		if (restoredCacheKey) {
			core.info(`Cache restored from ${restoredCacheKey}.`);
			core.saveState(utils.RestoredCacheKeyStateKey, restoredCacheKey);
		} else {
			core.info("Cache not found.");
		}
	} catch (err: any) {
		core.setFailed(err.message);
	}
}

main();
