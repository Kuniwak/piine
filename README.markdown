piine
=====
piine provides Real-Time Feedback during your presentation.


Snapshots
---------

### piine client
Audience can send feedback (called "piine!") to a speaker by touching thier device.

![snapshot of the piine client](http://kuniwak.github.io/piine/images/snapshot-client.png)


### piine viewer
You can display a "piine" viewer by a projector.
The "piine" viewer shows: who gets interested or excited **now**, how many users were joined.

![snapshot of the piine viewer](http://kuniwak.github.io/piine/images/snapshot-viewer.png)


How to use
----------

### Preparing

1. Install [googkit](https://github.com/googkit/googkit)
2. Modify Server Addresses

    Modify server addresses and ports in `piine-client/development/js_dev/piine/app.js:52`, `piine-client/development/js_dev/piine/app.js:52`, `piine-server/server.js:4`.

3. Compile

    Enter following commands in the terminal:

        (in `piine` directory)
        $ pushd piine-client
        $ googkit setup
        $ googkit build
        $ popd
        $ pushd piine-viewer
        $ googkit setup
        $ googkit build

4. Deploy

    Deploy `piine-client/production` and `piine-viewer/production` to your web server.

5. Start on Your Server

    Enter following commands in the terminal:

        (in `piine` directory)
        $ cd piine-server
        $ npm install
        $ node piine-server/server.js

6. Operation Check

    Open `piine-viewer/production` (called "piine" viewer) on your device.

    Next, open `piine-client/production` (called "piine" client) on another your device or tab/window.

    Next, touch/click the "piine" client (then, you should see the "piine" viewer too).
 
7. Sleep "piine" Server

    Sleep your "piine" server by `Ctrl+C`.

### Presentation

1. Connect to a Projector

    Connect your device to the projector.

2. Start "piine" Server

    Enter following commands in the terminal:

        (in `piine` directory)
        $ nohup node piine-server/server.js > piine.log &

3. Open a "piine" Viewer on Your Device

    Open a "piine" viewer on your device that was connected to the projector.

4. Get Audience to Join the "piine" Network

    Get audience to open "piine" client on own devices.

5. Lecture How-To-Use the "piine" Client to Audience

    Say:

    > Please touch "piine!" at any time when you get excited or interested!


Special Thanks
--------------

 * Development tool
   * [cocopon](https://github.com/cocopon)

     [goog-starter-kit](https://github.com/cocopon/goog-starter-kit) licensed under MIT license.
 * Font
   * [Omnibus-Type](https://plus.google.com/115141460305554867239/about)

     [Sansita One](http://www.google.com/fonts/specimen/Sansita+One) licensed under [SIL Open Font License, 1.1](http://scripts.sil.org/OFL).
 * Concept of the real-time feedback system for a presentation
   * [Shumpei Shiraishi](https://twitter.com/Shumpei)
