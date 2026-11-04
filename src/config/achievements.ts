/** Central achievement registry. Apps call useStore.getState().unlock(id). */
export const ACHIEVEMENTS: Record<string, { name: string; desc: string; icon: string }> = {
  vecino: { name: 'Vecino Nuevo', desc: 'Completa tu primera lección (80%).', icon: '🏠' },
  fiesta: { name: 'Sobreviviente de la Fiesta de Felipe', desc: 'Completa B1-L06 (estar y la casa desordenada).', icon: '🎉' },
  libro1: { name: 'Graduado de Villa Celeste', desc: 'Completa las 30 lecciones del Libro 1.', icon: '🎓' },
  libro2: { name: 'Más Allá de Villa Celeste', desc: 'Completa las 30 lecciones del Libro 2.', icon: '🌎' },
  subjuntivo: { name: 'Maestro del Subjuntivo', desc: 'Completa una lección del subjuntivo.', icon: '🧙' },
  oveja: { name: 'Fanático de La Oveja Negra', desc: 'Mira 3 episodios de la telenovela.', icon: '🐑' },
  casamentero: { name: 'Casamentero de Andrés', desc: 'Consigue una buena cita para Andrés.', icon: '💘' },
  alberto: { name: 'Agente Inmobiliario', desc: 'Encuentra una casa sin alfombras para Alberto.', icon: '🏡' },
  chismoso: { name: 'Chismoso Profesional', desc: 'Completa 5 conversaciones en ChismeNet.', icon: '💬' },
  cartero: { name: 'Cartero del Barrio', desc: 'Responde 10 correos correctamente.', icon: '📬' },
  arcade: { name: 'Rey del Arcade', desc: 'Consigue 200 puntos en Conjugator 2000.', icon: '👾' },
  detective: { name: 'Detective del Vecindario', desc: 'Abre 10 expedientes en Detective.exe.', icon: '🕵️' },
  voz: { name: 'Voz de Oro', desc: 'Pronuncia bien 10 frases en Fonética.', icon: '🎙️' },
  srs: { name: 'Memoria de Elefante', desc: 'Repasa 50 tarjetas SRS.', icon: '🐘' },
  nivel: { name: 'Sube de Nivel', desc: 'Alcanza el nivel A2.', icon: '⭐' },
};
