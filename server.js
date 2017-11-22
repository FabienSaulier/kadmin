const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()

app.use(serveStatic(path.join(__dirname, 'dist')));
console.log(process.env.PORT);
const port = process.env.PORT || 5000
app.listen(3000, () => console.log('Example app listening on port :'+port))
