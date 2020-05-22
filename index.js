// Declare all variables 
let container,
    canvas,
    context,
    canvasWidth,
    canvasHeight,
    padding = {},
    drawingAreaX,
    drawingAreaY,
    drawingAreaWidth,
    drawingAreaHeight,
    colorPalleteX,
    colorPalleteY,
    colorPalleteWidth,
    colorPalleteHeight,
    sizeSelectorX,
    sizeSelectorY,
    sizeSelectorWidth,
    sizeSelectorHeight,
    eraserPickerX,
    eraserPickerY,
    eraserPickerWidth,
    eraserPickerHeight,
    markerToolX,
    markerToolY,
    markerToolWidth,
    markerToolHeight,
    toolsStrokeStyle = 'grey',
    pointSize = 'normal',
    pointColor = 'black',
    pointTool = 'marker';

let pointX = [],
    pointY = [],
    pointSizes = [],
    pointColors = [],
    isPointDrag = [],
    isPaint = false;

const penSize = {small: 2, normal: 5, medium: 8, big: 10, large: 12},
      colors = {red:'#ff0000', pink: '#FF1493', orange:'#FFA500', 
                yellow:'#FFFF00', green:'#008000', blue:'#0000FF',
                purple:'#800080', brown: '#A52A2A', indigo:'#4B0082', 
                violet:'#EE82EE',  gray:'#696969', black: '#000000'};

