///////////////////////////////////////////////////////////////////////////
// Set up the SVG
///////////////////////////////////////////////////////////////////////////
var margin = { top: 100, right: 25, bottom: 100, left: 160 };
var width = 300;
var height = 330;

var svg2 = d3.select('#leyenda')
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("background-color", "#CFC3BB")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


///////////////////////////////////////////////////////////////////////////
// Usar las mismas formas, colores y estilo de texto
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// JUGADORES EXTRA (LEYENDA)
///////////////////////////////////////////////////////////////////////////
const sizeobj2 = 16;

// Definir los datos
const specialPlayersLegend = [
  { player: "England Premier",      euroamerican: 1, uclmundial: 0, solo_award: 1, x: -75,  y: -15,  color: "#4751D9", Etiqueta: "abajo" },
  { player: "Spain La Liga",        euroamerican: 1, uclmundial: 0, solo_award: 1, x: -5,   y: 18,  color: "#F7A021", Etiqueta: "arriba" },
  { player: "Italy Serie A",        euroamerican: 1, uclmundial: 0, solo_award: 1, x: 70,   y: -15,  color: "#38C887", Etiqueta: "abajo" },
  { player: "Germany Bundesliga",   euroamerican: 1, uclmundial: 0, solo_award: 1, x: 140,  y: 18,  color: "#FF5254", Etiqueta: "arriba" },
  { player: "France Ligue 1",       euroamerican: 1, uclmundial: 0, solo_award: 1, x: 210,  y: -15,  color: "#0E4052", Etiqueta: "abajo" },

  { player: "Both",                 euroamerican: 1, uclmundial: 1, solo_award: 0, x: 140,  y: 183,  color: "#A49A91", Etiqueta: "arriba" },
  { player: "National Team Trophy", euroamerican: 1, uclmundial: 0, solo_award: 0, x: 70,   y: 153,  color: "#A49A91", Etiqueta: "abajo" },
  { player: "Club Trophy",          euroamerican: 0, uclmundial: 1, solo_award: 0, x: -5,   y: 183,  color: "#A49A91", Etiqueta: "arriba" },
  { player: "Non Trophy",           euroamerican: 0, uclmundial: 0, solo_award: 0, x: -75,  y: 153,  color: "#A49A91", Etiqueta: "abajo" },

  { player: "Non Awarded",          euroamerican: 0, uclmundial: 0, solo_award: 0, x: -75,  y: 313,  color: "#A49A91", Etiqueta: "abajo" },
  { player: "Solo Award",           euroamerican: 0, uclmundial: 0, solo_award: 1, x: -5,   y: 348,  color: "#A49A91", Etiqueta: "arriba" },
  { player: "Major Solo Award",     euroamerican: 0, uclmundial: 0, solo_award: 2, x: 70,   y: 313,  color: "#A49A91", Etiqueta: "abajo" },
];

// Crear un <defs> para los degradados
const defs = svg2.append("defs");
///////////////////////////////////////////////////////////////////////////
// Define custom diamond and star paths
///////////////////////////////////////////////////////////////////////////
function customDiamond(s = 6) {
  const r2 = Math.sqrt(2);
  return [
    "M", (s * r2), (s * 0),
    "L", (s * 0), (s * r2),
    "L", (s * -r2), (s * 0),
    "L", (s * 0), (s * -r2),
    "Z"
  ].join(" ");
}

function customStar(s = 6) {
  const r2 = Math.sqrt(2);
  const a = Math.sqrt(2) - 1;
  return [
    "M", (s), (-s),
    "L", (s), (-s * a),
    "L", (s * r2), (s * 0),
    "L", (s), (s * a),
    "L", (s), (s),
    "L", (s * a), (s),
    "L", (s * 0), (s * r2),
    "L", (-s * a), (s),
    "L", (-s), (s),
    "L", (-s), (s * a),
    "L", (s * -r2), (s * 0),
    "L", (-s), (-s * a),
    "L", (-s), (-s),
    "L", (-s * a), (-s),
    "L", (s * 0), (s * -r2),
    "L", (s * a), (-s),
    "Z"
  ].join(" ");
}

// Función para crear un degradado lineal a partir de un color base
function createCountryGradient(id, baseColor) {
  const gradient = defs.append("linearGradient")
    .attr("id", id)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");

  gradient.append("stop")
    .attr("offset", "25%")
    .attr("stop-color", baseColor)
    .attr("stop-opacity", 1);

  gradient.append("stop")
    .attr("offset", "90%")
    .attr("stop-color", d3.color(baseColor).brighter(0.5))
    .attr("stop-opacity", 1);
}

