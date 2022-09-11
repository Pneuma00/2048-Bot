const { SlashCommandBuilder, Routes } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { clientId, guildId, token } = require('./config.json')

const commands = [
	new SlashCommandBuilder().setName('2048').setDescription('2048 게임을 시작합니다.')
].map(command => command.toJSON())

const rest = new REST({ version: '10' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('명령어 등록을 성공적으로 완료했습니다.'))
	.catch(console.error)
