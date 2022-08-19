const model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: guess => {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i]
			let index = ship.locations.indexOf(guess)
			let hits = ship.hits

			if (hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!")
				return true
			} else if (index >= 0) {
				hits[index] = "hit"
				view.displayHit(guess)
				view.displayMessage("HIT!")

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!")
					this.shipsSunk++
				}
				return true
			}
		}
		view.displayMiss(guess)
		view.displayMessage("You missed.")
		return false
	},

	isSunk: ship => {
		let hits = ship.hits
		for (let i = 0; i < this.shipLength; i++)  {
			if (hits[i] !== "hit") {
				return false
			}
		}
	    return true
	},

	generateShipLocations: () => {
		let locations
		for (let i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip()
			} while (this.collision(locations))
			this.ships[i].locations = locations
		}
		console.log("Ships array: ")
		console.log(this.ships)
	},

	generateShip: () => {
		let direction = Math.floor(Math.random() * 2)
		let row
		let col

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize)
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
			col = Math.floor(Math.random() * this.boardSize)
		}

		let newShipLocations = []
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i))
			} else {
				newShipLocations.push((row + i) + "" + col)
			}
		}
		return newShipLocations
	},

	collision: locations => {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i]
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true
				}
			}
		}
		return false
	}
	
}


const view = {
	displayMessage: msg => {
		let messageArea = document.querySelector("#message-area")
		messageArea.innerHTML = msg
	},

	displayHit: location => {
		let cell = document.querySelector(`#${location}`)
		cell.classList.add("hit")
	},

	displayMiss: location => {
		let cell = document.querySelector(`#${location}`)
		cell.classList.add("miss")
	}

}

const controller = {
	guesses: 0,

	processGuess: guess => {
		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses")
			}
		}
	}
}


// helper function to parse a guess from the user

function parseGuess(guess) {
	let alphabet = ["A", "B", "C", "D", "E", "F", "G"]

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.")
	} else {
		let firstChar = guess.charAt(0)
		let row = alphabet.indexOf(firstChar)
		let column = guess.charAt(1)
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.")
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!")
		} else {
			return row + column
		}
	}
	return null
}


// event handlers

function handleFireButton() {
	let guessInput = document.querySelector('#guess-input')
	let guess = guessInput.value.toUpperCase()

	controller.processGuess(guess)

	guessInput.value = ""
}

function handleKeyPress(e) {
	fireButton = document.querySelector("#fire-button")

	if (e.keyCode === 13) {
		fireButton.click()
		return false
	}
}


// init - called when the page has completed loading

window.onload = init

function init() {
	// Fire! button onclick handler
	let fireButton = document.querySelector("#fire-button")
	fireButton.onclick = handleFireButton

	// handle "return" key press
	let guessInput = document.querySelector("#guess-input")
	guessInput.onkeypress = handleKeyPress

	// place the ships on the game board
	model.generateShipLocations()
}
