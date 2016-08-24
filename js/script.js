var margin = { left: 80, top: 40, right: 120, bottom: 100 },
	width = Math.max(Math.min(window.innerWidth, 1100) - margin.left - margin.right - 20, 400),
    height = Math.max(Math.min(window.innerHeight - 250, 900) - margin.top - margin.bottom - 20, 400),
    innerRadius = Math.min(width * 0.33, height * .45),
    outerRadius = innerRadius * 1.05;

//Recalculate the width and height now that we know the radius
width = outerRadius * 2 + margin.right + margin.left;
height = outerRadius * 2 + margin.top + margin.bottom;

//Reset the overall font size
var newFontSize = Math.min(70, Math.max(40, innerRadius * 62.5 / 250));
d3.select("html").style("font-size", newFontSize + "%");


// Set-up Chord parameters


var pullOutSize = 20 + 30 / 135 * innerRadius;
var numFormat = d3.format(",.0f");
var defaultOpacity = 0.85,
	fadeOpacity = 0.075;

var loom = loom()
    .padAngle(0.05)
	.emptyPerc(0.2)
	.widthOffsetInner(30)
	.value(function (d) { return d.words; })
	.inner(function (d) { return d.track; })
	.outer(function (d) { return d.singer; });

var arc = d3.arc()
    .innerRadius(innerRadius * 1.01)
    .outerRadius(outerRadius);

var string = string()
    .radius(innerRadius)
	.pullout(pullOutSize);

//track notes

var trackNotes = [];
trackNotes["Gandalf"] = "Speaking almost twice as many words as the second most abundant speaker, Gandalf is taking up a large portion of dialogue in almost every singer he's in, but stays rather quiet in Mordor";
trackNotes["Sam"] = "An unexpected runner up to having spoken the most words, Sam flourishes after the battle at Amon Hen, taking up a considerable portion of the words said in both Mordor and Gondor";
trackNotes["Aragorn"] = "Although eventually being crowned in Minas Tirith, Gondor, Aragorn is by far most talkative in that other human region, Rohan, fighting a battle at Helm's Deep and convincing an army of dead";
trackNotes["Frodo"] = "Frodo seems most comfortable speaking in the Shire, (mostly) when still an innocent youth, but he feels the burden of the ring increasingly towards the end and leaves the talking to his best friend Sam";
trackNotes["Gimli"] = "Gimli is a quiet track at practically all singers until he reaches Rohan, where he speaks almost half of all his lines";
trackNotes["Pippin"] = "Like Merry, Pippin is also seen saying something at all singers, but his presence is mostly felt when he sings his song in Minas Tirith, serving the steward of Gondor, Denethor";
trackNotes["Merry"] = "Merry manages to say an average sentence worth of words at all singers, but is most active during his time with Treebeard in Fangorn forest and bonding with Eowyn in Rohan";
trackNotes["Boromir"] = "Boromir speaks his finest lines during the march up Caradhras in the Misty Mountains and right before the Uruk-hai battle at Amon Hen, Parth Galen, taking up a large portion of the total number of words spoken at those singers";
trackNotes["Legolas"] = "Although a very memorable presence throughout the movies, Legolas speaks even less in 3 movies than Boromir, who is alive in only the first movie";

// create SVG

