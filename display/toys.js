window.onload = main;

var g_data;

function main()
{
    var name = getParameterByName("name");
    
    console.log(name);
    var data = {name:name};
    
    $.ajax({
		url: 'http://localhost:3000/toy',
		data:{data:JSON.stringify(data)},							
		success: function(data) {
			console.log('success');
			console.log(data);
			g_data = data;
			
			$.ajax({
				url: 'http://localhost:3000/toytypes',						
				success: function(data) {
					console.log('success');
					console.log(data);
					setupToyTypesDropdown(data);
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
			
			setupPage(data);

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

function setupPage(data)
{
    var htmlString = "";
    
    document.title = data.Name;
	
	htmlString += "<div id='displayImage'>";
    if(data.Picture)
    {
        htmlString += "<img src='" + data.Picture + "' alt='" + data.Name + "' /><br />";
    }
	
	htmlString += "</div><div id='info'>";
	
    htmlString += "<h1>" + data.Name + "</h1>";
	htmlString += "<div id='year'>" + data.Year + "</div><br />";
    if(data.People && data.People.length > 0)
    {
        if(data.People.length == 1)
        {
            htmlString += "Founder: "
        }
        else
        {
            htmlString += "People: "
        }
        for(var i = 0; i < data.People.length; i++)
        {
            htmlString += "<a href='./people?name=" + data.People[i] + "'>" + data.People[i] + "</a><br />";
        }
    }
    if(data.Companies && data.Companies.length > 0)
    {
        if(data.Companies.length == 1)
        {
            htmlString += "Company: "
        }
        else
        {
            htmlString += "Companies: "
        }
        for(var i = 0; i < data.Companies.length; i++)
        {
            htmlString += "<a href='./companies?name=" + data.Companies[i] + "'>" + data.Companies[i] + "</a><br />";
        }
    }
    htmlString += "<br />";
    if(data.Description)
    {
        htmlString += data.Description;
    }
    if(data.Sources && data.Sources.length > 0)
    {
        htmlString += "<br/><br/>Sources:<br/>";
        for(var i = 0; i < data.Sources.length; i++)
        {
            var title = data.Sources[i];
            if(data.SourceTitles && data.SourceTitles[i])
            {
                title = data.SourceTitles[i];
            }
            htmlString += "<a href='" + data.Sources[i] + "' target='_blank'>" + title  + "</a><br/>";
        }
    }
    htmlString += "<br/><br/><br/></div>"
    
    document.getElementById("infoContainer").innerHTML = htmlString;
	
	document.getElementById("eName").value = (data.Name == null ? "" : data.Name.replace(/'/g, "&#39;"));
	document.getElementById("eYear").value = (data.Year == null ? "" : data.Year.replace(/'/g, "&#39;"));
	setupArrayInput("eCompanies", data.Companies);
	setupArrayInput("ePeople", data.People);
	document.getElementById("ePicture").value = (data.Picture == null ? "" : data.Picture.replace(/'/g, "&#39;"));
	setupArrayInput("eSources", data.Sources);
	setupArrayInput("eSourceTitles", data.SourceTitles);
	document.getElementById("eDescription").value = (data.Description == null ? "" : data.Description.replace(/'/g, "&#39;"));
	document.getElementById("eLive").checked = data.Live;
	
	var addRowButtons = document.getElementsByClassName("addRowButton");
	for(var i = 0; i < addRowButtons.length; i++)
	{
		addRowButtons[i].onclick = function(e)
		{
			console.log(e);
			var parentID = e.target.parentElement.id;
			var wrapper = document.getElementById(parentID + "Wrapper");
			var nextIndex = parseInt(wrapper.lastChild.getAttribute("index")) + 1;
			
			var container = document.createElement("div");
			container.id = parentID + "Container_" + nextIndex;
			container.setAttribute("index", nextIndex);
			container.innerHTML = "<input type='text' class='" + parentID + "' id='" + parentID + "_" + nextIndex + "' index=" + nextIndex + "></input><button id='" + parentID + "DeleteRow_" + nextIndex + "' index=" + nextIndex + " style='color:#e7f6ff; background-color:#228dff; text-align:center; font-size:16px; box-shadow:1px 1px 10px rgba(0,0,0,.25); border: none; padding: 7px 12px; border-radius: 5px; margin-left:15px; margin-bottom: 5px;' >-</button><br />";
			wrapper.appendChild(container);
			
			if(parentID.includes("Sources") && !e.repeated)
			{
				var button = document.getElementById(parentID.substr(0,1) + "SourceTitlesAddRow");
				button.onclick({target:button, repeated:true});
			}
			if(parentID.includes("SourceTitles") && !e.repeated)
			{
				var button = document.getElementById(parentID.substr(0,1) + "SourcesAddRow");
				button.onclick({target:button, repeated:true});
			}
			document.getElementById(parentID + "DeleteRow_" + nextIndex).onclick = function(e)
			{
				wrapper.removeChild(document.getElementById(parentID + "Container_" + nextIndex));
			
				if(parentID.includes("Sources") && !e.repeated)
				{
					var button = document.getElementById(parentID.substr(0,1) + "SourceTitlesDeleteRow_" + nextIndex);
					button.onclick({target:button, repeated:true});
				}
				if(parentID.includes("SourceTitles") && !e.repeated)
				{
					var button = document.getElementById(parentID.substr(0,1) + "SourcesDeleteRow_" + nextIndex);
					button.onclick({target:button, repeated:true});
				}
			};
			
		}
	}
}

function setupArrayInput(id, array)
{
	var element = document.getElementById(id);
	var wrapper = document.getElementById(id + "Wrapper");
	
	if(array.length > 0)
	{
		document.getElementById(id + "_0").value = (array[0] == null ? "" : array[0].replace(/'/g, "&#39;"));
	}
	for(var i = 1; i < array.length; i++)
	{
		var container = document.createElement("div");
		container.id = id + "Container_" + i;
		container.setAttribute("index", i);
		container.innerHTML = "<input type='text' class='" + id + "' id='" + id + "_" + i + "' index=" + i + " value='" + (array[i] == null ? "" : array[i].replace(/'/g, "&#39;")) + "'></input><button id='" + id + "DeleteRow_" + i + "' index=" + i + " style='color:#e7f6ff; background-color:#228dff; text-align:center; font-size:16px; box-shadow:1px 1px 10px rgba(0,0,0,.25); border: none; padding: 7px 12px; border-radius: 5px; margin-left:15px; margin-bottom: 5px;' >-</button><br />";
		wrapper.appendChild(container);
		
		(function(i, id) {
			document.getElementById(id + "DeleteRow_" + i).onclick = function(e)
			{
				wrapper.removeChild(document.getElementById(id + "Container_" + i));
			
				if(id.includes("Sources") && !e.repeated)
				{
					var button = document.getElementById(id.substr(0,1) + "SourceTitlesDeleteRow_" + i);
					button.onclick({target:button, repeated:true});
				}
				if(id.includes("SourceTitles") && !e.repeated)
				{
					var button = document.getElementById(id.substr(0,1) + "SourcesDeleteRow_" + i);
					button.onclick({target:button, repeated:true});
				}
			};
		})(i, id);
	}
}

function editPage()
{
	document.getElementById("displayContainer").style.display = "none";
	document.getElementById("editContainer").style.display = "block";
}

function cancelEdit()
{
	document.getElementById("displayContainer").style.display = "block";
	document.getElementById("editContainer").style.display = "none";
}

function submitEdit()
{
	var data = {};
	data.Name = parseTextInput(document.getElementById("eName").value);
	data.Year = parseTextInput(document.getElementById("eYear").value);
	data.Companies = parseArrayInput(document.getElementsByClassName("eCompanies"));
	data.People = parseArrayInput(document.getElementsByClassName("ePeople"));
	data.Description = parseTextInput(document.getElementById("eDescription").value);
	data.Picture = parseTextInput(document.getElementById("ePicture").value);
	data.Sources = parseArrayInput(document.getElementsByClassName("eSources"));
	data.SourceTitles = parseArrayInput(document.getElementsByClassName("eSourceTitles"));
	data.Type = parseTextInput(document.getElementById("eType").value);
	data.Live = document.getElementById("eLive").checked;
	
	data.OrigName = g_data.Name;
	console.log(document.getElementById("eType").value);
	
	if(data.Name == null)
	{
		alert("Name can't be null");
	}
	else
	{
		$.ajax({
			type: "POST",
			url: 'http://localhost:3000/edittoys',
			data: {data:JSON.stringify(data)},				
			success: function(data) {
				console.log('success');
				console.log(data);
				location.href = "./toys?name=" + data.Name;
			}//,
			// error: function(data) {
				// console.log('error');
				// console.log(data);
				
				// // two arguments: the id of the Timeline container (no '#')
				// // and the JSON object or an instance of TL.TimelineConfig created from
				// // a suitable JSON object
				// //window.timeline = new TL.Timeline('timeline-embed', 'marktwain_test.json');
			// }
		});
	}
}

function setupToyTypesDropdown(toyTypes)
{
	console.log(toyTypes);
    var dropdown = "Type:<select id='eType'>";
    dropdown += "<option value=''>Select Type</option>";
    for(var i = 0; i < toyTypes.length; i++)
    {
        dropdown += "<optgroup label='" + toyTypes[i].Name + "'>";
        for(var j = 0; j < toyTypes[i].SubTypes.length; j++)
        {
            dropdown += "<option value='" + toyTypes[i].SubTypes[j] + "'>" + toyTypes[i].SubTypes[j] + "</option>";
        }
        dropdown += "</optgroup>";
    }
    dropdown += "</select>";
    
    document.getElementById("typesDropdown").innerHTML = dropdown;
	
	if(g_data.Type != null)
	{
		var options = document.getElementById("eType").options;
		for(var j = 0; j < options.length; j++)
		{
			if(g_data.Type == options[j].innerHTML)
			{
				document.getElementById("eType").selectedIndex = j;
				break;
			}
		}
	}
}

function parseTextInput(text)
{
	return text == "" ? null : text;
}

function parseArrayInput(list)
{
    var values = [];
    for (var i = 0; i < list.length; i++)
    {
        values.push(parseTextInput(list[i].value));
    }
    var string = "{\"" + values.toString() + "\"}";
    return string;
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