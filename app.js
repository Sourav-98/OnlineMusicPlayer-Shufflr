const express = require('express');
//const request = require('request');
const app = express();


app.use(express.static('public'));
app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/views/index.html');
});

app.listen(8080);

