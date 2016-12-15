var pg = require('pg');
var express = require('express');
var parser = require("body-parser");
var app = express();

app.use(parser.urlencoded({extended:true}));

//var conString = "postgres://postgres:admin@localhost:5432/JewishPlayProject";
var conString = "postgres://postgres:admin@localhost:5432/JewishPlayProject";
var client = new pg.Client(conString);
client.connect();

//queries are queued and executed one after another once the connection becomes available
var x = 1000;

// while (x > 0) {
    // client.query("insert into junk(name, a_number) values('ted',12)");
    // client.query("insert into junk(name, a_number) values($1, $2)", ['john', x]);
    // x = x - 1;
// }

var json = {events: []};
var num = 0;
var people = [];
var companies = [];
var toys = [];
var toytypes = [];

function updateJSON()
{
	json = {
		events: [],
		title: {text:{}}
	};
	
	json.title.text.headline = "Jewish Play Project Timeline";
	
	json.title.text.text = "The timeline currently covers about half of what we've found in terms of people and companies and only a few represenative toys, game, and sources for each at this time. We'll begin updating it on a regular basis starting at the end of January 2015. If you'd like to be notified electronically when we post updates, please use the appropriate address in the about section. <br><br>You can navigate the timeline chronologically by dragging on it, clicking the arrow brackets on either side of the content on the screen or using the arrow keys on your keyboard. You can contract (less dragging, more overlapped labels) or expand (more dragging, less overlap) by clicking on the magnifying glass icons of the left side of the timeline. Click on an image or media clip to be taken to the website it came from.  <br><br> All the rights to external media and links lie with the source website providers. Our timeline is powered by <a href='http://timeline.knightlab.com'>TimelineJS</a>, an open source tool from Knight Lab.";
	
	people = [];
	var index = 0;
	var pquery = client.query("SELECT * FROM \"People\"");
	//fired after last row is emitted

	pquery.on('row', function(row) 
	{
		people.push(row);
		if(row.Live)
		{
			var rEvent = {};
			rEvent.start_date = {};
			rEvent.start_date.year = row.BirthYear;
			if(row.DeathYear)
			{					
                rEvent.end_date = {};
                if(row.DeathYear == "Present")
                {
                    rEvent.end_date.year = new Date().getFullYear();
                }
                else
                {
                    rEvent.end_date.year = row.DeathYear;
                }
			}
			var name = row.FirstName;
			name += row.MiddleName ? " " + row.MiddleName : "";
			name += " " + row.LastName;
			rEvent.text = {};
			rEvent.text.headline = name;
			rEvent.text.text = "";
			if(row.Companies && row.Companies.length > 0)
			{
				rEvent.Companies = row.Companies;
				if(row.Companies.length == 1)
				{
					rEvent.text.text += "Company: "
				}
				else
				{
					rEvent.text.text += "Companies: "
				}
				for(var i = 0; i < row.Companies.length; i++)
				{
					rEvent.text.text += "{C" + i + "}<br />";
				}
			}
			if(row.Toys && row.Toys.length > 0)
			{
				rEvent.Toys = row.Toys;
				if(row.Toys.length == 1)
				{
					rEvent.text.text += "Toy: "
				}
				else
				{
					rEvent.text.text += "Toys: "
				}
				for(var i = 0; i < row.Toys.length; i++)
				{
					rEvent.text.text += "{T" + i + "}<br />";
				}
			}
			if(row.Bio)
			{
				rEvent.text.text += row.Bio;
			}
            if(row.Sources && row.Sources.length > 0)
            {
                rEvent.text.text += "<br/><br/>Sources:<br/>";
                for(var i = 0; i < row.Sources.length; i++)
                {
                    var title = row.Sources[i];
                    if(row.SourceTitles && row.SourceTitles[i])
                    {
                        title = row.SourceTitles[i];
                    }
                    rEvent.text.text += "<a href='" + row.Sources[i] + "' target='_blank'>" + title  + "</a><br/>";
                }
            }
			if(row.Picture)
			{
				rEvent.media = {};
				rEvent.media.url = row.Picture;
			}
			rEvent.unique_id = "P" + index++;
			//rEvent.unique_id = name.replace(/ /g, "_");
			rEvent.group = "People";
			json.events.push(rEvent);
		}
	});
	
	pquery.on('end', function(){
		var firstCompany = index;
		companies = [];
		var cquery = client.query("SELECT * FROM \"Companies\"");
		//fired after last row is emitted

		cquery.on('row', function(row) 
		{
			companies.push(row);
			if(row.Live)
			{
				var rEvent = {};
				rEvent.start_date = {};
				rEvent.start_date.year = row.FoundingYear;
				if(row.ClosingYear)
				{
					rEvent.end_date = {};
					if(row.ClosingYear == "Present")
					{
						rEvent.end_date.year = new Date().getFullYear();
					}
					else
					{
						rEvent.end_date.year = row.ClosingYear;
					}
				}
				rEvent.text = {};
				rEvent.text.headline = row.Name;
				rEvent.text.text = "";
				if(row.People && row.People.length > 0)
				{
					rEvent.People = row.People;
					rEvent.text.text += "People: "
					for(var i = 0; i < row.People.length; i++)
					{
						rEvent.text.text += "{P" + i + "}<br />";
					}
				}
				rEvent.text.text += "Founding Location: " + row.FoundingLocation + "<br />";
				if(row.Toys && row.Toys.length > 0)
				{
					rEvent.Toys = row.Toys;
					if(row.Toys.length == 1)
					{
						rEvent.text.text += "Toy: "
					}
					else
					{
						rEvent.text.text += "Toys: "
					}
					for(var i = 0; i < row.Toys.length; i++)
					{
						rEvent.text.text += "{T" + i + "}<br />";
					}
				}
				if(row.Description)
				{
					rEvent.text.text += row.Description;
				}
                if(row.Sources && row.Sources.length > 0)
                {
                    rEvent.text.text += "<br/><br/>Sources:<br/>";
                    for(var i = 0; i < row.Sources.length; i++)
                    {
                        var title = row.Sources[i];
                        if(row.SourceTitles && row.SourceTitles[i])
                        {
                            title = row.SourceTitles[i];
                        }
                        rEvent.text.text += "<a href='" + row.Sources[i] + "' target='_blank'>" + title  + "</a><br/>";
                    }
                }
				if(row.Logo)
				{
					rEvent.media = {};
					rEvent.media.url = row.Logo;
				}
				rEvent.unique_id = "C" + index++;
				//rEvent.unique_id = row.Name.replace(/ /g, "_");
				rEvent.group = "Companies";
				json.events.push(rEvent);
			}
		});
		
		cquery.on('end', function(){
			var firstToy = index;
			toys = [];
			var tquery = client.query("SELECT * FROM \"Toys\"");
			//fired after last row is emitted

			tquery.on('row', function(row) 
			{
				toys.push(row);
				if(row.Live)
				{
					var rEvent = {};
					rEvent.start_date = {};
					rEvent.start_date.year = row.Year;
					rEvent.text = {};
					rEvent.text.headline = row.Name;
					rEvent.text.text = "";
					if(row.People && row.People.length > 0)
					{
						rEvent.People = row.People;
						rEvent.text.text += "People: "
						for(var i = 0; i < row.People.length; i++)
						{
							rEvent.text.text += "{P" + i + "}<br />";
						}
					}
					if(row.Toys && row.Toys.length > 0)
					{
						rEvent.Toys = row.Toys;
						if(row.Toys.length == 1)
						{
							rEvent.text.text += "Toy: "
						}
						else
						{
							rEvent.text.text += "Toys: "
						}
						for(var i = 0; i < row.Toys.length; i++)
						{
							rEvent.text.text += "{T" + i + "}<br />";
						}
					}
					if(row.Description)
					{
						rEvent.text.text += row.Description;
					}
                    if(row.Sources && row.Sources.length > 0)
                    {
                        rEvent.text.text += "<br/><br/>Sources:<br/>";
                        for(var i = 0; i < row.Sources.length; i++)
                        {
                            var title = row.Sources[i];
                            if(row.SourceTitles && row.SourceTitles[i])
                            {
                                title = row.SourceTitles[i];
                            }
                            rEvent.text.text += "<a href='" + row.Sources[i] + "' target='_blank'>" + title  + "</a><br/>";
                        }
                    }
					if(row.Image)
					{
						rEvent.media = {};
						rEvent.media.url = row.Image;
					}
					rEvent.unique_id = "T" + index++;
					///rEvent.unique_id = row.Name.replace(/ /g, "_");
					rEvent.group = "Toys";
					json.events.push(rEvent);
				}
			});

			tquery.on('end', function() {
				for(var i = 0; i < json.events.length; i++)
				{
					var event = json.events[i];
					if (event.People)
					{
						for(var j = 0; j < event.People.length; j++)
						{
							for(var k = 0; k <= firstCompany; k++)
							{
								if(k == firstCompany)
								{
									event.text.text = event.text.text.replace("{P" + j + "}", event.People[j]);
									break;
								}
								if(event.People[j] == json.events[k].text.headline)
								{
									//console.log("{C" + j + "}");
									// event.text.text = event.text.text.replace("{P" + j + "}", "<a href='#" + json.events[k].unique_id + "'>" + event.People[j] + "</a>");
									// break;
								}
							}
						}
					}
					if (event.Companies)
					{
						for(var j = 0; j < event.Companies.length; j++)
						{
							for(var k = firstCompany; k <= firstToy; k++)
							{
								if(k == firstToy)
								{
									event.text.text = event.text.text.replace("{C" + j + "}", event.Companies[j]);
									break;
								}
								if(event.Companies[j] == json.events[k].text.headline)
								{
									//console.log("{C" + j + "}");
									// event.text.text = event.text.text.replace("{C" + j + "}", "<a href='#" + json.events[k].unique_id + "'>" + event.Companies[j] + "</a>");
									// break;
								}
							}
						}
					}
					if(event.Toys)
					{
						for(var j = 0; j < event.Toys.length; j++)
						{
							for(var k = firstToy; k <= index; k++)
							{
								if(k == index)
								{
									event.text.text = event.text.text.replace("{T" + j + "}", event.Toys[j]);
									break;
								}
								if(event.Toys[j] == json.events[k].text.headline)
								{
									//console.log("{T" + j + "}");
									// event.text.text = event.text.text.replace("{T" + j + "}", "<a href='#" + json.events[k].unique_id + "'>" + event.Toys[j] + "</a>");
									// break;
								}
							}
						}
					}
				}
			});
		});
	});
    
    toytypes = [];
	var ttquery = client.query("SELECT * FROM \"ToyTypes\"");
	//fired after last row is emitted

	ttquery.on('row', function(row) 
	{
		toytypes.push(row);
	});

	ttquery.on('end', function() {
		//console.log(json);
		console.log(num++);
	});
}

