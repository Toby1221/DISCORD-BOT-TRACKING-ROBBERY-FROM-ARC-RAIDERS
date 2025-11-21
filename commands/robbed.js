export default {
  name: 'robbed',
  description: 'Record today as robbery date (alias for !user robbed)',
  async execute({ message, db }) {
    const uid = message.author.id;
    const userRef = db.collection('users').doc(uid);
    const now = new Date();
    await userRef.set({ lastRobbed: now.toISOString() }, { merge: true });
    return message.reply(`Marked as robbed on ${now.toISOString().slice(0, 10)}.`);
  }
};
