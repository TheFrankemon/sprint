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
		jump,
		generateObs
	},
	transparent: false,
	antialias: true,
	physicsConfig: { arcade: true },
};

const game = new Phaser.Game(config);
var sprite, pkmns = ['slwpk', 'sdwd', 'snrlx'], rnd, obs;

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
	this.sprite.frame = 1;
	
	this.sprite.body.bounce.y = 0.2;
	this.sprite.body.gravity.y = 980;
	this.sprite.body.collideWorldBounds = true;

	this.sprite.animations.add('walk', [0, 1], 10, true);

	this.obsGenerator = game.time.events.loop(Phaser.Timer.SECOND * 2.25, this.generateObs, this);
	this.obsGenerator.timer.start();

	var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	spaceKey.onDown.add(this.jump, this);
}

function update() {
	game.physics.arcade.collide(this.sprite, this.obs);
}

function jump() {
	this.sprite.body.velocity.y = -450;
	this.sprite.animations.play('walk');
}

function generateObs() {  
	rnd = Math.floor(Math.random() * 3);
	this.obs = game.add.sprite(game.world.width - 70, game.world.height - 60, pkmns[rnd]);
	game.physics.arcade.enable(this.obs);
	
	this.obs.body.collideWorldBounds = true;
	this.obs.enableBody = true;

	this.obs.body.velocity.x = -200;
}