
$().ready(function () {

	// $('.terrain-table').on('click', '.tile', function(e){
	// 	enterTile(e);
	// 	refreshView();
	// });

	$('#terrainForm').submit(function() {
		var presets = {};
		world = new World();

		var size = $('#world-size').val();
		var base = $('#world-base').val();

		_.forEach(world.terrainTable, (i, terra) => {
			presets[terra] = {};
			presets[terra].amount = $(this[terra+'Amount']).val();
			presets[terra].pivots = $(this[terra+'Pivot']).val();
			presets[terra].radius = $(this[terra+'Radius']).val();
		});

		setPresets(presets, base, size);
		world.newTerrain(presets, base, size);
		refreshView(world);

		return false;
	});
});

function refreshView(world) {
	var map = $('.terrain-table');
	map.html('');
	for (var x=0; x<world.size; x++) {
		map.append('<tr class="x-'+x+'"></div>');
		var xAxis = $('.x-'+x);

		for (var y=0; y<world.size; y++) {
			var surface = (world.terrain[x] && world.terrain[x][y]) ? world.terrain[x][y] : world.base
			var tile = $('<td class="'+surface+' tile y-'+y+'"></div>');

			tile.prop('data-x', x);
			tile.prop('data-y', y);
			tile.prop('data-terrain', surface);
			xAxis.append(tile);
		}
	}
}

function enterTile(e) {
	var tile = $(e.target);
	var x = tile.prop('data-x');
	var y = tile.prop('data-y');
	var terrainTable = {
		base: tile.prop('data-terrain')
	}

	var coords = [{
		x: 0,
		y: -1
	}, {
		x: -1,
		y: 0
	}, {
		x: 1,
		y: 0
	}, {
		x: 0,
		y: 1
	}];

	_.forEach(coords, function(coord) {
		var adjX = x + coord.x;
		var adjY = y + coord.y;
		var neighborTerrain = $(['.x-', adjX, ' .y-', adjY].join('')).prop('data-terrain');

		if (!terrainTable[neighborTerrain]) {
			terrainTable[neighborTerrain] = {
				amount: 0,
				pivots: 5,
				radius: 9
			}
		}

		terrainTable[neighborTerrain].amount++
	});

	world.newTerrain(terrainTable, localStorage.getItem('terrain_size'), localStorage.getItem('terrain_base'));
}

function changeTerrain(frm) {
	return false;
}

function addPresets(presets, base, size) {
	$('#world-size').val(size);
	$('#world-base').val(base);

	_.forEach(presets, function(preset, terra) {
		$('#'+terra+'-amount').val(preset.amount);
		$('#'+terra+'-pivot').val(preset.pivots);
		$('#'+terra+'-radius').val(preset.radius);
	})
}

function setPresets(presets, base, size){

	if (presets) {
		localStorage.setItem('terrain_presets', JSON.stringify(presets));
	}

	if (base) {
		localStorage.setItem('terrain_base', base);
	}

	if (size) {
		localStorage.setItem('terrain_size', size);
	}
}