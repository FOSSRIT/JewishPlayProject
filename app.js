var pg = require('pg');
var xlsx = require('xlsx');

var workbook = xlsx.readFile('Jewish Play Project Master Data Sheet.xlsx');

var first_sheet_name = workbook.SheetNames[0];
/* Get worksheet */
var worksheet = workbook.Sheets[first_sheet_name];

//var conString = "postgres://postgres:admin@jppdevsite.ma:5432/JewishPlayProject";
var conString = "postgres://postgres:admin@localhost:5432/JewishPlayProject";
var client = new pg.Client(conString);
client.connect();

var query;

var g_companies = [];
var g_toys = [];
var g_companies_i = [];
var g_toys_i = [];

for(var i = 10; i <= 145; i++)
{
	var firstName = getCellValue("A" + i);
	var middleName = getCellValue("B" + i);
	var lastName = getCellValue("C" + i);
	var birthYear = getCellValue("E" + i);
	var deathYear = getCellValue("F" + i);
	var companies = getCompanies(i);
	var toys = getToys(i);
	var bio = getCellValue("J" + i);
	var picture = getCellLink("K" + i);
	var links = getSources(i);
	var sources = links.links;
	var sourceTitles = links.titles;
	var live = getCellValue("D" + i);
	var toyNames = [];
	for(var j = 0; j < toys.length; j++)
	{
		toyNames.push(toys[j].name);
	}
	
	console.log(toyNames);
	
	query = client.query(
		"INSERT INTO public.\"People\"(\"FirstName\", \"MiddleName\", \"LastName\", \"BirthYear\", \"DeathYear\", \"Companies\", \"Toys\", \"Bio\", \"Picture\", \"Sources\", \"SourceTitles\", \"Live\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", 
		[firstName, middleName, lastName, birthYear, deathYear, companies, toyNames, bio, picture, sources, sourceTitles, live],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{
				console.log('people row inserted');
			}
		}
	);
	
	for(var j = 0; j < companies.length; j++)
	{
		var company = companies[j];
		if (g_companies_i.indexOf(company) == -1)
		{
			g_companies_i.push(company);
			g_companies.push({
				name: company,
				foundingyear: getCellValue("I" + i),
				closingyear: getCellValue("X" + i),
				logo: getCellLink("S" + i),
				description: getCellValue("T" + i),
				foundingLocation: getCellValue("V" + i),
				people: [],
				toys: [],
				sources: [],
				sourceTitles: [],
				currentOwner: getCellValue("Y" + i),
				website: getCellLink("Z" + i),
				live: false
			});
		}
		var index = g_companies_i.indexOf(company);
		var name = firstName;
		name += middleName ? " " + middleName : "";
		name += " " + lastName;
		g_companies[index].people.push(name);
		for(var k = 0; k < toyNames.length; k++)
		{
			g_companies[index].toys.push(toyNames[k]);
		}
		
		var companySources = getCompanySources(i);
		for(var k = 0; k < companySources.links.length; k++)
		{
			g_companies[index].sources.push(companySources.links[k]);
			g_companies[index].sourceTitles.push(companySources.titles[k]);
		}
		
		g_companies[index].live = g_companies[index].live || live;
	}
	
	for(var j = 0; j < toys.length; j++)
	{
		var toy = toys[j];
		if (g_toys_i.indexOf(toy.name) == -1)
		{
			g_toys_i.push(toy.name);
			g_toys.push({
				name: toy.name,
				companies: [],
				people: [],
				year: toy.year,
				description: toy.description,
				sources: toy.sources,
				sourceTitles: toy.sourceTitles,
				live: false,
				image: toy.image
			});
		}
		var index = g_toys_i.indexOf(toy.name);
		var name = firstName;
		name += middleName ? " " + middleName : "";
		name += " " + lastName;
		g_toys[index].people.push(name);
		for(var k = 0; k < companies.length; k++)
		{
			if(g_toys[index].companies.indexOf(companies[k]) == -1){
				g_toys[index].companies.push(companies[k]);
			}
		}
		
		g_toys[index].live = g_toys[index].live || live;
	}
	
	// console.log("firstname: " + firstName);
	// console.log("middlename: " + middleName);
	// console.log("lastname: " + lastName);
	// console.log("birthyear: " + birthYear);
	// console.log("deathyear: " + deathYear);
	// console.log("companies: " + companies);
	// console.log("toys: " + toys);
	// console.log("bio: " + bio);
	// console.log("picture: " + picture);
	// console.log("sources: " + sources);
	// console.log("sourceTitles: " + sourceTitles);
	// console.log("live: " + live);
	// console.log();
}

var rows = [];
g_companies.sort();
g_toys.sort();

// for(var i = 0; i < g_companies.length; i++)
// {
	// g_companies[i] = {name:g_companies[i]};
// }
// for(var i = 0; i < g_toys.length; i++)
// {
	// g_toys[i] = {name:g_toys[i]};
