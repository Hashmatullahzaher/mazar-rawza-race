# Mazar-i-Sharif Street Race (Rawza Ring)

A 3D street race on the real streets around the Shrine of Hazrat Ali (Rawza-e-Sharif) in Mazar-i-Sharif.

**Play:** https://hashmatullahzaher.github.io/mazar-rawza-race/ (computer or phone; on a phone, hold it sideways)

Keyboard: W A S D or the arrow keys to drive, Space for the handbrake, C to change the camera, R to go back to the last checkpoint, P to pause.
Phone: on-screen buttons for steering, GAS, BRAKE, DRIFT, camera, reset, pause and full screen.
Full screen: Android plays full screen from START RACE. On iPhone, tap Share, then Add to Home Screen, and open the game from the new icon. On a computer, press F11.

## How it was made
Built by **Claude Fable 5.2** from a single prompt, in about 40 minutes, during a hands-on test by Hashmatullah Zaher (Future AI). The game code is published exactly as the model wrote it.

**Additions after the test** (by Future AI on 15 Nov 2026, not written by Fable and not part of the test):
- Phone touch controls: `js/touch.js` and the one line in `index.html` that loads it. They only turn taps into the same key presses the game already reads.
- Full screen on phones: START RACE switches to full screen and a full-screen button sits in the race screen (Android and most browsers).
- Home-screen app mode: `manifest.webmanifest`, `icons/` and a few tags in the `<head>` of `index.html`, so the game opens full screen when added to the home screen (the only way on iPhone).

- Dari video: https://youtu.be/B9HkGEtEdtA
- English video: https://youtu.be/6c0vPQFXewk
- Free WhatsApp community (prompts, map file, full test report): https://chat.whatsapp.com/FxvV7hCQ6VX2Us5txFlH5N

## Credits
- Map data © OpenStreetMap contributors, available under the Open Database License (ODbL): https://www.openstreetmap.org/copyright
- 3D library: three.js (MIT License)
