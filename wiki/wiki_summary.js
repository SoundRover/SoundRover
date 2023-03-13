'use strict';

function get_snippet() {
	var url = "https://en.wikipedia.org/w/api.php";
	var wiki_url = "https://en.wikipedia.org/?curid="
	var summary_url = "http://api.meaningcloud.com/summarization-1.0?"
	var json1 = document.getElementById('json1');
	var json2 = document.getElementById('json2');
	var input_box = document.getElementById('input1')

	function new_url(url, text, type) {
		var out_url
		switch (type) {
			case 's':
				out_url = url + "?origin=*";
				break;
			case 'c':
				out_url = url + "?origin=*";
				break;
			case 'sum':
				out_url = url;
				break;
		}

		var params = get_params(type, text);
		Object.keys(params).forEach(function (key) { out_url += "&" + key + "=" + params[key]; });
		return out_url;
	}

	function get_params(type, content) {
		switch (type) {
			case 's':
				return {
					action: "query",
					list: "search",
					srsearch: content,
					format: "json"
				};
			case 'c':
				return {
					action: "query",
					prop: "extracts",
					titles: content,
					format: "json"
				};
			case 'sum':
				return {
					key: '27fc2d4a0d8a514a6517c11103395bbe',
					txt: content,
					sentences: 7
				}
		}
	};

	function printwiki(input) {
		return input.query.search[0].snippet;
	};

	async function fetch_basic(url) {
		let obj;
		const res = await fetch(url);
		obj = await res.json();
		var msg = {
			snippet: obj.query.search[0].snippet,
			pageid: obj.query.search[0].pageid,
			wiki_url: wiki_url + obj.query.search[0].pageid.toString(),
			title: obj.query.search[0].title
		};
		return msg;
	};

	async function fetch_content(url, titles, pageid) {
		let obj;
		const res = await fetch(new_url(url, titles, 'c'));
		obj = await res.json();
		var msg = {
			content: obj.query.pages[pageid].extract
		};
		return msg;
	};

	async function fetch_summary(url, text, length) {
		let obj;
		const formdata = new FormData();
		formdata.append("key", "27fc2d4a0d8a514a6517c11103395bbe");
		formdata.append("txt", text);
		formdata.append("sentences", length);

		const requestOptions = {
			method: 'POST',
			body: formdata,
			redirect: 'follow'
		};
		const res = await fetch("https://api.meaningcloud.com/summarization-1.0", requestOptions);
		obj = await res.json();
		var msg = {
			summary: obj.summary
		};
		return msg;
	}

	async function search(url, name) {
		var f_url = new_url(url, name, 's');
		console.log(name)

		var info = fetch_basic(f_url);
		info
			.then(res => fetch_content(url, res.title, res.pageid))
			.then(res => { json2.innerHTML = res.content; return res; })
			.then(res => fetch_summary(summary_url, res.content, '15'))
			.then(res => { json1.innerHTML = res.summary });
	};

	search(url, input_box.value)

};