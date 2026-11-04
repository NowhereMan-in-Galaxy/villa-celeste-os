import { Verb } from './conj';

const W = (s: string) => s.split(' ');
const v = (inf: string, en: string, x: Partial<Verb> = {}): Verb => ({ inf, en, ...x });

export const IRREGULAR: Verb[] = [
  v('ser', 'to be', { pres: W('soy eres es somos son'), pret: W('fui fuiste fue fuimos fueron'), impf: W('era eras era éramos eran'), part: 'sido', subj: W('sea seas sea seamos sean'), tu: 'sé' }),
  v('estar', 'to be (location/state)', { pres: W('estoy estás está estamos están'), ps: 'estuv', subj: W('esté estés esté estemos estén') }),
  v('ir', 'to go', { pres: W('voy vas va vamos van'), pret: W('fui fuiste fue fuimos fueron'), impf: W('iba ibas iba íbamos iban'), part: 'ido', subj: W('vaya vayas vaya vayamos vayan'), tu: 've' }),
  v('tener', 'to have', { pres: W('tengo tienes tiene tenemos tienen'), ps: 'tuv', fs: 'tendr', tu: 'ten' }),
  v('hacer', 'to do / make', { yo: 'hago', pret: W('hice hiciste hizo hicimos hicieron'), fs: 'har', part: 'hecho', tu: 'haz' }),
  v('decir', 'to say / tell', { pres: W('digo dices dice decimos dicen'), ps: 'dij', fs: 'dir', part: 'dicho', tu: 'di' }),
  v('poder', 'to be able to', { sc: 'ue', ps: 'pud', fs: 'podr' }),
  v('querer', 'to want', { sc: 'ie', ps: 'quis', fs: 'querr' }),
  v('saber', 'to know (a fact)', { pres: W('sé sabes sabe sabemos saben'), ps: 'sup', fs: 'sabr', subj: W('sepa sepas sepa sepamos sepan') }),
  v('poner', 'to put', { yo: 'pongo', ps: 'pus', fs: 'pondr', part: 'puesto', tu: 'pon' }),
  v('salir', 'to leave / go out', { yo: 'salgo', fs: 'saldr', tu: 'sal' }),
  v('venir', 'to come', { pres: W('vengo vienes viene venimos vienen'), ps: 'vin', fs: 'vendr', tu: 'ven' }),
  v('dar', 'to give', { pres: W('doy das da damos dan'), pret: W('di diste dio dimos dieron'), subj: W('dé des dé demos den') }),
  v('ver', 'to see', { yo: 'veo', pret: W('vi viste vio vimos vieron'), impf: W('veía veías veía veíamos veían'), part: 'visto', tu: 've' }),
];

export const EXTRA_IRR: Verb[] = [
  v('traer', 'to bring', { yo: 'traigo', ps: 'traj', y: true }),
  v('conocer', 'to know (a person)', { yo: 'conozco' }),
  v('oír', 'to hear', { pres: W('oigo oyes oye oímos oyen'), y: true }),
  v('traducir', 'to translate', { yo: 'traduzco', ps: 'traduj' }),
  v('escribir', 'to write', { part: 'escrito' }),
  v('abrir', 'to open', { part: 'abierto' }),
  v('volver', 'to return', { sc: 'ue', part: 'vuelto' }),
];

export const REGULAR: Verb[] = [
  ...'hablar:to speak|caminar:to walk|estudiar:to study|trabajar:to work|comprar:to buy|cocinar:to cook|bailar:to dance|cantar:to sing|viajar:to travel|necesitar:to need|escuchar:to listen|mirar:to look at|llamar:to call|practicar:to practice|buscar:to look for|llegar:to arrive|tocar:to touch / play|pagar:to pay|tomar:to take / drink|limpiar:to clean|ayudar:to help|esperar:to wait|comer:to eat|beber:to drink|aprender:to learn|vender:to sell|correr:to run|comprender:to understand|responder:to answer|deber:to owe / should|vivir:to live|recibir:to receive|decidir:to decide|subir:to go up|compartir:to share|asistir:to attend'.split('|').map((s) => { const [a, b] = s.split(':'); return v(a, b); }),
  v('leer', 'to read', { y: true }), v('creer', 'to believe', { y: true }),
];

