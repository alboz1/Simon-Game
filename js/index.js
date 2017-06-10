const game = {
	buttons: [],
	userInput: [],
	round: 0,
	index: 0,
	isPlaying: false,
	strict: false,
	restart: false,
	
	init: function() {
		this.isPlaying = true;
		view.eventListeners();
	},
	random: function() {
		return Math.floor(Math.random() * 4);
	},
	activeButton: function(button) {
		button.classList.add('active');
		
		setTimeout(_ => {
			button.classList.remove('active');
		}, 500);
	},
	playSound: function(audio) {
		audio.play();
	},
	storeActiveButton: function(button) {
		this.buttons.push(button);
	},
	rounds: function() {
		if (this.round < 20) {
			this.round++;
			view.screen(game.round);
    }
	},
	grabStoredButtons: function(cb) {
		this.buttons.forEach((button, index) => {
			setTimeout(_ => {
				this.activeButton(button);
				this.playSound(button.children[0]);
			}, 1000 * index);
		});
		setTimeout(_ => cb(), 1000 * this.index);
	},
	reset: function() {
		this.buttons = [];
		this.userInput = [];
		this.round = 0;
		this.index = 0;
		
		setTimeout(_ => {
			view.screen(game.round, 'white');
			this.rounds();
			view.activeButton();
		}, 1000);
	},
	start: function() {
		if (this.restart) {
			game.reset();
		} else {
			this.restart = true;
			setTimeout(_ => {
				this.rounds();
				view.activeButton();
				this.isPlaying = false;
			}, 1000);	
		}
	}
};

const view = {
	activeButton: function() {
		const btn = document.querySelector(`.button[data-num="${game.random()}"]`);
		const audio = btn.querySelector('audio');
		game.storeActiveButton(btn);
		game.activeButton(btn);
		game.playSound(audio);
	},
	screen: function(log, color) {
		const roundScreen = document.querySelector('.screen-counter span');
		roundScreen.style.color = color;
		roundScreen.textContent = log;
	},
	eventListeners: function() {
		const buttons = document.querySelectorAll('.button');
		const strictBtn = document.querySelector('.strict-button .btn');
		
		buttons.forEach(button => {
			button.addEventListener('click', function() {
				const audio = this.querySelector('audio');
				//stops the user to play the button if the game is playing
				if (game.isPlaying) return;
				
				game.userInput.push(this);
				game.activeButton(this);
				game.playSound(audio);
				handlers.checkUserInput(this);
			});
		});
		
		strictBtn.addEventListener('click', function() {
			this.classList.toggle('on');
			game.strict = !game.strict;
		});
	}
};

const handlers = {
	checkUserInput: function(input) {
		//need to check if the user's input correspond to the buttons that are stored in the buttons array
		if (game.userInput[game.index] === game.buttons[game.index]) {
			if (game.round === 20) {
				view.screen('WINNER', '#3BC776');
				game.reset();
			} else {
				game.isPlaying = true;
				game.index++;
				game.userInput = [];
				
				setTimeout(_ => {
					game.rounds();
					game.grabStoredButtons(_ => {
						view.activeButton();
						game.isPlaying = false;
					});
				}, 1000);	
			}
		} else if (input !== game.buttons[game.userInput.length - 1]) {
			if (game.strict) {
				game.isPlaying = false;
				view.screen('!!', '#C73B3B');
				game.reset();
			} else {
				game.isPlaying = true;
				game.userInput = [];
				view.screen('!!', '#C73B3B');
				
				setTimeout(_ => {
					view.screen(game.round, 'white');
					game.grabStoredButtons(_ => {
						game.isPlaying = false;
					});
				}, 1000);
			}
		}
	}
};

game.init();