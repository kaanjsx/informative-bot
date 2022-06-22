const d = require('discord.js');
const datasz = require('croxydb');

module.exports = {
  name: "aydınlatıcı",
  description: "İnsanları biraz aydınlatır mısın?",
  options: [
    {
      name: "soru",
      description: "Cevabını istediğin soruyu sor.",
      type: 3,
      required: true
    },
    {
      name: "cevap",
      description: "Alacağın cevabı yaz.",
      type: 3,
      required: true
    }
  ],
  async run(client, interaction) {
    const soru = interaction.options.getString("soru");
    const cevap = interaction.options.getString("cevap");
    interaction.reply("Beni aydınlattığın için teşekkürler.");
    const log = client.channels.cache.get('LOG KANALI ID');
    try {
      const embed = new d.MessageEmbed()
      .setColor('BLURPLE')
      .setDescription(`:star: İsteği talep eden: ${interaction.user.toString()} (**${interaction.user.id}**)\n:poop: İstek soru: **${soru}**\n:middle_finger: İstek cevap: **${cevap}**`)
      .setTitle('Aydınlatma isteği.');
      const evt = new d.MessageButton()
      .setStyle('SUCCESS')
      .setLabel('Kabul Et.')
      .setCustomId('evet');
      const hyr = new d.MessageButton()
      .setStyle('DANGER')
      .setLabel('Reddet.')
      .setCustomId('hayir');
      const row = new d.MessageActionRow()
      .addComponents([evt,hyr]);
      log.send({
        embeds: [embed],
        components: [row]
      }).then(async (msg) => {
        const filter = i => i.user.id !== client.user.id;
        const collector = msg.createMessageComponentCollector({filter});
        collector.on('collect', async (button) => {
          if (button.customId == "evet") {
            datasz.set(`soru.${soru}`, 'evet');
            datasz.set(`cevap.${soru}`, cevap);
            try {
              interaction.user.send(`:white_check_mark: Aydınlatma için istediğiniz soru ve cevap kabul edildi.\n:poop: Soru: **${soru}**\n:middle_finger: Cevap: **${cevap}**`);
              msg.delete();
            } catch (e) {
              return console.log(e.message);
            }
          } else if (button.customId == "hayir") {
            try {
              interaction.user.send(`:x: Aydınlatma için istediğiniz soru ve cevap reddedildi.\n:poop: Soru: **${soru}**\n:middle_finger: Cevap: **${cevap}**`);
              msg.delete();
            } catch (e) {
              return console.log(e.message);
            }
          }
        });
      });
    } catch (e) {
      return console.log(e.message);
    }
  }
};