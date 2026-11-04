export interface Q { q: string; opts: string[]; ok: number; why: string }
export interface Profile { id: string; for: 'andres' | 'julia'; name: string; age: number; emoji: string; bio: string; q: Q; verdict: string; good?: boolean }
export interface DateStep { npc: string; en: string; opts: { t: string; pts: 0 | 1 | 2; react: string }[] }
export interface DateScn { id: string; profile: string; title: string; steps: DateStep[]; endings: [string, string, string] }

export const CLIENTS = {
  andres: { name: 'Andrés Murillo', emoji: '🧪', ad: 'Busco una pareja que sepa cocinar, que no tenga gatos y que quiera viajar.', adEn: 'I am looking for a partner who knows how to cook, who has no cats, and who wants to travel.', lesson: 'B2-L26' },
  julia: { name: 'Julia Rivera', emoji: '💁‍♀️', ad: 'Busco un hombre que hable italiano, que sea puntual y que quiera adoptar un niño.', adEn: 'I am looking for a man who speaks Italian, who is punctual, and who wants to adopt a child.', lesson: 'B2-L27' },
} as const;

export const PROFILES: Profile[] = [
  { id: 'marta', for: 'andres', name: 'Marta', age: 34, emoji: '👩‍🍳',
    bio: 'Soy chef y me encanta cocinar. Ayer preparé paella para veinte personas. Tengo tres gatos: Pelusa, Bigotes y Napoleón. Me gustan mucho los animales y no me gusta viajar.',
    q: { q: '¿Qué dice Marta sobre los animales?', opts: ['Tiene tres gatos', 'No le gustan los animales', 'Tiene un perro'], ok: 0, why: 'Dice "tengo tres gatos".' },
    verdict: 'Marta cocina de maravilla, pero tiene tres gatos y no le gusta viajar. Andrés tiene alergia... y mala suerte.' },
  { id: 'valeria', for: 'andres', name: 'Valeria', age: 33, emoji: '👩‍🔬', good: true,
    bio: 'Soy bióloga y estoy libre este fin de semana. Cuando era niña, mi abuela me enseñó a cocinar, y todavía cocino todos los domingos. No tengo mascotas porque viajo mucho. Me gustan los museos y las montañas.',
    q: { q: '¿Por qué Valeria no tiene mascotas?', opts: ['Porque no le gustan', 'Porque viaja mucho', 'Porque cocina mucho'], ok: 1, why: 'Dice "no tengo mascotas porque viajo mucho".' },
    verdict: 'Valeria sabe cocinar, no tiene gatos y le encanta viajar. Es la pareja perfecta para Andrés.' },
  { id: 'lucia', for: 'andres', name: 'Lucía', age: 30, emoji: '🎧', 
    bio: 'Soy DJ y trabajo de noche. No sé cocinar nada: ayer quemé el agua. Pero no tengo gatos y me gusta viajar. Estoy cansada casi siempre, así que prefiero pedir comida.',
    q: { q: '¿Qué pasó ayer con Lucía?', opts: ['Cocinó una cena deliciosa', 'Quemó el agua', 'Viajó a Cancún'], ok: 1, why: 'Dice "ayer quemé el agua": pretérito de quemar.' },
    verdict: 'Lucía no sabe cocinar. Andrés necesita una pareja que sepa cocinar (subjuntivo: "que sepa").' },
  { id: 'fabrizio', for: 'julia', name: 'Fabrizio', age: 41, emoji: '🇮🇹',
    bio: 'Soy italiano y hablo cuatro idiomas. Soy muy romántico, pero siempre llego tarde: ayer llegué tres horas tarde a mi propia fiesta. Me encantan los niños.',
    q: { q: '¿Cómo es Fabrizio?', opts: ['Es puntual', 'Es impuntual', 'No habla italiano'], ok: 1, why: '"Siempre llego tarde" significa que no es puntual.' },
    verdict: 'Fabrizio habla italiano, claro, pero siempre llega tarde. Julia necesita a alguien puntual.' },
  { id: 'ricardo', for: 'julia', name: 'Ricardo', age: 38, emoji: '⏰',
    bio: 'Soy contador y soy muy puntual: nunca llego tarde. Me gustan los niños y quiero ser papá algún día. No hablo italiano, pero tomo clases de portugués los martes.',
    q: { q: '¿Qué idioma estudia Ricardo?', opts: ['Italiano', 'Portugués', 'Francés'], ok: 1, why: 'Dice "tomo clases de portugués".' },
    verdict: 'Ricardo es puntual y quiere ser papá, pero no habla italiano. Julia necesita que hable italiano.' },
  { id: 'tomas', for: 'julia', name: 'Tomás', age: 40, emoji: '🍝', good: true,
    bio: 'Soy profesor de italiano y viví tres años en Roma. Soy puntual: llego siempre diez minutos antes. Quiero adoptar un niño porque cuando era pequeño, mi tío me adoptó y fue el mejor día de mi vida.',
    q: { q: '¿Por qué quiere adoptar Tomás?', opts: ['Porque vive en Roma', 'Porque su tío lo adoptó cuando era pequeño', 'Porque llega siempre tarde'], ok: 1, why: 'Su tío lo adoptó cuando era pequeño (pretérito + imperfecto).' },
    verdict: 'Tomás habla italiano, es puntual y quiere adoptar. ¡Julia, ya lo encontramos!' },
];

