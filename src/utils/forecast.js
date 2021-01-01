const request = require("request")

const forecast = ({latitude:lat, longitude:long}, callback) => {
    const url = "https://api.darksky.net/forecast/340b5d6850f2ffa7d87a58ff6590c8e7/"+ encodeURIComponent(lat) + "," + encodeURIComponent(long) + "?units=si"
    request({url, json: true}, (error, {body}) => {
        if(error) {
            callback("Unable to connect to weather service!", undefined)
        } 
        else if(body.error) {
            callback("Unable to find location", undefined)
        } 
        else {
            callback(undefined, 
                body.daily.data[0].summary + ` It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain.`,
            )
        }
    })
}

module.exports = forecast