/* Leesteksten uit het tekstboek (¡Sí, claro! nuevo 1.2, unidades 1, 2, 3, 5,
 * 6 en 7): de openingsteksten, de Panamericana- en De fiesta-pagina's en
 * andere doorlopende teksten, telkens met enkele begripsvragen.
 *
 * Waar het boek zelf vragen stelt (verdadero o falso, de juiste titel, vragen
 * bij de tekst) zijn die overgenomen; de rest is eigen werk. Elke vraag is
 * met de tekst te beantwoorden. De Miradores (unidad 4 en 8) staan elders. */

const TF = ['verdadero', 'falso'];

/* De app schudt de opties niet. Hieronder staat het juiste antwoord telkens
 * eerst (makkelijk na te lezen); de bouwer zet de opties daarom alfabetisch,
 * behalve bij verdadero/falso. */
const order = options => (options === TF ? TF : [...options].sort((a, b) => a.localeCompare(b, 'es')));

/** Maakt een vraagbouwer voor één tekst: ask(n, q, options, answer, nl). */
const about = (slug, unit, src) => (n, q, options, answer, nl) => ({
  id: `r.${slug}.${n}`,
  kind: 'reading',
  theme: `lezen-u${unit}`,
  text: `t.${slug}`,
  q,
  options: order(options),
  answer,
  nl,
  src,
});

const SRC = {
  enCamino: 'spanish-md/IMG_20260918_200949006.md',
  caminoInca: 'spanish-md/IMG_20260918_201007465.md',
  peru: 'spanish-md/IMG_20260918_201044490.md',
  masQueComer: 'spanish-md/IMG_20260918_201131546.md',
  chile: 'spanish-md/IMG_20260918_201220798.md',
  miCasa: 'spanish-md/IMG_20260918_201312548.md',
  xiu: 'spanish-md/IMG_20260918_201320526.md',
  chocolate: 'spanish-md/IMG_20260918_201339765.md',
  argentina: 'spanish-md/IMG_20260918_201358508.md',
  seguimos: 'spanish-md/IMG_20260918_201852200_AE.md',
  mujika: 'spanish-md/IMG_20260918_201929912_AE.md',
  navidad: 'spanish-md/IMG_20260918_201953739.md',
  rastro: 'spanish-md/IMG_20260918_202025267_AE.md',
  carnaval: 'spanish-md/IMG_20260918_202058516.md',
  prudencio: 'spanish-md/IMG_20260918_202122958_AE.md',
  siesta: 'spanish-md/IMG_20260918_202139224_AE.md',
  mondariz: 'spanish-md/IMG_20260918_202144885_AE.md',
  temazcal: 'spanish-md/IMG_20260918_202157732_AE.md',
  fallas: 'spanish-md/IMG_20260918_202210120.md',
};

