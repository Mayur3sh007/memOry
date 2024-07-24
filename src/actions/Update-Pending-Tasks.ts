// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// admin.initializeApp();

// export const updatePendingTasks = functions.pubsub.schedule('every day 00:00').onRun(async (context : any) => {
//   const db = admin.firestore();
//   const now = admin.firestore.Timestamp.now();
  
//   const snapshot = await db.collection('Notes')
//     .where('scheduleTime', '<', now)
//     .where('status', '==', 'pending')
//     .get();

//   const batch = db.batch();
//   snapshot.docs.forEach((doc : any) => {
//     batch.update(doc.ref, { status: 'passed' });
//   });

//   await batch.commit();
// });