// Dibujar cada jugador con degradado
specialPlayersLegend.forEach((sp, i) => {
  const gradientId = `grad-${i}`;
  createCountryGradient(gradientId, sp.color);
  const fillGradient = `url(#${gradientId})`;

  const g = svg2.append("g")
  .datum(sp)  // <--- importante para acceder a sp en el filtro
  .attr("class", "manual-player-legend")
  .attr("transform", `translate(${sp.x}, ${sp.y})`);


  let shape;
  if (sp.euroamerican === 0 && sp.uclmundial === 0) {
    shape = g.append("circle")
      .attr("r", sizeobj2 * 1.2)
      .attr("fill", fillGradient);
  } else if (sp.euroamerican === 0 && sp.uclmundial === 1) {
    shape = g.append("rect")
      .attr("x", -sizeobj2)
      .attr("y", -sizeobj2)
      .attr("width", sizeobj2 * 2.15)
      .attr("height", sizeobj2 * 2.15)
      .attr("fill", fillGradient);
  } else if (sp.euroamerican === 1 && sp.uclmundial === 0) {
    shape = g.append("path")
      .attr("d", customDiamond(sizeobj2))
      .attr("fill", fillGradient);
  } else if (sp.euroamerican === 1 && sp.uclmundial === 1) {
    shape = g.append("path")
      .attr("d", customStar(sizeobj2))
      .attr("fill", fillGradient);
  }

  // Borde blanco si tiene premio alto
  if (sp.solo_award >= 2) {
    shape.attr("stroke", "white").attr("stroke-width", 7).attr("paint-order", "stroke");
  }

  // Adornos de premio
  if (sp.solo_award === 2) {
    g.append("path")
      .attr("d", customDiamond(8))
      .attr("fill", "white");
  }
  if (sp.solo_award === 1) {
    g.append("path")
      .attr("d", customDiamond(5))
      .attr("fill", "#EEDFD4");
  }

  // Texto del jugador
  const textY = sp.Etiqueta === "arriba" ? -50 : 50;
  const text = g.append("text")
    .attr("class", "player-label")
    .attr("x", 0)
    .attr("y", textY)
    .attr("text-anchor", "middle")
    .attr("font-family", "'Inter', sans-serif")
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

  // Línea del jugador (vertical)
g.append("line")
  .attr("class", "player-line")
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", sp.Etiqueta === "arriba" ? -12 : 12)
  .attr("y2", sp.Etiqueta === "arriba" ? -35 : 35)
  .attr("stroke", "#3E3A38")
  .attr("stroke-width", 1);

});



///////////////////////////////////////////////////////////////////////////
// Comportamiento de botones para ligas
///////////////////////////////////////////////////////////////////////////

// Mapeo del nombre del jugador en la leyenda al ID del checkbox HTML
const legendFilters = {
  "England Premier": "filterEng",
  "Spain La Liga": "filterSpa",
  "Italy Serie A": "filterIta",
  "Germany Bundesliga": "filterGer",
  "France Ligue 1": "filterFra",
  "National Team Trophy":"filterNT",
  "Club Trophy":"filterClub",
  "Both":"filterBoth",
  "Solo Award":"filterSolo",
  "Major Solo Award":"filterSolo2"
};

// Aplica el comportamiento a cada liga
Object.entries(legendFilters).forEach(([legendText, checkboxId]) => {
  const button = svg2.selectAll(".manual-player-legend")
    .filter(d => d && d.player === legendText);

  button.style("cursor", "pointer").on("click", function () {
    const checkbox = document.getElementById(checkboxId);

    checkbox.checked = !checkbox.checked;

    checkbox.dispatchEvent(new Event('change'));

    d3.select(this)
      .transition()
      .duration(200)
      .attr("opacity", checkbox.checked ? 0.4 : 1);
  });

  const checkbox = document.getElementById(checkboxId);
  if (checkbox.checked) {
    button.attr("opacity", 0.4);
  }
});







// === Etiquetas personalizadas ===
const customLabels = [
  { text: "Color", x: -110, y: -85 },
  { text: "Shape", x: -110, y: 80 },
  { text: "Extra", x: -110, y: 245 },
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
    .attr("font-size", "24px")
    .attr("fill", "#3E3A38")
    .text(label.text);
});

// === Etiquetas personalizadas ===
const customLabels2 = [
  { text: "Country where the player has won a title.", x: -110, y: -57 },
  { text: "Player's international titles origin.", x: -110, y: 108 },
  { text: "Player's individual trophy.", x: -110, y: 273 },
];


// Dibujar las etiquetas
customLabels2.forEach(label => {
  const textEl = svg2.append("text")
    .attr("class", "best-trio-label2")
    .attr("x", label.x)
    .attr("y", label.y)
    .attr("text-anchor", "start")
    .attr("font-family", "'Inter', sans-serif")
    .attr("font-size", "18px")
    .attr("fill", "#3E3A38")
    .text(label.text);


  svg2.append("text")
    .attr("class", "best-trio-label2")
    .attr("x", -110)
    .attr("y", 405)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("font-family", "'Inter', sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#3E3A38")
    .text("Design Andree Riquelme");
  svg2.append("text")
    .attr("class", "best-trio-label2")
    .attr("x", -110)
    .attr("y", 420)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("font-family", "'Inter', sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#3E3A38")
    .text("Data Transfermarket Oct 2025");
});







