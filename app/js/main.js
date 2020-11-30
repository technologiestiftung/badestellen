/*global d3, is_detail, mapboxgl */
/*exported myFunction*/

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

/*----- Feedback Form -----*/

// d3.select("#feedbackBtn")
//   .on("click", function(){
//     d3.select("#feedbackContainer")
//       .style("display", "block")
//       .on("click", function(){

//         if (d3.event.target.id === "feedbackContainer") {
//           d3.select("#feedbackContainer")
//             .style("display", "none");
//         }
//       });
//   });

// d3.select("#feedbackSubmit")
//   .on("click", function(){
//     var formElement = document.querySelector("#feedback");
//     var request = new XMLHttpRequest();
//     request.open("POST", "https://tsb.ara.uberspace.de/badedaten/feedback");
//     request.send(new FormData(formElement));
//     d3.select("#feedbackContainer")
//       .style("display", "none");
//     formElement.reset();
//   });

/*----- Feedback Form End -----*/

var state = {
  type:'overview',
  id:null,
  ani:false
};

function retrieveUrl(){
  state = {
    type:'overview',
    id:null,
    ani:false
  };
  var comps = window.location.href.split('?');
  if(comps.length>1){
    var els = comps[1].split('&');
    var cs = els[0].split('=');
    if(cs[0]=='id'){
      if(cs[1] in gKeys){
        state.type = 'detail';
        state.id = cs[1];

        cs = els[1].split('=');
        state.ani = cs[1];
      }
    }
  }
  updateInterface();
}

window.addEventListener('popstate', function() {
  retrieveUrl();
});

var dispatcher = d3.history('action');

dispatcher.on('action', function() {
  updateInterface(); 
});

function updateInterface(){
  if(state.type == 'detail'){
      openDetails(state.id, (state.ani=='true')?true:false);
  }else{
      d3.selectAll('.marker').classed('inactive',false);
      d3.select('#detail').style('display','none');
      d3.select('#detail *').remove();
      d3.select('#home').style('display','block');
  }
}

