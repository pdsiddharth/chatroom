var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
//app.set('port', 8080);
var http = require("http");
var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "pd-chatapp",
        clientEmail: "firebase-adminsdk-d1np6@pd-chatapp.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2myFYZALXlSmG\nCgPTYpImfWJYCQbmf13Q9AnqYVd94pA3WWkSxNKeJtmqsMUYaFe/Iifd0v1qJLQm\ngkoRWCddxtWNIgpDiJ8xZ2hg3AY43NcBQnafPuAWeH+sbx8sGtPCczY5gm8hrz5A\nhet7dxArEf9635cVoh75Wxlg50eXRKGzlhThSuQdfdRnDp8V2Ud1snLkzBbl2edZ\n/KUVfjGEPOl44F5J5cQtV7TMwekJ8t96lm0Fy3ei05f7u9hFdfm9gEc8v2ytyc5A\nibd/ntvekR9NMWy9lajLDEHpLv2yY1N1AlVcOaF61vaiCdNeWnjqWjrZHiHvrV4s\n99Mf7uGnAgMBAAECggEAEOmxXvR0Zu9D10xaKlv42WPHlgvP/c1SLSZNPM4jQl+X\np+i6GKjuMQO8KVkSCD6x0dwiASOnoQshPGfY4F5f1wmxgc7jUHn49KR1QHNgiCe8\nKjuzrPAv5STn/lqUcotRjbMKFK2GCYKnq2Y790WB09to5EKNRc2sPMA5S4ZgVRw4\nJOZC+aV4xiCkK4WEoC0VGDE4/bbSBov7MaFEyW7XKQW+0hrA2yHK6N6zZ/BEIbd4\nEIDjF3nlpnZB58/l2/RjaynJVkfP7GHxNbBmcKa1ch2Bhm1SEQuwdf7QT/YpWmyW\n05PXBDrhoh1revhfrfZUqifAGBVxjofwlg3b8S+nEQKBgQDeOBllq3N5PigGAb3/\nN322MzXSaUL801QOr2aTycdZfjASRlX/KJJZRfTt9iF9QbmyLE2BeAbKHjHl8PUP\nKAVbNLWmmR3zSODrrdRskqBgbiawbhs83XFPYJVo5AOmDvrtWiQ6KJzxBa3K8VlG\nzOVPPuJ2pe3Ej+EvjeJCNZTGAwKBgQDSXXEMrFVVS7+m6dc9XI519g2Sx0oFAwCV\n4M2i2l1TArjrcpReYDkZT2eoRujKK29Wo1plwrKp9dUMdilRxFtOKxzuaAgeX4Rb\noTuSPar46oNqZ1wB48eAZgY6fsfsZ9wSwsdkKSg1bzZDCdpb4m65zVvWFshglJ8X\nrb4C/vNGjQKBgQDJgiudo3TKHBAlKk1Fcud/Yj7LOAKzy1rtGic1mwM35xLmb3uq\nLvtPEv4BD3Hc6M3ggQYjglj9zZXIAtHmVY9N3qVelnivVYYIkZAQiIIAD8LruFzg\nu5n1tgqmnCWm3uyycUxqpMt0UIcBggxIBKNoUgkAOIU8+o/kFJB5I6duSwKBgQCP\nWKEaU6xqTQ2xvZKv+4wQEbS6Ghb0R1F00BUQLeB+GlLMDe3QSZ1fA97MqlUivmpG\nDVYiFYQNkLi2nyYU08qr/3DdfAJcQBY/IiUnx+HjcFpQfVIS75YYhm0kGxQ8oaEz\nH4sjU3BUyQ2erO4gwrFU5vz3a9rrBRtL1VavT++SWQKBgBz8jb3JhaJ2m+uSyJIa\nmWXNbYJsPvHRRQ8LKHqSebtjz9FgLJMEm8y98Pado2PRn3IevjvS/wHMyOSSI+nw\nNfP+Y0nz1/cA8nexWo7eAX42TZ4B+WRz2kecgeImcYfSEv80Ois2W15X9ryvXvgn\n9Pa8/Z9Sv7ObayHJjrb79XuN\n-----END PRIVATE KEY-----\n"
    }),
    databaseURL: "https://pd-chatapp.firebaseio.com/"
});
var db = admin.database();
var ref = db.ref();
ref.once("value", function (snapshot) {
});
var log = ref.child("logs");
var server = app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
    console.log('Node app is running on ip', app.get('ip'));
});