export const DATES: DateScn[] = [
  { id: 'valeria', profile: 'valeria', title: 'Cita con Valeria en el café', steps: [
    { npc: 'Hola, Andrés. Qué bueno que viniste. ¿Qué te gusta hacer?', en: 'Hi, Andrés. So good you came. What do you like to do?', opts: [
      { t: 'Me gusta la biología. Estudio las ranas de la selva.', pts: 2, react: 'Valeria sonríe: "¡Las ranas! A mí me encantan."' },
      { t: 'Me gustan las computadoras y los videojuegos.', pts: 1, react: 'Valeria dice "mmm, qué interesante" y mira el reloj.' },
      { t: 'Me gusta mi ex novia. Todavía la extraño.', pts: 0, react: 'Valeria deja la taza en la mesa muy despacio.' } ] },
    { npc: 'Yo cociné para ti ayer. ¿Y tú, sabes cocinar?', en: 'I cooked for you yesterday. And you, do you know how to cook?', opts: [
      { t: 'Sí, cocino espagueti. Anoche preparé uno para mi gato... digo, mi perro.', pts: 1, react: 'Valeria levanta una ceja pero se ríe.' },
      { t: 'Sé cocinar un poco. ¡Quiero que me enseñes tu receta!', pts: 2, react: '"¡Claro! Te la mando mañana", dice Valeria encantada.' },
      { t: 'No, nunca cocino. Mi mamá lo hace todo.', pts: 0, react: 'Valeria dice: "Ah... vive con su mamá". Andrés quiere desaparecer.' } ] },
    { npc: 'Y dime, ¿adónde quieres viajar este año?', en: 'And tell me, where do you want to travel this year?', opts: [
      { t: 'Quiero ir a Costa Rica. ¿Quieres que vayamos juntos?', pts: 2, react: '"¡Sí!", dice Valeria. La mesera aplaude (¿por qué?).' },
      { t: 'No sé. Prefiero quedarme en casa.', pts: 0, react: 'Valeria bosteza. Andrés también.' },
      { t: 'Estuve en Perú el año pasado. Fue horrible.', pts: 1, react: 'Valeria asiente, sin mucho entusiasmo.' } ] },
  ], endings: [
    '💔 Valeria pide la cuenta. Andrés vuelve a casa solo y habla con la tele. Intenta otra vez.',
    '🙂 Una cita simpática. Valeria dice "nos vemos" y Andrés lo toma como una buena señal.',
    '💘 ¡La cita es un éxito! Se despiden con un abrazo y José recibe un mensaje: "Gracias, amigo. Eres un genio."'] },
  { id: 'marta', profile: 'marta', title: 'Cita con Marta (la de los gatos)', steps: [
    { npc: 'Pasa a mi casa, Andrés. No te preocupes por los gatos.', en: 'Come into my house, Andrés. Do not worry about the cats.', opts: [
      { t: 'Gracias, Marta... ¡Achís! ¡Achís!', pts: 0, react: 'Los tres gatos se suben a su abrigo.' },
      { t: 'Tengo alergia. ¿Podemos cenar en el jardín?', pts: 2, react: 'Marta dice: "Claro, lo siento". Se salva por ahora.' },
      { t: 'Me encantan los gatos. (Es mentira.)', pts: 0, react: 'Napoleón se sienta en su cabeza.' } ] },
    { npc: 'Preparé una cena especial. ¿Te gusta el pescado?', en: 'I prepared a special dinner. Do you like fish?', opts: [
      { t: 'Me gusta mucho, pero el atún es para los gatos, ¿no?', pts: 1, react: 'Marta se ríe: "Los gatos comen mejor que yo".' },
      { t: 'No me gusta. Soy alérgico al pescado también.', pts: 1, react: 'Marta suspira: "Entonces como pizza".' },
      { t: 'Me encanta. ¡Huele delicioso!', pts: 2, react: 'Marta sonríe. Andrés respira (y estornuda).' } ] },
    { npc: '¿Te gustaría viajar conmigo? Voy a Cuenca con mis gatos.', en: 'Would you like to travel with me? I am going to Cuenca with my cats.', opts: [
      { t: 'Prefiero viajar sin gatos. Es que... no quiero que me persigan.', pts: 1, react: 'Marta frunce el ceño.' },
      { t: 'Sí, ¡con mucho gusto! (Achís.)', pts: 0, react: 'Los gatos ya están en su maleta.' },
      { t: 'Gracias, pero tengo que ir al médico. ¡Achís!', pts: 1, react: 'Se va corriendo. Pelusa lo persigue.' } ] },
  ], endings: [
    '🤧 Final: Andrés llega a casa con 40 pelos de gato y la nariz roja. José dice: "Y yo que pensé que era perfecta."',
    '😅 Una cita rara pero divertida. Marta es simpática, pero Andrés necesita un antihistamínico.',
    '😺 Andrés y Marta quedan como amigos. Los gatos opinan lo contrario.'] },
  { id: 'tomas', profile: 'tomas', title: 'Cita de Julia con Tomás', steps: [
    { npc: 'Buonasera, Julia. Llegué diez minutos antes, como siempre.', en: 'Good evening, Julia. I arrived ten minutes early, as always.', opts: [
      { t: 'Buonasera, Tomás. Yo llegué hace cinco minutos. ¡Qué puntual eres!', pts: 2, react: 'Tomás sonríe: "Hablas italiano muy bien".' },
      { t: 'Hola. Perdón, es que estaba en una boda.', pts: 1, react: 'Tomás pregunta: "¿Una boda? ¿Tuya?" Julia se pone pálida.' },
      { t: 'Llego tarde porque no encontraba mis zapatos.', pts: 0, react: 'Tomás mira el reloj con tristeza.' } ] },
    { npc: 'Me contaron que te casaste en Cancún. ¿Cómo fue?', en: 'I was told you got married in Cancún. How was it?', opts: [
      { t: 'Fue un desastre. La mitad de los invitados estaban enfermos.', pts: 2, react: 'Tomás se ríe a carcajadas y la invita a una copa.' },
      { t: 'Fue perfecta. Pietro es un santo.', pts: 0, react: 'Tomás no sabe qué decir. El camarero tampoco.' },
      { t: 'No quiero hablar de eso. Nunca.', pts: 1, react: 'Un silencio incómodo. Llega el postre.' } ] },
    { npc: 'Y dime, Julia, ¿es verdad que quieres adoptar?', en: 'And tell me, Julia, is it true that you want to adopt?', opts: [
      { t: 'Sí. Espero que un día podamos hablar de eso con más tiempo.', pts: 2, react: 'Tomás toma su mano: "Yo también lo deseo".' },
      { t: 'No sé. Primero necesito un perro.', pts: 1, react: 'Tomás: "Un perro. Claro. Es un buen comienzo".' },
      { t: 'No, es una broma. No quiero niños.', pts: 0, react: 'Tomás se atraganta con la pasta.' } ] },
  ], endings: [
    '💔 Tomás paga la cuenta y desaparece entre la pasta. Julia vuelve a revisar los clasificados.',
    '🙂 Cita agradable. Quedan en llamarse. (Julia llama primero, claro.)',
    '💘 ¡Espléndida cita! Tomás le recita un poema en italiano. Julia piensa: "Esta vez no hay ceviche".'] },
];

