import React from 'react';
import "./Graffiti.css";

function Graffiti(props) {
  const {
    value,
    interval,
    ...graffitiProps
  } = props

  var rSet, gSet, bSet;
  rSet = []
  for (var i=7; i<=255; i=i+8) {
    rSet.push(i)
  }
  gSet = rSet.slice();
  bSet = rSet.slice();

  // A 3D Array contains the status of each rgb color, 1 represents not used, 0 represents used
  let rgbMatrix = Array(32).fill().map(() => Array(32).fill().map(() => Array(32).fill(1)));
  //console.log(rgbMatrix[31][31][31])

  const pixelStyle = (color) => {
    return {
      width: "3px",
      height: "3px",
      backgroundColor: color,
    }
  }

  const getRandomStartPoint = () => {
    const rdmR = Math.floor(Math.random() * 32);
    const rdmG = Math.floor(Math.random() * 32);
    const rdmB = Math.floor(Math.random() * 32);

    const rdmPoint = {
      ri: rdmR,
      gi: rdmG,
      bi: rdmB,
    }

    return rdmPoint
  }

  const getRGB = (color) => {
    const rgbColor = {
      r: rSet[color.ri],
      g: rSet[color.gi],
      b: rSet[color.bi],
    }

    return rgbColor
  }

  const calColorDif = (topColor, leftColor, candidates) => {
    if (topColor == null) {
      topColor = candidates
    }
    if (leftColor == null) {
      leftColor = candidates
    }

    const topDif = Math.pow((topColor.ri-candidates.ri), 2) + Math.pow((topColor.gi-candidates.gi), 2) + Math.pow((topColor.bi-candidates.bi), 2)
    const leftDif = Math.pow((leftColor.ri-candidates.ri), 2) + Math.pow((leftColor.gi-candidates.gi), 2) + Math.pow((leftColor.bi-candidates.bi), 2)
    const dif = Math.pow(topDif, 2) + Math.pow(leftDif, 2)

    return dif
  }

  const mergeLists = (listA, listB) => {
    var merged = []
    if (listA.length == 0 || listB.length == 0) {
      merged = (listA.length == 0) ? listB.slice() : listA.slice()
    } else {
      var combined = listA.concat(listB)

      for (var a=0; a<combined.length; a++) {
        var duplicated = false

        for (var b=0; b<merged.length; b++) {
          if (JSON.stringify(combined[a]) === JSON.stringify(merged[b])) {
            duplicated = true
            break;
          }
        }

        if (duplicated == false) {
          merged.push(combined[a])
        }
      }
    }

    return merged
  }

  mergeLists([{ri:1, gi:1, bi:1}, {ri:1, gi:2, bi:1}], [{ri:1, gi:1, bi:1}])

  const loopB = (sri, sgi, bi) => {
    var bCandis = []

    for (var sbi=bi; sbi>=0; sbi--) {
      if (rgbMatrix[sri][sgi][sbi] == 1) {
        bCandis.push({ri: sri, gi:sgi, bi:sbi})
        break
      }
    }

    for (var sbi=bi; sbi<32; sbi++) {
      if (rgbMatrix[sri][sgi][sbi] == 1) {
        bCandis.push({ri: sri, gi:sgi, bi:sbi})
        break
      }
    }

    //  console.log('bCandis', bCandis)

    return bCandis
  }

  const loopG = (sri, gi, bi) => {
    var gCandiL = []
    var gCandiR = []

    for (var sgi=gi; sgi>=0; sgi--) {
      var bCandis = loopB(sri, sgi, bi).slice();
      gCandiL = mergeLists(gCandiL, bCandis)

      if (gCandiL.length >= 2) {
        break
      }
    }

    for (var sgi=gi; sgi<32; sgi++) {
      var bCandis = loopB(sri, sgi, bi).slice();
      gCandiR = mergeLists(gCandiR, bCandis)

      if (gCandiR.length >= 2) {
        break
      }
    }

    var merged = mergeLists(gCandiL, gCandiR)

    return merged
  }

  const loopMatrix = (ri, gi, bi) => {
    var candidatesL = []
    var candidatesR = []
    for (var sri=ri; sri>=0; sri--) {
      var gCandi = loopG(sri, gi, bi).slice();
      candidatesL = mergeLists(candidatesL, gCandi)

      if (candidatesL.length >= 4) {
        break
      }
    }

    for (var sri=ri; sri<32; sri++) {
      var gCandi = loopG(sri, gi, bi).slice();
      candidatesR = mergeLists(candidatesR, gCandi)

      if (candidatesR.length >= 4) {
        break
      }
    }

    var merged = mergeLists(candidatesL, candidatesR)

    return merged
  }

  //rgbMatrix[18][5][12] = 0
  //loopMatrix(18, 5, 12)

  const getSimilarColor = (topColor, leftColor) => {
    var topColorCandies = [];
    var leftColorCandies = [];

    if (topColor != null)  {
      topColorCandies = loopMatrix(topColor.ri, topColor.gi, topColor.bi)
    }

    if (leftColor != null)  {
      leftColorCandies = loopMatrix(leftColor.ri, leftColor.gi, leftColor.bi)
    }

    var combinedCandies = topColorCandies.concat(leftColorCandies)

    var bestCandies = null;
    if (combinedCandies.length > 0) {
      var bestCandies = combinedCandies[0]
      var bestvariance = calColorDif(topColor, leftColor, bestCandies)

      for (var i=0; i<combinedCandies.length; i++) {
        var variance = calColorDif(topColor, leftColor, bestCandies, combinedCandies[i])
        if (variance < bestvariance) {
          bestvariance = variance
          bestCandies = combinedCandies[i]
        }
      }
    }

    if (bestCandies == null) {
      //console.log('not found, random pic')
      var rdmCandidate = null
      var rdm = false
      for (var a=0; a<32; a++) {
        for (var b=0; b<32; b++) {
          for (var c=0; c<32; c++) {
            if (rgbMatrix[a][b][c] == 1) {
              rdm = true
              rdmCandidate = {ri: a, gi: b, bi:c}
              break
            }
          }
          if (rdm) {
            break
          }
        }
        if (rdm) {
          break
        }
      }
      bestCandies = rdmCandidate
    }

    return bestCandies
  }

  // rgbMatrix[2][2][3] = 0
  // rgbMatrix[3][4][2] = 0
  // var topColor = {ri: 2, gi:2, bi: 3}
  // var leftColor = {ri: 3, gi:4, bi: 2}
  // console.log(getSimilarColor(topColor, leftColor))

  const generateGraffitiList = () => {
    var graffitiList = Array(128).fill().map(() => Array(256).fill(0)); // Empty list,  128*256

    // Initialize the first elements, located on the left top
    const startPoint = getRandomStartPoint()
    graffitiList[0][0] = {
      ri: startPoint.ri,
      gi: startPoint.gi,
      bi: startPoint.bi,
    }
    rgbMatrix[startPoint.ri][startPoint.gi][startPoint.bi] = 0
    //console.log(graffitiList)

    // for first row
    for (var i=1; i<graffitiList[0].length; i++) {
      var candidate = getSimilarColor(null, graffitiList[0][i-1])
      graffitiList[0][i] = candidate
      rgbMatrix[candidate.ri][candidate.gi][candidate.bi] = 0
    }

    // for first column
    for (var i=1; i<graffitiList.length; i++) {
      var candidate = getSimilarColor(graffitiList[i-1][0], null)
      graffitiList[i-1][0] = candidate
      rgbMatrix[candidate.ri][candidate.gi][candidate.bi] = 0
    }

    // from section row to last row
    for (var row=1; row<graffitiList.length; row++) {
      for (var col=1; col<graffitiList[row].length; col++) {
        var candidate = getSimilarColor(graffitiList[row-1][col], graffitiList[row][col-1])
        graffitiList[row][col] = candidate
        rgbMatrix[candidate.ri][candidate.gi][candidate.bi] = 0
      }
    }

    return graffitiList
  }

  //console.log(getRandomStartPoint())
  var graffitiList = generateGraffitiList()

  //console.log(calColorDif({r:1, g:3, b:4}, {r:5, g:1, b:3}))

  return (
    <div>
      {graffitiList.map((graffiti_line, line_index) => {
        return (
          <div className="ColorPalette-LineContainer">
            {graffiti_line.map((pixel, pixel_index) => {
              return (
                <div style={pixelStyle(`rgb(${rSet[pixel.ri]}, ${gSet[pixel.gi]}, ${bSet[pixel.bi]})`)}/>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Graffiti;
