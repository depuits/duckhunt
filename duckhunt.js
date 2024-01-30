
var Duckhunt = {
	create(rootId) {
		var duckhunt = Object.create(Duckhunt);
		duckhunt.init(rootId);

		return duckhunt;
	},
	init(rootId) {
		this.ducks = [];

		this.maxDucks = 5,
		this.duckSpawnDelay = [500, 2000];
		this.duckSpawnVelX = [0.05, 0.5];
		this.duckSpawnVelY = [-0.2, 0.2];

		var parent = document.getElementById(rootId);

		// create space
		this.visuals = document.createElement("div");
		this.visuals.setAttribute("style", `
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			overflow: hidden;
			pointer-events: none;
		`);

		parent.appendChild(this.visuals);

		this.step(0);
	},
	// spawn ducks
	hatchDuck() {
		var d = Object.create(this.Duck);
		d.init(this);

		return d;
	},

	getRandom(range) {
		return Math.random() * (range[1] - range[0]) + range[0];
	},

	step(timeStamp) {
		if (this.lastTime === undefined) {
			this.lastTime = timeStamp;
		}
		const deltaTime = timeStamp - this.lastTime;
		this.lastTime = timeStamp;

		if (this.nextSpawnTime) {
			if (this.nextSpawnTime < timeStamp) {
				this.nextSpawnTime = undefined;
				var d = this.hatchDuck();

				d.velX = this.getRandom(this.duckSpawnVelX);
				d.velY = this.getRandom(this.duckSpawnVelY);

				var bounds = this.visuals.getBoundingClientRect();

				d.x = -100;
				d.y = this.getRandom([0, bounds.bottom - 76]);
			}
		} else {
			if (this.ducks.length < this.maxDucks) {
				this.nextSpawnTime = timeStamp + this.getRandom(this.duckSpawnDelay);
			}
		}

		for (var i = 0; i < this.ducks.length; ++i) {
			this.ducks[i].tick(deltaTime);
		}

		//trigger next tick
		var id = requestAnimationFrame(t => this.step(t));
	}
};

Duckhunt.Duck = {
	init(game) {
		this.game = game;
		this.visual = document.createElement("span");
		this.visual.setAttribute("class", "duck");

		this.game.visuals.appendChild(this.visual);

		this.visual.addEventListener("click", (e) => { this.onClicked(e); });
		this.game.ducks.push(this);

		this.x = 0;
		this.y = 0;

		this.velX = 0.1;
		this.velY = 0.02;

		this.deadTime = 0;
		this.fallSpeed = 0;

		this.gravity = 0.00981;
		this.killedDelay = 400;
	},
	destroy() {
		this.game.visuals.removeChild(this.visual);
		delete this.visual;

		const index = this.game.ducks.indexOf(this);
		this.game.ducks.splice(index, 1);
	},

	onClicked(e) {
		e.stopPropagation();
		this.visual.classList.add("dead");
		this.isDead = true;
	},
	tick(dTime) {
		if (this.isDead) {
			this.deadTime += dTime;
			if (this.deadTime > this.killedDelay) {
				// fall down
				this.fallSpeed += this.gravity * dTime;
				this.fallSpeed = Math.min(this.fallSpeed, 1);
				this.y += this.fallSpeed * dTime;
			}
		} else {
			// fly
			this.x += this.velX * dTime;
			this.y += this.velY * dTime;
		}

		// update the graphic
		this.visual.setAttribute("style", `top: ${this.y}px; left: ${this.x}px;`);

		// despawn dead or gone ducks
		var bounds = this.game.visuals.getBoundingClientRect();
		if ((this.isDead && bounds.bottom < this.y) || bounds.right < this.x) {
			this.destroy();
		}

		if (!this.isDead && (bounds.bottom < this.y + 76 || this.y < 0)) {
			this.velY *= -1;
		}
	}
};
