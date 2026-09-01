# Device Console

DeviceConsole is a fast way to **share** a text/url to one devices of a fleet.

It is a free & open source software that allow a single Google accounts to:

- register many devices through modern browser supporting service worker (= not on iOS)
- send text or url to this devices

> [deviceconsole.com](https://deviceconsole.com)

Requirements
------------

1. Node 22.22+ (`nvm use` picks up `.nvmrc`)

2. Install dependencies

        npm install
        npm --prefix functions install

3. Copy `public/firebase-messaging-sw.js.example` to `public/firebase-messaging-sw.js` and fill in
   your Firebase config, then create a `.env` with the `VITE_*` keys.

4. Run the app

        npm run dev

Dev
---

React 19 + TypeScript + Redux Toolkit + antd, bundled with Vite. Cloud Functions are TypeScript on
the Firebase Functions v2 API.

Available Scripts
-----------------

#### Run the app in development mode

    npm run dev

Open http://localhost:5173 to view it in the browser. Edits hot-reload.

#### Typecheck and test

    npm run typecheck
    npm test

#### Release the app

    npm run deploy

It typechecks, bundles and minifies the js, then deploys the website to Firebase Hosting, part of
GCP. Deploy the API with `npm --prefix functions run deploy`.

Donations
---------

This project needs you! If you would like to support this project's further development, the creator of this project or the continuous maintenance of this project, feel free to donate. Your donation is highly appreciated (and I love food, rum and 🍻). Thank you!

**PayPal**

* **[Donate $5](https://paypal.me/HugoGresse/5)**: Thank's for creating this project, here's a beer for you!
* **[Donate $10](https://paypal.me/HugoGresse/10)**: Keep up the good work, I love it!
* **[Donate $50](https://paypal.me/HugoGresse/50)**: I really really want to support this project, great job!

or...

<a href='https://ko-fi.com/A513OEI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi5.png?v=0' border='0' alt='Buy Me a beer at ko-fi.com' /></a>

Author
------
[Hugo Gresse](http://hugo.gresse.io)

