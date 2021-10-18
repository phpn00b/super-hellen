var uniqueEntityId = 0;
var levelData = [{ "EntityType": "BoxGround", "Height": 1, "Width": 30, "MinX": -1, "MaxX": 0, "StartX": 0, "StartY": 768 }, { "EntityType": "BoxBrick", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 640, "StartY": 576 }, { "EntityType": "BoxQuestion", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 704, "StartY": 576 }, { "EntityType": "BoxBrick", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 768, "StartY": 576 }, { "EntityType": "BoxQuestion", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 832, "StartY": 576 }, { "EntityType": "BoxBrick", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 896, "StartY": 576 }, { "EntityType": "BoxQuestion", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 384, "StartY": 576 }, { "EntityType": "BoxQuestion", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 768, "StartY": 384 }, { "EntityType": "Gumba", "Height": 1, "Width": 1, "MinX": 400, "MaxX": 1280, "StartX": 1344, "StartY": 704 }, { "EntityType": "Mario", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 200, "StartY": 768 }, { "EntityType": "BoxSolid", "Height": 1, "Width": 1, "MinX": -1, "MaxX": 0, "StartX": 256, "StartY": 704 }];
var settings = {
	player: {
		jumpForce: 15,
		maxSpeedRight: 20,
		maxSpeedLeft: -20,
		acceleration: 3,
		startX: 100,
		startY: 504,
		runningAnimationInterval: 150
	},
	physics: {
		gravity: 1,
		friction: 1,
		terminalVelocity: 20
	}
}
var InputCommand = {
	None: 'n',
	Right: 'r',
	Left: 'l',
	Up: 'u',
	Down: 'd',
	Jump: 'j'
};
function Game() {
	var self = this;
	this.Entities = [];
	this.Player = new PlayerEntity();
	this.Entities.push(self.Player);

	this.drawFrame = function () {
		//console.log('frame');
		self.Entities.forEach(e => {
			e.animate();
		});
	};
	this.handleKeyDown = function (input) {
		var command = InputCommand.None;
		switch (input) {
			//todo: handle not reversing direction instantly
			case 'ArrowRight':
			case 'd':
				command = InputCommand.Right;
				break;
			case 'ArrowLeft':
			case 'a':
				command = InputCommand.Left;
				break;
			case ' ':
				command = InputCommand.Jump
				break;
			case 'n':
				command = InputCommand.NewGame;
				break;
		}
		self.Player.handleInput(command, true);
	}

	this.handleKeyUp = function (input) {
		var command = InputCommand.None;
		switch (input) {
			//todo: handle not reversing direction instantly
			case 'ArrowRight':
			case 'd':
				command = InputCommand.Right;
				break;
			case 'ArrowLeft':
			case 'a':
				command = InputCommand.Left;
				break;
			case ' ':
				command = InputCommand.Jump
				break;
			case 'n':
				command = InputCommand.NewGame;
				break;
		}
		self.Player.handleInput(command, false);
	}
	this.loadLevel = function (entities) {
		entities.forEach(e => {
			var entity = null;
			switch (e.EntityType) {
				case 'BoxGround':
				case 'BoxSolid':
				case 'BoxQuestion':
				case 'BoxBrick':
					entity = new EnvEntity(e);
					entity.setupSprite();
					break;
				case 'Mario':
					break;
				case 'Gumba':
					break;
				case 'Turtle':
					break;
			}
			if (entity != null) {
				self.Entities.push(entity);
			}
		});
	}
	setInterval('vm.drawFrame()', 50, 50);
}

