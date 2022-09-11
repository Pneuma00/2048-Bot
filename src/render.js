const Canvas = require('@napi-rs/canvas');
const path = require('path')

Canvas.GlobalFonts.registerFromPath(path.join(__dirname, '..', 'fonts', 'Ubuntu-Medium.ttf'), 'Ubuntu')

const colorset = {
    background: {
        2: 'eee4da',
        4: 'eee1c9',
        8: 'f3b27a',
        16: 'f69664',
        32: 'f77c5f',
        64: 'f75f3b',
        128: 'edd073',
        256: 'edcc62',
        512: 'edc950',
        1024: 'edc53f',
        2048: 'edc22e',
        4096: '3c3a33',
        8192: '3c3a33',
    },
    text: {
        2: '776e65',
        4: '776e65',
        8: 'f9f6f2',
        16: 'f9f6f2',
        32: 'f9f6f2',
        64: 'f9f6f2',
        128: 'f9f6f2',
        256: 'f9f6f2',
        512: 'f9f6f2',
        1024: 'f9f6f2',
        2048: 'f9f6f2',
        4096: 'f9f6f2',
        8192: 'f9f6f2',
    }
}

module.exports = async game => {
    const canvas = Canvas.createCanvas(800, 800);
    const ctx = canvas.getContext('2d');

    const cellSize = 800 / game.board.length

    ctx.font = '108px Ubuntu'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = '#cdc1b4'
    ctx.fillRect(0, 0, 800, 800)
    
    for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < game.board.length; c++) {
            if (game.board[r][c] === 0) continue

            ctx.fillStyle = '#' + colorset.background[game.board[r][c]]
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize)

            if (game.newTile && game.newTile.r === r && game.newTile.c === c) ctx.fillStyle = '#6495ED'
            else ctx.fillStyle = '#' + colorset.text[game.board[r][c]]

            ctx.fillText(game.board[r][c].toString(), (c + 0.5) * cellSize - ctx.measureText(game.board[r][c].toString()).width / 2, (r + 0.5) * cellSize)
        }
    }

    for (let i = 1; i < game.board.length; i++) {
        ctx.fillStyle = '#bbada0'
        ctx.fillRect(i * cellSize - 8, 0, 16, 800)
    }

    for (let i = 1; i < game.board.length; i++) {
        ctx.fillStyle = '#bbada0'
        ctx.fillRect(0, i * cellSize - 8, 800, 16)
    }

    return await canvas.encode('png')
}