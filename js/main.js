//-----------------------------------------------------------------
// Creación y configuración del SVG
//-----------------------------------------------------------------

var margin = { top: 100, right: 200, bottom: 100, left: 150 };
var width = 1000;
var height = 4500;

var svg = d3.select('#chart')
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("background-color", "#CFC3BB")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//-----------------------------------------------------------------
// Definir escalas
//-----------------------------------------------------------------

const rankScale = d3.scaleLinear().domain([1, 50]).range([0, height]);  //El ranking FIFA es el eje Y
const xScale = d3.scaleSqrt().domain([0, 160]).range([0, width]);       //El número de goles es el eje X
//const xScaleMatches = d3.scaleSqrt().domain([0, 250]).range([0, width]);
const sizeobj = 12;                                                     //Es el parámetro para el tamaño de los goleadores

//-----------------------------------------------------------------
// Definir patrones para banderas de países
//-----------------------------------------------------------------

const flags = [
  "ARG", "BRA", "FRA", "ENG", "ESP",
  "ITA", "NED", "BEL", "POR", "CRO",
  "GER", "URU", "COL", "MEX", "MAR",
  "USA", "SUI", "SEN", "JPN", "DEN",
  "VEN", "UZB", "GRE", "ROU", "SVK",
  "CRC", "CZE", "TUN", "CIV", "NGA",
  "SWE", "PAR", "SCO", "HUN", "SRB",
  "ALG", "WAL", "POL", "EGY", "PAN",
  "RUS", "NOR", "CAN", "UKR", "TUR",
  "AUS", "AUT", "ECU", "KOR", "IRN"
];

                                                                        
flags.forEach(flag=> {
  defs.append("pattern")
    .attr("id", `flag-${flag}`)
    .attr("patternUnits", "objectBoundingBox")
    .attr("width", 1)
    .attr("height", 1)
    .append("image")
    .attr("href", `img/${flag}.svg`)                                    //En Img/ están los archivos svg de las banderas
    .attr("width", 45)                                                //Ajustado al ojo
    .attr("height", 45)
    .attr("preserveAspectRatio", "xMidYMid slice");
});

