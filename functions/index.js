const functions = require('firebase-functions');
const request = require('request-promise');


exports.notify = functions.https.onRequest((req, res) => {
    console.log("Receive notification request", req.query)

    var options = {
        method: 'POST',
        uri: 'https://fcm.googleapis.com/fcm/send',
        body: {
            "notification": {
                "title": "Portugal vs. Denmark",
                "body": "5 to 1",
                "icon": "firebase-logo.png",
                "click_action": "http://localhost:3000"
            },
            "to": req.query.to
        },
        headers: {
            'Authorization': 'key=AAAAeWvQn04:APA91bGPbi4ohY1DW7zR8e6ENYCzB-fJfI6We68ef7_hJGuKuzfxFgHlNPZ0WA7MT44gr9JfLi3fAtpKKaA52vlQy2p7CkjkwzTW0JGCuhsfXfP50osl6-SwjGYICTkWRSY4az4M5-PS'
        },
        json: true // Automatically parses the JSON string in the response
    };

    request(options)
        .then(function (response) {
            console.log('Send push success to ' + req.query.to);
            res.status(200).send(response);
        })
        .catch(function (err) {
            console.log('Send push error to' + req.query.to, err);
            res.status(500).send(err);
        });

});