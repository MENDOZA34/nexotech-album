export const concepts = [
  {
    term: "Hardware",
    explanation:
      "Es la parte física de un sistema tecnológico: computadora, pantalla, teclado, procesador, memoria, cables y demás componentes que se pueden tocar.",
  },
  {
    term: "CPU",
    explanation:
      "Es la unidad central de procesamiento. Ejecuta instrucciones, coordina tareas y afecta mucho el rendimiento en programación, productividad y juegos.",
  },
  {
    term: "Microprocesador",
    explanation:
      "Es el chip que contiene la CPU y otros bloques de control. En computadoras modernas suele integrar memoria caché, gráficos o controladores según el modelo.",
  },
  {
    term: "GPU",
    explanation:
      "Procesa gráficos, video, 3D e inteligencia artificial. Puede estar integrada en el procesador o venir como tarjeta dedicada con memoria propia.",
  },
  {
    term: "RAM",
    explanation:
      "Memoria temporal de trabajo. Más RAM permite abrir más programas o proyectos grandes sin que el equipo se vuelva lento.",
  },
  {
    term: "Almacenamiento",
    explanation:
      "Guarda sistema operativo, programas y archivos. Puede ser HDD, SSD SATA, SSD NVMe o una unidad externa, y cada opción cambia velocidad, costo y portabilidad.",
  },
  {
    term: "HDD",
    explanation:
      "Disco mecánico con platos giratorios. Ofrece mucha capacidad por bajo costo, pero es más lento y delicado que un SSD.",
  },
  {
    term: "SSD",
    explanation:
      "Unidad de estado sólido sin partes mecánicas. Es más rápida y resistente que un HDD, aunque suele costar más por gigabyte.",
  },
  {
    term: "SATA",
    explanation:
      "SATA es una interfaz de conexión, no un tipo de disco. Puede conectar HDD o SSD, pero no alcanza la velocidad de NVMe.",
  },
  {
    term: "NVMe",
    explanation:
      "Protocolo usado por muchos SSD modernos sobre PCI Express. Reduce latencia y permite velocidades muy superiores a SATA.",
  },
  {
    term: "Tarjeta madre",
    explanation:
      "Placa principal que conecta CPU, RAM, almacenamiento, GPU, puertos y energía. Define compatibilidad de socket, chipset, ranuras y expansión.",
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
    term: "Resolución",
    explanation:
      "Cantidad de píxeles en una pantalla. Full HD es 1920x1080, QHD es 2560x1440 y 4K suele ser 3840x2160.",
  },
  {
    term: "Frecuencia de actualización",
    explanation:
      "Indica cuántas veces por segundo se actualiza la imagen, medida en hertz. 60 Hz sirve para uso general; 120 Hz o más mejora fluidez en juegos y movimiento.",
  },
  {
    term: "Tipos de panel",
    explanation:
      "Describe la tecnología de pantalla. Afecta color, contraste, ángulos de visión, brillo, tiempo de respuesta y precio.",
  },
  {
    term: "IPS",
    explanation:
      "Panel con buenos colores y ángulos de visión. Es común en monitores de estudio, diseño y productividad.",
  },
  {
    term: "VA",
    explanation:
      "Panel con contraste alto y negros más profundos que IPS típico. Puede tener más desenfoque en movimiento según el modelo.",
  },
  {
    term: "OLED",
    explanation:
      "Cada píxel emite su propia luz, por eso logra negros reales y contraste excelente. Requiere cuidado frente a retención de imagen en usos prolongados.",
  },
  {
    term: "Conectividad",
    explanation:
      "Conjunto de puertos físicos y redes que permiten conectar periféricos, pantallas, internet y accesorios.",
  },
  {
    term: "USB",
    explanation:
      "Puerto común para datos, carga y accesorios. Puede variar mucho en velocidad y potencia según versión y conector.",
  },
  {
    term: "HDMI",
    explanation:
      "Conexión de audio y video usada en televisores, monitores, consolas y laptops. Sus versiones definen resolución y frecuencia máximas.",
  },
  {
    term: "DisplayPort",
    explanation:
      "Conexión de video frecuente en monitores de PC. Suele usarse para altas resoluciones, altas frecuencias y varios monitores.",
  },
  {
    term: "Wi-Fi",
    explanation:
      "Red inalámbrica para conectarse a internet o redes locales. Generaciones recientes como Wi-Fi 6, 6E y 7 mejoran velocidad y estabilidad.",
  },
  {
    term: "Bluetooth",
    explanation:
      "Tecnología inalámbrica de corto alcance para auriculares, teclados, mouse, mandos, relojes y sensores.",
  },
  {
    term: "Raspberry Pi",
    explanation:
      "Computadora de placa única capaz de ejecutar Linux. Sirve para servidores pequeños, programación, multimedia, redes y proyectos educativos.",
  },
  {
    term: "Arduino",
    explanation:
      "Placa de microcontrolador pensada para leer sensores y controlar motores, luces o actuadores. No reemplaza a una computadora con sistema operativo completo.",
  },
  {
    term: "Raspberry Pi frente a Arduino",
    explanation:
      "Raspberry Pi es una mini computadora con sistema operativo; Arduino es un microcontrolador para control directo de hardware. Se complementan, pero no son dispositivos idénticos.",
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
    title: "Laptop gama alta frente a gama media",
    topic: "Movilidad y rendimiento",
    conclusion:
      "Una laptop de gama alta conviene para creación profesional, pantalla premium y mayor margen de rendimiento. Una gama media puede ser mejor compra para clases, oficina y juegos moderados si el presupuesto importa.",
    productIds: ["laptop-macbook-pro-16-m4-max", "laptop-thinkpad-e14-gen6"],
  },
  {
    title: "HDD, SSD SATA y SSD NVMe",
    topic: "Almacenamiento",
    conclusion:
      "HDD es económico para archivos grandes. SSD SATA moderniza equipos antiguos. SSD NVMe es la mejor opción para sistema, juegos y edición porque usa PCI Express.",
    productIds: ["storage-seagate-barracuda", "storage-samsung-870-evo", "storage-samsung-990-pro"],
  },
  {
    title: "SSD SATA frente a SSD NVMe",
    topic: "Interfaz y velocidad",
    conclusion:
      "Un SSD SATA mejora mucho frente a un HDD y sirve para equipos antiguos. Un SSD NVMe conviene cuando la placa madre lo permite y se busca mayor velocidad para sistema, juegos o edición.",
    productIds: ["storage-samsung-870-evo", "storage-samsung-990-pro"],
  },
  {
    title: "HDD frente a SSD",
    topic: "Capacidad y respuesta",
    conclusion:
      "Un HDD puede convenir para respaldos grandes y bajo costo por gigabyte. Un SSD es preferible para sistema operativo y programas porque reduce tiempos de carga y respuesta.",
    productIds: ["storage-seagate-barracuda", "storage-crucial-mx500"],
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
  {
    title: "Tipos de monitores",
    topic: "Pantalla según uso",
    conclusion:
      "Un monitor 4K de productividad favorece nitidez, uno gamer prioriza frecuencia de actualización y uno orientado a color conviene para diseño. La mejor elección depende del trabajo principal.",
    productIds: ["peripheral-monitor-dell-u2723qe", "peripheral-monitor-lg-27gs75q", "peripheral-monitor-asus-pa278cv"],
  },
  {
    title: "CPU de rendimiento frente a uso general",
    topic: "Procesadores",
    conclusion:
      "Un CPU orientado a rendimiento conviene para juegos exigentes o cargas pesadas. Un procesador de uso general puede ser suficiente para clases, oficina y desarrollo ligero con menor costo.",
    productIds: ["component-cpu-ryzen-7800x3d", "component-cpu-ryzen-5-7600"],
  },
];
