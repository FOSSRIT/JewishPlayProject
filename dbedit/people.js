window.onload = main;
var g_data;

function main()
{
	$.ajax({
		url: 'http://localhost:3000/people',						
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
	setupPeopleTable(data);
	setupEvents();
}

function setupPeopleTable(data)
{
	var table = document.getElementById("peopleTable");
	
	var string = "";
	string += "<tr>\n";
	string += "<th>First Name</th>\n";
	string += "<th>Middle Name</th>\n";
	string += "<th>Last Name</th>\n";
	string += "<th>Birth Year</th>\n";
	string += "<th>Death Year</th>\n";
	string += "<th>Companies</th>\n";
	string += "<th>Toys</th>\n";
	string += "<th>Bio</th>\n";
	string += "<th>Picture</th>\n";
	string += "<th>Sources</th>\n";
	string += "<th>Source Titles</th>\n";
	string += "<th>Live</th>\n";
	string += "<th></th>\n";
	string += "</tr>\n";
	
	string += "<tr>\n";
	string += "<td><input type='text' id='searchFirstName'></input></td>\n";
	string += "<td><input type='text' id='searchMiddleName'></input></td>\n";
	string += "<td><input type='text' id='searchLastName'></input></td>\n";
	string += "<td><input type='text' id='searchBirthYear'></input></td>\n";
	string += "<td><input type='text' id='searchDeathYear'></input></td>\n";
	string += "<td><input type='text' id='searchCompanies'></input></td>\n";
	string += "<td><input type='text' id='searchToys'></input></td>\n";
	string += "<td><input type='text' id='searchBio'></input></td>\n";
	string += "<td><input type='text' id='searchPicture'></input></td>\n";
	string += "<td><input type='text' id='searchSources'></input></td>\n";
	string += "<td><input type='text' id='searchSourceTitles'></input></td>\n";
	string += "<td><!--<input type='checkbox' id='searchLive'></input>--></td>\n";
	string += "<td><button id='search'>Search</button></td>\n";
	string += "</tr>\n";
	
	for(var i = 0; i < data.length; i++)
	{
		string += "<tr id='row_" + i + "'>\n";
		string += "<td id='firstName_" + i + "'>" + data[i].FirstName + "</td>\n";
		string += "<td id='middleName_" + i + "'>" + data[i].MiddleName + "</td>\n";
		string += "<td id='lastName_" + i + "'>" + data[i].LastName + "</td>\n";
		string += "<td id='birthYear_" + i + "'>" + data[i].BirthYear + "</td>\n";
		string += "<td id='deathYear_" + i + "'>" + data[i].DeathYear + "</td>\n";
		string += "<td id='companies_" + i + "'>" + data[i].Companies + "</td>\n";
		string += "<td id='toys_" + i + "'>" + data[i].Toys + "</td>\n";
		string += "<td id='bio_" + i + "'>" + data[i].Bio + "</td>\n";
		string += "<td id='picture_" + i + "'>" + data[i].Picture + "</td>\n";
		string += "<td id='sources_" + i + "'>" + data[i].Sources + "</td>\n";
		string += "<td id='sourceTitles_" + i + "'>" + data[i].SourceTitles + "</td>\n";
		string += "<td id='live_" + i + "'>" + data[i].Live + "</td>\n";
		string += "<td><button id='deleteRow_" + i + "' class='deleteRowButton' row='" + i + "'>Delete Row</button><button id='editRow_" + i + "' class='editRowButton' row='" + i + "'>Edit Row</button><button id='submit_" + i + "' class='doneButton' row='" + i + "' style='display:none;'>Submit</button><button id='cancel_" + i + "' class='cancelButton' row='" + i + "' style='display:none;'>Cancel</button></td>\n";
		string += "</tr>\n";
	}
	
	string += "<tr>\n";
	string += "<td><input type='text' id='inputFirstName'></input></td>\n";
	string += "<td><input type='text' id='inputMiddleName'></input></td>\n";
	string += "<td><input type='text' id='inputLastName'></input></td>\n";
	string += "<td><input type='text' id='inputBirthYear'></input></td>\n";
	string += "<td><input type='text' id='inputDeathYear'></input></td>\n";
	string += "<td><div id='inputCompanies'><div id='inputCompaniesContainer_0' row=0><input type='text' class='inputCompanies' id='inputCompanies_0' row=0></input><br /></div></div><button id='addRowAddCompany'>+</button></td>\n";
	string += "<td><div id='inputToys'><div id='inputToysContainer_0' row=0><input type='text' class='inputToys' id='inputToys_0' row=0></input><br /></div></div><button id='addRowAddToy'>+</button></td>\n";
	string += "<td><input type='text' id='inputBio'></input></td>\n";
	string += "<td><input type='text' id='inputPicture'></input></td>\n";
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
			data.FirstName = parseTextInput(document.getElementById("inputFirstName").value);
			data.MiddleName = parseTextInput(document.getElementById("inputMiddleName").value);
			data.LastName = parseTextInput(document.getElementById("inputLastName").value);
			data.BirthYear = parseTextInput(document.getElementById("inputBirthYear").value);
			data.DeathYear = parseTextInput(document.getElementById("inputDeathYear").value);
			data.Companies = parseArrayInput(document.getElementsByClassName("inputCompanies"));
			data.Toys = parseArrayInput(document.getElementsByClassName("inputToys"));
			data.Bio = parseTextInput(document.getElementById("inputBio").value);
			data.Picture = parseTextInput(document.getElementById("inputPicture").value);
			data.Sources = parseArrayInput(document.getElementsByClassName("inputSources"));
			data.SourceTitles = parseArrayInput(document.getElementsByClassName("inputSourceTitles"));
			data.Live = document.getElementById("inputLive").checked;
			
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
			
			console.log(data);
		};
	}
	
	var searchButtton = document.getElementById("search");
	if(searchButtton)
	{
		searchButtton.onclick = function()
		{
			var data = {};
			data.FirstName = parseTextInput(document.getElementById("searchFirstName").value);
			data.MiddleName = parseTextInput(document.getElementById("searchMiddleName").value);
			data.LastName = parseTextInput(document.getElementById("searchLastName").value);
			data.BirthYear = parseTextInput(document.getElementById("searchBirthYear").value);
			data.DeathYear = parseTextInput(document.getElementById("searchDeathYear").value);
			data.Companies = parseTextInput(document.getElementById("searchCompanies").value);
			data.Toys = parseTextInput(document.getElementById("searchToys").value);
			data.Bio = parseTextInput(document.getElementById("searchBio").value);
			data.Picture = parseTextInput(document.getElementById("searchPicture").value);
			data.Sources = parseTextInput(document.getElementById("searchSources").value);
			data.SourceTitles = parseTextInput(document.getElementById("searchSourceTitles").value);
			//data.Live = document.getElementById("searchLive").checked;


			$.ajax({
				type: "GET",
				url: 'http://localhost:3000/searchpeople',
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
				data.FirstName = parseTextInput(document.getElementById("firstName_" + row).innerHTML);
				data.LastName = parseTextInput(document.getElementById("lastName_" + row).innerHTML);
				
				$.ajax({
					type: "POST",
					url: 'http://localhost:3000/deletepeople',
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
            
			console.log(typeof g_data[row].DeathYear);
            console.log(typeof g_data[row].DeathYear == "undefined" ? "ascasc" : g_data[row].DeathYear);
			document.getElementById("firstName_" + row).innerHTML = "<input type='text' id='inputFirstName_" + row + "' value='" + (g_data[row].FirstName == null ? "" : g_data[row].FirstName.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("middleName_" + row).innerHTML = "<input type='text' id='inputMiddleName_" + row + "' value='" + (g_data[row].MiddleName == null ? "" : g_data[row].MiddleName.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("lastName_" + row).innerHTML = "<input type='text' id='inputLastName_" + row + "' value='" + (g_data[row].LastName == null ? "" : g_data[row].LastName.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("birthYear_" + row).innerHTML = "<input type='text' id='inputBirthYear_" + row + "' value='" + (g_data[row].BirthYear == null ? "" : g_data[row].BirthYear.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("deathYear_" + row).innerHTML = "<input type='text' id='inputDeathYear_" + row + "' value='" + (g_data[row].DeathYear == null ? "" : g_data[row].DeathYear.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("companies_" + row).innerHTML = companiesCell;//"<input type='text' id='inputCompanies_" + row + "' value='" + g_data[row].Companies + "'></input>";
			document.getElementById("toys_" + row).innerHTML = toysCell;//"<input type='text' id='inputToys_" + row + "' value='" + g_data[row].Toys + "'></input>";
			document.getElementById("bio_" + row).innerHTML = "<input type='text' id='inputBio_" + row + "' value='" + (g_data[row].Bio == null ? "" : g_data[row].Bio.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("picture_" + row).innerHTML = "<input type='text' id='inputPicture_" + row + "' value='" + (g_data[row].Picture == null ? "" : g_data[row].Picture.replace(/'/g, "&#39;")) + "'></input>";
			document.getElementById("sources_" + row).innerHTML = sourcesCell;//"<input type='text' id='inputSources_" + row + "' value='" + g_data[row].Sources + "'></input>";
			document.getElementById("sourceTitles_" + row).innerHTML = sourceTitlesCell;//"<input type='text' id='inputSourceTitles_" + row + "' value='" + g_data[row].SourceTitles + "'></input>";
			document.getElementById("live_" + row).innerHTML = "<input type='checkbox' id='inputLive_" + row + "' checked='" + (g_data[row].Live == "true") + "'></input>";
            
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
			
			document.getElementById("firstName_" + row).innerHTML = g_data[row].FirstName;
			document.getElementById("middleName_" + row).innerHTML = g_data[row].MiddleName;
			document.getElementById("lastName_" + row).innerHTML = g_data[row].LastName;
			document.getElementById("birthYear_" + row).innerHTML = g_data[row].BirthYear;
			document.getElementById("deathYear_" + row).innerHTML = g_data[row].DeathYear;
			document.getElementById("companies_" + row).innerHTML = g_data[row].Companies;
			document.getElementById("toys_" + row).innerHTML = g_data[row].Toys;
			document.getElementById("bio_" + row).innerHTML = g_data[row].Bio;
			document.getElementById("picture_" + row).innerHTML = g_data[row].Picture;
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
			data.FirstName = parseTextInput(document.getElementById("inputFirstName_" + row).value);
			data.MiddleName = parseTextInput(document.getElementById("inputMiddleName_" + row).value);
			data.LastName = parseTextInput(document.getElementById("inputLastName_" + row).value);
			data.BirthYear = parseTextInput(document.getElementById("inputBirthYear_" + row).value);
			data.DeathYear = parseTextInput(document.getElementById("inputDeathYear_" + row).value);
			data.Companies = parseArrayInput(document.getElementsByClassName("inputCompanies__" + row));
			data.Toys = parseArrayInput(document.getElementsByClassName("inputToys__" + row));
			data.Bio = parseTextInput(document.getElementById("inputBio_" + row).value);
			data.Picture = parseTextInput(document.getElementById("inputPicture_" + row).value);
			data.Sources = parseArrayInput(document.getElementsByClassName("inputSources__" + row));
			data.SourceTitles = parseArrayInput(document.getElementsByClassName("inputSourceTitles__" + row));
			data.Live = document.getElementById("inputLive_" + row).checked;
			
			data.OrigFirstName = g_data[row].FirstName;
			data.OrigLastName = g_data[row].LastName;
			
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