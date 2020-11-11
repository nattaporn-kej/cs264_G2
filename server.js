'use strict';
var express = require('express');
var path = require('path');
var https = require('https');
var body = require('body-parser');
var PORT  = process.env.PORT || 9000;
var app = express();
app.use(body());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//สร้าง route ขึ้นมา 1 ตัว โดยกำหนดให้ path คือ / หรือ index ของ host นั่นเอง
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/login', function (req, res) {
    res.render('index');
});

app.post('/login', function(req, res){
   
    var data = {
       'username': req.body.apiUser,
       'password': req.body.apiPass
    }
    console.log(data);
    console.log(tuApi(data));
    async function main() {
        try {
            var userInfo = await tuApi(data);
            // tuApi(data).then((message) =>{
            //     console.log('API success: ' + userInfo.resolve)
            // }).catch((message) => {
            //     console.log('API failed: '+ userInfo.reject)
            // })
            console.log(userInfo);
            if(userInfo.status == true){
                res.render('main', userInfo);
            }else{
                swal({
                    title: "Invalid username or password",
                     text: "Please enter username or password again.",
                     type: "warning"
                   })
                
            }
        } catch (error) {
          console.log(error);
        }
      }
    main();

    

});

//ทำการรันเซิฟเวอร์ตามพอร์ตที่กำหนดด้านบน
app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});

// define tu api request
async function tuApi(data){ 
    return new Promise(function( resolve, reject) {
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

        var request = https.request(options, function (res) {
            var chunks = [];
        
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
        
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                userInfo = JSON.parse(body);
                resolve(userInfo);
            });
        
            res.on("error", function (error) {
                reject('error');
                console.error(error);
            });
        });
        
        var postData =  `{\n\t\"UserName\":\"${data.username}\",\n\t\"PassWord\":\"${data.password}\"\n}`;
        //console.log(postData);
        request.write(postData);
        request.end();
        
    })
}
