let request = require('request-promise'),
	cheerio = require('cheerio'),
	fs = require('fs')
 
let options = {
    uri: 'http://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/liste-der-badestellen/index.php/index.rss?q&farbe&badname=--%20Alles%20--&bezirk=--%20Alles%20--&q_geo&q_radius=20000&ipp=40',
    transform: function (body) {
        return cheerio.load(body, {xmlMode: true});
    }
};
 
request(options)
	.then(function ($) {
		let items = []
		$('item').each( (i, item) => {
			let link = $(item).find('link').text(),
				description = $(item).find('description').text(),
				title = $(item).find('title').text()
			items.push({
				title:title,
				link:link,
				state:description.match(/([a-z])*(?=\.jpg)/g)[0]
			})
		})
		processItems(items)
	})
	.catch(function (err) {
		console.log('request-error', err)
	})

function processItems(items){
	Promise.all(items.map(function(item) {
		let options = {
			uri: item.link,
			transform: function (body) {
				return cheerio.load(body);
			}
		}

		return request(options).then(function($) {
			return $('.column-content .simplesearch-detail table .textile p a').attr('href')
		}).then(function(text) {
			return text;
		}).catch(function (err) {
			console.log('processItems-error', err)
		})

	})).then(function(values) {
	  items.forEach((item,i)=>{
	  	items[i]['detailLink'] = 'http://www.berlin.de'+values[i]
	  })
	  getDetails(items)
	})
}

function getDetails(items){
	Promise.all(items.map(function(item) {
		let options = {
			uri: item.detailLink,
			transform: function (body) {
				return cheerio.load(body);
			}
		}

		return request(options).then(function($) {
			return $('.column-content .html5-section.article').eq(0).html()
		}).then(function(html) {
			html = html.split('src="/lageso').join('src="http://www.berlin.de/lageso')
			html = html.split('href="/lageso').join('href="http://www.berlin.de/lageso')
			return html;
		}).catch(function (err) {
			console.log('getDetails-error', err)
		})

	})).then(function(values) {
	  items.forEach((item,i)=>{
	  	items[i]['html'] = values[i]
	  })
	  fs.writeFileSync('./data/details.json', JSON.stringify(items), 'utf8')
	  console.log('done')
	})
}

//  > innerHTML
