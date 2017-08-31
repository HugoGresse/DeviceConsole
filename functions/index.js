const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const request = require('request-promise');


exports.notify = functions.https.onRequest((req, res) => {
    console.log("Receive notification request", req.query)


    cors(req, res, () => {

        const options = {
            method: 'POST',
            uri: 'https://fcm.googleapis.com/fcm/send',
            body: {
                "notification": {
                    "title": req.body.title,
                    "body": req.body.body,
                    "icon": req.body.image,
                    "click_action": req.body.link
                },
                "to": req.body.to
            },
            headers: {
                'Authorization': 'key=AAAAeWvQn04:APA91bGPbi4ohY1DW7zR8e6ENYCzB-fJfI6We68ef7_hJGuKuzfxFgHlNPZ0WA7MT44gr9JfLi3fAtpKKaA52vlQy2p7CkjkwzTW0JGCuhsfXfP50osl6-SwjGYICTkWRSY4az4M5-PS'
            },
            json: true // Automatically parses the JSON string in the response
        };

        request(options)
            .then(function (response) {
                console.log('Send push success to ' + req.body.to);
                res
                    .status(200)
                    .header('Access-Control-Allow-Origin', '*')
                    .send(response);
            })
            .catch(function (err) {
                console.log('Send push error to' + req.body.to, err);
                res.status(500).send(err);
            });
    });


});