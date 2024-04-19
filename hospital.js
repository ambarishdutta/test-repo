const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let db = [{
    name: "Ambarish Dutta",
    kidneys: 2,
    good_kidney: 2,
    bad_kidney: 0
},
{
    name: "Utsav Kumar",
    kidneys: 2,
    good_kidney: 1,
    bad_kidney: 1
},
{
    name: "Ravi Anand",
    kidneys: 2,
    good_kidney: 0,
    bad_kidney: 2
},
{
    name: "Suman Mohanty",
    kidneys: 2,
    good_kidney: 2,
    bad_kidney: 0
}
]

app.get("/patient/:name", function(req, res){
    patient_name = req.params.name;
    for(let i=0; i<db.length; i++){
        if(db[i]["name"].toLowerCase().includes(patient_name.toLowerCase())){
            total_kidney = db[i]["kidneys"]
            good_kidney = db[i]["good_kidney"]
            bad_kidney = db[i]["bad_kidney"]
            res.status(200).send({"result":[{"Total number of kidneys": total_kidney},{"Healthy Kidney": good_kidney},{"Bad Kidney": bad_kidney}]})
        }
    }
})

app.post("/patient/add_kidney", function(req, res){
    console.log(req.body);
    patient_name = req.body["name"]
    kidney_toadd = req.body["kidney"]
    for(let i=0; i<db.length; i++){
        if(db[i]["name"].toLowerCase().includes(patient_name.toLowerCase())){
            db[i]["kidneys"] = db[i]["kidneys"] + kidney_toadd
            db[i]["good_kidney"] = db[i]["good_kidney"] + kidney_toadd
            res.status(201).send({"result":[{"Name": patient_name},{"Total number of kidneys": db[i]["kidneys"]},{"Healthy Kidney": db[i]["good_kidney"]},{"Bad Kidney": db[i]["bad_kidney"]}]})
        }
    }
})

app.put("/patient/replace_kidney", function(req, res){
    console.log(req.body);
    patient_name = req.body["name"]
    kidney_toReplace = req.body["kidney"]
    for(let i=0; i<db.length; i++){
        if(db[i]["name"].toLowerCase().includes(patient_name.toLowerCase())){
            if(db[i]["bad_kidney"] < 1){
                res.status(201).send({"msg": "There are no bad kidney to be replaced"})
            }
            else{
                while(db[i]["bad_kidney"] > 0 && kidney_toReplace >= 0){
                    db[i]["good_kidney"] = db[i]["good_kidney"] + 1
                    db[i]["bad_kidney"] = db[i]["bad_kidney"] - 1
                    kidney_toReplace = kidney_toReplace - 1
                }
                res.status(201).send({"result":[{"Name": patient_name},{"Total number of kidneys": db[i]["kidneys"]},{"Healthy Kidney": db[i]["good_kidney"]},{"Bad Kidney": db[i]["bad_kidney"]}]})
            }
            
        }
    }
})

app.delete("/patient/delete_kidney", function(req, res){
    console.log(req.body);
    patient_name = req.body["name"]
    good_kidney_delete = req.body["good_kidney"]
    bad_kidney_delete = req.body["bad_kidney"]
    let badmsg = ""
    let goodmsg = ""
    for(let i=0; i<db.length; i++){
        if(db[i]["name"].toLowerCase().includes(patient_name.toLowerCase())){
            console.log(good_kidney_delete);
            if(bad_kidney_delete > 0 && db[i]["bad_kidney"] < 1){
                // if (bad_kidney_delete > 0){
                    // res.status(201).send({"msg": "There are no bad kidney to be remove"})
                    badmsg = "There are no bad kidney to be remove"
                // }
            }
            else if(good_kidney_delete > 0 && db[i]["good_kidney"] < 1){
                // else{
                    // res.status(201).send({"msg": "There are no good kidney to be remove"})
                    console.log("Inside else");
                    goodmsg = "There are no good kidney to be remove"
                // }        
            }
            // else{
            let final_msg = ""
                while(db[i]["bad_kidney"] > 0 && bad_kidney_delete >= 0){
                    db[i]["bad_kidney"] = db[i]["bad_kidney"] - 1
                    db[i]["kidneys"] = db[i]["kidneys"] - 1
                    bad_kidney_delete = bad_kidney_delete - 1
                    badmsg = req.body["bad_kidney"] + " Bad kidneys removed"
                }
                while(db[i]["good_kidney"] > 0 && good_kidney_delete >= 0){
                    db[i]["good_kidney"] = db[i]["good_kidney"] - 1
                    db[i]["kidneys"] = db[i]["kidneys"] - 1
                    good_kidney_delete = good_kidney_delete - 1
                    goodmsg = req.body["good_kidney"] + " Good kidneys removed"
                }
            console.log(badmsg.length);
            if(badmsg.length > 1){
                final_msg = badmsg + " and " + goodmsg
            }
            else{
                final_msg = badmsg + goodmsg
            }
            
            res.status(201).send({"result":[{"Message": final_msg},{"Name": patient_name},{"Total number of kidneys": db[i]["kidneys"]},{"Healthy Kidney": db[i]["good_kidney"]},{"Bad Kidney": db[i]["bad_kidney"]}]})
            // }
            
        }
    }
})

app.listen(3000)