export const STEM: Verb[] = [
  ...'empezar:ie:to begin|pensar:ie:to think|cerrar:ie:to close|despertar:ie:to wake (someone)|perder:ie:to lose|entender:ie:to understand|recordar:ue:to remember|encontrar:ue:to find|almorzar:ue:to have lunch|contar:ue:to count / tell|costar:ue:to cost|mostrar:ue:to show|jugar:ue:to play|dormir:ue:to sleep|morir:ue:to die|sentir:ie:to feel|preferir:ie:to prefer|divertir:ie:to amuse|pedir:i:to ask for|servir:i:to serve|repetir:i:to repeat|vestir:i:to dress'.split('|').map((s) => { const [a, sc, b] = s.split(':'); return v(a, b, { sc: sc as Verb['sc'] }); }),
  v('seguir', 'to follow / continue', { sc: 'i', pres: W('sigo sigues sigue seguimos siguen') }),
];

export const ALL_VERBS = [...IRREGULAR, ...EXTRA_IRR, ...REGULAR, ...STEM];

export interface TenseMode { id: string; label: string; tense: 'pres' | 'pret' | 'impf' | 'fut' | 'cond' | 'perf' | 'subj' | 'isubj' | 'cmd'; pool: Verb[]; lesson: string; hint: string; }
const all = ALL_VERBS;
export const MODES: TenseMode[] = [
  { id: 'pres-reg', label: 'Presente regular', tense: 'pres', pool: REGULAR, lesson: 'B1-L07', hint: 'hablo, comes, vive' },
  { id: 'pres-stem', label: 'Presente e→ie · o→ue · e→i', tense: 'pres', pool: STEM, lesson: 'B1-L13', hint: 'pienso, duermes, pide' },
  { id: 'pres-irr', label: 'Irregulares (ser, estar, ir...)', tense: 'pres', pool: IRREGULAR, lesson: 'B1-L14', hint: 'soy, tengo, hago, voy' },
  { id: 'pret', label: 'Pretérito', tense: 'pret', pool: all, lesson: 'B1-L29', hint: 'hablé, comió, estuvo, fueron' },
  { id: 'impf', label: 'Imperfecto', tense: 'impf', pool: all, lesson: 'B2-L06', hint: 'hablaba, comía, era, iba' },
  { id: 'cmd', label: 'Mandatos (usted / tú)', tense: 'cmd', pool: all, lesson: 'B1-L24', hint: 'hable, coma, no hables, haz' },
  { id: 'perf', label: 'Presente perfecto', tense: 'perf', pool: all, lesson: 'B2-L13', hint: 'he hablado, ha hecho' },
  { id: 'fut', label: 'Futuro', tense: 'fut', pool: all, lesson: 'B2-L15', hint: 'hablaré, tendrá, dirán' },
  { id: 'cond', label: 'Condicional', tense: 'cond', pool: all, lesson: 'B2-L17', hint: 'hablaría, podría, haría' },
  { id: 'subj', label: 'Presente de subjuntivo', tense: 'subj', pool: all, lesson: 'B2-L26', hint: 'hable, tenga, sea, vaya' },
  { id: 'isubj', label: 'Imperfecto de subjuntivo', tense: 'isubj', pool: all, lesson: 'B2-L29', hint: 'hablara, tuviera, fuera' },
];
export const TENSE_ES: Record<string, string> = { pres: 'presente', pret: 'pretérito', impf: 'imperfecto', fut: 'futuro', cond: 'condicional', perf: 'presente perfecto', subj: 'presente de subjuntivo', isubj: 'imperfecto de subjuntivo', cmd: 'mandato' };

/** [sentence with ____, option A, option B, answer index, rule explanation] */
export type DuelItem = [string, string, string, 0 | 1, string];

