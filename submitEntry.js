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
			container.innerHTML = "<input type='text' class='" + parentID + "' id='" + parentID + "_" + nextIndex + "' index=" + nextIndex + "></input><button id='" + parentID + "DeleteRow_" + nextIndex + "' index=" + nextIndex + ">X</button><br />";
			
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
			wrapper.appendChild(container);
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
        
	}
	else if(type == 'companies')
    {
        
	}
	else if(type == 'toys')
    {
        
	}
}