const texts = {
  // ── Unidad 1 · Caminando ────────────────────────────────────────────────
  't.en-camino': {
    title: 'En camino',
    es: [
      'Son las seis de la mañana. Sale el sol. Me levanto, me lavo y me pongo ropa cómoda. Desayuno con mis compañeros. Desayunamos bien porque necesitamos energía. El día es largo y queremos caminar muchos kilómetros. Todos nos ponemos también sombreros para no tener problemas con el sol.',
      'Después de desayunar, estudiamos la ruta, nos concentramos en las etapas. Hemos dividido el camino en 30 etapas, caminamos unos 25 kilómetros cada día. A veces caminamos en silencio, a veces hablamos.',
      'Nunca nos aburrimos porque siempre hay cosas nuevas: conocemos a otros peregrinos de muchos países, vemos paisajes diferentes… No tenemos prisa. Cuando nos cansamos, nos sentamos y hacemos una pausa para relajarnos un poco. ¡Nuestros pobres pies!',
      'Después de la comida, por la tarde, nos separamos. Yo sigo solo, a mi ritmo. Así tengo tiempo de tomar fotos y hago pausas para escribir mi diario del viaje.',
      'Por la noche dormimos en albergues para peregrinos. Nos duchamos y nos acostamos. Yo siempre me acuesto el último porque me gusta disfrutar del silencio de la noche y mirar las estrellas en el cielo. Si no llueve, claro…',
    ].join('\n\n'),
    nl: 'Een pelgrim op de Camino de Santiago beschrijft zijn dag, van het opstaan om zes uur tot het sterren kijken bij de herberg.',
    src: SRC.enCamino,
  },
  't.camino-inca': {
    title: 'Consejos para el Camino Inca',
    es: [
      'El Camino Inca en Perú va desde Cusco, la antigua capital del Imperio inca, a Machu Picchu, la ciudad perdida de los incas. La ruta solamente se puede hacer en grupos pequeños y con un guía de una agencia de viajes autorizada. El tour más popular dura cuatro días. Aquí hay algunos consejos para recorrer estos 45 kilómetros:',
      '– Conviene hacer la reserva varios meses antes.',
      '– El Camino llega a los 4200 metros de altura, por eso se recomienda pasar unos días en Cusco (3400 m) para acostumbrarse y así no tener problemas de soroche, el mal de las alturas.',
      '– Los meses menos recomendados son enero, febrero y marzo porque llueve mucho. En abril hace sol, pero a veces está nublado. Es mejor viajar en junio, julio o agosto: hace buen tiempo y las temperaturas llegan a los 21°.',
      '– No conviene llevar niños a esta excursión.',
      '– Se recomienda llevar zapatos cómodos y un anorak contra el viento y el frío.',
      '– No es necesario llevar alimentos, la agencia de viajes organiza la comida.',
    ].join('\n\n'),
    nl: 'Praktische tips voor de vierdaagse Inca-trail van Cusco naar Machu Picchu: reserveren, hoogteziekte, het beste seizoen en wat je meeneemt.',
    src: SRC.caminoInca,
  },
  't.peru-pilar': {
    title: 'En Perú con Pilar',
    es: [
      '¡Hola! Me presento: soy Pilar Rolfs y soy peruana. Trabajo como profesora de español y coordinadora de cursos. Quiero contarles algo sobre mi hermoso país.',
      'Empiezo con Lima, la capital. Con casi 10 millones de habitantes es el centro político, económico y financiero del país. En su centro histórico, declarado Patrimonio de la Humanidad por la UNESCO, se han restaurado muchos edificios coloniales.',
      'Pero hay otras ciudades atractivas, por ejemplo en el sur está Arequipa, llamada "la ciudad del eterno cielo azul" porque tiene un clima fantástico: 300 días de sol al año. Desde Arequipa se puede viajar al famoso lago Titicaca. Otra ciudad interesante es Piura, en el norte, la más antigua de Perú. El famoso escritor peruano Mario Vargas Llosa dice que sus habitantes son los más alegres y abiertos del país.',
      '¿Sabe cuál es el lugar más visitado de Perú? Iquitos, una ciudad grande al lado del río Amazonas. Es un poco difícil llegar porque el viaje solo es posible en barco o avión. Allí puede hacer una excursión por la selva y ver caimanes, monos o delfines rosas.',
      'Si le interesan las antiguas culturas prehispánicas, tiene que visitar Cusco, la capital del Imperio inca, que conserva los muros de sus antiguos templos. La ciudad está a 3400 metros de altura, por eso los primeros días es importante acostumbrarse. Desde Cusco puede ir a uno de los lugares más fascinantes del mundo: Machu Picchu.',
      '¡Oh! No tengo más espacio y quería contar muchas cosas más, por ejemplo sobre la riquísima cocina peruana. ¿Cuándo viene para conocer mi país?',
    ].join('\n\n'),
    nl: 'Pilar, een Peruaanse lerares Spaans, stelt haar land voor: Lima, Arequipa, Piura, Iquitos aan de Amazone en Cusco.',
    src: SRC.peru,
  },

  // ── Unidad 2 · Tengo planes ─────────────────────────────────────────────
  't.mas-que-comer': {
    title: 'Más que comer',
    es: [
      'Ir al cine, hacer deporte o ver la tele son las actividades favoritas de los españoles en su tiempo libre, igual que en el resto de Europa. Pero para muchos españoles hay otra muy importante: salir a comer.',
      'No se trata solo de la comida, sino también del aspecto social. Por eso las comidas son muy largas, con tiempo para charlar, contar anécdotas o conocer quizás a otros invitados. Y hablar de comida. "La mejor paella es la que hace mi madre", "¿De verdad te gusta más la tortilla francesa que la española?", "¿Conoces un buen restaurante mexicano?" son frases que podemos escuchar durante las comidas. Y, después de la comida, en la sobremesa, también se habla del trabajo, los estudios, la familia, las vacaciones… Para los españoles, salir al restaurante no es comer para alimentarse, es disfrutar de la comida y de la compañía. Es vivir.',
    ].join('\n\n'),
    nl: 'Voor veel Spanjaarden is uit eten gaan een belangrijke sociale activiteit: lange maaltijden met veel praten, ook na het eten.',
    src: SRC.masQueComer,
  },
  't.chile-matilde': {
    title: 'En Chile con Matilde',
    es: [
      '¡Hola! Me llamo Matilde Guzmán y soy chilena. ¿Conoce Chile? ¿Quizás los vinos chilenos? Voy a contarles un poco de mi "largo y delgado país" (Pablo Neruda).',
      'En sus 4200 km de longitud, Chile ofrece paisajes que recuerdan lugares tan diferentes como el Sáhara, el Mediterráneo o Noruega. En el norte, por ejemplo, tenemos el desierto de Atacama, el más seco del mundo. En el otro extremo, la Patagonia chilena con sus islas, fiordos y glaciares. Allí se pueden encontrar colonias de pingüinos todo el año. Para mí, uno de los lugares más fascinantes del mundo es la Isla de Pascua, con sus misteriosas esculturas milenarias, los Moái. Todos estos lugares son grandes atracciones para turistas de todo el mundo.',
      'En la capital, Santiago, pueden disfrutar de sus museos y galerías de arte. En el centro histórico, la Plaza de Armas es el punto de encuentro no solo de los visitantes, sino también de muchos habitantes. Les recomiendo el barrio Bellavista, donde se encuentra la Fundación Pablo Neruda en la antigua casa del poeta. Este barrio tiene una intensa vida nocturna y excelentes restaurantes.',
      '¿Le interesa el turismo activo? Pues cerca de Santiago puede esquiar en los Andes. Si prefiere la playa, puede hacer windsurf en la costa del Pacífico. ¿Cuántas ciudades pueden ofrecer esto?',
      'Al final, les recomiendo ir a Valparaíso, para muchos la capital cultural de Chile. ¿Sabe que el periódico más antiguo en español es "El Mercurio de Valparaíso"? La ciudad, con su centro histórico de la época colonial, es Patrimonio de la Humanidad. Y, claro, hay que visitar el puerto. De allí salen muchos de los productos que exporta Chile: fruta fresca, pescado, madera y los famosos vinos.',
    ].join('\n\n'),
    nl: 'Matilde stelt Chili voor: van de Atacamawoestijn tot Patagonië en Paaseiland, de hoofdstad Santiago en de havenstad Valparaíso.',
    src: SRC.chile,
  },

  // ── Unidad 3 · Casa nueva, vida nueva ───────────────────────────────────
  't.mi-casa-es-tu-casa': {
    title: 'Mi casa es tu casa',
    es: [
      'Todo el mundo viaja, a todos nos gustan las vacaciones y la mayoría se aloja en hoteles o apartamentos. Sin embargo, el precio de estos es alto. ¿Qué tal ofrecer tu casa y pasar las vacaciones en una casa privada y así ahorrar mucho dinero?',
      '"Mi casa es tu casa" se dice en español como fórmula de cortesía cuando nos despedimos de una visita. Hoy en día, esta expresión también puede significar otra cosa: el intercambio de casas. Esta nueva forma de viajar está de moda. Algunos ya la practican y están muy contentos, porque no solo ahorran dinero, sino también se sienten como en su propia casa en una ciudad extranjera. Casi nadie ha tenido malas experiencias. Existen páginas web donde se puede intercambiar la vivienda.',
      'La base del intercambio es la confianza. Para ti, ¿tu casa es mi casa?',
    ].join('\n\n'),
    nl: 'Over huizenruil als goedkope en populaire manier van reizen, en wat de uitdrukking "mi casa es tu casa" betekent.',
    src: SRC.miCasa,
  },
  't.guillermo-xiu': {
    title: 'Mi casa en otro país',
    es: [
      'Guillermo Xiu, representante de una comunidad maya, nació en México. Allí estudió Antropología y también aprendió un arte muy especial: hacer esculturas de chocolate. El chocolate es muy importante para él porque tiene una gran tradición en su país: en México se empezó a consumir cacao alrededor de 1500 a. C. Años más tarde, Guillermo Xiu se fue a España, donde trabajó varios años en un museo de chocolate. Allí realizó espectaculares esculturas de chocolate y explicó el significado del cacao para las antiguas culturas americanas.',
      'Actualmente participa en encuentros interculturales donde presenta sus esculturas y habla de proyectos de solidaridad con el pueblo maya para informar sobre las propiedades terapéuticas del cacao.',
    ].join('\n\n'),
    nl: 'Korte biografie van Guillermo Xiu, een Mexicaanse Maya die chocoladebeelden maakt en naar Spanje verhuisde.',
    src: SRC.xiu,
  },
  't.historia-chocolate': {
    title: 'Una historia con gusto',
    es: [
      'Señor Rivero, usted es el director del museo Chocomundo en la provincia de Sevilla. ¿Puede resumir en una frase la historia del cacao?',
      '— Ya las culturas prehispánicas utilizaron el cacao como alimento, pero también como moneda y en rituales religiosos.',
      '¿Fue Cristóbal Colón quien lo llevó a España?',
      '— Sí, pero al principio el cacao no les gustó a los españoles porque lo encontraron muy amargo. Por eso lo mezclaron con azúcar, vainilla y canela, así nació el chocolate actual.',
      '¿Cómo pasó el chocolate de España al resto de Europa?',
      '— Pues en 1606 llegó a Italia, de ahí en 1646 a Alemania. En Alemania al principio lo tomaron como medicina, no como bebida. En 1819 se fundó en Suiza la primera fábrica de chocolate y allí se creó el chocolate con leche, tan popular hoy en día.',
      '¿Y qué opina de las tendencias actuales como mezclar chocolate con chile?',
      '— Es una tendencia muy antigua, ya conocida por los mayas.',
    ].join('\n\n'),
    nl: 'Interview met de directeur van een chocolademuseum over de geschiedenis van cacao, van de Maya\'s tot de eerste chocoladefabriek.',
    src: SRC.chocolate,
  },
  't.argentina-hortensia': {
    title: 'En Argentina con Hortensia',
    es: [
      'Hola, me llamo Hortensia y soy argentina, pero vivo en Lovaina y soy profesora de español. Mi ciudad preferida es Buenos Aires, pero claro, es que yo soy de allí, soy porteña (así se llaman los habitantes de Buenos Aires, por el puerto). Es una ciudad enorme, con 14 millones de habitantes, una ciudad fascinante, con una vida cultural única. ¿Quién no conoce las casas del barrio de La Boca o la Avenida Corrientes, "una calle que nunca duerme", con sus teatros, galerías y librerías que abren las 24 horas? Pero yo, cuando pienso en Buenos Aires, vuelvo siempre a la calle Defensa, a la farmacia más antigua de la ciudad, que fue de mi padre y ahora es de mi hermano. Si quiere conocer la ciudad, le recomiendo tomar el colectivo (así se llaman los autobuses en Argentina).',
      'Buenos Aires está junto al Río de la Plata, que allí es casi tan ancho como el mar. En el Río de la Plata nació el famoso tango, una música única con textos de historias tristes de amor. Algunos grandes artistas del tango son Carlos Gardel o Ástor Piazzolla, que lo modernizó. ¿Sabe en qué otro país hay muchos aficionados del tango? ¡En Finlandia! Se dice que llegó allí gracias a los marineros argentinos.',
      'Argentina es un país de grandes escritores como Jorge Luis Borges o Julio Cortázar. Nuestra tradición literaria empezó ya con las historias de los gauchos. A los argentinos nos gusta contar historias y compartirlas con los amigos tomando un mate, una bebida caliente de té de mate, que se toma en un "vaso" especial. Cuando una persona llega de visita a una casa, después del saludo siempre viene la pregunta: "¿Unos mates?" Hay un ritual para beberlo: todos beben del mismo vaso y lo pasan de mano en mano.',
      'Para los amantes de la naturaleza, mi país ofrece lugares maravillosos. El paisaje que más me fascina es la Patagonia. Ver el Perito Moreno o hacer una excursión en barco para ver ballenas es un espectáculo inolvidable.',
    ].join('\n\n'),
    nl: 'Hortensia, een Argentijnse in Leuven, vertelt over Buenos Aires, de tango, het matedrinken en Patagonië.',
    src: SRC.argentina,
  },

  // ── Unidad 5 · El gusto de aprender ─────────────────────────────────────
  't.seguimos-estudiando': {
    title: '¿Seguimos estudiando?',
    es: [
      'Peter: ¡Hola, profe! Una noticia: dejo de participar en el curso… es que tengo un nuevo puesto en Viena y empiezo a trabajar el próximo mes. ¡Qué pena!',
      'Marta: Querida profesora: Estoy en Perú y me quedo dos meses más. Pero vuelvo a inscribirme en el próximo curso. Aquí una foto de Cusco y ¡muchos saludos a todos!',
      'David: Estimada Inés: Acabo de comprar una casa y la estoy renovando, uff, ¡pero sigo asistiendo al curso! Un abrazo.',
    ].join('\n\n'),
    nl: 'Drie cursisten laten hun lerares Spaans na de vakantie weten of ze volgend jaar terugkomen.',
    src: SRC.seguimos,
  },
  't.jose-mujika': {
    title: 'Aprendí a nadar a los 30 años y hoy gano medallas',
    es: [
      'José Mujika Eizagirre es bombero en San Sebastián y además un gran deportista. En los campeonatos mundiales de bomberos del año 2008 en Liverpool ganó tres medallas de oro en natación.',
      'José, todos sabemos que los bomberos están muy en forma, pero ganar medallas ya es algo especial, ¿no?',
      '— Bueno, yo siempre he practicado mucho deporte, pero curiosamente aprendí a nadar muy tarde. La mayoría de la gente lo aprende en la infancia, pero yo lo hice a los 30 años cuando entré en los bomberos en 1993.',
      '¡No me digas! ¿Cómo fue la experiencia?',
      '— Fue un poco difícil: tuve que superar el miedo al agua y, claro, la vergüenza. Pero encontré un profesor excelente que me ayudó mucho. Con su ayuda aprendí muy rápido. Me sentí muy orgulloso porque muchas veces se piensa que los adultos no pueden aprender estas cosas, pero nunca es demasiado tarde. Ahora me encanta nadar y nado tres horas todos los días para entrenarme.',
      '¿El campeonato en Liverpool fue tu primer campeonato?',
      '— No, el primero fue en 2006 en Australia y el segundo en 2007 en Canadá.',
      'Tienes una anécdota simpática. ¿Nos la cuentas?',
      '— Sí. Como mi apellido suena un poco extraño, cuando gané una de las medallas escribieron como nacionalidad Afganistán.',
    ].join('\n\n'),
    nl: 'Interview met een Baskische brandweerman die pas op zijn dertigste leerde zwemmen en nu wereldkampioen zwemmen bij de brandweer is.',
    src: SRC.mujika,
  },
  't.navidad-reyes': {
    title: 'La Navidad y los Reyes Magos',
    es: [
      'La Navidad tiene en todos los países hispanohablantes un carácter festivo y alegre. Se decora la casa con el árbol de Navidad y el belén, se comen dulces típicos y hay mucha alegría. Pero en cada país hay algo especial.',
      'Virginia es de Ciudad de México y nos habla de una tradición navideña mexicana: "Las posadas se celebran entre el 16 y el 24 de diciembre. Durante esos días en cada casa se prepara comida para la gente que pide posada, es decir comida y casa. Esta tradición simboliza la peregrinación de San José y la Virgen María a Belén. En realidad, la fecha de las posadas coincide con una celebración prehispánica azteca en honor al sol, que después se cristianizó. Las personas que piden posada pueden ser familiares, amigos o vecinos. Cantan canciones tradicionales, y los anfitriones los invitan a comer. Para mí son recuerdos hermosos de mi infancia y creo que también muestra la hospitalidad de los mexicanos."',
      'Javier nos cuenta cómo es la fiesta de los Reyes Magos en España: "Quizás es la más bonita para los niños. Tradicionalmente los Reyes Magos, Melchor, Gaspar y Baltasar, traen los regalos a los niños. El día de Reyes es el día 6 de enero, pero la fiesta empieza ya el día 5 con la cabalgata, que es el desfile de los Reyes por la ciudad. En mi ciudad, Madrid, la cabalgata es muy grande, con camellos de verdad. Los Reyes recorren muchas calles y regalan caramelos a los niños. Es una fiesta preciosa y los niños están alegres y emocionados. Algunos entregan cartas a los Reyes para decirles qué regalos desean.',
      'Después de la cabalgata, los niños se acuestan. Antes dejan sus zapatos en la puerta y también comida para los Reyes y agua para los camellos. Todos intentan no dormir para poder verlos cuando entran en la casa a dejar los regalos. Pero nunca lo consiguen, y así conservan la ilusión un año más."',
    ].join('\n\n'),
    nl: 'Twee kersttradities: de Mexicaanse posadas (16–24 december) en het Spaanse Driekoningenfeest met de optocht op 5 januari.',
    src: SRC.navidad,
  },

  // ── Unidad 6 · Te lo compro ─────────────────────────────────────────────
  't.rastro': {
    title: 'El Rastro, más que un mercadillo',
    es: [
      '¿Está usted en Madrid un domingo y no sabe qué hacer? ¿Quiere sentirse "madrileño"? Tenemos el plan perfecto: ir al Rastro. Es el mercadillo más típico de Madrid y casi de España. El Rastro está en Embajadores, un barrio del centro con mucha tradición, y se puede decir que todos los madrileños han comprado alguna vez algo allí.',
      'En el Rastro se puede encontrar de todo. Si alguien busca libros, algún mueble para la casa, ropa de segunda mano, alguna revista antigua, arte, algo que colecciona… tiene que ir al Rastro o a alguna de las tiendas de decoración o de ropa que hay alrededor de él. Nadie se va con las manos vacías.',
      'La mejor hora para ir es a partir de las 11 h, pero algunos van antes porque es más tranquilo y se puede regatear mejor, es decir, negociar el precio con los vendedores. Regatear bien es un arte.',
      '¿Cansados de la visita al Rastro? Es el momento de ir a tomar unas tapas con una copa de vino o una cerveza fresca en alguno de los bares típicos de la Plaza de Cascorro, ¡un placer!',
    ].join('\n\n'),
    nl: 'Over de Rastro, de bekende zondagse rommelmarkt in Madrid, waar je van alles vindt en kunt afdingen.',
    src: SRC.rastro,
  },
  't.carnaval-oruro': {
    title: 'El carnaval de Oruro',
    es: [
      'Hola, me llamo Pilar y soy boliviana, de La Paz, pero hoy les voy a hablar de Oruro, la ciudad de mi padre, y de una de las tradiciones más hermosas de mi país: el carnaval.',
      'Oruro no es muy grande, tiene unos 340 000 habitantes, pero en las fiestas del carnaval pueden ser casi un millón. Es una de las fiestas más espectaculares de América Latina. La UNESCO le dio el título de Patrimonio de la Humanidad.',
      'Yo estuve allí varias veces y siempre me impresionó. Con sus bailes y sus máscaras, el carnaval representa una fusión de creencias prehispánicas y cristianas. En su origen la fiesta simboliza los peligros del trabajo en las minas.',
      'En Oruro se vive para el carnaval. Siete meses antes los participantes empiezan a preparar los disfraces y las coreografías. El festejo principal es un desfile de cuatro kilómetros.',
      'Los bailes son importantísimos en esta fiesta. Mi baile favorito es "la Diablada", que representa la lucha del bien y del mal. Participan más de 400 bailarines vestidos de rojo y con máscaras. También hay otros grupos con otros temas. Todos me gustan, pero "la Diablada" tiene algo, no sé… No lo puedo describir. Hay que verlo y vivirlo.',
    ].join('\n\n'),
    nl: 'De Boliviaanse Pilar vertelt over het spectaculaire carnaval van Oruro, met zijn maskers en de dans "la Diablada".',
    src: SRC.carnaval,
  },
  't.carnaval-cadiz': {
    title: 'El carnaval de Cádiz',
    es: [
      'Carmen nos habla de Cádiz: "Es una ciudad muy, muy bonita, de verdad. ¿Saben dónde está? En Andalucía, en la puntita de la península.',
      'En Cádiz hay muchas cosas atractivas, pero quizás la más espectacular es el carnaval. Aquí vivimos medio año preparando la próxima fiesta y medio año recordando la fiesta anterior. ¿Por qué es especial? Por su ambiente y su música.',
      'En el carnaval participan varios tipos de grupos. Los más típicos son "los coros", que cantan canciones serias, y "las chirigotas", que cantan canciones críticas y satíricas. Los grupos escriben los textos y componen la música de las canciones y compiten entre ellos en concursos.',
      'También se hacen los disfraces que se llevan esos días. Cada año uno distinto, claro. Yo tengo un armario lleno de mis viejos disfraces: pirata, princesa, mosquito…',
      'En carnaval todos nos disfrazamos y salimos a la calle. Los bares están llenos, se come "pescaíto frito" a todas horas.',
      'Los gaditanos, así se llama la gente de Cádiz, somos simpáticos por naturaleza y nos encanta hablar y conocer gente. Es muy fácil, cualquier comentario sobre el disfraz es suficiente para empezar una conversación."',
    ].join('\n\n'),
    nl: 'Carmen vertelt over het carnaval van Cádiz, met zijn zanggroepen, verkleedkostuums en gezellige sfeer.',
    src: SRC.carnaval,
  },

  // ── Unidad 7 · ¡Qué descanso! ───────────────────────────────────────────
  't.diario-prudencio': {
    title: 'El diario de Prudencio',
    es: [
      'Lunes. Querido diario: estoy muy mal, tengo fiebre y me duele la cabeza. El médico dice que es solo un resfriado, pero yo sé que es algo grave. Ay, ay, ay.',
      'Martes. Nadie me comprende. Me duele la garganta, tengo tos y ahora, además, me duele el estómago. El médico dice que es porque tomo demasiadas aspirinas, pero creo que es algo grave.',
      'Miércoles. Hoy me duele la espalda. El médico dice que es porque trabajo todo el día en la oficina y me recomienda hacer deporte.',
      'Jueves. Hoy no me puedo mover. Estoy fatal. Me duele todo el cuerpo, incluso me duelen los pies. El médico dice que he hecho demasiado deporte. ¡Quiero curarme!',
      'Viernes. Hoy no me duele nada. Eso me preocupa. No sé qué piensa el médico. He llamado a la consulta del doctor para pedir hora, pero su asistente dice que no está, que se ha ido a un balneario para descansar porque tiene mucho estrés con algunos pacientes. ¡Qué extraño! El lunes voy a buscar otro médico.',
    ].join('\n\n'),
    nl: 'Het grappige dagboek van Prudencio, een hypochonder die elke dag een nieuwe kwaal heeft, tot zijn dokter zelf uitgeput op kuur gaat.',
    src: SRC.prudencio,
  },
  't.siesta': {
    title: 'Volver a la "Spanish siesta"',
    es: [
      'Durante mucho tiempo la siesta, es decir, la costumbre española de dormir después de comer, tuvo muy mala fama: "Es perder el tiempo", "No es productiva"… Pero ahora se ha demostrado científicamente que la siesta es más que una costumbre agradable, es también una costumbre sana.',
      'Según un estudio de la Universidad de Harvard, 40 minutos de siesta mejoran la productividad de una persona en el trabajo en un 34 %. Los expertos de esta universidad lo llaman "power nap". En algunas empresas de los Estados Unidos hay habitaciones para dormir unos minutos. Pero no es necesario tener una cama cómoda para la siesta: dormir en un sillón basta para descansar y tener otra vez energía suficiente.',
      '¿Hay alguna diferencia entre "siesta" y "power nap"? No. Pero si lo dice Harvard, parece verdad y si lo dice Pepe Martínez, no.',
    ].join('\n\n'),
    nl: 'De siesta had lang een slechte naam, maar volgens Harvard maakt een dutje na het eten je productiever.',
    src: SRC.siesta,
  },
  't.mondariz': {
    title: 'El balneario de Mondariz',
    es: [
      'El balneario de Mondariz se encuentra en la provincia de Pontevedra, en un paisaje de bosques y montañas. Y muchas fuentes. El agua, muy rica en minerales, es la gran riqueza de esta zona y la razón de su fama.',
      'Ya desde su fundación en 1874, la gente iba a Mondariz para disfrutar de las aguas medicinales. En esa época, los balnearios eran lugares exclusivos y los clientes eran personas ricas que podían pagar esos lujos. Las curas en el balneario eran muy variadas: los pacientes paseaban por los bosques y jardines, hacían ejercicio, se bañaban en aguas termales y, sobre todo, bebían las aguas medicinales.',
      'Muchos visitantes del balneario se alojaban en el Gran Hotel, un alojamiento de lujo que ofrecía un servicio exquisito.',
      'En la actualidad, Mondariz combina su larga tradición de balneario con terapias actuales y las ofertas de tiempo libre que piden los clientes de hoy.',
    ].join('\n\n'),
    nl: 'Over het Galicische kuuroord Mondariz: vroeger een luxeoord voor rijke gasten, nu een combinatie van traditie en moderne therapieën.',
    src: SRC.mondariz,
  },
  't.temazcal': {
    title: 'El baño de temazcal',
    es: [
      'El baño de temazcal, un baño de origen prehispánico, se practicaba como ritual y tenía un uso terapéutico, incluso estético. Era un baño de vapor aromatizado con hierbas frescas. También se tomaban tés y sopas medicinales.',
      'La gente iba al baño de temazcal para tratar problemas diferentes, por ejemplo dolores de espalda y dolores musculares. Las mujeres que esperaban un bebé lo usaban para relajarse antes de su nacimiento. Una de las características del baño temazcal: no había separación de hombres y mujeres, todos lo usaban juntos.',
      'Hoy todavía se usa como tratamiento medicinal, pero mucha gente también va solo para relajarse.',
    ].join('\n\n'),
    nl: 'Over de temazcal, een eeuwenoud Mexicaans stoombad met kruiden, dat nog altijd gebruikt wordt.',
    src: SRC.temazcal,
  },
  't.fallas': {
    title: 'Las Fallas de Valencia',
    es: [
      'Me llamo Eva y quiero presentarles una de las fiestas más espectaculares de España: las Fallas de Valencia.',
      'Del 15 al 19 de marzo Valencia vive una fiesta llena de color, fuego y ruido para celebrar la primavera. El nombre viene de unas esculturas enormes de cartón que se llaman "fallas". Estas esculturas están formadas por muchas figuras y pueden tener hasta 20 metros de altura. Cada falla tiene un tema, generalmente de actualidad y de carácter satírico.',
      'Cada barrio de la ciudad tiene su propia falla. Los vecinos se reúnen en asociaciones durante todo el año para prepararla. Después, las fallas se ponen en una plaza o en una esquina del barrio y el día 19 de marzo se queman. Mucha gente piensa que estamos locos: todo el año preparamos las fallas y después ¡las quemamos!',
      'Pero no se quema todo: una figura se guarda. No toda la falla, solo una figura. Hay un concurso y la figura ganadora no se quema, sino que va al Museo de las Fallas.',
      'La fiesta dura cinco días y es muy, muy ruidosa. No solo porque hay música, sino por el ruido de las explosiones de los petardos. Cada día, a las dos de la tarde, tiene lugar "la mascletà", un juego de petardos que tiene una "melodía". Para nosotros, los valencianos, es música, para los turistas, mucho ruido.',
      'Durante el día se visitan las fallas y se come y se bebe por la calle en los numerosos puestos de comida y bebida. Por la noche, hay conciertos gratis de artistas conocidos y a medianoche un espectáculo de fuegos artificiales. Los valencianos somos famosos por los fuegos artificiales. Luego, vamos a bailar y a pasarlo bien en los bares.',
      'Y a las ocho de la mañana, la fiesta empieza de nuevo con mucho ruido de petardos para despertar a los vecinos y para recordar que la fiesta sigue. La noche de San José se queman las fallas. Es un espectáculo de fuego sin igual. De las fallas casi no queda nada. Y entonces ya empezamos a pensar en la fiesta del próximo año. ¿Nos vemos en Valencia?',
    ].join('\n\n'),
    nl: 'Eva stelt de Fallas van Valencia voor: reusachtige kartonnen beelden, vuurwerk en lawaai, en op 19 maart gaat alles in vlammen op.',
    src: SRC.fallas,
  },
};

