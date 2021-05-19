
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

    url1 = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${api_key}`;
 
    console.log("Fetching " + url1);
    
    fetch(url1)
    .then(function (response) {
        return response.json();
    })
    .then(function (results) {
        console.log(results);

        let lat = results.city.coord.lat;
        let lon = results.city.coord.lon;
        url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${api_key}`;
        console.log ("Fetching: " + url2);
        fetch(url2)
        .then(function (response2) {
            return response2.json();
        })
        .then(function (results2) {
            console.log(results2);
            let current = results2.current; // temp (K), humidity, uvi, wind_speed
            let daily = results2.daily; // numerically-indexed array of objects/dictionaries
            // temp.day (K), humidity, uvi, wind_speed

            let html = `<h2>Current Weather for ${results.city.name}</h2>`;
            //let weather = results.list[0];
            html += `<p>Temperature: ${kelvin_to_fahrenheit(current.temp)}</p>`;
            html += `<p>Humidity: ${current.humidity}</p>`;
            html += `<p>Wind Speed: ${current.wind_speed}</p>`;

            let uvi_color;
            if (current.uvi < 3) {
                uvi_color = "green"; 
            } else if (current.uvi < 6) {
                uvi_color = "yellow";
            } else if (current.uvi < 8){
                uvi_color = 'orange';
            } else if (current.uvi < 11){
                uvi_color = 'red';
            } else { 
                uvi_color = 'violet'; 
            } 

            html += `<p>UV Index: <span style="background-color:${uvi_color}">${current.uvi}</span></p>`;

            html += "<h3>Five Day Forecast</h3>";

            html += "<div class='flex_container'>\n";

            for (let i=1; i<=5; i++) {
                let data = daily[i];
                let _date = new Date(data.dt*1000);
                console.log(data.dt);
                let y = _date.getFullYear();
                let m = _date.getMonth() + 1;
                let d = _date.getDate();
                let src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                html += "<div>\n";
                html += `<p>${m}/${d}/${y}</p>`;
                html += `<p><img src="${src}"></p>`;
                html += `<p>Temp: ${kelvin_to_fahrenheit(data.temp.day)}</p>`;
                html += `<p>Hum: ${data.humidity}</p>`;
                html += `<p>Wind: ${data.wind_speed}</p>`;
                html += `<p>UV: ${data.uvi}</p>`;
                html += "</div>\n";
            }

            html += "</div>\n";


            /*
            html += "<table>\n";
            html += "<tr><th>-</th>";
            for (let i=1; i<=5; i++) {
                html += `<th>Day ${i}</th>`;
            }
            html += "</tr>\n";

            // Loop through each parameter (temp, humidity, etc.)
            let param_names = ['Temperature','Humidity','Wind Speed','UV Index'];
            // For each parameter, construct the row
            for (param of param_names) {
                html += `<tr><td>${param}</td>\n`;  // XXXXX
                for (let i=1; i<=5; i++) {
                    let data = daily[i];
                    html += "<td>XXX</td>\n";
                }
                html += "</tr>\n";
            }
            html += "</table>\n";
            */


            document.getElementById("general").innerHTML = html;
        });
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
