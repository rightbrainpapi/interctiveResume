
    var ctx = null;
    var tileW = 40, tileH = 40;
    var mapW = 20, mapH = 20;

    var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
    var lastFrameTime = 0;

    var viewport = {
        screen		: [0,0],
        startTile	: [0,0],
        endTile		: [0,0],
        offset		: [0,0],

        update		: function(px, py) {
            this.offset[0] = Math.floor((this.screen[0]/2) - px);
            this.offset[1] = Math.floor((this.screen[1]/2) - py);
            var tile = [ Math.floor(px/tileW), Math.floor(py/tileH) ];

            this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileW);
            this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileH);
        

		    if(this.startTile[0] < 0) { this.startTile[0] = 0; }
            if(this.startTile[1] < 0) { this.startTile[1] = 0; }
        
            this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileW);
		    this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileH);

		    if(this.endTile[0] >= mapW) { this.endTile[0] = mapW; }
		    if(this.endTile[1] >= mapH) { this.endTile[1] = mapH; }
        }
    };
    // defining the floror types - tells you whether the character can walk on it
    var floorTypes = {
        solid : 0,
        path  : 1,
        water : 2
    };


    // Defines the actual tile type
    //We're creating 5 types of tile here, but with this we can easily just add to this list when we want to add new tiles of different types to the gameMap array:
    var tileTypes = {
        0 : { colour:"#685b48", floor:floorTypes.solid	},
        1 : { colour:"#5aa457", floor:floorTypes.path	},
        2 : { colour:"#e8bd7a", floor:floorTypes.path	},
        3 : { colour:"#286625", floor:floorTypes.solid	},
        4 : { colour:"#678fd9", floor:floorTypes.water	}
    };

    var keysDown = {
        37: false,
        38: false,
        39: false,
        40: false
    };

    var player = new Character();


    var gameMap = [
        0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 2, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 0,
        0, 2, 3, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 0,
        0, 2, 3, 1, 4, 4, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 0,
        0, 2, 3, 1, 1, 4, 4, 1, 2, 3, 3, 2, 1, 1, 2, 1, 0, 0, 0, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 2, 4, 4, 4, 4, 4, 1, 1, 1, 2, 2, 2, 2, 1, 0,
        0, 1, 1, 1, 1, 2, 3, 2, 1, 1, 4, 1, 1, 1, 1, 3, 3, 2, 1, 0,
        0, 1, 2, 2, 2, 2, 1, 2, 1, 1, 4, 1, 1, 1, 1, 1, 3, 2, 1, 0,
        0, 1, 2, 3, 3, 2, 1, 2, 1, 1, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4,
        0, 1, 2, 3, 3, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0,
        0, 1, 2, 3, 4, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0,
        0, 3, 2, 3, 4, 4, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 1, 0,
        0, 3, 2, 3, 4, 4, 3, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 3, 0,
        0, 3, 2, 3, 4, 1, 3, 2, 1, 3, 1, 1, 1, 2, 1, 1, 1, 2, 3, 0,
        0, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 2, 2, 2, 2, 2, 3, 0,
        0, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 4, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
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

             if(this.tileTo[0] != this.tileFrom[0]){
                 var diff = (tileW/ this.delayMove) * (t- this.timeMoved);
                 this.position[0]+=(this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
             }
             if(this.tileTo[1] != this.tileFrom[1]){
                var diff = (tileH/ this.delayMove) * (t- this.timeMoved);
                this.position[1]+=(this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff); // Check to see
            }
            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
         }
         return true;
    };

    // CanMoveTo method
    //Checks to see if the character can move to a specific maptile
    Character.prototype.canMoveTo = function(x, y)
{
	if(x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
	if(tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.path) { return false; }

	return true; //If these checks have passed, we can move here so, we can return true and close the method.
};

//These Short hand methods call the canMoveTo method
//These methods will simply call the canMoveTo method, passing as arguments the Characters current position (tileFrom) with the x or y values modified according to the direction we're trying to move in, and return the result
Character.prototype.canMoveUp		= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1); };
Character.prototype.canMoveDown 	= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1); };
Character.prototype.canMoveLeft 	= function() { return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]); };
Character.prototype.canMoveRight 	= function() { return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]); };

