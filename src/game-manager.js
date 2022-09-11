class GameManager {
    constructor (option) {
        this.rows = 4
        this.columns = 4
        this.scoreIncrement = 0
        this.newTile = { r: 0, c: 0 }

        this.score = 0
        
        this.board = [
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
        ]

        this.generateRandom()
        this.generateRandom()
    }


    slideRow (row) {
        row = row.filter(t => t !== 0)
        
        for (let i = 0; i < row.length-1; i++){
            if (row[i] === row[i+1]) {
                row[i] *= 2
                row[i + 1] = 0
                this.score += row[i]
                this.scoreIncrement += row[i]
            }
        }

        row = row.filter(t => t !== 0)

        while (row.length < this.columns) {
            row.push(0)
        }

        return row
    }
    
    move (dir) {
        this.scoreIncrement = 0

        if (dir === 'left') {
            this.board = this.board.map(r => this.slideRow(r))
        }

        else if (dir === 'right') {
            this.board = this.board.map(r => this.slideRow(r.reverse()).reverse())
        }
        
        else if (dir === 'up') {
            for (let c = 0; c < this.columns; c++) {
                let column = this.slideRow(this.board.map(r => r[c]))

                for (let r = 0; r < this.rows; r++){
                    this.board[r][c] = column[r]
                }
            }
        }

        else if (dir === 'down') {
            for (let c = 0; c < this.columns; c++) {
                let column = this.slideRow(this.board.map(r => r[c]).reverse()).reverse()
                
                for (let r = 0; r < this.rows; r++){
                    this.board[r][c] = column[r]
                }
            }
        }

        this.newTile = this.generateRandom()
    }

    generateRandom() {
        const emptyTiles = this.getEmptyTiles()

        if (emptyTiles.length === 0) return

        const selected = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]

        this.board[selected.r][selected.c] = (Math.random() < 0.1) ? 4 : 2

        return selected
    }

    getEmptyTiles() {
        const emptyTiles = []

        for (let r = 0; r < this.board.length; r++) {
            for (let c = 0; c < this.board.length; c++) {
                if (this.board[r][c] === 0) {
                    emptyTiles.push({ r, c })
                }
            }
        }

        return emptyTiles
    }
}

module.exports = GameManager