window.onload = main;

function main()
{
	console.log("main");
	var category = getParameterByName("category");
	if(category.toLowerCase() == "toys")
	{
		document.getElementById("header").innerHTML = "Toys";
		var superType = getParameterByName("superType");
		var subType = getParameterByName("subType");
		var name = getParameterByName("name");
		var data = {name:name, superType:superType, subType:subType};
		$.ajax({
			url: 'http://localhost:3000/browsetoys',
			data:{data:JSON.stringify(data)},						
			success: function(data) {
				console.log('success');
				console.log(data);
				setupPage(data, category);

			},
			error: function(data) {
				console.log('error');
				console.log(data);
				
				// two arguments: the id of the Timeline container (no '#')
				// and the JSON object or an instance of TL.TimelineConfig created from
				// a suitable JSON object
				//window.timeline = new TL.Timeline('timeline-embed', 'marktwain_test.json');
			}
		});
	}
	else if(category.toLowerCase() == "companies")
	{
		document.getElementById("header").innerHTML = "Companies";
		var name = getParameterByName("name");
		var data = {name:name}
		$.ajax({
			url: 'http://localhost:3000/browsecompanies',	
			data:{data:JSON.stringify(data)},						
			success: function(data) {
				console.log('success');
				console.log(data);
				setupPage(data, category);

			},
			error: function(data) {
				console.log('error');
				console.log(data);
				
				// two arguments: the id of the Timeline container (no '#')
				// and the JSON object or an instance of TL.TimelineConfig created from
				// a suitable JSON object
				//window.timeline = new TL.Timeline('timeline-embed', 'marktwain_test.json');
			}
		});
	}
	else //defaults to people
	{
		document.getElementById("header").innerHTML = "People";
		var name = getParameterByName("name");
		var data = {name:name}
		$.ajax({
			url: 'http://localhost:3000/browsepeople',	
			data:{data:JSON.stringify(data)},						
			success: function(data) {
				console.log('success');
				console.log(data);
				setupPage(data, category);

			},
			error: function(data) {
				console.log('error');
				console.log(data);
				
				// two arguments: the id of the Timeline container (no '#')
				// and the JSON object or an instance of TL.TimelineConfig created from
				// a suitable JSON object
				//window.timeline = new TL.Timeline('timeline-embed', 'marktwain_test.json');
			}
		});
	}
}

function setupPage(data, category)
{
	var tableBody = document.getElementById("tableBody")
	for(var i = 0; i < data.length; i++)
	{
		var row = document.createElement("tr");
		var html = "";
		var name = data[i].name;
		html += "<td>" + data[i].name + "</td>";
		if(data[i].picture && data[i].picture != "")
		{
			html += "<td><img class='tableImage' src='" + data[i].picture + "' /></td>";
		}
		else
		{
			html += "<td><img class='tableImage' src='missingImage.png' /></td>";
		}
		html += "<td>" + data[i].year + "</td>";
		html += "<td>" + data[i].description + "</td>";
		row.innerHTML = html;
		
		(function(row, href) {
			row.onclick = function(e)
			{
				window.location.href = href;
			}
		})(row, data[i].href);
		tableBody.appendChild(row);
	}
}

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}