function parseTextInput(text)
{
	return text == "" ? null : text;
}

function parseArrayInput(list)
{
    var values = [];
    for (var i = 0; i < list.length; i++)
    {
        values.push("\"" + parseTextInput(list[i].value) + "\"");
    }
    var string = "{" + values.toString() + "}";
    return string;
}

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}