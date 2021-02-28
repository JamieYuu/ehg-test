import React, { useRef, useEffect } from 'react';
import './GraffitiRdm.css';

// Function component which generate the image on canvas component
function Graffiti(props) {
  const {
    ...graffitiProps
  } = props

  // Reference to the canvas component
  const canvasRef = useRef(null)

  // Initial the rgb set
  var rSet, gSet, bSet;
  rSet = []
  for (var i=7; i<=255; i=i+8) {
    rSet.push(i)
  }
  gSet = rSet.slice();
  bSet = rSet.slice();

  // A 3D Array contains the status of each rgb color, 1 represents not used, 0 represents used
  let rgbMatrix = Array(32).fill().map(() => Array(32).fill().map(() => Array(32).fill(1)));

  // A 2D Arrey contains the status of each point, 0 represents not painted, 1 represents painted
  let canvasMatrix = Array(256).fill().map(() => Array(128).fill(0))

  // Dictionary contains the information of the pixels which going to be painted
  var to_paint = {}

  // Generate random color of start point
  const getRandomStartPoint = () => {
    const rdmR = Math.floor(Math.random() * 32);
    const rdmG = Math.floor(Math.random() * 32);
    const rdmB = Math.floor(Math.random() * 32);

    const rdmPoint = {
      ri: rdmR,
      gi: rdmG,
      bi: rdmB,
    }

    rgbMatrix[rdmR][rdmG][rdmB] = 0

    return rdmPoint
  }

  const getRGB = (colorIndex) => {
    const rgbColor = {
      r: rSet[colorIndex.ri],
      g: gSet[colorIndex.gi],
      b: bSet[colorIndex.bi],
    }

    return rgbColor
  }

  // Given a color, find the most similar color
  const getPaintColor = (colorIndex) => {
    const ri = colorIndex.ri
    const gi = colorIndex.gi
    const bi = colorIndex.bi

    // To check whether the index of neighbor color is less than 0 or greater than 31
    const lri = (ri === 0) ? 0 : ri-1
    const rri = (ri === 31) ? 31 : ri+1

    const lgi = (gi === 0) ? 0 : gi-1
    const rgi = (gi === 31) ? 31 : gi+1

    const lbi = (bi === 0) ? 0 : bi-1
    const rbi = (bi === 31) ? 31 : bi+1


    var candidates = []
    var paintColor = {
      ri: -1,
      gi: -1,
      bi: -1,
    }

    // Check the neighbor color with variance of 1
    let one_variance = [
      [lri, gi, bi], [ri, lgi, bi], [ri, gi, lbi],
      [rri, gi, bi], [ri, rgi, bi], [ri, gi, rbi]
    ]

    one_variance.forEach((oneV, i) => {
      if (rgbMatrix[oneV[0]][oneV[1]][oneV[2]] === 1) {
        candidates.push(oneV)
      }
    });

    // If not found in one_variance, then check the neighbor color with variance of 2
    if (candidates.length === 0) {
      let two_variance = [
        [lri, lgi, bi], [rri, lgi, bi], [lri, rgi, bi], [rri, rgi, bi],
        [ri, lgi, lbi], [ri, lgi, rbi], [ri, rgi, lbi], [ri, rgi, rbi],
        [lri, gi, lbi], [lri, gi, rbi], [rri, gi, lbi], [rri, gi, rbi]
      ]

      two_variance.forEach((twoV, i) => {
        if (rgbMatrix[twoV[0]][twoV[1]][twoV[2]] === 1) {
          candidates.push(twoV)
        }
      });
    }

    // If not found in two_variance, then check the neighbor color with variance of 3
    if (candidates.length === 0) {
      let three_variance = [
        [lri, lgi, lbi], [lri, lgi, rbi], [lri, rgi, rbi], [lri, rgi, lbi],
        [rri, lgi, lbi], [rri, lgi, rbi], [rri, rgi, rbi], [rri, rgi, lbi]
      ]

      three_variance.forEach((threeV, i) => {
        if (rgbMatrix[threeV[0]][threeV[1]][threeV[2]] === 1) {
          candidates.push(threeV)
        }
      });
    }

    // If still not found, pick the possible darkest color
    if (candidates.length === 0) {
      var found = false
      for (var a=31; a>=0; a--) {
        for (var b=31; b>=0; b--) {
          for (var c=31; c>=0; c--) {
            if (rgbMatrix[a][b][c] === 1) {
              paintColor.ri = a
              paintColor.gi = b
              paintColor.bi = c
              found = true
              rgbMatrix[a][b][c] = 0
              break;
            }
          }
          if (found) { break; }
        }
        if (found) { break; }
      }
    }

    // If found some similar color, random pick one of them
    if (candidates.length !== 0) {
      var rdmCandi = candidates[Math.floor(Math.random() * candidates.length)];
      paintColor.ri = rdmCandi[0]
      paintColor.gi = rdmCandi[1]
      paintColor.bi = rdmCandi[2]
      rgbMatrix[rdmCandi[0]][rdmCandi[1]][rdmCandi[2]] = 0
    }

    return paintColor
  }

  // Draw the point on canvas, each point is a 3*3 pixel
  const drawPoint = (context, colorIndex, x, y) => {
    var rgbColor = getRGB(colorIndex)
    context.fillStyle = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`
    context.fillRect(x*3,y*3,3,3);
  }

  // Given a painted point with color, add it's neighbor to to_paint dict
  const addNeighbors = (x, y, colorIndex) => {
    var neighbors = []
    if (x > 0) {
      neighbors.push(`${x-1}, ${y}`)
    }
    if (x < 255) {
      neighbors.push(`${x+1}, ${y}`)
    }
    if (y > 0) {
      neighbors.push(`${x}, ${y-1}`)
    }
    if (y < 127) {
      neighbors.push(`${x}, ${y+1}`)
    }

    neighbors.forEach((item, i) => {
      const vals = item.split(",")
      const nx = parseInt(vals[0])
      const ny = parseInt(vals[1])

      if ((item in to_paint) === false && canvasMatrix[nx][ny] === 0) {
        to_paint[item] = colorIndex
        canvasMatrix[nx][ny] = 1
      }
    });
  }

  // Main function of generate the image
  const generate = () => {
    // Initialize variables
    rgbMatrix = Array(32).fill().map(() => Array(32).fill().map(() => Array(32).fill(1)));
    canvasMatrix = Array(256).fill().map(() => Array(128).fill(0))
    to_paint = {}

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw a start point at the center of the canvas with random color
    var rdmColor = getRandomStartPoint()
    drawPoint(context, rdmColor, 128, 64)
    canvasMatrix[128][64] = 1

    // Add it's neighbor to to_paint dict
    addNeighbors(128, 64, rdmColor)
    // Remove self as it is painted
    delete to_paint['128, 64']

    // If the to_paint dict is not empty, repeat the process
    while(Object.keys(to_paint).length !== 0) {
      var keys = Object.keys(to_paint);

      const rdmKey = keys[Math.floor(keys.length * Math.random())]

      const tempKey = rdmKey.split(",")
      const nx = parseInt(tempKey[0])
      const ny = parseInt(tempKey[1])

      const colorIndex = to_paint[rdmKey]

      const paintColor = getPaintColor(colorIndex)

      drawPoint(context, paintColor, nx, ny)

      addNeighbors(nx, ny, paintColor)
      delete to_paint[rdmKey]
    }

    // Check all point is filled with color
    var notFill = 0
    canvasMatrix.forEach((row, i) => {
      row.forEach((col, i) => {
        if (col === 0) {
          notFill ++
        }
      });
    });
    console.log('The number of pixels not filled in canvas', notFill)
  }

  useEffect(() => {
    generate()
  })

  return (
    <div className="graffiti-container">
      <button className="refresh-button" onClick={generate}>Generate!</button>
      <br/><br/>
      <canvas ref={canvasRef} id="graffitiCVS" width="768" height="384"></canvas>
    </div>
  )
}

export default Graffiti;
