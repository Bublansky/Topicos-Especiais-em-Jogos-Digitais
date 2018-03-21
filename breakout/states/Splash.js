var Splash = function () {};


game.global = {
		score: 0,
        lives: 3
};
    
Splash.prototype = {
   
    
  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('mixins', 'lib/mixins.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('gamemenu','states/GameMenu.js');
    game.load.script('game', 'states/Game.js');
    game.load.script('game2', 'states/Game2.js');
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
    game.state.add("Game2",Game2);
   
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
