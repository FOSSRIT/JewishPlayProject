window.onload = main

function main()
{
    document.getElementById("searchButton").onclick = function() 
    {
        var pFristName = document.getElementById("firstName").value;
        var pLastName = document.getElementById("lastName").value;
        var tName = document.getElementById("toyName").value;
        var cName = document.getElementById("companyName").value;
        
        if(pFristName != "" || pLastName != "")
        {
            console.log("person");
            window.location.href = "./display/people?firstName=" + pFristName + "&lastName=" + pLastName;
        }
        else if (tName != "")
        {
            console.log("toy");
            window.location.href = "./display/toys?name=" + tName;
        }
        else if (cName != "")
        {
            console.log("company");
            window.location.href = "./display/companies?name=" + cName;
        }
        else
        {
            console.log("error");
        }
    }
}