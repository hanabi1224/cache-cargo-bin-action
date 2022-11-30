import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as md5File from "md5-file";

export const RestoredCacheKeyStateKey = "RESTORED_CACHE_KEY";

export function getRestoreKey() {
	// https://docs.github.com/en/actions/learn-github-actions/environment-variables
	const os = process.env.RUNNER_OS?.toLowerCase() ?? "";
	const workflow = process.env.GITHUB_WORKFLOW?.toLowerCase() ?? "";
	const job = process.env.GITHUB_JOB?.toLowerCase() ?? "";
	return `${os}-cache-cargo-bin-${workflow}-${job}`;
}

export function getSaveKey() {
	const restoreKey = getRestoreKey();
	const metaHash = md5File.sync(path.join(getCargoHome(), ".crates2.json"));
	return `${restoreKey}-${metaHash}`;
}

export function getCachePaths() {
	const cargoHome = getCargoHome();
	return [
		path.join(cargoHome, "bin"),
		path.join(cargoHome, ".crates.toml"),
		path.join(cargoHome, ".crates2.json"),
	];
}

export function prepareCargoBinDirForSaving() {
	// Do nothing if it's not GH CI env
	if (!process.env.GITHUB_RUN_ID) {
		return;
	}

	const cargoBins = getCargoBins();
	core.info(`Installed cargo bins:`);
	for (let b of cargoBins) {
		core.info(`${b}`);
	}
	const binDir = path.join(getCargoHome(), "bin");
	const dir = fs.opendirSync(binDir);
	for (var entry = dir.readSync(); entry; entry = dir.readSync()) {
		if (entry.isFile() && !cargoBins.has(entry.name)) {
			const fullPath = path.join(dir.path, entry.name);
			core.info(`Deleting ${fullPath}`);
			fs.rmSync(fullPath);
		}
	}
}

function getCargoHome() {
	return process.env.CARGO_HOME ?? `${process.env.HOME}/.cargo`;
}

// https://github.com/Swatinem/rust-cache/blob/master/src/cleanup.ts#L57
function getCargoBins() {
	const cargoHome = getCargoHome();
	const bins = new Set<string>();
	try {
		const { installs }: {
			installs: { [key: string]: { bins: Array<string> } };
		} = JSON.parse(
			fs.readFileSync(path.join(cargoHome, ".crates2.json"), "utf8"),
		);
		for (const pkg of Object.values(installs)) {
			for (const bin of pkg.bins) {
				bins.add(bin);
			}
		}
	} catch { }
	return bins;
}
