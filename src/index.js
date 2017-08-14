import 'pixi';
import 'p2';
import 'phaser';

import pkg from '../package.json';

// This is the entry point of your game.
const config = {
	width: 800,
	height: 600,
	renderer: Phaser.AUTO,
	parent: '',
	state: {
		preload,
		create,
		update,
		jumpCheck,
		generateObs,
		restart
	},
	transparent: false,
	antialias: true,
	physicsConfig: { arcade: true },
};

const game = new Phaser.Game(config);
var sprite, pkmns = ['slwpk', 'sdwd', 'snrlx'], rnd, obstacles, jumpKey;

function preload() {
	this.game.load.spritesheet('red', 'assets/red.png', 26, 32);
	this.game.load.image('slwpk', 'assets/slwpk.png');
	this.game.load.image('sdwd', 'assets/sdwd.png');
	this.game.load.image('snrlx', 'assets/snrlx.png');
}

function create() {
	const { game } = this;

	this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'red');
	this.sprite.scale.setTo(2, 2);
	this.sprite.anchor.setTo(0.5, 0.5);

	game.physics.arcade.enable(this.sprite);
	this.sprite.body.bounce.y = 0.2;
	this.sprite.body.gravity.y = 980;
	this.sprite.body.collideWorldBounds = true;
	this.sprite.body.onCollide = new Phaser.Signal();
  this.sprite.body.onCollide.add(restart, this);

	this.sprite.animations.add('walk', [0, 1], 10, true);
	this.sprite.animations.play('walk');

	this.obstacles = game.add.group();
	this.obsGenerator = game.time.events.loop(Phaser.Timer.SECOND * 2.25, this.generateObs, this);
	this.obsGenerator.timer.start();

	this.jumpCount = 0;
	this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.jumpKey.onDown.add(this.jumpCheck, this);
}

function update() {
	if (this.sprite.position.y < 560) {
		this.sprite.animations.stop();
		this.sprite.frame = 0;
	} else {
		this.sprite.animations.play('walk');
		this.jumpCount = 0;
	}

	game.physics.arcade.collide(this.sprite, this.obstacles);
}

function jumpCheck() {
	if (this.jumpCount < 2){
		this.sprite.body.velocity.y = -500;
		this.jumpCount++;
	}
}

function generateObs() {  
	rnd = Math.floor(Math.random() * 3);
	var obs = game.add.sprite(game.world.width - 70, game.world.height - 60, pkmns[rnd]);
	this.obstacles.add(obs);

	game.physics.arcade.enable(obs);
	
	obs.body.velocity.x = -100 * rnd - 50;

	obs.checkWorldBounds = true;
	obs.outOfBoundsKill = true;
}

function restart() {
	game.add.text(game.world.width/2 - 40, 200, 'GG', { fontSize: '64px', fill: '#FFF' });
	this.sprite.kill();
}
