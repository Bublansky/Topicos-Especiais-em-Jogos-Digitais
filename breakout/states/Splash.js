var Splash = function () {};


game.global = {
		score: 0,
        lives: 3,
        Game1:true,
        Game2:false,
        Game3:false
};
    
Splash.prototype = {
   
    
  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('mixins', 'lib/mixins.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('gamemenu','states/GameMenu.js');
    game.load.script('game', 'states/Game.js');
    
    game.load.script('gameover','states/GameOver.js');
    game.load.script('Wins','states/Wins.js');
    game.load.script('credits', 'states/Credits.js');
    game.load.script('options', 'states/Options.js');
   
    
  },

  loadBgm: function () {
    // thanks Kevin Macleod at http://incompetech.com/
    game.load.audio('dangerous', 'assets/audio/Dangerous.mp3');
    game.load.audio('exit', 'assets/audio/Exit the Premises.mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    //game.load.image('space-bg', 'assets/images/mario_menu_bg.png');
	game.load.image('space-bg', 'assets/images/space-bg.jpg');
    game.load.image('menu-bg', 'assets/images/space-bg.png');
    game.load.image('options-bg', 'assets/images/options-bg.jpg');
    game.load.image('gameover-bg', 'assets/images/mario-game-over-2.png');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['SuperMario256'],
        urls: ['assets/style/myCSS.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
    game.add.sprite(0, 0, 'stars');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);
      
    game.load.image('mario-background', 'assets/images/mario_theme/mario-background.jpg');
	game.load.spritesheet('mario_brick', 'assets/images/mario_theme/brick_mario.png', 16, 16);
	game.load.spritesheet('shell_turtle', 'assets/images/mario_theme/shell_turtle_31x24px.png', 31, 24);
	game.load.spritesheet('mario-paddle', 'assets/images/mario_theme/paddle_mario_50x34px.png', 50, 34);
		
    game.load.atlas('breakout', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
    game.load.image('starfield', 'assets/misc/starfield.jpg');
    //-- som do início do jogo 
	game.load.audio('start', 'assets/audio/SoundEffects/mario_sounds/start_sound.wav');
      //-- som da bola batendo na prancha			
	game.load.audio('paddle', 'assets/audio/SoundEffects/mario_sounds/paddle_collide.wav');
	//game.load.audio('paddle', 'assets/audio/SoundEffects/paddle-beep.ogg');
    //-- som da bola quebrando os blocos
	game.load.audio('blocks', 'assets/audio/SoundEffects/mario_sounds/brick_break.wav');
	//game.load.audio('blocks', 'assets/audio/SoundEffects/red-beep.ogg');
    //-- som da bola batendo na parede
	game.load.audio('wall', 'assets/audio/SoundEffects/mario_sounds/wall_hit.wav');
	//game.load.audio('wall', 'assets/audio/SoundEffects/wall-beep.ogg');
	game.load.audio('addScore', 'assets/audio/SoundEffects/mario_sounds/add_score.wav');
	
	game.load.audio('addLife', 'assets/audio/SoundEffects/mario_sounds/life_up.wav');

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {
    game.state.add("Wins",Wins);
    game.state.add("GameMenu",GameMenu);
    game.state.add("Game",Game);
    game.state.add("GameOver",GameOver);
    game.state.add("Credits",Credits);
    game.state.add("Options",Options);
   
  },

  addGameMusic: function () {
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};