function PlayerEntity() {

	var self = this;
	this.id = uniqueEntityId++;
	this.Type = 'Player';
	var isRunning = false;
	var isJumping = false;
	var isTurning = false;
	this.animationIndex = 0;
	var activeSprite = 'mario-stand';
	var activeDirection = '';
	var lastAnimationUpdate = new Date().getTime();
	var runningAnimation = ['mario-run-1', 'mario-run-2', 'mario-run-3'];
	var velocityX = 0;
	var velocityY = 0;
	this.isGone = false;
	var activeCommand = InputCommand.None;
	var domNode = $('<div class="game-entity player" id="the-player" style="height: 64px; width: 64px; top: 500px; left: 100px"><img id="mario-sprite" src="" height="64" width="64" alt="hellen" /></div>');
	$('#game-host').append(domNode);
	this.startX = settings.player.startX;
	this.startY = settings.player.startY;
	this.x = settings.player.startX;
	this.y = settings.player.startY;
	this.height = 1;
	this.width = 1;
	this.fullWidth = 64;
	this.fullHeight = 64;


	this.handleInput = function (command, isPressed) {

		//console.log("'" + command + "'");
		//todo: make this handle our input
		if (self.isGone) {
			if (isPressed && command == InputCommand.NewGame)
				Respawn();
			return;
		}
		switch (command) {
			case InputCommand.Up:
				break;
			case InputCommand.Down:
				break;
			case InputCommand.Left:
				activeCommand = isPressed ? InputCommand.Left : InputCommand.None;

				break;
			case InputCommand.Right:
				activeCommand = isPressed ? InputCommand.Right : InputCommand.None;
				break;
			case InputCommand.Jump:
				if (isJumping)
					return;
				isJumping = true;
				velocityY -= settings.player.jumpForce;
				break;
			case InputCommand.ActionB:
				break;
		}

	};

	this.processKeyCommands = function () {
		if (self.isGone)
			return;
		switch (activeCommand) {
			case InputCommand.Right:
				isTurning = self.velocityX > 0;
				velocityX += settings.player.acceleration;
				if (velocityX > settings.player.maxSpeedRight)
					velocityX = settings.player.maxSpeedRight;
				break;
			case InputCommand.Left:
				isTurning = self.velocityX < 0;
				velocityX -= settings.player.acceleration;
				if (velocityX < settings.player.maxSpeedLeft)
					velocityX = settings.player.maxSpeedLeft;
				break;
		}
	};

	this.checkCollision = function (otherEntity) {
		if (self.isGone)
			return false;
		return self.x < otherEntity.x + otherEntity.fullWidth
			&& self.x + self.fullWidth > otherEntity.x
			&& self.y < otherEntity.y + otherEntity.fullHeight
			&& self.y + self.fullHeight > otherEntity.y;
	};

	this.updateDOM = function () {
		document.getElementById('the-player').style.top = self.y + 'px';
		document.getElementById('the-player').style.left = self.x + 'px';
		//document.getElementById('the-player').childNodes[0].src = 'img/' + activeSprite + '.png';

		// update the stats section
		document.getElementById('X').innerText = self.x
		document.getElementById('InertiaX').innerText = velocityX;
		document.getElementById('Y').innerText = self.y;
		document.getElementById('InertiaY').innerText = velocityY;
		document.getElementById('sprite').innerText = activeSprite;
		document.getElementById('isTurning').innerText = isTurning;
		//document.getElementById('Action').innerText = self.Action;
		document.getElementById('ActiveImage').innerText = document.getElementById('the-player').childNodes[0].src;

	};

	this.animate = function () {
		self.processKeyCommands();
		var direction = "right";
		if (self.isGone) {

			self.x += velocityX;
			self.y += velocityY;
			if (velocityX-- < 0)
				velocityX = 0;

			if (velocityY++ > 10)
				velocityY = 10;
			self.updatePosition();
			return;
		}

		desiredSprite = "mario-stand";

		isRunning = velocityX != 0;
		if (isRunning)
			if (velocityX > 0)
				direction = "right";
			else
				direction = "left";

		self.x += velocityX;
		if (isJumping)
			desiredSprite = "mario-jump";
		if (isTurning && isRunning)
			desiredSprite = "mario-turn";
		if (desiredSprite == "mario-stand" && isRunning) {
			desiredSprite = "run";
		}
		console.log(desiredSprite);
		if ((new Date().getTime() - lastAnimationUpdate) > settings.player.runningAnimationInterval && isRunning && !isTurning) {
			console.log('animate run');
			activeSprite = "run";
			self.updateAnimation(runningAnimation);

		}
		else {
			if (activeSprite != desiredSprite && desiredSprite != 'run') {
				activeSprite = desiredSprite;
				self.setActiveSprite(activeSprite);
			}
		}

		if (activeDirection != direction) {
			activeDirection = direction;
			//todo: flip if needed
			self.setActiveSprite(activeSprite);
			//Visual.Image.RenderTransformOrigin = new Point(0.5, 0.5);
			//	ScaleTransform flipTrans = new ScaleTransform();
			//flipTrans.ScaleX = direction == "right" ? 1 : -1;
			//Visual.Image.RenderTransform = flipTrans;

		}
		self.processVertical();
		if (self.x < 0)
			self.x = 0;
		//X += _velocityX;
		self.updatePosition();
		self.updateDOM();

	};

	this.processVertical = function () {
		self.y += velocityY;
		if (self.y > 800) {
			self.killMario();
			return;
		}
		self.y += velocityY;

		if (velocityY < -settings.physics.terminalVelocity)
			velocityY = 0;
		if (velocityY < 10)
			velocityY += settings.physics.gravity;
		var collisionEntities = self.collectCollisionEntities();
		collisionEntities.forEach(collisionEntity => {
			{
				//todo: process this
				var interceptProcessed = false;
				if (collisionEntity.Type == 'env') {
					if (velocityY >= 0) {

						// this means we are falling or standing on something and likely hit the top of something
						if (Math.abs(self.y - (collisionEntity.y - collisionEntity.fullHeight)) < settings.physics.terminalVelocity + 2) {
							self.y = collisionEntity.y - collisionEntity.fullHeight;
							interceptProcessed = true;
						}

						isJumping = false;
					}
					else {
						if (self.x > collisionEntity.x && self.x < collisionEntity.x + collisionEntity.fullWidth)
							// we are going up and likely bumped our head on the ceiling
							if (Math.abs(self.y - (collisionEntity.y + self.fullHeight)) < settings.physics.terminalVelocity + 2) {
								self.y = collisionEntity.y + self.fullHeight;
								interceptProcessed = true;
							}
						velocityY = 1;
					}
					if (interceptProcessed)
						velocityY = 1;
					if (velocityX != 0) {
						if (velocityX < 0)
							velocityX += settings.physics.friction;
						else
							velocityX -= settings.physics.friction;
					}
					if (!interceptProcessed)
						if (velocityX >= 0) {
							// moving right
							if (Math.abs(self.x - (collisionEntity.x - self.fullWidth)) < settings.player.maxSpeedRight) {
								self.x = collisionEntity.x - self.fullWidth;
								velocityX = settings.player.acceleration;
								interceptProcessed = true;
							}
						}
						else {
							// moving left
							if (Math.abs(self.x - (collisionEntity.x + collisionEntity.fullWidth)) < settings.player.maxSpeedRight) {
								self.x = collisionEntity.x + collisionEntity.FullWidth;
								velocityX = -settings.player.acceleration;
								interceptProcessed = true;
							}
						}


				}
				else if (collisionEntity.Type == 'enemy') {
					// todo: detect if we hit the person
					self.killMario();
				}
			}
		});
	}

	this.updatePosition = function () {
		document.getElementById('the-player').style.top = self.y + 'px';
		document.getElementById('the-player').style.left = self.x + 'px';
	};

	this.setupSprite = function () {

	};
	this.killMario = function () {

	};

	this.respawnMario = function () {
		isTurning = false;
		isJumping = false;
		self.isGone = false;
		velocityX = 0;
		velocityY = 0;
		self.x = settings.player.startX;
		self.y = settings.player.startY;
		activeCommand = InputCommand.None;
		self.updatePosition();
		self.animate();
	};

	this.setActiveSprite = function (sprite) {
		document.getElementById('mario-sprite').src = `img/sprites/mario/${sprite}.png`;
	};
	this.collectCollisionEntities = function () {
		var items = [];
		for (var i = 0; i < vm.Entities.length; i++) {
			if (self.id != vm.Entities[i].id && !vm.Entities[i].isGone)
				if (vm.Entities[i].checkCollision(self))
					items.push(vm.Entities[i]);
		}
		return items;
	};
	this.updateAnimation = function (assets) {
		if (self.animationIndex++ > 1)
			self.animationIndex = 0;
		var name = runningAnimation[self.animationIndex];
		console.log(name);
		self.setActiveSprite(name);
		lastAnimationUpdate = new Date().getTime();

	}
}