// To reset the canvas
function clearCanvas() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Design the tools for the drawing
function drawingTools(){
  // Color Pallete
  /** Begin by draing a  rectangle
   * then draw 12 circles inside with different color  
   */
  // Shapes
  let drawArc = (midX, midY, r, color, context, isFill) => {
    context.beginPath();
    if(isFill){      
      context.fillStyle = color;
      context.arc(midX, midY, r, 0, 1.75*Math.PI);
      context.fill();
    }else{      
      context.strokeStyle = color;
      context.arc(midX, midY, r, 0, 1.75*Math.PI);
      context.stroke();
    }
    context.closePath();
  }

  // Tools
  let drawColorPallete = () => {
    colorPalleteX = drawingAreaX + drawingAreaWidth/4;
    colorPalleteY = drawingAreaY + drawingAreaHeight;
    colorPalleteWidth = drawingAreaWidth/2;
    colorPalleteHeight = canvasHeight - colorPalleteY;
    context.beginPath();
    context.lineWidth = 1;
    context.rect(colorPalleteX, colorPalleteY, colorPalleteWidth, colorPalleteHeight);
    context.stroke();

    // Draw the circles to indicate the colors 
    let colorGradient = (x0, y0, r0, color) => { 
      let fillGrad = context.createRadialGradient(x0, y0, r0, x0+5, y0-15, r0+5);
      fillGrad.addColorStop(0, color);
      fillGrad.addColorStop(1, 'white');

      return fillGrad;
    };
    /* Bug here: needs fixing */
    let arcX = colorPalleteX, // - (index * colorPalleteWidth/11),
        arcY = colorPalleteY + colorPalleteHeight/2,
        arcRadius = colorPalleteHeight/6;
    for(let key of Object.keys(colors)){  
      arcX += colorPalleteWidth/13;
      grad = colorGradient(arcX, arcY, arcRadius, colors[key]);
      drawArc(arcX, arcY, arcRadius, grad, context, true);
    }

  },

  // Size Selector
  drawSizeSelector = () => {
    sizeSelectorX = drawingAreaX + drawingAreaWidth;
    sizeSelectorY = drawingAreaY + drawingAreaHeight * 2/3;
    sizeSelectorWidth = (canvasWidth - sizeSelectorX) * .55;
    sizeSelectorHeight = drawingAreaHeight/3;

    context.beginPath();
    context.rect(sizeSelectorX, sizeSelectorY, sizeSelectorWidth, sizeSelectorHeight*.90);
    context.lineWidth = 2;
    context.strokeStyle = toolsStrokeStyle;
    context.stroke();
    // context.closePath();
    let arcX = sizeSelectorX + sizeSelectorWidth/2,
        arcY = sizeSelectorY;
    for (let key of Object.keys(penSize)) {
      // console.log(key);
      // arcY += sizeSelectorHeight*(.1*count/2);
      arcY += sizeSelectorHeight*(penSize[key]/37);
      if(!(key === 'large'))
        drawArc(arcX, arcY, penSize[key], 'grey', context, false);
    }
  },
  // Eraser
  drawEraserPicker = () => {
    eraserPickerX = drawingAreaX + drawingAreaWidth;
    eraserPickerY = drawingAreaY + drawingAreaHeight * 1/3;
    eraserPickerWidth = (canvasWidth - eraserPickerX) * .60;
    eraserPickerHeight = drawingAreaHeight/3;

    // console.log(canvasWidth +"---"+ eraserPickerX);

    context.beginPath();
    context.moveTo(eraserPickerX, eraserPickerY+padding.top);
    context.lineTo(eraserPickerX + eraserPickerWidth*.6, eraserPickerY + padding.top);
    context.lineTo(eraserPickerX + eraserPickerWidth*.9, eraserPickerY + eraserPickerHeight*.45);
    context.lineTo(eraserPickerX + eraserPickerWidth*.9, eraserPickerY + eraserPickerHeight*.7);
    context.lineTo(eraserPickerX, eraserPickerY + eraserPickerHeight*.7);
    context.lineTo(eraserPickerX, eraserPickerY + eraserPickerHeight*.45);
    context.lineTo(eraserPickerX + eraserPickerWidth*.9, eraserPickerY + eraserPickerHeight*.45);
    context.strokeStyle = pointTool === 'eraser'? 'black' : toolsStrokeStyle;
    context.lineWidth = 2;
    context.stroke();
  },

  drawMarkerTool = () => {
    markerToolX = drawingAreaX + drawingAreaWidth;
    markerToolY = drawingAreaY;
    markerToolWidth = (canvasWidth - markerToolX) * .55;
    markerToolHeight = drawingAreaHeight/3;
    context.beginPath();
    context.strokeStyle = pointTool === 'marker'? 'black' : toolsStrokeStyle;
    context.strokeRect(markerToolX*1.01, markerToolY + markerToolHeight*.5, markerToolWidth *.7, markerToolHeight * .5)
    context.beginPath();
    context.moveTo(markerToolX*1.01, markerToolY + markerToolHeight*.5);
    context.lineTo(markerToolX*1.01, markerToolY + markerToolHeight*.3);
    context.lineTo(markerToolX*1.01 + markerToolWidth*.3, markerToolY + markerToolHeight*.1);
    context.lineTo(markerToolX*1.01 + markerToolWidth*.4, markerToolY + markerToolHeight*.1);
    context.lineTo(markerToolX*1.01 + markerToolWidth*.7, markerToolY + markerToolHeight*.3);
    context.lineTo(markerToolX*1.01 + markerToolWidth*.7, markerToolY + markerToolHeight*.5);
    context.closePath()
    context.fillStyle = pointTool === 'marker'? 'black' : toolsStrokeStyle;
    context.fill()
  }

  drawColorPallete();
  drawSizeSelector();
  drawEraserPicker();
  drawMarkerTool();
}
// Create the only area drawing is allowed 
function prepareDrawingArea() {  

  // Draw the Marker and Eraser for the left side of the drawing board
  let selected,
      locX,
      locY,
      drawArc = (midX, midY, r, color, context, isFill) => {
        context.beginPath();
        if(isFill){      
          context.fillStyle = color;
          context.arc(midX, midY, r, 0, 1.75*Math.PI);
          context.fill();
        }else{      
          context.strokeStyle = color;
          context.arc(midX, midY, r, 0, 1.75*Math.PI);
          context.stroke();
        }
        context.closePath();
      },

      drawMarker = () => {
        const x0 = drawingAreaX*.1, y0 = drawingAreaY*2, x1 = drawingAreaX, y1 = drawingAreaY*.8;
        //draw rectangle 
        context.strokeStyle = pointColor;       
        context.strokeRect(x1*.45, y0*1.05, x1, y1*.75);
        for(let i = 0; i < 5; i++)
          drawArc(x1*(.8 + 0.05*i), y0+y1/2, y1/6, pointColor, context, true)
        context.beginPath();
        context.moveTo(x1*.6, y0+y1*.1);
        context.lineTo(x1*.4, y0);
        context.lineTo(x1*.4, y0+y1*.3);
        context.lineTo(x0, y0+y1*.4);
        context.lineTo(x0, y0+y1*.6);
        context.lineTo(x1*.4, y0+y1*.7);
        context.lineTo(x1*.4, y0+y1);
        context.lineTo(x1*.6, y0+y1*.9);
        context.closePath()
        // context.fillStyle = col;
        context.fill();
      },

      drawEraser = () => {
        const x0 = drawingAreaX*.1, y0 = drawingAreaY*2, x1 = drawingAreaX, y1 = drawingAreaY*.8;
        context.beginPath();
        context.moveTo(x1, y0);
        context.lineTo(x0, y0);
        context.lineTo(x1*.7, y0+y1);
        context.lineTo(x1, y0+y1);
        context.closePath();
        context.stroke();
      };
  // Layout co-ordinates
  drawingAreaX = canvasWidth*.1;
  drawingAreaY = canvasHeight*.1;
  drawingAreaWidth = canvasWidth*.75;
  drawingAreaHeight = canvasHeight*.8;
  drawingTools();
  if(pointTool === 'marker'){ 
    drawMarker();
  } else {    
    drawEraser();
  }

  // Indicate the size being selected 
  switch (pointSize) {
    case 'small':
      locY = sizeSelectorY + sizeSelectorHeight*.05;
      break;
    case 'normal':
      locY = sizeSelectorY + sizeSelectorHeight*.18;
      break;
    case 'medium':
      locY = sizeSelectorY + sizeSelectorHeight*.4;
      break;
    case 'big':
      locY = sizeSelectorY + sizeSelectorHeight*.66;
      break;
    default:
      break;
  }
  locX = drawingAreaX + drawingAreaWidth;
  context.beginPath();
  context.rect(locX, locY, sizeSelectorWidth/2, 2);
  context.fillStyle = 'black';
  context.fill();  
  context.closePath();

  // Print the DrawArea
  context.save();
  context.beginPath();
  context.strokeStyle = '#ffffff';
  context.shadowOffsetX = 2;
  context.shadowOffsetY = -1;
  context.shadowBlur = 5;
  context.shadowColor = 'grey';
  context.lineWidth = 1;
  context.fillStyle = '#ffffff'
  context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);  
  // context.closePath();
  context.stroke();
  context.fill();
  context.clip();
}

