
    var ctx = null;
    var tileW = 40, tileH = 40;
    var mapW = 10, mapH = 10;

    var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
    var lastFrameTime = 0;

    var keysDown = {
        37: false,
        38: false,
        39: false,
        40: false
    };

    var player = new Character();


    var gameMap = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 0, 0, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    function Character(){
        this.tileFrom = [1,1]; //track current tile position
        this.tileTo = [1,1]; // distination tile
        this.timeMoved = 0; // time move ment began to destination
        this.dimensions = [30,30]; // deminsion of chracter in pixels
        this.position = [45,45]; // the exact position relative to the top left corner of map in px
        this.delayMove = 700; // time it takes the character to move exactly 1 tile
    }
    Character.prototype.placeAt = function(x,y){
        // this method places the character to the destination tile
        this.tileFrom   = [x, y];
        this.tileTo     = [x,y];
        this.position   = [((tileW*x) + 
            ((tileW - this.dimensions[0])/2)),
            ((tileH *y) + (tileH-this.dimensions[1])/2)];
    };

    Character.prototype.processMovement = function(t){
        //if character is moving return true. if the character is not moving return false.
         if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]){
             return false;
         }
         if((t-this.timeMoved)>= this.delayMove){
             this.placeAt(this.tileTo[0], this.tileTo[1]);
         }else{
             this.position[0] = (this.tileFrom[0] * tileW ) + ((tileW - this.dimensions[0])/2);
             this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1])/2);

             if(this.tile[0] != this.tileFrom[0]){
                 var diff = (tileW/ this.delayMove) * (t- this.timeMoved);
                 this.position[0]+=(this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
             }
             if(this.tile[1] != this.tileFrom[1]){
                var diff = (tileH/ this.delayMove) * (t- this.timeMoved);
                this.position[1]+=(this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff); // Check to see
            }
         }
    }

    //function to handle load event of the window
    window.onload = function()
    {
            ctx = document.getElementById('game').getContext('2d'); // this is the 2d drawing context 
            requestAnimationFrame(drawGame); // when the window is ready we will handle drawing the context with our drawgame function
            ctx.font = "bold 10pt sans serif"; //setting the font that will be use for drawing the frame rate
            img = new Image,
            // ctx = document.getElementById('animated').getContext('2d');
          
          // Sourcing Image for Canvas
          img.src = 'https://cdn.glitch.com/294217ab-b9f2-4ff1-8ca1-4fe6ab5c1109%2Felevator.svg?v=1581876601861';
   
        };



// drawing the game board
function drawGame()
{
    if(ctx==null){return;}
        var sec = Math.floor(Date.now()/1000);
        if (sec!=currentSecond)
        {
            currentSecond = sec;
            framesLastSecond = frameCount;
            frameCount = 1;  
    }
    else{frameCount++;}

    for (var y = 0; y < mapH; y++)
        {
        for (var x = 0; x < mapW; x++)
            {
                switch(gameMap[((y*mapW)+x)])
                {
                   // if wall is present
                    case 0:
                        ctx.fillStyle = '#999999';
                        break;
                    default:
                        ctx.fillStyle = '#eeeeee';
            }
            // drawing rectangle at coresponding position for case tile (either 0 or 1 )
            ctx.fillRect(x*tileW, y*tileH, tileW, tileH );
        }
    }
    ctx.fillStyle = '#ff0000';
    ctx.fillText("FPS: " + framesLastSecond, 10, 20);

    requestAnimationFrame(drawGame);




//////////////////////
// Elevator Operation
//////////////////////
    img.addEventListener('load', function () {

        var interval = setInterval(function() {
          var x = 405, y = 400;
          
          return function () {
    
            // Clear function
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // Drawing image
            ctx.drawImage(img, x, y, 80, 77); //size
    
            // moving the image up and down
            y -= 1;
            if (y < -130) {
              y = 400;
            }
          };
        }(), 1000/40); // speed
      }, false);
////////////////////////////
// End of Elevator Operation
////////////////////////////
}
