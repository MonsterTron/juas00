var $map = $('.mapTable tbody');
var mapPosition = {};
var $tileTemplate = $('.tile').remove();
var eventsBound = false;

$(function() {
    window.pointerEventsPolyfill();
});

function getRow(y) {
	if ($map.find('.row-'+y).length > 0) {
		return $map.find('.row-'+y);
	}
	else{
		return createRow(y);
	}
}

function createRow(y) {
	return $('<tr>').addClass('row-'+y).css({
		transform: 'translateY('+(y*6)+'em)'
	}).appendTo($map);
}

function getCol(y,x) {
	var $row = getRow(y);
	if($row.find('.col-'+x).length > 0){
		return $row.find('.col-'+x);
	}
	else{
		return createCol(y,x);
	}
}

function createCol(y,x) {
	var $row = getRow(y);
	return $('<td>').addClass('col-'+x).css({
		transform: 'translateX('+(x*6)+'em)'
	}).appendTo($row);
}

function getTile(x,y) {
	var $tile = getCol(y,x).find('.tile');
	if ($tile.length > 0) {
		return $tile;
	}
	else{
		return createTile(x,y,0);
	}
}

function createTile(x,y,tile) {
	var $tile = getCol(y,x).find('.tile');
	if ($tile.length == 0) {
		$tile = $tileTemplate.clone();
		$tile.css('z-index',(1000+x+y)*2);
		$tile.appendTo(getCol(y,x));
	}
	$tile.find('.tileTemplate').removeClass('tile-0').addClass('tile-'+tile);
	return $tile;
}

function setTile(x, y, mapData, factoryData, index, factoryIndex, movingFactory) {
  const unit = factoryData[factoryIndex];
  const $tile = getTile(x,y);
  const element = $tile.find('.tileTemplate');
  element.removeClass('tile-0').addClass('tile-'+mapData[index]);

  $tile.attr('data-index', index);

  const buildingDiv = element.children(":first");
  buildingDiv.removeClass();
  buildingDiv.children(":first").removeClass();

  if (mapData[index] < 16 && unit > 0) {
    buildingDiv.addClass('building').addClass('building-'+unit).children(":first").addClass('unit').addClass('unit-'+unit);
  }

  if (mapData[index] == 17) {
      buildingDiv.addClass('building').addClass('building-marketplace');
  } else if (mapData[index] == 18) {
      buildingDiv.addClass('building').addClass('building-clanhq');
  } else if (mapData[index] == 19) {
      buildingDiv.addClass('building').addClass('building-colosseum');
  } else if (mapData[index] == 20) {
      buildingDiv.addClass('building').addClass('building-premiumfactory');
  }

  if (movingFactory != null && movingFactory == index) {
       buildingDiv.addClass('tileDisabled');
  }

}

function setTileHeight(x,y,height) {
	var $tile = getTile(x,y);
	$tile.css({
		transform: 'translate3d('+(height)+'em, '+(height)+'em, 0em)'
	});
}

function hideTile(x,y){
	getTile(x,y).addClass('hide');
}

function showTile(x,y){
	getTile(x,y).removeClass('hide');
}

function toggleTile(x,y){
	getTile(x,y).toggleClass('hide');
}

function setSize(w,h,tile){
	for (var y = -h/2; y < h/2; y++) {
		for (var x = -w/2; x < w/2; x++) {
			createTile(x,y,tile);
		};
	};
}

function setMapPosition(x,y){
	mapPosition.x = x;
	mapPosition.y = y;

	$el = $('.mapTable')
    $content = $('#content')

    var initialHeight = 540;
    if (window.innerHeight < 540) {
        initialHeight = initialHeight * (window.innerHeight / 540);
    }

	$el['css']({
		left: (($content.width()/2) - $el.width()/2) + x,
		top: (($content.height()/2) - initialHeight/2) + y
	});
}

$(window).resize(function(event) {
	setMapPosition(0, $('#content').height()/2);
});
$(window).trigger('resize');





Number.prototype.toHHMMSS = function() {
	var sec_num = parseInt(this, 10);
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return hours + ':' + minutes + ':' + seconds;
}

String.prototype.truncate = function(length) {
    return this.length>length ? this.substring(0, length) : this;
};
