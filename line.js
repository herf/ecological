
function Graph(c) {
	this.gr = c;
}

//var graphBack = "#fafafa";

Graph.prototype.Clear = function() {
	var ct = this.gr.getContext('2d');
	//ct.fillStyle = graphBack;
	//ct.fillRect(0, 0, this.gr.width, this.gr.height);
	ct.clearRect(0, 0, this.gr.width, this.gr.height);
}

Graph.prototype.SetScale = function(data) {
	var maxbar = 0;
	// find max
	for (i = 0; i < data.length; i++) {
		if (data[i] > maxbar) maxbar = data[i];
	}
	if (!maxbar) return;
	this.barscale = 1.0 / maxbar;
}

Graph.prototype.Draw = function(data, co) {

	var i;
	var xstep = this.gr.width / (data.length - 1);

	var barscale;
	if (this.barscale) barscale = this.barscale;
	else {
		var maxbar = 0;
		// find max
		for (i = 0; i < data.length; i++) {
			if (data[i] > maxbar) maxbar = data[i];
		}
		if (!maxbar) return;
		barscale = 1.0 / maxbar;
	}

	var ct = this.gr.getContext('2d');
	ct.beginPath();
	if (co) ct.strokeStyle = co;
	else ct.strokeStyle = "#000";
	ct.lineWidth = 1.5;

	for (i = 0; i < data.length; i++) {
		var bheight = barscale * data[i];
		var xv = xstep * i;
		var yv = this.gr.height * (0.9 - 0.8 * bheight);
		ct.lineTo(xv, yv);
	}

	ct.stroke();
	ct.closePath();
}