function setLoop()
{
	updateJSON();
	setTimeout(setLoop, 3000);
}

setLoop();

//get all rows from database
app.get('/', function(req, res){
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
	res.json(json);
});

//People
//{
//get all people rows
app.get('/people', function(req, res){
	res.json(people);
});

//get all live people rows
app.get('/browsepeople', function(req, res){
	var queries = JSON.parse(req.query.data);
	if(queries.name && queries.name != "")
	{
		//var query = "SELECT * FROM \"People\" WHERE \"People\".\"FirstName\" || ' ' || \"People\".\"MiddleName\" || ' ' || \"People\".\"LastName\" ~* '.*" + queries.name + ".*' AND \"People\".\"Live\" = True";

		var nameArray = queries.name.split(" ");
		var query = "SELECT * FROM \"People\" WHERE "
		
		for (var i = 0; i < nameArray.length; i++)
		{
			query += "(\"People\".\"FirstName\" || ' ' || \"People\".\"MiddleName\" || ' ' || \"People\".\"LastName\" ~* '.*" + nameArray[i] + ".*' OR \"People\".\"FirstName\" || ' ' || \"People\".\"LastName\" ~* '.*" + nameArray[i] + ".*') AND ";
		}
		
		query += "\"People\".\"Live\" = True";
		
		console.log(query);
		
		results = [];
		var pquery = client.query(query);
		
		pquery.on('row', function(row) 
		{
			results.push(row);
		});
		
		pquery.on('end', function(){
			//console.log(results);
			makeList(results);
		});
	}
	else
	{
		makeList(people);
	}
	
	function makeList(people)
	{
		var data = [];
		for(var i = 0; i < people.length; i++)
		{
			if(people[i].Live)
			{
				var person = {};
				var name = people[i].FirstName;
				name += people[i].MiddleName ? " " + people[i].MiddleName : "";
				name += " " + people[i].LastName;
				person.name = name;
				person.href = "./display/people?name=" + name;
				if(people[i].Picture)
				{
					person.picture = people[i].Picture;
				}
				else
				{
					person.picture = "";
				}
				var year = people[i].BirthYear;
				if(people[i].DeathYear)
				{
					year += " - " + people[i].DeathYear;
				}
				else
				{
					year += " - Present";
				}
				person.year = year;
				if(people[i].Bio)
				{
					if(people[i].Bio.length > 252)
					{
						person.description = people[i].Bio.substr(0, 250) + "...";
					}
					else
					{
						person.description = people[i].Bio;
					}
				}
				else
				{
					person.description = "";
				}
				data.push(person)
			}
		}
		res.json(data);
	}
});