// ── Vragen ────────────────────────────────────────────────────────────────

const enCamino = about('en-camino', 1, SRC.enCamino);
const caminoInca = about('camino-inca', 1, SRC.caminoInca);
const peru = about('peru-pilar', 1, SRC.peru);
const masQueComer = about('mas-que-comer', 2, SRC.masQueComer);
const chile = about('chile-matilde', 2, SRC.chile);
const miCasa = about('mi-casa-es-tu-casa', 3, SRC.miCasa);
const xiu = about('guillermo-xiu', 3, SRC.xiu);
const chocolate = about('historia-chocolate', 3, SRC.chocolate);
const argentina = about('argentina-hortensia', 3, SRC.argentina);
const seguimos = about('seguimos-estudiando', 5, SRC.seguimos);
const mujika = about('jose-mujika', 5, SRC.mujika);
const navidad = about('navidad-reyes', 5, SRC.navidad);
const rastro = about('rastro', 6, SRC.rastro);
const oruro = about('carnaval-oruro', 6, SRC.carnaval);
const cadiz = about('carnaval-cadiz', 6, SRC.carnaval);
const prudencio = about('diario-prudencio', 7, SRC.prudencio);
const siesta = about('siesta', 7, SRC.siesta);
const mondariz = about('mondariz', 7, SRC.mondariz);
const temazcal = about('temazcal', 7, SRC.temazcal);
const fallas = about('fallas', 7, SRC.fallas);