var updateMapContainer = debounce(function() {
  d3.select('#map').style('height', Math.round(window.innerHeight<1000?window.innerHeight/2:500)+'px');
  if(map){
    map.resize();
  }
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
}

var map = false, locations = {}, gData = null, gKeys = {}, id_map = {};

if(d3.selectAll('#map').size()>0){

  window.addEventListener("resize", updateMapContainer);

  var date = new Date()

  d3.csv('http://flusshygiene-berlin-data.s3.eu-central-1.amazonaws.com/lageso/new_build.csv?date='+date.getYear()+'-'+date.getMonth()+'-'+date.getDate()+':'+date.getHours()).then(function(data){

    data.sort(function(a,b){
      return b.lat - a.lat;
    });

    gData = data;

    data.forEach(function(d){
      id_map[d.id] = d.detail_id;
    });

    data.forEach(function(d,i){
      gKeys[d.detail_id] = i;
    });

    var listData = (JSON.parse(JSON.stringify(data))).sort(function(a,b){
      if(a.name<b.name){
        return -1;
      }else if(a.name>b.name){
        return 1;
      }
      return 0;
    });

    d3.select('#list ul').selectAll('li').remove();

    var items = d3.select('#list ul').selectAll('li').data(listData).enter().append('li').style('background-image', function(d){
        return 'url(http://flusshygiene-berlin-data.s3.eu-central-1.amazonaws.com/lageso/images/badestellen/'+d.id+'.jpg)';
      }).append('a').on('click', function(){
      var d = d3.select(this).datum();
      state.type = 'detail';
      state.id = d.detail_id;
      state.ani = 'true';
      dispatcher.call('action', this, '?id='+d.detail_id+'&ani=true');
    }).append('span').attr('class','outer');

      items.append('img').attr('class', function(d){
        return 'stateimg state-'+d.real_state+((d.name.indexOf(d.gewaesser)>=0)?'':' substate'); 
      }).attr('src', ((is_detail)?'../':'./') + 'images/trans.gif');

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


    d3.select('#splash').transition()
      .duration(200)
      .style('opacity',0)
      .on('end', function(){
        d3.select('#splash').remove();
      });


    var style_source = ((is_detail)?'../':'./') +'style.json';

    var version = detectIE();

    if (version === false) {
      //no ie / edge
    } else if (version >= 12) {
      style_source = ((is_detail)?'../':'./') +'tile_style.json';
    } else {
      style_source = ((is_detail)?'../':'./') +'tile_style.json';
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoidGVjaG5vbG9naWVzdGlmdHVuZyIsImEiOiJjanl6bmRtd2swMzh0M2NxbjFtaWxtNnZnIn0.xBc9YIbxGpnXTP-epGZUfw';

    map = new mapboxgl.Map({
      container: 'map',
      style: "mapbox://styles/technologiestiftung/cjz09bylr5f8k1cp83p7cwdaf",
      center: [13.4244,52.5047],
      zoom: 10
    });

    map.addControl(new mapboxgl.NavigationControl(),'bottom-left');

    map.fitBounds(
      [[13.0790332437,52.3283651024],[13.7700526861,52.6876624308]],
      {
        //offset: [0, 50],
        speed:999
      }
    );

    updateMapContainer();

    data.forEach(function(marker) {
      locations[marker.detail_id] = [marker.lat,marker.lng];

      var el = document.createElement('div');
      el.className = 'marker marker-'+marker.real_state;
      el.setAttribute("id", "marker_"+marker.detail_id);
      el.addEventListener('click', function(){ 
        state.type = 'detail';
        state.id = marker.detail_id;
        state.ani = 'false';
        dispatcher.call('action', this, '?id='+marker.detail_id+'&ani=false');
      }); 

      new mapboxgl.Marker(el, {offset:[-2,-8.5]})
        .setLngLat([marker.lat,marker.lng])
        .addTo(map);
    });

    if(!is_detail){
      retrieveUrl();
    }else{
      d3.select('#detail').style('display','block');
      d3.select('#home').style('display','none');
      state.type = 'detail';
      state.id = id_map[+((window.location.href.split('_'))[1].split('.'))[0]];
      dispatcher.call('action', this, '?');
    }
  }).catch(function(err){
    throw err;
  });
}else{
  d3.select('#splash').transition()
    .duration(200)
    .style('opacity',0)
    .on('end', function(){
      d3.select('#splash').remove();
    });
}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  
  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
  
  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
  
  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
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
      1:'Zum Baden geeignet',
      2:'Zum Baden geeignet',
      11:'Zum Baden geeignet',
      12:'Zum Baden geeignet',
      3:'Vom Baden wird abgeraten',
      4:'Vom Baden wird abgeraten',
      13:'Vom Baden wird abgeraten',
      14:'Vom Baden wird abgeraten',
      10:'Vom Baden wird abgeraten',
      9:'Keine Angabe',
      5:'Badeverbot',
      6:'Badeverbot',
      15:'Badeverbot',
      16:'Badeverbot'
    };

  var date = new Date(data.m_date);

  var location_link = 'https://maps.google.com/maps?daddr='+locations[id][1]+','+locations[id][0];

  if /* if we're on iOS, open in Apple Maps */
    ((navigator.platform.indexOf("iPhone") != -1) || 
     (navigator.platform.indexOf("iPod") != -1) || 
     (navigator.platform.indexOf("iPad") != -1)){
    location_link = 'maps://maps.google.com/maps?daddr='+locations[id][1]+','+locations[id][0];
  }

  function cleanWeb(str){
    if(str.substr(str.length-1,1)=='/'){
      str = str.substr(0, str.length-1);
    }
    return str.replace('http://','');
  }

  function makeHTTPS(url){
    return url.replace('http://','https://');
  }

  var html =  '<div class="detail-header">'+
              '  <a id="closebtn">&laquo;&nbsp;zurück&nbsp;zur&nbsp;Übersicht</a>'+
              '  <h1>'+data.name_lang+' <span>'+data.bezirk+'</span></h1>'+
              '  <hr class="closer" />'+
              '</div>'+
              '<div class="detail-body">'+
              '  <div class="detail-image">'+
              '    <img src="'+makeHTTPS(data.image)+'" alt="'+data.name+'" title="'+data.name+'"><br />'+
              '    <span class="caption">Bild: LAGeSo</span>'+
              '  </div>'+
              '  <div class="detail-location">'+
              '    <h3 class="title">Anschrift</h3>'+
              '    '+data.name_lang+'<br />'+
              '    '+data.strasse+'<br />'+
              '    '+parseInt(data.plz)+' '+data.stadt;

              if(data.webseite && data.webseite.length>0){
      html += '<br /><a href="'+data.webseite+'"><span>'+cleanWeb(data.webseite)+'</span></a>';
              }

      html += '<br /><br />'+
              '    <a href="'+location_link+'"><img src="'+((is_detail)?'../':'./') +'images/signs/location@2x.png" width="30" height="30" alt="Route berechnen" />&nbsp;<span>Route berechnen</span></a><br />'+
              '    <a href="http://www.fahrinfo-berlin.de/Fahrinfo/bin/query.bin/dn?seqnr=&amp;ident=&amp;ZID=A=16@X='+parseFloat(locations[id][0]).toFixed(6).toString().replace('.','')+'@Y='+parseFloat(locations[id][1]).toFixed(6).toString().replace('.','')+'@O=WGS84%2052%B027%2747%20N%2013%B010%2747%20E&amp;ch"><img src="'+((is_detail)?'../':'./') +'images/signs/location@2x.png" width="30" height="30" alt="Anfahrt mit der BVG" />&nbsp;<span>Anfahrt mit der BVG</span></a><br />'+
              '    <h3>Wasserqualität</h3>'+ 
              '    <span class="stufen-icon stufen-'+data.real_state+'"></span>'+stufentext[data.real_state]+'<br /><span class="small">(Letzte Messung: '+date.getDate()+'.'+(date.getMonth()+1)+'.'+(date.getYear()-100)+ '<span id="lastPredict"></span>)</span>';

      var measurements = [      'sicht_txt',  'eco_txt',            'ente_txt',                 'temp_txt',         'algen_txt',                'cb_txt'],
          measurement_labels = ['Sichttiefe', 'Escherichia coli',   'Intestinale Enterokokken', 'Wassertemperatur', 'Erhöhtes Algenauftreten',  'Coliforme Bakterien'],
          measurement_units = [ 'cm',         'pro 100 ml',         'pro 100 ml',               '°C',               '',                         'pro 100 ml'];

      var hasMeasurements = false;
      measurements.forEach(function(m){
        if(m in data && data[m].length>0){
          hasMeasurements = true;
        }
      });

      if(hasMeasurements){
        html += '<table cellpadding="0" cellmargin="0" border="0" class="measurement_table">';

        var line_count = 1;
        measurements.forEach(function(m,mi){
          if(m in data && data[m].length>0){
            html += '<tr class="row-'+line_count+'"><th>'+measurement_labels[mi]+'</th><td>'+((m=='algen_txt')?((data[m]=='A')?'Ja':'Nein'):(data[m]+' '+measurement_units[mi]))+'</td></tr>';
            line_count++;
          }
        });

        html += '</table>';
      }

      html += ((data.prediction!=null&&data.prediction!='null')?'<span class="prediction"><img src="'+((is_detail)?'../':'./') +'images/signs/prediction@2x.png" width="30" height="30" alt="" />* Die hier angezeigte Bewertung wird unterstützt durch eine neuartige tagesaktuelle Vorhersagemethode. <a href="info.html">Erfahren Sie mehr&nbsp;&raquo;</a></span>':'');

      var eu_sign;

      switch(data.letzte_eu_einstufung.toLowerCase()){
        case 'mangelhaft':
          eu_sign = 'poor';
        break;
        case 'ausreichend':
          eu_sign = 'sufficient';
        break;
        case 'ausgezeichnet':
          eu_sign = 'excellent';
        break;
        case 'gut':
          eu_sign = 'good';
        break;
      }

      html += '<div class="detail-eu">' + 
              '    <h3 class="title">EU-Einstufung</h3>'+
              '    <p class="small">Auswertung der letzten vier Jahre.</p>'+
              '    <span class="eu-ranks"><img class="eu-class" src="'+((is_detail)?'../':'./') +'/images/eu-signs/'+eu_sign+'@2x.png" width="92" height="81" alt="Ausgezeichnete Badegewässerqualität" />' +
              '    <img src="'+((is_detail)?'../':'./') +'images/eu-signs/legend_excellent@2x.png" width="49" height="14" alt="Ausgezeichnet" />&nbsp;Ausgezeichnet<br />' +
              '    <img class="first" src="'+((is_detail)?'../':'./') +'images/eu-signs/legend_good@2x.png" width="49" height="14" alt="Gut" />&nbsp;Gut<br />' +
              '    <img src="'+((is_detail)?'../':'./') +'images/eu-signs/legend_sufficient@2x.png" width="49" height="14" alt="Ausreichend" />&nbsp;Ausreichend<br />' +
              '    <img src="'+((is_detail)?'../':'./') +'images/eu-signs/legend_poor@2x.png" width="49" height="14" alt="Mangelhaft" />&nbsp;Mangelhaft</span><br />' + 
              '</div></div>';

      html += '  <div class="detail-addon">'+
              '    <h3 class="title">Weitere Angaben zur Badesstelle</h3>'+
              '    <ul>';

              if(data.cyano_moeglich && data.cyano_moeglich!=0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/cyano@2x.png" width="30" height="30" alt="Cyanobakterien massenhaft möglich (Blaualgen)" />&nbsp;Cyanobakterien massenhaft möglich (Blaualgen)</li>';
              }

              if((data.wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb && data.wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb!=0) || (data.rettungsschwimmer && data.rettungsschwimmer!=0)){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/rescue@2x.png" width="30" height="30" alt="Wasserrettung zeitweise" />&nbsp;Wasserrettung zeitweise</li>';
              }

              if(!data.barrierefrei || data.barrierefrei == 0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="Nicht barrierefrei" />&nbsp;Nicht barrierefrei</li>';
              }else{
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/barrierefrei@2x.png" width="30" height="30" alt="Barrierefrei" />&nbsp;Barrierefrei</li>';
              }

              if(!data.barrierefrei_zugang || data.barrierefrei_zugang == 0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="Zugang zum Wasser nicht barrierefrei" />&nbsp;Zugang zum Wasser nicht barrierefrei</li>';
              }else{
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/barrierefrei@2x.png" width="30" height="30" alt="Barrierefreier Zugang zum Wasser" />&nbsp;Barrierefreier Zugang zum Wasser</li>';
              }

              if(data.restaurant && data.restaurant!=0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/restaurant@2x.png" width="30" height="30" alt="Restaurant" />&nbsp;Restaurant</li>';
              }

              if(data.imbiss && data.imbiss!=0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/imbiss@2x.png" width="30" height="30" alt="Imbiss" />&nbsp;Imbiss</li>';
              }

              if(data.parken&&data.parken!=0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/parken@2x.png" width="30" height="30" alt="Parkmöglichkeiten" />&nbsp;Parkmöglichkeiten</li>';
              }

              if(data.wc&&data.wc!=0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/toilette@2x.png" width="30" height="30" alt="WC verfügbar" />&nbsp;WC verfügbar</li>';
                if(!data.barrierefrei_wc||data.barrierefrei_wc==0){
                  html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="WC ist nicht barrierefrei" />&nbsp;WC ist nicht barrierefrei</li>';
                }
              }else if(data.wc_mobil&&data.wc_mobil!=0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/toilette@2x.png" width="30" height="30" alt="Mobiles WC verfügbar" />&nbsp;Mobiles WC verfügbar</li>';
                if(!data.barrierefrei_wc||data.barrierefrei_wc==0){
                  html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="WC ist nicht barrierefrei" />&nbsp;WC ist nicht barrierefrei</li>';
                }
              }

              if(data.hundeverbot&&data.hundeverbot!=0){
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/hundeverbot@2x.png" width="30" height="30" alt="Hundeverbot" />&nbsp;Hundeverbot</li>';
              }else{
                html += '<li><img src="'+((is_detail)?'../':'./') +'images/signs/hundeverbot-not@2x.png" width="30" height="30" alt="Kein Hundeverbot" />&nbsp;Kein Hundeverbot</li>';
              }

      html += '    </ul>'+
              '    <div id="vis"><h3 class="title">Prognose und Messdaten</h3></div>'+
              '    <div id="visLegend"><h4>Legende</h4>' + 
              '<span class="legendElement"><img src="./images/visLegend-points.png" srcset="./images/visLegend-points.png 1x, ./images/visLegend-points@2x.png 2x"><span>Messungen LAGeSo</span></span>'+
              '<span class="legendElement"><img src="./images/visLegend-line.png" srcset="./images/visLegend-line.png 1x, ./images/visLegend-line@2x.png 2x"><span>Prognose Mittelwert</span></span>'+
              '<span class="legendElement"><img src="./images/visLegend-p.png" srcset="./images/visLegend-p.png 1x, ./images/visLegend-p@2x.png 2x"><span>vorhergesagter Konzentrationsbereich</span></span>'+
              '<span class="legendElement"><img src="./images/visLegend-bg-gut.png" srcset="./images/visLegend-bg-gut.png 1x, ./images/visLegend-bg-gut@2x.png 2x"><span>Gute Wasserqualität laut Prognose</span></span>'+
              '<span class="legendElement"><img src="./images/visLegend-bg-schlecht.png" srcset="./images/visLegend-bg-schlecht.png 1x, ./images/visLegend-bg-schlecht@2x.png 2x"><span>Basierend auf der Prognose wird vom Baden abgeraten</span></span>'+
              '<span class="legendElement"><img src="./images/visLegend-bg-na.png" srcset="./images/visLegend-bg-na.png 1x, ./images/visLegend-bg-na@2x.png 2x"><span>Nicht genügend Daten für eine Prognose</span></span>'+
              '</div>'+
              '  </div>'+
              '  <div class="detail-amt">'+
              '    <h3 class="title">Zuständiges Gesundheitsamt</h3>'+
              '    '+data.gesundheitsamt_name+'<br />'+
              '    '+data.gesundheitsamt_zusatz+'<br />'+
              '    '+data.gesundheitsamt_strasse+'<br />'+
              '    '+parseInt(data.gesundheitsamt_plz)+' '+data.gesundheitsamt_stadt+'<br /><br />'+
              '    <a href="mailto:'+data.gesundheitsamt_mail+'"><img src="'+((is_detail)?'../':'./') +'images/signs/email@2x.png" width="30" height="30" alt="Email" />&nbsp;<span>'+data.gesundheitsamt_mail+'</span></a><br />'+
              '    <a href="tel:'+parseInt(data.gesundheitsamt_telefon)+'"><img src="'+((is_detail)?'../':'./') +'images/signs/phone@2x.png" width="30" height="30" alt="Telefon" />&nbsp;<span>'+parseInt(data.gesundheitsamt_telefon)+'</span></a>'+
              '  </div>'+
              '</div>';


  d3.select('#detail').html(html).style('display','block');

  d3.select('#closebtn').on('click', function(){
    if(is_detail){
      window.location.href = '../index.html';
    }else{
      state.type = 'overview';
      state.id = null;
      state.ani = null;
      dispatcher.call('action', this, '?');
    }
  });

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if(data.prediction != null && data.prediction != 'null') {
    
    d3.csv("http://flusshygiene-berlin-data.s3.eu-central-1.amazonaws.com/lageso/details/measurements_" + data.detail_id + ".csv").then(function(measurementsData){
      d3.csv("http://flusshygiene-berlin-data.s3.eu-central-1.amazonaws.com/lageso/details/predictions_" + data.id + ".csv").then(function(predictionsData){

        predictionsData.forEach(function(d){
          d.date = d3.timeParse("%Y-%m-%d")(d.date);
          d.p025 = parseFloat(d.p025);
          d.p975 = parseFloat(d.p975);
          d.p500 = parseFloat(d.p500);
        });

        predictionsData.sort(function(a,b){
          return a.date - b.date;
        });

        var lastDate = predictionsData[predictionsData.length - 1].date;

        d3.select("#lastPredict")
          .html("&nbsp;/&nbsp;Letzte Prognose: " + lastDate.getDate() + "." + (lastDate.getMonth() + 1) + "." + lastDate.getFullYear());

        drawGraph(measurementsData, predictionsData);

      }).catch(function(err){
        throw err;
      });
    }).catch(function(err){
      throw err;
    });

  } else {
    d3.csv("http://flusshygiene-berlin-data.s3.eu-central-1.amazonaws.com/lageso/details/measurements_" + data.detail_id + ".csv").then(function(measurementsData){

      drawGraph(measurementsData, []);

    }).catch(function(err){
      throw err;
    });
  }

}

