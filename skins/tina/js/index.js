// Inspired by: https://codepen.io/Jackthomsonn/pen/VedzwX?editors=1010

(function() {
  
  var location = $('.js-location')
  
  function init() {
    
    var currentLocation = location.val()
      , locationData
    
    if (currentLocation === 'default') {
      locationData = 'http://ip-api.com/json' // User location data
    } else {
      locationData = 'http://api.openweathermap.org/data/2.5/weather?q=' + currentLocation + '&appid=44db6a862fba0b067b1930da0d769e98' // Custom location data
    }
    
    $.getJSON(locationData, function(data) {
      var lat
        , lon
      
      if (currentLocation === 'default') {
        lat = data.lat
        lon = data.lon
      } else {
        lat = data.coord.lat
        lon = data.coord.lon
      }
      
      $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=44db6a862fba0b067b1930da0d769e98', function(data) {
        var temperature = Math.round(((data.main.temp) - 273.15))
          , description = data.weather[0].description
          , iconCode = data.weather[0].id
          , weatherDescription = description.charAt(0).toUpperCase() + description.slice(1)
          , date
          , time
        
        if (currentLocation === 'default') {
          date = moment().format('ddd DD, MMM')
          time = moment().format('HH:mm')
          $('.location__name').html(data.name)
        } else {
          date = moment.tz(currentLocation).format('ddd DD, MMM')
          time = moment.tz(currentLocation).format('HH:mm')
        }
        
        $('.location__date').html(date)
        $('.location__time').html(time)
        $('.weather__temperature').html(temperature + '°')
        $('.weather__description').html(weatherDescription)
        
        var timeInt = parseInt(time, 10)
          , body = $('#faux-body')
          , icon = $('.weather__icon')
        
        body.removeClass().addClass(getTimeClass(timeInt))
        icon.html(getWeatherIcon(iconCode, getTimeClass(timeInt)))
        
        function getTimeClass(i) {
          if (i >= 7 && i < 9) return 'dawn'
          if (i >= 9 && i < 12) return 'morning'
          if (i >= 12 && i < 15) return 'noon'
          if (i >= 15 && i < 17) return 'afternoon'
          if (i >= 17 && i < 19) return 'dusk'
          if (i >= 19 && i < 21) return 'evening'
          if (i >= 21 && i <= 24 || i >= 0 && i < 7) return 'night'
        }

        function getWeatherIcon(i, time) {
          if (i >= 200 && i <= 232) return 'flash_on' // Thunder
          if (i >= 300 && i <= 531) return 'invert_colors' // Rain/drizzle
          if (i >= 600 && i <= 622) return 'ac_unit' // Snow
          if (i >= 700 && i <= 781) return 'grain' // Atmosphere
          if (i >= 801 && i <= 804) return 'cloud' // Clouds
          if (i >= 900 && i <= 906) return 'warning' // Extreme
          if (i >= 951 && i <= 962) return 'toys' // Windy
          if (i === 800) {
            if (time === 'evening')  return 'brightness_3' // Clear evening 
            else if (time === 'night') return 'brightness_2' // Clear night
            else return 'wb_sunny' // Clear daytime
          }
        }
      })
    })
    setTimeout(init, 500000) // Set high to stop millions of requests
  }
  init()
  
  location.change(function() {
    init()
  })
})()