//returns all rows that fit user inputted queries
app.get('/searchpeople', function(req, res){
	
	var queries = JSON.parse(req.query.data);
	console.log(queries);
	
	var query = "SELECT * FROM \"People\" WHERE ";
	
	if(queries.FirstName)
	{
		query += "\"People\".\"FirstName\" ~* '.*" + queries.FirstName + ".*' AND ";
	}
	if(queries.MiddleName)
	{
		query += "\"People\".\"MiddleName\" ~* '.*" + queries.MiddleName + ".*' AND ";
	}
	if(queries.LastName)
	{
		query += "\"People\".\"LastName\" ~* '.*" + queries.LastName + ".*' AND ";
	}
	if(queries.BirthYear)
	{
		query += "\"People\".\"BirthYear\" ~* '.*" + queries.BirthYear + ".*' AND ";
	}
	if(queries.DeathYear)
	{
		query += "\"People\".\"DeathYear\" ~* '.*" + queries.DeathYear + ".*' AND ";
	}
	if(queries.Companies)
	{
		query += "\"People\".\"Companies\" @> ARRAY['" + queries.Companies + "']::text[] AND ";
	}
	if(queries.Toys)
	{
		query += "\"People\".\"Toys\" @> ARRAY['" + queries.Toys + "']::text[] AND ";
	}
	if(queries.Bio)
	{
		query += "\"People\".\"Bio\" ~* '.*" + queries.Bio + ".*' AND ";
	}
	if(queries.Picture)
	{
		query += "\"People\".\"Picture\" ~* '.*" + queries.Picture + ".*' AND ";
	}
	if(queries.Sources)
	{
		query += "\"People\".\"Sources\" @> ARRAY['" + queries.Sources + "']::text[] AND ";
	}
	if(queries.SourceTitles)
	{
		query += "\"People\".\"SourceTitles\" @> ARRAY['" + queries.SourceTitles + "']::text[] AND ";
	}
	// if(req.query["Live"])
	// {
		// query += "\"People\".\"Live\" = " + req.query["Live"] + " AND ";
	// }
	
	query += "true";
	
	console.log(query);
	
	results = [];
	var pquery = client.query(query);
    
	pquery.on('row', function(row) 
	{
		results.push(row);
	});
	
	pquery.on('end', function(){
		//console.log(results);
		res.json(results);
	});
	
});

