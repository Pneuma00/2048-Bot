require('dotenv').config()

const { Client, GatewayIntentBits, Collection, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const GameManager = require('./src/game-manager')

const render = require('./src/render')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.games = new Collection()

client.on('ready', () => {
    console.log(`${client.user.tag} 으로 로그인하였습니다.`)

    client.user.setActivity('/2048')
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return

    const { commandName } = interaction

	if (commandName === '2048') {
		const game = client.games.ensure(interaction.user.id, new GameManager())
        
        const file = new AttachmentBuilder(await render(game), { name: '2048.png' })

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username} ㅣ 점수: ${game.score}`, iconURL: interaction.user.avatarURL() })
            .setImage(`attachment://2048.png`)
            .setTimestamp()
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`left_${interaction.user.id}`)
                    .setLabel('왼쪽 ⬅️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`up_${interaction.user.id}`)
                    .setLabel('위쪽 ⬆️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`down_${interaction.user.id}`)
                    .setLabel('아래쪽 ⬇️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`right_${interaction.user.id}`)
                    .setLabel('오른쪽 ➡️')
                    .setStyle(ButtonStyle.Secondary),
            )

        await interaction.reply({ embeds: [embed], files: [file], components: [row] })
    }

    else if (commandName === '랭킹') {
        // TODO
    }
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return

    if (interaction.customId.split('_')[1] !== interaction.user.id) {
        return interaction.reply({ content: '니 게임이 아닙니다!', ephemeral: true })
    }

    if (!client.games.has(interaction.user.id)) {
        return interaction.reply({ content: '진행중인 게임이 없습니다!', ephemeral: true })
    }

    const game = client.games.get(interaction.user.id)
    
    game.move(interaction.customId.split('_')[0])
    
    const file = new AttachmentBuilder(await render(game), { name: '2048.png' })

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username} ㅣ 점수: ${game.score} ${game.scoreIncrement ? '(+' + game.scoreIncrement + ')' : ''}`, iconURL: interaction.user.avatarURL() })
        .setImage(`attachment://2048.png`)
        .setTimestamp()

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`left_${interaction.user.id}`)
                .setLabel('왼쪽 ⬅️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`up_${interaction.user.id}`)
                .setLabel('위쪽 ⬆️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`down_${interaction.user.id}`)
                .setLabel('아래쪽 ⬇️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`right_${interaction.user.id}`)
                .setLabel('오른쪽 ➡️')
                .setStyle(ButtonStyle.Secondary),
        )

    interaction.update({ embeds: [embed], files: [file], components: [row] })
})

client.login()