// Draw on the canvas
function draw() {

  // Clean canvas first before any drawings
  clearCanvas();
  // Create the drawing area
  prepareDrawingArea();
  let radius;
  for (let i = 0; i < pointX.length; i++) {
    context.beginPath();
    // Set the drawing radius
    switch (pointSizes[i]) {
      case "small":
        radius = penSize['small']*2;
        break;
      case "normal":
        radius = penSize['normal']*2;
        break;
      case "medium":
        radius = penSize['medium']*2;
        break;
      case "big":
        radius = penSize['big']*2;
        break;
      default:
        break;
      }
    if(isPointDrag[i]){      
      context.moveTo(pointX[i-1], pointY[i-1]);
    }else{      
      context.moveTo(pointX[i] -1, pointY[i]);
    }
    context.lineTo(pointX[i], pointY[i]);
    context.strokeStyle = pointColors[i];
    context.shadowColor = pointColors[i];
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 1;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = radius;
    context.stroke();   
  }
  context.closePath(); 

  context.restore();
}

// Update graphics base on screensize
function update(){
  // Collect the new client width set new value for the point
  for(let i = 0; i < pointX.length; i++){    
    pointX[i] = pointX[i]*container.clientWidth/canvasWidth;
    pointY[i] = pointY[i]*(container.clientWidth*.5)/canvasHeight;
  }
  padding.left = padding.right = padding.left*container.clientWidth/canvasWidth;
  canvasWidth = container.clientWidth;
  canvasHeight = canvasWidth*.5;

  canvas.width = canvasWidth - padding.left - padding.right;
  canvas.height = canvasHeight;
  // Points updated now redraw
  draw();
}

// Record the points for later use
function addPoint(x, y, isDrag) {
  pointX.push(x);
  pointY.push(y);
  pointColors.push(pointColor);
  pointSizes.push(pointSize)
  isPointDrag.push(isDrag);  
}

