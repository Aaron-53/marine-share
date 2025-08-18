/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {https} from "firebase-functions";
import {firestore, initializeApp, messaging} from "firebase-admin";

const app = initializeApp();

const referralsCollection = firestore(app).collection("user_referrals");

export const sendReferralNotification = https.onCall(
  async (request) => {
    const referrerId = request.data.referralId;

    if (!referrerId) {
      throw new https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument 'referrerId'."
      );
    }

    // Get the referrer's token from Firestore
    const userTokenDoc = await referralsCollection.doc(referrerId).get();

    if (!userTokenDoc || !userTokenDoc.exists) {
      throw new https.HttpsError("not-found", "Referrer not found.");
    }

    const fcmToken = userTokenDoc.data()?.fcmToken;

    const payload = {
      notification: {
        title: "Referral Successful!",
        body: "Someone just used your referral code. Thanks for sharing!",
      },
      token: fcmToken,
    };

    try {
      // Send the notification
      await messaging(app).send(payload);
      console.log("Successfully sent message to:", referrerId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
);
