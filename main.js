var htmlButton = document.querySelector("#get-forecast");

var elementForecastText = document.getElementById("forecast-text");

document.addEventListener("DOMContentLoaded", function () {
  GetCoords();
});

function GetCoords() {
  const status = document.querySelector("#status");

  // function success(position) {
  //   status.textContent = "";
  //   RequestLocation(position.coords.latitude, position.coords.longitude);
  // }

  // function error() {
  //   status.textContent = "Unable to retrieve your location";
  // }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        status.textContent = "";
        RequestLocation(position.coords.latitude, position.coords.longitude);
      },

      () => {
        status.textContent = "Unable to retrieve your location";
      }
    );
  }
}

async function RequestLocation(latitude, longitude) {
  let jdata;
  try {
    const response = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`
    ); //Url
    jdata = await response.json();
    console.log(jdata);
    ReturnLocation(jdata);
  } catch (error) {
    console.log("fetch error: ", error);
  }

  console.log("----data----");
  console.log(jdata);
} //END FUNCTION

function ReturnLocation(jdata) {
  //GET THE WEATHER FROM THE RESPONSE TEXT
  let properties = jdata.properties;
  let office = properties.gridId;
  let gridX = properties.gridX;
  let gridY = properties.gridY;
  RequestForecast(office, gridX, gridY);
} //END FUNCTION

async function RequestForecast(office, gridX, gridY) {
  try {
    const response = await fetch(
      `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`
    ); //Url
    const jdata = await response.json();
    console.log(jdata);
    ReturnForecast(jdata);
  } catch (error) {
    console.log("fetch error: ", error);
  }
} //END FUNCTION

function ReturnForecast(jdata) {
  //GET THE WEATHER FROM THE RESPONSE TEXT
  let properties = jdata.properties;
  // let forecast = properties.periods[0];
  // let message = forecast.detailedForecast;

  // elementForecastText.innerHTML = message;
  // let forecastString = "";

  for (var period in properties.periods) {
    // let daytime = properties.periods[period].daytime; //boolean
    let name = properties.periods[period].name; //string
    let short = properties.periods[period].shortForecast; //string
    let detailed = properties.periods[period].detailedForecast;
    let temp = properties.periods[period].temperature;
    let icon = properties.periods[period].icon;

    let l = document.getElementById("flist");

    var li = document.createElement("li");
    l.appendChild(li);

    let div = document.createElement("div");
    div.setAttribute("class", "icon-container");
    li.appendChild(div);

    let img = new Image();
    img.src = icon;
    img.setAttribute("class", "icon");
    img.setAttribute("alt", `${short}`);
    div.appendChild(img);
    div.backgroundImage = img;

    div.innerHTML += `<h4>${name}<h4/>`;

    let p1 = document.createElement("p");
    p1.className = "period";
    p1.innerHTML = `${detailed}`;
    div.appendChild(p1);

    // var element = document.getElementById("icon-container");
    // element.style.backgroundImage = img;

    // var element = document.getElementById("icon-container");
    // style = window.getComputedStyle(element);
    // iconbackground = style.getPropertyValue("background-image");
    // iconbackground = img;
  }
}
