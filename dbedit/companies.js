window.onload = main;
var g_data;

function main()
{
	$.ajax({
		url: 'http://localhost:3000/companies',						
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
	setupCompaniesTable(data);
	setupEvents();
}

function setupCompaniesTable(data, toytypes)
{
	var table = document.getElementById("companiesTable");

	var string = "";
	string += "<tr>\n";
	string += "<th>Name</th>\n";
	string += "<th>Founding Year</th>\n";
	string += "<th>Closing Year</th>\n";
	string += "<th>Founding Location</th>\n";
	string += "<th>People</th>\n";
	string += "<th>Toys</th>\n";
	string += "<th>Description</th>\n";
	string += "<th>Website</th>\n";
	string += "<th>Logo</th>\n";
	string += "<th>Current Owner</th>\n";
	string += "<th>Sources</th>\n";
	string += "<th>Source Titles</th>\n";
	string += "<th>Live</th>\n";
	string += "<th></th>\n";
	string += "</tr>\n";
	
	string += "<tr>\n";
	string += "<td><input type='text' id='searchName'></input></td>\n";
	string += "<td><input type='text' id='searchFoundingYear'></input></td>\n";
	string += "<td><input type='text' id='searchClosingYear'></input></td>\n";
	string += "<td><input type='text' id='searchFoundingLocation'></input></td>\n";
	string += "<td><input type='text' id='searchPeople'></input></td>\n";
	string += "<td><input type='text' id='searchToys'></input></td>\n";
	string += "<td><input type='text' id='searchDescription'></input></td>\n";
	string += "<td><input type='text' id='searchWebsite'></input></td>\n";
	string += "<td><input type='text' id='searchLogo'></input></td>\n";
	string += "<td><input type='text' id='searchCurrentOwner'></input></td>\n";
	string += "<td><input type='text' id='searchSources'></input></td>\n";
	string += "<td><input type='text' id='searchSourceTitles'></input></td>\n";
	string += "<td><!--<input type='checkbox' id='searchLive'></input>--></td>\n";
	string += "<td><button id='search'>Search</button></td>\n";
	string += "</tr>\n";
	
	for(var i = 0; i < data.length; i++)
	{
		string += "<tr id='row_" + i + "'>\n";
		string += "<td id='name_" + i + "'>" + data[i].Name + "</td>\n";
		string += "<td id='foundingYear_" + i + "'>" + data[i].FoundingYear + "</td>\n";
		string += "<td id='closingYear_" + i + "'>" + data[i].ClosingYear + "</td>\n";
		string += "<td id='foundingLocation_" + i + "'>" + data[i].FoundingLocation + "</td>\n";
		string += "<td id='people_" + i + "'>" + data[i].People + "</td>\n";
		string += "<td id='toys_" + i + "'>" + data[i].Toys + "</td>\n";
		string += "<td id='description_" + i + "'>" + data[i].Description + "</td>\n";
		string += "<td id='website_" + i + "'>" + data[i].Website + "</td>\n";
		string += "<td id='logo_" + i + "'>" + data[i].Logo + "</td>\n";
		string += "<td id='currentOwner_" + i + "'>" + data[i].CurrentOwner + "</td>\n";
		string += "<td id='sources_" + i + "'>" + data[i].Sources + "</td>\n";
		string += "<td id='sourceTitles_" + i + "'>" + data[i].SourceTitles + "</td>\n";
		string += "<td id='live_" + i + "'>" + data[i].Live + "</td>\n";
		string += "<td><button id='deleteRow_" + i + "' class='deleteRowButton' row='" + i + "'>Delete Row</button><button id='editRow_" + i + "' class='editRowButton' row='" + i + "'>Edit Row</button><button id='submit_" + i + "' class='doneButton' row='" + i + "' style='display:none;'>Submit</button><button id='cancel_" + i + "' class='cancelButton' row='" + i + "' style='display:none;'>Cancel</button></td>\n";
		string += "</tr>\n";
	}
	
	string += "<tr>\n";
	string += "<td><input type='text' id='inputName'></input></td>\n";
	string += "<td><input type='text' id='inputFoundingYear'></input></td>\n";
	string += "<td><input type='text' id='inputClosingYear'></input></td>\n";
	string += "<td><input type='text' id='inputFoundingLocation'></input></td>\n";
	string += "<td><div id='inputPeople'><div id='inputPeopleContainer_0' row=0><input type='text' class='inputPeople' id='inputPeople_0' row=0></input><br /></div></div><button id='addRowAddPerson'>+</button></td>\n";
	string += "<td><div id='inputToys'><div id='inputToysContainer_0' row=0><input type='text' class='inputToys' id='inputToys_0' row=0></input><br /></div></div><button id='addRowAddToy'>+</button></td>\n";
	string += "<td><input type='text' id='inputDescription'></input></td>\n";
	string += "<td><input type='text' id='inputWebsite'></input></td>\n";
	string += "<td><input type='text' id='inputLogo'></input></td>\n";
	string += "<td><input type='text' id='inputCurrentOwner'></input></td>\n";
	string += "<td><div id='inputSources'><div id='inputSourcesContainer_0' row=0><input type='text' class='inputSources' id='inputSources_0' row=0></input><br /></div></div><button id='addRowAddSource'>+</button></td>\n";
	string += "<td><div id='inputSourceTitles'><div id='inputSourceTitlesContainer_0' row=0><input type='text' class='inputSourceTitles' id='inputSourceTitles_0' row=0></input><br /></div></div><button id='addRowAddSourceTitle'>+</button></td>\n";
	string += "<td><input type='checkbox' id='inputLive'></input></td>\n";
	string += "<td><button id='addRow'>Add Row</button></td>\n";
	string += "</tr>\n";
	
	table.innerHTML = string;
}

function setupEvents()
{
	var addRowButtton = document.getElementById("addRow");
	if(addRowButtton)
	{
		addRowButtton.onclick = function()
		{
			var data = {};
			data.Name = parseTextInput(document.getElementById("inputName").value);
			data.FoundingYear = parseTextInput(document.getElementById("inputFoundingYear").value);
			data.ClosingYear = parseTextInput(document.getElementById("inputClosingYear").value);
			data.FoundingLocation = parseTextInput(document.getElementById("inputFoundingLocation").value);
			data.People = parseArrayInput(document.getElementsByClassName("inputPeople"));
			data.Toys = parseArrayInput(document.getElementsByClassName("inputToys"));
			data.Description = parseTextInput(document.getElementById("inputDescription").value);
			data.Website = parseTextInput(document.getElementById("inputWebsite").value);
			data.Logo = parseTextInput(document.getElementById("inputLogo").value);
			data.CurrentOwner = parseTextInput(document.getElementById("inputCurrentOwner").value);
			data.Sources = parseArrayInput(document.getElementsByClassName("inputSources"));
			data.SourceTitles = parseArrayInput(document.getElementsByClassName("inputSourceTitles"));
			data.Live = document.getElementById("inputLive").checked;
			
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
			
			console.log(data);
		};
	}
	
	var searchButtton = document.getElementById("search");
	if(searchButtton)
	{
		searchButtton.onclick = function()
		{
			var data = {};
			data.Name = parseTextInput(document.getElementById("searchName").value);
			data.FoundingYear = parseTextInput(document.getElementById("searchFoundingYear").value);
			data.ClosingYear = parseTextInput(document.getElementById("searchClosingYear").value);
			data.FoundingLocation = parseTextInput(document.getElementById("searchFoundingLocation").value);;
			data.People = parseTextInput(document.getElementById("searchPeople").value);
			data.Toys = parseTextInput(document.getElementById("searchToys").value)
			data.Description = parseTextInput(document.getElementById("searchDescription").value);
			data.Website = parseTextInput(document.getElementById("searchWebsite").value);
			data.Logo = parseTextInput(document.getElementById("searchLogo").value);
			data.CurrentOwner = parseTextInput(document.getElementById("searchCurrentOwner").value);
			data.Sources = parseTextInput(document.getElementById("searchSources").value);
			data.SourceTitles = parseTextInput(document.getElementById("searchSourceTitles").value);
			//data.Live = document.getElementById("searchLive").checked;


			$.ajax({
				type: "GET",
				url: 'http://localhost:3000/searchcompanies',
				data: {data:JSON.stringify(data)},				
				success: function(data) {
					console.log('success');
					console.log(data);
					setupPage(data);
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
			
			console.log(data);
		};
	}
	
	var deleteButtons = document.getElementsByClassName("deleteRowButton");
	for(var i = 0; i < deleteButtons.length; i++)
	{
		deleteButtons[i].onclick = function(e)
		{
			if(confirm("Are you sure you would like to delete this row? This can't be undone."))
			{
				var row = e.target.getAttribute("row");
				var data = {};
				data.Name = parseTextInput(document.getElementById("name_" + row).innerHTML);
				
				$.ajax({
					type: "POST",
					url: 'http://localhost:3000/deletecompanies',
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
	
	var editButtons = document.getElementsByClassName("editRowButton");
	for(var i = 0; i < editButtons.length; i++)
	{
		editButtons[i].onclick = function(e)
		{
			var row = e.target.getAttribute("row");
            
            var peopleCell;
            if(g_data[row].People.length == 0)
            {
                peopleCell = "<div id='inputPeople__" + row + "'><div id='inputPeopleContainer_" + row + "_0' row=" + row + " index=0><input type='text' class='inputPeople__" + row + "' id='inputPeople_" + row + "_0' row=" + row + "></input><br /></div></div><button id='editRowAddPerson_" + row + "' row=" + row + ">+</button>"
            }
            else
            {
                peopleCell = "<div id='inputPeople__" + row + "'>";
                for(var j = 0; j < g_data[row].People.length; j++)
                {
                    peopleCell += "<div id='inputPeopleContainer_" + row + "_" + j + "' row=" + row + " index='" + j + "'><input type='text' class='inputPeople__" + row + "' id='inputPeople_" + row + "_" + j + "' row=" + row + " index='" + j + "' value='" + (g_data[row].People[j] == null ? "" : g_data[row].People[j].replace(/'/g, "&#39;")) + "'></input>";
                    if(j > 0)
                    {
                        peopleCell += "<button id='editRowDeletePerson_" + row + "_" + j + "'row=" + row + " index=" + j + ">X</button>";
                    }
                    peopleCell += "<br /></div>";
                }
                peopleCell += "</div><button id='editRowAddPerson_" + row + "' row=" + row + ">+</button>";
            }
            
            var toysCell;
            if(g_data[row].Toys.length == 0)
            {
                toysCell = "<div id='inputToys__" + row + "'><div id='inputToysContainer_" + row + "_0' row=" + row + " index=0><input type='text' class='inputToys__" + row + "' id='inputToys_" + row + "_0' row=" + row + "></input><br /></div></div><button id='editRowAddToy_" + row + "' row=" + row + ">+</button>"
            }
            else
            {
                toysCell = "<div id='inputToys__" + row + "'>";
                for(var j = 0; j < g_data[row].Toys.length; j++)
                {
                    toysCell += "<div id='inputToysContainer_" + row + "_" + j + "' row=" + row + " index='" + j + "'><input type='text' class='inputToys__" + row + "' id='inputToys_" + row + "_" + j + "' row=" + row + " index='" + j + "' value='" + (g_data[row].Toys[j] == null ? "" : g_data[row].Toys[j].replace(/'/g, "&#39;")) + "'></input>";
                    if(j > 0)
                    {
                        toysCell += "<button id='editRowDeleteToy_" + row + "_" + j + "'row=" + row + " index=" + j + ">X</button>";
                    }
                    toysCell += "<br /></div>";
                }
                toysCell += "</div><button id='editRowAddToy_" + row + "' row=" + row + ">+</button>";
            }
            
            var sourcesCell;
            if(g_data[row].Sources.length == 0)
            {
                sourcesCell = "<div id='inputSources__" + row + "'><div id='inputSourcesContainer_" + row + "_0' row=" + row + " index=0><input type='text' class='inputSources__" + row + "' id='inputSources_" + row + "_0' row=" + row + "></input><br /></div></div><button id='editRowAddSource_" + row + "' row=" + row + ">+</button>"
            }
            else
            {
                sourcesCell = "<div id='inputSources__" + row + "'>";
                for(var j = 0; j < g_data[row].Sources.length; j++)
                {
                    sourcesCell += "<div id='inputSourcesContainer_" + row + "_" + j + "' row=" + row + " index='" + j + "'><input type='text' class='inputSources__" + row + "' id='inputSources_" + row + "_" + j + "' row=" + row + " index='" + j + "' value='" + (g_data[row].Sources[j] == null ? "" : g_data[row].Sources[j].replace(/'/g, "&#39;")) + "'></input>";
                    if(j > 0)
                    {
                        sourcesCell += "<button id='editRowDeleteSource_" + row + "_" + j + "'row=" + row + " index=" + j + ">X</button>";
                    }
                    sourcesCell += "<br /></div>";
                }
                sourcesCell += "</div><button id='editRowAddSource_" + row + "' row=" + row + ">+</button>";
            }
            
            var sourceTitlesCell;
            if(g_data[row].SourceTitles.length == 0)
            {
                sourceTitlesCell = "<div id='inputSourceTitles__" + row + "'><div id='inputSourceTitlesContainer_" + row + "_0' row=" + row + " index=0><input type='text' class='inputSourceTitles__" + row + "' id='inputSourceTitles_" + row + "_0' row=" + row + "></input><br /></div></div><button id='editRowAddSourceTitle_" + row + "' row=" + row + ">+</button>"
            }
            else
            {
                sourceTitlesCell = "<div id='inputSourceTitles__" + row + "'>";
                for(var j = 0; j < g_data[row].SourceTitles.length; j++)
                {
                    sourceTitlesCell += "<div id='inputSourceTitlesContainer_" + row + "_" + j + "' row=" + row + " index='" + j + "'><input type='text' class='inputSourceTitles__" + row + "' id='inputSourceTitles_" + row + "_" + j + "' row=" + row + " index='" + j + "' value='" + (g_data[row].SourceTitles[j] == null ? "" : g_data[row].SourceTitles[j].replace(/'/g, "&#39;")) + "'></input>";
                    if(j > 0)
                    {
                        sourceTitlesCell += "<button id='editRowDeleteSourceTitle_" + row + "_" + j + "'row=" + row + " index=" + j + ">X</button>";
                    }
                    sourceTitlesCell += "<br /></div>";
                }
                sourceTitlesCell += "</div><button id='editRowAddSourceTitle_" + row + "' row=" + row + ">+</button>";
            }
            
			document.getElementById("name_" + row).innerHTML = "<input type='text' id='inputName_" + row + "' value='" + (g_data[row].Name == null ? "" : g_data[row].Name.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("foundingYear_" + row).innerHTML = "<input type='text' id='inputFoundingYear_" + row + "' value='" + (g_data[row].FoundingYear == null ? "" : g_data[row].FoundingYear.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("closingYear_" + row).innerHTML = "<input type='text' id='inputClosingYear_" + row + "' value='" + (g_data[row].ClosingYear == null ? "" : g_data[row].ClosingYear.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("foundingLocation_" + row).innerHTML = "<input type='text' id='inputFoundingLocation_" + row + "' value='" + (g_data[row].FoundingLocation == null ? "" : g_data[row].FoundingLocation.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("people_" + row).innerHTML = peopleCell;//"<input type='text' id='inputToys_" + row + "' value='" + g_data[row].Toys + "'></input>";
			document.getElementById("toys_" + row).innerHTML = toysCell;//"<input type='text' id='inputCompanies_" + row + "' value='" + g_data[row].Companies + "'></input>";
			document.getElementById("description_" + row).innerHTML = "<input type='text' id='inputDescription_" + row + "' value='" + (g_data[row].Description == null ? "" : g_data[row].Description.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("website_" + row).innerHTML = "<input type='text' id='inputWebsite_" + row + "' value='" + (g_data[row].Website == null ? "" : g_data[row].Website.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("logo_" + row).innerHTML = "<input type='text' id='inputLogo_" + row + "' value='" + (g_data[row].Logo == null ? "" : g_data[row].Logo.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("currentOwner_" + row).innerHTML = "<input type='text' id='inputCurrentOwner_" + row + "' value='" + (g_data[row].CurrentOwner == null ? "" : g_data[row].CurrentOwner.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("sources_" + row).innerHTML = sourcesCell;//"<input type='text' id='inputSources_" + row + "' value='" + g_data[row].Sources + "'></input>";
			document.getElementById("sourceTitles_" + row).innerHTML = sourceTitlesCell;//"<input type='text' id='inputSourceTitles_" + row + "' value='" + g_data[row].SourceTitles + "'></input>";
			document.getElementById("live_" + row).innerHTML = "<input type='checkbox' id='inputLive_" + row + "' " + (g_data[row].Live? "checked" : "") + "></input>";
            console.log(g_data[row].Live);
            
            for(var j = 1; j < g_data[row].People.length; j++)
            {
                document.getElementById("editRowDeletePerson_" + row + "_" + j).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputPeople__" + row);
                    inputs.removeChild(document.getElementById("inputPeopleContainer_" + row + "_" + index));
                };
            }
            
            for(var j = 1; j < g_data[row].Toys.length; j++)
            {
                document.getElementById("editRowDeleteToy_" + row + "_" + j).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputToys__" + row);
                    inputs.removeChild(document.getElementById("inputToysContainer_" + row + "_" + index));
                };
            }
            
            for(var j = 1; j < g_data[row].Sources.length; j++)
            {
                document.getElementById("editRowDeleteSource_" + row + "_" + j).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputSources__" + row);
                    inputs.removeChild(document.getElementById("inputSourcesContainer_" + row + "_" + index));
                    if(document.getElementById("editRowDeleteSourceTitle_" + row + "_" + index))
                    {
                        document.getElementById("editRowDeleteSourceTitle_" + row + "_" + index).onclick(e);
                    }
                };
            }
            
            for(var j = 1; j < g_data[row].SourceTitles.length; j++)
            {
                document.getElementById("editRowDeleteSourceTitle_" + row + "_" + j).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputSourceTitles__" + row);
                    inputs.removeChild(document.getElementById("inputSourceTitlesContainer_" + row + "_" + index));
                    if(document.getElementById("editRowDeleteSource_" + row + "_" + index))
                    {
                        document.getElementById("editRowDeleteSource_" + row + "_" + index).onclick(e);
                    }
                };
            }
            
            
            document.getElementById("editRowAddPerson_" + row).onclick = function(e)
            {
                var row = e.target.getAttribute("row");
                var inputs = document.getElementById("inputPeople__" + row);
                var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
                console.log("" + row + " " + index);
                var container = document.createElement("div");
                container.id = "inputPeopleContainer_" + row + "_" + index;
                container.setAttribute("row", row);
                container.setAttribute("index", index);
                container.innerHTML = "<input type='text' class='inputPeople__" + row + "' id='inputPeople_" + row + "_" + index + "' row=" + row + " index='" + index + "'></input><button id='editRowDeletePerson_" + row + "_" + index + "'row=" + row + " index=" + index + ">X</button><br />";
                inputs.appendChild(container);
                document.getElementById("editRowDeletePerson_" + row + "_" + index).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputPeople__" + row);
                    inputs.removeChild(document.getElementById("inputPeopleContainer_" + row + "_" + index));
                };
            };

            document.getElementById("editRowAddToy_" + row).onclick = function(e)
            {
                var row = e.target.getAttribute("row");
                var inputs = document.getElementById("inputToys__" + row);
                var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
                console.log("" + row + " " + index);
                var container = document.createElement("div");
                container.id = "inputToysContainer_" + row + "_" + index;
                container.setAttribute("row", row);
                container.setAttribute("index", index);
                container.innerHTML = "<input type='text' class='inputToys__" + row + "' id='inputToys_" + row + "_" + index + "' row=" + row + " index='" + index + "'></input><button id='editRowDeleteToy_" + row + "_" + index + "'row=" + row + " index=" + index + ">X</button><br />";
                inputs.appendChild(container);
                document.getElementById("editRowDeleteToy_" + row + "_" + index).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputToys__" + row);
                    inputs.removeChild(document.getElementById("inputToysContainer_" + row + "_" + index));
                };
            };
            
            
            document.getElementById("editRowAddSource_" + row).onclick = function(e)
            {
                var row = e.target.getAttribute("row");
                var inputs = document.getElementById("inputSources__" + row);
                var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
                console.log("" + row + " " + index);
                var container = document.createElement("div");
                container.id = "inputSourcesContainer_" + row + "_" + index;
                container.setAttribute("row", row);
                container.setAttribute("index", index);
                container.innerHTML = "<input type='text' class='inputSources__" + row + "' id='inputSources_" + row + "_" + index + "' row=" + row + " index='" + index + "'></input><button id='editRowDeleteSource_" + row + "_" + index + "'row=" + row + " index=" + index + ">X</button><br />";
                inputs.appendChild(container);
                document.getElementById("editRowDeleteSource_" + row + "_" + index).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputSources__" + row);
                    inputs.removeChild(document.getElementById("inputSourcesContainer_" + row + "_" + index));
                    if(document.getElementById("editRowDeleteSourceTitle_" + row + "_" + index))
                    {
                        document.getElementById("editRowDeleteSourceTitle_" + row + "_" + index).onclick(e);
                    }
                };
                if(e.target.id == "editRowAddSource_" + row)
                {
                    document.getElementById("editRowAddSourceTitle_" + row).onclick(e);
                }
            };
            
            
            document.getElementById("editRowAddSourceTitle_" + row).onclick = function(e)
            {
                var row = e.target.getAttribute("row");
                var inputs = document.getElementById("inputSourceTitles__" + row);
                var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
                console.log("" + row + " " + index);
                var container = document.createElement("div");
                container.id = "inputSourceTitlesContainer_" + row + "_" + index;
                container.setAttribute("row", row);
                container.setAttribute("index", index);
                container.innerHTML = "<input type='text' class='inputSourceTitles__" + row + "' id='inputSourceTitles_" + row + "_" + index + "' row=" + row + " index='" + index + "'></input><button id='editRowDeleteSourceTitle_" + row + "_" + index + "'row=" + row + " index=" + index + ">X</button><br />";
                inputs.appendChild(container);
                document.getElementById("editRowDeleteSourceTitle_" + row + "_" + index).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputSourceTitles__" + row);
                    inputs.removeChild(document.getElementById("inputSourceTitlesContainer_" + row + "_" + index));
                    if(document.getElementById("editRowDeleteSource_" + row + "_" + index))
                    {
                        document.getElementById("editRowDeleteSource_" + row + "_" + index).onclick(e);
                    }
                };
                if(e.target.id == "editRowAddSourceTitle_" + row)
                {
                    document.getElementById("editRowAddSource_" + row).onclick(e);
                }
            };
			
			document.getElementById("editRow_" + row).style.display = "none";
			document.getElementById("deleteRow_" + row).style.display = "none";
			document.getElementById("submit_" + row).style.display = "block";
			document.getElementById("cancel_" + row).style.display = "block";
		}
	}
	
	var cancelButtons = document.getElementsByClassName("cancelButton");
	for(var i = 0; i < cancelButtons.length; i++)
	{
		cancelButtons[i].onclick = function(e)
		{
			var row = e.target.getAttribute("row");
			
			document.getElementById("name_" + row).innerHTML = g_data[row].FirstName;
			document.getElementById("foundingYear_" + row).innerHTML = g_data[row].FoundingYear;
			document.getElementById("closingYear_" + row).innerHTML = g_data[row].ClosingYear;
			document.getElementById("foundingLocaion_" + row).innerHTML = g_data[row].FoundingLocation;
			document.getElementById("people_" + row).innerHTML = g_data[row].People;
			document.getElementById("toys_" + row).innerHTML = g_data[row].Toys;
			document.getElementById("description_" + row).innerHTML = g_data[row].Description;
			document.getElementById("website_" + row).innerHTML = g_data[row].Website;
			document.getElementById("logo_" + row).innerHTML = g_data[row].Logo;
			document.getElementById("currentOwner_" + row).innerHTML = g_data[row].CurrentOwner;
			document.getElementById("sources_" + row).innerHTML = g_data[row].Sources;
			document.getElementById("sourceTitles_" + row).innerHTML = g_data[row].SourceTitles;
			document.getElementById("live_" + row).innerHTML = g_data[row].Live;
			
			document.getElementById("editRow_" + row).style.display = "block";
			document.getElementById("deleteRow_" + row).style.display = "block";
			document.getElementById("submit_" + row).style.display = "none";
			document.getElementById("cancel_" + row).style.display = "none";
		}
	}
	
	var doneButtons = document.getElementsByClassName("doneButton");
	for(var i = 0; i < doneButtons.length; i++)
	{
		doneButtons[i].onclick = function(e)
		{
			var row = e.target.getAttribute("row");
			var data = {};
			data.Name = parseTextInput(document.getElementById("inputName_" + row).value);
			data.FoundingYear = parseTextInput(document.getElementById("inputFoundingYear_" + row).value);
			data.ClosingYear = parseTextInput(document.getElementById("inputClosingYear_" + row).value);
			data.FoundingLocation = parseTextInput(document.getElementById("inputFoundingLocation_" + row).value);
			data.People = parseArrayInput(document.getElementsByClassName("inputPeople__" + row));
			data.Companies = parseArrayInput(document.getElementsByClassName("inputToys__" + row));
			data.Description = parseTextInput(document.getElementById("inputDescription_" + row).value);
			data.Website = parseTextInput(document.getElementById("inputWebsite_" + row).value);
			data.Logo = parseTextInput(document.getElementById("inputLogo_" + row).value);
			data.CurrentOwner = parseTextInput(document.getElementById("inputCurrentOwner_" + row).value);
			data.Sources = parseArrayInput(document.getElementsByClassName("inputSources__" + row));
			data.SourceTitles = parseArrayInput(document.getElementsByClassName("inputSourceTitles__" + row));
			data.Live = document.getElementById("inputLive_" + row).checked;
			
			data.OrigName = g_data[row].Name;
			
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
			
			console.log(data);
		};
	}
    
    var addRowAddPersonButton = document.getElementById("addRowAddPerson");
    addRowAddPersonButton.onclick = function(e)
    {
        var inputs = document.getElementById("inputPeople");
        var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
        var container = document.createElement("div");
        container.id = "inputPeopleContainer_" + index;
        container.setAttribute("index", index);
        container.innerHTML = "<input type='text' class='inputPeople' id='inputPeople_" + index + "' index=" + index + "></input><button id='addRowDeletePerson_" + index + "' index=" + index + ">X</button><br />";
        inputs.appendChild(container);
        document.getElementById("addRowDeletePerson_" + index).onclick = function(e)
        {
            var inputs = document.getElementById("inputPeople");
            var index = e.target.getAttribute("index");
            inputs.removeChild(document.getElementById("inputPeopleContainer_" + index));
        };
    };
    
    var addRowAddToyButton = document.getElementById("addRowAddToy");
    addRowAddToyButton.onclick = function(e)
    {
        var inputs = document.getElementById("inputToys");
        var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
        var container = document.createElement("div");
        container.id = "inputToysContainer_" + index;
        container.setAttribute("index", index);
        container.innerHTML = "<input type='text' class='inputToys' id='inputToys_" + index + "' index=" + index + "></input><button id='addRowDeleteToy_" + index + "' index=" + index + ">X</button><br />";
        inputs.appendChild(container);
        document.getElementById("addRowDeleteToy_" + index).onclick = function(e)
        {
            var inputs = document.getElementById("inputToys");
            var index = e.target.getAttribute("index");
            inputs.removeChild(document.getElementById("inputToysContainer_" + index));
        };
    };
    
    var addRowAddSourceButton = document.getElementById("addRowAddSource");
    addRowAddSourceButton.onclick = function(e)
    {
        var inputs = document.getElementById("inputSources");
        var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
        var container = document.createElement("div");
        container.id = "inputSourcesContainer_" + index;
        container.setAttribute("index", index);
        container.innerHTML = "<input type='text' class='inputSources' id='inputSources_" + index + "' index=" + index + "></input><button id='addRowDeleteSource_" + index + "' index=" + index + ">X</button><br />";
        inputs.appendChild(container);
        document.getElementById("addRowDeleteSource_" + index).onclick = function(e)
        {
            var inputs = document.getElementById("inputSources");
            var index = e.target.getAttribute("index");
            inputs.removeChild(document.getElementById("inputSourcesContainer_" + index));
            if(document.getElementById("addRowDeleteSourceTitle_" + index))
            {
                document.getElementById("addRowDeleteSourceTitle_" + index).onclick(e);
            }
        };
        if(e.target.id == "addRowAddSource")
        {
            document.getElementById("addRowAddSourceTitle").onclick(e);
        }
    };
    
    var addRowAddSourceTitleButton = document.getElementById("addRowAddSourceTitle");
    addRowAddSourceTitleButton.onclick = function(e)
    {
        var inputs = document.getElementById("inputSourceTitles");
        var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
        var container = document.createElement("div");
        container.id = "inputSourceTitlesContainer_" + index;
        container.setAttribute("index", index);
        container.innerHTML = "<input type='text' class='inputSourceTitles' id='inputSourceTitles_" + index + "' index=" + index + "></input><button id='addRowDeleteSourceTitle_" + index + "' index=" + index + ">X</button><br />";
        inputs.appendChild(container);
        document.getElementById("addRowDeleteSourceTitle_" + index).onclick = function(e)
        {
            var inputs = document.getElementById("inputSourceTitles");
            var index = e.target.getAttribute("index");
            inputs.removeChild(document.getElementById("inputSourceTitlesContainer_" + index));
            if(document.getElementById("addRowDeleteSource_" + index))
            {
                document.getElementById("addRowDeleteSource_" + index).onclick(e);
            }
        };
        if(e.target.id == "addRowAddSourceTitle")
        {
            document.getElementById("addRowAddSource").onclick(e);
        }
    };
	
}