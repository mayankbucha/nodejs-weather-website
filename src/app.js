const express = require('express')
const path = require('path')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public') 
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Mayank Bucha',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Mayank Bucha'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This site is used to provide weather info',
        title: 'Help',
        name: 'Mayank Bucha'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address',
        })
    }
    const address = req.query.address
    geocode(address, (error, data) => {
        if (error) {
            return res.send({
                error,
            })
        }

        forecast(data, (error, forecastData) => {
            if (error) {
                return res.send({
                    error,
                })
            }
            const timeZone = forecastData.split('Timezone')
            return res.send({
                forecast: timeZone[0],
                location: data.location,
                address: req.query.address,
                timezone: timeZone[1],
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term',
        })
    }

    console.log(req.query.search)
    res.send({
        products: [],
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mayank',
        errorMessage: 'Help article not found' 
    })
})

app.get('*', (req, res) => { 
    res.render('404', {
        title: '404',
        name: 'Mayank',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})