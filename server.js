'use strict';
var express = require('express');
var path = require('path');
var https = require('https');
var body = require('body-parser');
var PORT = process.env.PORT || 9000;
var app = express();
app.use(body());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', function(req, res) {
    res.render('index',{check: false});
});
app.get('/mainaj', function(req, res) {
    res.render('mainaj',udata);
});
app.get('/main', function(req, res) {
    res.render('index',{check: false});
});
app.get('/home', function(req, res) {
    res.render('main2',udata);
});
app.get('/homeaj', function(req, res){
    res.render('mainaj2',udata);
})
app.get('/main/register', function(req, res) {
    res.render('register.ejs',udata);
});
app.get('/main/withdrawn', function(req, res) {
    res.render('withdrawn.ejs', udata);
});
app.get('/main/resign', function(req, res) {
    res.render('quit.ejs', udata);
});
app.get('/main/data', function(req, res) {
    res.render('data.ejs', udata);
});
app.get('/main/contact', function(req, res) {
    res.render('contact.ejs', udata);
});
app.get('/main/checkStatus', function(req, res) {
    res.render('checkStatus.ejs', udata);
});
app.get('/mainaj/data', function(req, res) {
    res.render('dataaj.ejs', udata);
});
app.get('/mainaj/listRegister', function(req, res) {
    res.render('listRegister.ejs', udata);
});
app.get('/mainaj/listResign', function(req, res) {
    res.render('quitmem.ejs', udata);
});
app.get('/mainaj/listW', function(req, res) {
    res.render('withdrawreport.ejs', udata);
});
app.get('/mainaj/save-page1', function(req, res) {
    res.render('report.ejs', udata);
});
app.get('/mainaj/save-page2', function(req, res) {
    res.render('report1.ejs', udata);
});
app.get('/mainaj/message', function(req, res) {
    res.render('message.ejs', udata);
});
app.get('/mainaj/contact', function(req, res) {
    res.render('contact2.ejs', udata);
});
app.get('/main/withdrawn/confirm', function(req, res) {
    res.render('confirm', udata);
});
app.get('/main/resign/confirm', function(req, res) {
    res.render('confirm', udata);
});
app.get('/main/registern/confirm', function(req, res) {
    res.render('confirm', udata);
});
app.get('/mainaj/report-page2/confirm', function(req, res) {
    res.render('confirmaj', udata);
});

var udata;

app.post('/main', function(req, res) {
    var data = {
        'username': req.body.apiUser,
        'password': req.body.apiPass
    }
    console.log(data);
    console.log(tuApi(data));
    async function main() {
        try {
            var userInfo = await tuApi(data);
            console.log(userInfo);
            udata = userInfo;
            if (userInfo.status == true) {
                if (userInfo.type != "student") {
                    res.render('mainaj', udata);
                }
                res.render('main', udata);
            } else {
                res.render('index', {check: true});
                console.log('wrong data');
            }
        } catch (error) {
            console.log(error);
        }
    }
    main();
});
var withdrawnInfo;
app.post('/main/withdrawn', function(req, res) {
    var data = {
        'term':req.body.term,
        'year':req.body.term,
        'subjectID': req.body.id,
        'subjectName': req.body.sname,
        'section':req.body.sec
    }
    console.log(data);
    withdrawnInfo=data;
});
app.listen(PORT, function() {
    console.log(`Listening on ${PORT}`)
});
async function tuApi(data) {
    return new Promise(function(resolve, reject) {
        var options = {
            'method': 'POST',
            'hostname': 'restapi.tu.ac.th',
            'path': '/api/v1/auth/Ad/verify',
            'headers': {
                'Content-Type': 'application/json',
                'Application-Key': 'TUa4e553b83aa271d3411a4ad88395265801fcfb074110e8b0e03962c01f2aed6ab1662db3a0e1451df7835880c6828fcf'
            },
        };
        var userInfo;
        var request = https.request(options, function(res) {
            var chunks = [];
            res.on("data", function(chunk) {
                chunks.push(chunk);
            });
            res.on("end", function(chunk) {
                var body = Buffer.concat(chunks);
                userInfo = JSON.parse(body);
                resolve(userInfo);
            });
            res.on("error", function(error) {
                reject('error');
                console.error(error);
            });
        });
        var postData = `{\n\t\"UserName\":\"${data.username}\",\n\t\"PassWord\":\"${data.password}\"\n}`;
        request.write(postData);
        request.end();
    })
}