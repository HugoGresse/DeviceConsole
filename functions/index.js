const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const request = require('request-promise');


exports.notify = functions.https.onRequest((req, res) => {
    console.log("Receive notification request", req.query)

    const {fcm} = functions.config()

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
                'Authorization': fcm.authorization
            },
            json: true
        };

        request(options)
            .then(function (response) {
                if(response.success){
                    console.log('Send push success to ' + req.body.to);
                    res
                        .status(200)
                        .header('Access-Control-Allow-Origin', '*')
                        .send(response);
                } else {
                    console.log("⚠️ Push send failed")
                    res
                        .status(500)
                        .header('Access-Control-Allow-Origin', '*')
                        .send(response);
                }
            })
            .catch(function (err) {
                console.log('Send push error to' + req.body.to, err);
                res.status(500).send(err);
            });
    });
});
