import type { Postcard, Review } from './types'

const postcards: Postcard[] = [
  {
    author: 'Celestia',
    network: 'inst',
    url: '/postcards/09.jpg',
    orientation: 'ver',
    name: { es: 'Agua maravillosa', en: 'Awesome nice water', fr: 'Une eau merveilleuse' },
    info: {
      es: 'Sumérgete en el azul infinito del mar abierto, donde cada ola susurra historias de costas lejanas. Esta postal transmite la serena fuerza del agua y aporta un soplo de aire fresco del océano.',
      en: 'Dive into the endless blue of the open sea, where every wave whispers a story of distant shores. This postcard captures the calm power of water and brings a breath of fresh ocean air to anyone who receives it.',
      fr: "Plongez dans le bleu infini de la mer ouverte, où chaque vague murmure l'histoire de rivages lointains. Cette carte capture la puissance apaisante de l'eau et apporte un souffle d'air marin à qui la reçoit."
    }
  },
  {
    author: 'Daniel',
    network: 'inst',
    url: '/postcards/card1-1.png',
    orientation: 'ver',
    name: { es: 'Hogar dulce hogar', en: 'Beautiful sweet home', fr: 'Doux chez-soi' },
    info: {
      es: 'No hay nada como el hogar: luz cálida en las ventanas, olor a tarta recién hecha y la sensación de estar justo donde perteneces. Envía esta tarjeta acogedora a alguien cuyo hogar es su castillo.',
      en: 'There is no place like home — warm light in the windows, the smell of fresh pie and the feeling that you are exactly where you belong. Send this cozy greeting to someone whose house is their fortress.',
      fr: "Rien ne vaut la maison : lumière chaude aux fenêtres, odeur de tarte maison et sensation d'être exactement à sa place. Envoyez cette carte douillette à quelqu'un dont la maison est son château."
    }
  },
  {
    author: 'Erik',
    network: 'inst',
    url: '/postcards/_card2-1.png',
    orientation: 'hor',
    name: { es: 'Azúcar dulce', en: 'Sweet nice sugar', fr: 'Sucre délicat' },
    info: {
      es: 'Un poco de dulzor para tu día: nubes escarchadas, rayos de sol de caramelo y una cucharada de alegría infantil. Esta postal acompaña perfecto una taza de té y un momento de felicidad sencilla.',
      en: 'A little sweetness for your day: candied clouds, caramel sunbeams and a spoonful of childhood joy. This postcard is the perfect companion for a cup of tea and a moment of simple happiness.',
      fr: "Une touche de douceur pour votre journée : nuages sucrés, rayons de soleil caramélisés et une cuillerée de joie d'enfance. Cette carte est la compagne idéale d'une tasse de thé et d'un instant de bonheur simple."
    }
  },
  {
    author: 'Theodore',
    network: 'inst',
    url: '/postcards/lisaroyal_an_aerial_view_of_the_torn_mountants_in_the_argentina.png',
    orientation: 'hor',
    name: { es: 'Página web responsable', en: 'Responsible web page', fr: 'Page web responsable' },
    info: {
      es: 'Vista aérea de los escarpados picos patagónicos, como si la propia tierra rasgara el cielo. Crestas dramáticas y valles profundos muestran la belleza salvaje del sur de Argentina en cada detalle.',
      en: "An aerial view of the rugged Patagonian peaks, as if the earth itself had torn the sky open. Dramatic ridges and deep valleys show the raw beauty of Argentina's wild south in every detail.",
      fr: "Vue aérienne des pics rugueux de Patagonie, comme si la terre elle-même avait déchiré le ciel. Crêtes spectaculaires et vallées profondes révèlent la beauté sauvage du sud de l'Argentine dans chaque détail."
    }
  },
  {
    author: 'Harold',
    network: 'inst',
    url: '/postcards/lisaroyal_drawing_in_the_style_of_jeff_kinney_a_view_from_the_s.png',
    orientation: 'ver',
    name: { es: 'IA generativa', en: 'Generative AI', fr: 'IA générative' },
    info: {
      es: 'Una escena divertida dibujada al estilo de los garabatos de un cuaderno escolar, donde la imaginación vuela libre entre fórmulas de álgebra. Un recordatorio alegre de que las grandes ideas suelen empezar como rabiscos en el margen.',
      en: 'A playful scene drawn in the style of a school notebook doodle, where imagination runs free between algebra formulas. A cheerful reminder that great ideas often start as scribbles in the margin.',
      fr: "Une scène ludique dessinée dans le style des gribouillis d'un cahier d'écolier, où l'imagination court librement entre les formules d'algèbre. Un rappel joyeux : les grandes idées commencent souvent par des gribouillis dans la marge."
    }
  },
  {
    author: 'John',
    network: 'inst',
    url: '/postcards/Postcard_mountains_01_preview.jpg',
    orientation: 'ver',
    name: { es: 'Mi postal increíble', en: 'My awesome postcard', fr: 'Ma carte postale géniale' },
    info: {
      es: 'Cadenas montañosas envueltas en niebla que se pierden en el horizonte, una detrás de otra como páginas de un libro antiguo. Un recuerdo de viaje clásico para quienes encuentran paz muy por encima del ruido de la ciudad.',
      en: 'Misty mountain ranges fading into the horizon, one ridge behind another like pages of an old book. A classic travel keepsake for everyone who feels at peace high above the noise of the city.',
      fr: "Des chaînes de montagnes voilées de brume qui s'estompent vers l'horizon, l'une derrière l'autre comme les pages d'un vieux livre. Un souvenir de voyage classique pour tous ceux qui trouvent la paix bien au-dessus du bruit de la ville."
    }
  },
  {
    author: 'Cat',
    network: 'behance',
    url: '/postcards/lighthouse.jpg',
    orientation: 'hor',
    name: { es: 'Papel blanco virgen', en: 'White paper blank', fr: 'Feuille blanche vierge' },
    info: {
      es: 'Un faro solitario que vigila la costa rocosa, su haz abriéndose paso entre la niebla del atardecer. Símbolo de esperanza y guía: envíala a alguien que necesite un poco de luz en su camino.',
      en: 'A lonely lighthouse guarding the rocky coast, its beam cutting through the evening fog. A symbol of hope and guidance — send it to someone who needs a little light on their way.',
      fr: 'Un phare solitaire veillant sur la côte rocheuse, son faisceau perçant la brume du soir. Symbole espoir et de repère : envoyez-la à quelqu’un qui a besoin d’un peu de lumière sur sa route.'
    }
  },
  {
    author: 'Alexander',
    network: 'dribble',
    url: '/postcards/palermo.jpg',
    orientation: 'hor',
    name: { es: 'Alpha beta gamma', en: 'Alpha beta gamma', fr: 'Alpha beta gamma' },
    info: {
      es: 'Calles bañadas por el sol de Palermo, donde las fachadas barrocas se mezclan con la vibrante vida siciliana y cada esquina huele a cítricos y café. Deja que esta postal te lleve directo al corazón del Mediterráneo.',
      en: 'Sun-washed streets of Palermo, where baroque facades meet vibrant Sicilian life and every corner smells of citrus and coffee. Let this postcard take you straight to the heart of the Mediterranean.',
      fr: "Les rues ensoleillées de Palerme, où les façades baroques côtoient la vive vie sicilienne et où chaque coin sent l'agrume et le café. Laissez cette carte vous transporter au cœur de la Méditerranée."
    }
  }
]

