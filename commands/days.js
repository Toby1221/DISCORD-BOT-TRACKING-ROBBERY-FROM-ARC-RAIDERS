export default {
  name: 'days',
  description: 'Show days since last robbery (alias for !user days)',
  async execute({ message, db }) {
    const uid = message.author.id;
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) return message.reply('No robbery date recorded. Use `!robbed` to record one.');
    const data = doc.data();
    if (!data.lastRobbed) return message.reply('No robbery date recorded. Use `!robbed` to record one.');
    const last = new Date(data.lastRobbed);
    if (Number.isNaN(last.getTime())) return message.reply('Recorded robbery date is invalid.');
    const now = new Date();
    const days = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return message.reply(`You've gone ${days} day(s) without getting robbed. Last robbed: ${last.toISOString().slice(0, 10)}.`);
  }
};