// Drawing Board events
function  drawingBoardEvents() {
  // Create events
  let press = (e)=>{
    // Get the coordinates and store to points array
    // Store up the coordinates to point
    // Call the draw function and pass the points
    let mouseX = e.pageX - container.offsetLeft - 15,
        mouseY = e.pageY - container.offsetTop;

    /** There is a need to handle when the user press either sides of the
     * drawing area where we shall be positioning the drawing tools.
     * This will best be handled by the onMousePress event
     */
    //=======================================================================
    let calcPensizeMidpoint = (size) => {
      return (sizeSelectorHeight * size/37)+size;
    };
    if (mouseX < drawingAreaX) { // Left side of the drawing area
      console.log('nothing to do yet');
    } else if (mouseX > drawingAreaX + drawingAreaWidth) { // Right side of the drawing area

      if(mouseY > markerToolY && mouseY < markerToolY+markerToolHeight){
        pointTool = 'marker';
        pointColor = 'black';
        console.log('Marker selected');
      } else if(mouseY > eraserPickerY && mouseY < eraserPickerY + eraserPickerHeight){
        pointTool = 'eraser';
        pointColor = 'white';
        console.log('Eraser selected')
      } else if(mouseY > sizeSelectorY){
        if (mouseY < sizeSelectorY + calcPensizeMidpoint(penSize.small)) {
          pointSize = 'small';
        } else if(mouseY < sizeSelectorY + calcPensizeMidpoint(penSize.small+penSize.normal)){
          pointSize = 'normal';
        } else if (mouseY < sizeSelectorY + calcPensizeMidpoint(penSize.small + penSize.normal + penSize.medium)){
          pointSize = 'medium';
        } else if (mouseY < sizeSelectorY + calcPensizeMidpoint(penSize.small + penSize.normal + penSize.medium + penSize.big)) {
          pointSize = 'big';
        } else {
          console.log('Pensize '+ penSize.large + ' out of range');
        }
      }

    } else if (mouseY > drawingAreaY + drawingAreaHeight) { // Bottom side of the drawing area
      if(mouseX > colorPalleteX && pointTool === 'marker'){
        let colorWidth = colorPalleteWidth/12;
        if (mouseX < colorPalleteX + colorWidth) {
          pointColor = colors.red;
          console.log('first color');
        } else if (mouseX < colorPalleteX + colorWidth*2) {
          pointColor = colors.pink;
          console.log('second color')
        } else if (mouseX < colorPalleteX + colorWidth*3) {
          pointColor = colors.orange;
          console.log('third color')
        } else if (mouseX < colorPalleteX + colorWidth*4) {
          pointColor = colors.yellow;
          console.log('fourth color')
        } else if (mouseX < colorPalleteX + colorWidth*5) {
          pointColor = colors.green;
          console.log('fifth color')
        } else if (mouseX < colorPalleteX + colorWidth*6) {
          pointColor = colors.blue;
          console.log('sixth color')
        } else if (mouseX < colorPalleteX + colorWidth*7) {
          pointColor = colors.purple;
          console.log('seventh color')
        } else if (mouseX < colorPalleteX + colorWidth*8) {
          pointColor = colors.brown;
          console.log('eighth color')
        } else if (mouseX < colorPalleteX + colorWidth*9) {
          pointColor = colors.indigo;
          console.log('nineth color')
        } else if (mouseX < colorPalleteX + colorWidth*10) {
          pointColor = colors.violet;
          console.log('tenth color')
        } else if (mouseX < colorPalleteX + colorWidth*11) {
          pointColor = colors.gray;
          console.log('eleventh color')
        } else if (mouseX < colorPalleteX + colorWidth*12) {
          pointColor = colors.black;
          console.log('twelveth color')
        } 
      }
    }

    //=======================================================================
    isPaint = true;
    addPoint(mouseX, mouseY, false);
    draw();
  }, 
  drag = (e)=>{
    let mouseX = e.pageX - container.offsetLeft -15,
        mouseY = e.pageY - container.offsetTop;
    if(isPaint){
      addPoint(mouseX, mouseY, true);
      draw();
    }
    e.preventDefault();
  }, 
  release = (e)=>{
    isPaint = false;
    draw();
  }, 
  cancel = (e)=>{
    isPaint = false;
  };

  // Register the events
  canvas.addEventListener('mousedown', press, false);
  canvas.addEventListener('mousemove', drag, false);
  canvas.addEventListener('mouseup', release, false);
  canvas.addEventListener('mouseout', cancel, false);
}
// Prepare the drawing board
function initialize() {
  // container
  container = document.getElementById('container');
  padding = {top: 15, bottom: 15, left: 15, right: 15};
  // Canvas
  canvas = document.querySelector('canvas');
  canvasWidth = container.clientWidth;
  canvasHeight = canvasWidth * 0.5;
  canvas.width = canvasWidth - padding.left - padding.right;
  canvas.height = canvasHeight;
  // context
  context = canvas.getContext('2d');  
  draw();
  // Fire Mouse and Drag events
  drawingBoardEvents();

}

window.addEventListener('resize', update);
initialize();