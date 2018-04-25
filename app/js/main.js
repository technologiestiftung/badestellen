var updateMapContainer = debounce(function() {
  d3.select('#map').style('height', Math.round(window.innerHeight<1000?window.innerHeight/2:500)+'px');
  map.resize();
}, 250);

window.addEventListener("resize", updateMapContainer);

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var map, locations = {}, gData = null, gKeys = {};

d3.csv('../processing/data/new.csv', function(err, data){

  gData = data;

  data.forEach(function(d,i){
    gKeys[d.detail_id] = i;
  });

  var items = d3.select('#list ul').selectAll('li').data(data).enter().append('li').style('background-image', function(d){
      return 'url(../processing/images/'+d.id+'.jpg)';
    }).append('a').on('click', function(){
    var d = d3.select(this).datum();
    openDetails(d.detail_id, true);
  }).append('span').attr('class','outer');

    items.append('img').attr('class', function(d){
      return 'stateimg state-'+d.state+((d.name.indexOf(d.gewaesser)>=0)?'':' substate'); 
    }).attr('src', './images/trans.gif');

    items.append('span').html(function(d){
      var textTitle = '<span>';

      if(d.name.indexOf(d.gewaesser)>=0){
        textTitle += d.name;
      }else{
        textTitle += d.name+'</span><br class="unresposive-break" /><span class="unresponsive-sub">'+d.gewaesser;
      }

      textTitle += '</span>';
      return textTitle;
    });


  data.sort(function(a,b){
    return b.lng - a.lng;
  });

  d3.select('#splash').transition()
    .duration(200)
    .style('opacity',0)
    .on('end', function(){
      d3.select('#splash').remove();
    });

  map = new mapboxgl.Map({
    container: 'map',
    style: 'style.json',
    center: [13.4244,52.5047],
    zoom: 10
  });

  map.addControl(new mapboxgl.NavigationControl(),'bottom-left');

  map.fitBounds(
    [[13.0790332437,52.3283651024],[13.7700526861,52.6876624308]],
    {
      offset: [0, 50],
      speed:999
    }
  );

  updateMapContainer();

  data.forEach(function(marker, i) {
    locations[marker.detail_id] = [marker.lat,marker.lng];

    var el = document.createElement('div');
    el.className = 'marker '+marker.state;
    el.setAttribute("id", "marker_"+marker.detail_id);
    el.addEventListener('click', function(){ 
      openDetails(marker.detail_id, false);
    }); 

    var m = new mapboxgl.Marker(el, {offset:[-2,-8.5]})
      .setLngLat([marker.lat,marker.lng])
      .addTo(map);
  });
});

