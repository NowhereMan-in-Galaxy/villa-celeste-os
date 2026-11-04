export interface Checkpoint { q: string; wrong: [string, string]; why: string }
export interface Line { w: string; es: string; en: string; sofa?: boolean; cp?: Checkpoint }
export interface Episode { id: string; ch: number; title: string; sub: string; lesson: string; focus: string; lines: Line[] }

export const PORTRAITS: Record<string, string> = {
  Narrador: '🎙️', Rosaura: '👩', 'Don Anselmo': '👴', 'Doña Griselda': '🦹‍♀️', Gabriel: '🤵', Esperanza: '👵',
  Ramiro: '🧔', Cecilia: '👩‍💼', Alejandra: '👩‍🦰', Felipe: '🧑', Esteban: '👨‍⚕️', Luisa: '🥑', Julia: '💁‍♀️', Pietro: '🤌', Álvaro: '🧑‍🎓',
};

const S = (w: string, es: string, en: string): Line => ({ w, es, en });
const C = (w: string, es: string, en: string): Line => ({ w, es, en, sofa: true });
const K = (w: string, es: string, en: string, q: string, wrong: [string, string], why: string): Line => ({ w, es, en, cp: { q, wrong, why } });

export const EPISODES: Episode[] = [
  { id: 'e1', ch: 4, title: 'La oveja negra 1: La hacienda', sub: 'Rosaura llega a casa', lesson: 'B1-L06', focus: 'ser / estar', lines: [
    S('Narrador', 'Hacienda Santa Úrsula. Don Anselmo está muy enfermo.', 'Santa Úrsula Hacienda. Don Anselmo is very sick.'),
    S('Doña Griselda', 'Anselmo, querido, tú no estás enfermo. Solo estás cansado.', 'Anselmo, dear, you are not sick. You are just tired.'),
    C('Cecilia', '¡Esa mujer es malísima! Es la madrastra.', 'That woman is evil! She is the stepmother.'),
    C('Alejandra', 'Y está mintiendo. ¡Mírale la cara!', 'And she is lying. Look at her face!'),
    S('Rosaura', 'Papá, ya llegué. ¿Dónde está la tía Esperanza?', 'Dad, I am here. Where is Aunt Esperanza?'),
    K('Rosaura', 'Papá, ¿qué te pasa? ¡Estás muy pálido!', 'Dad, what is wrong? You are very pale!', 'Rosaura ve a su papá en la cama. Está pálido por la enfermedad.', ['Papá, ¿qué te pasa? ¡Eres muy pálido!', 'Papá, ¿qué te pasa? ¡Estás muy pálida!'], 'Estar para condiciones temporales (palidez por enfermedad). Y "papá" es masculino: pálido.'),
    S('Don Anselmo', 'Hija mía, soy un hombre viejo, pero tengo un secreto.', 'My daughter, I am an old man, but I have a secret.'),
    K('Doña Griselda', 'La fiesta es en el salón, y el salón está lleno de invitados.', 'The party is in the salon, and the salon is full of guests.', 'Griselda cambia de tema. Dice dónde se celebra la fiesta (evento) y cómo está el salón.', ['La fiesta está en el salón, y el salón es lleno de invitados.', 'La fiesta está en el salón, y el salón es llena de invitados.'], 'Los eventos usan ser para su lugar ("es en"); "lleno" es un estado, así que estar.'),
    C('Cecilia', '¡Ay, qué nervios! ¿Cuál es el secreto?', 'Oh, I am so nervous! What is the secret?'),
    S('Narrador', 'Continuará mañana a las ocho. No se lo pierda.', 'To be continued tomorrow at eight. Do not miss it.'),
  ] },
  { id: 'e2', ch: 5, title: 'La oveja negra 2: El testamento', sub: 'Nadie me lo dijo', lesson: 'B1-L20', focus: 'me lo / se lo / se la', lines: [
    S('Narrador', 'El abogado lee el testamento en la biblioteca.', 'The lawyer reads the will in the library.'),
    S('Ramiro', 'Don Anselmo dejó la hacienda a su hija. Yo se la leo ahora.', 'Don Anselmo left the hacienda to his daughter. I will read it to you now.'),
    K('Doña Griselda', '¡Imposible! Anselmo me lo prometió a mí.', 'Impossible! Anselmo promised it to me.', 'Griselda grita: Anselmo le prometió la hacienda (el) a ella.', ['¡Imposible! Anselmo lo me prometió a mí.', '¡Imposible! Anselmo se lo prometió a mí.'], 'Con dos pronombres: el indirecto (me) va primero y el directo (lo) después: me lo. "Se" solo reemplaza le/les.'),
    C('Alejandra', '¡Mentirosa! Nadie le prometió nada.', 'Liar! Nobody promised her anything.'),
    S('Rosaura', 'Señor Ramiro, ¿puede darme el documento?', 'Mr. Ramiro, can you give me the document?'),
    K('Ramiro', 'Sí, señorita. Se lo doy ahora mismo.', 'Yes, miss. I will give it to you right now.', 'Ramiro le da el documento a Rosaura. Rosaura es "le" y el documento es "lo".', ['Sí, señorita. Le lo doy ahora mismo.', 'Sí, señorita. Lo se doy ahora mismo.'], 'Le + lo se convierte en se lo (no se dice "le lo").'),
    C('Cecilia', 'Alejandra, ¿tú sabes dónde está la hacienda?', 'Alejandra, do you know where the hacienda is?'),
    C('Alejandra', 'No sé, pero Griselda quiere vendérsela al diablo.', 'I do not know, but Griselda wants to sell it to the devil.'),
    K('Doña Griselda', 'Rosaura, esa carta no es tuya. ¡Dámela!', 'Rosaura, that letter is not yours. Give it to me!', 'Griselda quiere quitarle una carta (la carta) a Rosaura. Es un mandato afirmativo.', ['Rosaura, esa carta no es tuya. ¡Me la da!', 'Rosaura, esa carta no es tuya. ¡Dámelo!'], 'En mandatos afirmativos los pronombres van pegados al verbo: dámela (me + la). "Carta" es femenino: la.'),
    S('Narrador', 'La carta cae al fuego. ¿Quién la quemó?', 'The letter falls into the fire. Who burned it?'),
  ] },
  { id: 'e3', ch: 6, title: 'La oveja negra 3: Los gemelos', sub: 'Lo que pasó anoche', lesson: 'B1-L28', focus: 'pretérito', lines: [
    S('Narrador', 'Era una noche de tormenta. Esa noche todo cambió.', 'It was a stormy night. That night everything changed.'),
    S('Esperanza', 'Rosaura, tienes que saber la verdad. Tienes un hermano gemelo.', 'Rosaura, you have to know the truth. You have a twin brother.'),
    C('Cecilia', '¡Un gemelo! ¡No lo puedo creer!', 'A twin! I cannot believe it!'),
    C('Alejandra', 'Yo lo adiviné en el capítulo uno.', 'I guessed it in chapter one.'),
    K('Esperanza', 'Anoche escribí una carta y salí corriendo al pueblo.', 'Last night I wrote a letter and ran out to the village.', 'Esperanza cuenta lo que hizo anoche. Es una acción terminada, con yo.', ['Anoche escribo una carta y salgo corriendo al pueblo.', 'Anoche escribió una carta y salí corriendo al pueblo.'], 'Acción terminada en el pasado: pretérito, y con yo, escribí y salí (no "escribió").'),
    S('Rosaura', '¿Y quién se llevó a mi hermano?', 'And who took my brother away?'),
    K('Esperanza', 'Griselda lo vendió a un circo, y él comió pan duro por años.', 'Griselda sold him to a circus, and he ate stale bread for years.', 'Esperanza cuenta, en tercera persona, qué hicieron Griselda y el hermano.', ['Griselda lo vendí a un circo, y él comí pan duro por años.', 'Griselda lo vendimos a un circo, y él comieron pan duro por años.'], 'Pretérito de -er/-ir: vendió, comió (tercera persona singular: -ió).'),
    S('Rosaura', '¡Dios mío! ¿Cómo se llama?', 'My God! What is his name?'),
    S('Esperanza', 'Se llama Gabriel. Hoy llegó al pueblo.', 'His name is Gabriel. Today he arrived in town.'),
    C('Cecilia', 'Alejandra, ¿tú entendiste todo?', 'Alejandra, did you understand everything?'),
    C('Alejandra', 'Nada. Pero sirve más café.', 'Nothing. But pour more coffee.'),
  ] },
  { id: 'e4', ch: 7, title: 'La oveja negra 4: Amnesia', sub: '¿Quién soy yo?', lesson: 'B2-L07', focus: 'pretérito vs. imperfecto', lines: [
    S('Narrador', 'Gabriel caminaba por el camino cuando un caballo lo golpeó.', 'Gabriel was walking along the road when a horse hit him.'),
    S('Gabriel', '¿Dónde estoy? ¿Quién soy? No recuerdo nada.', 'Where am I? Who am I? I remember nothing.'),
    C('Cecilia', 'Amnesia. Siempre es amnesia.', 'Amnesia. It is always amnesia.'),
    S('Rosaura', 'Gabriel, yo soy tu hermana. Mira esta foto.', 'Gabriel, I am your sister. Look at this photo.'),
    K('Rosaura', 'Cuando éramos niños, jugábamos juntos todos los días.', 'When we were children, we played together every day.', 'Rosaura describe una costumbre de la infancia, algo que pasaba muchas veces.', ['Cuando fuimos niños, jugamos juntos todos los días.', 'Cuando éramos niños, jugamos juntos un día.'], 'Para describir hábitos o costumbres en el pasado se usa el imperfecto (éramos, jugábamos).'),
    S('Gabriel', 'Recuerdo una casa grande, pero no recuerdo tu cara.', 'I remember a big house, but I do not remember your face.'),
    K('Rosaura', 'Un día llovía y tú llegaste a la casa con un perro.', 'One day it was raining and you arrived at the house with a dog.', 'Rosaura cuenta un recuerdo: una situación de fondo (llover) y una acción puntual (llegar).', ['Un día llovió y tú llegabas a la casa con un perro.', 'Un día llovía y tú llegabas a la casa con un perro.'], 'Imperfecto para la escena de fondo (llovía) y pretérito para la acción que la interrumpe (llegaste).'),
    C('Alejandra', '¡Ya recuerda! ¡Ya recuerda!', 'He remembers now! He remembers now!'),
    S('Gabriel', 'No... ¡Sí! Esa tarde, mi madre me dio una moneda.', 'No... Yes! That afternoon, my mother gave me a coin.'),
    S('Narrador', 'Pero un hombre misterioso observaba desde la ventana.', 'But a mysterious man was watching from the window.'),
  ] },
  { id: 'e5', ch: 8, title: 'La oveja negra 5: La madrastra', sub: 'Quiero que te vayas', lesson: 'B2-L28', focus: 'subjuntivo (deseo / influencia)', lines: [
    S('Narrador', 'Doña Griselda prepara su plan final en la oscuridad.', 'Doña Griselda prepares her final plan in the dark.'),
    K('Doña Griselda', 'Quiero que Rosaura se vaya de la hacienda esta noche.', 'I want Rosaura to leave the hacienda tonight.', 'Griselda le dice a su cómplice que desea que otra persona (Rosaura) haga algo.', ['Quiero que Rosaura se va de la hacienda esta noche.', 'Quiero Rosaura se vaya de la hacienda esta noche.'], 'Querer + que + sujeto distinto pide subjuntivo: quiero que se vaya.'),
    S('Ramiro', 'Señora, le sugiero que espere hasta el lunes.', 'Madam, I suggest that you wait until Monday.'),
    C('Cecilia', '¡Ramiro es un cobarde!', 'Ramiro is a coward!'),
    K('Doña Griselda', 'Te ordeno que me traigas el veneno ahora.', 'I order you to bring me the poison now.', 'Griselda manda a Ramiro: ella ordena y él debe hacer algo.', ['Te ordeno que me traes el veneno ahora.', 'Te ordeno que me traer el veneno ahora.'], 'Verbos de influencia (ordenar, pedir, sugerir) + que van con subjuntivo: traigas.'),
    S('Ramiro', 'Está bien, pero espero que nadie nos vea.', 'All right, but I hope no one sees us.'),
    C('Alejandra', 'Yo veo todo. ¡Mira! Rosaura está detrás de la cortina.', 'I see everything. Look! Rosaura is behind the curtain.'),
    K('Rosaura', 'Es necesario que todos sepan la verdad.', 'It is necessary that everyone know the truth.', 'Rosaura sale de la cortina y declara que la verdad debe saberse.', ['Es necesario que todos saben la verdad.', 'Es necesario que todos sabrán la verdad.'], 'Las expresiones impersonales de necesidad (es necesario que) llevan subjuntivo: sepan.'),
    S('Narrador', 'Se apagan las luces. Un grito. Fin del capítulo.', 'The lights go out. A scream. End of the chapter.'),
  ] },
  { id: 'e6', ch: 9, title: 'La oveja negra 6: El regreso', sub: 'Dudo que sea él', lesson: 'B2-L27', focus: 'subjuntivo (duda)', lines: [
    S('Narrador', 'Un hombre con sombrero entra a la hacienda. Todos lo miran.', 'A man with a hat enters the hacienda. Everyone looks at him.'),
    S('Rosaura', 'Es Gabriel, mi hermano. Volvió para ayudarnos.', 'It is Gabriel, my brother. He came back to help us.'),
    K('Doña Griselda', 'Dudo que ese hombre sea tu hermano.', 'I doubt that man is your brother.', 'Griselda no cree que el hombre sea Gabriel. Expresa duda.', ['Dudo que ese hombre es tu hermano.', 'Dudo que ese hombre fue tu hermano.'], 'Dudar + que lleva subjuntivo: dudo que sea.'),
    C('Cecilia', 'Alejandra, yo no dudo que es él. ¡Tiene la misma nariz!', 'Alejandra, I do not doubt it is him. He has the same nose!'),
    K('Gabriel', 'No creo que usted tenga corazón, señora.', 'I do not think you have a heart, madam.', 'Gabriel responde con rabia. No cree que la madrastra tenga corazón.', ['No creo que usted tiene corazón, señora.', 'Creo que usted tenga corazón, señora.'], 'No creer que + subjuntivo (duda): tenga. En cambio, "creo que" + indicativo (certeza).'),
    S('Esperanza', 'Es verdad. Yo estaba allí cuando nacieron.', 'It is true. I was there when they were born.'),
    K('Rosaura', 'Es cierto que somos gemelos. Tenemos la misma marca.', 'It is certain that we are twins. We have the same mark.', 'Rosaura afirma, con certeza, que son gemelos.', ['Es cierto que seamos gemelos. Tenemos la misma marca.', 'Es cierto que fuéramos gemelos. Tenemos la misma marca.'], 'Con certeza (es cierto que, es verdad que) se usa indicativo: somos.'),
    C('Alejandra', '¡Qué final! Ya no dudo nada.', 'What an ending! I no longer doubt anything.'),
    C('Cecilia', 'Y mañana empieza otra novela. ¡La vida es bella!', 'And tomorrow another soap opera begins. Life is beautiful!'),
  ] },
  { id: 'e7', ch: 10, title: 'Drama vecinal: La fiesta de Felipe', sub: 'El día después', lesson: 'B1-L29', focus: 'pretérito irregular', lines: [
    S('Narrador', 'Casa Quirós, 8:00 de la mañana. Los papás regresaron de viaje.', 'Quirós House, 8:00 in the morning. The parents returned from their trip.'),
    S('Esteban', '¡Felipe! ¿Por qué están todas las puertas abiertas?', 'Felipe! Why are all the doors open?'),
    K('Felipe', 'Papá, te lo juro: yo no di ninguna fiesta... bueno, vinieron unos amigos.', 'Dad, I swear: I did not throw any party... well, some friends came.', 'Felipe miente mal. Usa dar y venir en pretérito.', ['Papá, te lo juro: yo no daba ninguna fiesta... bueno, venieron unos amigos.', 'Papá, te lo juro: yo no dé ninguna fiesta... bueno, vinió unos amigos.'], 'Irregulares en pretérito: yo di, ellos vinieron (venir: vin-).'),
    S('Luisa', '¡Mi cocina! ¿Quién puso frijoles en el sofá?', 'My kitchen! Who put beans on the sofa?'),
    K('Felipe', 'Mamá, no supe qué hacer. Mis amigos hicieron un desastre.', 'Mom, I did not know what to do. My friends made a mess.', 'Felipe se defiende: no supo qué hacer y sus amigos hicieron un desastre.', ['Mamá, no sabí qué hacer. Mis amigos hacieron un desastre.', 'Mamá, no supe qué hacer. Mis amigos hizo un desastre.'], 'Saber: supe. Hacer: hicieron (ellos). Son irregulares en el pretérito.'),
    S('Esteban', '¿Y la televisión? ¡Está rota!', 'And the television? It is broken!'),
    C('Cecilia', 'Alejandra, ¿tú ves esto? Felipe es la oveja negra del barrio.', 'Alejandra, do you see this? Felipe is the black sheep of the neighborhood.'),
    C('Alejandra', 'Pobre Felipe. Pero la fiesta fue un éxito, dicen.', 'Poor Felipe. But the party was a success, they say.'),
    S('Felipe', 'Lo siento. Mañana limpio todo. Lo prometo.', 'I am sorry. Tomorrow I will clean everything. I promise.'),
  ] },
  { id: 'e8', ch: 11, title: 'Drama vecinal: Boda en Cancún', sub: 'La boda de Julia', lesson: 'B2-L09', focus: 'pretérito e imperfecto', lines: [
    S('Narrador', 'Cancún. La boda de Julia Rivera y Pietro era perfecta... hasta el sábado.', 'Cancún. The wedding of Julia Rivera and Pietro was perfect... until Saturday.'),
    S('Julia', 'Yo estaba muy nerviosa. Llovía y el vestido pesaba mucho.', 'I was very nervous. It was raining and the dress was very heavy.'),
    K('Pietro', 'Cuando llegué a la playa, ya todos esperaban.', 'When I arrived at the beach, everyone was already waiting.', 'Pietro cuenta que llegó (acción puntual) y que los demás ya esperaban (situación en curso).', ['Cuando llegaba a la playa, ya todos esperaron.', 'Cuando llegué a la playa, ya todos esperé.'], 'Pretérito para la acción puntual (llegué); imperfecto para la situación en curso (esperaban).'),
    S('Julia', 'Entonces el marisco llegó y todos comieron.', 'Then the seafood arrived and everyone ate.'),
    C('Cecilia', '¡Ay, no! Seguro fue el ceviche.', 'Oh no! It was surely the ceviche.'),
    K('Julia', 'A las nueve, la mitad de los invitados estaba enferma.', 'At nine o\'clock, half of the guests were sick.', 'Julia describe cómo estaban los invitados a una hora determinada. Es un estado.', ['A las nueve, la mitad de los invitados estuvo enferma.', 'A las nueve, la mitad de los invitados estaban enfermos ayer.'], 'Para descripciones y estados en un momento del pasado: imperfecto (estaba). Con "la mitad", el verbo va en singular.'),
    S('Pietro', 'Mi tío perdió su vuelo y mi madre lloró toda la noche.', 'My uncle missed his flight and my mother cried all night.'),
    K('Julia', 'Esa noche decidí que no me quería casar con él.', 'That night I decided that I did not want to marry him.', 'Julia cuenta su decisión (puntual) y lo que sentía (estado mental).', ['Esa noche decidía que no me quise casar con él.', 'Esa noche decidí que no me quise casar con él.'], 'Decidí es puntual (pretérito); "no quería" es un estado mental de fondo (imperfecto).'),
    C('Alejandra', 'Divorcio en el capítulo siguiente. ¡Qué drama!', 'Divorce in the next chapter. What drama!'),
  ] },
];