const overlay = defs.append("linearGradient")                           //Define la gradiente para los rombos con banderas
  .attr("id", "overlay-gradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "100%");
/*
overlay.append("stop")                                                  //Primera parada: Transparente
  .attr("offset", "25%")
  .attr("stop-color", "white")
  .attr("stop-opacity", 0);

overlay.append("stop")                                                  //Segunda parada: Blanco
  .attr("offset", "75%")
  .attr("stop-color", "white")
  .attr("stop-opacity", 1);
*/
//-----------------------------------------------------------------
// Definir figuras especiales para jugadores
//-----------------------------------------------------------------

function customDiamond(s = 6) {                                         //Diamante para ganadores de Eurocopa
  const r2 = Math.sqrt(2);
  return [
    "M", (s * r2), (s * 0),
    "L", (s * 0), (s * r2),
    "L", (s * -r2), (s * 0),
    "L", (s * 0), (s * -r2),
    "Z"
  ].join(" ");
}

function customStar(s = 6) {                                            //Estrella para ganadores de Eurocopa & Champions
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

//-----------------------------------------------------------------
// Leer Base de Datos
//-----------------------------------------------------------------

d3.dsv(";", "data/players.csv", d => ({
  ranking: +d.RANKING,
  goals: +d.GOALS,
  matches: +d.MATCHES,
  country: d.COUNTRY,
  cou: d.COU,
  player: d.PLAYER,
  position: d.POSITION,
  euroamerican: +d.EUROAMERICAN,
  uclmundial: +d["UCL/MUNDIALCLUB"],
  both: +d.BOTH,
  solo_award: +d.SOLO_AWARD,
  solo_award2: +d.SOLO_AWARD2,
  ENGLAND: +d.ENGLAND,
  SPAIN: +d.SPAIN,
  ITALY: +d.ITALY,
  GERMANY: +d.GERMANY,
  FRANCE: +d.FRANCE,
  marked: +d.MARKED,
  debut: d.DEBUT,
  award_desc: d.AWARD_DESC,
  ucl_desc: d.UCL_DESC,
  euro_desc: d.EURO_DESC,
  wc_desc: d.WC_DESC,
})).then(data => {

//-----------------------------------------------------------------
// Definir patrones de colores, franjas y degradados
//-----------------------------------------------------------------

const defs = svg.append("defs");

const countryColors = {                                                 //Colores por TOP 5 Ligas
  ENGLAND: "#4751D9",
  SPAIN: "#F7A021",   
  ITALY: "#38C887",   
  GERMANY: "#FF5254", 
  FRANCE: "#0E4052"   
};

function createCountryGradient(id, baseColor) {
  const gradient = defs.append("linearGradient")
    .attr("id", id)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");

  gradient.append("stop")                                               //Color inicial más claro
    .attr("offset", "25%")
    .attr("stop-color", baseColor)
    .attr("stop-opacity", 1);

  gradient.append("stop")                                               //Color final más oscuro
    .attr("offset", "75%")
    .attr("stop-color", baseColor)
    .attr("stop-opacity", 1);
}

// Crear los degradados para cada país
Object.entries(countryColors).forEach(([country, color]) => {
  const gradientId = `grad-${country.toLowerCase()}`;
  if (svg.select(`#${gradientId}`).empty()) {
    createCountryGradient(gradientId, color);
  }
});

// Patrones que usan degradados
function createCountryPattern(id, countries) {
  const stripeWidth = 6;                                                //Parámetro ancho de las franjas de color
  const size = stripeWidth * countries.length;

  const pattern = defs.append("pattern")
    .attr("id", id)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", size)
    .attr("height", size)
    .attr("patternTransform", "rotate(45)");

  // Fondo neutro gris
  pattern.append("rect")
    .attr("width", size)
    .attr("height", size)
    .attr("fill", "#A49A91");

  countries.forEach((country, i) => {
    const gradId = `grad-${country.toLowerCase()}`;
    pattern.append("rect")
      .attr("x", i * stripeWidth)
      .attr("y", 0)
      .attr("width", stripeWidth)
      .attr("height", size)
      .attr("fill", `url(#${gradId})`);
  });
}

function getCountryFill(d) {
  const countries = Object.keys(countryColors).filter(k => d[k] === 1);
  if (countries.length === 0) return "#A49A91";
  if (countries.length === 1) return `url(#grad-${countries[0].toLowerCase()})`;

  const patternId = `pattern-${countries.join("-").toLowerCase()}`;
  if (svg.select(`#${patternId}`).empty()) {
    createCountryPattern(patternId, countries);
  }
  return `url(#${patternId})`;
}

//-----------------------------------------------------------------
// Definir patron segmentado por goles de fondo
//-----------------------------------------------------------------

  const goalRanges = [                                                  //Rangos y colores para el patrón
    { min: -999, max: 10, color: "#CFC3BB" },                           //De más oscuro a más claro
    { min: 10, max: 50, color: "#DACCBF" }, 
    { min: 50, max: 100, color: "#E3D5C7" },
    { min: 100, max: 500, color: "#EEDFD4" }  
  ]

                                                      //Asignando rectángulos a los rangos
svg.append("g")
  .attr("class", "goal-backgrounds")
  .selectAll("path")
  .data(goalRanges)
  .join("path")
  .attr("d", d => {
    const x0 = xScale(d.min);
    const x1 = xScale(d.max);
    const yTop = -50 * margin.top;
    const yBottom = 4500 + margin.bottom;
    const step = 24;     // distancia vertical entre picos
    const amp = 12;      // amplitud horizontal del zigzag

    // Zigzag del lado izquierdo
    let leftPath = `M ${x0},${yTop}`;
    let dir = 1;
    for (let y = yTop; y <= yBottom; y += step) {
      leftPath += ` L ${x0 + amp * dir},${y}`;
      dir *= -1;
    }

    // Zigzag del lado derecho
    let rightPath = "";
    dir = -1;
    for (let y = yBottom; y >= yTop; y -= step) {
      rightPath += ` L ${x1 + 50 + amp * dir},${y}`;
      dir *= -1;
    }

    // Unir ambas líneas y cerrar la figura
    return leftPath + rightPath + " Z";
  })
  .attr("fill", d => d.color);



  const labelY = -75;                                                   //Parámetro para la posición Y de las etiquetas

  svg.append("g")
    .attr("class", "goal-labels")
    .selectAll("text")                                                  //Etiquetas para rangos
    .data(goalRanges)
    .join("text")
    .attr("x", d => xScale(d.min) + 8)
    .attr("y", labelY - 7)
    .attr("text-anchor", "start")
    .attr("font-family", "'Inter', sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "400")
    .attr("fill", "#6C6460")
    .text(d => `+ ${d.min} Goals`);                                    

//-----------------------------------------------------------------
// Líneas Guía del Lolipop Chart
//-----------------------------------------------------------------

  const yOffset = 12;                                                   //Parámetro offset para posición del jugador

  // Calcular los máximos de goles por país (ranking) y posición
  const maxGoalsByRankAndPos = d3.rollup(
    data,
    v => d3.max(v, d => d.goals),
    d => d.ranking,
    d => d.position.trim().toUpperCase()
  );

  // Generar estructura de líneas con longitud variable
  const linesData = [];

  maxGoalsByRankAndPos.forEach((positions, rank) => {
    const baseY = rankScale(rank);

    positions.forEach((maxGoals, position) => {
      let y;
      if (position === "LEFT") y = baseY - yOffset;                     //Offset hacia arriba para Left Wingers
      else if (position === "RIGHT") y = baseY + yOffset;               //Offset hacia abajo para right Wingers
      else y = baseY;

      linesData.push({
        rank,
        position,
        y,
        xEnd: xScale(maxGoals)
      });
    });
  });

  // Dibujar las líneas
  // Inicializamos las líneas guía en xEnd = 0
  svg.selectAll(".guide-lines")
    .data(linesData)
    .join("line")
    .attr("class", "guide-lines")
    .attr("x1", 0)
    .attr("x2", 0)  // Inicializamos en 0
    .attr("y1", d => d.y)
    .attr("y2", d => d.y)
    .attr("stroke", "#6C6460")
    .attr("stroke-width", 1.5)
    .transition()
    .delay(100)    // Espera 1 segundo
    .duration(1000) // Duración 1 segundo
    .attr("x2", d => d.xEnd);  // Transición hacia la posición real


  // Círculo al inicio de cada línea
  svg.selectAll(".guide-circle")
    .data(linesData)
    .join("circle")
    .attr("class", "guide-circle")
    .attr("cx", d => 0)
    .attr("cy", d => d.y)
    .attr("r", 3)
    .attr("fill", "#6C6460");

  // Círculo al final de cada línea
  // Inicializamos los círculos al final de la línea en x = 0
  svg.selectAll(".guide-circle2")
    .data(linesData)
    .join("circle")
    .attr("class", "guide-circle2")
    .attr("cx", 0)  // Inicializamos en 0
    .attr("cy", d => d.y)
    .attr("r", 3)
    .attr("fill", "#6C6460")
    .transition()
    .delay(100)
    .duration(1000)
    .attr("cx", d => d.xEnd);  // Transición al valor real

  // Etiquetas L, C, R al lado de cada línea
  svg.selectAll(".guide-label")
    .data(linesData)
    .join("text")
    .attr("class", "guide-label")
    .attr("x", -20) // un poco antes del círculo
    .attr("y", d => d.y)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .attr("font-family", "'Inter', sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "#3E3A38")
    .text(d => {
      if (d.position === "LEFT") return "L";
      if (d.position === "RIGHT") return "R";
      return "C";
    });
  ///////////////////////////////////////////////////////////////////////////
  // Posiciones Y personalizadas
  ///////////////////////////////////////////////////////////////////////////
  const getY = d => {
    const baseY = rankScale(d.ranking);
    if (d.position === "RIGHT") return baseY + yOffset;
    if (d.position === "LEFT") return baseY - yOffset;
    return baseY;
  };

  const rankToCountry = d3.rollup(
    data,
    v => v[0].country,
    d => d.ranking
  );

   const rankToCou= d3.rollup(
    data,
    v => v[0].cou,
    d => d.ranking
  );
  ///////////////////////////////////////////////////////////////////////////
  // Dibujar figuras según condición
  ///////////////////////////////////////////////////////////////////////////

  const playerGroups = svg.selectAll(".player-group")
      .data(data)
      .join("g")
      .attr("class", "player-group")
      .attr("transform", d => `translate(${xScale(0)}, ${getY(d)})`); // Inicializamos en 0

  playerGroups.transition()                     // Transición a los goles reales
      .delay(100)                             // Espera 1 segundo antes de iniciar
      .duration(1000)                          // Duración de 1 segundo para el movimiento
      .attr("transform", d => `translate(${xScale(d.goals)}, ${getY(d)})`);

  // Figura principal según condiciones
  playerGroups.each(function(d) {
    const g = d3.select(this);
    const fillColor = getCountryFill(d);

    if (d.euroamerican === 0 && d.uclmundial === 0) {
      g.append("circle")
        .attr("r", sizeobj*0.5)
        .attr("fill", fillColor)
        .attr("class", "main-shape")
        .transition()
        .delay(1100)    // Espera 1 segundo
        .duration(1000) // Duración 1 segundo
        .attr("r", sizeobj);  // Transición hacia el tamaño real;
    } else if (d.euroamerican === 0 && d.uclmundial === 1) {
      g.append("rect")
        .attr("x", -sizeobj)
        .attr("y", -sizeobj)
        .attr("width", sizeobj * 1)
        .attr("height", sizeobj * 1)
        .attr("fill", fillColor)
        .attr("class", "main-shape")
        .transition()
        .delay(1100)    // Espera 1 segundo
        .duration(1000) // Duración 1 segundo
        .attr("width", sizeobj * 2)
        .attr("height", sizeobj * 2);  // Transición hacia el tamaño real;
    } else if (d.euroamerican === 1 && d.uclmundial === 0) {
      g.append("path")
        .attr("d", customDiamond(sizeobj*0.5))
        .attr("fill", fillColor)
        .attr("class", "main-shape")
        .transition()
        .delay(1100)    // Espera 1 segundo
        .duration(1000) // Duración 1 segundo
        .attr("d", customDiamond(sizeobj));  // Transición hacia el tamaño real;
    } else if (d.euroamerican === 1 && d.uclmundial === 1) {
      g.append("path")
        .attr("d", customStar(sizeobj*0.5))
        .attr("fill", fillColor)
        .attr("class", "main-shape")
        .transition()
        .delay(1100)    // Espera 1 segundo
        .duration(1000) // Duración 1 segundo
        .attr("d", customStar(sizeobj));  // Transición hacia el tamaño real;
    }

    // Adornos si tiene premios
    if (d.solo_award2 === 1) {
      g.append("path")
        .attr("d", customDiamond(0))
        .attr("fill", "white")
        .transition()
        .delay(2200)    // Espera 1 segundo
        .duration(1000) // Duración 1 segundo
        .attr("d", customDiamond(5.5));  // Transición hacia el tamaño real;
    }
    if (d.solo_award === 1) {
      g.append("path")
        .attr("d", customDiamond(0))
        .attr("fill", "#EEDFD4")
        .transition()
        .delay(2200)    // Espera 1 segundo
        .duration(1000) // Duración 1 segundo
        .attr("d", customDiamond(3.5));  // Transición hacia el tamaño real;
    }

if (d.marked >= 1) {
    const offsetY = d.marked === 2 ? 40 : -40;

    const nameText = g.append("text")
      .attr("class", "player-label")
      .attr("x", 5)
      .attr("y", offsetY)
      .attr("font-family", "'Inter', sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "#6C6460")
      .attr("font-weight", "600")
      .attr("opacity", 0);

    const [first, ...rest] = d.player.split(" ");
    const second = rest.join(" ");

    nameText.append("tspan")
      .attr("x", 5)
      .attr("dy", 0)
      .text(first);

    if (second) {
      nameText.append("tspan")
        .attr("x", 5)
        .attr("dy", "1.1em")
        .text(second);
    }

    nameText.transition()
      .delay(4500)
      .duration(2000)
      .attr("opacity", 1);

    g.append("text")
      .attr("class", "player-label-matches")
      .attr("x", -5)
      .attr("y", offsetY)
      .attr("text-anchor", "end")
      .attr("font-family", "'Inter', sans-serif")
      .attr("font-size", "12px")
      .attr("font-weight", "300")
      .attr("fill", "#6C6460")
      .attr("opacity", 0)
      .text(`${d.matches} M`)
      .transition()
      .delay(4500)
      .duration(2000)
      .attr("opacity", 1);

    g.append("text")
      .attr("class", "player-label-goal")
      .attr("x", -5)
      .attr("y", offsetY + 14)
      .attr("text-anchor", "end")
      .attr("font-family", "'Inter', sans-serif")
      .attr("font-size", "12px")
      .attr("font-weight", "300")
      .attr("fill", "#6C6460")
      .attr("opacity", 0)
      .text(`${Math.round(d.goals)} G`)
      .transition()
      .delay(4500)
      .duration(2000)
      .attr("opacity", 1);

    g.append("line")
      .attr("class", "player-line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", d.marked === 2 ? 8 : -8)
      .attr("y2", d.marked  === 2 ? 55 : -50)
      .attr("stroke", "#3E3A38")
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .transition()
      .delay(4500)
      .duration(2000)
      .attr("opacity", 1);
  }
});

//-----------------------------------------------------------------
// Bendito Tooltip
//-----------------------------------------------------------------

var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "#3E3A38")
  .style("padding", "6px 10px 6px 16px")
  //.style("border", "1px solid #999")                                  // Defines el borde en color
  //.style("border-radius", "4px")                                      // Defines las esquinas redondeadas
  .style("font-family", "'Inter', sans-serif")                          // BBH Sans Hegarty
  .style("font-size", "12px")
  .style("font-weight", "300")
  .style("color","white")
  .style("pointer-events", "none")
  .style("opacity", 0)
  .style("clip-path", "polygon(8px 15%, 8px 5%, 100% 0%, 97% 100%, 12px 95%, 8px 45%, 2px 30%)")//Coordenadas de cuadrado con triangulo lateral
   .style("filter", "blur(4px)")
  .style("transition", "opacity 0s ease, filter 0s ease");                            // Desaparece lentamente


playerGroups                                                            // Se conecta a Player Groups
  .on("mouseover", function(event, d) {
    tooltip
      .style("opacity", 1)
      .style("filter", "blur(0px)")                                     // Se enfoca cuando aparece
      .html(`
        <div style="font-size: 10px;">Since ${d.debut}</div>
        <div style="font-size: 16px; font-weight: 100; font-family: 'BBH Sans Hegarty', sans-serif; text-transform: uppercase;">${d.player}</div>
        <div>${d.wc_desc}</div>
        <div>${d.award_desc}</div>
        <div>${d.euro_desc}</div>
        <div>${d.ucl_desc}</div>
        <div>${Math.round(d.goals)} Goals</div>
        <div>${d.matches} Matches</div>
      `);
  })
  .on("mousemove", function(event) {
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 20) + "px");
  })
  .on("mouseout", function() {
    tooltip
      .style("opacity", 0)
      .style("filter", "blur(4px)"); // Vuelve a desenfocarse al desaparecer
  });

//-----------------------------------------------------------------
// Filtros activados por eventos
//-----------------------------------------------------------------

const countryMap = {
  filterEng: "ENGLAND",
  filterSpa: "SPAIN",
  filterIta: "ITALY",
  filterGer: "GERMANY",
  filterFra: "FRANCE",
  filterClub: "uclmundial",
  filterNT: "euroamerican",
  filterBoth: "both",
  filterSolo: "solo_award",
  filterSolo2: "solo_award2"
};

Object.keys(countryMap).forEach(id => {
  d3.select(`#${id}`).on("change", function() {
    const activeFilters = Object.keys(countryMap)
      .filter(cid => d3.select(`#${cid}`).property("checked"))
      .map(cid => countryMap[cid]);

    playerGroups
      .transition()
      .duration(150)
      .style("opacity", d => {
        if (activeFilters.length === 0) return 1;
        return activeFilters.every(country => d[country] === 1) ? 1 : 0.15;
      })
      .attr("pointer-events", d => {
        if (activeFilters.length === 0) return "all";
        return activeFilters.every(country => d[country] === 1) ? "all" : "none";
      });
  });
});



//-----------------------------------------------------------------
// Borde blanco para los jugadores galardonados
//-----------------------------------------------------------------

svg.selectAll(".player-group")
  .filter(d => d.solo_award2 === 1)                                      //Solo_award = 2 significa un premio importante: BDOR, The Best, Golden Boot
  .selectAll(".main-shape")                                             //Solo afecta a main-shape, caso contrario
  .attr("stroke", "white")                                              //Agregaría borde también a los diamantes interiores
  .attr("stroke-width", 5)
  .attr("paint-order", "stroke");

//-----------------------------------------------------------------
// Eje Y con Banderas y data de los países del Ranking
//-----------------------------------------------------------------

svg.selectAll(".country-border-diamond")                                //Borde claro que enmarca las banderas
  .data(Array.from(rankToCountry.entries()))
  .join("path")
  .attr("class", "country-border-diamond")
  .attr("d", () => customStar(20))
  .attr("fill", "#EEDFD4")
  .attr("transform", ([rank]) => `translate(-75, ${rankScale(rank)})`);

svg.selectAll(".country-diamond")                                       //Rombos con relleno de banderas
  .data(Array.from(rankToCountry.entries()))
  .join("path")
  .attr("class", "country-diamond")
  .attr("d", () => customStar(16))
  .attr("fill", ([rank, country]) => `url(#flag-${country})`)           //Relleno de banderas
  .attr("transform", ([rank]) => `translate(-75, ${rankScale(rank)})`);

svg.selectAll(".country-glow")                                          //Brillo inferior derecho en las banderas
  .data(Array.from(rankToCountry.entries()))
  .join("path")
  .attr("d", () => customStar(16))
  .attr("y", ([rank]) => rankScale(rank) - 30)
  .attr("fill", "url(#overlay-gradient)")
  .style("mix-blend-mode", "soft-light") 
  .attr("opacity", 0.75);

svg.selectAll(".country-label-full")                                    //Nombre de los países
  .data(Array.from(rankToCou.entries()))
  .join("text")
  .attr("class", "country-label-full")
  .attr("x", - 75)
  .attr("y", ([rank]) => rankScale(rank) + 25)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("fill", "#3E3A38")
  .attr("font-family", "'Inter', sans-serif")
  .attr("font-size", "16px")
  .attr("font-weight", "900")
  //.attr("transform", ([rank]) => `rotate(45, -65, ${rankScale(rank) - 30
  //.attr("stroke", "#EEDFD4").attr("stroke-width", 5).attr("paint-order", "stroke")
  .text(([rank, country]) => country);

svg.selectAll(".country-label-rank")                                    //Ranking de los países
  .data(Array.from(rankToCou.entries()))
  .join("text")
  .attr("class", "country-label-rank")
  .attr("x", -115)
  .attr("y", ([rank]) => rankScale(rank))
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("fill", "#3E3A38")
  .attr("font-family", "'Inter', sans-serif")
  .attr("font-size", "12px")
  .attr("font-weight", "600")
  //.attr("transform", ([rank]) => `rotate(-45, -95, ${rankScale(rank) - 20})`)
  .text(([rank, country]) => '# '+rank);




}).catch(err => console.error(err));




