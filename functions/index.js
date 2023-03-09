/* This project (superchat-mad-1) must be on the
** Blaze (pay-as-you-go) plan to complete this command.
** Required API artifactregistry.googleapis.com can't be
** enabled until the upgrade is complete.
*/

const functions = require("firebase-functions");
const Filter = require("bad-words");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// this function will be called when a document added to the messages
exports.detectEvilUsers = functions
    .firestore
    .document("messages/{msgId}")
    .onCreate(async (doc) => {
      const filter = new Filter();
      const {text, uid} = doc.data();

      // if message contains bad words
      if (filter.isProfane(text)) {
        // clean up the message
        const cleaned = filter.clean(text);
        await doc.ref.update({text: `🤐 I got banned for saying: ${cleaned}`});

        // create an empty doc under banned collection
        await db.collection("banned").doc(uid).set({});
      }
    });
