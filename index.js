var pg = require('pg');
var express = require('express');
var parser = require("body-parser");
var app = express();

app.use(parser.urlencoded({extended:true}));

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
	json = {events: []};
	people = [];
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
				rEvent.end_date.year = row.DeathYear;
			}
			var name = row.FirstName;
			name += row.MiddleName ? " " + row.MiddleName : "";
			name += " " + row.LastName;
			rEvent.text = {};
			rEvent.text.headline = name;
			if(row.Bio)
			{
				rEvent.text.text = row.Bio;
			}
			if(row.Picture)
			{
				rEvent.media = {};
				rEvent.media.url = row.Picture;
			}
			//rEvent.unique_id = row.Index.toString();
			rEvent.group = "People";
			json.events.push(rEvent);
		}
	});
	
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
				rEvent.end_date.year = row.ClosingYear;
			}
			rEvent.text = {};
			rEvent.text.headline = row.Name;
			if(row.Description)
			{
				rEvent.text.text = row.Description;
			}
			if(row.Logo)
			{
				rEvent.media = {};
				rEvent.media.url = row.Logo;
			}
			//rEvent.unique_id = row.Index.toString();
			rEvent.group = "Companies";
			json.events.push(rEvent);
		}
	});
	
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
			if(row.Description)
			{
				rEvent.text.text = row.Description;
			}
			if(row.Image)
			{
				rEvent.media = {};
				rEvent.media.url = row.Image;
			}
			//rEvent.unique_id = row.Index.toString();
			rEvent.group = "Toys";
			json.events.push(rEvent);
		}
	});

	tquery.on('end', function() {
		//console.log(json);
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
				res.send("people row edited!");
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
        queries.lastName = queries.lastName.replace(/'/g, "''");
        var query = "SELECT * FROM \"People\" WHERE ";
        query += "\"People\".\"FirstName\" ~* '" + queries.firstName + "' AND ";
        query += "\"People\".\"LastName\" ~* '" + queries.lastName + "' AND ";
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
				res.send("toys row edited!");
				console.log('toys row edited');
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
        var query = "SELECT * FROM \"Toys\" WHERE ";
        query += "\"Toys\".\"Name\" ~* '" + queries.name + "' AND ";
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
				res.send("companies row edited!");
				console.log('companies row edited');
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
        var query = "SELECT * FROM \"Companies\" WHERE ";
        query += "\"Companies\".\"Name\" ~* '" + queries.name + "' AND ";
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