// }

for(var i = 0; i < g_companies.length; i++)
{
	var company = g_companies[i];
	query = client.query(
		"INSERT INTO public.\"Companies\"(\"Name\", \"FoundingYear\", \"Logo\", \"Description\", \"FoundingLocation\", \"People\", \"Toys\", \"Sources\", \"SourceTitles\", \"CurrentOwner\", \"Website\", \"Live\", \"ClosingYear\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", 
		[company.name, company.foundingyear, company.logo, company.description, company.foundingLocation, company.people, company.toys, company.sources, company.sourceTitles, company.currentOwner, company.website, company.live, company.closingyear],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{
				console.log('companies row inserted');
			}
		}
	);
}

for(var i = 0; i < g_toys.length; i++)
{
	var toy = g_toys[i];
	query = client.query(
		"INSERT INTO public.\"Toys\"(\"Name\", \"Companies\", \"People\", \"Year\", \"Description\", \"Sources\", \"SourceTitles\", \"Live\", \"Image\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", 
		[toy.name, toy.companies, toy.people, toy.year, toy.description, toy.sources, toy.sourceTitles, toy.live, toy.image],
		function(err, result)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{
				console.log('toys row inserted');
			}
		}
	);
}
//console.log(g_toys);

query.on('end', function() {
	// client.end();
});

// query.on('end', function() {
	// query = client.query("SELECT * FROM \"People\"");

	// query.on('row', function(row) {
		// rows.push(row);
	// });

	// //console.log(rows);

	// query.on('end', function() {
		// for (var i = 0; i < rows.length; i++)
		// {
			// var row = rows[i];
			// for(var j = 0; j < row.Companies.length; j++)
			// {
				// var company = row.Companies[j];
				// if (companies.indexOf(company) == -1)
				// {
					// companies.push(company);
				// }
			// }
			// for(var j = 0; j < row.Toys.length; j++)
			// {
				// var toy = row.Toys[j];
				// if (toys.indexOf(toy) == -1)
				// {
					// toys.push(toy);
				// }
			// }
		// }

		// companies.sort();
		// toys.sort();
		
		// for(var i = 0; i < companies.length; i++)
		// {
			// companies[i] = {name:companies[i]};
		// }
		// for(var i = 0; i < toys.length; i++)
		// {
			// toys[i] = {name:toys[i]};
		// }

		// console.log(companies);
		// console.log(toys);

		// client.end();
	// });

// });

// client.end();

function getCellValue(address_of_cell)
{
	/* Find desired cell */
	var desired_cell = worksheet[address_of_cell];
	if(desired_cell)
	{
		if(desired_cell.v != "NA")
		{
			return desired_cell.v;
		}
		else
		{
			return null;
		}
	}
	else
	{
		return null;
	}
}

function getCellLink(address_of_cell)
{
	/* Find desired cell */
	var desired_cell = worksheet[address_of_cell];
	if(desired_cell && desired_cell.l)
	{
		return desired_cell.l.Target;
	}
	else
	{
		return null;
	}
}

function getCompanies(row)
{
	/* Find desired cell */
	var address_of_cell = "H" + row;
	var value = getCellValue(address_of_cell);
	console.log(value);
	if(value){
		return value.split("|");
	}
	else{
		return [];
	}
}

function getToys(row)
{
	var toys = [];
	var af = getCellValue("AF" + i);
	if(af)
	{
		var toy = {
			name: af,
			description: getCellValue("AG" + i),
			year: getCellValue("AH" + i),
			image: getCellLink("AI" + i),
			sources: [],
			sourceTitles: []
		}
		toys.push(toy);
	}
	var ak = getCellValue("AK" + i);
	if(ak)
	{
		var toy = {
			name: ak,
			description: getCellValue("AM" + i),
			year: getCellValue("AO" + i),
			image: getCellLink("AL" + i),
			sources: [],
			sourceTitles: []
		}
		var ap = getCellLink("AP" + i);
		if (ap)
		{
			toy.sources.push(ap);
			toy.sourceTitles.push(getCellValue("AP" + i));
		}
		var aq = getCellLink("AQ" + i);
		if (aq)
		{
			toy.sources.push(aq);
			toy.sourceTitles.push(getCellValue("AQ" + i));
		}
		var ar = getCellLink("AR" + i);
		if (ar)
		{
			toy.sources.push(ar);
			toy.sourceTitles.push(getCellValue("AR" + i));
		}
		var as = getCellLink("AS" + i);
		if (as)
		{
			toy.sources.push(as);
			toy.sourceTitles.push(getCellValue("AS" + i));
		}
		toys.push(toy);
	}
	var at = getCellValue("AT" + i);
	if(at)
	{
		var toy = {
			name: at,
			description: null,
			year: getCellValue("AW" + i),
			image: getCellLink("AU" + i),
			sources: [],
			sourceTitles: []
		}
		var ax = getCellLink("AX" + i);
		if (ax)
		{
			toy.sources.push(ax);
			toy.sourceTitles.push(getCellValue("AX" + i));
		}
		var ay = getCellLink("AY" + i);
		if (ay)
		{
			toy.sources.push(ay);
			toy.sourceTitles.push(getCellValue("AY" + i));
		}
		var az = getCellLink("AZ" + i);
		if (az)
		{
			toy.sources.push(az);
			toy.sourceTitles.push(getCellValue("AZ" + i));
		}
		var ba = getCellLink("BA" + i);
		if (ba)
		{
			toy.sources.push(ba);
			toy.sourceTitles.push(getCellValue("BA" + i));
		}
		toys.push(toy);
	}
	return toys;
}