var timeLocale = d3.timeFormatLocale({
  "dateTime": "%A, %e %B %Y г. %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Sa", "So"],
  "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  "shortMonths": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
});



var formatMillisecond = timeLocale.format(".%L"),
    formatSecond = timeLocale.format(":%S"),
    formatMinute = timeLocale.format("%I:%M"),
    formatHour = timeLocale.format("%I %p"),
    formatDay = timeLocale.format("%a %d"),
    formatWeek = timeLocale.format("%b %d"),
    formatMonth = timeLocale.format("%B"),
    formatYear = timeLocale.format("%Y");

function multiFormat(date) {
  return (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
      : d3.timeDay(date) < date ? formatHour
      : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
      : d3.timeYear(date) < date ? formatMonth
      : formatYear)(date);
}

function drawGraph(measurements, predictions) {
  var margin = {top: 5, right: 5, bottom: 30, left: 60},
    width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var root = d3.select("#vis")
    .append("svg")
      .style("width","100%")
      .style("height","300px")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  var defs = root.append("defs");

  defs.append("mask").attr("id", "mask")
    .append("rect")
    .attr("fill", "white")
    .attr("width", width)
    .attr("height", height);

  defs.append("pattern").attr("id", "pattern")
    .attr("x","0")
    .attr("y","10")
    .attr("width","10")
    .attr("height","10")
    .attr("patternUnits","userSpaceOnUse")
    .append("image")
      .style("opacity", 0.25)
      .attr("xlink:href","./images/Rectangle@2x.png")
      .attr("x","0")
      .attr("y","0")
      .attr("height","10px")
      .attr("width","10px");

  var svg = root.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  measurements.forEach(function (d) {
    d["date"] = d3.timeParse("%Y-%m-%d")(d["date"]);
    d["sicht"] = parseFloat(d["sicht"]);
    d["eco"] = parseFloat(d["eco"]);
    d["ente"] = parseFloat(d["ente"]);
    d["temp"] = parseFloat(d["temp"]);
    d["algen"] = parseFloat(d["algen"]);
    d["cb"] = parseFloat(d["cb"]);
  });

  measurements.sort(function(a,b){
    return a.date - b.date;
  });

  if (predictions.length >= 1) {

    // search for missing data
    for (var i = predictions.length - 1; i > 0; i--) {
      var thisDay = predictions[i].date;
      var compDay = predictions[i-1].date.addDays(1);
      if(thisDay.getDate() !== compDay.getDate()){
        while(thisDay.getDate() !== compDay.getDate()){
          predictions.push({
            date:compDay,
            prediction:"NA"
          });
          compDay = compDay.addDays(1);
        }
      }
    }

    var filterPredictions = predictions.filter(function(d){
      return (isNaN(d.p500)) ? false : true;
    });

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(filterPredictions, function(d) { return d["date"]; }))
      .range([ 0, width ]);

    svg.append("g")
      // .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(7).tickFormat(multiFormat));

    var max = 0;

    var columns = ["p025", "p975", "p500"];

    columns.forEach(function(column) {
      var tMax = d3.max(filterPredictions, function(d){ return d[column]; });
      if (tMax > max) {
        max = tMax;
      }
    });

    var y = d3.scaleSymlog()
      .domain([0, max])
      .range([ height, 0 ]);

    var tickValues = [];
    var tickCount = 10;

    for (var ii = 0; ii < tickCount; ii++) {
      tickValues.push(y.invert(height/tickCount*ii));
    }

    svg.append("g")
      .call(d3.axisLeft(y).tickValues(tickValues)); // .tickFormat(d3.format("d"))

    svg.append("g").attr("mask", "url(#mask)").selectAll("rect").data(predictions)
      .enter().append("rect")
        .attr("x", function(d) {
          var tDate = d["date"];
          var eDate = tDate.addDays(1);
          var tWidth = x(eDate) - x(tDate);

          return x(d["date"]) - tWidth/2;
        })
        .attr("y", 0)
        .attr("stroke", "transparent")
        .attr("fill", function(d) {
          switch(d.prediction){
            case "mangelhaft":
              return "#F39F00";
            case "NA":
              return "url(#pattern)";
            default:
              return "#97B016";
          }
        })
        .attr("width", function(d) {
          var tDate = d["date"];
          var eDate = tDate.addDays(1);
          return x(eDate) - x(tDate);
        })
        .attr("height", height);

    svg.append("path").attr("mask", "url(#mask)")
      .datum(filterPredictions)
      .attr("fill", "rgba(0,0,0,0.3)")
      .attr("stroke", "transparent")
      .attr("d", d3.area()
        .x(function(d) { return x(d["date"]); })
        .y0(function(d) { return y(d["p025"]); })
        .y1(function(d) { return y(d["p975"]); })
      );

    svg.append("path").attr("mask", "url(#mask)")
      .datum(filterPredictions)
      .attr("stroke", "rgba(0,0,0,1)")
      .attr("stroke-width", 1)
      .attr("fill", "transparent")
      .attr("d", d3.line()
        .x(function(d) { return x(d["date"]); })
        .y(function(d) { return y(d["p500"]); })
      );

    svg.append("g").attr("mask", "url(#mask)").selectAll("circle").data(measurements)
      .enter().append("circle")
        .attr("cx", function(d){ return x(d["date"]); })
        .attr("cy", function(d){ return y(d["eco"]); })
        .attr("r", 3)
        .style("fill", "black");

    svg.append("g")
      .style("transform", "translate(-50px," + height + "px)")
      .append("text")
      .attr("text-anchor", "start")
      .style("transform", "rotate(-90deg)")
      .html("<tspan style=\"font-style:italic;\">Konzentration E.coli</tspan> <tspan>[KBE/100mL]</tspan>");


  } else {
    d3.selectAll("#vis, #visLegend").style("display", "none");
  }

  // Draw graphs for Lageso Data
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