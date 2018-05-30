
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

function AddChart(r, p, title, caption) {

	var c = document.createElement("div");

	var el = document.body;
	if (p) el = document.getElementById(p);
	el.appendChild(c);

	var out = [];
	out.push("<div class='g'>");

	var maxval = 0;
	for (var i = 0; i < r.length; i++) {
		if (maxval < r[i].value) maxval = r[i].value;
	}

	if (title) {
		out.push("<div class='gtitle'>" + title + "</div>");
	}

	for (var i = 0; i < r.length; i++) {
		out.push("<div class='grow'>");
			out.push("<div class='glab'>" + r[i].label + "</div>");
			var amt = 100 * (r[i].value / maxval);
			//var pxwidth = 5 * amt;
			var pctwidth = 0.5 * amt;
			var extrastyle = "";
			if (r[i].color) extrastyle = "background-color: " + r[i].color + ";";

			out.push("<div class='gfill' style='" + extrastyle + "width:" + pctwidth + "%'></div>");
			out.push("<div class='gamt'>" + r[i].value.toPrecision(4) + "</div>");
		out.push("</div>");
	}
	if (caption) {
		out.push("<div class='gsub'>" + caption + "</div>");
	}
	out.push("</div>");

	c.innerHTML = out.join("");
}

