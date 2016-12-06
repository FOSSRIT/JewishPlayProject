/*============================
// Jewish Play Project
// submitEntry.html Javascript
============================*/

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