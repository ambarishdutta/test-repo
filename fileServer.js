const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json())

app.get("/files", function(req, res){
    let resArr = []
    fs.readdir(path.join(__dirname, './files/'), (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve files' });
        }
      
        // Log the list of files in the directory
        console.log('Files in the directory:');
        files.forEach(file => {
          console.log(file);
          resArr.push(file)
        });
        res.status(200).send({"result": resArr})
      });
    // res.status(200).send({"result": resArr})
})

app.get("/file/:filename", function(req, res){
    filename_r = req.params.filename
    let pathe = './files/' + filename_r
    console.log(pathe);
    fs.readFile(path.join(__dirname, pathe), "utf-8", function(err, data){
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(200).json(data)
    })
})

app.listen(3000);