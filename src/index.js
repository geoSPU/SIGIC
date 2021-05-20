var arqueologia = $.ajax({
  url:"https://raw.githubusercontent.com/geoSPU/SIGIC/master/Arqueologia.geojson",
  dataType: "json",
  success: console.log("Archeology data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var limites = $.ajax({
  url:"https://raw.githubusercontent.com/geoSPU/SIGIC/master/Limites.geojson",
  dataType: "json",
  success: console.log("Limits data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var zoneamento = $.ajax({
  url:"https://raw.githubusercontent.com/geoSPU/SIGIC/master/Zoneamento.geojson",
  dataType: "json",
  success: console.log("Zoning data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var geologia = $.ajax({
  url:"https://raw.githubusercontent.com/geoSPU/SIGIC/master/Geologia.geojson",
  dataType: "json",
  success: console.log("Geology data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var geomorfologia = $.ajax({
  url:"https://raw.githubusercontent.com/geoSPU/SIGIC/master/Geomorfologia.geojson",
  dataType: "json",
  success: console.log("Geomorfology data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var trilhas = $.ajax({
  url:"https://raw.githubusercontent.com/geoSPU/SIGIC/master/Trilhas.geojson",
  dataType: "json",
  success: console.log("Trail data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var drenagem = $.ajax({
  url:"https://raw.githubusercontent.com/geoSPU/SIGIC/master/Drenagem.geojson",
  dataType: "json",
  success: console.log("Drainage data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var edificacoes = $.ajax({
  url:"https://raw.githubusercontent.com/geoSPU/SIGIC/master/Edificacoes.geojson",
  dataType: "json",
  success: console.log("Buildings data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

  /* when().done() SECTION*/
  // Add the variable for each of your AJAX requests to $.when()
  $.when(limites, zoneamento, geologia, geomorfologia, trilhas, drenagem, edificacoes).done(function() {

  var mappos = L.Permalink.getMapLocation(zoom = 13, center = [-27.695, -48.465]);

  var map = L.map('map', {
    center: mappos.center,
    zoom: mappos.zoom,
    attributionControl: false,
    zoomControl: false,
    preferCanvas: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topright'
    }
  });

  L.Permalink.setup(map);

  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map);

  // create the sidebar instance and add it to the map
  var sidebar = L.control.sidebar({
      autopan: false,       // whether to maintain the centered map point when opening the sidebar
      closeButton: true,    // whether t add a close button to the panes
      container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
      position: 'left',     // left or right
  }).addTo(map);
  //.open('home');


  // Adds SIRGAS2000 definition
  proj4.defs('EPSG:31982', '+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ');

  // Basemaps

  var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	  maxZoom: 17,
	  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

	var OrtofotosSDS = L.tileLayer.wms(
    'http://sigsc.sc.gov.br/sigserver/SIGSC/wms', {
      maxNativeZoom: 19,
      maxZoom: 100,
      layers: 'OrtoRGB-Landsat-2012',
      label: "SIG/SC",
      iconURL: 'sig-sc.png'
  });

  var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
  });

  var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
  });

  var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
  });

  var LIMITES = L.geoJSON(limites.responseJSON, {
    style: {
      color: 'green',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Área (ha): </b>" + feature.properties.Area_ha
      );
    }
  }).addTo(map);

/*
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);
*/
  var ARQUEOLOGIA = L.Proj.geoJson(arqueologia.responseJSON, {
    style: {
      color: 'yellow',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Nome: </b>" + feature.properties.Nome + "<br>" +
        "<b>Coordenadas: </b> (" + feature.properties.E + ", " +
                                  feature.properties.N + ")<br>" +
        "<b>Classe: </b>" + feature.properties.Classe + "<br>" +
        "<b>Número: </b>" + feature.properties.Número + "<br>" +
        "<b>Tipo: </b>" + feature.properties.Tipo + "<br>"
      )
    }
  });

  var ZONEAMENTO = L.geoJSON(zoneamento.responseJSON, {
    style: {
      color: 'yellow',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Área: </b>" + feature.properties.Area_12 + "<br>" +
        "<b>Zona: </b>" + feature.properties.Zona_12 + "<br>" +
        "<b>Descrição: </b>" + feature.properties.Descr_1
      );
    }
  }).addTo(map);

  var EDIFICACOES = L.Proj.geoJson(edificacoes.responseJSON, {
    style: {
      color: 'red',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Edificação: </b>" + feature.properties.Edificação + "<br>" +
        "<b>Proprietário: </b>" + feature.properties.Proprietár + "<br>" +
        "<b>Denominação: </b>" + feature.properties.Denominaçã + "<br>" +
        "<b>Usuário: </b>" + feature.properties.Usuário + "<br>" +
        "<b>RIPs: </b>" + feature.properties.RIPs + "<br>" +
        "<b>Processo: </b>" + feature.properties.Processos + "<br>" +
        "<b>Tipo de Ocupação: </b>" + feature.properties.Ato_Admini
      );
    }
  }).addTo(map);


  var DRENAGEM = L.geoJSON(drenagem.responseJSON, {
    style: {
      color: 'blue',
      weight: 2
    }
  }).addTo(map);

  var TRILHAS = L.geoJSON(trilhas.responseJSON, {
    style: {
      color: 'brown',
      weight: 3
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup("<b>Nome: </b>" + feature.properties.Name);
      layer.on('mouseover', function() { layer.openPopup(); });
      layer.on('mouseout', function() { layer.closePopup(); });
    }
  }).addTo(map);

  var GEOLOGIA = L.Proj.geoJson(geologia.responseJSON, {
    style: {
      color: 'grey',
      weight: 3
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Nome: </b>" + feature.properties.Tipo
      );
    }
  });

  var GEOMORFOLOGIA = L.geoJSON(geomorfologia.responseJSON, {
    style: {
      color: 'white',
      weight: 3
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Tipo: </b>" + feature.properties.Tipo_12
      );
    }
  });

  var miniMap = new L.Control.MiniMap(Esri_NatGeoWorldMap, {
      position: 'topleft',
      toggleDisplay: true,
      zoomLevelOffset: -6
    }
  ).addTo(map);

  // Adds basemaps choices

  /*
  var basemaps = [
          Esri_WorldImagery, Esri_NatGeoWorldMap, OrtofotosSDS,
          OpenTopoMap, Stamen_Watercolor, Stamen_Terrain
          ];

  map.addControl(L.control.basemaps({
    basemaps: basemaps,
    tileX: 0,  // tile X coordinate
    tileY: 0,  // tile Y coordinate
    tileZ: 1   // tile zoom level
    })
  );
  */

  var baseLayers = {
		"OpenTopoMap": OpenTopoMap,
		"Esri Satélite": Esri_WorldImagery,
		"Aquarela (Stamen)": Stamen_Watercolor,
		"Rótulos (Stamen)": Stamen_Terrain,
		"Ortofotos SDS 2012": OrtofotosSDS
	};

	L.control.mousePosition({
    position: 'bottomleft'
  }).addTo(map);

  var overlays = {
		"Limites": LIMITES,
		"Zoneamento": ZONEAMENTO,
		"Arqueologia": ARQUEOLOGIA,
		"Geologia": GEOLOGIA,
		"Geomorfologia": GEOMORFOLOGIA,
		"Edificações": EDIFICACOES,
	  "Drenagem": DRENAGEM,
	  "Trilhas": TRILHAS
	};

	L.control.layers(baseLayers, overlays).addTo(map);

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(map);
	}

	map.on('click', onMapClick);

	map.locate({setView: true, maxZoom: 16});

	function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
  }

  function onLocationError(e) {
      alert(e.message);
  }

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);

});
