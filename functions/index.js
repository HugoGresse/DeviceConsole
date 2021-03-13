const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp()

exports.notify = functions.https.onRequest((req, res) => {
    console.log("Receive notification request", req.query)
    cors(req, res, () => {
        const options = {
                    "notification": {
                        "title": req.body.title,
                        "body": req.body.body,
                        "icon": req.body.image,
                    },
                    "webpush": {
                        notification: {
                            requireInteraction: true,
                        },
                        fcm_options: {
                            "link": req.body.link
                        }
                    },
                    "token": req.body.to
        };

        admin.messaging().send(options)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
                res
                    .status(200)
                    .header('Access-Control-Allow-Origin', '*')
                    .send({ "✅": "🚀" });
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                console.log("⚠️ Push send failed")
                res
                    .status(500)
                    .header('Access-Control-Allow-Origin', '*')
                    .send(error);
            });
    });
});
