var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 250
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "BreakOut", {
      font: 'bold 60pt TheMinion',
      //fill: '#FDFFB5',
      //fill: '#FFF',
	  fill: '#f70000',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  create: function () {

    if (music.name !== "dangerous" && playMusic) {
      music.stop();
      music = game.add.audio('dangerous');
      music.loop = true;
      music.play();
    }
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

    this.addMenuOption('Single Player', function () {
      music.stop();
      game.state.start("Game");
    });
    this.addMenuOption('Multi Player', function() {
       game.state.start("Multi"); 
    });
    //this.addMenuOption('Options', function () {
      //game.state.start("Options");
    //});
    //this.addMenuOption('Credits', function () {
    //  game.state.start("Credits");
    //});
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