//add a row to the people table
app.post('/addpeople', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"INSERT INTO public.\"People\"(\"FirstName\", \"MiddleName\", \"LastName\", \"BirthYear\", \"DeathYear\", \"Companies\", \"Toys\", \"Bio\", \"Picture\", \"Sources\", \"SourceTitles\", \"Live\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", 
		[row.FirstName, row.MiddleName, row.LastName, row.BirthYear, row.DeathYear, row.Companies, row.Toys, row.Bio, row.Picture, row.Sources, row.SourceTitles, row.Live],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send("people row inserted!");
				console.log('people row inserted');
			}
		}
	);
});


//delete a row from the people table
app.post('/deletepeople', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"DELETE FROM public.\"People\" WHERE \"People\".\"FirstName\" = $1 AND \"People\".\"LastName\" = $2", 
		[row.FirstName, row.LastName],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send("people row deleted!");
				console.log('people row deleted');
			}
		}
	);
});

//edit a row in the people table
app.post('/editpeople', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"UPDATE public.\"People\" SET (\"FirstName\", \"MiddleName\", \"LastName\", \"BirthYear\", \"DeathYear\", \"Companies\", \"Toys\", \"Bio\", \"Picture\", \"Sources\", \"SourceTitles\", \"Live\") = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) WHERE \"People\".\"FirstName\" = $13 AND \"People\".\"LastName\" = $14", 
		[row.FirstName, row.MiddleName, row.LastName, row.BirthYear, row.DeathYear, row.Companies, row.Toys, row.Bio, row.Picture, row.Sources, row.SourceTitles, row.Live, row.OrigFirstName, row.OrigLastName],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send({FirstName:row.FirstName, LastName:row.LastName});
				console.log('people row edited');
			}
		}
	);
});

