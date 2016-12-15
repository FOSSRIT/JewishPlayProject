window.onload = main;

var g_data;

function main()
{
    var firstName = getParameterByName("firstName");
    var lastName = getParameterByName("lastName");
    
    var data;
    if(firstName && lastName)
    {
        data = {firstName:firstName, lastName:lastName};
    }
    else
    {
        var name = getParameterByName("name");
        data = {name:name};
    }
    
    
    $.ajax({
		url: 'http://localhost:3000/person',
		data:{data:JSON.stringify(data)},							
		success: function(data) {
			console.log('success');
			console.log(data);
			g_data = data;
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
    
    var name = data.FirstName;
    name += data.MiddleName ? " " + data.MiddleName : "";
    name += " " + data.LastName;
    document.title = name;
	
	htmlString += "<div id='displayImage'>";
    if(data.Picture)
    {
        htmlString += "<img src='" + data.Picture + "' alt='" + name + "' /><br />";
    }
	htmlString += "</div><div id='info'>";
	
    htmlString += "<h1>" + name + "</h1>";
    
    htmlString += "<div id='year'>" + data.BirthYear + " - ";
    if(data.DeathYear)
    {
        htmlString += data.DeathYear;
    }
    else
    {
        htmlString += "Present";
    }
    htmlString += "</div><br />";
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
    if(data.Toys && data.Toys.length > 0)
    {
        if(data.Toys.length == 1)
        {
            htmlString += "Toy: "
        }
        else
        {
            htmlString += "Toys: "
        }
        for(var i = 0; i < data.Toys.length; i++)
        {
            htmlString += "<a href='./toys?name=" + data.Toys[i] + "'>" + data.Toys[i] + "</a><br />";
        }
    }
    htmlString += "<br />";
    if(data.Bio)
    {
        htmlString += data.Bio;
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
	
    //console.log(htmlString);
    document.getElementById("infoContainer").innerHTML = htmlString;
	
	document.getElementById("eFirstName").value = (data.FirstName == null ? "" : data.FirstName.replace(/'/g, "&#39;"));
	document.getElementById("eLastName").value = (data.LastName == null ? "" : data.LastName.replace(/'/g, "&#39;"));
	document.getElementById("eMiddleName").value = (data.MiddleName == null ? "" : data.MiddleName.replace(/'/g, "&#39;"));
	document.getElementById("eBirthYear").value = (data.BirthYear == null ? "" : data.BirthYear.replace(/'/g, "&#39;"));
	document.getElementById("eDeathYear").value = (data.DeathYear == null ? "" : data.DeathYear.replace(/'/g, "&#39;"));
	setupArrayInput("eCompanies", data.Companies);
	setupArrayInput("eToys", data.Toys);
	document.getElementById("ePicture").value = (data.Picture == null ? "" : data.Picture.replace(/'/g, "&#39;"));
	setupArrayInput("eSources", data.Sources);
	setupArrayInput("eSourceTitles", data.SourceTitles);
	document.getElementById("eBio").value = (data.Bio == null ? "" : data.Bio.replace(/'/g, "&#39;"));
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
	data.FirstName = parseTextInput(document.getElementById("eFirstName").value);
	data.MiddleName = parseTextInput(document.getElementById("eMiddleName").value);
	data.LastName = parseTextInput(document.getElementById("eLastName").value);
	data.BirthYear = parseTextInput(document.getElementById("eBirthYear").value);
	data.DeathYear = parseTextInput(document.getElementById("eDeathYear").value);
	data.Companies = parseArrayInput(document.getElementsByClassName("eCompanies"));
	data.Toys = parseArrayInput(document.getElementsByClassName("eToys"));
	data.Bio = parseTextInput(document.getElementById("eBio").value);
	data.Picture = parseTextInput(document.getElementById("ePicture").value);
	data.Sources = parseArrayInput(document.getElementsByClassName("eSources"));
	data.SourceTitles = parseArrayInput(document.getElementsByClassName("eSourceTitles"));
	data.Live = document.getElementById("eLive").checked;
	
	data.OrigFirstName = g_data.FirstName;
	data.OrigLastName = g_data.LastName;
	
	if(data.FirstName == null || data.LastName == null)
	{
		alert("First Name and Last Name can't be null");
	}
	else
	{
		$.ajax({
			type: "POST",
			url: 'http://localhost:3000/editpeople',
			data: {data:JSON.stringify(data)},				
			success: function(data) {
				console.log('success');
				console.log(data);
				location.href = "./people?firstName=" + data.FirstName + "&lastName=" + data.LastName;
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

function getParameterByName(name) 
{
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}