function EnvEntity(data) {
	var self = this;
	this.id = uniqueEntityId++;
	this.Type = 'env';
	this.ImageType = data.EntityType;
	var myDomId = `node-${self.id}`;
	var myImageId = `node-img-${self.id}`;
	var domNode = $(`<div class="game-entity static" id="${myDomId}" style="height: 64px; width: 64px; top: 500px; left: 100px"></div>`);
	$('#game-host').append(domNode);
	this.startX = settings.player.startX;
	this.startY = data.StartY;
	this.x = data.StartX;
	this.y = data.StartY;
	this.height = data.Height;
	this.width = data.Width;
	this.fullWidth;
	this.minX = data.MinX;
	this.maxX = data.MaxX;
	this.fullHeight
	switch (data.EntityType) {
		case 'BoxGround':
			self.ImageType = 'box-ground';
			break;
		case 'BoxSolid':
			self.ImageType = 'box-fixed';
			break;
		case 'BoxQuestion':
			self.ImageType = 'box-question';
			break;
		case 'BoxBrick':
			self.ImageType = 'box-brick';
			break;
		case 'Mario':
			break;
		case 'Gumba':
			break;
		case 'Turtle':
			break;
	}

	this.setupSprite = function () {
		var image = `img/sprites/env/${self.ImageType}.png`;
		var totalHeight = 64 * self.height;
		var totalWidth = 64 * self.width;
		//Visual.Height = totalHeight;
		//Visual.Width = totalWidth;

		self.fullWidth = totalWidth;
		self.fullHeight = totalHeight;
		if (self.height != 1 || self.width != 1) {
			// need to treat this as a background entity
		}
		document.getElementById(myDomId).style.top = self.y + 'px';
		document.getElementById(myDomId).style.left = self.x + 'px';
		document.getElementById(myDomId).style.height = self.fullHeight + 'px';
		document.getElementById(myDomId).style.width = self.fullWidth + 'px';
		document.getElementById(myDomId).style.backgroundImage = `url('${image}')`;
		document.getElementById(myDomId).style.backgroundRepeat = 'repeat';
	}

	this.animate = function () {

	}

	this.checkCollision = function (otherEntity) {
		if (self.isGone)
			return false;
		return self.x < otherEntity.x + otherEntity.fullWidth
			&& self.x + self.fullWidth > otherEntity.x
			&& self.y < otherEntity.y + otherEntity.fullHeight
			&& self.y + self.fullHeight > otherEntity.y;
	};
	this.setupSprite();
}