app.get('/person', function(req, res){
    var queries = JSON.parse(req.query.data);
	console.log(queries);
    
    if(queries.firstName && queries.lastName)
    {    
        queries.firstName = queries.firstName.replace(/'/g, "''");
        queries.firstName = queries.firstName.replace(/[\(\)]/g, "\\$&");
        queries.lastName = queries.lastName.replace(/'/g, "''");
        queries.lastName = queries.lastName.replace(/[\(\)]/g, "\\$&");
        var query = "SELECT * FROM \"People\" WHERE ";
        query += "lower(\"People\".\"FirstName\") = lower('" + queries.firstName + "') AND ";
        query += "lower(\"People\".\"LastName\") = lower('" + queries.lastName + "') AND ";
        query += "\"People\".\"Live\" = True";
        
        results = [];
        var pquery = client.query(query);
        
        pquery.on('row', function(row) 
        {
            results.push(row);
        });	
        
        pquery.on('end', function(){
            console.log(results);
            if(results.length == 0)
            {
                res.status(500).send("No Results");
            }
            else if(results.length == 1)
            {
                res.json(results[0]);
            }
            else
            {
                res.status(500).send("Too Many Results");
            }
        });
    }
    else if(queries.name)
    {
		queries.name = queries.name.replace(/'/g, "''");
        queries.name = queries.name.replace(/[\(\)]/g, "\\$&");
        var query = "SELECT * FROM \"People\" WHERE (lower(\"People\".\"FirstName\" || ' ' || \"People\".\"MiddleName\" || ' ' || \"People\".\"LastName\") = lower('" + queries.name + "') OR lower(\"People\".\"FirstName\" || ' ' || \"People\".\"LastName\") = lower('" + queries.name + "') ) AND \"People\".\"Live\" = True";
        
        results = [];
        var pquery = client.query(query);
        
        pquery.on('row', function(row) 
        {
            results.push(row);
        });	
        
        pquery.on('end', function(){
            console.log(results);
            if(results.length == 0)
            {
                res.status(500).send("No Results");
            }
            else if(results.length == 1)
            {
                res.json(results[0]);
            }
            else
            {
                res.status(500).send("Too Many Results");
            }
        });
    }
    else
    {
        console.log("Not enough queries")
		res.status(500).send("Not enough queries");
    }
});
//}

//Toys
//{
app.get('/toys', function(req, res){
	res.json({toys:toys, toytypes:toytypes});
});

app.get('/toytypes', function(req, res){
	res.json(toytypes);
});


app.get('/browsetoys', function(req, res){
	var queries = JSON.parse(req.query.data);
	//name exists, display all toys that match the query
	if(queries.name && queries.name != "")
	{
		var nameArray = queries.name.split(" ");
		
		var query = "SELECT * FROM \"Toys\" WHERE ";
		
		for (var i = 0; i < nameArray.length; i++)
		{
			query += "\"Toys\".\"Name\" ~* '.*" + nameArray[i] + ".*' AND ";
		}
		
		query += "\"Toys\".\"Live\" = True";
		
		results = [];
		var pquery = client.query(query);
		//fired after last row is emitted

		pquery.on('row', function(row) 
		{
			results.push(row);
		});
		
		pquery.on('end', function(){
			//console.log(results);
			makeList(results);
		});
	}
	//no name, subType exists
	else if (queries.subType && queries.subType != "")
	{
		//subType is all
		if(queries.superType && queries.subType.toLowerCase() == "all")
		{
			//subType is all and superType is all or does not exist, display all toys
			if(queries.superType.toLowerCase() == "all" || !(queries.superType && queries.superType != ""))
			{
				makeList(toys);
			}
			//subType is all, superType exists and is not all, display all toys under supertype
			else
			{
				var query = "SELECT * FROM \"Toys\" WHERE \"Toys\".\"Live\" = True AND ( "
					
				for(var i = 0; i < toytypes.length; i++)
				{
					if(toytypes[i].Name.toLowerCase() == queries.superType.toLowerCase())
					{
						var data = [];
						for(var j = 0; j < toytypes[i].SubTypes.length; j++)
						{
							query += "lower(\"Toys\".\"Type\") = lower('" + toytypes[i].SubTypes[j] + "') OR ";
						}
						query += "false)"
						break;
					}
				}

					
				console.log(query);
				
				results = [];
				var pquery = client.query(query);
				//fired after last row is emitted

				pquery.on('row', function(row) 
				{
					results.push(row);
				});
				
				pquery.on('end', function(){
					//console.log(results);
					makeList(results);
				});
			}
		}
		//subtype exists and is not all, display all toys under subtype
		else
		{
			var query = "SELECT * FROM \"Toys\" WHERE lower(\"Toys\".\"Type\") = lower('" + queries.subType + "') AND \"Toys\".\"Live\" = True";
			
			console.log(query);
			
			results = [];
			var pquery = client.query(query);
			//fired after last row is emitted

			pquery.on('row', function(row) 
			{
				results.push(row);
			});
			
			pquery.on('end', function(){
				//console.log(results);
				makeList(results);
			});
		}
	}
	//no name, no subtype, superType exists
	else if (queries.superType && queries.superType != "")
	{
		//supertype is all, display all toys
		if(queries.superType.toLowerCase() == "all")
		{
			makeList(toys);
		}
		//supertype exists and is not all, display all subtypes under supertype
		else
		{
			for(var i = 0; i < toytypes.length; i++)
			{
				if(toytypes[i].Name.toLowerCase() == queries.superType.toLowerCase())
				{
					var data = [];
					for(var j = 0; j < toytypes[i].SubTypes.length; j++)
					{
						var type = {};
						type.name = toytypes[i].SubTypes[j];
						type.picture = "";
						type.year = "";
						type.description = "";
						type.href = "./browse?category=toys&superType=" + toytypes[i].Name + "&subType=" + toytypes[i].SubTypes[j];
						data.push(type);
					}
					var type = {};
					type.name = "All";
					type.picture = "";
					type.year = "";
					type.description = "";
					type.href = "./browse?category=toys&superType=" + toytypes[i].Name + "&subType=all";
					data.push(type);
					res.json(data);
					break;
				}
			}
		}
	}
	//no name, no subtype, no supertype, display all supertypes
	else
	{
		data = [];
		for(var i = 0; i < toytypes.length; i++)
		{
			var type = {};
			type.name = toytypes[i].Name;
			type.picture = "";
			type.year = "";
			type.description = "";
			type.href = "./browse?category=toys&superType=" + toytypes[i].Name;
			data.push(type);
		}
		var type = {};
		type.name = "All";
		type.picture = "";
		type.year = "";
		type.description = "";
		type.href = "./browse?category=toys&superType=all";
		data.push(type);
		res.json(data);
	}
	
	
	function makeList(toys)
	{
		var data = [];
		for(var i = 0; i < toys.length; i++)
		{
			if(toys[i].Live)
			{
				var toy = {};
				toy.name = toys[i].Name;
				toy.href = "./display/toys?name=" + toys[i].Name;
				if(toys[i].Picture)
				{
					toy.picture = toys[i].Picture;
				}
				else
				{
					toy.picture = "";
				}
				if(toys[i].Year)
				{
					toy.year = toys[i].Year;
				}
				else
				{
					toy.year += "";
				}
				if(toys[i].Description)
				{
					if(toys[i].Description.length > 252)
					{
						toy.description = toys[i].Description.substr(0, 250) + "...";
					}
					else
					{
						toy.description = toys[i].Description;
					}
				}
				else
				{
					toy.description = "";
				}
				data.push(toy)
			}
		}
		res.json(data);
	}
});

app.get('/searchtoys', function(req, res){
	
	
	var queries = JSON.parse(req.query.data);
	console.log(queries);
	
	var query = "SELECT * FROM \"Toys\" WHERE ";
	
	if(queries.Name)
	{
		query += "\"Toys\".\"Name\" ~* '.*" + queries.Name + ".*' AND ";
	}
	if(queries.Year)
	{
		query += "\"Toys\".\"Year\" ~* '.*" + queries.Year + ".*' AND ";
	}
	if(queries.Companies)
	{
		query += "\"Toys\".\"Companies\" @> ARRAY['" + queries.Companies + "']::text[] AND ";
	}
	if(queries.People)
	{
		query += "\"Toys\".\"People\" @> ARRAY['" + queries.People + "']::text[] AND ";
	}
	if(queries.Description)
	{
		query += "\"Toys\".\"Description\" ~* '.*" + queries.Description + ".*' AND ";
	}
	if(queries.Picture)
	{
		query += "\"Toys\".\"Picture\" ~* '.*" + queries.Picture + ".*' AND ";
	}
	if(queries.Sources)
	{
		query += "\"Toys\".\"Sources\" @> ARRAY['" + queries.Sources + "']::text[] AND ";
	}
	if(queries.SourceTitles)
	{
		query += "\"Toys\".\"SourceTitles\" @> ARRAY['" + queries.SourceTitles + "']::text[] AND ";
	}
	if(queries.Type)
	{
		query += "\"Toys\".\"Type\" = '" + queries.Type + "' AND ";
	}
	// if(req.query["Live"])
	// {
		// query += "\"People\".\"Live\" = " + req.query["Live"] + " AND ";
	// }
	
	query += "true";
	
	results = [];
	var pquery = client.query(query);
	//fired after last row is emitted

	pquery.on('row', function(row) 
	{
		results.push(row);
	});
	
	pquery.on('end', function(){
		//console.log(results);
		res.json(results);
	});
	
});

app.post('/addtoys', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"INSERT INTO public.\"Toys\"(\"Name\", \"Year\", \"Companies\", \"People\", \"Description\", \"Picture\", \"Sources\", \"SourceTitles\", \"Type\", \"Live\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
		[row.Name, row.Year, row.Companies, row.People, row.Description, row.Picture, row.Sources, row.SourceTitles, row.Type, row.Live],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send("toys row inserted!");
				console.log('toys row inserted');
			}
		}
	);
});

