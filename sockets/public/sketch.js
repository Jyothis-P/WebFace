
var socket;

function setup() {
  createCanvas(400, 400);
  background(0);
  socket = io('http://localhost:3000/')
  socket.on('mouse',

    function(data) {
      console.log("Got: " + data.x + " " + data.y);

      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
  );
}

function draw() {
  // Nothing
}

function mouseDragged() {
  fill(255);
  noStroke();
  ellipse(mouseX,mouseY,20,20);
  sendmouse(mouseX,mouseY);
}

function sendmouse(xpos, ypos) {
  console.log("sendmouse: " + xpos + " " + ypos);
  var data = {
    x: xpos,
    y: ypos
  };
  socket.emit('mouse',data);
}



