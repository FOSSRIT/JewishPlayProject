window.onload = main

function main()
{
    document.getElementById("searchButton").onclick = function() 
    {
        var pName = document.getElementById("personName").value;
        var tName = document.getElementById("toyName").value;
        var cName = document.getElementById("companyName").value;
        
        if(pName != "")
        {
            console.log("person");
            window.location.href = "./browse?category=people&name=" + pName;
        }
        else if (tName != "")
        {
            console.log("toy");
            window.location.href = "./browse?category=toys&name=" + tName;
        }
        else if (cName != "")
        {
            console.log("company");
            window.location.href = "./browse?category=companies&name=" + cName;
        }
        else
        {
            console.log("error");
        }
    }
}