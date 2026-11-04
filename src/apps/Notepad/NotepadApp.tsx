import { openApp } from '../../os/wm';
import type { AppId } from '../../config/apps';

const L = ({ a, children }: { a: AppId; children: string }) => <a href="#" className="text-[#0000ee] underline" onClick={(e) => { e.preventDefault(); openApp(a); }}>{children}</a>;

export default function NotepadApp() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-3 px-2 text-[12px] py-[2px]"><u>A</u>rchivo <u>E</u>dición <u>B</u>uscar <u>A</u>yuda</div>
      <div className="inset flex-1 overflow-auto p-3 mono text-[13px] leading-relaxed select-text">
{`¡BIENVENIDO A VILLA CELESTE OS '98!
====================================

Acabas de conectarte a la intranet del vecindario Villa Celeste.
Cinco familias viven aquí... y todas tienen secretos.
Aprende español para descubrirlos.

CÓMO JUGAR
----------
1. `}<L a="palabras">Palabras.exe</L>{`  → ¡Empieza aquí! Juego de vocabulario:
   cada lección tiene niveles de 8 palabras. Gana estrellas ★
   para abrir la lección siguiente.

   `}<L a="academia">Academia.exe</L>{`  → el libro completo, las 60 lecciones,
   abiertas desde el principio: vocabulario con audio, gramática
   y ejercicios con corrección. Cada acierto = +XP (A1 → B2).

2. `}<L a="glosario">Glosario98.hlp</L>{` → Diccionario + tarjetas SRS (SM-2).
   Marca palabras con ★ en cualquier parte y repásalas aquí.

3. Apps del vecindario:
   `}<L a="chismenet">ChismeNet</L>{`   chismes por mensajería instantánea
   `}<L a="correo">Correo</L>{`      el correo electrónico del barrio
   `}<L a="telenovela">LaOvejaNegra</L>{` la telenovela favorita de Cecilia
   `}<L a="cupido">Cupido</L>{`      citas de Andrés y casas para Alberto
   `}<L a="conjugator">Conjugator</L>{`  arcade de verbos
   `}<L a="detective">Detective</L>{`   mapa y expedientes de los vecinos
   `}<L a="fonetica">Fonética</L>{`    graba tu voz y practica

TRUCOS
------
* DOBLE CLIC en cualquier palabra española → traducción + audio.
* Botón 🔊 = escuchar. Clic derecho en 🔊 = lento (0.75x).
* ❖ Inicio → Libro 1/2 → salta directo a cualquier lección.
* `}<L a="control">Panel de Control</L>{` → temas, CRT, guardar/cargar partida,
  y "Desbloquear todo" para explorar sin restricciones.

Tu progreso se guarda automáticamente en este navegador.

¡Buena suerte, vecino!
                                    -- La Asociación de Vecinos`}
      </div>
    </div>
  );
}