function getSources(row)
{
	var sources = {links:[], titles:[]};	
	var g = getCellLink("G" + row);
	if(g)
	{
		sources.links.push(g);
		sources.titles.push("Obituary");
	}
	var m = getCellLink("M" + row);
	if(m)
	{
		sources.links.push(m);
		sources.titles.push(getCellValue("M" + row));
	}
	var n = getCellLink("N" + row);
	if(n)
	{
		sources.links.push(n);
		sources.titles.push(getCellValue("N" + row));
	}
	var o = getCellLink("O" + row);
	if(o)
	{
		sources.links.push(o);
		sources.titles.push(getCellValue("O" + row));
	}
	var p = getCellLink("P" + row);
	if(p)
	{
		sources.links.push(p);
		sources.titles.push(getCellValue("P" + row));
	}
	var q = getCellLink("Q" + row);
	if(q)
	{
		sources.links.push(q);
		sources.titles.push(getCellValue("Q" + row));
	}
	var r = getCellLink("R" + row);
	if(r)
	{
		sources.links.push(r);
		sources.titles.push(getCellValue("R" + row));
	}
	var aa = getCellLink("AA" + row);
	if(aa)
	{
		sources.links.push(aa);
		sources.titles.push(getCellValue("AA" + row));
	}
	var ab = getCellLink("AB" + row);
	if(ab)
	{
		sources.links.push(ab);
		sources.titles.push(getCellValue("AB" + row));
	}
	var ac = getCellLink("AC" + row);
	if(ac)
	{
		sources.links.push(ac);
		sources.titles.push(getCellValue("AC" + row));
	}
	var ad = getCellLink("AD" + row);
	if(ad)
	{
		sources.links.push(ad);
		sources.titles.push(getCellValue("AD" + row));
	}
	var ap = getCellLink("AP" + row);
	if(ap)
	{
		sources.links.push(ap);
		sources.titles.push(getCellValue("AP" + row));
	}
	var aq = getCellLink("AQ" + row);
	if(aq)
	{
		sources.links.push(aq);
		sources.titles.push(getCellValue("AQ" + row));
	}
	var ar = getCellLink("AR" + row);
	if(ar)
	{
		sources.links.push(ar);
		sources.titles.push(getCellValue("AR" + row));
	}
	var as = getCellLink("AS" + row);
	if(as)
	{
		sources.links.push(as);
		sources.titles.push(getCellValue("AS" + row));
	}
	var ax = getCellLink("AX" + row);
	if(ax)
	{
		sources.links.push(ax);
		sources.titles.push(getCellValue("AX" + row));
	}
	var ay = getCellLink("AY" + row);
	if(ay)
	{
		sources.links.push(ay);
		sources.titles.push(getCellValue("AY" + row));
	}
	var az = getCellLink("AZ" + row);
	if(az)
	{
		sources.links.push(az);
		sources.titles.push(getCellValue("AZ" + row));
	}
	var ba = getCellLink("BA" + row);
	if(ba)
	{
		sources.links.push(ba);
		sources.titles.push(getCellValue("BA" + row));
	}
	
	return sources;
}

function getCompanySources(row)
{
	var sources = {links:[], titles:[]};	
	var z = getCellLink("Z" + row);
	if(z)
	{
		sources.links.push(z);
		sources.titles.push(getCellValue("Z" + row));
	}
	var aa = getCellLink("AA" + row);
	if(aa)
	{
		sources.links.push(aa);
		sources.titles.push(getCellValue("AA" + row));
	}
	var ab = getCellLink("AB" + row);
	if(ab)
	{
		sources.links.push(ab);
		sources.titles.push(getCellValue("AB" + row));
	}
	var ac = getCellLink("AC" + row);
	if(ac)
	{
		sources.links.push(ac);
		sources.titles.push(getCellValue("AC" + row));
	}
	var ad = getCellLink("AD" + row);
	if(ad)
	{
		sources.links.push(ad);
		sources.titles.push(getCellValue("AD" + row));
	}
	var ae = getCellLink("AE" + row);
	if(ae)
	{
		sources.links.push(ae);
		sources.titles.push(getCellValue("AE" + row));
	}
	
	
	return sources;
}