app.post('/deletetoys', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"DELETE FROM public.\"Toys\" WHERE \"Toys\".\"Name\" = $1", 
		[row.Name],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send("toys row deleted!");
				console.log('toys row deleted');
			}
		}
	);
});

app.post('/edittoys', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"UPDATE public.\"Toys\" SET (\"Name\", \"Year\", \"Companies\", \"People\", \"Description\", \"Picture\", \"Sources\", \"SourceTitles\", \"Type\", \"Live\") = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) WHERE \"Toys\".\"Name\" = $11", 
		[row.Name, row.Year, row.Companies, row.People, row.Description, row.Picture, row.Sources, row.SourceTitles, row.Type, row.Live, row.OrigName],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send({Name:row.Name});
			}
		}
	);
});

app.get('/toy', function(req, res){
    var queries = JSON.parse(req.query.data);
	console.log(queries);
    
    if(queries.name)
    {    
        queries.name = queries.name.replace(/'/g, "''");
        queries.name = queries.name.replace(/[\(\)]/g, "\\$&");
        var query = "SELECT * FROM \"Toys\" WHERE ";
        query += "lower(\"Toys\".\"Name\") = lower('" + queries.name + "') AND ";
        query += "\"Toys\".\"Live\" = True";
        
        console.log(query);
        
        results = [];
        var pquery = client.query(query);
        
        pquery.on('row', function(row) 
        {
            results.push(row);
        });	
        
        pquery.on('end', function(){
            console.log(results);
            if(results.length == 0)
            {
                res.status(500).send("No Results");
            }
            else if(results.length == 1)
            {
                res.json(results[0]);
            }
            else
            {
                res.status(500).send("Too Many Results");
            }
        });
    }
    else
    {
        console.log("Not enough queries")
		res.status(500).send("Not enough queries");
    }
});
//}

//Companies
//{
app.get('/companies', function(req, res){
	res.json(companies);
});

//get all live company rows for browse page
app.get('/browsecompanies', function(req, res){
	var queries = JSON.parse(req.query.data);
	if(queries.name && queries.name != "")
	{
		var nameArray = queries.name.split(" ");
		
		var query = "SELECT * FROM \"Companies\" WHERE ";
		
		for (var i = 0; i < nameArray.length; i++)
		{
			query += "\"Companies\".\"Name\" ~* '.*" + nameArray[i] + ".*' AND ";
		}
		
		query += "\"Companies\".\"Live\" = True";
		
		console.log(query);
		
		results = [];
		var pquery = client.query(query);
		//fired after last row is emitted

		pquery.on('row', function(row) 
		{
			results.push(row);
		});
		
		pquery.on('end', function(){
			//console.log(results);
			makeList(results);
		});
	}
	else
	{
		makeList(companies);
	}
	
	function makeList(companies)
	{
		var data = [];
		for(var i = 0; i < companies.length; i++)
		{
			if(companies[i].Live)
			{
				var company = {};
				company.name = companies[i].Name;
				company.href = "./display/companies?name=" + companies[i].Name;
				if(companies[i].Logo)
				{
					company.picture = companies[i].Logo;
				}
				else
				{
					company.picture = "";
				}
				var year = companies[i].FoundingYear;
				if(companies[i].ClosingYear)
				{
					year += " - " + companies[i].ClosingYear;
				}
				else
				{
					year += " - Present";
				}
				company.year = year;
				if(companies[i].Description)
				{
					if(companies[i].Description.length > 252)
					{
						company.description = companies[i].Description.substr(0, 250) + "...";
					}
					else
					{
						company.description = companies[i].Description;
					}
				}
				else
				{
					company.description = "";
				}
				data.push(company)
			}
		}
		res.json(data);
	}
});

app.get('/searchcompanies', function(req, res){
	
	
	var queries = JSON.parse(req.query.data);
	console.log(queries);
	
	var query = "SELECT * FROM \"Companies\" WHERE ";
	
	if(queries.Name)
	{
		query += "\"Companies\".\"Name\" ~* '.*" + queries.Name + ".*' AND ";
	}
	if(queries.FoundingYear)
	{
		query += "\"Companies\".\"FoundingYear\" ~* '.*" + queries.FoundingYear + ".*' AND ";
	}
	if(queries.ClosingYear)
	{
		query += "\"Companies\".\"ClosingYear\" ~* '.*" + queries.ClosingYear + ".*' AND ";
	}
	if(queries.FoundingLocation)
	{
		query += "\"Companies\".\"FoundingLocation\" ~* '.*" + queries.FoundingLocation + ".*' AND ";
	}
	if(queries.People)
	{
		query += "\"Companies\".\"People\" @> ARRAY['" + queries.People + "']::text[] AND ";
	}
	if(queries.Toys)
	{
		query += "\"Companies\".\"Toys\" @> ARRAY['" + queries.Toys + "']::text[] AND ";
	}
	if(queries.Description)
	{
		query += "\"Companies\".\"Description\" ~* '.*" + queries.Description + ".*' AND ";
	}
	if(queries.Website)
	{
		query += "\"Companies\".\"Website\" ~* '.*" + queries.Website + ".*' AND ";
	}
	if(queries.Logo)
	{
		query += "\"Companies\".\"Logo\" ~* '.*" + queries.Logo + ".*' AND ";
	}
	if(queries.CurrentOwner)
	{
		query += "\"Companies\".\"CurrentOwner\" ~* '.*" + queries.CurrentOwner + ".*' AND ";
	}
	if(queries.Sources)
	{
		query += "\"Companies\".\"Sources\" @> ARRAY['" + queries.Sources + "']::text[] AND ";
	}
	if(queries.SourceTitles)
	{
		query += "\"Companies\".\"SourceTitles\" @> ARRAY['" + queries.SourceTitles + "']::text[] AND ";
	}
	// if(req.query["Live"])
	// {
		// query += "\"People\".\"Live\" = " + req.query["Live"] + " AND ";
	// }
	
	query += "true";
	
	console.log(query);
	
	results = [];
	var pquery = client.query(query);
	//fired after last row is emitted

	pquery.on('row', function(row) 
	{
		results.push(row);
	});
	
	pquery.on('end', function(){
		//console.log(results);
		res.json(results);
	});
	
});

app.post('/addcompanies', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"INSERT INTO public.\"Companies\"(\"Name\", \"FoundingYear\", \"ClosingYear\", \"FoundingLocation\", \"People\", \"Toys\", \"Description\", \"Website\", \"Logo\", \"CurrentOwner\", \"Sources\", \"SourceTitles\", \"Live\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", 
		[row.Name, row.FoundingYear, row.ClosingYear, row.FoundingLocation, row.People, row.Toys, row.Description, row.Website, row.Logo, row.CurrentOwner, row.Sources, row.SourceTitles, row.Live],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send("companies row inserted!");
				console.log('companies row inserted');
			}
		}
	);
});

