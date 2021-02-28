import React from 'react';
import "./ColorPalette.css";

function ColorPalette(props) {
  const {
    value,
    interval,
    ...colorPaletteProps
  } = props

  var rSet, gSet, bSet;
  rSet = []
  for (var i=7; i<=255; i=i+8) {
    rSet.push(i)
  }
  gSet = rSet.slice();
  bSet = rSet.slice();

  var bHorizontalFactor = 8
  var bVerticalFactor = 4
  // var bSetHorizontal = []
  // var bSetVertical = []
  // for (var i=0; i<bSet.length; i++) {
  //   if (i % 4 == 0) {
  //     bSetVertical.push(bSet[i])
  //   } else {
  //     bSetHorizontal.push(bSet[i])
  //   }
  // }
  // console.log(rSet, bSetVertical, bSetHorizontal)

  const pixelStyle = (color) => {
    return {
      width: "3px",
      height: "3px",
      backgroundColor: color,
    }
  }

  const gradientLine = (rValue, bVIndex) => {
    var line_elements = []
    var bValues = []
    for (var bHIndex = 0; bHIndex < bHorizontalFactor; bHIndex++) {
      const bIndex = (bVIndex+1) * (bHIndex+1) - 1
      const bValue = bSet[bIndex]
      bValues.push(bValue)
    }

    gSet.forEach((gValue, gIndex) => {  //32
      // bValues = bValues.reverse()
      for (var i = 0; i < bValues.length; i++) { //8
        line_elements.push([rValue, gValue, bValues[i]])
      }
    });

    return line_elements
  }

  const getPaletteList = () => {
    var palette_elements = []
    rSet.forEach((rValue, rIndex) => {  //32
      for (var bVIndex = 0; bVIndex < bVerticalFactor; bVIndex++) {
        palette_elements.push(gradientLine(rValue, bVIndex))
      }
    });

    return palette_elements
  }

  // 32*1024
  const getGradientBrand = () => {
    var gb_list = []
    for (var r=0; r<rSet.length; r++) {
      var gb_line = []
      for (var b=0; b<bSet.length; b++) {
        for (var g=0; g<gSet.length; g++) {
          gb_line.push([rSet[r], gSet[g], bSet[b]])
        }
        gSet=gSet.reverse()
      }
      gb_list.push(gb_line)
    }

    return gb_list
  }

  const paletteList = getPaletteList()

  const gb_list = getGradientBrand()
  // const drawPalette = () => {
  //   const paletteList = getPaletteList()
  //   //<div style={pixelStyle(`rgb(${element[0]}, ${element[1]}, ${element[2]})`)}/>
  //   var palette = <div className="ColorPalette-Container">
  //     {paletteList.map((line_elements, index) => {
  //       <div className="ColorPalette-LineContainer">
  //         <p></p>
  //       </div>
  //     })}
  //   </div>
  // }
  // const pixel_line = paletteList[0]

  return (
    <div>
      {/*gb_list.map((gb_line, line_index) => {
        return (
          <div className="ColorPalette-LineContainer">
            {gb_line.map((pixel, pixel_index) => {
              return (
                <div style={pixelStyle(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`)}/>
              )
            })}
          </div>
        )
      })*/}
      <br/><br/>
      {paletteList.map((pixel_line, line_index) => {
        return (
          <div className="ColorPalette-LineContainer">
            {pixel_line.map((pixel, pixel_index) => {
              return (
                <div style={pixelStyle(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`)}/>
              )
            })}
          </div>
        )
      })}

      {/*Array.apply(0, Array(3)).map(function (x, i) {
        for (var index=0; index++; index<=255) {
          <p></p>
        }
        var a = 150
        var b = 120
        var c = 250
        var element = <div className="ColorPalette-LineContainer">
                        <div style={pixelStyle(`rgb(${a}, ${b}, ${c})`)}/>
                        <div style={pixelStyle("red")}/>
                        <div style={pixelStyle("green")}/>
                      </div>
        return element
      })*/}
      {/*
        <div className="ColorPalette-LineContainer">
          <div style={pixelStyle("blue")}/>
          <div style={pixelStyle("red")}/>
          <div style={pixelStyle("green")}/>
        </div>
        <div className="ColorPalette-LineContainer">
          <div style={pixelStyle("red")}/>
          <div style={pixelStyle("green")}/>
          <div style={pixelStyle("blue")}/>
        </div>
        */}

    </div>
  )
}

export default ColorPalette;
