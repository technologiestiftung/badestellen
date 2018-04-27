var updateMapContainer = debounce(function() {
  d3.select('#map').style('height', Math.round(window.innerHeight<1000?window.innerHeight/2:500)+'px');
  map.resize();
}, 250);

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

if(d3.selectAll('#map').size()>0){

  window.addEventListener("resize", updateMapContainer);

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
}else{
  d3.select('#splash').transition()
    .duration(200)
    .style('opacity',0)
    .on('end', function(){
      d3.select('#splash').remove();
    });
}

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
              '    <a href="map:.."><img src="./images/signs/location@2x.png" width="30" height="30" alt="Route berechnen" />&nbsp;<span>Route berechnen</span></a><br />'+
              '    <a href="http://www.fahrinfo-berlin.de/Fahrinfo/bin/query.bin/dn?seqnr=&amp;ident=&amp;ZID=A=16@X='+parseFloat(locations[id][0]).toFixed(6).toString().replace('.','')+'@Y='+parseFloat(locations[id][1]).toFixed(6).toString().replace('.','')+'@O=WGS84%2052%B027%2747%20N%2013%B010%2747%20E&amp;ch"><img src="./images/signs/location@2x.png" width="30" height="30" alt="Anfahrt mit der BVG" />&nbsp;<span>Anfahrt mit der BVG</span></a><br />'+
              '    <h3>Wasserqualität</h3>'+ 
              '    <span class="stufen-icon stufen-'+data.state+'"></span>'+stufentext[data.state]+' <span class="small">(Letzte Messung: '+date.getDate()+'.'+(date.getMonth()+1)+'.'+(date.getYear()-100)+ ')</span>' +
              '    <span class="eu-ranks"><img class="eu-class" src="./images/eu-signs/excellent@2x.png" width="92" height="81" alt="Ausgezeichnete Badegewässerqualität" />' +
              '    <img src="./images/eu-signs/legend_excellent@2x.png" width="49" height="14" alt="Ausgezeichnet" />&nbsp;Ausgezeichnet<br />' +
              '    <img class="first" src="./images/eu-signs/legend_good@2x.png" width="49" height="14" alt="Gut" />&nbsp;Gut<br />' +
              '    <img src="./images/eu-signs/legend_sufficient@2x.png" width="49" height="14" alt="Ausreichend" />&nbsp;Ausreichend<br />' +
              '    <img src="./images/eu-signs/legend_poor@2x.png" width="49" height="14" alt="Mangelhaft" />&nbsp;Mangelhaft</span>' +
              '  </div>'+
              '  <div class="detail-addon">'+
              '    <h3 class="title">Weitere Angaben zur Badesstelle</h3>'+
              '    <ul>';

              if(data.cyano_moeglich){
                html += '<li><img src="./images/signs/cyano@2x.png" width="30" height="30" alt="Cyanobakterien massenhaft möglich (Blaualgen)" />&nbsp;Cyanobakterien massenhaft möglich (Blaualgen)</li>';
              }

              if(data.wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb || data.rettungsschwimmer){
                html += '<li><img src="./images/signs/rescue@2x.png" width="30" height="30" alt="Wasserrettung zeitweise" />&nbsp;Wasserrettung zeitweise</li>';
              }

              if(!data.barrierefrei){
                html += '<li><img src="./images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="Nicht barrierefrei" />&nbsp;Nicht barrierefrei</li>';
              }else{
                html += '<li><img src="./images/signs/barrierefrei@2x.png" width="30" height="30" alt="Barrierefrei" />&nbsp;Barrierefrei</li>';
              }

              if(!data.barrierefrei_zugang){
                html += '<li><img src="./images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="Zugang zum Wasser nicht barrierefrei" />&nbsp;Zugang zum Wasser nicht barrierefrei</li>';
              }else{
                html += '<li><img src="./images/signs/barrierefrei@2x.png" width="30" height="30" alt="Barrierefreier Zugang zum Wasser" />&nbsp;Barrierefreier Zugang zum Wasser</li>';
              }

              if(data.restaurant){
                html += '<li><img src="./images/signs/restaurant@2x.png" width="30" height="30" alt="Restaurant" />&nbsp;Restaurant</li>';
              }

              if(data.imbiss){
                html += '<li><img src="./images/signs/imbiss@2x.png" width="30" height="30" alt="Imbiss" />&nbsp;Imbiss</li>';
              }

              if(data.parken){
                html += '<li><img src="./images/signs/parken@2x.png" width="30" height="30" alt="Parkmöglichkeiten" />&nbsp;Parkmöglichkeiten</li>';
              }

              if(data.wc){
                html += '<li><img src="./images/signs/toilette@2x.png" width="30" height="30" alt="WC verfügbar" />&nbsp;WC verfügbar</li>';
                if(!data.barrierefrei_wc){
                  html += '<li><img src="./images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="WC ist nicht barrierefrei" />&nbsp;WC ist nicht barrierefrei</li>';
                }
              }else if(data.wc_mobil){
                html += '<li><img src="./images/signs/toilette@2x.png" width="30" height="30" alt="Mobiles WC verfügbar" />&nbsp;Mobiles WC verfügbar</li>';
                if(!data.barrierefrei_wc){
                  html += '<li><img src="./images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="WC ist nicht barrierefrei" />&nbsp;WC ist nicht barrierefrei</li>';
                }
              }

              if(data.hundeverbot){
                html += '<li><img src="./images/signs/hundeverbot@2x.png" width="30" height="30" alt="Hundeverbot" />&nbsp;Hundeverbot</li>';
              }else{
                html += '<li><img src="./images/signs/hundeverbot-not@2x.png" width="30" height="30" alt="Kein Hundeverbot" />&nbsp;Kein Hundeverbot</li>';
              }

      html += '    </ul>'+
              '  </div>'+
              '  <div class="detail-amt">'+
              '    <h3 class="title">Zuständiges Gesundheitsamt</h3>'+
              '    '+data.gesundheitsamt_name+'<br />'+
              '    '+data.gesundheitsamt_zusatz+'<br />'+
              '    '+data.gesundheitsamt_strasse+'<br />'+
              '    '+data.gesundheitsamt_plz+' '+data.gesundheitsamt_stadt+'<br /><br />'+
              '    <a href="mailto:'+data.gesundheitsamt_mail+'"><img src="./images/signs/email@2x.png" width="30" height="30" alt="Email" />&nbsp;<span>'+data.gesundheitsamt_mail+'</span></a><br />'+
              '    <a href="tel:'+data.gesundheitsamt_telefon+'"><img src="./images/signs/phone@2x.png" width="30" height="30" alt="Telefon" />&nbsp;<span>'+data.gesundheitsamt_telefon+'</span></a>'+
              '  </div>'+
              '</div>';


  d3.select('#detail').html(html).style('display','block');

  d3.select('#closebtn').on('click', function(){
      d3.selectAll('.marker').classed('inactive',false);
      d3.select('#detail').style('display','none');
      d3.select('#home').style('display','block');
  });

  document.documentElement.scrollTop = 0;

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