export const POR_PARA: DuelItem[] = [
  ['Cecilia trabaja ____ un banco importante.', 'por', 'para', 1, 'PARA = para quién trabajas (empleador). / Who you work for.'],
  ['Luis compró un pasaje ____ Juan Manuel Ríos.', 'por', 'para', 1, 'PARA = destinatario. / Recipient.'],
  ['Alberto camina ____ el parque todas las mañanas.', 'por', 'para', 0, 'POR = movimiento a través de un lugar. / Movement through a place.'],
  ['Diego estudia un MBA ____ ser gerente.', 'por', 'para', 1, 'PARA + infinitivo = propósito (in order to).'],
  ['Gracias ____ la ayuda, Alejandra.', 'por', 'para', 0, 'POR = gracias por (motivo). / Thanks for.'],
  ['Javier sale ____ Costa Rica mañana.', 'por', 'para', 1, 'PARA = destino. / Destination.'],
  ['Erica llamó a Javier ____ teléfono.', 'por', 'para', 0, 'POR = medio de comunicación o transporte. / Means.'],
  ['La tarea es ____ el lunes.', 'por', 'para', 1, 'PARA = fecha límite. / Deadline.'],
  ['Pablo pagó cien pesos ____ la camiseta.', 'por', 'para', 0, 'POR = intercambio (compra, pago). / Exchange.'],
  ['Felipe vivió en Quito ____ dos años.', 'por', 'para', 0, 'POR = duración de tiempo. / Duration.'],
  ['Esta carta es ____ Cecilia.', 'por', 'para', 1, 'PARA = destinatario. / Recipient.'],
  ['Marisol habla ____ Skype con Pilar.', 'por', 'para', 0, 'POR = medio (por Skype, por teléfono). / Means.'],
  ['____ ser tan joven, Elena es muy madura.', 'Por', 'Para', 1, 'PARA = comparación con lo esperado. / Compared with expectation.'],
  ['Carlos no ganó el set ____ el viento.', 'por', 'para', 0, 'POR = causa o razón. / Cause.'],
  ['El Dr. Quirós trabaja ____ la salud de la comunidad.', 'por', 'para', 0, 'POR = en beneficio de (for the sake of).'],
  ['Luisa compra aguacates ____ la ensalada.', 'por', 'para', 1, 'PARA = uso o propósito de un objeto. / Intended use.'],
  ['Votamos ____ el nuevo director del colegio.', 'por', 'para', 0, 'POR = a favor de. / In favor of.'],
  ['Mi hermano es muy alto ____ su edad.', 'por', 'para', 1, 'PARA = comparación (considering). / Comparison.'],
  ['Alejandra habló ____ Cecilia porque ella tenía gripe.', 'por', 'para', 0, 'POR = en lugar de / de parte de. / On behalf of.'],
  ['La clínica abre ____ la mañana y cierra a las tres.', 'por', 'para', 0, 'POR = parte del día (por la mañana). / Time of day.'],
  ['Álvaro vendió su carro ____ comprar una moto.', 'por', 'para', 1, 'PARA + infinitivo = propósito. / Purpose.'],
  ['El autobús sale ____ el centro a las ocho.', 'por', 'para', 1, 'PARA = destino. / Destination.'],
  ['Alberto busca una casa grande ____ toda su familia.', 'por', 'para', 1, 'PARA = beneficiario. / Beneficiary.'],
  ['Pietro mandó las invitaciones ____ error a otra Julia.', 'por', 'para', 0, 'POR error = expresión fija (by mistake).'],
  ['Estudiamos ____ el examen de mañana.', 'por', 'para', 1, 'PARA = meta o propósito. / Goal.'],
  ['Gustavo pasó ____ la farmacia a comprar vitaminas.', 'por', 'para', 0, 'POR = pasar por un lugar (stop by).'],
  ['Leonor nada ____ aliviar el dolor de espalda.', 'por', 'para', 1, 'PARA + infinitivo = propósito. / Purpose.'],
  ['Diana canta ____ su abuelo en la fiesta.', 'por', 'para', 1, 'PARA = destinatario. / Recipient.'],
  ['Mariana lloró ____ una hora entera.', 'por', 'para', 0, 'POR = duración. / Duration.'],
  ['¿____ qué llegaste tarde, Felipe?', 'Por', 'Para', 0, '¿Por qué? = ¿por qué razón? (why). Pero ¿para qué? = ¿con qué fin?'],
  ['Necesito el informe ____ las cinco de la tarde.', 'por', 'para', 1, 'PARA = fecha u hora límite. / Deadline.'],
  ['Luis viaja ____ avión a Madrid.', 'por', 'para', 0, 'POR = medio de transporte. / Means of transport.'],
  ['Diego le dio las gracias a Ema ____ explicarle la tarea.', 'por', 'para', 0, 'Gracias POR + infinitivo.'],
  ['Este regalo es ____ ti, mi amor, de parte de Luis.', 'por', 'para', 1, 'PARA = destinatario. / Recipient.'],
];

