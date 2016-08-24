
function loom() {

  var pi$3 = Math.PI;
  var tau$3 = pi$3 * 2;
  var max$1 = Math.max;

  var padAngle = 0,
		sortGroups = null,
		sortSubgroups = null,
		sortStrings = null,
		heightInner = 20,
		widthOffsetInner = function () { return x; },
		emptyPerc = 0.2,
		value = function (d) { return d; },
		inner = function (d) { return d.source; },
		outer = function (d) { return d.target; };

  function loom(data) {

		//Nest the data on the outer variable
		data = d3.nest().key(outer).entries(data);

		var n = data.length,
			groupSums = [],
			groupIndex = d3.range(n),
			subgroupIndex = [],
			looms = [],
			groups = looms.groups = new Array(n),
			subgroups,
			numSubGroups,
			uniqueInner = looms.innergroups = [],
			uniqueCheck = [],
			emptyk,
			k,
			x,
			x0,
			dx,
			i,
			j,
			l,
			m,
			s,
			v,
			sum,
			counter,
			reverseOrder = false,
			approxCenter;

		//Loop over the outer groups and sum the values
		k = 0;
		numSubGroups = 0;
		for (i = 0; i < n; i++) {
			v = data[i].values.length;
			sum = 0;
			for (j = 0; j < v; j++) {
				sum += value(data[i].values[j]);
			}//for j
			groupSums.push(sum);
			subgroupIndex.push(d3.range(v));
			numSubGroups += v;
			k += sum;
		}//for i

    // Sort groups…
    if (sortGroups) groupIndex.sort(function (a, b) {
      return sortGroups(groupSums[a], groupSums[b]);
    });

    // Sort subgroups…
    if (sortSubgroups) subgroupIndex.forEach(function (d, i) {
      d.sort(function (a, b) {
        return sortSubgroups(inner(data[i].values[a]), inner(data[i].values[b]));
      });
    });

		
		l = 0;
		for (i = 0; i < n; i++) {
			l += groupSums[groupIndex[i]];
			if (l > k / 2) {
				approxCenter = groupIndex[i];
				break;
			}
		}

		
		emptyk = k * emptyPerc / (1 - emptyPerc);
		k += emptyk;

    // Convert the sum to scaling factor for [0, 2pi].
    k = max$1(0, tau$3 - padAngle * n) / k;
    dx = k ? padAngle : tau$3 / n;

   
		subgroups = new Array(numSubGroups);
    x = emptyk * 0.25 * k;
		counter = 0;
		for (i = 0; i < n; i++) {
			var di = groupIndex[i],
				outername = data[di].key;

			if (approxCenter === di) {
				x = x + emptyk * 0.5 * k;
			}
			x0 = x;
			
			if (x > pi$3) reverseOrder = true;
			s = subgroupIndex[di].length;
			for (j = 0; j < s; j++) {
				var dj = reverseOrder ? subgroupIndex[di][(s - 1) - j] : subgroupIndex[di][j],
					v = value(data[di].values[dj]),
					innername = inner(data[di].values[dj]);
				a0 = x,
					a1 = x += v * k;
				subgroups[counter] = {
					index: di,
					subindex: dj,
					startAngle: a0,
					endAngle: a1,
					value: v,
					outername: outername,
					innername: innername
				};

				//Check and save the unique inner names
				if (!uniqueCheck[innername]) {
					uniqueCheck[innername] = true;
					uniqueInner.push({ name: innername });
				}

				counter += 1;
			}
			groups[di] = {
				index: di,
				startAngle: x0,
				endAngle: x,
				value: groupSums[di],
				outername: outername
			};
			x += dx;
		}

		//Sort the inner groups in the same way as the strings
		uniqueInner.sort(function (a, b) {
			return sortSubgroups(a.name, b.name);
		});
		
		m = uniqueInner.length
		for (i = 0; i < m; i++) {
			uniqueInner[i].x = 0;
			uniqueInner[i].y = -m * heightInner / 2 + i * heightInner + i * 5;
			uniqueInner[i].offset = widthOffsetInner(uniqueInner[i].name, i, uniqueInner);
		}

    //Generate bands for each (non-empty) subgroup-subgroup link
		counter = 0;
		for (i = 0; i < n; i++) {
			var di = groupIndex[i];
			s = subgroupIndex[di].length;
			for (j = 0; j < s; j++) {
				var outerGroup = subgroups[counter];
				var innerTerm = outerGroup.innername;
				//Find the correct inner object based on the name
				var innerGroup = searchTerm(innerTerm, "name", uniqueInner);
				if (outerGroup.value) {
					looms.push({ inner: innerGroup, outer: outerGroup });
				}
				counter += 1;
			}
		}

    return sortStrings ? looms.sort(sortStrings) : looms;
  };

  function searchTerm(term, property, arrayToSearch) {
	   for (var i = 0; i < arrayToSearch.length; i++) {
			if (arrayToSearch[i][property] === term) {
				return arrayToSearch[i];
			}
	   }
  }

  function constant$11(x) {
		return function () { return x; };
  }

  loom.padAngle = function (_) {
    return arguments.length ? (padAngle = max$1(0, _), loom) : padAngle;
  };

  loom.inner = function (_) {
    return arguments.length ? (inner = _, loom) : inner;
  };

  loom.outer = function (_) {
    return arguments.length ? (outer = _, loom) : outer;
  };

  loom.value = function (_) {
    return arguments.length ? (value = _, loom) : value;
  };

  loom.heightInner = function (_) {
    return arguments.length ? (heightInner = _, loom) : heightInner;
  };

  loom.widthOffsetInner = function (_) {
    return arguments.length ? (widthOffsetInner = typeof _ === "function" ? _ : constant$11(+_), loom) : widthOffsetInner;
  };

  loom.emptyPerc = function (_) {
    return arguments.length ? (emptyPerc = _ < 1 ? max$1(0, _) : max$1(0, _ * 0.01), loom) : emptyPerc;
  };

  loom.sortGroups = function (_) {
    return arguments.length ? (sortGroups = _, loom) : sortGroups;
  };

  loom.sortSubgroups = function (_) {
    return arguments.length ? (sortSubgroups = _, loom) : sortSubgroups;
  };

  loom.sortBands = function (_) {
    return arguments.length ? (_ == null ? sortBands = null : (sortBands = compareValue(_))._ = _, loom) : sortBands && sortBands._;
  };

  return loom;

}