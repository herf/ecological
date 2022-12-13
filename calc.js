// Compact list of important calculations, so you don't have to look at all our UI code

function ImpactCRI(CRI) {
	if (CRI >= 75) return 0;
	return (75 - CRI) / 150;
}

function SortLamps(all) {

	var sorted = [];
	var index = {};

	for (var lamp in all) {
		
		// things we should average (as groups):
		var mean = {};
		mean.num = 0;
		mean.denom = 0;
		mean.name = lamp;
		mean.metric = all[lamp];

		// pull in data from this other table when we need it:
		if (visual[lamp]) {
			// compute our 0-1 "acceptability" CRI mapping:
			var lampCRI = parseFloat(visual[lamp].CRI);
			mean.metric.CRI = ImpactCRI(lampCRI);
		}

		// human circadian and star visibility, always included
		addMean(mean, "Melanopic lux");
		addMean(mean, "Starry Light");

		if (useCRI) {
			addMean(mean, "CRI");
		}

		// either include one species or four:
		var weight = 1.0;
		if (group == "all") weight = 1.0 / 4;

		// "mean of all four" per the paper:
		if (group == "shearwater" || group == "all") addMean(mean, "Shearwater", weight);
		if (group == "salmon" || group == "all") addMean(mean, "Juvenile Salmon", weight);

		// insect group = 1/4
		if (group == "insect" || group == "all") {
			addMean(mean, "Cleve Moth Attraction", weight / 3);
			addMean(mean, "van Grunsven Insect Phototaxis", weight / 3);
			addMean(mean, "Bee Attraction", weight / 3);
		}

		// turtle group = 1/4
		if (group == "turtle" || group == "all") {
			addMean(mean, "Green Turtle 92", weight / 3);
			addMean(mean, "Chelonia", weight / 3);
			addMean(mean, "Loggerhead Hatchling Attraction", weight / 3);
		}

		sorted.push({"label": lamp, "value": mean.num / mean.denom});
		index[lamp] = mean.num / mean.denom;
	}

	// possibly: normalize to D65 once more (accounts for CRI being good for D65)
	/*
	var D65val = index["D65"];
	for (var a in sorted) {
		sorted[a].value /= D65val;
	}*/

	sorted.sort(function(a, b) {
		return a.value - b.value;
	});

	return sorted;
}

function addMean(mean, id, weight) {
	if (!weight) weight = 1.0;

	if (!mean.metric.hasOwnProperty(id)) {
		console.log("Missing", id, mean.name);
		return;
	}

	if (mean.metric[id].d65) {
		mean.num += weight * mean.metric[id].d65;
	} else {
		mean.num += weight * mean.metric[id];
	}
	mean.denom += weight;
}

// Methods for integrating/interpolation action spectra (i.e. SPD * Action)

// lerp low-resolution action spectra to whatever wavelength you need here:
function lerpAction(act, wl) {
	var pos = (wl - act.base) / act.dt;
	var ind = Math.floor(pos);
	var frc = pos - ind;

	if (ind < 0) return 0;
	if (ind >= act.data.length) return 0;

	var result = act.data[ind];
	if (ind + 1 < act.data.length) {
		result += (act.data[ind + 1] - act.data[ind]) * frc;
	}

	return result;
}

// using previously-loaded data, calculate s * a (where they overlap)
function doIntegral(spec, act) {

	var r = {};

	if (!spec || !act) {
		console.log("Could not find data", spec, act);
		return 0;
	}

	var specdata = spec.data;
	var specwl = spec.freq;

	// loop over SPD wavelengths:
	var w0 = specwl[0];
	var w1 = specwl[specwl.length - 1] + 1;

	// you could adapt the input to another resolution, as long as you make D65 XX nm as well:
	var dt = specwl[1] - specwl[0];

	var sum = 0;
	var total = 0;

	r.data = [];

	// not very well bounds-checked here:
	for (var i = 0; i < specwl.length; i ++) {
		var wl = specwl[i];
		if (isNaN(specdata[i])) {
			console.log(wl, "invalid");
			continue;
		}

		var a = lerpAction(act, wl);
		sum += specdata[i] * a * dt;

		r.data.push(specdata[i] * a);

		total += specdata[i];
	}

	r.sum = sum;
	r.total = total;

	return r;
}


