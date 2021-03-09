const express = require('express');


const server = express();

server.listen(5000, ()=>{
    console.log('Listening on express server');
});