

var map = new mapboxgl.Map({
  container: 'map',
  style: 'style.json',
  center: [13.4244,52.5047],
  zoom: 10
});

map.on('load', function(e){
  d3.json('../data/all.min.geojson', function(err, data){

    var items = d3.select('#list ul').selectAll('li').data(data.features).enter().append('li').append('a').on('click', function(){
      var d = d3.select(this).datum();
      openDetails(d.properties.id);
    });

      items.append('img').attr('src', function(d){
        return './images/state_'+d.properties.state+'@2x.png';
      });
      items.append('span').html(function(d){
        var date = new Date(d.properties.date);
        return '<span>'+d.properties.title+'</span> (' + date.getDate()+'.'+(date.getMonth()+1)+'.'+(date.getYear()-100) + ')';
      });


    data.features.sort(function(a,b){
      return b.geometry.coordinates[1]-a.geometry.coordinates[1];
    });

    data.features.forEach(function(marker) {

      var el = document.createElement('div');
      el.className = 'marker '+marker.properties.state;
      el.addEventListener('click', function(){ 
        openDetails(marker.properties.id);
      }); 

      var m = new mapboxgl.Marker(el, {offset:[-2,-8.5]})
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

    });

  });
});

map.fitBounds(
  [[13.0790332437,52.3283651024],[13.7700526861,52.6876624308]],
  {
    offset: [0, 50],
    speed:999
  }
);

function openDetails(id){
  d3.select('#home').style('display','none');
  d3.selectAll('#detail *').remove();
  d3.select('#detail').style('display','block').html('<div id="loading">Informationen werden geladen...</div>');
  d3.json('../data/individual/'+id+'.json', function(err, data){
    //add close button
    data.properties.details.html = data.properties.details.html.replace('<a href="https://www.berlin.de/stadtplan/map.asp?ADR_X', '<a id="googlelink" href="https://www.google.com/maps/dir/?api=1&destination='+data.geometry.coordinates[1]+','+data.geometry.coordinates[0]+'" data-old="');
    data.properties.details.html = data.properties.details.html.replace('<a href="https://www.berlin.de/stadtplan/?ADR_X', '<a id="googlelink" href="https://www.google.com/maps/dir/?api=1&destination='+data.geometry.coordinates[1]+','+data.geometry.coordinates[0]+'" data-old="');
    data.properties.details.html = data.properties.details.html.replace('">Stadtplan</a>', '">Route berechnen</a>');

    d3.select('#detail').html(data.properties.details.html)

    d3.select('#detail h1').append('a').attr('id','closebtn').text('schließen').on('click', function(){
      d3.select('#detail').style('display','none');
      d3.select('#home').style('display','block');
    });
  });
}