function openDetails(id, zoom){
  if(zoom){ 
    map.flyTo({ center: locations[id], zoom:14 });
  }else{
    map.flyTo({ center: locations[id] });
  }
  d3.selectAll('.marker').classed('inactive',true);
  d3.select('#marker_'+id).classed('inactive',false);
  d3.select('#home').style('display','none');
  d3.selectAll('#detail *').remove();

  var data = gData[gKeys[id]];

  //add close button
  // data.properties.details.html = data.properties.details.html.replace('<a href="https://www.berlin.de/stadtplan/map.asp?ADR_X', '<a id="googlelink" href="https://www.google.com/maps/dir/?api=1&destination='+data.geometry.coordinates[1]+','+data.geometry.coordinates[0]+'" data-old="');
  // data.properties.details.html = data.properties.details.html.replace('<a href="https://www.berlin.de/stadtplan/?ADR_X', '<a id="googlelink" href="https://www.google.com/maps/dir/?api=1&destination='+data.geometry.coordinates[1]+','+data.geometry.coordinates[0]+'" data-old="');
  // data.properties.details.html = data.properties.details.html.replace('">Stadtplan</a>', '">Route berechnen</a>');

  var stufentext = {
    'gruen':'Zum Baden geeignet',
    'orange':'Vom Baden wird abgeraten',
    'rot':'Badeverbot'
  };

  var date = new Date(data.date);

  var html =  '<div class="detail-header">'+
              '  <h1>'+data.name_lang+'</h1><a id="closebtn">schließen</a>'+
              '  <h2>'+data.bezirk+'</h2>'+
              '</div>'+
              '<div class="detail-body">'+
              '  <div class="detail-image">'+
              '    <img src="'+data.image+'" alt="'+data.name+'" title="'+data.name+'"><br />'+
              '    <span class="caption">Bild: LAGeSo</span>'+
              '  </div>'+
              '  <div class="detail-location">'+
              '    <h3 class="title">Anschrift</h3>'+
              '    '+data.name_lang+'<br>'+
              '    '+data.strasse+'<br>'+
              '    '+data.plz+' '+data.stadt+'<br><br />'+
              '    <a href="map:..">Route berechnen</a><br /><br />'+
              '    <a href="http://www.fahrinfo-berlin.de/Fahrinfo/bin/query.bin/dn?seqnr=&amp;ident=&amp;ZID=A=16@X=13179795@Y=52463124@O=WGS84%2052%B027%2747%20N%2013%B010%2747%20E&amp;ch">Anfahrt mit der BVG</a><br /><br />'+
              '    Wasserqualität: '+ stufentext[data.state] +((data.cyano_moeglich)?'<br /><span class="small">(Möglicherweise Algen)</span>':'')+ '<br />' + 
              '    Letzte Messung: '+date.getDate()+'.'+(date.getMonth()+1)+'.'+(date.getYear()-100)+
              '  </div>'+
              '  <div class="detail-addon">'+
              '    <h3 class="title">Weitere Angaben zur Badesstelle</h3>'+
              '    <ul>';

              if(data.wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb){
                html += '<li>Wasserrettung durch DLRG oder ASB</li>';
              }

              if(data.rettungsschwimmer){
                html += '<li>Rettungsschwimmer</li>';
              }

              if(!data.barrierefrei){
                html += '<li>Nicht barrierefrei</li>';
              }

              if(!data.barrierefrei_zugang){
                html += '<li>Zugang zum Wasser nicht barrierefrei</li>';
              }

              if(data.restaurant){
                html += '<li>Restaurant</li>';
              }

              if(data.imbiss){
                html += '<li>Imbiss</li>';
              }

              if(data.parken){
                html += '<li>Parkmöglichkeiten</li>';
              }

              if(data.wc){
                html += '<li>WC verfügbar</li>';
                if(!data.barrierefrei_wc){
                  html += '<li>WC ist nicht barrierefrei</li>';
                }
              }else if(data.wc_mobil){
                html += '<li>Mobiles WC verfügbar</li>';
                if(!data.barrierefrei_wc){
                  html += '<li>WC ist nicht barrierefrei</li>';
                }
              }else{
                html += '<li>Kein WC verfügbar</li>';
              }

              if(data.hundeverbot){
                html += '<li>Hundeverbot</li>';
              }else{
                html += '<li>Kein Hundeverbot</li>';
              }

      html += '    </ul>'+
              '  </div>'+
              '  <div class="detail-amt">'+
              '    <h3 class="title">Zuständiges Gesundheitsamt</h3>'+
              '    '+data.gesundheitsamt_name+'<br />'+
              '    '+data.gesundheitsamt_zusatz+'<br />'+
              '    '+data.gesundheitsamt_strasse+'<br />'+
              '    '+data.gesundheitsamt_plz+' '+data.gesundheitsamt_stadt+'<br />'+
              '    <a href="mailto:'+data.gesundheitsamt_mail+'">'+data.gesundheitsamt_mail+'</a><br />'+
              '    <a href="tel:'+data.gesundheitsamt_telefon+'">'+data.gesundheitsamt_telefon+'</a>'+
              '  </div>'+
              '</div>';


  d3.select('#detail').html(html).style('display','block');

  d3.select('#closebtn').on('click', function(){
      d3.selectAll('.marker').classed('inactive',false);
      d3.select('#detail').style('display','none');
      d3.select('#home').style('display','block');
  });
}

/*
 * Responsive Menu Button
 */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}