export default postcards

export const reviews: Review[] = [
  {
    author: 'mariana.rd',
    avatar: '/images/avatars/avatar-1.jpg',
    network: 'inst',
    text: {
      es: 'La calidad de impresión es impresionante: los colores son exactamente como en mi pantalla. Envié tres postales a mi familia en Madrid y a todos les encantaron.',
      en: 'The print quality is stunning — the colours look exactly like on my screen. I sent three cards to my family in Madrid and everyone loved them.',
      fr: "La qualité d'impression est bluffante : les couleurs sont exactement comme sur mon écran. J'ai envoyé trois cartes à ma famille à Madrid et tout le monde a adoré."
    }
  },
  {
    author: 'tomas.studio',
    avatar: '/images/avatars/avatar-2.jpg',
    network: 'behance',
    text: {
      es: 'Encargué un lote personalizado de postales para los clientes de nuestro estudio. Entrega rápida, embalaje cuidadoso y un papel precioso; sin duda repetiremos.',
      en: 'Ordered a custom batch of cards for our studio clients. Fast delivery, careful packaging and beautiful paper — will definitely repeat.',
      fr: 'Nous avons commandé un lot personnalisé de cartes pour les clients de notre studio. Livraison rapide, emballage soigné et papier magnifique — nous recommencerons sans hésiter.'
    }
  },
  {
    author: 'claire.draws',
    avatar: '/images/avatars/avatar-3.jpg',
    network: 'dribble',
    text: {
      es: 'Una forma encantadora de mantener el contacto fuera de línea. El papel se siente premium y cada postal llegó con un toque escrito a mano.',
      en: 'A lovely way to stay in touch offline. The paper feels premium and each card arrived with a handwritten touch.',
      fr: 'Une façon charmante de rester en contact hors ligne. Le papier offre un rendu premium et chaque carte est arrivée avec une touche écrite à la main.'
    }
  },
  {
    author: 'diego.p',
    avatar: '/images/avatars/avatar-4.jpg',
    network: 'inst',
    text: {
      es: 'Mandé una postal desde Buenos Aires a mi abuela y le hizo ilusión como ningún mensaje digital. Llegó en cuatro días perfectamente envuelta.',
      en: 'I sent a postcard from Buenos Aires to my grandma and it made her happier than any digital message. It arrived in four days perfectly wrapped.',
      fr: "J'ai envoyé une carte de Buenos Aires à ma grand-mère et elle lui a fait plus plaisir que n'importe quel message numérique. Elle est arrivée en quatre jours, parfaitement emballée."
    }
  },
  {
    author: 'nina.k',
    avatar: '/images/avatars/avatar-5.jpg',
    network: 'behance',
    text: {
      es: 'Colecciono postales de arte desde hace años y estas son de lo mejor que he visto: diseños originales y una impresión impecable.',
      en: "I've been collecting art postcards for years and these are among the best I've seen — original designs and flawless printing.",
      fr: "Je collectionne les cartes postales d'art depuis des années et celles-ci font partie des meilleures que j'aie vues : des designs originaux et une impression impeccable."
    }
  },
  {
    author: 'marc.l',
    avatar: '/images/avatars/avatar-6.jpg',
    network: 'dribble',
    text: {
      es: 'Las regalé en el office de mi trabajo y fueron un éxito total. Buena idea tenerlas también en tiendas, siempre hay que elegir al vuelo.',
      en: 'I gave them as gifts at the office and they were a total hit. Having them in stores too is a great idea — there is always a last-minute occasion.',
      fr: "Je les ai offertes au bureau et ce fut un succès total. Les trouver en boutique aussi est une excellente idée — il y a toujours une occasion de dernière minute."
    }
  }
]