const atoms = [
  // En camino (boek: titels bij de alinea's, activiteiten van de pelgrim)
  enCamino(1, '¿A qué hora se levanta el peregrino?',
    ['a las seis', 'a las siete', 'a las once'], 'a las seis',
    '"Son las seis de la mañana. Sale el sol. Me levanto…"'),
  enCamino(2, 'Los peregrinos caminan unos 25 kilómetros cada día.', TF, 'verdadero',
    '"Hemos dividido el camino en 30 etapas, caminamos unos 25 kilómetros cada día."'),
  enCamino(3, 'Welke titel uit het boek past bij de laatste alinea (de nacht in de herberg)?',
    ['La paz de la noche', 'Comienzo mi día', '¡A caminar!', 'Mis momentos'], 'La paz de la noche',
    'De laatste alinea gaat over de stilte van de nacht en naar de sterren kijken.'),
  enCamino(4, 'Welke titel past bij de alinea waarin de pelgrim in de namiddag alleen verder stapt?',
    ['Mis momentos', 'Comienzo mi día', 'La paz de la noche'], 'Mis momentos',
    '"Yo sigo solo, a mi ritmo. Así tengo tiempo de tomar fotos…": dat zijn zijn eigen momenten.'),
  enCamino(5, 'El peregrino siempre se acuesta el primero.', TF, 'falso',
    '"Yo siempre me acuesto el último": hij gaat als laatste slapen.'),
  enCamino(6, 'Wat betekent "nunca nos aburrimos" in deze tekst?',
    ['we vervelen ons nooit', 'we worden nooit moe', 'we hebben nooit haast'], 'we vervelen ons nooit',
    'Aburrirse = zich vervelen: "Nunca nos aburrimos porque siempre hay cosas nuevas." Moe worden is cansarse.'),

  // Camino Inca (boek: de zes vragen bij de tekst)
  caminoInca(1, '¿Se puede hacer el Camino Inca solo?',
    ['No, solo en grupos pequeños y con un guía.', 'Sí, sin ningún problema.', 'Sí, pero solo en verano.'],
    'No, solo en grupos pequeños y con un guía.',
    '"La ruta solamente se puede hacer en grupos pequeños y con un guía de una agencia de viajes autorizada."'),
  caminoInca(2, '¿Cuántos kilómetros tiene el Camino Inca?',
    ['45 kilómetros', '25 kilómetros', '4200 kilómetros'], '45 kilómetros',
    '"…algunos consejos para recorrer estos 45 kilómetros". 4200 is de hoogte in meter.'),
  caminoInca(3, '¿Cuáles son los mejores meses para hacer la ruta?',
    ['junio, julio y agosto', 'enero, febrero y marzo', 'abril y mayo'], 'junio, julio y agosto',
    '"Es mejor viajar en junio, julio o agosto: hace buen tiempo." In januari tot maart regent het veel.'),
  caminoInca(4, '¿Qué se recomienda para evitar el mal de las alturas?',
    ['pasar unos días en Cusco antes', 'llevar un anorak', 'hacer la reserva varios meses antes'],
    'pasar unos días en Cusco antes',
    '"…se recomienda pasar unos días en Cusco (3400 m) para acostumbrarse y así no tener problemas de soroche".'),
  caminoInca(5, 'Wat is "el soroche"?',
    ['hoogteziekte', 'een soort regenjas', 'de gids van het reisbureau'], 'hoogteziekte',
    'De tekst legt het zelf uit: "soroche, el mal de las alturas".'),
  caminoInca(6, 'Hay que llevar comida para los cuatro días.', TF, 'falso',
    '"No es necesario llevar alimentos, la agencia de viajes organiza la comida."'),

  // En Perú con Pilar
  peru(1, '¿Por qué llaman a Arequipa "la ciudad del eterno cielo azul"?',
    ['Porque tiene 300 días de sol al año.', 'Porque está al lado del lago Titicaca.', 'Porque es la ciudad más antigua de Perú.'],
    'Porque tiene 300 días de sol al año.',
    '"…porque tiene un clima fantástico: 300 días de sol al año."'),
  peru(2, '¿Cuál es la ciudad más antigua de Perú?',
    ['Piura', 'Lima', 'Cusco', 'Iquitos'], 'Piura',
    '"Otra ciudad interesante es Piura, en el norte, la más antigua de Perú."'),
  peru(3, 'A Iquitos se puede llegar en coche o en autobús.', TF, 'falso',
    '"…el viaje solo es posible en barco o avión."'),
  peru(4, 'Según Pilar, ¿cuál es el lugar más visitado de Perú?',
    ['Iquitos', 'Machu Picchu', 'Lima'], 'Iquitos',
    '"¿Sabe cuál es el lugar más visitado de Perú? Iquitos, una ciudad grande al lado del río Amazonas."'),
  peru(5, 'Wat betekent "la selva" in "una excursión por la selva"?',
    ['het oerwoud', 'de rivier', 'de woestijn'], 'het oerwoud',
    'Iquitos ligt aan de Amazone; in de selva (het tropische woud) zie je kaaimannen en apen.'),
  peru(6, 'Pilar trabaja como guía turística.', TF, 'falso',
    '"Trabajo como profesora de español y coordinadora de cursos."'),

  // Más que comer
  masQueComer(1, 'Para muchos españoles, salir a comer es una actividad muy importante del tiempo libre.', TF, 'verdadero',
    '"Pero para muchos españoles hay otra muy importante: salir a comer."'),
  masQueComer(2, '¿Por qué son muy largas las comidas en España?',
    ['Porque hay tiempo para charlar y estar con otras personas.', 'Porque los platos son muy grandes.', 'Porque los restaurantes abren muy tarde.'],
    'Porque hay tiempo para charlar y estar con otras personas.',
    '"No se trata solo de la comida, sino también del aspecto social. Por eso las comidas son muy largas, con tiempo para charlar…"'),
  masQueComer(3, 'Wat is "la sobremesa"?',
    ['het napraten aan tafel na de maaltijd', 'het dessert', 'het tafellaken'], 'het napraten aan tafel na de maaltijd',
    '"Y, después de la comida, en la sobremesa, también se habla del trabajo, los estudios, la familia…"'),
  masQueComer(4, 'Durante las comidas los españoles nunca hablan de comida.', TF, 'falso',
    '"Y hablar de comida." De tekst geeft zelfs voorbeelden, zoals "La mejor paella es la que hace mi madre".'),
  masQueComer(5, 'Para los españoles, salir al restaurante es sobre todo…',
    ['disfrutar de la comida y de la compañía', 'comer para alimentarse', 'hablar del trabajo'],
    'disfrutar de la comida y de la compañía',
    '"…salir al restaurante no es comer para alimentarse, es disfrutar de la comida y de la compañía. Es vivir."'),

  // En Chile con Matilde
  chile(1, '¿Qué hay en el norte de Chile?',
    ['el desierto de Atacama', 'la Patagonia', 'glaciares y fiordos'], 'el desierto de Atacama',
    '"En el norte, por ejemplo, tenemos el desierto de Atacama, el más seco del mundo." Patagonië ligt aan het andere uiteinde.'),
  chile(2, 'En la Patagonia chilena hay pingüinos todo el año.', TF, 'verdadero',
    '"Allí se pueden encontrar colonias de pingüinos todo el año."'),
  chile(3, '¿Dónde está la Fundación Pablo Neruda?',
    ['en el barrio Bellavista', 'en la Plaza de Armas', 'en Valparaíso'], 'en el barrio Bellavista',
    '"Les recomiendo el barrio Bellavista, donde se encuentra la Fundación Pablo Neruda en la antigua casa del poeta."'),
  chile(4, '¿Qué es "El Mercurio de Valparaíso"?',
    ['el periódico más antiguo en español', 'el puerto de Valparaíso', 'un vino chileno famoso'],
    'el periódico más antiguo en español',
    '"¿Sabe que el periódico más antiguo en español es El Mercurio de Valparaíso?"'),
  chile(5, 'Wat betekent "largo y delgado" in "mi largo y delgado país"?',
    ['lang en smal', 'groot en breed', 'ver en koud'], 'lang en smal',
    'Chili is 4200 km lang en heel smal; delgado = dun, smal.'),
  chile(6, 'La capital de Chile es Valparaíso.', TF, 'falso',
    '"En la capital, Santiago, …". Valparaíso is volgens velen de culturele hoofdstad.'),

  // Mi casa es tu casa
  miCasa(1, 'Según el texto, ¿cómo se puede ahorrar mucho dinero en las vacaciones?',
    ['ofreciendo tu casa y pasando las vacaciones en una casa privada', 'alojándose en un hotel barato', 'quedándose en casa'],
    'ofreciendo tu casa y pasando las vacaciones en una casa privada',
    '"¿Qué tal ofrecer tu casa y pasar las vacaciones en una casa privada y así ahorrar mucho dinero?"'),
  miCasa(2, 'Mucha gente ha tenido malas experiencias con el intercambio de casas.', TF, 'falso',
    '"Casi nadie ha tenido malas experiencias."'),
  miCasa(3, 'Wat betekent "ahorrar" in "ahorrar mucho dinero"?',
    ['besparen', 'uitgeven', 'verdienen'], 'besparen',
    'Wie van huis ruilt, betaalt geen hotel en spaart dus geld: "no solo ahorran dinero…".'),
  miCasa(4, '¿Cuándo se dice "Mi casa es tu casa" como fórmula de cortesía?',
    ['cuando nos despedimos de una visita', 'cuando compramos una casa', 'cuando llegamos a un hotel'],
    'cuando nos despedimos de una visita',
    '"Mi casa es tu casa se dice en español como fórmula de cortesía cuando nos despedimos de una visita."'),
  miCasa(5, 'Según el texto, ¿cuál es la base del intercambio de casas?',
    ['la confianza', 'el dinero', 'la página web'], 'la confianza',
    '"La base del intercambio es la confianza." Confianza = vertrouwen.'),

  // Guillermo Xiu (boek: de levensfasen ordenen)
  xiu(1, '¿Qué estudió Guillermo Xiu en México?',
    ['Antropología', 'Historia del arte', 'Cocina'], 'Antropología',
    '"…nació en México. Allí estudió Antropología…"'),
  xiu(2, 'En México se empezó a consumir cacao alrededor de 1500 a. C.', TF, 'verdadero',
    '"…en México se empezó a consumir cacao alrededor de 1500 a. C."'),
  xiu(3, '¿Dónde trabajó Guillermo Xiu en España?',
    ['en un museo de chocolate', 'en una universidad', 'en una fábrica de chocolate'], 'en un museo de chocolate',
    '"…se fue a España, donde trabajó varios años en un museo de chocolate."'),
  xiu(4, '¿Qué hizo Guillermo Xiu primero?',
    ['estudiar Antropología', 'ir a España', 'trabajar en un museo'], 'estudiar Antropología',
    'Eerst studeerde hij in Mexico; "años más tarde" ging hij naar Spanje en werkte hij in een museum.'),
  xiu(5, 'Wat betekent "actualmente" in deze tekst?',
    ['tegenwoordig', 'eigenlijk', 'toevallig'], 'tegenwoordig',
    'Valse vriend: actualmente = nu, tegenwoordig. "Actualmente participa en encuentros interculturales."'),

  // Una historia con gusto (boek: 12b, de gegevens verbinden)
  chocolate(1, '¿Para qué usaron el cacao las culturas prehispánicas?',
    ['como alimento, como moneda y en rituales religiosos', 'solo como medicina', 'solo como bebida dulce'],
    'como alimento, como moneda y en rituales religiosos',
    '"…utilizaron el cacao como alimento, pero también como moneda y en rituales religiosos."'),
  chocolate(2, '¿Por qué al principio el cacao no les gustó a los españoles?',
    ['Porque lo encontraron muy amargo.', 'Porque era muy caro.', 'Porque era demasiado dulce.'],
    'Porque lo encontraron muy amargo.',
    '"…al principio el cacao no les gustó a los españoles porque lo encontraron muy amargo."'),
  chocolate(3, '¿Dónde se fundó la primera fábrica de chocolate?',
    ['en Suiza', 'en Italia', 'en Alemania', 'en España'], 'en Suiza',
    '"En 1819 se fundó en Suiza la primera fábrica de chocolate…"'),
  chocolate(4, 'En Alemania, al principio, tomaron el chocolate como bebida.', TF, 'falso',
    '"En Alemania al principio lo tomaron como medicina, no como bebida."'),
  chocolate(5, 'Mezclar chocolate con chile es una tendencia muy nueva.', TF, 'falso',
    '"Es una tendencia muy antigua, ya conocida por los mayas."'),
  chocolate(6, 'Wat betekent "amargo"?',
    ['bitter', 'zoet', 'zout'], 'bitter',
    'Omdat cacao amargo (bitter) was, mengden de Spanjaarden het met suiker, vanille en kaneel.'),

  // En Argentina con Hortensia
  argentina(1, '¿Cómo se llaman los habitantes de Buenos Aires?',
    ['porteños', 'gauchos', 'gaditanos'], 'porteños',
    '"…soy porteña (así se llaman los habitantes de Buenos Aires, por el puerto)."'),
  argentina(2, '¿Qué es un "colectivo" en Argentina?',
    ['un autobús', 'un grupo de amigos', 'un tipo de tango'], 'un autobús',
    '"…tomar el colectivo (así se llaman los autobuses en Argentina)."'),
  argentina(3, 'La farmacia más antigua de Buenos Aires es ahora del hermano de Hortensia.', TF, 'verdadero',
    '"…la farmacia más antigua de la ciudad, que fue de mi padre y ahora es de mi hermano."'),
  argentina(4, '¿En qué otro país hay muchos aficionados del tango?',
    ['en Finlandia', 'en Bélgica', 'en Noruega'], 'en Finlandia',
    '"¿Sabe en qué otro país hay muchos aficionados del tango? ¡En Finlandia!"'),
  argentina(5, 'Hoe drinkt men mate volgens Hortensia?',
    ['Iedereen drinkt uit hetzelfde "glas", dat van hand tot hand gaat.', 'Iedereen krijgt een eigen kopje.', 'Alleen de gast drinkt ervan.'],
    'Iedereen drinkt uit hetzelfde "glas", dat van hand tot hand gaat.',
    '"…todos beben del mismo vaso y lo pasan de mano en mano."'),
  argentina(6, 'Hortensia vive en Buenos Aires.', TF, 'falso',
    '"…soy argentina, pero vivo en Lovaina": ze woont in Leuven.'),

  // ¿Seguimos estudiando? (boek: wie komt er niet terug?)
  seguimos(1, '¿Quién no vuelve al próximo curso?',
    ['Peter', 'Marta', 'David'], 'Peter',
    'Peter: "dejo de participar en el curso". Marta schrijft zich opnieuw in, David blijft de les volgen.'),
  seguimos(2, '¿Por qué deja Peter el curso?',
    ['Tiene un nuevo puesto de trabajo en Viena.', 'Se queda dos meses más en Perú.', 'Está renovando su casa.'],
    'Tiene un nuevo puesto de trabajo en Viena.',
    '"…es que tengo un nuevo puesto en Viena y empiezo a trabajar el próximo mes."'),
  seguimos(3, 'Wat betekent "Acabo de comprar una casa"?',
    ['Ik heb net een huis gekocht.', 'Ik ga een huis kopen.', 'Ik stop met een huis te zoeken.'],
    'Ik heb net een huis gekocht.',
    'Acabar de + infinitief = net iets gedaan hebben.'),
  seguimos(4, 'Marta se queda dos meses más en Perú, pero vuelve al curso después.', TF, 'verdadero',
    '"Estoy en Perú y me quedo dos meses más. Pero vuelvo a inscribirme en el próximo curso."'),

  // José Mujika (boek: 10b, de juiste zinnen aanduiden)
  mujika(1, '¿A qué edad aprendió José a nadar?',
    ['a los 30 años', 'en la infancia', 'a los 18 años'], 'a los 30 años',
    '"La mayoría de la gente lo aprende en la infancia, pero yo lo hice a los 30 años…"'),
  mujika(2, 'Al principio, José tuvo que superar el miedo al agua.', TF, 'verdadero',
    '"Fue un poco difícil: tuve que superar el miedo al agua y, claro, la vergüenza."'),
  mujika(3, 'Los mundiales de Liverpool fueron su tercer campeonato.', TF, 'verdadero',
    'Het eerste was in 2006 in Australië, het tweede in 2007 in Canada, Liverpool (2008) was het derde.'),
  mujika(4, 'José dejó de trabajar en los bomberos para participar en campeonatos.', TF, 'falso',
    '"José Mujika Eizagirre es bombero en San Sebastián": hij is nog altijd brandweerman.'),
  mujika(5, 'Waarom schreven ze bij een van zijn medailles "Afghanistan" als nationaliteit?',
    ['Omdat zijn achternaam wat vreemd klinkt.', 'Omdat hij in Afghanistan geboren is.', 'Omdat hij daar zijn eerste kampioenschap won.'],
    'Omdat zijn achternaam wat vreemd klinkt.',
    '"Como mi apellido suena un poco extraño, … escribieron como nacionalidad Afganistán."'),
  mujika(6, 'Wat betekent "la vergüenza" in "superar el miedo al agua y la vergüenza"?',
    ['de schaamte', 'de angst', 'de trots'], 'de schaamte',
    'Angst is miedo en trots is orgulloso; vergüenza is schaamte (een volwassene die niet kan zwemmen).'),

  // La Navidad y los Reyes Magos
  navidad(1, '¿Cuándo se celebran las posadas en México?',
    ['entre el 16 y el 24 de diciembre', 'el 6 de enero', 'el 5 de enero'], 'entre el 16 y el 24 de diciembre',
    '"Las posadas se celebran entre el 16 y el 24 de diciembre."'),
  navidad(2, '¿Qué simbolizan las posadas?',
    ['la peregrinación de San José y la Virgen María a Belén', 'la llegada de los Reyes Magos', 'el final del invierno'],
    'la peregrinación de San José y la Virgen María a Belén',
    '"Esta tradición simboliza la peregrinación de San José y la Virgen María a Belén."'),
  navidad(3, 'Wat is "la cabalgata"?',
    ['de optocht van de Drie Koningen door de stad', 'het cadeau van de Drie Koningen', 'het kerstdiner met de familie'],
    'de optocht van de Drie Koningen door de stad',
    '"…la cabalgata, que es el desfile de los Reyes por la ciudad."'),
  navidad(4, 'Los niños dejan sus zapatos en la puerta antes de acostarse.', TF, 'verdadero',
    '"Antes dejan sus zapatos en la puerta y también comida para los Reyes y agua para los camellos."'),
  navidad(5, 'Muchos niños consiguen ver a los Reyes cuando entran en la casa.', TF, 'falso',
    '"Todos intentan no dormir para poder verlos… Pero nunca lo consiguen."'),
  navidad(6, '¿Qué dejan los niños para los camellos?',
    ['agua', 'caramelos', 'cartas'], 'agua',
    '"…comida para los Reyes y agua para los camellos." Snoep (caramelos) krijgen de kinderen van de Koningen.'),

  // El Rastro
  rastro(1, '¿Qué día de la semana se recomienda ir al Rastro?',
    ['el domingo', 'el sábado', 'el lunes'], 'el domingo',
    '"¿Está usted en Madrid un domingo y no sabe qué hacer? … ir al Rastro."'),
  rastro(2, '¿Qué significa "regatear" según el texto?',
    ['negociar el precio con los vendedores', 'comprar ropa de segunda mano', 'ir a tomar tapas'],
    'negociar el precio con los vendedores',
    '"…se puede regatear mejor, es decir, negociar el precio con los vendedores."'),
  rastro(3, 'Algunos van al Rastro antes de las 11 porque es más tranquilo.', TF, 'verdadero',
    '"…algunos van antes porque es más tranquilo y se puede regatear mejor."'),
  rastro(4, 'Wat betekent "Nadie se va con las manos vacías"?',
    ['Iedereen gaat met iets naar huis.', 'Niemand mag de spullen aanraken.', 'Niemand komt er zonder geld.'],
    'Iedereen gaat met iets naar huis.',
    'Letterlijk: niemand vertrekt met lege handen. Er is voor iedereen wel iets te vinden.'),
  rastro(5, '¿Dónde está el Rastro?',
    ['en Embajadores, un barrio del centro', 'en las afueras de Madrid', 'en la Plaza de Cascorro'],
    'en Embajadores, un barrio del centro',
    '"El Rastro está en Embajadores, un barrio del centro con mucha tradición." Op de Plaza de Cascorro ga je daarna tapas eten.'),

  // El carnaval de Oruro
  oruro(1, '¿Cuántas personas hay en Oruro durante el carnaval?',
    ['casi un millón', 'unas 340 000', 'unas 400'], 'casi un millón',
    '"…tiene unos 340 000 habitantes, pero en las fiestas del carnaval pueden ser casi un millón."'),
  oruro(2, 'Los participantes empiezan a preparar los disfraces siete meses antes.', TF, 'verdadero',
    '"Siete meses antes los participantes empiezan a preparar los disfraces y las coreografías."'),
  oruro(3, '¿Qué representa "la Diablada"?',
    ['la lucha del bien y del mal', 'la llegada de la primavera', 'la historia de la ciudad de La Paz'],
    'la lucha del bien y del mal',
    '"Mi baile favorito es la Diablada, que representa la lucha del bien y del mal."'),
  oruro(4, 'Wat betekent "máscaras"?',
    ['maskers', 'kostuums', 'dansen'], 'maskers',
    '"Con sus bailes y sus máscaras…": kostuums zijn disfraces, dansen zijn bailes.'),
  oruro(5, 'Pilar es de Oruro.', TF, 'falso',
    '"…soy boliviana, de La Paz, pero hoy les voy a hablar de Oruro, la ciudad de mi padre".'),

  // El carnaval de Cádiz
  cadiz(1, '¿Dónde está Cádiz?',
    ['en Andalucía', 'en Galicia', 'en Cataluña'], 'en Andalucía',
    '"En Andalucía, en la puntita de la península."'),
  cadiz(2, '¿Qué cantan las chirigotas?',
    ['canciones críticas y satíricas', 'canciones serias', 'canciones de amor'], 'canciones críticas y satíricas',
    '"los coros, que cantan canciones serias, y las chirigotas, que cantan canciones críticas y satíricas".'),
  cadiz(3, 'En Cádiz la gente pasa medio año preparando la próxima fiesta.', TF, 'verdadero',
    '"Aquí vivimos medio año preparando la próxima fiesta y medio año recordando la fiesta anterior."'),
  cadiz(4, 'Wat betekent "nos disfrazamos"?',
    ['we verkleden ons', 'we vervelen ons', 'we haasten ons'], 'we verkleden ons',
    '"En carnaval todos nos disfrazamos y salimos a la calle." Een disfraz is een verkleedkostuum.'),
  cadiz(5, '¿Cómo se llama la gente de Cádiz?',
    ['gaditanos', 'porteños', 'valencianos'], 'gaditanos',
    '"Los gaditanos, así se llama la gente de Cádiz…"'),

  // El diario de Prudencio (boek: de symptomen aanduiden)
  prudencio(1, '¿Qué le pasa a Prudencio el lunes?',
    ['Tiene fiebre y le duele la cabeza.', 'Le duele la espalda.', 'Le duelen los pies.'],
    'Tiene fiebre y le duele la cabeza.',
    'Lunes: "tengo fiebre y me duele la cabeza".'),
  prudencio(2, 'Según el médico, ¿por qué le duele el estómago el martes?',
    ['Porque toma demasiadas aspirinas.', 'Porque come demasiado.', 'Porque trabaja todo el día.'],
    'Porque toma demasiadas aspirinas.',
    '"El médico dice que es porque tomo demasiadas aspirinas."'),
  prudencio(3, 'El jueves le duele todo el cuerpo porque ha hecho demasiado deporte.', TF, 'verdadero',
    '"Me duele todo el cuerpo… El médico dice que he hecho demasiado deporte."'),
  prudencio(4, '¿Por qué está preocupado Prudencio el viernes?',
    ['Porque no le duele nada.', 'Porque tiene tos.', 'Porque tiene mucho estrés.'],
    'Porque no le duele nada.',
    '"Hoy no me duele nada. Eso me preocupa."'),
  prudencio(5, 'Wat is een "hipocondríaco"?',
    ['iemand die altijd denkt dat hij ernstig ziek is', 'iemand die nooit naar de dokter gaat', 'een dokter met veel stress'],
    'iemand die altijd denkt dat hij ernstig ziek is',
    'Een hypochonder: de dokter zegt "es solo un resfriado", maar Prudencio denkt "es algo grave".'),
  prudencio(6, 'El médico se ha ido de vacaciones a la playa.', TF, 'falso',
    '"…se ha ido a un balneario para descansar porque tiene mucho estrés con algunos pacientes."'),

  // Volver a la "Spanish siesta"
  siesta(1, '¿Qué es la siesta, según el texto?',
    ['la costumbre de dormir después de comer', 'la costumbre de comer muy tarde', 'una pausa para tomar café'],
    'la costumbre de dormir después de comer',
    '"…la siesta, es decir, la costumbre española de dormir después de comer…"'),
  siesta(2, 'Según Harvard, ¿cuánto mejoran 40 minutos de siesta la productividad?',
    ['un 34 %', 'un 40 %', 'un 50 %'], 'un 34 %',
    '"…40 minutos de siesta mejoran la productividad de una persona en el trabajo en un 34 %."'),
  siesta(3, 'Para dormir la siesta es necesario tener una cama cómoda.', TF, 'falso',
    '"…no es necesario tener una cama cómoda para la siesta: dormir en un sillón basta…"'),
  siesta(4, 'Wat bedoelt de schrijver met de laatste zin over Harvard en Pepe Martínez?',
    ['Mensen geloven iets sneller als een beroemde universiteit het zegt.', 'Pepe Martínez is een onderzoeker van Harvard.', 'Harvard is tegen de siesta.'],
    'Mensen geloven iets sneller als een beroemde universiteit het zegt.',
    '"Si lo dice Harvard, parece verdad y si lo dice Pepe Martínez, no": Pepe Martínez is een doodgewone Spanjaard.'),
  siesta(5, 'Wat betekent "tuvo muy mala fama"?',
    ['had een heel slechte naam', 'was heel onbekend', 'was heel slecht voor de gezondheid'], 'had een heel slechte naam',
    'Fama = reputatie. Men vond de siesta tijdverlies: "Es perder el tiempo", "No es productiva".'),

  // El balneario de Mondariz (boek: 7b, wie is er nu in Mondariz?)
  mondariz(1, '¿Dónde se encuentra el balneario de Mondariz?',
    ['en la provincia de Pontevedra', 'en la costa mediterránea', 'cerca de Madrid'], 'en la provincia de Pontevedra',
    '"El balneario de Mondariz se encuentra en la provincia de Pontevedra, en un paisaje de bosques y montañas."'),
  mondariz(2, '¿Cuál es la gran riqueza de esta zona?',
    ['el agua, muy rica en minerales', 'el vino', 'la madera de sus bosques'], 'el agua, muy rica en minerales',
    '"El agua, muy rica en minerales, es la gran riqueza de esta zona y la razón de su fama."'),
  mondariz(3, 'En el siglo XIX, los clientes del balneario eran personas ricas.', TF, 'verdadero',
    'Het kuuroord bestaat sinds 1874: "En esa época… los clientes eran personas ricas que podían pagar esos lujos."'),
  mondariz(4, '¿Qué persona está ahora en el balneario de Mondariz?',
    ['"Nos bañamos en aguas termales y bebemos mucho."', '"Esto es un paraíso: playa, sol y sangría todo el día."', '"Nos bañamos todos los días en el mar."'],
    '"Nos bañamos en aguas termales y bebemos mucho."',
    'In Mondariz baadt men in thermaal water en drinkt men het geneeskrachtige water; er is geen zee of strand.'),
  mondariz(5, 'Hoy Mondariz solo ofrece las curas tradicionales de antes.', TF, 'falso',
    '"En la actualidad, Mondariz combina su larga tradición de balneario con terapias actuales y las ofertas de tiempo libre…"'),
  mondariz(6, 'Wat betekent "se alojaban" in "Muchos visitantes se alojaban en el Gran Hotel"?',
    ['ze logeerden', 'ze baadden', 'ze wandelden'], 'ze logeerden',
    'Alojarse = logeren, verblijven (vgl. alojamiento = accommodatie). Baden is bañarse, wandelen is pasear.'),

  // El baño de temazcal (boek: wat is hetzelfde als in een sauna?)
  temazcal(1, '¿Qué era el baño de temazcal?',
    ['un baño de vapor aromatizado con hierbas', 'un baño de agua fría en un río', 'un masaje con piedras calientes'],
    'un baño de vapor aromatizado con hierbas',
    '"Era un baño de vapor aromatizado con hierbas frescas."'),
  temazcal(2, 'En el temazcal, los hombres y las mujeres estaban separados.', TF, 'falso',
    '"…no había separación de hombres y mujeres, todos lo usaban juntos."'),
  temazcal(3, '¿Para qué lo usaban las mujeres que esperaban un bebé?',
    ['para relajarse antes del nacimiento', 'para cuidar la piel de la cara', 'para tratar dolores de cabeza'],
    'para relajarse antes del nacimiento',
    '"Las mujeres que esperaban un bebé lo usaban para relajarse antes de su nacimiento."'),
  temazcal(4, 'Hoy todavía se usa el temazcal como tratamiento medicinal.', TF, 'verdadero',
    '"Hoy todavía se usa como tratamiento medicinal, pero mucha gente también va solo para relajarse."'),
  temazcal(5, 'Wat betekent "dolores musculares"?',
    ['spierpijn', 'hoofdpijn', 'buikpijn'], 'spierpijn',
    'Músculo = spier; de tekst noemt "dolores de espalda y dolores musculares".'),

  // Las Fallas de Valencia
  fallas(1, '¿Cuándo son las Fallas?',
    ['del 15 al 19 de marzo', 'del 16 al 24 de diciembre', 'en febrero, en carnaval'], 'del 15 al 19 de marzo',
    '"Del 15 al 19 de marzo Valencia vive una fiesta llena de color, fuego y ruido para celebrar la primavera."'),
  fallas(2, '¿Qué son las "fallas"?',
    ['esculturas enormes de cartón', 'fuegos artificiales', 'canciones satíricas'], 'esculturas enormes de cartón',
    '"El nombre viene de unas esculturas enormes de cartón que se llaman fallas."'),
  fallas(3, 'Al final de la fiesta se queman todas las figuras.', TF, 'falso',
    '"Pero no se quema todo: una figura se guarda." De winnende figuur gaat naar het Museo de las Fallas.'),
  fallas(4, '¿Qué es "la mascletà"?',
    ['un juego de petardos a las dos de la tarde', 'un concierto gratis por la noche', 'el concurso de la mejor figura'],
    'un juego de petardos a las dos de la tarde',
    '"Cada día, a las dos de la tarde, tiene lugar la mascletà, un juego de petardos que tiene una melodía."'),
  fallas(5, 'Wat betekent "ruidosa" in "la fiesta es muy, muy ruidosa"?',
    ['lawaaierig', 'kleurrijk', 'gevaarlijk'], 'lawaaierig',
    'Ruido = lawaai: "No solo porque hay música, sino por el ruido de las explosiones de los petardos."'),
  fallas(6, '¿Quién prepara la falla de cada barrio?',
    ['los vecinos, en asociaciones', 'el Ayuntamiento de Valencia', 'artistas extranjeros'], 'los vecinos, en asociaciones',
    '"Los vecinos se reúnen en asociaciones durante todo el año para prepararla."'),
];

export default { atoms, texts };
