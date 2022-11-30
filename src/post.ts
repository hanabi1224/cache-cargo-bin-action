import * as core from "@actions/core";
import * as cache from "@actions/cache";
import * as utils from "./utils";

async function main() {
	try {
		const restoredCacheKey = core.getState(utils.RestoredCacheKeyStateKey);
		utils.prepareCargoBinDirForSaving();
		const cacheSaveKey = utils.getSaveKey();
		if (restoredCacheKey != cacheSaveKey) {
			core.info(`Saving with key: ${cacheSaveKey}`);
			cache.saveCache(utils.getCachePaths(), cacheSaveKey);
		} else {
			core.info(`Skip saving`);
		}
	} catch (err: any) {
		core.setFailed(err.message);
	}
}

main();
