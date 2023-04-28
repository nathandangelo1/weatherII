var htmlButton = document.querySelector("#get-forecast");

var elementForecastText = document.getElementById("forecast-text");

document.addEventListener("DOMContentLoaded", function () {
  GetCoords();
});
// Step 1: Use geolocation js code (navigator.geolocation.getCurrentPosition() )
// Step 2: Send latitude and logitude from js code to https://api.weather.gov/points/{latitude},{longitude} using
//      a get request similar to the one below
// Step 3: Get the office, gridX, and gridY from step 2
// Step 4: Plug this info into RequestForecast()

function GetCoords() {
  const status = document.querySelector("#status");

  navigator.geolocation.getCurrentPosition(function (position) {
    RequestLocation(position.coords.latitude, position.coords.longitude);
  });

  // function success(position) {
  //   status.textContent = "";
  //   // const latitude = Math.round(position.coords.latitude * 10000) / 10000;
  //   // const longitude = Math.round(position.coords.longitude * 10000) / 10000;
  //   RequestLocation(position.coords.latitude, position.coords.longitude);
  // }

  // function error() {
  //   status.textContent = "Unable to retrieve your location";
  // }

  // if (!navigator.geolocation) {
  //   status.textContent = "Geolocation is not supported by your browser";
  // } else {
  //   status.textContent = "Locating…";
  //   navigator.geolocation.getCurrentPosition(success, error);
  // }
}

function RequestLocation(latitude, longitude) {
  let ajax = new XMLHttpRequest(); //Asynchronous JavaScript And Xml
  let requestMethod = "GET"; //Give me data
  let requestUrl = `https://api.weather.gov/points/${latitude},${longitude}`; //Url

  let requestIsAsyncronous = true; //dont hold up wepage when waiting response

  //SEND AJAX REQUEST TO THE URL
  ajax.open(requestMethod, requestUrl, requestIsAsyncronous); //ajax.open(method, url, async)

  //SET CALLBACK FUNCTION (this function gets called automatically when the response gets back) ***
  ajax.onreadystatechange = ReturnLocation;

  //SEND REQUEST
  var data = ajax.send();

  console.log("----data----");
  console.log(data);
} //END FUNCTION

function ReturnLocation() {
  var responseStatusOk = this.status === 200; //STATUS 200 means OK
  var responseComplete = this.readyState === 4; //readyState 4 means response is ready

  if (responseStatusOk && responseComplete) {
    //PARSE THE RESPONSE - convert values to JSON
    let responseData = JSON.parse(this.responseText);

    //GET THE WEATHER FROM THE RESPONSE TEXT
    let properties = responseData.properties;
    let office = properties.gridId;
    let gridX = properties.gridX;
    let gridY = properties.gridY;
    RequestForecast(office, gridX, gridY);
    // elementForecastText.innerHTML = properties;
  } else {
    //SOMETHING WENT WRONG
    console.log(this);
  } //end if
} //END FUNCTION

function RequestForecast(office, gridX, gridY) {
  let ajax = new XMLHttpRequest(); //Asynchronous JavaScript And Xml
  let requestMethod = "GET"; //Give me data
  let requestUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`; //Url

  let requestIsAsyncronous = true; //dont hold up wepage when waiting response

  //SEND AJAX REQUEST TO THE URL
  ajax.open(requestMethod, requestUrl, requestIsAsyncronous); //ajax.open(method, url, async)

  //SET CALLBACK FUNCTION (this function gets called automatically when the response gets back) ***
  ajax.onreadystatechange = ReturnForecast;

  //SEND REQUEST
  var data = ajax.send();

  console.log("----data----");
  console.log(data);
} //END FUNCTION

function ReturnForecast() {
  var responseStatusOk = this.status === 200; //STATUS 200 means OK
  var responseComplete = this.readyState === 4; //readyState 4 means response is ready

  if (responseStatusOk && responseComplete) {
    //console.log(this.responseText.properties); //debug

    //PARSE THE RESPONSE - convert values to JSON
    let responseData = JSON.parse(this.responseText);

    //GET THE WEATHER FROM THE RESPONSE TEXT
    let properties = responseData.properties;
    let forecast = properties.periods[0];
    let message = forecast.detailedForecast;

    elementForecastText.innerHTML = message;
  } else {
    //SOMETHING WENT WRONG
    console.log(this); //end if
  } //END FUNCTION
}
