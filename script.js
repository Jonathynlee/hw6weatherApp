var apiKey = "6a7d7521f9a9fb64bd921d8e65e90922";
var currentCitiesArr;
var searchResult;
var currentDate = moment().format('L');
console.log("Current date is: "+currentDate);
var currentCityData = {};
jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

if (localStorage["weatherCities"]) {
    currentCitiesArr = JSON.parse(localStorage.weatherCities);
    console.log(currentCitiesArr);
    renderCities();
} else {
    currentCitiesArr = [];
}

function addCity(){
    searchResult = $("#searchBar").val().split(" ").join("_").toUpperCase();
    
if (currentCitiesArr.indexOf(searchResult) == -1){
    var baseUrl = "http://api.openweathermap.org/data/2.5/forecast?APPID=6a7d7521f9a9fb64bd921d8e65e90922&q="//{city name}
    $.ajax({
    url:baseUrl+searchResult.split("_").join(" "),
    success:function(){
    var value  = $("#searchBar").val().split(" ").join("_");
    
    currentCitiesArr[currentCitiesArr.length] = value.toUpperCase();
    localStorage["weatherCities"] = JSON.stringify(currentCitiesArr)
    renderCities();
   
    },
    error:function(){
        alert("Please Insert a Proper City");
    }
})
}else{
    $("#"+searchResult.toUpperCase()).click();
}
}

function renderCities() {
    if (currentCitiesArr.length > 0) {
        $("#savedCities").html("");
        for (i = 0; i < currentCitiesArr.length; i++) {
            var button = $("<button class = 'cityButton'  id='"+currentCitiesArr[i]+"'>"+currentCitiesArr[i].split("_").join(" ")+"</button>")
            button.on("click", showCityData);
            var xButton = $("<button class = 'redX' onclick='deleteCity()'>X</button>")
            xButton.on('click',deleteCity);
            button.append(xButton);
            $("#savedCities").append(button);
            if(searchResult!=undefined && searchResult!=null){
                $("#"+searchResult.toUpperCase()).click();
            }
        }
    }else {
        $("#savedCities").html("");
    }
}

//indexOf
//$(".searchBar")
/////////// Display data to weather Area ///////////
function displayData(){

}
function deleteCity(event){
    var thisObject = event.target;
    console.log(thisObject);
    var thisParent = thisObject.parentElement.getAttribute("id");
    console.log(thisParent);
    var numberInArray = currentCitiesArr.indexOf(thisParent);
    console.log(numberInArray)
    currentCitiesArr.splice((numberInArray),1);
    renderCities();
    localStorage["weatherCities"] = JSON.stringify(currentCitiesArr);
    
}

function showCityData(event){

    var currentObj = event.target;
    var thisCity = currentObj.getAttribute("id");
    console.log(thisCity)

    //Append City to main box
  

//AJAX CALL FOR WEATHER API
baseUrl = "http://api.openweathermap.org/data/2.5/forecast?APPID=6a7d7521f9a9fb64bd921d8e65e90922&q="//{city name}

$.ajax({
    url:baseUrl+thisCity.split("_").join(" "),
    success:function(response){
        console.log(response);
        currentCityData = response;
        var cityLon = response.city.coord["lon"];
        console.log(cityLon);
        var cityLat = response.city.coord["lat"];
        console.log(cityLat)
        var dateNum = []
        $("#cityDate").html("<h2>"+response.city.name+"("+currentDate+")<img src='http://openweathermap.org/img/wn/"+response.list['0'].weather['0'].icon+".png'></h2>");
        $("#temperature").html("<p>Temperature: "+Math.round((((parseInt(response.list["0"].main.temp)-273.15)*(9/5))+32))+" F</p>");
        $("#humidity").html("<p> Humidity: "+response.list["0"].main.humidity+"%</p>");
        $("#windSpeed").html("<p> Wind Speed: "+response.list["0"].wind.speed+"MPH</p>");
        //$("#UVIndex").html("<p>UV Index: "+response.list["0"].main.+"</p>");
        for (i=0;i<5;i++){
            dateNum[i] = response.list[""+i].dt;
           
        $("#"+(i+1)).html("<h3>"+moment().add((i+1), 'days').format('L'))
        $("#"+(i+1)).append("<img src='http://openweathermap.org/img/wn/"+response.list[""+(i+1)].weather['0'].icon+".png'>")
        $("#"+(i+1)).append("<p>Temp: "+Math.round((((parseInt(response.list[""+(i+1)].main.temp)-273.15)*(9/5))+32))+" F</p>")
        $("#"+(i+1)).append("<p> Humidity: "+response.list[""+(i+1)].main.humidity+"%</p>")
        //UVINDEX
        
        }
        //Forecast
        $.ajax({
            
            url:"http://api.openweathermap.org/data/2.5/uvi/forecast?appid=6a7d7521f9a9fb64bd921d8e65e90922&lat="+cityLat+"&lon="+cityLon,
            success:function(response){
                console.log(response)

            }
        })
        $.ajax({
            
            url:"http://api.openweathermap.org/data/2.5/uvi?appid=6a7d7521f9a9fb64bd921d8e65e90922&lat="+cityLat+"&lon="+cityLon,
            success:function(response){
                console.log(response)
                $("#UVBox").html(response.value);
                if(response.value<3){
                    $("#UVBox").css("background-color","#96CC00")
                    $("#UVBox").css("color","#000000");
                    
                }else if(response.value>=3&&response.value<6){
                    console.log("test")
                    $("#UVBox").css("background-color","#FFFF00")
                    $("#UVBox").css("color","#000000");
                }else if(response.value>=6&&response.value<8){
                    $("#UVBox").css("background-color","#FF9928")
                    $("#UVBox").css("color","#000000");
                }else if(response.value>=8&&response.value<11){
                    $("#UVBox").css("background-color","#FF0000")
                    $("#UVBox").css("color","#FFFFFF");
                }else{
                    $("#UVBox").css("background-color","#BA00C0")
                    $("#UVBox").css("color","#FFFFFF");
                }

            }
        })
    }

})
}

