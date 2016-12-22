window.onload = main;

var g_data;

function main()
{
    var name = getParameterByName("name");
    
    console.log(name);
    var data = {name:name};
    
    $.ajax({
		url: 'http://localhost:3000/company',
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
	
    document.title = data.Name;
	
	htmlString += "<div id='displayImage'>";
    if(data.Logo)
    {
        htmlString += "<img src='" + data.Logo + "' alt='" + data.Name + "' /><br />";
    }
	
	htmlString += "</div><div id='info'>";
    
    htmlString += "<h1>" + data.Name + "</h1>";
    
    htmlString += "<div id='year'>" + data.FoundingYear + " - ";
    if(data.ClosingYear)
    {
        htmlString += data.ClosingYear;
    }
    else
    {
        htmlString += "Present";
    }
    htmlString += "</div><br />";
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
    if(data.FoundingLocation)
    {
        htmlString += "Founding Location: " + data.FoundingLocation + "<br/>";
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
	document.getElementById("eFoundingYear").value = (data.FoundingYear == null ? "" : data.FoundingYear.replace(/'/g, "&#39;"));
	document.getElementById("eClosingYear").value = (data.ClosingYear == null ? "" : data.ClosingYear.replace(/'/g, "&#39;"));
	setupArrayInput("ePeople", data.People);
	setupArrayInput("eToys", data.Toys);
	document.getElementById("eWebsite").value = (data.Website == null ? "" : data.Website.replace(/'/g, "&#39;"));
	document.getElementById("eLogo").value = (data.Logo == null ? "" : data.Logo.replace(/'/g, "&#39;"));
	document.getElementById("eCurrentOwner").value = (data.CurrentOwner == null ? "" : data.CurrentOwner.replace(/'/g, "&#39;"));
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
	data.FoundingYear = parseTextInput(document.getElementById("eFoundingYear").value);
	data.ClosingYear = parseTextInput(document.getElementById("eClosingYear").value);
	data.FoundingLocation = parseTextInput(document.getElementById("eFoundingLocation").value);
	data.People = parseArrayInput(document.getElementsByClassName("ePeople"));
	data.Toys = parseArrayInput(document.getElementsByClassName("eToys"));
	data.Website = parseTextInput(document.getElementById("eWebsite").value);
	data.Logo = parseTextInput(document.getElementById("eLogo").value);
	data.CurrentOwner = parseTextInput(document.getElementById("eCurrentOwner").value);
	data.Description = parseTextInput(document.getElementById("eDescription").value);
	data.Sources = parseArrayInput(document.getElementsByClassName("eSources"));
	data.SourceTitles = parseArrayInput(document.getElementsByClassName("eSourceTitles"));
	data.Live = document.getElementById("eLive").checked;
	
	data.OrigName = g_data.Name;
	
	if(data.Name == null)
	{
		alert("Name can't be null");
	}
	else
	{
		$.ajax({
			type: "POST",
			url: 'http://localhost:3000/editcompanies',
			data: {data:JSON.stringify(data)},				
			success: function(data) {
				console.log('success');
				console.log(data);
				location.href = "./companies?name=" + data.Name;
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