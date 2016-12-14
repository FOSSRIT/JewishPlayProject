window.onload = main;
var g_data;

function main()
{
	$.ajax({
		url: 'http://localhost:3000/toys',						
		success: function(data) {
			console.log('success');
			console.log(data);
			g_data = data.toys;
            setupToyTypesDropdown(data.toytypes)
			setupPage(data.toys);
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
	setupToysTable(data);
	setupEvents();
}

function setupToysTable(data, toytypes)
{
	var table = document.getElementById("toysTable");

	var string = "";
	string += "<tr>\n";
	string += "<th>Name</th>\n";
	string += "<th>Year</th>\n";
	string += "<th>Companies</th>\n";
	string += "<th>People</th>\n";
	string += "<th>Description</th>\n";
	string += "<th>Picture</th>\n";
	string += "<th>Sources</th>\n";
	string += "<th>Source Titles</th>\n";
	string += "<th>Type</th>\n";
	string += "<th>Live</th>\n";
	string += "<th></th>\n";
	string += "</tr>\n";
	
	string += "<tr>\n";
	string += "<td><input type='text' id='searchName'></input></td>\n";
	string += "<td><input type='text' id='searchYear'></input></td>\n";
	string += "<td><input type='text' id='searchCompanies'></input></td>\n";
	string += "<td><input type='text' id='searchPeople'></input></td>\n";
	string += "<td><input type='text' id='searchDescription'></input></td>\n";
	string += "<td><input type='text' id='searchPicture'></input></td>\n";
	string += "<td><input type='text' id='searchSources'></input></td>\n";
	string += "<td><input type='text' id='searchSourceTitles'></input></td>\n";
	string += "<td>" + document.getElementById("typesDropdown").innerHTML.replace("{DROPDOWNID}", "searchType") + "</td>\n";
	string += "<td><!--<input type='checkbox' id='searchLive'></input>--></td>\n";
	string += "<td><button id='search'>Search</button></td>\n";
	string += "</tr>\n";
	
	for(var i = 0; i < data.length; i++)
	{
		string += "<tr id='row_" + i + "'>\n";
		string += "<td id='name_" + i + "'>" + data[i].Name + "</td>\n";
		string += "<td id='year_" + i + "'>" + data[i].Year + "</td>\n";
		string += "<td id='companies_" + i + "'>" + data[i].Companies + "</td>\n";
		string += "<td id='people_" + i + "'>" + data[i].People + "</td>\n";
		string += "<td id='description_" + i + "'>" + data[i].Description + "</td>\n";
		string += "<td id='picture_" + i + "'>" + data[i].Picture + "</td>\n";
		string += "<td id='sources_" + i + "'>" + data[i].Sources + "</td>\n";
		string += "<td id='sourceTitles_" + i + "'>" + data[i].SourceTitles + "</td>\n";
		string += "<td id='type_" + i + "'>" + data[i].Type + "</td>\n";
		string += "<td id='live_" + i + "'>" + data[i].Live + "</td>\n";
		string += "<td><button id='deleteRow_" + i + "' class='deleteRowButton' row='" + i + "'>Delete Row</button><button id='editRow_" + i + "' class='editRowButton' row='" + i + "'>Edit Row</button><button id='submit_" + i + "' class='doneButton' row='" + i + "' style='display:none;'>Submit</button><button id='cancel_" + i + "' class='cancelButton' row='" + i + "' style='display:none;'>Cancel</button></td>\n";
		string += "</tr>\n";
	}
	
	string += "<tr>\n";
	string += "<td><input type='text' id='inputName'></input></td>\n";
	string += "<td><input type='text' id='inputYear'></input></td>\n";
	string += "<td><div id='inputCompanies'><div id='inputCompaniesContainer_0' row=0><input type='text' class='inputCompanies' id='inputCompanies_0' row=0></input><br /></div></div><button id='addRowAddCompany'>+</button></td>\n";
	string += "<td><div id='inputPeople'><div id='inputPeopleContainer_0' row=0><input type='text' class='inputPeople' id='inputPeople_0' row=0></input><br /></div></div><button id='addRowAddPerson'>+</button></td>\n";
	string += "<td><input type='text' id='inputDescription'></input></td>\n";
	string += "<td><input type='text' id='inputPicture'></input></td>\n";
	string += "<td><div id='inputSources'><div id='inputSourcesContainer_0' row=0><input type='text' class='inputSources' id='inputSources_0' row=0></input><br /></div></div><button id='addRowAddSource'>+</button></td>\n";
	string += "<td><div id='inputSourceTitles'><div id='inputSourceTitlesContainer_0' row=0><input type='text' class='inputSourceTitles' id='inputSourceTitles_0' row=0></input><br /></div></div><button id='addRowAddSourceTitle'>+</button></td>\n";
	string += "<td>" + document.getElementById("typesDropdown").innerHTML.replace("{DROPDOWNID}", "inputType") + "</td>\n";
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
			data.Year = parseTextInput(document.getElementById("inputYear").value);
			data.Companies = parseArrayInput(document.getElementsByClassName("inputCompanies"));
			data.People = parseArrayInput(document.getElementsByClassName("inputPeople"));
			data.Description = parseTextInput(document.getElementById("inputDescription").value);
			data.Picture = parseTextInput(document.getElementById("inputPicture").value);
			data.Sources = parseArrayInput(document.getElementsByClassName("inputSources"));
			data.SourceTitles = parseArrayInput(document.getElementsByClassName("inputSourceTitles"));
			data.Type = parseTextInput(document.getElementById("inputType").value);
			data.Live = document.getElementById("inputLive").checked;
			
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
			data.Year = parseTextInput(document.getElementById("searchYear").value);
			data.Companies = parseTextInput(document.getElementById("searchCompanies").value);
			data.People = parseTextInput(document.getElementById("searchPeople").value);
			data.Description = parseTextInput(document.getElementById("searchDescription").value);
			data.Picture = parseTextInput(document.getElementById("searchPicture").value);
			data.Sources = parseTextInput(document.getElementById("searchSources").value);
			data.SourceTitles = parseTextInput(document.getElementById("searchSourceTitles").value);
			data.Type = parseTextInput(document.getElementById("searchType").value);
			//data.Live = document.getElementById("searchLive").checked;


			$.ajax({
				type: "GET",
				url: 'http://localhost:3000/searchtoys',
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
					url: 'http://localhost:3000/deletetoys',
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
            
            var companiesCell;
            if(g_data[row].Companies.length == 0)
            {
                companiesCell = "<div id='inputCompanies__" + row + "'><div id='inputCompaniesContainer_" + row + "_0' row=" + row + " index=0><input type='text' class='inputCompanies__" + row + "' id='inputCompanies_" + row + "_0' row=" + row + "></input><br /></div></div><button id='editRowAddCompany_" + row + "' row=" + row + ">+</button>"
            }
            else
            {
                companiesCell = "<div id='inputCompanies__" + row + "'>";
                for(var j = 0; j < g_data[row].Companies.length; j++)
                {
                    companiesCell += "<div id='inputCompaniesContainer_" + row + "_" + j + "' row=" + row + " index='" + j + "'><input type='text' class='inputCompanies__" + row + "' id='inputCompanies_" + row + "_" + j + "' row=" + row + " index='" + j + "' value='" + (g_data[row].Companies[j] == null ? "" : g_data[row].Companies[j].replace(/'/g, "&#39;")) + "'></input>";
                    if(j > 0)
                    {
                        companiesCell += "<button id='editRowDeleteCompany_" + row + "_" + j + "'row=" + row + " index=" + j + ">X</button>";
                    }
                    companiesCell += "<br /></div>";
                }
                companiesCell += "</div><button id='editRowAddCompany_" + row + "' row=" + row + ">+</button>";
            }
            
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
			document.getElementById("year_" + row).innerHTML = "<input type='text' id='inputYear_" + row + "' value='" + (g_data[row].Year == null ? "" : g_data[row].Year.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("companies_" + row).innerHTML = companiesCell;//"<input type='text' id='inputCompanies_" + row + "' value='" + g_data[row].Companies + "'></input>";
			document.getElementById("people_" + row).innerHTML = peopleCell;//"<input type='text' id='inputToys_" + row + "' value='" + g_data[row].Toys + "'></input>";
			document.getElementById("description_" + row).innerHTML = "<input type='text' id='inputDescription_" + row + "' value='" + (g_data[row].Description == null ? "" : g_data[row].Description.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("picture_" + row).innerHTML = "<input type='text' id='inputPicture_" + row + "' value='" + (g_data[row].Picture == null ? "" : g_data[row].Picture.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("sources_" + row).innerHTML = sourcesCell;//"<input type='text' id='inputSources_" + row + "' value='" + g_data[row].Sources + "'></input>";
			document.getElementById("sourceTitles_" + row).innerHTML = sourceTitlesCell;//"<input type='text' id='inputSourceTitles_" + row + "' value='" + g_data[row].SourceTitles + "'></input>";
			document.getElementById("type_" + row).innerHTML = document.getElementById("typesDropdown").innerHTML.replace("{DROPDOWNID}", "inputType_" + row);
			document.getElementById("live_" + row).innerHTML = "<input type='checkbox' id='inputLive_" + row + "' " + (g_data[row].Live? "checked" : "") + "></input>";
            console.log(g_data[row].Live);
            
            if(g_data[row].Type != null)
            {
                var options = document.getElementById("inputType_" + row).options;
                for(var j = 0; j < options.length; j++)
                {
                    if(g_data[row].Type == options[j].innerHTML)
                    {
                        document.getElementById("inputType_" + row).selectedIndex = j;
                        break;
                    }
                }
                console.log(document.getElementById("inputType_" + row).options);
                console.log(document.getElementById("inputType_" + row).selectedIndex);
            }
            
            for(var j = 1; j < g_data[row].Companies.length; j++)
            {
                document.getElementById("editRowDeleteCompany_" + row + "_" + j).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputCompanies__" + row);
                    inputs.removeChild(document.getElementById("inputCompaniesContainer_" + row + "_" + index));
                };
            }
            
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

            document.getElementById("editRowAddCompany_" + row).onclick = function(e)
            {
                var row = e.target.getAttribute("row");
                var inputs = document.getElementById("inputCompanies__" + row);
                var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
                console.log("" + row + " " + index);
                var container = document.createElement("div");
                container.id = "inputCompaniesContainer_" + row + "_" + index;
                container.setAttribute("row", row);
                container.setAttribute("index", index);
                container.innerHTML = "<input type='text' class='inputCompanies__" + row + "' id='inputCompanies_" + row + "_" + index + "' row=" + row + " index='" + index + "'></input><button id='editRowDeleteCompany_" + row + "_" + index + "'row=" + row + " index=" + index + ">X</button><br />";
                inputs.appendChild(container);
                document.getElementById("editRowDeleteCompany_" + row + "_" + index).onclick = function(e)
                {
                    var index = e.target.getAttribute("index");
                    var row = e.target.getAttribute("row");
                    var inputs = document.getElementById("inputCompanies__" + row);
                    inputs.removeChild(document.getElementById("inputCompaniesContainer_" + row + "_" + index));
                };
            };
            
            
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
			document.getElementById("year_" + row).innerHTML = g_data[row].Year;
			document.getElementById("companies_" + row).innerHTML = g_data[row].Companies;
			document.getElementById("people_" + row).innerHTML = g_data[row].People;
			document.getElementById("description_" + row).innerHTML = g_data[row].Description;
			document.getElementById("picture_" + row).innerHTML = g_data[row].Picture;
			document.getElementById("sources_" + row).innerHTML = g_data[row].Sources;
			document.getElementById("sourceTitles_" + row).innerHTML = g_data[row].SourceTitles;
			document.getElementById("type_" + row).innerHTML = g_data[row].Type;
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
			data.Year = parseTextInput(document.getElementById("inputYear_" + row).value);
			data.Companies = parseArrayInput(document.getElementsByClassName("inputCompanies__" + row));
			data.People = parseArrayInput(document.getElementsByClassName("inputPeople__" + row));
			data.Description = parseTextInput(document.getElementById("inputDescription_" + row).value);
			data.Picture = parseTextInput(document.getElementById("inputPicture_" + row).value);
			data.Sources = parseArrayInput(document.getElementsByClassName("inputSources__" + row));
			data.SourceTitles = parseArrayInput(document.getElementsByClassName("inputSourceTitles__" + row));
			data.Type = parseTextInput(document.getElementById("inputType_" + row).value);
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
					url: 'http://localhost:3000/edittoys',
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
    
    var addRowAddCompanyButton = document.getElementById("addRowAddCompany");
    addRowAddCompanyButton.onclick = function(e)
    {
        var inputs = document.getElementById("inputCompanies");
        var index = parseInt(inputs.lastChild.getAttribute("index")) + 1;
        var container = document.createElement("div");
        container.id = "inputCompaniesContainer_" + index;
        container.setAttribute("index", index);
        container.innerHTML = "<input type='text' class='inputCompanies' id='inputCompanies_" + index + "' index=" + index + "></input><button id='addRowDeleteCompany_" + index + "' index=" + index + ">X</button><br />";
        inputs.appendChild(container);
        document.getElementById("addRowDeleteCompany_" + index).onclick = function(e)
        {
            var inputs = document.getElementById("inputCompanies");
            var index = e.target.getAttribute("index");
            inputs.removeChild(document.getElementById("inputCompaniesContainer_" + index));
        };
    };
    
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

function setupToyTypesDropdown(toyTypes)
{
	console.log(toyTypes);
    var dropdown = "<select id='{DROPDOWNID}'>";
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

function parseArrayInput2(text)
{
	if(text == "")
	{
		return null;
	}
	var array = text.split("|");
	var string = "{" + array[0];
	for(var i = 1; i < array.length; i++)
	{
		string += "," + array[i];
	}
	string += "}";
	return string;
}