export interface House { id: number; name: string; price: number; beds: number; baths: number; salaM2: number; floors: string; kitchen: string; desc: string; carpet: boolean; goodKitchen: boolean; bigSala: boolean; cheap: boolean; why: string }
export const MAX_PRICE = 150000;
export const HOUSES: House[] = [
  { id: 1, name: 'Casa Los Almendros', price: 140000, beds: 3, baths: 2, salaM2: 28, floors: 'alfombra en todas las habitaciones', kitchen: 'pequeña y vieja',
    desc: 'Casa de dos pisos con tres dormitorios y dos baños. Tiene una sala grande con un sofá azul y una mesa de centro. Las habitaciones tienen alfombra nueva (¡de color rosado!). La cocina es pequeña y vieja.',
    carpet: true, goodKitchen: false, bigSala: true, cheap: true, why: 'Tiene alfombra en todas las habitaciones. Alberto es alérgico... y la cocina es pequeña y vieja.' },
  { id: 2, name: 'Casa La Ceiba', price: 210000, beds: 4, baths: 3, salaM2: 40, floors: 'madera', kitchen: 'moderna con isla',
    desc: 'Casa enorme con cuatro dormitorios, tres baños y una sala gigante con chimenea. Los pisos son de madera. La cocina es moderna, con isla y refrigerador de acero. Cuesta mucho: es la más cara de la lista.',
    carpet: false, goodKitchen: true, bigSala: true, cheap: false, why: 'Es preciosa, pero cuesta $210.000. Alberto no tiene tanto dinero (está divorciado y vive con sus papás).' },
  { id: 3, name: 'Casa El Mirador', price: 135000, beds: 3, baths: 2, salaM2: 32, floors: 'cerámica', kitchen: 'moderna con isla',
    desc: 'Casa de un piso con tres dormitorios, dos baños y un jardín pequeño. Tiene pisos de cerámica en toda la casa, sin alfombras. La sala es grande y luminosa, con ventanas al jardín. La cocina es moderna, con isla y estufa de gas.',
    carpet: false, goodKitchen: true, bigSala: true, cheap: true, why: '¡Sin alfombras, cocina moderna, sala grande y precio razonable!' },
  { id: 4, name: 'Casa Las Palmas', price: 95000, beds: 2, baths: 1, salaM2: 15, floors: 'madera', kitchen: 'vieja y oscura',
    desc: 'Casa pequeña y barata con dos dormitorios y un baño. Los pisos son de madera. La sala es pequeña, con un sofá viejo, y la cocina es oscura y vieja. Tiene un patio con un árbol de mango.',
    carpet: false, goodKitchen: false, bigSala: false, cheap: true, why: 'Es la más barata, pero la cocina es vieja y oscura y la sala es muy pequeña. Alberto es muy exigente con eso.' },
  { id: 5, name: 'Casa Los Pinos', price: 120000, beds: 3, baths: 2, salaM2: 30, floors: 'cerámica y alfombra en la sala', kitchen: 'grande y nueva',
    desc: 'Casa de dos pisos con tres dormitorios y dos baños. La cocina es grande y nueva. La sala es amplia, con una alfombra gruesa y esponjosa de color beige: ¡el lugar perfecto para jugar con los niños! Los dormitorios tienen pisos de cerámica.',
    carpet: true, goodKitchen: true, bigSala: true, cheap: true, why: 'La sala tiene una alfombra gruesa. Alberto estornuda en cuanto entra. ¡Achís!' },
];