var io = require('socket.io')(server);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function (req, res) {
    res.send('<center><h3>Server is running</h3></center>');
});
setInterval(function () {
    http.get("http://chatroom10.herokuapp.com/");
}, 300000); // every 5 minutes (300000)

var users = [];
var admins = [{ uname: 'HalfBloodPrince', pwd: 'siddharth!!!' }];
var reserved = ['HalfBloodPrince'];
var muted = [];
var banned = [];

var config = {
    apiKey: "AIzaSyD1ocu6qngWEeSop4_kTGNxRkuk9TRbKDY",
    authDomain: "pd-chatapp.firebaseapp.com",
    databaseURL: "https://pd-chatapp.firebaseio.com",
    projectId: "pd-chatapp",
    storageBucket: "pd-chatapp.appspot.com",
    messagingSenderId: "964032610751"
};
io.on('connection', function (socket) {         //when socket is connected
    var id = socket.id;
    var IP = null;
    var username;
    var IsAdmin = false;
    var u = { users: users, reserved: reserved }
    var dbpath = null;
    socket.emit("UU", u);
    socket.on('l', function (msg) {       
        var exist = false;
        var reserved = false;
        for (var g = 0; g < users.length; g++)
        {
            if (users[g].name == msg.username)
            {
                exist = true;
                break;
            }
        }

        for (var g = 0; g < reserved.length; g++) {
            if (reserved == msg.username) {
                reserved = true;
                break;
            }
        }
       
        if (exist == false && reserved==false)
        {
            username = msg.username;
            try {
                IP = msg.IP;
                var mtd = false;
                for (var g = 0; g < muted.length; g++) {
                    if (muted[g].IP == IP) {
                        mtd = true;
                        break;
                    }
                }
                console.log('Ip joined:' + IP);
                var obj = { id: socket.id, name: msg.username, avatar: msg.avatar, gender: msg.gender, typing: false, mt: mtd, IP: IP, Loc: msg.Loc,P:3};
                users.sort(function (a, b) { return a.P - b.P });
                users.push(obj);
                socket.join("Lobby");
                var temp = { name: username, msg: null, loggedOut: false, loggedIn: true };
                io.emit("NM", temp);
                var u = { users: users, reserved: reserved }
                io.emit("UU", u);
                socket.emit("LI", config);
                var dt = new Date();
                dbpath = log.push();
                dbpath.push().set({ date: dt.toString(), username: username, ip: IP, loggedin: true, loggedout: false, message: null, to: null, muted: mtd,unmuted:false });
            } catch (err){

            }           
        }
    });

    socket.on('al', function (msg) {
        for (var b = 0; b < admins.length; b++)
        {
            if (admins[b].uname == msg.username)
            {
                if (admins[b].pwd === msg.pwd)
                {
                    var exist = false;
                    //if (users[msg.username] != undefined)
                    //{
                    //    exist = true;
                    //}
                    for (var g = 0; g < users.length; g++) {
                        if (users[g].name == msg.username) {
                            exist = true;
                            break;
                        }
                    }
                    if (exist == false) {
                        username = msg.username;
                        try {
                            IP = msg.IP;
                            var obj = { id: socket.id, name: msg.username, avatar: msg.avatar, gender: msg.gender, typing: false, mt: false, IP: null, Loc: null, P: 1};
                            users.push(obj);                         
                            IsAdmin = true;
                            socket.join("Lobby");
                            var temp = { name: username, msg: null, loggedOut: false, loggedIn: true };
                            io.emit("NM", temp);
                            users.sort(function (a, b) { return a.P - b.P });
                            var u = { users: users, reserved: reserved }
                            io.emit("UU", u);
                            socket.emit("LIA", config);
                            var dt = new Date();
                            dbpath = log.push();
                            dbpath.push().set({ date: dt.toString(), username: username, ip: IP, loggedout: false, loggedin: true, message: null, to: null, muted: false, unmuted: false});
                        } catch (err) {

                        }
                    }
                    break;
                }
            }
        }
    });

    socket.on('sa', function (obj) {
        if (muted.length == 0) {
            io.emit("NM", obj);
            var dt = new Date();
            dbpath.push().set({ date: dt.toString(), username: obj.name, loggedout: false, loggedin: false, ip: IP, message: obj.msg, to: null, muted: false, unmuted: false});
        }
        else {
            if (muted.indexOf(IP) == -1)
            {
                io.emit("NM", obj);
                var dt = new Date();
                dbpath.push().set({ date: dt.toString(), username: obj.name, loggedout: false, loggedin: false, ip: IP, message: obj.msg, to: null, muted: false, unmuted: false });
            }
        }   
            
    });

    socket.on('mu', function (name) {
        try {
            if (IsAdmin == true) {
                for (var d = 0; d < users.length; d++) {
                    if (users[d].name == name && reserved.indexOf(name) == -1) {
                        users[d].mt = true;
                        users.sort(function (a, b) { return a.P - b.P });
                        var u = { users: users, reserved: reserved }
                        io.emit("UU", u);
                        muted.push(users[d].IP);
                        io.emit("NM", { name: name, msg: name + ' has been muted by ' + username, loggedOut: false, loggedIn: false, mualert: true, umalert: false });
                        var dt = new Date();
                        dbpath.push().set({ date: dt.toString(), username: username, ip: IP, loggedout: false, loggedin: false, message: null, to: null, muted: true, unmuted: false });
                        break;
                    }
                }
            }
            }
         catch (error)
        {
        }       
    });
    socket.on('um', function (name) {
        try {
            if (IsAdmin == true) {
                for (var d = 0; d < users.length; d++) {
                    if (users[d].name == name) {
                        for (var v = 0; v < muted.length; v++) {
                            if (muted[v] == users[d].IP) {
                                users[d].mt = false;
                                users.sort(function (a, b) { return a.P - b.P });
                                var u = { users: users, reserved: reserved }
                                io.emit("UU", u);
                                muted.splice(v, 1);
                                io.emit("NM", { name: name, msg: name + ' has been unmuted by ' + username, loggedOut: false, loggedIn: false, mualert: false, umalert: true });
                                var dt = new Date();
                                dbpath.push().set({ date: dt.toString(), username: username, loggedout: false, loggedin: false, ip: IP, message: null, to: null, muted: false, unmuted: true});
                                break;
                            }
                        }
                        break;
                    }
                }

            }

        } catch (error)
        {

        }
    });

    socket.on('p', function (obj) {
        try {
            if (obj.name == username)
            {
                for (var d = 0; d < users.length; d++) {
                    if (users[d].name == obj.To) {
                        socket.to(users[d].id).emit('NPM', obj);
                        var dt = new Date();
                        dbpath.push().set({ date: dt.toString(), username: username, ip: IP, loggedout: false, loggedin: false, message: obj.msg, to: users[d].name, muted: false, unmuted: false});
                        break;
                    }
                }

            }
        } catch (err) {

        }
        
    });
    socket.on('ts',function (obj) {
        io.emit("TS", obj);
    });
    socket.on('te', function (obj) {
        io.emit("TE", obj);
    });
    socket.on('disconnect', function () {        //socket disconnected
        if (id != undefined) {
            var r = "! " + id + " disconnected";
            console.log(r);
        }
        for (var t = 0; t < users.length; t++)
        {
            if (users[t].id == id)
            {              
                users.splice(t, 1);
                break;
            }
        }
        var temp = { name: username, msg: null, loggedOut: true, loggedIn: false };
        if (temp.name != undefined)
        {
            io.emit("NM", temp);
            var dt = new Date();
            dbpath.push().set({ date: dt.toString(), username: temp.name, ip: IP, loggedin: false, loggedout: true, message: null, to: null, muted: false, unmuted: false });
            users.sort(function (a, b) { return a.P - b.P });
            var u = { users: users, reserved: reserved }
            io.emit("UU", u);           
        }
    });
     
    
});