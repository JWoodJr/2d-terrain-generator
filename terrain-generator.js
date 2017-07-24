
class World {
	constructor() {
		this.terrain = {};

		this.terrainTable = {
			'water': () => new Water(),
			'soil': () => new Soil(),
			'structure': () => new Structure(),
			'forest': () => new Forest(),
			'stone': () => new Stone(),
			'road': () => new Road()
		}
	}

	passable(x, y) {
		if (this.terrain && this.terrain[x] && this.terrain[x][y]) {
			return this.terrainTable[this.terrain[x][y]]().passable;
		}
	}

	newTerrain(terrainPresets, base, size) {
		terrainPresets = terrainPresets || {};

		console.log(base, size);
		this.size = size || 100;
		this.base = base || 'water';

		this.terrain = [];

		_.forEach(terrainPresets, (terrain, type) => {

			//terrain: amount, pivots, radius
			for (var x=0; x<terrain.amount; x++) {
				var terra = this.terrainTable[type] ? this.terrainTable[type]() : new Water();

				terra.setCoords(parseInt(Math.random() * this.size), parseInt(Math.random() * this.size));
				terra.createPatch(terrain.pivots || 5, terrain.radius || 9);

				_.forEach(terra.patch, (xList, x) => {
					var adjX = parseInt(x) + parseInt(terra.coords.x);
					_.forEach(xList, (yVal, y) => {
						var adjY = parseInt(y) + parseInt(terra.coords.y);

						if (!this.terrain[adjX]) {
							this.terrain[adjX] = {};
						}

						this.terrain[adjX][adjY] = type;
					});
				})
			}
		});
	}

	takeItToGo() {

		var takeOut = [];

		for (var x = 0; x<this.size; x++) {
			takeOut.push('');
			for (var y = 0; y<this.size; y++) {
				takeOut[x]+= (this.passable(x, y)) ? 0 : 1
			}
		}

		console.log(JSON.stringify(takeOut));
	}
}

class Logic {
	constructor() {}
}

class Surface extends Logic {
	constructor() {
		super();
		this.color = 'white';
	}

	createPatch(maxPivotPoints, maxRadius) {
		var pivotPoints = parseInt(Math.random() * maxPivotPoints) || 1;
		var pivotList = [];

		for (var i=0; i<pivotPoints; i++) {
			pivotList.push(this.pivotPoint(maxRadius));
		}

		var patch = pivotList.splice(0, 1)[0];

		_.forEach(pivotList, function(pivot) {
			var xKeys = _.keys(patch);
			var xOffset= xKeys[parseInt(Math.random() * xKeys.length)];
			var yKeys = _.keys(patch[xOffset]);
			var yOffset = yKeys[parseInt(Math.random() * yKeys.length)];

			_.forEach(pivot, function(xPoint, x) {
				_.forEach(xPoint, function(yPoint, y) {
					patch[parseInt(x) + parseInt(xOffset)] = patch[parseInt(x) + parseInt(xOffset)] || {}
					patch[parseInt(x) + parseInt(xOffset)][parseInt(y)+parseInt(yOffset)] = true;
				});
			});
		});

		this.patch = patch;

		return patch;
	}

		pivotPoint(maxRadius) {
		var pivot = {};

		var xRadius = parseInt(Math.random() * maxRadius) || 1;
		var yRadius = parseInt(Math.random() * maxRadius) || 1;

		if (xRadius < yRadius/3) {
			xRadius = parseInt(yRadius/3);
		}

		if (yRadius < xRadius/3) {
			yRadius = parseInt(xRadius/3)
		}

		var xOffset = parseInt(xRadius/2);
		var yOffset = parseInt(yRadius/2);
		var x = -xOffset;
		var y = -yOffset;

		while (x <= xOffset) {
			while (y <= yOffset) {
				if (Math.abs(x)+Math.abs(y)/2 >= (xOffset+yOffset)/2) {
				} else {
					pivot[x] = pivot[x] || {}
					pivot[x][y] = true;
				}
				y++;
			}
			y = -yOffset;
			x++;
		}

		return pivot;
	}

	setCoords(x, y) {
		this.coords = {
			x: x,
			y: y
		}
	}
}

class Soil extends Surface {
	constructor() {
		super();
		this.type = 'soil';
		this.passable = true;
	}
}

class Stone extends Surface {
	constructor() {
		super();
		this.type = 'stone';
		this.passable = false;
	}
}

class Water extends Surface {
	constructor() {
		super();
		this.type = 'water';
		this.passable = false;
	}
}

class Road extends Surface {
	constructor() {
		super();
		this.type = 'road';
		this.passable = true;	
	}
}

class Forest extends Surface {
	constructor() {
		super();
		this.type = 'forest';
		this.passable = true;
	}
}

class Structure extends Surface {
	constructor() {
		super();
		this.type = 'structure',
		this.passable = false;
	}

	pivotPoint(maxRadius) {
		var pivot = {};
		var xRadius = parseInt(Math.random() * maxRadius) || 1;
		var yRadius = parseInt(Math.random() * maxRadius) || 1;

		if (xRadius < yRadius/2) {
			xRadius = parseInt(yRadius/2);
		}

		if (yRadius < xRadius/2) {
			yRadius = parseInt(xRadius/2)
		}

		var xOffset = parseInt(xRadius/2);
		var yOffset = parseInt(yRadius/2);
		var x = -xOffset;
		var y = -yOffset;

		while (x <= xOffset) {
			while (y <= yOffset) {
				pivot[x] = pivot[x] || {}
				pivot[x][y] = true;
				y++;
			}
			y = -yOffset;
			x++;
		}

		return pivot;
	}

	// createPatch(thing, thing2) {
	// 	this.pivotPoint(thing2);
	// }
}

var size = (function initTerrainSize() {
	if (!localStorage.getItem('terrain_size')) {
		localStorage.setItem('terrain_size', 100);
	}

	return localStorage.getItem('terrain_size');
})();

var base = (function initTerrainBase() {
	if (!localStorage.getItem('terrain_base')) {
		localStorage.setItem('terrain_base', 'water');
	}

	return localStorage.getItem('terrain_base');
})();

var terrainPresets = (function initTerrainPresets() {

	if (!localStorage.getItem('terrain_presets')) {
		localStorage.setItem('terrain_presets', JSON.stringify({
			water: {
				amount: 0,
				pivots: 10,
				radius: 18
			},
			soil: {
				amount: 45,
				pivots: 20,
				radius: 25
			},		
			forest: {
				amount: 35,
				pivots: 20,
				radius: 10
			},
			structure: {
				amount: 15,
				pivots: 2,
				radius: 6
			},
			stone: {
				amount: 17,
				pivots: 20,
				radius: 15
			},
		}));
	}

	return JSON.parse(localStorage.getItem('terrain_presets'));
})();

var world = new World();

$().ready(function main() {
	addPresets(terrainPresets, base, size)

	var logic = new Logic();

	world.newTerrain(terrainPresets, base, size);
	refreshView(world);
})