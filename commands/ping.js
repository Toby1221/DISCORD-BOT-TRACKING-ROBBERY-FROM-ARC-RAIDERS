export default {
  name: 'ping',
  description: 'Replies with ping and latency',
  async execute({ message }) {
    const sent = await message.reply('Ping!');
    const latency = Date.now() - message.createdTimestamp;
    await message.channel.send(`Latency: ${latency}ms`);
    try {
      await sent.delete();
    } catch {}
  }
};
