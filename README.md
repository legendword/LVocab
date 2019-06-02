# LVocab
An open-source personal vocabulary list website.

---

## Deployment

### Requirements

- Apache 2
- PHP 5 or PHP 7

### Installation

Put all files in your localhost server documents directory.

For Mac OS X, it's most likely `/Library/WebServer/Documents/`

Access this application through `index.html`

### Login Support

By default, you're automatically logged in with user id `1`

**You don't need to change this if you're using this yourself.**

If you're deloying this on your own server and wants to implement login support, open `config.php`, and change `$uid = "1"` to any code that enables login detection and sets `$uid` to a unique user identifier.

## Plugin Instructions

The `LVocab Google Translate Plugin.user.js` in this repo is a Tampermonkey script. Install Tampermonkey on your browser (preferrably Chrome), and install this script.

This Google Translate plugin is required for proper use of LVocab. Manually adding new entries is not recommended.

## Notice

Use LVocab on a computer. Not a mobile device.

Use LVocab in Chrome. Other browsers may work, but it is not guaranteed.

Use LVocab with the LVocab Google Translate Plugin.

---

### Lastly, have fun memorizing vocabularies! Next time you go to Google Translate to look up a word, add it to LVocab! 

