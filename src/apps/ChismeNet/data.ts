export interface Buddy { id: string; name: string; family: string; status: 'on' | 'away' | 'off'; nick: string; ava: string }
export interface Opt { es: string; en: string; ok?: boolean; why?: string }
export type Step =
  | { k: 'm'; from: string; es: string; en: string }
  | { k: 'c'; q: string; opts: Opt[] }
  | { k: 't'; q: string; answer: string; en: string; hint: string };
export interface Episode { id: string; buddy: string; lesson: string; title: string; skill: string; role?: string; steps: Step[] }

export const FAMILIES = ['Familia Cortés', 'Familia Quirós', 'Familia González', 'Familia Valenzuela', 'Familia Espinoza', 'Solteros'];

export const BUDDIES: Buddy[] = [
  { id: 'cecilia', name: 'Cecilia', family: FAMILIES[0], status: 'on', nick: '~*~ ¡¡La oveja negra a las 4!! ~*~', ava: '📺' },
  { id: 'luis', name: 'Luis', family: FAMILIES[0], status: 'away', nick: 'Agencia Cortés - ¡viaje a Cartagena! :-)', ava: '✈️' },
  { id: 'alberto', name: 'Alberto', family: FAMILIES[0], status: 'on', nick: 'achú... odio las alfombras :\'(', ava: '🦷' },
  { id: 'diego', name: 'Diego', family: FAMILIES[0], status: 'on', nick: 'MBA 4ever <3 (E.)', ava: '📊' },
  { id: 'javier', name: 'Javier', family: FAMILIES[0], status: 'away', nick: 'vuelo 8:00 AM ¡zzz!', ava: '🛠️' },
  { id: 'esteban', name: 'Dr. Esteban', family: FAMILIES[1], status: 'on', nick: 'Clínica Villa Celeste - ¡coma verduras!', ava: '🩺' },
  { id: 'erica', name: 'Erica', family: FAMILIES[1], status: 'on', nick: 'bebé #3 en camino :-D', ava: '🤰' },
  { id: 'felipe', name: 'Felipe', family: FAMILIES[1], status: 'on', nick: 'NO fue mi culpa ;-)', ava: '🎉' },
  { id: 'alejandra', name: 'Alejandra', family: FAMILIES[2], status: 'on', nick: '6-0, 6-0 (ganó Ale) ~*~', ava: '🎾' },
  { id: 'marisol', name: 'Marisol', family: FAMILIES[2], status: 'on', nick: '¡¡examen mañana!! ~*~ :-(', ava: '💻' },
  { id: 'alvaro', name: 'Álvaro', family: FAMILIES[3], status: 'away', nick: 'moto > carro. punto.', ava: '🏍️' },
  { id: 'jimena', name: 'Jimena', family: FAMILIES[3], status: 'on', nick: 'namasté & escultura <3', ava: '🧘' },
  { id: 'leonor', name: 'Leonor', family: FAMILIES[4], status: 'on', nick: 'nadando por dos ~*~', ava: '🏊' },
  { id: 'julia', name: 'Julia', family: FAMILIES[5], status: 'on', nick: 'ciao bella (no más bodas)', ava: '💼' },
  { id: 'andres', name: 'Andrés', family: FAMILIES[5], status: 'away', nick: 'biólogo busca trabajo (y amor) :-/', ava: '🔬' },
  { id: 'jose', name: 'José', family: FAMILIES[5], status: 'on', nick: 'Cupido oficial del barrio ;-)', ava: '🏹' },
];

type O = [string, string, string?];
const m = (from: string, es: string, en: string): Step => ({ k: 'm', from, es, en });
const o = ([es, en, why]: O, ok = false): Opt => ({ es, en, ok, why });
/** c(intent, position of correct option, correct, wrong1, wrong2) */
const c = (q: string, pos: number, ok: O, w1: O, w2: O): Step => {
  const opts = [o(w1), o(w2)];
  opts.splice(pos, 0, o(ok, true));
  return { k: 'c', q, opts };
};
const t = (q: string, answer: string, en: string, hint: string): Step => ({ k: 't', q, answer, en, hint });