//  Corrdinal direct Movement
//  simply take the current game time (in milliseconds) as their argument, and modify the tileTo x or y properties as needed for the target direction.
Character.prototype.moveLeft	= function(t) { this.tileTo[0]-=1; this.timeMoved = t; };
Character.prototype.moveRight	= function(t) { this.tileTo[0]+=1; this.timeMoved = t; };
Character.prototype.moveUp	    = function(t) { this.tileTo[1]-=1; this.timeMoved = t; };
Character.prototype.moveDown	= function(t) { this.tileTo[1]+=1; this.timeMoved = t; };


    function toIndex(x,y){
        return ((y * mapW) + x);
    }

    //function to handle load event of the window
    window.onload = function()
    {
            ctx = document.getElementById('game').getContext('2d'); // this is the 2d drawing context 
            requestAnimationFrame(drawGame); // when the window is ready we will handle drawing the context with our drawgame function
            ctx.font = "bold 10pt sans serif"; //setting the font that will be use for drawing the frame rate
            img = new Image,    
          // Sourcing Image for Canvas
          img.src = 'https://cdn.glitch.com/294217ab-b9f2-4ff1-8ca1-4fe6ab5c1109%2Felevator.svg?v=1581876601861';
   

          window.addEventListener("keydown", function(e){
            if (e.defaultPrevented) {
                return; // Do nothing if event already handled
              }
                // if(e.keyCode>=37 && e.keyCode<=40){
                //     keysDown[e.keyCode] = true;
                // }
                switch(e.code) {
                    case "KeyA":
                    case "ArrowLeft":
                      // Handle "turn left"
                      keysDown[37] = true;
                      break;
                    case "KeyW":
                    case "ArrowUp":
                      // Handle "forward"
                      keysDown[38] = true;
                      break;
                    case "KeyD":
                    case "ArrowRight":
                      // Handle "turn right"
                      keysDown[39] = true;
                      break;
                    case "KeyS":
                    case "ArrowDown":
                      // Handle "back"
                      keysDown[40] = true;
                      break;
                  }


      });

      //code that checks the Canvas dimensions and stores it in the viewport objects screen property
      viewport.screen = [document.getElementById('game').width,
      document.getElementById('game').height];
};



// drawing the game board
function drawGame()
{
    if(ctx==null){return;}

    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - lastFrameTime;

        var sec = Math.floor(Date.now()/1000);
        if (sec!=currentSecond)
        {
            currentSecond = sec;
            framesLastSecond = frameCount;
            frameCount = 1;  
    }
    else{frameCount++;}

// check whether the player is processing movement
if(!player.processMovement(currentFrameTime))
{
    if(keysDown[38] && player.canMoveUp())		{ player.moveUp(currentFrameTime); }
    else if(keysDown[40] && player.canMoveDown())	{ player.moveDown(currentFrameTime); }
    else if(keysDown[37] && player.canMoveLeft())	{ player.moveLeft(currentFrameTime); }
    else if(keysDown[39] && player.canMoveRight())	{ player.moveRight(currentFrameTime); }

                // resetting the keydowns to false so that it doesnt continue to move
                keysDown[37] = false;
                keysDown[38] = false;
                keysDown[39] = false;
                keysDown[40] = false;
}

// We'll set the viewport centre to the following x, y:
viewport.update(player.position[0] + (player.dimensions[0]/2),
player.position[1] + (player.dimensions[1]/2));


ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);


for(var y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y)
{
    for(var x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x)
    {

        //This simply changes our Canvas drawing context (ctx) fill colour to the colour corresponding to the gameMap array tile value found at the index returned from the toIndex method for the current x,y loop values in the tileTypes array!sets the canvas  
        ctx.fillStyle = tileTypes[gameMap[toIndex(x,y)]].colour;

            // the drawing code for drawing each tile to add the viewport offset value to the x and y coordinates of the tiles rectangle.
			ctx.fillRect( viewport.offset[0] + (x*tileW), viewport.offset[1] + (y*tileH),
				tileW, tileH);


        }
    }
    ctx.fillStyle = "#0000ff"; // Blue Character
    //Finally, we need to also add the offset values to the position at which our player will be drawn:
    ctx.fillRect(viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1],
		player.dimensions[0], player.dimensions[1]);

    ctx.fillStyle = '#ff0000';
    ctx.fillText("FPS: " + framesLastSecond, 10, 20);

    lastFrameTime = currentFrameTime;
    requestAnimationFrame(drawGame);




//////////////////////
// Elevator Operation
//////////////////////
    // img.addEventListener('load', function () {

    //     var interval = setInterval(function() {
    //       var x = 405, y = 400;
          
    //       return function () {
    
    //         // Clear function
    //         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //         // Drawing image
    //         ctx.drawImage(img, x, y, 80, 77); //size
    
    //         // moving the image up and down
    //         y -= 1;
    //         if (y < -130) {
    //           y = 400;
    //         }
    //       };
    //     }(), 1000/40); // speed
    //   }, false);
////////////////////////////
// End of Elevator Operation
////////////////////////////
}

