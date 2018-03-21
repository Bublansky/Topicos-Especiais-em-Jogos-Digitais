var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 250
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "BreakOut", {
      font: 'bold 60pt SuperMario256',
      //fill: '#FDFFB5',
      //fill: '#FFF',
	  fill: '#f70000',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },
    
  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt SuperMario256', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 300, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;


  },

  create: function () {
    game.global.score =0;
    game.global.lives =3;
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
