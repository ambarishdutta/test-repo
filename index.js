const express = require("express")
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.json());

function sumNumberN(n){
    let sum = 0;
    for(let i = 0; i<=n; i++){
        sum = sum + i
    }
    return sum;
}

app.get("/", function(req, res){
    n = req.query.n;
    ans = sumNumberN(n);
    res.status(200).send({"message": "The result is " + ans})
})

app.listen(3000)