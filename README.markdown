piine
=====
piine provides Real-Time Feedback during your presentation.


Snapshots
---------

### piine client
Audience can feedback to a speaker by touching own device.

![snapshot of piine client](http://orgachem.github.io/piine/images/snapshot-client.png)


### piine viewer
You can display piine viewer by a projector.  piine viewer shows: who gets interested or excited **now**, how many user was joined.

![snapshot of piine viewer](http://orgachem.github.io/piine/images/snapshot-viewer.png)


How to use
----------

### Preparing

1. Setup Closure tools

    Enter following commands in the terminal:

        (in `piine` directory)
        $ python piine-client/tools/setup.py
        $ python piine-viewer/tools/setup.py
        $ cd piine-server
        $ npm install socket.io

2. Modify Server Addresses

    Modify server assress and port in `piine-client/development/js_dev/piine/app.js:52`, `piine-client/development/js_dev/piine/app.js:52`, `piine-server/server.js:4`.

3. Compile

    Enter following commands in the terminal:

        (in `piine` directory)
        $ python piine-client/tools/compile.py
        $ python piine-viewer/tools/compile.py

4. Deploy

    Deploy `piine-client/production` and `piine-viewer/production` on your web server.

5. Start on Your Server

    Enter following commands in the terminal:

        (in `piine` directory)
        $ node piine-server/server.js

6. Operation Check

    Open `piine-viewer/production` (called "pione" viewer) on your PC (because "piine" viewer requires a high-performance device).

    Next, open `piine-client/production` (called "piine" client) on another tab/window or your device.

    Next, click/touch your device.
 
7. Sleep "piine" Server

    Sleep "piine" server by `Ctrl+C` on your server.


### Presentation

1. Connect to a Projector

    Connect your device to projector.

2. Start "piine" Server

    Enter following commands in the terminal:

        (in `piine` directory)
        $ node piine-server/server.js

3. Open "piine" Viewer on Your Device

    Open "piine" viewer on your device that was connected to the projector.

4. Get Audience to join "piine"

    Get audience to open "piine" client on own devices.

5. Lecture how-to-use "piine" to audience

    Say:

    > Please touch "piine!" at any time when you get excited or interested my speech!


Special thanks
--------------

 * Development tool
   * [cocopon](https://github.com/cocopon)

     [goog-starter-kit](https://github.com/cocopon/goog-starter-kit) licensed under MIT license.
 * Font
   * [Omnibus-Type](https://plus.google.com/115141460305554867239/about)

     [Sansita One](http://www.google.com/fonts/specimen/Sansita+One) licensed under [SIL Open Font License, 1.1](http://scripts.sil.org/OFL).
 * Concept of the real-time feedback system for a presentation
   * [Shumpei Shiraishi](https://twitter.com/Shumpei)