export interface CQ { q: string; opts: string[]; ok: number; why: string }
export const HQS: CQ[] = [
  { q: '¿Cuál es la casa más barata?', opts: ['La casa 1', 'La casa 4', 'La casa 5'], ok: 1, why: 'La casa 4 cuesta $95.000: es la más barata.' },
  { q: '¿Cuál es la casa más cara?', opts: ['La casa 2', 'La casa 3', 'La casa 1'], ok: 0, why: 'La casa 2 cuesta $210.000: es la más cara.' },
  { q: 'La casa 2 tiene ___ dormitorios que la casa 3.', opts: ['más', 'menos', 'tantos'], ok: 0, why: 'Cuatro dormitorios son más que tres: "más ... que".' },
  { q: 'La casa 3 es ___ barata que la casa 1.', opts: ['más', 'menos', 'tan'], ok: 0, why: '$135.000 es menos que $140.000, así que la casa 3 es más barata que la casa 1.' },
  { q: 'La casa 5 tiene ___ dormitorios como la casa 1.', opts: ['tantos', 'tan', 'tanto'], ok: 0, why: 'Dormitorios es masculino plural: tantos dormitorios como. Las dos tienen tres.' },
  { q: '¿Cuál tiene la sala más grande?', opts: ['La casa 3', 'La casa 2', 'La casa 5'], ok: 1, why: 'La casa 2 tiene 40 metros cuadrados: es la sala más grande.' },
];
