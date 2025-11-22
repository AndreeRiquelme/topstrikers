///////////////////////////////////////////////////////////////////////////
// Set up the SVG
///////////////////////////////////////////////////////////////////////////
var margin = { top: 100, right: 25, bottom: 100, left: 160 };
var width = 320;
var height = 320;

var svg2 = d3.select('#leyenda')
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("background-color", "#EEDFD4")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


///////////////////////////////////////////////////////////////////////////
// Usar las mismas formas, colores y estilo de texto
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// JUGADORES EXTRA (LEYENDA)
///////////////////////////////////////////////////////////////////////////

const sizeobj2 = 20;

const specialPlayersLegend = [
  { player: " England", euroamerican: 1, uclmundial: 0, solo_award: 1, x: 95,    y: -52,  color: "#4751D9", Etiqueta: "arriba" },
  { player: "Spain",         euroamerican: 1, uclmundial: 0, solo_award: 1, x: 130, y: -17,  color: "#F7A021", Etiqueta: "abajo" },
  { player: " Italy",        euroamerican: 1, uclmundial: 0, solo_award: 1, x: 165,   y: -52,  color: "#38C887", Etiqueta: "arriba" },
  { player: "Germany",     euroamerican: 1, uclmundial: 0, solo_award: 1, x: 200,y: -17,  color: "#FF5254", Etiqueta: "abajo" },
  { player: " France",        euroamerican: 1, uclmundial: 0, solo_award: 1, x: 235,  y: -52,  color: "#0E4052", Etiqueta: "arriba" },

  { player: " Both",         euroamerican: 1, uclmundial: 1, solo_award: 0, x: 165, y: 120,  color: "#A49A91", Etiqueta: "arriba" },
  { player: "National team", euroamerican: 1, uclmundial: 0, solo_award: 0, x: 105, y: 168,  color: "#A49A91", Etiqueta: "arriba" },
  { player: " Club",         euroamerican: 0, uclmundial: 1, solo_award: 0, x: 225, y: 168,  color: "#A49A91", Etiqueta: "arriba" },
  { player: " None",         euroamerican: 0, uclmundial: 0, solo_award: 0, x: 165, y: 216,  color: "#A49A91", Etiqueta: "arriba" },

  { player: " None",         euroamerican: 1, uclmundial: 0, solo_award: 0, x: 95, y: 338,  color: "#A49A91", Etiqueta: "arriba" },
  { player: "Solo Award",         euroamerican: 1, uclmundial: 0, solo_award: 1, x: 165, y: 338,  color: "#A49A91", Etiqueta: "arriba" },
  { player: "Major Solo Award",         euroamerican: 1, uclmundial: 0, solo_award: 2, x: 235, y: 338,  color: "#A49A91", Etiqueta: "arriba" },
];

// Dibujar cada jugador manualmente en el SVG de la leyenda
specialPlayersLegend.forEach(sp => {
  const g = svg2.append("g")
    .attr("class", "manual-player-legend")
    .attr("transform", `translate(${sp.x}, ${sp.y})`);

  // Figura según atributos
  let shape;
  if (sp.euroamerican === 0 && sp.uclmundial === 0) {
    shape = g.append("circle")
      .attr("r", sizeobj2 * 1.2)
      .attr("fill", sp.color);
  } else if (sp.euroamerican === 0 && sp.uclmundial === 1) {
    shape = g.append("rect")
      .attr("x", -sizeobj2)
      .attr("y", -sizeobj2)
      .attr("width", sizeobj2 * 2.15)
      .attr("height", sizeobj2 * 2.15)
      .attr("fill", sp.color);
  } else if (sp.euroamerican === 1 && sp.uclmundial === 0) {
    shape = g.append("path")
      .attr("d", customDiamond(sizeobj2))
      .attr("fill", sp.color);
  } else if (sp.euroamerican === 1 && sp.uclmundial === 1) {
    shape = g.append("path")
      .attr("d", customStar(sizeobj2))
      .attr("fill", sp.color);
  }

  // Borde blanco si tiene premio alto
  if (sp.solo_award >= 2) {
    shape.attr("stroke", "white").attr("stroke-width", 7).attr("paint-order", "stroke");
  }

  // Adornos de premio
  if (sp.solo_award === 2) {
    g.append("path")
      .attr("d", customDiamond(10))
      .attr("fill", "white");
  }
  if (sp.solo_award === 1) {
    g.append("path")
      .attr("d", customDiamond(6))
      .attr("fill", "#EEDFD4");
  }

  // === Texto del jugador (posición según "Etiqueta") ===
  const textY = sp.Etiqueta === "arriba" ? -49 : sizeobj2 + 22; // arriba o abajo
  const text = g.append("text")
    .attr("class", "player-label")
    .attr("x", 0)
    .attr("y", textY)
    .attr("text-anchor", "middle")
    .attr("font-family", "'Roboto', sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#3E3A38");

  const [first, ...rest] = sp.player.split(" ");
  const second = rest.join(" ");
  
  text.append("tspan")
    .attr("x", 0)
    .attr("dy", 0)
    .text(first);

  if (second) {
    text.append("tspan")
      .attr("x", 0)
      .attr("dy", "1.1em")
      .text(second);
  }
});

// === Etiquetas personalizadas ===
const customLabels = [
  { text: "COLOR", x: -110, y: -90 },
  { text: "SHAPE", x: -110, y: 105 },
  { text: "EXTRA", x: -110, y: 300 },
];

// Dibujar las etiquetas
customLabels.forEach(label => {
  svg2.append("text")
    .attr("class", "best-trio-label")
    .attr("x", label.x)
    .attr("y", label.y)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("font-family", "'BBH Sans Hegarty', sans-serif")
    .attr("font-size", "16px")
    .attr("fill", "#3E3A38")
    .text(label.text);
});

// === Etiquetas personalizadas ===
const customLabels2 = [
  { text: "Country where the player has won a title, including ligues and cups (Only Top 5 leagues).", x: -110, y: -65 },
  { text: "Player's international titles, showing whether they have won with their club, national team, both or none.", x: -110, y: 130 },
  { text: "Appears if the player has won an individual trophy.", x: -110, y: 325 },
];

// Función profesional de ajuste de texto
function wrapText(selection, width) {
  selection.each(function() {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word, line = [], lineNumber = 0;
    const lineHeight = 1.2; // ems
    const y = text.attr("y");
    const x = text.attr("x");
    const dy = 0; // no es necesario en este caso

    let tspan = text.text(null)
      .append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + "em")
          .text(word);
      }
    }
  });
}

// Dibujar las etiquetas
customLabels2.forEach(label => {
  const textEl = svg2.append("text")
    .attr("class", "best-trio-label2")
    .attr("x", label.x)
    .attr("y", label.y)
    .attr("text-anchor", "start")
    .attr("font-family", "'Roboto', sans-serif")
    .attr("font-size", "16px")
    .attr("fill", "#3E3A38")
    .text(label.text);

  wrapText(textEl, 150); // ancho máximo del texto en px
});







