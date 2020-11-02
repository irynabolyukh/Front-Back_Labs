const http = require("http");
const csv = require("csvtojson");
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let path = require('path');

class Student{

    averageGrade(){
        return (Number(this.Programming) + Number(this.MathGrade) + Number(this.PEGrade) + Number(this.EnglishGrade)) / 4;
    }
}

let students = [];

const converter=csv()
    .fromFile('./students.csv')
    .then((json)=>{
        let s;
        json.forEach((row)=>{
            s = new Student(); // New Student
            Object.assign(s,row);// Assign json to the new Student Object
            students.push(s);// Add Student Object to the Array
        });
        console.log(students);
    });

function studentSorterDesc(a, b) {
    return b.averageGrade() - a.averageGrade();
}

function studentSorterAsc(a, b) {
    return a.averageGrade() - b.averageGrade();
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

