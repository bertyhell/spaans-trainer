/* Examenreeksen: de woordenlijst die je voor een examen moet kennen, als
 * één thema om te oefenen.
 *
 * Een examenthema bevat geen eigen woorden. Het verwijst naar bestaande
 * woordenschat-atomen, die in hun eigen thema blijven staan (regroup.mjs
 * zet het examenthema in hun `also`). De voortgang is dus gedeeld: wat je
 * voor het examen oefent, telt ook bij "Kleding" of "Het weer", en omgekeerd.
 *
 * Unidad 1: de woordenlijst achteraan het boek, p. 205–209. Zinsflarden die
 * regroup.mjs schrapt (lo más importante, quería contar, ...) en de
 * ustedes-imperatieven (mencionen, piensen) staan er bewust niet in. */

export default {
  exams: {
    'examen-u1': [
      // p. 205
      'v.caminando', 'v.la-camisa', 'v.la-camiseta', 'v.el-algodon', 'v.el-sombrero', 'v.el-jersey',
      'v.la-lana', 'v.los-calcetines', 'v.la-chaqueta', 'v.la-mochila', 'v.los-vaqueros', 'v.la-bota',
      'v.el-cuero', 'v.la-falda', 'v.las-gafas-de-sol', 'v.amarillo-a', 'v.gris', 'v.marron',
      'v.naranja', 'v.rosa', 'v.la-ropa', 'v.el-tiempo', 'v.la-rutina-diaria', 'v.la-comparacion',
      'v.lo-que-esta-sucediendo', 'v.suceder', 'v.el-anorak', 'v.llevar-gafas', 'v.las-gafas',
      'v.los-pantalones', 'v.el-abrigo', 'v.la-marca', 'v.los-zapatos', 'v.la-ropa-deportiva',
      'v.la-blusa', 'v.el-bikini', 'v.el-vestido', 'v.las-sandalias', 'v.elija', 'v.el-catalogo',
      'v.el-camino-de-santiago', 'v.el-la-experto-a',
      // p. 206
      'v.la-epoca', 'v.el-albergue', 'v.el-la-peregrino-a', 'v.la-primavera', 'v.la-peregrinacion',
      'v.sencillo-a', 'v.el-camino-frances', 'v.frances-esa', 'v.la-estacion-del-ano', 'v.el-verano',
      'v.el-otono', 'v.el-invierno', 'v.el-destino', 'v.el-apostol-santiago', 'v.llover',
      'v.el-camino-del-norte', 'v.mas-largo-a-que', 'v.tan-importante-como', 'v.menos',
      'v.las-comodidades', 'v.el-mes-menos-atractivo', 'v.el-comparativo', 'v.mayor', 'v.malo-a',
      'v.peor', 'v.la-desigualdad', 'v.la-igualdad', 'v.el-superlativo', 'v.comodo-a', 'v.practico-a',
      'v.llevar-zapatos', 'v.la-vida-cotidiana', 'v.cotidiano-a', 'v.el-parrafo',
      'v.entre-los-siguientes', 'v.la-paz', 'v.a-caminar', 'v.comenzar', 'v.en-camino',
      'v.sale-el-sol', 'v.levantarse', 'v.lavar-se', 'v.ponerse-ropa', 'v.la-energia',
      'v.despues-de-desayunar', 'v.en-silencio', 'v.el-silencio', 'v.aburrir-se', 'v.tener-prisa',
      'v.cansarse', 'v.relajarse', 'v.pobre', 'v.separar-se',
      // p. 207
      'v.solo-a', 'v.tomar-fotos', 'v.el-diario-del-viaje', 'v.ducharse', 'v.acostarse',
      'v.disfrutar-de', 'v.mirar', 'v.el-verbo-reflexivo', 'v.el-pronombre-reflexivo',
      'v.el-verbo-conjugado', 'v.viceversa', 'v.antes-de-caminar', 'v.durante-el-camino',
      'v.la-gente-del-lugar', 'v.la-tranquilidad', 'v.positivo-a', 'v.olvidar-se', 'v.frecuentemente',
      'v.la-fila', 'v.la-tele', 'v.antes-de-las-siete', 'v.este-a', 'v.ese-a', 'v.esto', 'v.eso',
      'v.hacer-referencia-a', 'v.la-referencia', 'v.estar-al-alcance-de', 'v.el-alcance',
      'v.alejado-a', 'v.senalar', 'v.hasta-encontrarlo', 'v.el-camino-inca', 'v.cuanto-tiempo',
      'v.el-mal-de-las-alturas', 'v.el-imperio-inca', 'v.perdido-a', 'v.el-inca', 'v.solamente',
      'v.autorizado-a', 'v.el-tour', 'v.durar', 'v.recorrer', 'v.convenir', 'v.hacer-la-reserva',
      'v.se-recomienda', 'v.acostumbrarse-a', 'v.el-soroche', 'v.recomendado-a', 'v.hace-sol',
      'v.esta-nublado', 'v.hace-buen-tiempo', 'v.la-temperatura', 'v.contra',
      // p. 208
      'v.el-viento', 'v.el-frio', 'v.es-necesario', 'v.la-recomendacion', 'v.el-safari',
      'v.el-crucero', 'v.despacio', 'v.ponerse-crema', 'v.la-crema', 'v.el-mosquito', 'v.llevar',
      'v.el-papel-higienico', 'v.la-revista', 'v.estamos-esperando', 'v.estoy-haciendo-una-pausa',
      'v.esta-tomando-fotos', 'v.el-gerundio', 'v.regular', 'v.la-pantomima', 'v.represente',
      'v.la-mimica', 'v.el-plato', 'v.el-televisor', 'v.el-ordenador', 'v.el-hombre-del-jersey',
      'v.que-tiempo-hace', 'v.hace-calor', 'v.el-calor', 'v.hace-frio', 'v.hace-5-grados',
      'v.el-grado', 'v.bajo-cero', 'v.hace-viento', 'v.hace-mal-tiempo', 'v.hay-niebla', 'v.la-niebla',
      'v.nieva', 'v.nevar', 'v.el-programa', 'v.las-islas-canarias', 'v.los-pirineos', 'v.galicia',
      'v.la-costa-mediterranea', 'v.que-nublado-esta', 'v.que-frio-hace', 'v.como-llueve',
      'v.llevarse', 'v.la-prenda-de-vestir', 'v.a-jugar', 'v.jugar', 'v.la-ficha', 'v.avanzar',
      // p. 209
      'v.ir-de-camping', 'v.a-su-derecha', 'v.atras', 'v.el-pueblo', 'v.la-cabeza',
      'v.el-maximo-de-adjetivos', 'v.la-crema-solar', 'v.por-lo-menos', 'v.el-equipaje',
      'v.la-duracion', 'v.entre-todos', 'v.el-la-coordinador-a', 'v.politico-a', 'v.economico-a',
      'v.financiero-a', 'v.declarar', 'v.restaurar', 'v.llamado-a', 'v.eterno-a', 'v.el-clima',
      'v.el-lago-titicaca', 'v.el-la-escritor-a', 'v.el-amazonas', 'v.el-caiman', 'v.el-mono',
      'v.el-delfin', 'v.el-muro', 'v.el-templo', 'v.riquisimo-a', 'v.el-preparativo', 'v.la-violeta',
      'v.el-demostrativo', 'v.el-la-hablante', 'v.proceder-de',
    ],
  },
};
