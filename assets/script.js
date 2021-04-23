
function search_city(city_name="") {

    // get the city_name from the form
    if (city_name.length == 0) city_name = document.getElementById("city_name").value;

    // trim the city name (remove any leading or ending white-space)
    city_name = city_name.trim();
    
    // check for validity (length?)
    if(city_name.length == 0){
        alert("Please enter vaild city name");
        return;
    }

    // if valid, add to recent_searches array (avoid duplicates)
    if(recent_searches.indexOf(city_name)==-1){
        recent_searches.unshift(city_name);
        // drop off excess items XXXXXXXXXXX
        localStorage.setItem("recent_searches", JSON.stringify(recent_searches));
        display_recent_searches();
    }

    // call the API
    // look into calling api_key from environmental variables.... XXXXX
    api_key = "ec224d058f94a8fa98ac6d3ad76840e9";

    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${api_key}`;

    console.log("Searching for " + city_name);
    
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (results) {
        console.log(results);
        let html = "";
        let weather = results.list[0];
        html += `<p>Temperature: ${kelvin_to_fahrenheit(weather.main.temp)}</p>`;
        html += `<p>Humidity: ${weather.main.humidity}</p>`;
        document.getElementById("general").innerHTML = html;
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });

}

function kelvin_to_fahrenheit(k) {
    return Math.round((k - 273.15) * 1.8) + 32;
}

function display_recent_searches(){
    
    // Create an empty string variable
    let html = "<h3>Recent Searches</h3><ul>";

    // Loop through recent_searches and add each city to the string
    for (city of recent_searches) {
        html += `<li><a href="#" onclick="search_city('${city}'); return false;">${city}</a></li>`;
    }

    html += "</ul>";

    // Insert the string into the web page under the city search box
    document.getElementById("recent_searches").innerHTML = html;

}


let recent_searches = JSON.parse(localStorage.getItem("recent_searches"));
if (recent_searches == null) recent_searches = [];
display_recent_searches();
