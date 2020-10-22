const http = require("http");
const csv = require("csvtojson");
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let path = require('path');

let students = [];

const converter=csv()
    .fromFile('./students.csv')
    .then((json)=>{
        let s;
        json.forEach((row)=>{
            s={}; // New Student, Array Object
            Object.assign(s,row);// Assign json to the new Student Object
            students.push(s);// Add Json Object to the Array
        });
    });

function studentSorterDesc(a, b) {
    return (Number(b.MathGrade)+Number(b.EnglishGrade)+Number(b.PEGrade)+Number(b.Programming))/4 - (Number(a.MathGrade)+Number(a.EnglishGrade)+Number(a.PEGrade)+Number(a.Programming))/4;
}

function studentSorterAsc(b, a) {
    return studentSorterDesc(a,b);
}


let app = express();

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function (request, response){
    response.render('index', {
        title: "Students Info",
        students : students
    });
});

app.get('/desc', (request, response)=>{
    response.render('index', {
        title: "Students Info",
        students : students.sort(studentSorterDesc)
    });
});

app.get('/asc', function (request, response){
    response.render('index', {
        title: "Students Info",
        students : students.sort(studentSorterAsc)
    });
});

const server = http.createServer(app);

server.listen(3000, function (){
    console.log("Listening to 3000");
});

