export const concepts = [
  {
    term: "CPU o microprocesador",
    explanation:
      "Es el cerebro de la computadora. Ejecuta instrucciones, coordina tareas y afecta mucho el rendimiento en programación, productividad y juegos.",
  },
  {
    term: "GPU o tarjeta gráfica",
    explanation:
      "Procesa gráficos, video, 3D e inteligencia artificial. Puede estar integrada en el procesador o venir como tarjeta dedicada.",
  },
  {
    term: "RAM",
    explanation:
      "Memoria temporal de trabajo. Más RAM permite abrir más programas o proyectos grandes sin que el equipo se vuelva lento.",
  },
  {
    term: "HDD",
    explanation:
      "Disco mecánico con platos giratorios. Ofrece mucha capacidad por bajo costo, pero es más lento y delicado que un SSD.",
  },
  {
    term: "SSD SATA",
    explanation:
      "Unidad de estado sólido que usa la interfaz SATA. Es mucho más rápida que un HDD, pero queda limitada por el ancho de banda SATA.",
  },
  {
    term: "SSD NVMe",
    explanation:
      "SSD que usa PCI Express y el protocolo NVMe. Es la opción más rápida para sistema operativo, juegos y edición de video.",
  },
  {
    term: "SATA",
    explanation:
      "SATA es una interfaz de conexión, no un tipo de disco. Puede conectar HDD o SSD, pero no alcanza la velocidad de NVMe.",
  },
  {
    term: "Resolución",
    explanation:
      "Cantidad de píxeles en una pantalla. Full HD es 1920x1080, QHD es 2560x1440 y 4K suele ser 3840x2160.",
  },
  {
    term: "Tipos de panel",
    explanation:
      "IPS prioriza color y ángulos de visión, VA ofrece buen contraste, OLED logra negros profundos y mini-LED mejora brillo y contraste por zonas.",
  },
  {
    term: "Fuente de poder",
    explanation:
      "Convierte electricidad para los componentes. Debe tener potencia suficiente, conectores adecuados y certificación de eficiencia.",
  },
  {
    term: "Refrigeración",
    explanation:
      "Mantiene temperatura estable. Aire es simple y económico; líquida AIO ayuda en procesadores potentes, pero requiere más cuidado.",
  },
  {
    term: "Conectividad",
    explanation:
      "Incluye puertos físicos y redes como USB-C, HDMI, DisplayPort, Wi-Fi 6/7, Bluetooth y Ethernet.",
  },
  {
    term: "Raspberry Pi frente a Arduino",
    explanation:
      "Raspberry Pi es una computadora pequeña que puede ejecutar Linux, navegador y programas completos. Arduino es una placa de microcontrolador pensada para sensores, motores y automatización en tiempo real.",
  },
];

export const preparedComparisons = [
  {
    title: "Gama alta, media y baja en computadoras",
    topic: "Clasificación de gama",
    conclusion:
      "La gama alta combina procesadores recientes, GPU potente, más RAM y mejor refrigeración. La gama media busca equilibrio de precio y rendimiento. La gama baja prioriza tareas básicas y ahorro.",
    productIds: [
      "desktop-mac-studio-m5-ultra",
      "desktop-lenovo-legion-t5",
      "desktop-acer-aspire-tc",
    ],
  },
  {
    title: "Celulares por uso real",
    topic: "Cámara, potencia y duración",
    conclusion:
      "Un teléfono de gama alta conviene si la cámara, pantalla y actualizaciones importan mucho. En gama media se obtiene gran valor; en gama baja conviene revisar almacenamiento y soporte.",
    productIds: [
      "phone-iphone-16-pro-max",
      "phone-galaxy-a56",
      "phone-galaxy-a16",
    ],
  },
  {
    title: "HDD, SSD SATA y SSD NVMe",
    topic: "Almacenamiento",
    conclusion:
      "HDD es económico para archivos grandes. SSD SATA moderniza equipos antiguos. SSD NVMe es la mejor opción para sistema, juegos y edición porque usa PCI Express.",
    productIds: ["storage-seagate-barracuda", "storage-samsung-870-evo", "storage-samsung-990-pro"],
  },
  {
    title: "Raspberry Pi frente a Arduino",
    topic: "Placas de desarrollo",
    conclusion:
      "Raspberry Pi sirve como mini computadora para redes, multimedia o servidores. Arduino es mejor para controlar hardware simple, leer sensores y ejecutar tareas repetitivas con bajo consumo.",
    productIds: ["dev-raspberry-pi-5", "dev-arduino-uno-r4-wifi"],
  },
  {
    title: "Consolas actuales",
    topic: "Entretenimiento",
    conclusion:
      "PS5 y Xbox Series X priorizan potencia de sala y juegos AAA; Nintendo Switch OLED sacrifica potencia para ofrecer portabilidad y catálogo familiar.",
    productIds: ["console-ps5-slim", "console-xbox-series-x", "console-switch-oled"],
  },
];