export const SER_ESTAR: DuelItem[] = [
  ['Felipe ____ muy cansado después de la fiesta.', 'es', 'está', 1, 'ESTAR = estado o condición temporal. / Temporary condition.'],
  ['Cecilia ____ secretaria ejecutiva de un banco.', 'es', 'está', 0, 'SER = profesión. / Occupation.'],
  ['La fiesta ____ en la casa de Felipe.', 'es', 'está', 0, 'SER = lugar de un evento. / Location of an event.'],
  ['La casa de los Quirós ____ muy desordenada hoy.', 'es', 'está', 1, 'ESTAR = condición actual (resultado de la fiesta).'],
  ['Alejandra ____ de Costa Rica.', 'es', 'está', 0, 'SER = origen. / Origin.'],
  ['Mi hermano ____ alto y delgado.', 'es', 'está', 0, 'SER = características físicas. / Physical traits.'],
  ['El doctor Quirós ____ en la clínica ahora.', 'es', 'está', 1, 'ESTAR = ubicación de personas y cosas. / Location.'],
  ['La clínica ____ cerca del parque.', 'es', 'está', 1, 'ESTAR = ubicación. / Location.'],
  ['Hoy ____ martes.', 'es', 'está', 0, 'SER = día, fecha y hora. / Day, date, time.'],
  ['Pablo ____ lesionado de la rodilla.', 'es', 'está', 1, 'ESTAR = condición física temporal. / Temporary condition.'],
  ['Javier y Erica ____ casados.', 'son', 'están', 1, 'ESTAR = estado civil (casado, soltero, divorciado).'],
  ['La sopa ____ fría.', 'es', 'está', 1, 'ESTAR = cómo está algo ahora. / Current state.'],
  ['Marisol ____ muy simpática.', 'es', 'está', 0, 'SER = personalidad. / Personality.'],
  ['Hoy Marisol ____ muy contenta.', 'es', 'está', 1, 'ESTAR = emoción del momento. / Emotion now.'],
  ['El anillo ____ de oro.', 'es', 'está', 0, 'SER = material. / Material.'],
  ['Este libro ____ de Diego.', 'es', 'está', 0, 'SER = posesión (de + dueño). / Possession.'],
  ['Andrés ____ desempleado desde hace ocho meses.', 'es', 'está', 1, 'ESTAR = situación temporal. / Temporary situation.'],
  ['Los aguacates todavía ____ verdes.', 'son', 'están', 1, 'ESTAR = estado actual (no maduros). / Current state.'],
  ['Los aguacates ____ muy buenos para la salud.', 'son', 'están', 0, 'SER = característica general. / General characteristic.'],
  ['Alberto ____ alérgico a las alfombras viejas.', 'es', 'está', 0, 'SER = característica permanente (alergia). / Characteristic.'],
  ['Ema ____ en la biblioteca con Diego.', 'es', 'está', 1, 'ESTAR = ubicación. / Location.'],
  ['La reunión ____ a las tres de la tarde.', 'es', 'está', 0, 'SER = hora de un evento. / Time of an event.'],
  ['Diana ____ una niña muy alegre.', 'es', 'está', 0, 'SER + sustantivo = identidad o descripción. / Identity.'],
  ['Mi esposa ____ enojada porque llegué tarde.', 'es', 'está', 1, 'ESTAR = emoción o estado de ánimo. / Mood.'],
  ['La agencia de viajes ____ abierta hasta las seis.', 'es', 'está', 1, 'ESTAR = estado resultante (abierta). / Resulting state.'],
  ['Julia ____ divorciada de Pietro.', 'es', 'está', 1, 'ESTAR = estado civil. / Marital status.'],
  ['Pietro ____ italiano.', 'es', 'está', 0, 'SER = nacionalidad. / Nationality.'],
  ['La telenovela ____ a las ocho de la noche.', 'es', 'está', 0, 'SER = hora de un evento. / Time of an event.'],
  ['Cecilia ____ viendo La oveja negra ahora mismo.', 'es', 'está', 1, 'ESTAR + gerundio = acción en progreso. / Progressive.'],
  ['Leonor ____ embarazada de ocho meses.', 'es', 'está', 1, 'ESTAR = condición temporal. / Temporary condition.'],
  ['Gustavo ____ un hombre muy inteligente.', 'es', 'está', 0, 'SER + sustantivo = identidad. / Identity.'],
  ['Álvaro ____ nervioso durante el examen.', 'es', 'está', 1, 'ESTAR = emoción en un momento dado. / Emotion at a moment.'],
  ['Mi casa ____ de dos pisos y tiene jardín.', 'es', 'está', 0, 'SER = descripción de características. / Description.'],
  ['Las ventanas ____ abiertas y la puerta también.', 'son', 'están', 1, 'ESTAR + participio = resultado. / Resulting state.'],
  ['¿De quién ____ esta chaqueta, Elena?', 'es', 'está', 0, 'SER = posesión. / Possession.'],
];
