window.onload = main;

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
			//g_data = data;
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
    htmlString += "<h1>" + name + "</h1>";
    
    htmlString += data.BirthYear + " - ";
    if(data.DeathYear)
    {
        htmlString += data.DeathYear;
    }
    else
    {
        htmlString += "Present";
    }
    htmlString += "<br />";
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
    if(data.Picture)
    {
        htmlString += "<img src='" + data.Picture + "' alt='" + name + "' /><br />";
    }
    
    console.log(htmlString);
    document.getElementById("infoContainer").innerHTML = htmlString;
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