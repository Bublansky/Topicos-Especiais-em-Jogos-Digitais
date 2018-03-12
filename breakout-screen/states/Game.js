        /*
            Jogo BreakOut comentado
            Documentação: https://photonstorm.github.io/phaser-ce/Phaser.Game.html
        */
        
        //a estrutura do game é criado com os parametros passados
        //ordem -> width, height, renderer(optional), parent(optional), state (optional)
        //var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
var Game = function(game) {},
    ball,
    paddle,
    brick,
    bricks,
    ballOnPaddle = true,
    lives = 3,
    score = 0,
    alter = false,
    scoreText,
    livesText,
    introText,
    v1 = 10,
    v2 = 20,
    v3 = 30,
    v4 = 40,
    brickArray = [],
    s,
    conj = [],
    wallPositionFlagSound = 1,
    w = 800,
    h = 600,
    optionStyle = {font: '20pt TheMinion', fill: 'white', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
console.log(randomElements(5));

Game.prototype = {
    
        preload: function() {
            game.load.atlas('breakout', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
            game.load.image('starfield', 'assets/misc/starfield.jpg');
            //-- som do início do jogo 
			game.load.audio('start', 'assets/audio/SoundEffects/ball-origin-beep.ogg');
            //-- som da bola batendo na prancha			
			game.load.audio('paddle', 'assets/audio/SoundEffects/paddle-beep.ogg');
            //-- som da bola quebrando os blocos
			game.load.audio('blocks', 'assets/audio/SoundEffects/red-beep.ogg');
            //-- som da bola batendo na parede
			game.load.audio('wall', 'assets/audio/SoundEffects/wall-beep.ogg');
        },
        	   
        create: function() {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //--	Here we set-up our audio sprites
			startSound = game.add.audio('start');
			paddleSound = game.add.audio('paddle');
			blocksSound = game.add.audio('blocks');
			wallSound = game.add.audio('wall');
			//.allowMultiple = true;
			//.play();
            //  We check bounds collisions against all walls other than the bottom one
            // checa a fisica de colisao com a parte de baixo do jogo
            game.physics.arcade.checkCollision.down = false;
            //adiciona um plano de fundo ao jogo
            s = game.add.tileSprite(0, 0, 800, 600, 'starfield');
            bricks = game.add.group();
            bricks.enableBody = true; //true para dizer que o objeto tem um corpo
            bricks.physicsBodyType = Phaser.Physics.ARCADE; //a fisica do corpo é do tipo ARCADE
            //var brick;
            
            //atraves de matriz, é criado a quantidade de blocos presentes no game, com quatro linhas e quinze colunas
            //bricks.create -> cria os blocos com os parametros de: distancia no eixo x e y
            //utiliza o json, e pocura pelas png que contem 'brick', a medida que a linha é alterada, a figura muda
            //body.immovable permite o objeto ser imóvel, assim a bola bate no bloco e volta
            for (var y = 0; y < 4; y++)
            {
                for (var x = 0; x < 15; x++)
                {
                    brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
                    brick.body.bounce.set(1);
                    brick.body.immovable = true;
                    brickArray.push(brick);
                }
            }
            
            //add um sprite para o paddle, no centro do mundo
            paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
            //add a anchor na position -> width * 0.5, height * 0,5 do objeto
            paddle.anchor.setTo(0.5, 0.5);
            game.physics.enable(paddle, Phaser.Physics.ARCADE);
            //configura as funcoes do paddle
            paddle.body.collideWorldBounds = true;
            paddle.body.bounce.set(1);
            paddle.body.immovable = true; //true para dizer que o objeto é imovel em relação ao mundo
            //add um sprite para a ball, no centro do mundo
            //y-16 para subir a posicao
            ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
            ball.anchor.set(0.5);
            ball.checkWorldBounds = true;
        
            game.physics.enable(ball, Phaser.Physics.ARCADE);
            
            ball.body.collideWorldBounds = true;
            ball.body.bounce.set(1);
            
            //add uma animação para a ball
            ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);
            ball.events.onOutOfBounds.add(ballLost, this); //case a ball saia do mapa, é ativado a funcao ballLost
            //configura os textos presentes no game
            scoreText = game.add.text(32, 550, 'score: 0', optionStyle);
            livesText = game.add.text(680, 550, 'lives: 3', optionStyle);
            introText = game.add.text(game.world.centerX, 400, '- click to start -', optionStyle);
            introText.anchor.setTo(0.5, 0.5);
            
            pause_label = game.add.text(w - 100, 20, 'Pause', optionStyle);
            pause_label.inputEnabled = true;
            pause_label.events.onInputUp.add(function () {
                game.paused = true;
                menu = game.add.sprite(w/2,h/2, 'menu');
                menu.anchor.setTo(0.5,0.5);
                choiseLabel = game.add.text(w/2, h-150, 'Click outside menu to continue', {font: '30px Arial', fill: '#fff'});
                choiseLabel.anchor.setTo(0.5,0.5);
            });
            game.input.onDown.add(unpause,self);
            
            backMenuText = game.add.text(20,20, 'Menu', optionStyle);
            backMenuText.inputEnabled = true;
            backMenuText.events.onInputUp.add(function (){
               this.game.state.start("GameMenu"); 
            });
            
            //quando o game verifica que o usuario clicou, ele chama a funcao releaseBall
            game.input.onDown.add(releaseBall, this);
            
		},
        update: function () {
            //  Fun, but a little sea-sick inducing :) Uncomment if you like!
            //s.tilePosition.x += (game.input.speed.x / 2);
            //a medida que o mouse mova no eixo x, o paddle tambem move
            paddle.x = game.input.x;
            
            if (paddle.x < 24)
            {
                paddle.x = 24;
            }
            else if (paddle.x > game.width - 24)
            {
                paddle.x = game.width - 24;
            }
            if (ballOnPaddle)
            {
                //fazer a bola movimentar junto do paddle
                ball.body.x = paddle.x;
            }
            else
            {
                //configurar a colisao da ball com paddle e bricks
                game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
                game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
            }
            //---  inspeciona a posição da bola e verifica se está colidindo com a parede   
			if(ball.body.x <= wallPositionFlagSound - 1 || ball.body.x >= 785 - wallPositionFlagSound || ball.body.y < wallPositionFlagSound)
			{
				wallSound.play();
			}
        }
}
        function unpause(event){
            if(game.paused){
                console.log('error');
                var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
                    y1 = h/2 - 180/2, y2 = h/2 + 180/2;
                
                if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2){
                    var choisemap = ['one','two','three','four','five','six'];
                    
                    var x = event.x - x1,
                        y = event.y - y1;
                    
                    var choise = Math.floor(x/90) + 3*Math.floor(y/90);
                    
                    choiseLabel.text = 'You chose menu item' + choisemap[choise];
                }else{
                    menu.destroy();
                    choiseLabel.destroy();
                    
                    game.paused = false;
                }
            }
        };
        function randomElements(number){   
            var valor=0;
            for(var i=0;i<number;i++){
                valor = Math.random() * 60;
                conj.push(parseInt(valor));
            }
            
            return conj;
        }
        function releaseBall () {
            //configuracoes da bola apos sair do paddle
            if (ballOnPaddle)
            {
                //-- som de inicio de jogo
				paddleSound.play();
                ballOnPaddle = false; //false para dizer que a bola não está no paddle
                ball.body.velocity.y = -300; //configura uma velocity aleatoria no eixo y
                ball.body.velocity.x = -75; //configura uma velocity aleatoria no eixo x
                ball.animations.play('spin');
                introText.visible = false; //deixa o introText não mais visivel
            }
        }
        function ballLost () {
            //quando a bola sai do game, o usuario perde vidas
            //caso lives nao seja igual a zero, o game é resetado para o estado original
            //caso seja zero, é chamado a funcao gameOver
            lives--;
            livesText.text = 'lives: ' + lives;
            if (lives === 0)
            {
                gameOver();
            }
            else
            {
                ballOnPaddle = true;
                ball.reset(paddle.body.x + 16, paddle.y - 16);
                ball.animations.stop();
            }
        }
        function gameOver () {
            //zera a velocidade da bola em ambos os eixos
            ball.body.velocity.setTo(0, 0);
            introText.text = 'Game Over!';
            introText.visible = true;
        }
        
        function calc(_vel) {
            if(_vel > 0) return 1;
            else return -1;
        }
        function bonus(_ball,_brick){
            
             var item=Math.random()*3;
            
                 for(var i =0;i < brickArray.length;i++){
                     if((brickArray[i].position.x == _brick.position.x) && (brickArray[i].position.y == _brick.position.y )){
                         
                         if(brickArray.indexOf(i) && parseInt(item)==0){
                            
                            _ball.body.velocity.x += calc(_ball.body.velocity.x) * 200;
                            _ball.body.velocity.y += calc(_ball.body.velocity.y) * 200;
                             alter=true;
                         }else if(brickArray.indexOf(i) && (parseInt(item)==1)){
                             //console.log('Vida: ',lives);
                             //lives+=1;
                             //console.log('Vida: ' + lives);
                         }else if(brickArray.indexOf(i) && (parseInt(item)==2)){
                             console.log('3');
                             score+=500;
                         }
                       
                     }
                 }
            
        }
        function quebraAdj (_ball,_brick) {
             
            if(_ball.body.velocity.y > 600){
                  
                
                for(var i =0;i < brickArray.length;i++){
                    if((brickArray[i].position.x == _brick.position.x) && (brickArray[i].position.y == _brick.position.y )){
                        console.log(i);
                        if(i==0 || i==15 || i==30 || i== 45){
                             brickArray
                             brickArray[i+1].kill();
                        }else if(i==14 || i==29 ||i==44 || i== 59){
                             brickArray[i-1].kill();
                        }else{
                              brickArray[i-1].kill();
                              brickArray[i+1].kill();
                         }
                     }
                }  
                  
             }else{
                bonus(_ball,_brick);
                 
             }
           }
              
        function ballHitBrick (_ball, _brick) {
            //-- som da colisão nos blocos
			blocksSound.play();
             _brick.kill();
            //se tocar no brick, ele é destruido
            if(_brick.position.y == 256){
                score+=10;
                quebraAdj(_ball,_brick);
            }else if(_brick.position.y == 204){
                score+=15;
                 quebraAdj(_ball,_brick);
            }else if(_brick.position.y == 152){
                score+=20;
                 quebraAdj(_ball,_brick);
            }else if(_brick.position.y == 100){
                score+=25;
                quebraAdj(_ball,_brick);
            }
             for(var i =0;i < brickArray.length;i++){
                
            }
            if(alter){
            switch(_brick.position.y) {
                case 100:
                    _ball.body.velocity.x += calc(_ball.body.velocity.x) * v4;
                    _ball.body.velocity.y += calc(_ball.body.velocity.y) * v4;
                    
                    break;
                case 152:
                    _ball.body.velocity.x += calc(_ball.body.velocity.x) * v3;
                    _ball.body.velocity.y += calc(_ball.body.velocity.y) * v3;
                    break;
                case 204:
                    _ball.body.velocity.x += calc(_ball.body.velocity.x) * v2;
                    _ball.body.velocity.y += calc(_ball.body.velocity.y) * v2;
                    break;
                case 256:
                    _ball.body.velocity.x += calc(_ball.body.velocity.x) * v1;
                    _ball.body.velocity.y += calc(_ball.body.velocity.y) * v1;
                    //_brick.body.bounce.set(20);
                    break;
            }
                alter = false;
            }

            scoreText.text = 'score: ' + score;
            
            //   vx.text = 'x: ' + _brick.position.x;
            //    vy.text = 'y: ' + _brick.position.y;
            //  Are they any bricks left?
            if (bricks.countLiving() == 0)
            {
                //  New level starts
                score += 1000;
                scoreText.text = 'score: ' + score;
                introText.text = '- Next Level -';
                //  Let's move the ball back to the paddle
                ballOnPaddle = true;
                ball.body.velocity.set(0);
                ball.x = paddle.x + 16;
                ball.y = paddle.y - 16;
                ball.animations.stop();
                //  And bring the bricks back from the dead :)
                bricks.callAll('revive');
            }
        }
        function ballHitPaddle (_ball, _paddle) {
            //-- som da prancha		
			paddleSound.play();
            var diff = 0;
            //verifica em que posicao a ball tocou no paddle para calcular sua velocidade
            
            
            ball.body.velocity.y = -300; //configura uma velocity aleatoria no eixo y
            ball.body.velocity.x = -75; //configura uma velocity aleatoria no eixo x
    
            
            if (_ball.x < _paddle.x)
            {
                //  Ball is on the left-hand side of the paddle
                diff = _paddle.x - _ball.x;
                _ball.body.velocity.x = (-10 * diff);
                
            }
            else if (_ball.x > _paddle.x)
            {
                //  Ball is on the right-hand side of the paddle
                diff = _ball.x -_paddle.x;
                _ball.body.velocity.x = (10 * diff);
            }
            else
            {
                //  Ball is perfectly in the middle
                //  Add a little random X to stop it bouncing straight up!
                _ball.body.velocity.x = 2 + Math.random() * 8;
            }  
        }