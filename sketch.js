//december 01 2015
//paula ceballos

//setup variables
var font;
var button;
var play;
var board;

//sketch variables
var sketches = []; // images
var tempImg;
var count = 0;
var doodlePaths;
var doodleArray = [];
var index;

//carousel variables
var currentIndex = 0;
var imgArray = [];
var memePaths = [];

var savedtime = 0;
var pasttime = 0;
var state = 1;



function preload() {
  board = loadImage('chalkboard.jpg');
  font = loadFont('Chalk.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //turn off pixel scaling in retina devices
  //it throws off the createGraphics function
  devicePixelScaling(false);

  //go to the initial state
  initialState();

  //save button
  button = createButton('save & finish');
  button.position(width - 100, height - 30);
  button.mousePressed(saveDoodle);

  //play button
  play = createButton('play doodles');
  play.position(15, height - 30);
  play.mousePressed(prepareToDisplayImages);

  // create new tempImg
  tempImg = createGraphics(windowWidth, windowHeight);

}

function draw() {
  initialState();
  
  if (state == 1) {
    
    //Draw the last sketch on the screen. 
    var num = sketches.length - 1;
    if (sketches.length != 0) {
      image(sketches[num], 0, 0);
    }
    //draw the images from the createGraphics function
    image(tempImg, 0, 0);
    
  } else if (state == 0) {
    
    push();
    blendMode(SCREEN);
    image(imgArray[currentIndex], 0, 0, windowWidth, windowHeight);
    pop();
    
    //TIMER FOR CAROUSEL DISPLAY
    
    //timer is set to loop through images
    pasttime = frameCount - savedtime;
    if (pasttime % 20 == 0) {
      currentIndex++;
    }
    if (currentIndex > imgArray.length - 1) {
      // currentIndex = 0; // Return to first frame
      // go back to the initial state, without resetting any variables
      state = 1;
      currentIndex = 0;
    }
  }
}

function mouseDragged() {
  // draw the line on the createGraphics layer
  tempImg.stroke(255);
  tempImg.strokeWeight(2);
  tempImg.line(pmouseX, pmouseY, mouseX, mouseY);

}

function saveDoodle() {
  // save into array
  sketches.push(tempImg);

  // save as jpg file for next user
  index = sketches.length - 1;
  saveCanvas(sketches[index], 'images/doodle' + index + '.jpg');

  //save user 1 & 2 images together for sketch history carousel
  var sketchEvol = createGraphics(windowWidth, windowHeight);
  var index2 = sketches.length;
  if (index2 > 1) {
    for (var i = index2 - 2; i < index2; i++) {
      sketchEvol.image(sketches[i], 0, 0, windowWidth, windowHeight);
    }
  } else if (index2 == 1) { // exception
    for (var i = index2 - 1; i < index2; i++) {
      sketchEvol.image(sketches[i], 0, 0, windowWidth, windowHeight);
    }
  }
  saveCanvas(sketchEvol, 'sketchEvol' + index + '.jpg', 'jpg');


  // create new tempImg
  tempImg = createGraphics(width, height);
}

function prepareToDisplayImages() {
  //print(index);

  //Load sketch History
  for (var i = 0; i < index; i++) {
    var imageName = "sketchEvol" + i + ".jpg";
    //pass images to loadImage function once loaded 
    ourLoadImage(imageName, i);
  }
}

function ourLoadImage(imageName, imageIndex) {
  loadImage(imageName, gotImage);
  //console.log('image index: ' + imageIndex);

  function gotImage(img) { //function within a function
    imgArray[imageIndex] = img;

    if (imgArray.length == index && imgArray[0] != undefined) {
      state = 0;
      savedtime = frameCount;
    }
  }
}

function initialState() {

  //background(0);
  image(board, 0, 0, windowWidth, windowHeight);

  //text instructions
  s = "Someone started a sketch for you. Finish it and add to an ever-growing collection of doodles.   Move quickly. Embrace mistakes. This is an exercise to fuel creativity. Hit DONE once you've finished and who knows… you may even start one for the next person!"
  textFont(font);
  textSize(22);
  fill(255);
  text(s, 15, 10, 130, height);
}