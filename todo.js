const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs")
const path = require("path");
const { log } = require("console");

const app = express();
app.use(bodyParser.json());

function findTodo(id, todos){
    console.log("Length: ", todos);
    console.log("ID: ", id, typeof id);
    for(let i=0; i<todos.length; i++){
        console.log("id: ", todos[i]["id"], typeof todos[i]["id"]);
        if(todos[i]["id"] == parseInt(id)){
            console.log("Inside if: ", todos[i]);
            return [todos[i]]
        }
    }
    return []
}

function updateTodo(id, todos, toUpdateData){
    for(let i=0; i<todos.length; i++){
        console.log("id: ", todos[i]["id"], typeof todos[i]["id"]);
        if(todos[i]["id"] == parseInt(id)){
            // console.log("Inside if: ", todos[i]);
            for(key in toUpdateData){
                todos[i][key] = toUpdateData[key]
            }
            return [todos[i]]
        }
    }
    return []
}

app.get("/todos", function(req, res){
    fs.readFile("todo.json", "utf-8", function(err, data){
        if(err){
            res.status(400).send({"error": "Something went wrong"})
        }
        res.status(200).json(JSON.parse(data))
    })
})

app.get("/todos/:id", function(req, res){
    id = req.params.id
    fs.readFile("todo.json", function(err, data){
        getData = findTodo(id, JSON.parse(data))
        if(getData.length > 0){
            res.status(200).json(getData[0])
        }
        else{
            res.status(404).send({"message": "Not Found"})
        }
    })
})

app.post("/todos", function(req, res){
    const newTodo = {
        id: Math.floor(Math.random() * 1000000), // unique random id
        title: req.body.title,
        description: req.body.description,
        completed: false
    }
    fs.readFile("todo.json", "utf-8", function(err, data){
        console.log(data.length);
        let todos;
        todos = JSON.parse(data);
        todos.push(newTodo);
        fs.writeFile("todo.json", JSON.stringify(todos), (err) => {
            if (err) {
              res.status(400).send({"err": "Something went wrong"});
            }
            // console.log('Data has been written to', filePath);
            res.status(201).json(newTodo)
          });
    })
    
})

app.put("/todos/:id", function(req, res){
    console.log(req.body);
    id = req.params.id
    fs.readFile("todo.json", "utf-8", function(err, data){
        todos = JSON.parse(data);
        updatedData = updateTodo(id, todos, req.body)
        todos = todos.filter(obj => obj.id != id);
        finalData = updatedData.concat(todos)
        if(updatedData.length > 0){
            fs.writeFile("todo.json", JSON.stringify(finalData), (err) => {
                if (err) {
                    res.status(400).send({"err": "Something went wrong"});
                }
                res.status(200).json(updatedData);
            })
        }
        else{
            res.status(404).send("Todo item not found");
        }
    })
})

app.delete("/todos/:id", function(req, res){
    id = req.params.id
    fs.readFile("todo.json", "utf-8", function(err, data){
        todos = JSON.parse(data);
        let found = false
        for(let i=0; i<todos.length; i++){
            if(todos[i]["id"] == parseInt(id)){
                found = true
                break;
            }
        }
        console.log(found);
        if(found){
            todos = todos.filter(obj => obj.id != id);
            fs.writeFile("todo.json", JSON.stringify(todos), (err) => {
                if (err){
                    res.status(400).send({"err": "Something went wrong"});
                }
                res.status(200).send({"message": "Item deleted!!"});
            })
        }
        else{
            res.status(404).send({"message": "Item not found!!"});
        }
        
        
    })
})

app.listen(3000)