export const EPISODES: Episode[] = [
  { id: 'marisol1', buddy: 'marisol', lesson: 'B1-L07', title: 'Examen de mates y pizza', skill: 'Verbos -er/-ir', steps: [
    m('Marisol', '¡Hola! Estoy con Pilar y Carolina en el chat. ¡Mañana tenemos examen de matemáticas! :-(', 'Hi! I\'m in the chat with Pilar and Carolina. Tomorrow we have a math exam!'),
    m('Pilar', 'Yo aprendo mucho con los videos, pero Carolina nunca lee el libro.', 'I learn a lot with videos, but Carolina never reads the book.'),
    m('Carolina', '¡Eso no es verdad! Yo leo todas las páginas y como pizza mientras estudio ;-)', 'That\'s not true! I read every page and eat pizza while I study.'),
    m('Marisol', 'Y tú, ¿qué haces para el examen?', 'And you, what do you do for the exam?'),
    c('Say: "I write my exercises and I read the book."', 1, ['Escribo mis ejercicios y leo el libro.', 'I write my exercises and read the book.'], ['Escribes mis ejercicios y lees el libro.', 'You write...', 'The -es ending is for tú. With yo, -er/-ir verbs end in -o: escribo, leo.'], ['Escribimos mis ejercicios y leemos el libro.', 'We write...', '-imos/-emos means "we". For yourself use yo: escribo, leo.']),
    m('Pilar', '¡Qué estudioso! ¿Y dónde viven ustedes?', 'How studious! And where do you all live?'),
    c('Say: "I live in Villa Celeste, near Marisol\'s house."', 0, ['Vivo en Villa Celeste, cerca de la casa de Marisol.', 'I live in Villa Celeste...'], ['Vives en Villa Celeste, cerca de Marisol.', 'You live...', 'Vives = tú. You are talking about yourself: vivo.'], ['Vive en Villa Celeste, cerca de Marisol.', 'He/She lives...', 'Vive = he/she/usted. For yo the ending is -o: vivo.']),
    m('Carolina', 'Marisol y yo comemos a la una en el colegio. ¿Y ustedes?', 'Marisol and I eat at one at school. And you?'),
    t('Type: "We eat at one." (Comer)', 'Comemos a la una', 'We eat at one.', 'nosotros + comer → -emos'),
    m('Marisol', '¡Perfecto! Bueno, ¡a estudiar! Chao :-) <3', 'Perfect! Well, time to study! Bye!'),
  ] },
  { id: 'felipe1', buddy: 'felipe', lesson: 'B1-L06', title: 'La casa después de la fiesta', skill: 'Estar + numbers > 100', steps: [
    m('Felipe', 'Auxilio... mis papás llegan en una hora y la casa está HORRIBLE. :-O', 'Help... my parents arrive in an hour and the house is HORRIBLE.'),
    m('Felipe', 'Las puertas están abiertas, la tele está rota y la cocina está sucia.', 'The doors are open, the TV is broken and the kitchen is dirty.'),
    c('Ask: "Where are your parents now?"', 2, ['¿Dónde están tus papás ahora?', 'Where are your parents now?'], ['¿Dónde son tus papás ahora?', 'Where are...', 'Location uses estar, not ser: están.'], ['¿Dónde está tus papás ahora?', 'Where is...', 'Papás is plural, so the verb is plural too: están.']),
    m('Felipe', 'Están en el aeropuerto. ¡Y yo estoy aquí con ciento cincuenta vasos sucios!', 'They\'re at the airport. And I\'m here with 150 dirty glasses!'),
    c('Say: "You\'re in trouble! Your house is very dirty."', 0, ['¡Estás en problemas! Tu casa está muy sucia.', 'You\'re in trouble!...'], ['¡Eres en problemas! Tu casa es muy sucia.', 'You are (ser)...', 'Conditions and states ("dirty" right now) take estar, not ser.'], ['¡Estoy en problemas! Tu casa está muy sucia.', 'I am in trouble...', 'Estoy = I am. You are talking to Felipe: estás.']),
    t('Type: "The doors are open."', 'Las puertas están abiertas', 'The doors are open.', 'las puertas + estar (ellas) + abiertas'),
    m('Felipe', '¡Tienes razón! Voy a limpiar todo. Mis amigos están aquí para ayudar... bueno, ¡están durmiendo! xD', 'You\'re right! I\'ll clean everything. My friends are here to help... well, they\'re sleeping!'),
  ] },
  { id: 'cecilia1', buddy: 'cecilia', lesson: 'B1-L19', title: 'Chisme de La oveja negra', skill: 'Complemento indirecto', steps: [
    m('Cecilia', '¡Alejandra, ¿viste el capítulo de hoy?! Don Ramiro le dijo a Lucía que tiene un hijo secreto. :-O', 'Alejandra, did you see today\'s episode?! Don Ramiro told Lucía he has a secret son.'),
    m('Alejandra', '¡No lo puedo creer! Y tú, vecino, ¿miras La oveja negra?', 'I can\'t believe it! And you, neighbor, do you watch La oveja negra?'),
    c('Ask: "What does Don Ramiro say to Lucía?"', 1, ['¿Qué le dice Don Ramiro a Lucía?', 'What does Don Ramiro say to Lucía?'], ['¿Qué les dice Don Ramiro a Lucía?', 'What does he say to them...', 'Les is plural. Lucía is one person, so the indirect object pronoun is le.'], ['¿Qué lo dice Don Ramiro a Lucía?', '...', 'Lo is a direct object pronoun. The person you say something TO takes le.']),
    m('Cecilia', 'Le dice: "Lucía, tengo un hijo." ¡Y ella le tira el vaso a la cara! Luis nunca quiere verla conmigo...', 'He says: "Lucía, I have a son." And she throws the glass in his face! Luis never wants to watch it with me...'),
    c('Say: "He doesn\'t like the show, but WE (women) do like it!"', 2, ['A él no le gusta, ¡pero a nosotras sí nos gusta!', 'He doesn\'t like it...'], ['A él no gusta, ¡pero nosotras sí gustamos!', '...', 'Gustar needs an indirect object pronoun: le gusta, nos gusta.'], ['A él no le gusta, ¡pero a nosotras sí le gusta!', '...', 'For "we" the pronoun is nos: nos gusta.']),
    t('Type: "I give you the gossip." (to Cecilia, using te)', 'Te doy el chisme', 'I give you the gossip.', 'te + dar (yo) → doy'),
    m('Alejandra', '¡Jajaja! Mañana a las cuatro, en mi casa. Cecilia, tráeme galletas :-D', 'Hahaha! Tomorrow at four, at my house. Cecilia, bring me cookies!'),
  ] },
  { id: 'diego1', buddy: 'diego', lesson: 'B1-L08', title: 'Ema y la biblioteca', skill: 'El verbo ir', steps: [
    m('Diego', 'Necesito ayuda... Ema es tan inteligente y tan linda. :-$ Quiero invitarla a estudiar.', 'I need help... Ema is so smart and so pretty. I want to invite her to study.'),
    c('Suggest Diego write: "Ema, are you going to the library tonight? I\'m going at seven."', 0, ['Ema, ¿vas a la biblioteca esta noche? Yo voy a las siete.', 'Ema, are you going...'], ['Ema, ¿voy a la biblioteca esta noche? Yo vas a las siete.', '...', 'Ir: yo voy, tú vas. You mixed them up.'], ['Ema, ¿ir a la biblioteca esta noche? Yo ir a las siete.', '...', 'You must conjugate ir: tú vas, yo voy.']),
    m('Ema', '¡Hola, Diego! Sí, voy a la biblioteca a las siete. ¿Adónde vamos después?', 'Hi, Diego! Yes, I\'m going to the library at seven. Where do we go afterwards?'),
    m('Diego', '¡¡Ayuda!! ¿Qué le digo? <3', 'Help!! What do I tell her?'),
    c('Write: "We go to a café. My treat!"', 1, ['Vamos a una cafetería. ¡Yo invito!', 'We go to a café. My treat!'], ['Van a una cafetería. ¡Yo invito!', 'They go...', 'Van = ellos/ustedes. For "we" use vamos.'], ['Voy a una cafetería. ¡Yo invito!', 'I go...', 'Voy = I. Diego and Ema go together: vamos.']),
    t('Type: "I am going to study with you." (informal)', 'Voy a estudiar contigo', 'I am going to study with you.', 'ir a + infinitive; con + tú = contigo'),
    m('Ema', '¡Qué lindo! :-) Nos vemos a las siete. ¡No llegues tarde!', 'How sweet! See you at seven. Don\'t be late!'),
    m('Diego', 'Gracias, vecino. ¡Estoy tan nervioso! <3 <3', 'Thanks, neighbor. I\'m so nervous!'),
  ] },
  { id: 'alberto1', buddy: 'alberto', lesson: 'B1-L20', title: 'La quinta casa', skill: 'Pronombres dobles', role: 'Alberto', steps: [
    m('Cecilia', 'Hijo, ¿cómo fue la quinta casa? Dijiste que la alfombra... ¿te mostró la cocina el agente? ¿Es grande?', 'Son, how was the fifth house? You said the carpet... did the agent show you the kitchen? Is it big?'),
    c('Reply: "Yes, he showed it to me, but it\'s very small."', 2, ['Sí, me la mostró, pero es muy pequeña.', 'Yes, he showed it to me...'], ['Sí, me lo mostró, pero es muy pequeña.', '...', 'Cocina is feminine, so the direct object pronoun is la, not lo.'], ['Sí, la me mostró, pero es muy pequeña.', '...', 'Order: indirect (me) first, then direct (la): me la mostró.']),
    m('Cecilia', '¿Y le diste tu número de teléfono al agente?', 'And did you give your phone number to the agent?'),
    c('Reply: "Yes, I gave it to him."', 0, ['Sí, se lo di.', 'Yes, I gave it to him.'], ['Sí, le lo di.', '...', 'Le + lo become se lo (two l-pronouns can\'t sit together).'], ['Sí, lo se di.', '...', 'Order is indirect first: se lo, not lo se.']),
    m('Cecilia', 'Alberto... ¿y la alfombra? ¿Quién te la vendió?', 'Alberto... and the carpet? Who sold it to you?'),
    t('Type: "I\'m telling it to you." (la noticia → te la...)', 'Te la digo', 'I\'m telling it to you.', 'te + la + decir (yo)'),
    m('Cecilia', 'Ay, mi hijo. La casa perfecta existe. ¡Tú puedes! Te la voy a encontrar yo :-)', 'Oh, my son. The perfect house exists. I\'ll find it for you!'),
  ] },
  { id: 'javier1', buddy: 'javier', lesson: 'B1-L21', title: 'Aeropuerto a las seis', skill: 'Verbos reflexivos', role: 'Erica', steps: [
    m('Javier', '¡Amor! Mañana tengo vuelo a las 8:00. ¿Me llevas al aeropuerto a las 6:00 de la mañana?', 'Love! Tomorrow I have a flight at 8:00. Can you take me to the airport at 6:00 AM?'),
    c('Reply: "At six! Then I get up at five and shower quickly."', 1, ['¡A las seis! Entonces me levanto a las cinco y me ducho rápido.', 'At six!...'], ['¡A las seis! Entonces levanto a las cinco y ducho rápido.', '...', 'Levantar means "to lift something". For yourself you need the reflexive: me levanto, me ducho.'], ['¡A las seis! Entonces te levantas a las cinco y te duchas rápido.', '...', 'Te = you. Erica is talking about herself: me.']),
    m('Javier', 'Gracias, amor. Yo me acuesto temprano hoy. ¿Las niñas se despiertan a las seis?', 'Thanks, love. I\'m going to bed early today. Do the girls wake up at six?'),
    c('Say: "Diana wakes up at seven, but Mariana wakes up at five!"', 2, ['Diana se despierta a las siete, ¡pero Mariana se despierta a las cinco!', 'Diana wakes up...'], ['Diana despierta a las siete, ¡pero Mariana despierta a las cinco!', '...', 'Without se it means "wakes (someone) up". Wakes up herself: se despierta.'], ['Diana te despierta a las siete...', '...', 'Te = you. Diana is third person: se.']),
    t('Type: "We always get dressed quickly." (vestirse)', 'Siempre nos vestimos rápido', 'We always get dressed quickly.', 'nos + vestimos (stem change e→i only in some forms: not nosotros)'),
    m('Javier', 'Perfecto. ¡Te quiero! Despiértame a las cinco, por favor ;-) <3', 'Perfect. I love you! Wake me up at five, please.'),
  ] },
  { id: 'esteban1', buddy: 'esteban', lesson: 'B1-L24', title: 'Consulta con el doctor', skill: 'Mandatos formales', steps: [
    m('Dr. Esteban', 'Buenas tardes. Soy el doctor Quirós. Tengo sus resultados del laboratorio.', 'Good afternoon. I\'m Dr. Quirós. I have your lab results.'),
    m('Dr. Esteban', 'Usted está bien, pero necesita cambiar algunas costumbres. Mi esposa Luisa, la nutricionista, también quiere ayudar.', 'You\'re fine, but you need to change some habits. My wife Luisa, the nutritionist, also wants to help.'),
    c('Tell the doctor you\'ll follow orders. He says: "Eat more vegetables." Which is the correct formal command?', 1, ['Coma más verduras.', 'Eat more vegetables.'], ['Come más verduras.', '...', 'That\'s the present tense (he/she eats). The usted command for -er verbs ends in -a: coma.'], ['Comas más verduras.', '...', '-as is the subjunctive tú form. For usted: coma.']),
    m('Dr. Esteban', '¡Muy bien! Ahora: ¿cómo le digo a mi paciente que no fume?', 'Very good! Now: how do I tell my patient not to smoke?'),
    c('Choose the correct formal command: "Don\'t smoke."', 0, ['No fume.', 'Don\'t smoke.'], ['No fuma.', '...', 'No fuma is an affirmation ("doesn\'t smoke"), not a command. -ar verbs: -e.'], ['No fumes.', '...', 'No fumes is informal (tú). The doctor uses usted: no fume.']),
    c('Choose: "Go to the gym three times a week."', 2, ['Vaya al gimnasio tres veces por semana.', 'Go to the gym...'], ['Va al gimnasio tres veces por semana.', '...', 'Va is the present tense. Ir\'s usted command is irregular: vaya.'], ['Ve al gimnasio tres veces por semana.', '...', 'Ve is the informal tú command. For usted: vaya.']),
    t('Type: "Sit down, please." (usted, reflexive)', 'Siéntese, por favor', 'Sit down, please.', 'sentarse → siéntese (note the accent)'),
    m('Dr. Esteban', 'Excelente. Nos vemos en un mes. ¡Beba agua y duerma ocho horas! :-)', 'Excellent. See you in a month. Drink water and sleep eight hours!'),
  ] },
  { id: 'alejandra1', buddy: 'alejandra', lesson: 'B1-L25', title: 'Tenis contra Carlos', skill: 'Mandatos informales', steps: [
    m('Alejandra', 'Carlos y yo jugamos tenis hoy. Ganó Ale, como siempre :-P Dos sets a cero.', 'Carlos and I played tennis today. Ale won, as always. Two sets to zero.'),
    m('Alejandra', 'Ayúdame, vecino. Dile a Carlos qué hacer para ganar algún día.', 'Help me, neighbor. Tell Carlos what to do to win one day.'),
    c('Tell Carlos: "Carlos, come at six and bring the racket."', 1, ['Carlos, ven a las seis y trae la raqueta.', 'Carlos, come at six...'], ['Carlos, viene a las seis y trae la raqueta.', '...', 'Viene is a statement. Informal command for venir is irregular: ven.'], ['Carlos, venga a las seis y traiga la raqueta.', '...', 'Venga/traiga are formal (usted). You know Carlos well: ven, trae.']),
    m('Alejandra', 'Jajaja. Carlos dice que está cansado.', 'Hahaha. Carlos says he\'s tired.'),
    c('Tell Carlos: "Don\'t lose the ball!"', 2, ['¡No pierdas la pelota!', 'Don\'t lose the ball!'], ['¡No pierde la pelota!', '...', 'Negative informal commands use the subjunctive form: no pierdas.'], ['¡No perder la pelota!', '...', 'Infinitives aren\'t commands in a conversation: no pierdas.']),
    t('Type the command "Tell me the truth." (tú)', 'Dime la verdad', 'Tell me the truth.', 'decir → di (irregular) + me'),
    m('Carlos', '¡Hola! Soy Carlos. ¡Dame una raqueta nueva y te gano! ;-)', 'Hi! It\'s Carlos. Give me a new racket and I\'ll beat you!'),
  ] },
  { id: 'erica1', buddy: 'erica', lesson: 'B1-L26', title: 'Diana, Mariana y el bebé #3', skill: 'Comparativos y superlativos', steps: [
    m('Erica', 'Javier dice que Diana es la niña más inteligente de la familia, pero Mariana es más traviesa que ella :-D', 'Javier says Diana is the smartest girl in the family, but Mariana is naughtier than her.'),
    c('Say: "Diana is taller than Mariana, of course!"', 0, ['¡Diana es más alta que Mariana, claro!', 'Diana is taller than Mariana!'], ['¡Diana es más alta de Mariana, claro!', '...', 'Comparisons use que (más alta que).'], ['¡Diana es más alta como Mariana, claro!', '...', '"Como" is for equality (tan alta como). For "more than" use que.']),
    m('Erica', 'Sí... pero Mariana come tanto como Diana. ¡Y tiene un año!', 'Yes... but Mariana eats as much as Diana. And she\'s one year old!'),
    c('Say: "Mariana is as pretty as Diana."', 1, ['Mariana es tan bonita como Diana.', 'Mariana is as pretty as Diana.'], ['Mariana es tan bonita que Diana.', '...', 'Equal comparisons: tan + adjective + como.'], ['Mariana es más bonita como Diana.', '...', 'más ... como mixes two structures. Equality: tan ... como.']),
    c('Say: "You are the best mom in the neighborhood."', 2, ['Eres la mejor mamá del vecindario.', 'You are the best mom in the neighborhood.'], ['Eres la más buena mamá del vecindario.', '...', 'Bueno has an irregular comparative/superlative: mejor.'], ['Eres el mejor mamá de vecindario.', '...', 'Mamá is feminine: la mejor. And superlatives use "del" (de + el).']),
    t('Fill in: "Diana es ___ lista como Mariana." (as...as)', 'tan', 'as', 'tan ... como'),
    m('Erica', '¡Ay, gracias! Me emociona ser mamá otra vez <3 <3', 'Aw, thanks! I\'m so excited to be a mom again!'),
  ] },
  { id: 'alvaro1', buddy: 'alvaro', lesson: 'B2-L12', title: 'Mensajes en el examen', skill: 'Se accidental', steps: [
    m('Álvaro', 'Vecino... el profe me atrapó mandando mensajes durante el examen de literatura. ¡¡Estoy muerto!! :\'(', 'Neighbor... the professor caught me texting during the literature exam. I\'m dead!!'),
    m('Álvaro', 'Quiero decirle que fue un accidente. ¿Cómo lo digo?', 'I want to tell him it was an accident. How do I say it?'),
    c('Álvaro should say: "Professor, I forgot to turn off the phone." (unplanned)', 2, ['Profesor, se me olvidó apagar el celular.', 'Professor, I forgot...'], ['Profesor, se me olvidaron apagar el celular.', '...', 'The thing "forgotten" is "apagar" (singular), so olvidó.'], ['Profesor, se olvidé apagar el celular.', '...', 'You need me (to whom it happened) and the verb agrees with the thing: se me olvidó.']),
    m('Álvaro', 'Ok. Y mis apuntes... no sé dónde están.', 'Ok. And my notes... I don\'t know where they are.'),
    c('Álvaro: "I lost my notes." (unplanned)', 1, ['Se me perdieron los apuntes.', 'My notes got lost on me.'], ['Se me perdió los apuntes.', '...', 'Apuntes is plural, so the verb is plural: perdieron.'], ['Se perdieron me los apuntes.', '...', 'Word order: se + me + verb: se me perdieron.']),
    t('Type: "The phone fell (on me)." (se me + caer)', 'Se me cayó el celular / Se me cayó el teléfono', 'The phone fell on me.', 'se me + cayó (preterite 3rd sing.)'),
    m('Álvaro', 'Jajaja ok, ¡voy a decirle eso! Pero también quiero vender mi carro y comprar una moto. :-P', 'Hahaha ok, I\'ll tell him that! But I also want to sell my car and buy a motorcycle.'),
  ] },
  { id: 'jose1', buddy: 'jose', lesson: 'B2-L09', title: 'Interrogatorio de la cita', skill: 'Pretérito vs. imperfecto', role: 'Andrés', steps: [
    m('José', '¡Andrés! ¡Cuéntame todo! ¿Cómo fue la cita con Rosario? ;-)', 'Andrés! Tell me everything! How was the date with Rosario?'),
    c('Say: "I arrived at the restaurant at eight, but she was already there."', 0, ['Llegué al restaurante a las ocho, pero ella ya estaba allí.', 'I arrived...'], ['Llegaba al restaurante a las ocho, pero ella ya estuvo allí.', '...', 'Arrived (one event) = preterite llegué; "was there" (state) = imperfect estaba.'], ['Llegué al restaurante a las ocho, pero ella ya estuvo allí.', '...', 'A state in progress ("was already there") takes the imperfect: estaba.']),
    m('José', '¿Y cómo era ella?', 'And what was she like?'),
    c('Say: "She was tall, nice, and she talked on the phone with her cat."', 2, ['Era alta, simpática y hablaba con su gato por teléfono.', 'She was tall...'], ['Fue alta, simpática y habló con su gato por teléfono.', '...', 'Descriptions and habits in the past use the imperfect: era, hablaba.'], ['Es alta, simpática y hablaba con su gato por teléfono.', '...', 'Es is present; you are narrating the past: era.']),
    m('José', '¿¿Con su gato?? ¿Y qué pasó después?', 'With her cat?? And what happened next?'),
    c('Say: "While we were eating, her cat came into the restaurant."', 1, ['Mientras comíamos, su gato entró al restaurante.', 'While we were eating...'], ['Mientras comimos, su gato entraba al restaurante.', '...', 'Reversed: the ongoing action (comíamos) is imperfect; the interrupting one (entró) is preterite.'], ['Mientras comíamos, su gato entraba al restaurante.', '...', 'A sudden event interrupting the scene needs the preterite: entró.']),
    t('Type: "I left at ten." (salir, yo)', 'Salí a las diez', 'I left at ten.', 'Completed action → preterite of salir'),
    m('José', 'Andrés... el próximo mes te presento a mi prima. NO tiene gato. ¡Lo prometo! xD', 'Andrés... next month I\'ll introduce you to my cousin. She has NO cat. I promise!'),
  ] },
  { id: 'julia1', buddy: 'julia', lesson: 'B2-L07', title: 'La boda de Cancún', skill: 'Imperfecto y pretérito', steps: [
    m('Julia', '¿Sabes por qué no me caso otra vez? Mi boda en Cancún fue un desastre. Ciao Pietro... :-/', 'Do you know why I won\'t marry again? My wedding in Cancún was a disaster.'),
    m('Julia', 'Cuando llegamos al hotel, llovía y hacía mucho viento.', 'When we arrived at the hotel, it was raining and very windy.'),
    c('Say: "While the guests were eating, the storm began."', 0, ['Mientras los invitados comían, empezó la tormenta.', 'While the guests were eating...'], ['Mientras los invitados comieron, empezaba la tormenta.', '...', 'Ongoing action = imperfect (comían); the sudden start = preterite (empezó).'], ['Mientras los invitados comían, empezaba la tormenta.', '...', 'A single starting event = preterite: empezó.']),
    m('Julia', 'Veinte invitados se enfermaron por los camarones y diez perdieron el vuelo. Mi mamá lloraba y Pietro hablaba italiano con el DJ.', 'Twenty guests got sick from the shrimp and ten missed their flight. My mom was crying and Pietro was speaking Italian with the DJ.'),
    c('Say: "I was twenty-nine when I got married."', 2, ['Tenía veintinueve años cuando me casé.', 'I was twenty-nine...'], ['Tuve veintinueve años cuando me casé.', '...', 'Age in the past is a state: tenía (imperfect).'], ['Tenía veintinueve años cuando me casaba.', '...', 'The marriage was a single completed event: me casé.']),
    t('Type: "The wedding was in Cancún." (event location uses ser, past)', 'La boda fue en Cancún', 'The wedding was in Cancún.', 'events take ser: fue'),
    m('Julia', 'Exacto. Ahora quiero adoptar un niño. ¡Pero sin boda! ;-)', 'Exactly. Now I want to adopt a child. But no wedding!'),
  ] },
  { id: 'leonor1', buddy: 'leonor', lesson: 'B2-L28', title: 'Nadar por dos', skill: 'Subjuntivo de influencia', role: 'Gustavo', steps: [
    m('Leonor', 'Gustavo, mi doctor quiere que nade tres veces por semana. ¡Estoy de ocho meses y me duele la espalda! :-(', 'Gustavo, my doctor wants me to swim three times a week. I\'m eight months pregnant and my back hurts!'),
    c('Say: "I want you to rest and not carry heavy things."', 0, ['Quiero que descanses y que no cargues cosas pesadas.', 'I want you to rest...'], ['Quiero que descansas y que no cargas cosas pesadas.', '...', 'After "querer que" (influence), use the subjunctive: descanses, cargues.'], ['Quiero que descansar y que no cargar cosas pesadas.', '...', 'Conjugate the second verb in the subjunctive: descanses.']),
    m('Leonor', 'Gracias, amor. ¿Y tú qué prefieres para el sábado?', 'Thanks, love. And what do you prefer for Saturday?'),
    c('Say: "I prefer that we go together to the pool."', 2, ['Prefiero que vayamos juntos a la piscina.', 'I prefer that we go...'], ['Prefiero que vamos juntos a la piscina.', '...', 'Preferir que + subjunctive: vayamos (from ir).'], ['Prefiero que ir juntos a la piscina.', '...', 'After que you need a conjugated subjunctive: vayamos.']),
    m('Leonor', 'El doctor recomienda que yo flote mucho. ¡Y que no beba café!', 'The doctor recommends that I float a lot. And that I not drink coffee!'),
    t('Type: "I want you to rest." (tú)', 'Quiero que descanses', 'I want you to rest.', 'querer que + descansar (subj. tú) → -es'),
    m('Leonor', 'Jaja, eres un esposo perfecto. Voy a nadar. ¡Gustavo Jr. también nada! <3', 'Haha, you\'re a perfect husband. I\'m going to swim. Gustavo Jr. swims too!'),
  ] },
  { id: 'jimena1', buddy: 'jimena', lesson: 'B2-L03', title: 'Yoga, arte y lecturas', skill: 'Verbos como gustar', steps: [
    m('Jimena', 'Vivo a tres horas de casa y me encanta la independencia. Me encantan mis clases de escultura, pero me molestan las lecturas de literatura. :-P', 'I live three hours from home and I love independence. I love my sculpture classes, but the literature readings bother me.'),
    c('Say: "I like art classes too."', 1, ['A mí también me gustan las clases de arte.', 'I like art classes too.'], ['A mí también me gusta las clases de arte.', '...', 'Clases is plural: gustan.'], ['Yo también gusto las clases de arte.', '...', 'Gustar works backwards: the thing is the subject. Use me gustan.']),
    m('Jimena', 'Doy yoga los jueves. ¡Todos los estudiantes están locos por el yoga!', 'I teach yoga on Thursdays. All the students are crazy about yoga!'),
    c('Ask: "Do your classmates like yoga?"', 2, ['¿A tus compañeros les gusta el yoga?', 'Do your classmates like yoga?'], ['¿A tus compañeros les gustan el yoga?', '...', 'Yoga is singular: gusta.'], ['¿Tus compañeros gustan el yoga?', '...', 'You need a tus compañeros les gusta structure (a + le/les + gusta).']),
    t('Type: "I like literature."', 'Me gusta la literatura', 'I like literature.', 'me + gusta (singular) + la literatura'),
    m('Jimena', '¡Qué bueno! A mí me fascina escribir sobre arte. ¿Vienes a mi clase de yoga? <3 namasté', 'Great! I\'m fascinated by writing about art. Are you coming to my yoga class? namasté'),
  ] },
  { id: 'andres1', buddy: 'andres', lesson: 'B2-L27', title: 'Citas por Internet', skill: 'Subjuntivo con duda', steps: [
    m('Andrés', 'Estoy probando el amor en línea. Una mujer dice que es campeona de ajedrez y que habla cinco idiomas. :-/', 'I\'m trying online love. A woman says she\'s a chess champion and speaks five languages.'),
    c('Say: "I doubt that she speaks five languages."', 0, ['Dudo que hable cinco idiomas.', 'I doubt that she speaks five languages.'], ['Dudo que habla cinco idiomas.', '...', 'Doubt triggers the subjunctive: hable.'], ['Dudo que hablar cinco idiomas.', '...', 'Conjugate the verb in the subjunctive: hable.']),
    m('Andrés', 'Yo creo que es sincera. Dice que le gustan los biólogos.', 'I think she\'s sincere. She says she likes biologists.'),
    c('Say: "I don\'t believe she\'s sincere."', 1, ['No creo que sea sincera.', 'I don\'t believe she\'s sincere.'], ['No creo que es sincera.', '...', 'No creer que (doubt) → subjunctive: sea.'], ['No creo que será sincera.', '...', 'Future isn\'t used here. Use the subjunctive: sea.']),
    m('Andrés', 'Mira su foto: está con tres gatos. ¡Ay no!', 'Look at her photo: she\'s with three cats. Oh no!'),
    c('Say: "It\'s possible that she has more than three cats."', 2, ['Es posible que tenga más de tres gatos.', 'It\'s possible...'], ['Es posible que tiene más de tres gatos.', '...', 'Es posible que → subjunctive: tenga.'], ['Es posible que tener más de tres gatos.', '...', 'Conjugate: tenga.']),
    t('Type: "I doubt that she exists."', 'Dudo que exista', 'I doubt that she exists.', 'dudar que + existir (subjunctive)'),
    m('Andrés', 'Jajaja. Mejor le pido a José que me presente a alguien... pero sin gatos :-)', 'Hahaha. I\'d better ask José to introduce me to someone... but no cats.'),
  ] },
  { id: 'luis1', buddy: 'luis', lesson: 'B2-L15', title: 'Cartagena, el viaje', skill: 'El futuro', steps: [
    m('Luis', 'Buenas tardes. Agencia de Viajes Cortés. Su viaje a Cartagena está listo. :-)', 'Good afternoon. Cortés Travel Agency. Your trip to Cartagena is ready.'),
    m('Luis', 'Saldrán el sábado a las siete. Mi amigo Juan Manuel Ríos los esperará en el aeropuerto.', 'You will leave Saturday at seven. My friend Juan Manuel Ríos will wait for you at the airport.'),
    c('Ask: "At what time will WE arrive at the hotel?"', 1, ['¿A qué hora llegaremos al hotel?', 'At what time will we arrive?'], ['¿A qué hora llegaré al hotel?', '...', 'Llegaré = I will arrive. For "we" use llegaremos.'], ['¿A qué hora llegarán al hotel?', '...', 'Llegarán = they/you all. For "we": llegaremos.']),
    m('Luis', 'Llegarán a las doce. Hará calor, pero también lloverá un poco.', 'You will arrive at twelve. It will be hot, but it will also rain a little.'),
    c('Say: "I will bring an umbrella."', 0, ['Traeré un paraguas.', 'I will bring an umbrella.'], ['Traeró un paraguas.', '...', 'Future of traer: yo traeré (the é accent).'], ['Traigo un paraguas en la maleta.', '...', 'That\'s present tense: "I bring". Future: traeré.']),
    t('Type: "We will have a great trip." (tener, nosotros, future)', 'Tendremos un gran viaje / Tendremos un viaje excelente', 'We will have a great trip.', 'tener has an irregular future stem: tendr-'),
    m('Luis', '¡Perfecto! Que tengan un viaje fantástico. ¡Le dirán hola a Juan Manuel de mi parte! ;-)', 'Perfect! Have a fantastic trip. You\'ll say hi to Juan Manuel for me!'),
  ] },
];
