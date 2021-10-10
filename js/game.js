function Game() {
	var self = this;
	this.Entities = [];
	this.Player = new PlayerEntity();
	this.Entities.push(self.Player);

	this.DrawFrame = function () {
		console.log('frame');
		self.Entities.forEach(e => {
			e.Animate();
		});
	};
	setInterval('vm.DrawFrame()', 50, 50);
}

function PlayerEntity() {
	var self = this;
	var groundLevel = 500;
	var domNode = $('<div class="game-entity player" id="the-player" style="height: 220px; width: 100px; top: 500px; left: 100px"><img src="" height="220" width="100" alt="hellen" /></div>');
	$('#game-host').append(domNode);
	this.X = 100;
	this.Y = 500;
	this.Height = 220;
	this.Width = 50;

	this.InertiaX = 0;
	this.InertiaY = 0
	this.IsOnGround = true;
	this.HandleInput = function (input) {
		console.log("'" + input + "'");
		//todo: make this handle our input
		switch (input) {
			//todo: handle not reversing direction instantly
			case 'ArrowRight':
				self.InertiaX = 7;
				self.Direction = 'Right';
				break;
			case 'ArrowLeft':
				self.InertiaX = -7;
				self.Direction = 'Left'
				break;
			case ' ':
				if (self.IsOnGround) {
					self.InertiaY = -10;
					self.IsOnGround = false;
					self.Action = 'Jump';
				}
				break;
		}
	};
	this.ActiveImage = '';
	this.Action = 'Standing';
	this.Direction = 'Right';
	this.CheckColision = function (otherEntity) {
		// todo: check if we hit the other entity and if so return true
		return false;
	};
	this.UpdateDOM = function () {
		document.getElementById('the-player').style.top = self.Y + 'px';
		document.getElementById('the-player').style.left = self.X + 'px';
		var imageToShow = '';
		switch (self.Action) {
			case 'Run':
				if (self.Direction == 'Right') {
					//todo: handle running right
					imageToShow = 'RunRight';
				} else {
					//todo: handle running left
					imageToShow = 'RunLeft';
				}
				break
			case 'Jump':
				if (self.Direction == 'Right') {
					//todo: handle jumping right
					imageToShow = 'JumpRight';
				} else {
					//todo: handle jumping left
					imageToShow = 'JumpLeft';
				}
				break;
			case 'Standing':
				//todo handle standing
				imageToShow = "Standing";
				break
		}
		if (self.ActiveImage != imageToShow) {
			self.ActiveImage = imageToShow;
			document.getElementById('the-player').childNodes[0].src = 'img/' + imageToShow + '.png';
		}
		// update the stats section
		document.getElementById('X').innerText = self.X;
		document.getElementById('InertiaX').innerText = self.InertiaX;
		document.getElementById('Y').innerText = self.Y;
		document.getElementById('InertiaY').innerText = self.InertiaY;
		document.getElementById('IsOnGround').innerText = self.IsOnGround;
		document.getElementById('Direction').innerText = self.Direction;
		document.getElementById('Action').innerText = self.Action;
		document.getElementById('ActiveImage').innerText = document.getElementById('the-player').childNodes[0].src;
	}
	this.Animate = function () {
		if (self.InertiaX !== 0) {
			self.X = self.InertiaX + self.X;
			if (self.InertiaX > 0)
				self.InertiaX = self.InertiaX - 1;
			else
				self.InertiaX = self.InertiaX + 1;
			self.Action = 'Run';
		} else if (self.Action != 'Jump') {
			// we are no longer moving forward or backwords so make our image show standing
			self.Action = 'Standing';
		}
		if (self.InertiaY !== 0) {
			self.Y = self.InertiaY + self.Y;
			//todo: apply y inertia to y position
			// todo: figure out gravity once we get to 0
			if (self.InertiaY < 0)
				self.InertiaY = self.InertiaY + 1;
			else {
				console.log('inertia run out')
				if (self.Y < groundLevel) {
					self.InertiaY = self.InertiaY + 2;
				} else {
					self.IsOnGround = true;
					self.Y = groundLevel;
					self.InertiaY = 0;
					self.Action = 'Standing';
				}
			}

			if (self.Y == groundLevel) {
				self.IsOnGround = true;
				self.Y = groundLevel;
				self.Inertia = 0;

			}

		} else {
			if (self.Y < groundLevel) {
				self.InertiaY = self.InertiaY + 2;
			}
		}
		self.UpdateDOM();
	};


}