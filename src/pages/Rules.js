import React, { useEffect, useRef, useState } from 'react';
import Card from '../components/Card';
import './Rules.css';

const Rules = () => {
  const contentRef = useRef(null);
  const [index, setIndex] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector(`a[href="#${id}"]`);
          if (link) {
            if (entry.intersectionRatio > 0) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    const elements = contentRef.current.querySelectorAll('h1, h2, h3, h4');
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  useEffect(() => {
    const elements = contentRef.current.querySelectorAll('h1, h2, h3, h4');
    const numbering = { h1: 0, h2: 0, h3: 0, h4: 0 };

    const newIndex = Array.from(elements).map((element) => {
      const level = parseInt(element.tagName.substring(1), 10);
      numbering[`h${level}`] += 1;

      for (let i = level + 1; i <= 4; i++) {
        numbering[`h${i}`] = 0;
      }

      const number = Object.values(numbering)
        .slice(0, level)
        .filter((n) => n > 0)
        .join('.');

      // Check if the text content already has a number prefix
      if (!/^\d/.test(element.textContent)) {
        element.textContent = `${number} ${element.textContent}`;
      }

      return {
        id: element.id,
        text: element.textContent,
        level,
      };
    });
    setIndex(newIndex);
  }, []);

  return (
    <div className="rules-page">
      <nav className="rules-index">
        <ul>
          {index.map((item) => (
            <li key={item.id} className={`level-${item.level}`}>
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="rules-content" ref={contentRef}>
        <h1 id="Introducción a Humankind">Introducción a Humankind</h1>
        <h2 id="La lucha por el futuro de la Humanidad">La lucha por el futuro de la Humanidad</h2>
        <p>
          Te damos la bienvenida al universo de Humankind, un juego de cartas coleccionables que habita
          el género de la ciencia ficción y como esta va en busca de preguntas profundas de la humanidad,
          recorriendo los caminos de la tecnología, las ciencias y la filosofía.
        </p>
        <p>
          La trama general nos lleva a nuestro conocido siglo XXI en el que cuatro poderosas Facciones,
          conocidas como Quimera, Abismales, Corporación y Acracia están inmersas en un conflicto
          mundial oculto a los ojos de la humanidad.
        </p>
        <p>
          En este contexto tomas el rol de un Desviante, un individuo que dio un salto en la cadena
          evolutiva, y junto a otras y otros Desviantes, controlas un Santuario que debes defender frente a
          los ataques de las otras Facciones. Toma parte de esta lucha global junto a tu Facción para
          ganarte el derecho de guiar a la humanidad en el siguiente paso en su evolución.
        </p>
        <p>
          A través de estrategias únicas de cada Facción, y que las eleva por sobre las otras, lucharás en
          el conflictivo mundo de Humankind con el objetivo de imponer los ideales y la supremacía de tu
          Facción favorita.
        </p>
        <p>
          La principal característica de los juegos de cartas coleccionables es que cada partida es distinta,
          nunca jugarás dos veces el mismo juego. Diseñas y construyes tus propios mazos de un universo
          de cartas publicadas en diferentes ediciones. Cada año se lanzan nuevas ediciones y
          extensiones, con nuevas cartas y poderosas estrategias para derrotar a tus oponentes.
        </p>

        <h2 id="Las Facciones">Las Facciones</h2>
        <p>
          Quimera: es verdad que la luz de Quimera es joven, pero tiene un compromiso irrevocable con el
          futuro de la humanidad. Quimera es la Facción pacifista por excelencia, posee una visión en la
          cual las personas normales pueden convivir pacíficamente con los Desviantes. La paz es su
          meta, pero cuando suenan los tambores de guerra, los guerreros de la Quimera responden.
        </p>
        <p>
          Abismales: la sombra es antigua, es fuerte y es la única verdad. El mundo está hecho de mentiras
          que debemos derribar. Así piensan los miembros de Abismales, Bestias Desviantes que abrazan
          el Caos y la Entropía como sus maestros. Son seres de naturaleza bestial, que confían en los
          instintos y en abrumar a sus adversarios. La época de la gran oscuridad está cerca.
        </p>
        <p>
          Corporación: orden y fuerza son garantías de paz y desarrollo, el futuro se construye sobre estos
          fuertes pilares. No existe futuro sin Orden y Control, o al menos así piensan los miembros de
          esta Facción. Lo que está en juego no es ni más ni menos que el futuro mismo y quien se les
          interponga tendrá que ser aplastado.
        </p>
        <p>
          Acracia: la rebeldía es obligatoria frente a la injusticia. La Acracia cree en el fuego ardiente de la
          libertad, que es un regalo y, por sobre todo, una bandera de lucha para estos renegados. En las
          calles están los verdaderos héroes, quienes conocen el sufrimiento y encienden los sueños de
          libertad. Hay un fuego quemando ciudades, pueblos y santuarios, pero nada arde más que ellos.
        </p>
        <h1 id="Bases del Juego">Bases del Juego</h1>
        <h2 id="Objetivo del Juego">Objetivo del Juego</h2>
        <p>
          Las partidas de Humankind se denominan Conflictos, en ellos tomas el control de una Facción que
          protege un Santuario y busca destruir el Santuario oponente reduciendo sus Puntos de Estructura
          a 0 a través de sus Personajes, Tecnologías, Aditamentos y Manipulaciones.
        </p>
        <h2 id="Partes de una carta">Partes de una carta</h2>
        <p>Cada carta de Humankind posee las siguientes características:</p>
        <ol>
          <li>
            Nombre: se ubica verticalmente a la izquierda de cada carta. Cuando el nombre de una carta
            aparezca en su Texto de Juego se refiere específicamente a esa carta, no a otras cartas o copias
            con el mismo nombre.
          </li>
          <li>
            Ícono de Facción: indica a qué Facción pertenece cada carta (Quimera, Abismales, Corporación o
            Acracia). Algunas cartas no tienen Ícono de Facción. Las cartas que incluyes en tu Mazo deben
            compartir la Facción de tu Santuario o no poseer una.
          </li>
          <li>
            Tipo de Carta: indica si es un Santuario, Personaje, Aditamento, Manipulación o Tecnología.
          </li>
          <li>
            Caja de Texto: contiene los siguientes elementos:
            <ul>
              <li>El Epígrafe es una frase que da una pequeña caracterización de la carta.</li>
              <li>El Ilustrador identifica al dibujante que creó el arte de la carta.</li>
              <li>
                El Número de Coleccionista es un identificador que indica Edición, Número en la Edición y
                Rareza de la Carta en cuestión.
              </li>
              <li>
                El Texto de Juego (Sección 3.5) es donde se encuentra la Condición, Dones, Efecto, Habilidades y
                Restricción de una carta.
              </li>
            </ul>
          </li>
          Además de los elementos en común anteriormente mencionados, existen otros elementos
particulares que pertenecen a cada uno de los cinco tipos de cartas en Humankind.
        </ol>
        <h3 id="El Santuario">El Santuario</h3>
        <p>Es la base de operaciones que debes proteger durante un Conflicto.</p>
        <ol>
            <li>Límite de Aditamentos Permitidos: indica la cantidad máxima de Aditamentos que pueden estar en juego en tu Zona de Reserva. Está representado por el número en el círculo gris.</li>
            <li>Puntos de Estructura: indica la Estructura inicial de tu Santuario. Si los Puntos de Estructura de tu Santuario se reducen a 0 o menos, pierdes la partida. Están representados por el número en el círculo rojo.</li>
            <li>Puntos de Voluntad: indica cuántos Puntos de Voluntad entrega ese Santuario en la Fase de Comunión, la Voluntad se usa para jugar tus cartas. Están representados por el número en el círculo azul.</li>
        </ol>
        <h3 id="Aditamento">Aditamento</h3>
        <p>Los Aditamentos se pueden entender como extensiones de tu Santuario y se juegan a su
derecha, en tu Zona de Reserva. Solo puedes jugar uno en cada uno de tus turnos, ocupando
un espacio en el Límite de Aditamentos Permitidos por tu Santuario. En tu Cosecha de Voluntad,
si juegas un Aditamento, este debe ser el primer permanente (Sección 5) que pongas en juego.
Si tu Santuario ya alcanzó el Límite de Aditamentos Permitidos, no puedes jugar otro Aditamento.</p>
        <ol>
            <li>Coste de Voluntad: indica la cantidad de Voluntad que debes pagar para jugar esa
carta. Está representado por el número en el círculo amarillo.</li>
            <li>Puntos de Estructura: indica la Estructura que agrega a tu Santuario al momento de
ponerse en juego. Si el Aditamento sale del juego, tu Santuario no pierde la Estructura
añadida por este. Están representados por el número en el círculo rojo.</li>
            <li>Puntos de Voluntad: indica cuántos Puntos de Voluntad agrega al entrar en juego y
en tu Fase de Comunión. Están representados por el número en el círculo azul.</li>
        </ol>
        <h3 id="Personaje">Personaje</h3>
<p>Son tu fuerza ofensiva y defensiva en el Conflicto, la caballería mediante la que
enfrentas a tu oponente de forma directa. Se juegan frente a tu Santuario en la Zona
de Conflicto.</p>

<ol>
    <li>Coste de Voluntad: indica la cantidad de Voluntad que debes pagar para jugar esa
carta. Está representado por el número en el círculo amarillo.</li>
<li>Fuerza: indica la cantidad de Daño de Combate que puede hacer a otros Personajes,
el Daño a Santuario que puede infligir y cuánto Daño puede resistir antes de ser
destruido. Está representada por el número en el círculo verde.</li>
<li>Subtipo: los Personajes pueden tener un Subtipo, especificado junto a su tipo de
carta luego de un guion que separa ambos atributos.</li>
</ol>
<h4 id="Reglamento de Subtipos de Personajes">Reglamento de Subtipos de Personajes:</h4>
<ul>
    <li>Los Subtipos que existen son aquellos que tienen los Personajes de las ediciones Colosos
en adelante.</li>
    <li>Los Personajes de las ediciones anteriores (Evolución, Desviantes, Suburbia, Selección
Humankind y las cartas Promocionales de 2020) que incluyan en su nombre las Palabras
Exactas del nombre de un Subtipo de Personajes existente, son considerados de ese
Subtipo.</li>
    <li>Los Subtipos existentes que aparecen en cartas que pertenecen al conjunto de cartas
indicado en el punto anterior son: Agente Libre, Hawkline, Moloch, Baalita, Custodio, Yue
Yan, Tai ku y Oni.</li>
</ul>
<h3 id="Tecnología">Tecnología</h3>
<p>Las Tecnologías son objetos que pueden ser cargados por los Personajes, y que
pueden modificar sus atributos. Las Tecnologías se juegan detrás de un Personaje,
quedando su nombre y Facción (si tiene) visibles.</p>
<p>Un Personaje solo puede cargar una Tecnología a la vez y esta debe compartir su
Facción o no tener Facción.</p>
<p>Coste de Voluntad: es la cantidad de Voluntad que debes pagar para poder jugar esa carta.
Está representado por el número en el círculo amarillo.</p>
<h4 id="Reglamento de Tecnologías">Reglamento de Tecnologías:</h4>
<ul>
    <li>Reglamento de Tecnologías: - Una Tecnología con Facción solo puede ser cargada por Personajes que compartan su
Facción.</li>
    <li>Si el cargador de una Tecnología con Facción deja de compartir su Facción, la Tecnología
es destruida.</li>
    <li>Las Tecnologías sin Facción pueden ser cargadas por cualquier Personaje.</li>
    <li>Si el cargador de una Tecnología es destruido, la Tecnología es destruida.</li>
    <li>Si el cargador de una Tecnología es barajado, la Tecnología es barajada en el Mazo de su
Dueño.</li>
    <li>Si el cargador de una Tecnología es enviado a la Mano de su Dueño, la Tecnología es
enviada a la Mano de su Dueño.</li>
    <li>La modificación de atributos aplicada sobre el cargador de una Tecnología por el Efecto de
una Habilidad que indique que actúa sobre su cargador, se neutraliza si el Personaje deja
de cargarla, independiente del tipo de Habilidad que haya modificado sus atributos.</li>
</ul>
    <h3 id="Manipulación">Manipulación</h3>
    <p>Las Manipulaciones son alteraciones de la realidad que permitirán modificar las
condiciones del juego a tu favor. Son el único tipo de carta que es no permanente, esto
quiere decir que al jugarse no van al campo de juego, sino que van directamente al Limbo
(Sección 2.3). Además, son el único tipo de carta que puede ser jugada fuera de tu
Cosecha de Voluntad (Sección 3.3) e inclusive en turno oponente.</p>
<p>Coste de Voluntad: indica la cantidad de Voluntad que debes pagar para jugar esa carta.
Está representado por el número en el círculo amarillo.</p>
<h3 id="Colosos">Colosos</h3>
<p>Los Colosos son seres de Voluntad que los Desviantes intentan despertar para poder
aprovechar su inmenso poder. Se juegan junto a tu Santuario Dormidos y puedes
despertarlos para que se conviertan en Personajes y utilicen sus Efectos para inclinar la
balanza del juego a tu favor. Una carta de Coloso tiene dos atributos impresos:</p>
<ol>
    <li>Fuerza: indica la Fuerza que tiene cuando está Despierto, representada por el número
en el círculo verde. Este atributo indica la cantidad de Daño de Combate que puede
hacer a otros Personajes, el Daño a Santuario que puede infligir y cuánto Daño puede
resistir antes de ser destruido.</li>
<li>Coste de Reanimación: indica la cantidad de Puntos de Reanimación que debe
acumular el Coloso para poder Despertar, representado por el número en el círculo
púrpura.</li>
</ol>
<p>Asimismo, el Texto de Juego de un Coloso se subdivide por tres palabras clave:</p>
<ol>
    <li>Reanimar: es una Condición que, al cumplirse por primera vez en un turno, coloca un
Punto de Reanimación en el Coloso. Esta acción de juego es automática y obligatoria.
Solo puedes poner un Punto de Reanimación por turno.</li>
<li>Despertar: es un Efecto disparado que se envía a la Pila cuando su controlador
Despierta al Coloso.</li>
<li>Despierto: el Texto de Juego de un Coloso Despierto.</li>
</ol>
<h4 id="Cómo se juegan los Colosos">Cómo se juegan los Colosos</h4>
<ul>
    <li>Al comienzo de un Conflicto, luego de que tú y tu oponente revelen el Santuario y roben las
cartas de la Mano hasta quedar satisfechos (tras ninguno, uno o más Mulligan), puedes
buscar un Coloso en tu Mazo, revelarlo y ponerlo en juego Dormido a la derecha de tu
Santuario. Si lo hiciste, envía una carta de tu Mano al Mazo y barájalo.</li>
    <li>Para jugar un Coloso que esté en tu Mano, en tu Cosecha de Voluntad, revélalo y ponlo en
juego Dormido a la derecha de tu Santuario y a la izquierda de tus Aditamentos. Los Colosos
no tienen Coste de Voluntad, por lo que no necesitas pagar Voluntad para jugarlos.</li>
    <li>Despertar un Coloso: en tu Cosecha de Voluntad, si tienes un Coloso en juego con Puntos
de Reanimación iguales o superiores a su Coste de Reanimación, tienes la Prioridad y no
hay una Pila de Efectos activa, puedes Despertarlo. Si lo haces, pasa a la Zona de Conflicto,
se considera Personaje (sin dejar de ser Coloso). Envía su Efecto de Despertar a la Pila y
tu oponente tiene una Acción y la Prioridad.</li>
</ul>
<h4 id="Reglamento de los Colosos">Reglamento de los Colosos:</h4>
<ul>
    <li>Un Coloso en juego no puede ser afectado por Efectos de Aditamentos ni Santuarios, a
menos que se refieran directamente al tipo de carta Coloso.</li>
    <li>Un Coloso en Zona de Conflicto se considera Coloso y Personaje.</li>
    <li>Los Colosos no tienen Coste de Voluntad y no son afectados por Efectos que hagan
referencia al Coste de Voluntad de las cartas.</li>
    <li>Un Coloso en Zona de Conflicto considera todo lo que está escrito después de la palabra
Despierto como su Texto de Juego.</li>
<li>Solo puedes tener un Coloso en juego, independiente de si este está Dormido o Despierto.</li>
<li>Si un Efecto fuese a poner un Coloso en tu Territorio y ya tienes un Coloso en juego, ese
Efecto se evita.</li>
<li>Para contar los Puntos de Reanimación sobre un Coloso debe usarse un Dado o un método
que sea visualmente claro para ambos jugadores.</li>
<li>Un Coloso Dormido no tiene límite de Puntos de Reanimación.</li>
<li>Un Coloso Despierto no tiene ni puede tener Puntos de Reanimación.</li>
<li>El turno en que un Coloso Despierta se considera que entra en juego como Personaje (no
es jugado ni puesto en juego).</li>
</ul>
<h3 id="Fichas">Fichas</h3>
<p>Las Fichas son cartas que no se incluyen en la construcción de tu Mazo y son creadas
por Efectos.</p>
<h4 id="Reglamento de las Fichas">Reglamento de las Fichas:</h4>
<ul>
    <li>No puedes controlar más de cuatro Fichas. - Si un Efecto fuese a crear una Ficha cuando ya controlas el límite de Fichas, no se crea
dicha Ficha.</li>
    <li>Si una Ficha sale del juego, se considera que es enviada a la Zona correspondiente y es
eliminada inmediatamente de todas tus Zonas de Juego.</li>
    <li>Todas las Fichas tienen Coste 0.</li>
    <li>Los Efectos que crean Fichas indican los atributos de la Ficha creada.</li>
    <li>Cuando creas una Ficha, esta entra en juego (no es jugada ni puesta en juego).</li>
    <li>Las Fichas de Personaje se consideran Fichas y Personajes. </li>
    <li>Si no tienes las fichas oficiales puedes usar cualquier elemento que cuente con
dimensiones similares a una carta de Humankind. Debe poder demostrar claramente
cuando está Enderezada o Girada.</li>
    <li>Para representar Fichas no puedes utilizar cartas de Humankind que puedan inducir al error
a alguno de los jugadores. - Todos los elementos utilizados para representar una Ficha del mismo nombre deben ser
idénticos entre sí.</li>
</ul>
<h2 id="Zona de juego">Zona de juego</h2>
<p>Las Zonas de Juego son lugares dentro del Territorio. Cada tipo de carta tiene una zona
específica donde ubicarla luego de ser jugada.</p>
<p>Las Zonas de Juego son las siguientes:</p>
<ol>
    <li>Punto Cero: es la zona donde ubicas tu Santuario, a la derecha de tu Mazo. Esta carta
no es parte de tu Mazo y no puede salir del juego.</li>
    <li>Mazo: es el lugar donde ubicas tu Mazo. Esta es una zona cerrada y ningún jugador puede
acceder a ella a menos que un Efecto lo indique.</li>
    <li>Mano: es el lugar donde pones las cartas que robas. Nadie salvo tú puede mirar las cartas
en tu Mano. El límite de cartas permitido en Mano al final de cada turno es 8.</li>
    <li>Zona de Reserva: está ubicada a la derecha de tu Santuario, y es donde ubicas los
Aditamentos. Estos se ponen en orden correlativo de izquierda a derecha y deben mantener
ese orden mientras estén en juego.</li>
    <li>Zona de Conflicto: se ubica frente al Punto Cero y la Zona de Reserva, y es donde
ubicas tus Personajes.</li>
    <li>Limbo: se ubica a la izquierda de tu Mazo, y es donde van todas las cartas que son
destruidas, descartadas o Manipulaciones que son jugadas. Esta zona es visible para todos
los jugadores.</li>
    <li>Pila de Virtud de Facción: en este lugar están ubicadas las cinco cartas de Facción que
conforman las Virtudes de Facción. Ubica tus Virtudes de Facción frente a tu Mazo.</li>
    <li>Pila de Virtud Numérica: en este lugar están ubicadas las cinco cartas de número que
conforman las Virtudes Numéricas. Ubica tus Virtudes Numéricas frente a tu Limbo.</li>
    <li>Territorio: está conformado por tu Punto Cero, tu Zona de Reserva y tu Zona de
Conflicto. Todas las cartas que se encuentran en tu Territorio son cartas que controlas y se
considera que están “en juego”.</li>
</ol>
<h1 id="Jugar">Jugar</h1>
<p>Para iniciar una partida requieres lo siguiente:</p>
<ul>
    <li>Un Santuario.</li>
    <li>Un Mazo de cartas.</li>
    <li>Un set de Pilas de Virtud de Facción.</li>
    <li>Un set de Pilas de Virtud Numéricas.</li>
    <li>Otro jugador con los mismos elementos.</li>
</ul>
<p>El objetivo del juego es reducir los Puntos de Estructura del Santuario oponente a 0, y evitar que
tu oponente cumpla el mismo objetivo con tu propio Santuario.</p>
<h2 id="Construcción del Mazo">Construcción del Mazo</h2>
<ol>
    <li>Tu Mazo debe estar compuesto exactamente de 60 cartas.</li>
    <li>Tu Santuario no se considera parte del Mazo, es decir, se juega con 60 cartas + 1
Santuario.</li>
    <li>Las cartas de tu Mazo deben compartir la misma Facción de tu Santuario o no tener
Facción (para otros formatos de juego, ver Sección 4.1).</li>
    <li>Puedes incluir hasta 4 cartas con el mismo nombre en tu Mazo (aunque debes considerar
las reglas de restricciones, ver Sección 3.5.4).</li>
    <li>Hay cartas que poseen una Restricción escrita en su Texto de Juego. Es el número
máximo de cartas con el mismo nombre que puedes incluir en tu Mazo.</li>
</ol>
<h3 id="Pilas de Virtud">Pilas de Virtud</h3>
<p>Además de tu Mazo y Santuario, para jugar Humankind requieres de dos “Pilas de Virtud”.
Cada una de las pilas está conformada por 5 cartas. En el caso de las Virtudes de
Facción, debes tener una que represente a cada Facción (Quimera, Acracia, Corporación
y Abismales) y una quinta carta que represente “ninguna facción”. Por otro lado, las
Virtudes Numéricas deben incluir los números en orden ascendente -2, -1, 0, +1 y +2.</p>
<p>La Pila de Virtud de Facción se ubica frente a tu Mazo y la Numérica frente a tu Limbo
(Sección 2.3). Cada vez que quieras usar una Habilidad de Virtud, debes voltear la carta
superior de la pila correspondiente.</p>
<p>Por ejemplo, para usar la Habilidad de la carta
Despojador que dice [Virtud][Abismales]: El
Personaje objetivo pierde su Facción y se
considera [Abismales] hasta la Contemplación.,
debo voltear la primera carta de mi Pila de Virtud
de Facción. Si obtengo [Abismales], la Habilidad
se activa y su Efecto se envía a la Pila de
Efectos. De lo contrario, no envía su Efecto a la
Pila.</p>
<p>En cualquier caso, la carta de tu Pila de Virtud
queda volteada y la próxima vez que quieras
usar una Habilidad de Virtud tendrás más
posibilidades de éxito.</p>
<p>Si bien las Virtudes de Facción suelen tener solo
un resultado deseado, en una Habilidad que
utilice Virtudes Numéricas, como la Habilidad de
la carta Maximiliano Fox: [Virtud][+]: En tu
Cosecha de Voluntad, roba X cartas, tanto el +1
como el +2 de tu Pila de Virtud Numérica se
consideran casos exitosos y reemplazarán a la X
en la Habilidad.</p>
<p>La Pila de Virtud de Facción se utiliza también para Evitar Duelos. Si retan a Duelo a uno
de tus Personajes, puedes voltear la carta superior de tu Pila de Virtud de Facción. Si la
Facción coincide con la Facción de tu Personaje, el Duelo es evitado.</p>
<p>Los jugadores pueden decidir barajar sus Pilas de Virtud en cualquier momento del juego
antes de utilizar una Habilidad que lo requiera o de intentar Evitar un Duelo.</p>
<h4 id="Pilas de Virtud válidas">Pilas de Virtud válidas</h4>
<ul>
    <li>Virtudes de Facción: 4 cartas que representen con claridad, mediante su color, las
4 Facciones y 1 carta que represente ninguna facción.</li>
<li>Virtudes Numéricas: 5 cartas que representen las cifras -2, -1, 0, +1 y +2.</li>
</ul>
<h3 id="El Banquillo">El Banquillo</h3>
<p>El Banquillo es un mazo de cartas de apoyo que puedes utilizar después de cada Conflicto
(Sección 4.2). Te permite intercambiar cartas entre tu Mazo y tu Banquillo.</p>
<ol>
    <li>Un Banquillo puede estar compuesto de 15 cartas sin Santuario o 10 cartas y 1 Santuario.
Puedes elegir cuál de las dos opciones de Banquillo utilizarás.</li>
    <li>Las cartas de tu Banquillo deben tener la misma Facción de tu Santuario o ninguna facción
(para otros formatos de juego, ver Sección 4.1).</li>
    <li>Puedes incluir hasta 4 cartas con el mismo nombre en tu Banquillo. Se consideran cartas
con el mismo nombre aquellas que comparten nombre idéntico, aunque sean de distintas
ediciones.</li>
    <li>Al intercambiar cartas de tu Mazo con tu Banquillo, este debe seguir respetando la regla
de cantidad de cartas con el mismo nombre permitidas. Tu Banquillo puede contener más
de 4 cartas con el mismo nombre.
<p>Ejemplo: puedes usar un Mazo con 4 cartas de “Minerva de Evolución” y un
Banquillo con 4 cartas de “Minerva de Suburbia”. Luego del primer Conflicto,
podrías incluir 2 “Minerva de Suburbia” al Mazo y otras dos cartas cualquiera
sacando las 4 “Minerva de Evolución”. Al hacerlo, tu Banquillo terminaría
conteniendo 6 cartas de nombre “Minerva”, pero tu Mazo seguirá respetando la
cantidad de cartas con el mismo nombre permitidas.</p>
</li>
</ol>
<h2 id="Preparando el Conflicto">Preparando el Conflicto</h2>
<ol>
    <li>Cada jugador ubica su Santuario en el Punto Cero.</li>
    <li>Cada jugador baraja su propio Mazo y lo presenta al oponente. Luego el oponente puede
alzar o barajar dicho Mazo para devolverlo a su Dueño. En caso de que el oponente
decida barajar, al recibir de vuelta el Mazo propio debe ser alzado. Cuando un Mazo es
alzado no puede volver a ser manipulado y debe ser puesto en la Zona de Mazo
inmediatamente.</li>
    <li>Cada jugador baraja sus Pilas de Virtud siguiendo los mismos pasos que para barajar el
Mazo, luego las pone en su Zona de Pilas de Virtud.</li>
    <li>Se elige mediante un método aleatorio (como un lanzamiento de dado o moneda)
acordado por los jugadores quién jugará primero en el Conflicto. El jugador que gana el
método aleatorio, decide quién comienza.</li>
    <li>Si un jugador quiere comenzar el Conflicto con un Coloso en juego, en este Paso debe
anunciarlo, buscarlo en su Mazo, revelarlo y ponerlo en juego.</li>
    <li>Cada jugador roba cartas de su Mazo hasta alcanzar el número máximo de cartas en
Mano. (Usualmente 8).</li>
    <li>Si no se está conforme con la Mano inicial, esta puede barajarse en el Mazo y robar una
nueva Mano con la misma cantidad de cartas. Se puede repetir esta acción tantas veces
como se desee. Una vez se decida mantener la última Mano robada, se debe barajar X
cartas de la Mano en el Mazo, donde X es igual al número de veces que se hizo esta
acción de juego. A esta acción se le conoce como Mulligan.</li>
    <li>Para hacer Mulligan, el jugador que tomará su turno primero debe anunciar la acción. Si
su oponente también decide hacer Mulligan, ambos jugadores lo hacen simultáneamente.
En caso de que un jugador decida hacer Mulligan y el otro no, quien decidió conservar su
Mano no puede hacer Mulligan otra vez aun cuando el otro jugador lo haga repetidas
veces.</li>
    <li>Comienza la partida.</li>
    <li>Después de cada Conflicto, el jugador que perdió decide quién jugará primero en el
próximo.</li>
    <li>Después de cada Conflicto, cada jugador puede intercambiar cartas entre su Mazo y su
Banquillo.</li>
</ol>
<h2 id="Fases del turno">Fases del turno</h2>
<ul>
    <li>Cada turno consta de 5 Fases: Comunión, Cosecha de Voluntad, Duelo, Batalla y
Contemplación.</li>
    <li>En cada una de las Fases, Pasos y Subfases del turno el jugador activo comienza con la
Prioridad y debe entregar la Prioridad al menos una vez antes de pasar a la siguiente Fase,
Paso o Subfase. Este punto no aplica para la Cosecha de Voluntad.</li>
    <li>Si el jugador pasivo no tiene Acciones y obtiene la Prioridad, entrega la Prioridad
inmediatamente y de forma automática.</li>
<li>Cuando estás en tu turno, eres considerado el jugador activo y tu oponente el jugador
pasivo, al final de cada turno, estos roles se intercambian.</li>
<li>Para jugar Manipulaciones o activar Habilidades, el jugador pasivo debe tener al menos
una Acción (Sección 3.6.1).</li>
</ul>
<h3 id="Comunión">Comunión</h3>
<p>Los Pasos de la Comunión ocurren en orden correlativo y son automáticos, es decir, no
puedes decidir saltar un Paso de esta Fase. Durante la Comunión solo se puede abrir
una Pila de Efectos con Habilidades o Manipulaciones que indiquen que se pueden usar
en Comunión o en uno de sus Pasos.</p>
<ol>
    <li>Paso de Voluntad: el jugador activo agrega Voluntad igual al total de Puntos de
Voluntad entregados por su Santuario y Aditamentos que controla.</li>
    <li>Paso de Enderezar: el jugador activo endereza todas las cartas giradas que
controle.</li>
    <li>Paso de Robar: el jugador activo roba una carta.
        <ul>
            <li>El primer turno del juego, el jugador activo no roba carta.</li>
        </ul>
    </li>
</ol>
<h3 id="Cosecha de Voluntad">Cosecha de Voluntad</h3>
      </div>
    </div>
  );
};

export default Rules;
