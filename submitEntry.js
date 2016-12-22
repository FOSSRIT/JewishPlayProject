/*============================
// Jewish Play Project
// submitEntry.html Javascript
============================*/
window.onload = main;

function main()
{
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
	
	$.ajax({
		url: 'http://localhost:3000/toytypes',						
		success: function(data) {
			console.log('success');
			console.log(data);
			g_data = data.toys;
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
}

function change(obj) 
{
	var selectBox = obj;
	var selected = selectBox.options[selectBox.selectedIndex].value;
	var people = document.getElementById("peopleD");
	var toys = document.getElementById("toysD");
	var companies = document.getElementById("companiesD");

	//Hide div depending on user choice.
	if(selected == 'people')
    {
		people.style.display = "block";
		toys.style.display = "none";
		companies.style.display = "none";
	}
	else if(selected == 'companies')
    {
		people.style.display = "none";
		toys.style.display = "none";
		companies.style.display = "block";
	}
	else
    {
		people.style.display = "none";
		toys.style.display = "block";
		companies.style.display = "none";
	}
}

function submit()
{
    var type = document.getElementById("typeSelect").value;
    if(type == 'people')
    {
        var data = {};
		data.FirstName = parseTextInput(document.getElementById("pFirstName").value);
		data.MiddleName = parseTextInput(document.getElementById("pMiddleName").value);
		data.LastName = parseTextInput(document.getElementById("pLastName").value);
		data.BirthYear = parseTextInput(document.getElementById("pBirthYear").value);
		data.DeathYear = parseTextInput(document.getElementById("pDeathYear").value);
		data.Companies = parseArrayInput(document.getElementsByClassName("pCompanies"));
		data.Toys = parseArrayInput(document.getElementsByClassName("pToys"));
		data.Bio = parseTextInput(document.getElementById("pBio").value);
		data.Picture = parseTextInput(document.getElementById("pPicture").value);
		data.Sources = parseArrayInput(document.getElementsByClassName("pSources"));
		data.SourceTitles = parseArrayInput(document.getElementsByClassName("pSourceTitles"));
		data.Live = document.getElementById("pLive").checked;
		
		if(data.FirstName == null || data.LastName == null)
		{
			alert("First Name and Last Name can't be null");
		}
		else
		{
			$.ajax({
				type: "POST",
				url: 'http://localhost:3000/addpeople',
				data: {data:JSON.stringify(data)},				
				success: function(data) {
					console.log('success');
					console.log(data);
					location.reload();
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
	else if(type == 'companies')
    {
		var data = {};
		data.Name = parseTextInput(document.getElementById("cName").value);
		data.FoundingYear = parseTextInput(document.getElementById("cFoundingYear").value);
		data.ClosingYear = parseTextInput(document.getElementById("cClosingYear").value);
		data.FoundingLocation = parseTextInput(document.getElementById("cFoundingLocation").value);
		data.People = parseArrayInput(document.getElementsByClassName("cPeople"));
		data.Toys = parseArrayInput(document.getElementsByClassName("cToys"));
		data.Description = parseTextInput(document.getElementById("cDescription").value);
		data.Website = parseTextInput(document.getElementById("cWebsite").value);
		data.Logo = parseTextInput(document.getElementById("cLogo").value);
		data.CurrentOwner = parseTextInput(document.getElementById("cCurrentOwner").value);
		data.Sources = parseArrayInput(document.getElementsByClassName("cSources"));
		data.SourceTitles = parseArrayInput(document.getElementsByClassName("cSourceTitles"));
		data.Live = document.getElementById("cLive").checked;
		
		if(data.Name == null)
		{
			alert("Name can't be null");
		}
		else
		{
			$.ajax({
				type: "POST",
				url: 'http://localhost:3000/addcompanies',
				data: {data:JSON.stringify(data)},				
				success: function(data) {
					console.log('success');
					console.log(data);
					location.reload();
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
	else if(type == 'toys')
    {
        var data = {};
		data.Name = parseTextInput(document.getElementById("tName").value);
		data.Year = parseTextInput(document.getElementById("tYear").value);
		data.Companies = parseArrayInput(document.getElementsByClassName("tCompanies"));
		data.People = parseArrayInput(document.getElementsByClassName("tPeople"));
		data.Description = parseTextInput(document.getElementById("tDescription").value);
		data.Picture = parseTextInput(document.getElementById("tPicture").value);
		data.Sources = parseArrayInput(document.getElementsByClassName("tSources"));
		data.SourceTitles = parseArrayInput(document.getElementsByClassName("tSourceTitles"));
		data.Type = parseTextInput(document.getElementById("tType").value);
		data.Live = document.getElementById("tLive").checked;
		
		if(data.Name == null)
		{
			alert("Name can't be null");
		}
		else
		{
			$.ajax({
				type: "POST",
				url: 'http://localhost:3000/addtoys',
				data: {data:JSON.stringify(data)},				
				success: function(data) {
					console.log('success');
					console.log(data);
					location.reload();
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
}

function setupToyTypesDropdown(toyTypes)
{
	console.log(toyTypes);
    var dropdown = "Type:<select id='tType'>";
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
}