app.post('/deletecompanies', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"DELETE FROM public.\"Companies\" WHERE \"Companies\".\"Name\" = $1", 
		[row.Name],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send("companies row deleted!");
				console.log('companies row deleted');
			}
		}
	);
});

app.post('/editcompanies', function(req, res){
	
	console.log(req.body.data);
	
	var row = JSON.parse(req.body.data);
	
	query = client.query(
		"UPDATE public.\"Companies\" SET (\"Name\", \"FoundingYear\", \"ClosingYear\", \"FoundingLocation\", \"People\", \"Toys\", \"Description\", \"Website\", \"Logo\", \"CurrentOwner\", \"Sources\", \"SourceTitles\", \"Live\") = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) WHERE \"Companies\".\"Name\" = $14", 
		[row.Name, row.FoundingYear, row.ClosingYear, row.FoundingLocation, row.People, row.Toys, row.Description, row.Website, row.Logo, row.CurrentOwner, row.Sources, row.SourceTitles, row.Live, row.OrigName],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
				res.status(500).send("Error");
			}
			else
			{
				updateJSON();
				res.send({Name:row.Name});
			}
		}
	);
});

app.get('/company', function(req, res){
    var queries = JSON.parse(req.query.data);
	console.log(queries);
    
    if(queries.name)
    {    
        queries.name = queries.name.replace(/'/g, "''");
        queries.name = queries.name.replace(/[\(\)]/g, "\\$&");
        var query = "SELECT * FROM \"Companies\" WHERE ";
        query += "lower(\"Companies\".\"Name\") = lower('" + queries.name + "') AND ";
        query += "\"Companies\".\"Live\" = True";
        
        results = [];
        var pquery = client.query(query);
        
        pquery.on('row', function(row) 
        {
            results.push(row);
        });	
        
        pquery.on('end', function(){
            console.log(results);
            if(results.length == 0)
            {
                res.status(500).send("No Results");
            }
            else if(results.length == 1)
            {
                res.json(results[0]);
            }
            else
            {
                res.status(500).send("Too Many Results");
            }
        });
    }
    else
    {
        console.log("Not enough queries")
		res.status(500).send("Not enough queries");
    }
});
//}

app.listen(3000);