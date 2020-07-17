const express = require('express');
//const request = require('request');
const app = express();


app.use(express.static(__dirname+'/public'));
app.get('/', (req, res)=>{
    console.log(req);
    res.sendFile(__dirname+'/views/index.html');
});

app.listen(8080, 'localhost');