var svg = d3.select("#lyrics-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// bind in data

d3.json('./data_files/words_artists_songs.json', function (error, dataAgg) {

	// prepare the data

	//Sort the inner tracks based on the total number of words spoken

	//Find the total number of words per track
	var dataChar = d3.nest()
		.key(function (d) { return d.track; })
		.rollup(function (leaves) { return d3.sum(leaves, function (d) { return d.words; }); })
		.entries(dataAgg)
		.sort(function (a, b) { return d3.descending(a.value, b.value); });
	//Unflatten the result
	var trackOrder = dataChar.map(function (d) { return d.key; });
	//Sort the tracks on a specific order
	function sorttrack(a, b) {
		return trackOrder.indexOf(a) - trackOrder.indexOf(b);
	}//sorttrack

	//Set more loom functions
	loom
		.sortSubgroups(sorttrack)
		.heightInner(innerRadius * 0.75 / trackOrder.length);

	// Colors

	//Color for the unique singers
	var singers = ["DJ Khaled",
		"Jay-Z",
		"Future",
		"Drake",
		"Nas",
		"Big Sean",
		"Betty Wright",
		"Kendrick Lamar",
		"EarthGang",
		"J.Cole",
		"Bryson Tiller",
		"Nicki Minaj",
		"August Alsina",
		"Chris Brown",
		"Jeremih",
		"Rick Ross",
		"Kodak Black",
		"Jeezy",
		"French Montana",
		"YG",
		"Yo Gotti",
		"Gucci Mane",
		"2 Chainz",
		"Jadakiss",
		"Fabolous",
		"Fat Joe",
		"Busta Rhymes",
		"Ken Jones",
		"Travis Scott",
		"Lil Wayne",
		"Meghan Trainor",
		"Wiz Khalifa",
		"Wale",
		"Mavado"];
	var colors = ["#3B6AA0", "#7AA9DD", "#0276FD", "#003F87", "#1D7CF2", "#344152", "#50729F", "#4973AB", "#88ACE0", "#5993E5", "#3A66A7", "#3579DC", "#5190ED", "#42526C"];
	var color = d3.scaleOrdinal()
		.domain(singers)
		.range(colors);

	//Create a group to hold the data
	var g = svg.append("g")
		.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")")
		.datum(loom(dataAgg));

	// Title set-up

	var titles = g.append("g")
		.attr("class", "texts")
		.style("opacity", 0);

	titles.append("text")
		.attr("class", "name-title")
		.attr("x", 0)
		.attr("y", -innerRadius * 5 / 6);

	titles.append("text")
		.attr("class", "value-title")
		.attr("x", 0)
		.attr("y", -innerRadius * 5 / 6 + 25);

	//The track pieces	
	titles.append("text")
		.attr("class", "track-note")
		.attr("x", 0)
		.attr("y", innerRadius / 2)
		.attr("dy", "0.35em");

	// Draw outer arcs

	var arcs = g.append("g")
		.attr("class", "arcs")
		.selectAll("g")
		.data(function (s) {
			return s.groups;
		})
		.enter().append("g")
		.attr("class", "arc-wrapper")
		.each(function (d) {
			d.pullOutSize = (pullOutSize * (d.startAngle > Math.PI + 1e-2 ? -1 : 1))
		})
		.on("mouseover", function (d) {

			//Hide all other arcs	
			d3.selectAll(".arc-wrapper")
				.transition()
				.style("opacity", function (s) { return s.outername === d.outername ? 1 : 0.5; });

			//Hide all other strings
			d3.selectAll(".string")
				.transition()
				.style("opacity", function (s) { return s.outer.outername === d.outername ? 1 : fadeOpacity; });

			//Find the data for the hovered singer
			var singerData = loom(dataAgg).filter(function (s) { return s.outer.outername === d.outername; });
			//Hide the tracks with 0 word
			d3.selectAll(".inner-label")
				.transition()
				.style("opacity", function (s) {
					//Find out how many words the track contains at the hovered over a singer
					var char = singerData.filter(function (c) { return c.outer.innername === s.name; });
					return char.length === 0 ? 0.1 : 1;
				});
		})
		.on("mouseout", function (d) {

			//Sjow all arc labels
			d3.selectAll(".arc-wrapper")
				.transition()
				.style("opacity", 1);

			//Show all strings again
			d3.selectAll(".string")
				.transition()
				.style("opacity", defaultOpacity);

			//Show all tracks again
			d3.selectAll(".inner-label")
				.transition()
				.style("opacity", 1);
		});

	var outerArcs = arcs.append("path")
		.attr("class", "arc")
		.style("fill", function (d) { return color(d.outername); })
		.attr("d", arc)
		.attr("transform", function (d, i) { //Pull the two slices apart
			return "translate(" + d.pullOutSize + ',' + 0 + ")";
		});

	// draw outer labels

	//The text needs to be rotated with the offset in the clockwise direction
	var outerLabels = arcs.append("g")
		.each(function (d) { d.angle = ((d.startAngle + d.endAngle) / 2); })
		.attr("class", "outer-labels")
		.attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
		.attr("transform", function (d, i) {
			var c = arc.centroid(d);
			return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
				+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				+ "translate(" + 26 + ",0)"
				+ (d.angle > Math.PI ? "rotate(180)" : "")
		})

	//The outer name
	outerLabels.append("text")
		.attr("class", "outer-label")
		.attr("dy", ".35em")
		.text(function (d, i) { return d.outername; });

	//The value below it
	outerLabels.append("text")
		.attr("class", "outer-label-value")
		.attr("dy", "1.5em")
		.text(function (d, i) { return numFormat(d.value) + " words"; });

	// inner strings

	var strings = g.append("g")
		.attr("class", "stringWrapper")
		.style("isolation", "isolate")
		.selectAll("path")
		.data(function (strings) {
			return strings;
		})
		.enter().append("path")
		.attr("class", "string")
		.style("mix-blend-mode", "multiply")
		.attr("d", string)
		.style("fill", function (d) { return d3.rgb(color(d.outer.outername)).brighter(0.2); })
		.style("opacity", defaultOpacity);

	// inner labels

	var innerLabels = g.append("g")
		.attr("class", "inner-labels")
		.selectAll("text")
		.data(function (s) {
			return s.innergroups;
		})
		.enter().append("text")
		.attr("class", "inner-label")
		.attr("x", function (d, i) { return d.x; })
		.attr("y", function (d, i) { return d.y; })
		.style("text-anchor", "middle")
		.attr("dy", "-3")
		.text(function (d, i) { return d.name; })
		.on("mouseover", function (d) {

			//Show all the singers of the highlighted track and hide all else
			d3.selectAll(".string")
				.transition()
				.style("opacity", function (s) {
					return s.outer.innername !== d.name ? fadeOpacity : 1;
				});

			//Update the word count of the outer labels
			var trackData = loom(dataAgg).filter(function (s) { return s.outer.innername === d.name; });
			d3.selectAll(".outer-label-value")
				.text(function (s, i) {
					//Find which trackData is the correct one based on singer
					var loc = trackData.filter(function (c) { return c.outer.outername === s.outername; });
					if (loc.length === 0) {
						var value = 0;
					} else {
						var value = loc[0].outer.value;
					}
					return numFormat(value) + (value === 1 ? " word" : " words");

				});

			//Hide the arc where the track hasn't said a thing
			d3.selectAll(".arc-wrapper")
				.transition()
				.style("opacity", function (s) {
					//Find which trackData is the correct one based on singer
					var loc = trackData.filter(function (c) { return c.outer.outername === s.outername; });
					return loc.length === 0 ? 0.1 : 1;
				});

			//Update the title to show the total word count of the track
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 1);
			d3.select(".name-title")
				.text(d.name);
			d3.select(".value-title")
				.text(function () {
					var words = dataChar.filter(function (s) { return s.key === d.name; });
					return numFormat(words[0].value);
				});

			//Show the track note
			d3.selectAll(".track-note")
				.text(trackNotes[d.name])
				.call(wrap, 2.25 * pullOutSize);

		})
		.on("mouseout", function (d) {

			//Put the string opacity back to normal
			d3.selectAll(".string")
				.transition()
				.style("opacity", defaultOpacity);

			//Return the word count to what it was
			d3.selectAll(".outer-label-value")
				.text(function (s, i) { return numFormat(s.value) + " words"; });

			//Show all arcs again
			d3.selectAll(".arc-wrapper")
				.transition()
				.style("opacity", 1);

			//Hide the title
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 0);

		});

});



//Sort alphabetically
function sortAlpha(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

//Sort on the number of words
function sortWords(a, b) {
	if (a.words < b.words) return -1;
	if (a.words > b.words) return 1;
	return 0;
}

/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrap(text, width) {
	text.each(function () {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.2, // ems
			y = parseFloat(text.attr("y")),
			x = parseFloat(text.attr("x")),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
}