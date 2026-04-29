// banco_preguntas.js
// Banco de preguntas fijas inyectadas para el Módulo de Evaluación de Alucilex

const bancoPreguntasAlucilex = [
    // ==========================================
    // MÓDULO 1: TEORÍA DEL ACTO JURÍDICO
    // ==========================================
    {
        pregunta: "Según la doctrina mayoritaria, ¿cuál es la sanción aplicable ante la omisión de un 'requisito de existencia' del acto jurídico (como la falta de voluntad o la falta de objeto)?",
        opciones: ["A. Nulidad Relativa.", "B. Inexistencia.", "C. Nulidad Absoluta.", "D. Resciliación."],
        correcta: 1,
        explicacion: "Claro Solar y la doctrina clásica sostienen que la falta de un requisito de existencia produce la Inexistencia del acto, no produciendo efecto civil alguno. Aunque algunos autores (como Alessandri) argumentan que el Código Civil chileno la sanciona con Nulidad Absoluta."
    },
    {
        pregunta: "Para que el 'error de hecho' vicie el consentimiento cuando recae sobre una 'calidad accidental' de la cosa, el Código Civil exige que:",
        opciones: ["A. Sea la única razón por la que se contrata y la otra parte no lo sepa.", "B. Sea el motivo principal para contratar y este motivo haya sido conocido por la otra parte.", "C. Comparta la misma naturaleza que el error esencial.", "D. Provoque un daño patrimonial superior a la mitad del justo precio."],
        correcta: 1,
        explicacion: "Según el Art. 1454 inc. 2 del CC, el error sobre una calidad accidental no vicia el consentimiento, a menos que dicha calidad sea el motivo principal de una de las partes para contratar, y este motivo haya sido conocido de la otra parte."
    },
    {
        pregunta: "Para que la 'fuerza' vicie el consentimiento, NO es un requisito que:",
        opciones: ["A. Sea grave y capaz de producir una impresión fuerte.", "B. Sea injusta o ilegítima.", "C. Sea determinante para la celebración del acto.", "D. Provenga obligatoriamente de la contraparte en el contrato."],
        correcta: 3,
        explicacion: "A diferencia del dolo, el Art. 1457 del Código Civil establece que la fuerza no necesita provenir de la persona beneficiada por ella. Basta que se haya empleado la fuerza por cualquiera persona para que vicie el consentimiento."
    },
    {
        pregunta: "En los actos jurídicos bilaterales, para que el 'dolo' vicie el consentimiento, se requiere copulativamente que:",
        opciones: ["A. Sea obra de una de las partes y sea determinante.", "B. Sea incidental y provenga de un tercero.", "C. Se presuma legalmente y cause daño material.", "D. Haya dolo bueno de ambas partes."],
        correcta: 0,
        explicacion: "El Art. 1458 del CC establece que el dolo no vicia el consentimiento sino cuando es obra de una de las partes, y cuando además aparece claramente que sin él no hubieran contratado (dolo determinante)."
    },
    {
        pregunta: "De acuerdo al Art. 1464 del Código Civil chileno, NO hay objeto ilícito en la enajenación de:",
        opciones: ["A. Las cosas incomerciables.", "B. Los derechos o privilegios intransferibles.", "C. Las cosas embargadas, si el juez que conoce el litigio o el acreedor lo autorizan.", "D. Las especies cuya propiedad se litiga, sin permiso del juez."],
        correcta: 2,
        explicacion: "El Art. 1464 N° 3 prohíbe la enajenación de cosas embargadas, pero establece una excepción: si el juez lo autoriza o el acreedor consiente en ello, el objeto deja de ser ilícito."
    },
    {
        pregunta: "En el contexto de la representación, si el mandatario actúa excediendo los límites del poder conferido, frente al mandante y terceros, el acto:",
        opciones: ["A. Adolece de Nulidad Absoluta por falta de consentimiento.", "B. Es inoponible al mandante, a menos que este lo ratifique expresa o tácitamente.", "C. Obliga solidariamente al mandante y al mandatario.", "D. Se entiende válido por la teoría de la apariencia."],
        correcta: 1,
        explicacion: "El acto celebrado en exceso del poder conferido no obliga al mandante y le es inoponible. No adolece de nulidad, sino que es un negocio con eficacia suspendida que puede volverse plenamente válido si el mandante lo ratifica."
    },
    {
        pregunta: "En materia de simulación, cuando existe una 'simulación relativa' y el acto oculto (o disimulado) cumple con todos los requisitos de existencia y validez:",
        opciones: ["A. Vale el acto oculto y cae el acto aparente o simulado.", "B. Ambos actos son nulos absolutamente por falta de causa.", "C. El Fisco confisca los bienes materia del contrato.", "D. Se presume dolo y debe indemnizarse."],
        correcta: 0,
        explicacion: "En la simulación relativa hay dos actos: uno aparente y uno real. La regla general es que, entre las partes, prevalece la voluntad real (el acto oculto) siempre que este cumpla con los requisitos legales de existencia y validez."
    },
    {
        pregunta: "El saneamiento de la Nulidad Absoluta y de la Nulidad Relativa por el transcurso del tiempo opera, respectivamente, en un plazo de:",
        opciones: ["A. 5 años y 3 años.", "B. 10 años y 4 años.", "C. 15 años y 5 años.", "D. 10 años en ambos casos."],
        correcta: 1,
        explicacion: "La Nulidad Absoluta se sanea por el transcurso de 10 años desde la celebración del acto (Art. 1683). La Nulidad Relativa se sanea en 4 años, contados desde la celebración del acto, o desde que cesa la fuerza o incapacidad (Art. 1691)."
    },
    // ==========================================
    // MÓDULO 2: BIENES Y DERECHOS REALES
    // ==========================================
    {
        pregunta: "Aquellos bienes que, siendo muebles por naturaleza, se consideran inmuebles por estar permanentemente destinados al uso, cultivo o beneficio de un inmueble, se denominan:",
        opciones: ["A. Inmuebles por adherencia.", "B. Inmuebles por destinación.", "C. Muebles por anticipación.", "D. Inmuebles rústicos."],
        correcta: 1,
        explicacion: "Es la definición clásica de los Inmuebles por Destinación (Art. 570 CC). Ejemplos: los tractores o animales destinados al cultivo continuo de una finca."
    },
    {
        pregunta: "La facultad del derecho de dominio que permite al propietario destruir, consumir materialmente o enajenar (transferir) la cosa, corresponde al:",
        opciones: ["A. Ius utendi (Uso).", "B. Ius fruendi (Goce).", "C. Ius abutendi (Disposición).", "D. Ius vindicandi (Reivindicación)."],
        correcta: 2,
        explicacion: "El 'Ius abutendi' o facultad de disposición permite al dueño disponer material o jurídicamente de la cosa, siendo la característica que distingue al dominio de otros derechos reales como el usufructo."
    },
    {
        pregunta: "¿Cuál de los siguientes modos de adquirir el dominio tiene un carácter 'derivativo'?",
        opciones: ["A. La Ocupación.", "B. La Accesión.", "C. La Tradición.", "D. La Prescripción Adquisitiva."],
        correcta: 2,
        explicacion: "La tradición es un modo derivativo, ya que el dominio no nace en el adquirente, sino que se traspasa desde el patrimonio del tradente. Ocupación, accesión y prescripción son originarios."
    },
    {
        pregunta: "Para adquirir la 'posesión regular' de un bien inmueble mediante un título traslaticio de dominio (ej. compraventa), se exige copulativamente:",
        opciones: ["A. Justo título, buena fe al momento de adquirirla, y la tradición.", "B. Solo inscripción en el Conservador de Bienes Raíces por 10 años.", "C. Título gratuito, mera tenencia y buena fe.", "D. Posesión material y ausencia de clandestinidad."],
        correcta: 0,
        explicacion: "El Art. 702 del CC exige expresamente para la posesión regular: el justo título, la buena fe inicial y, en caso de invocarse un título traslaticio de dominio, haber efectuado la tradición (inscripción)."
    },
    {
        pregunta: "El arrendatario, el comodatario y el usufructuario tienen, respecto del propietario de la cosa, la calidad de:",
        opciones: ["A. Poseedores regulares.", "B. Poseedores irregulares.", "C. Meros tenedores.", "D. Dueños pro indiviso."],
        correcta: 2,
        explicacion: "Son meros tenedores (Art. 714 CC) porque ejercen la tenencia sobre una cosa, pero reconociendo dominio ajeno. Les falta el 'animus domini'."
    },
    {
        pregunta: "Según el Código Civil, la 'posesión viciosa' que se ejerce ocultándola a quienes tienen derecho a oponerse a ella, se conoce como:",
        opciones: ["A. Posesión violenta.", "B. Posesión clandestina.", "C. Posesión inútil.", "D. Posesión delictiva."],
        correcta: 1,
        explicacion: "El Art. 713 define la posesión clandestina como aquella que se ejerce ocultándola a los que tienen derecho para oponerse a ella."
    },
    {
        pregunta: "En materia de Prescripción Adquisitiva Ordinaria, el plazo exigido por la ley para adquirir el dominio de bienes inmuebles es de:",
        opciones: ["A. 2 años.", "B. 5 años.", "C. 10 años.", "D. 15 años."],
        correcta: 1,
        explicacion: "El Art. 2508 del Código Civil establece que el tiempo necesario a la prescripción ordinaria es de 2 años para los muebles y de 5 años para los bienes raíces."
    },
    {
        pregunta: "El DL 2.695 (Saneamiento de la Pequeña Propiedad Raíz) exige que el solicitante detente la posesión material continua y exclusiva del inmueble por un plazo de al menos:",
        opciones: ["A. 1 año.", "B. 3 años.", "C. 5 años.", "D. 10 años."],
        correcta: 2,
        explicacion: "El decreto exige posesión material, continua y exclusiva por al menos 5 años, sin violencia ni clandestinidad, premiando a quien explota la tierra frente a inscripciones de papel abandonadas."
    },
    {
        pregunta: "La Acción Reivindicatoria es aquella que tiene:",
        opciones: ["A. El mero tenedor para que se le respete su contrato de arriendo.", "B. El poseedor para retener o recuperar la posesión material.", "C. El dueño de una cosa singular, de que no está en posesión, para que el poseedor sea condenado a restituírsela.", "D. El acreedor para embargar los bienes de su deudor."],
        correcta: 2,
        explicacion: "Definición exacta del Art. 889 del Código Civil. Es la acción tutelar del dominio por excelencia."
    },
    {
        pregunta: "Si Pedro, estando demente (sin interdicción declarada), celebra un contrato de compraventa, la doctrina general afirma que este acto:",
        opciones: ["A. Es anulable absolutamente por objeto ilícito.", "B. Es anulable absolutamente por incapacidad absoluta (o inexistente por falta de voluntad).", "C. Es válido hasta que se declare su interdicción.", "D. Es anulable relativamente por ser un menor de edad equiparado."],
        correcta: 1,
        explicacion: "Los dementes son absolutamente incapaces (Art. 1447). Sus actos adolecen de Nulidad Absoluta, y la doctrina clásica incluso los considera inexistentes pues falta la voluntad, elemento base del acto jurídico."
    },
    {
        pregunta: "¿Qué acción se otorga al que ha perdido la posesión regular de la cosa, y se hallaba en el caso de poderla ganar por prescripción, contra cualquier persona (excepto el verdadero dueño)?",
        opciones: ["A. Acción Posesoria de Restitución.", "B. Acción Reivindicatoria estricta.", "C. Acción Publiciana.", "D. Querella de Restablecimiento."],
        correcta: 2,
        explicacion: "El Art. 894 del CC consagra la Acción Publiciana, permitiendo reivindicar a quien, si bien no es dueño, estaba en vías de serlo por prescripción (poseedor regular)."
    },
    {
        pregunta: "En la teoría de los actos jurídicos, la 'Causa Eficiente' se refiere a:",
        opciones: ["A. El motivo psicológico que indujo a contratar.", "B. El fin abstracto y objetivo invariable de todo contrato.", "C. La fuente generadora de la obligación (ej: el contrato, el cuasicontrato o la ley).", "D. La solemnidad exigida por la ley para perfeccionar el acto."],
        correcta: 2,
        explicacion: "En tus apuntes se distingue la causa eficiente (la fuente que genera la obligación), de la causa final (el fin abstracto del contrato) y la causa ocasional (el móvil psicológico personal)."
    },
    {
        pregunta: "Según las clasificaciones del acto jurídico, un contrato como la 'Donación' es, por regla general:",
        opciones: ["A. Unilateral y oneroso.", "B. Bilateral y gratuito.", "C. Bilateral y solemne.", "D. Unilateral (como contrato) pero acto jurídico bilateral, y gratuito."],
        correcta: 3,
        explicacion: "La donación es un acto jurídico bilateral (requiere voluntad del donante y aceptación del donatario), pero es un contrato unilateral (solo se obliga el donante) y a título gratuito."
    },
    {
        pregunta: "Para interponer Acciones Posesorias, el actor debe probar que ha estado en posesión tranquila y no interrumpida durante:",
        opciones: ["A. A lo menos un mes.", "B. A lo menos seis meses.", "C. Un año completo.", "D. Cinco años."],
        correcta: 2,
        explicacion: "El Art. 918 del Código Civil dispone que para instaurar acciones posesorias, se requiere haber estado en posesión tranquila y no interrumpida un año completo."
    },
    {
        pregunta: "La teoría de la 'Autonomía de la Voluntad' tiene como límite infranqueable:",
        opciones: ["A. La ley, el orden público y las buenas costumbres.", "B. Únicamente la voluntad del Presidente de la República.", "C. Las normas de los tribunales de comercio.", "D. El patrimonio económico del deudor."],
        correcta: 0,
        explicacion: "Según la teoría del acto jurídico, el límite primordial de la autonomía privada radica en el respeto a la ley imperativa/prohibitiva, el orden público y las buenas costumbres (moral)."
    },
    {
        pregunta: "El 'Error de Derecho' en nuestro ordenamiento civil:",
        opciones: ["A. Vicia siempre el consentimiento.", "B. No vicia el consentimiento, presumiéndose de derecho que la ley es conocida por todos.", "C. Vicia el consentimiento solo si se prueba un daño mayor a la mitad del precio.", "D. Permite alegar Nulidad Absoluta siempre."],
        correcta: 1,
        explicacion: "El Art. 1452 del CC establece la regla general de que el error sobre un punto de derecho no vicia el consentimiento, en concordancia con el Art. 8 (presunción de conocimiento de la ley)."
    },
    {
        pregunta: "Respecto de los frutos, el poseedor vencido en juicio reivindicatorio que actuó de 'mala fe':",
        opciones: ["A. Hace suyos los frutos hasta la contestación de la demanda.", "B. Debe restituir los frutos percibidos y también los que el dueño pudo haber percibido con mediana inteligencia y actividad.", "C. No restituye nada si el predio es agrícola.", "D. Solo debe restituir la cosa principal, la ley le perdona los frutos."],
        correcta: 1,
        explicacion: "El Art. 907 castiga al poseedor de mala fe, obligándolo a restituir no solo los frutos percibidos, sino también todos aquellos frutos que el dueño legítimo hubiera podido percibir."
    },

    // ==========================================
    // MÓDULO 3: OBLIGACIONES
    // ==========================================
    {
        pregunta: "Las obligaciones naturales se caracterizan principalmente porque:",
        opciones: ["A. Otorgan acción para exigir su cumplimiento y excepción para retener lo pagado.", "B. No otorgan acción para exigir su cumplimiento, pero cumplidas autorizan para retener lo que se ha dado o pagado en razón de ellas.", "C. Son aquellas que emanan de la naturaleza y no de la ley.", "D. Pueden ser demandadas en un plazo máximo de 10 años."],
        correcta: 1,
        explicacion: "El Art. 1470 del Código Civil define las obligaciones naturales estableciendo que no dan derecho a exigir su cumplimiento (carecen de acción), pero una vez pagadas voluntariamente, otorgan excepción para retener lo pagado."
    },
    {
        pregunta: "En la solidaridad pasiva, si uno de los codeudores solidarios paga la totalidad de la deuda al acreedor:",
        opciones: ["A. La deuda se extingue respecto de todos y el que pagó no puede cobrarle al resto.", "B. La obligación se extingue respecto del acreedor, y el deudor que pagó se subroga en los derechos del acreedor para cobrar a sus codeudores su cuota respectiva.", "C. El acreedor debe devolver el exceso de la cuota al deudor que pagó.", "D. Nace una nueva obligación solidaria entre los deudores."],
        correcta: 1,
        explicacion: "El pago extingue la obligación frente al acreedor, pero internamente (relación a las deudas) el deudor que paga se subroga en la acción del acreedor para repetir contra los demás codeudores por su parte o cuota (Art. 1522)."
    },
    {
        pregunta: "La condición resolutoria tácita, consagrada en el Art. 1489 del Código Civil, va envuelta en:",
        opciones: ["A. Los contratos reales y solemnes.", "B. Los contratos unilaterales.", "C. Todos los contratos bilaterales.", "D. Exclusivamente en la compraventa."],
        correcta: 2,
        explicacion: "El Art. 1489 es la norma fundante de la condición resolutoria tácita, y estipula explícitamente que 'En los contratos bilaterales va envuelta la condición resolutoria de no cumplirse por uno de los contratantes lo pactado'."
    },
    {
        pregunta: "¿Qué significa el aforismo 'La mora purga la mora' según el Art. 1552 del Código Civil?",
        opciones: ["A. Que los intereses penales se perdonan si ambos están en mora.", "B. Que en los contratos bilaterales ninguno está en mora dejando de cumplir lo pactado, mientras el otro no lo cumple por su parte o no se allana a cumplirlo.", "C. Que la mora caduca a los 5 años.", "D. Que el juez puede eximir de la mora al deudor de buena fe."],
        correcta: 1,
        explicacion: "Es la consagración legal de la excepción de contrato no cumplido (exceptio non adimpleti contractus). No se puede exigir el cumplimiento ni indemnización si la parte demandante tampoco ha cumplido su propia obligación."
    },
    {
        pregunta: "La principal ventaja de incluir una 'cláusula penal' en un contrato es que:",
        opciones: ["A. Reemplaza el pago de los impuestos.", "B. El acreedor no necesita probar los perjuicios, ya que supone una avaluación anticipada de los mismos.", "C. Permite llevar al deudor a prisión por deudas.", "D. Se transmite a los herederos aumentándose al doble."],
        correcta: 1,
        explicacion: "Según el Art. 1542, habrá lugar a exigir la pena en todos los casos en que se hubiere estipulado, sin que pueda alegarse por el deudor que la inejecución de lo pactado no ha inferido perjuicio al acreedor."
    },
    {
        pregunta: "En una obligación de dar una especie o cuerpo cierto, si la cosa perece por caso fortuito o fuerza mayor antes de la entrega y sin estar el deudor en mora:",
        opciones: ["A. La obligación se extingue y el riesgo es del acreedor.", "B. El deudor debe entregar otra cosa de igual valor.", "C. El deudor debe indemnizar los perjuicios.", "D. El contrato es nulo absolutamente."],
        correcta: 0,
        explicacion: "Por aplicación del Art. 1670 (pérdida de la cosa que se debe) y el Art. 1550, el riesgo del cuerpo cierto cuya entrega se deba es siempre a cargo del acreedor, extinguiéndose la obligación para el deudor."
    },
    {
        pregunta: "La Acción Pauliana o Revocatoria tiene por objeto:",
        opciones: ["A. Reivindicar una propiedad en manos de un tercero.", "B. Revocar los actos ejecutados por el deudor en fraude de los derechos de sus acreedores.", "C. Ejercer los derechos del deudor negligente que no quiere cobrar sus propios créditos.", "D. Declarar la nulidad de un contrato por lesión enorme."],
        correcta: 1,
        explicacion: "Consagrada en el Art. 2468, la acción pauliana permite a los acreedores dejar sin efecto los actos de disposición de bienes que el deudor haya realizado con el propósito de perjudicarlos o disminuir su patrimonio (fraude pauliano)."
    },
    {
        pregunta: "En las obligaciones de género, la regla fundamental es que:",
        opciones: ["A. El género perece, por lo que el caso fortuito extingue la obligación.", "B. El acreedor puede elegir qué individuo específico del género quiere.", "C. El género no perece (genus non perit), por lo que la pérdida de algunas cosas del género no extingue la obligación.", "D. Deben cumplirse siempre en dinero."],
        correcta: 2,
        explicacion: "Según el Art. 1510, la pérdida de algunas cosas del género no extingue la obligación, y el acreedor no puede oponerse a que el deudor las enajene o destruya, mientras subsistan otras para el cumplimiento."
    },
    {
        pregunta: "Para que opere la novación mediante la sustitución de una nueva obligación a otra, es requisito de la esencia:",
        opciones: ["A. Que ambas obligaciones sean naturales.", "B. El 'animus novandi' o intención expresa de novar.", "C. Que intervenga un juez árbitro.", "D. Que el pago se haga mediante vale vista."],
        correcta: 1,
        explicacion: "El Art. 1634 exige que para que haya novación es necesario que lo declaren las partes, o que aparezca indudablemente que su intención ha sido novar, porque la nueva obligación envuelve la extinción de la antigua."
    },
    {
        pregunta: "La compensación legal opera por el solo ministerio de la ley, aun sin conocimiento de los deudores, cuando ambas obligaciones son:",
        opciones: ["A. Obligaciones de hacer.", "B. De dinero o cosas fungibles de la misma especie y calidad, líquidas y actualmente exigibles.", "C. Obligaciones solidarias y conjuntas.", "D. Provenientes de cuasicontratos."],
        correcta: 1,
        explicacion: "El Art. 1656 señala los requisitos de la compensación legal. Deben ser obligaciones de igual naturaleza (dinero o fungibles), líquidas (monto determinado) y actualmente exigibles."
    },
    {
        pregunta: "La dación en pago se diferencia del pago efectivo en que:",
        opciones: ["A. El pago efectivo se hace en dinero y la dación en cheques.", "B. En la dación el acreedor consiente en recibir una cosa distinta de la debida originalmente.", "C. La dación en pago es un contrato solemne.", "D. No extingue la obligación, solo la suspende."],
        correcta: 1,
        explicacion: "La dación en pago es una convención que extingue la obligación, mediante la cual el acreedor y el deudor acuerdan que este último cumpla la obligación entregando una prestación distinta a la originalmente pactada."
    },
    {
        pregunta: "El 'lucro cesante' dentro de la indemnización de perjuicios corresponde a:",
        opciones: ["A. El daño moral sufrido por el acreedor.", "B. La pérdida o disminución efectiva del patrimonio del acreedor.", "C. La privación de la ganancia o utilidad legítima que el acreedor habría obtenido si la obligación se hubiese cumplido.", "D. Las costas del juicio de cobranza."],
        correcta: 2,
        explicacion: "El Art. 1556 divide los perjuicios en daño emergente (empobrecimiento real del patrimonio) y lucro cesante (la utilidad que deja de percibirse por el incumplimiento o retardo)."
    },
    {
        pregunta: "Si las partes no han fijado un plazo para el cumplimiento de una obligación, esta debe cumplirse:",
        opciones: ["A. A los 30 días de celebrado el contrato.", "B. Inmediatamente de celebrada.", "C. Cuando el juez lo determine.", "D. A los 10 años por regla general."],
        correcta: 1,
        explicacion: "Las obligaciones puras y simples son exigibles inmediatamente después de su nacimiento. No existe plazo de gracia ni espera legal automática en el Derecho Civil chileno."
    },
    // ==========================================
    // MÓDULO 4: RESPONSABILIDAD EXTRACONTRACTUAL
    // ==========================================
    {
        pregunta: "A diferencia de la responsabilidad contractual, en la responsabilidad extracontractual la culpa:",
        opciones: ["A. Se presume, bastando probar el incumplimiento.", "B. No admite gradación (leve, grave, levísima), respondiendo el autor de toda culpa.", "C. Solo se indemniza si existe dolo directo.", "D. Se requiere probar un vínculo contractual previo nulo."],
        correcta: 1,
        explicacion: "En REX no se aplica el Art. 1547 (que gradúa la culpa según el beneficio del contrato). El Art. 2314 hace responsable al que comete un delito o 'cuasidelito', entendiéndose que se responde de cualquier culpa, por mínima que sea."
    },
    {
        pregunta: "En materia extracontractual, ¿quiénes carecen absolutamente de capacidad (no cometen delito ni cuasidelito civil)?",
        opciones: ["A. Los menores adultos y las mujeres casadas en sociedad conyugal.", "B. Los impúberes (menores de 7 años) y los dementes.", "C. Los pródigos declarados en interdicción.", "D. Los mayores de 18 años bajo efecto del alcohol."],
        correcta: 1,
        explicacion: "El Art. 2319 establece que no son capaces de delito o cuasidelito los menores de 7 años ni los dementes. Queda a la prudencia del juez determinar si el menor de 16 años (y mayor de 7) actuó con o sin discernimiento."
    },
    {
        pregunta: "Si dos o más personas son coautoras de un cuasidelito civil que produce daño a la víctima, su responsabilidad para indemnizar es:",
        opciones: ["A. Conjunta (cada uno paga su cuota).", "B. Subsidiaria.", "C. Solidaria.", "D. Proporcional a su edad."],
        correcta: 2,
        explicacion: "El Art. 2317 es una excepción a la regla general de que la solidaridad debe pactarse. En materia extracontractual, los coautores de un delito o cuasidelito civil son solidariamente responsables de todo perjuicio."
    },
    {
        pregunta: "El dueño de un edificio es responsable a terceros por los daños que ocasione la ruina de este, siempre que la ruina haya ocurrido por:",
        opciones: ["A. Un terremoto u otro caso fortuito ineludible.", "B. Haber omitido las reparaciones necesarias o haber faltado de otra manera al cuidado de un buen padre de familia.", "C. La acción de terroristas o manifestantes.", "D. Uso indebido de los arrendatarios."],
        correcta: 1,
        explicacion: "Consagrado en el Art. 2323, es un caso de presunción de culpabilidad por el hecho de las cosas. El dueño responde si el daño provino de su negligencia en el mantenimiento o construcción."
    },
    {
        pregunta: "La 'exposición imprudente al daño' por parte de la víctima (Art. 2330) produce el siguiente efecto jurídico:",
        opciones: ["A. Exonera completamente de responsabilidad al autor del daño.", "B. Transforma el cuasidelito en caso fortuito.", "C. Obliga al juez a reducir prudencialmente la indemnización que debe pagar el autor.", "D. Transfiere la carga de la prueba al Ministerio Público."],
        correcta: 2,
        explicacion: "Es la figura de la 'concurrencia de culpas'. El daño se debe tanto a la culpa del autor como a la imprudencia de la víctima, por lo que el Art. 2330 ordena la reducción o rebaja de la indemnización."
    },
    {
        pregunta: "Los empleadores responden por los daños causados por sus dependientes o trabajadores. Esta responsabilidad se basa en una presunción de culpa llamada:",
        opciones: ["A. Culpa in contrahendo.", "B. Culpa in eligendo o in vigilando.", "C. Culpa objetiva estricta.", "D. Culpa levísima."],
        correcta: 1,
        explicacion: "El Art. 2320 (Responsabilidad por el hecho ajeno) presume que el empleador falló en su deber de elegir bien a sus dependientes (in eligendo) o en vigilarlos adecuadamente (in vigilando)."
    },
    {
        pregunta: "El daño moral en la responsabilidad extracontractual chilena:",
        opciones: ["A. Solo se indemniza si se prueban lesiones físicas.", "B. No es indemnizable bajo el Código Civil de Bello.", "C. Es plenamente indemnizable y se basa en el principio de reparación integral del daño (Art. 2329).", "D. Tiene un tope máximo fijado en Unidades Tributarias Mensuales."],
        correcta: 2,
        explicacion: "Aunque Bello no lo reguló expresamente con ese nombre, la jurisprudencia y doctrina han construido su indemnización apoyándose en la amplitud del Art. 2314 ('todo daño') y el Art. 2329."
    },
    {
        pregunta: "Si una persona ebria causa un daño extracontractual:",
        opciones: ["A. Se exime de responsabilidad por estar privado temporalmente de razón.", "B. Responde solidariamente el cantinero que le vendió el alcohol.", "C. Es plenamente responsable de sus actos, pues la ebriedad es imputable a él.", "D. Solo responde por daño emergente, no por lucro cesante ni daño moral."],
        correcta: 2,
        explicacion: "El Art. 2318 señala expresamente que el ebrio es responsable de los daños causados por su delito o cuasidelito, no pudiendo alegar su embriaguez como eximente."
    },
    {
        pregunta: "El plazo ordinario de prescripción de la acción de responsabilidad extracontractual es de:",
        opciones: ["A. 1 año.", "B. 3 años.", "C. 4 años, contados desde la perpetración del acto.", "D. 5 años, contados desde la declaración del daño."],
        correcta: 2,
        explicacion: "El Art. 2332 establece que las acciones que concede este título por daño o dolo, prescriben en 4 años contados desde la perpetración del acto."
    },
    {
        pregunta: "La doctrina mayoritaria chilena acepta el 'Cúmulo de Responsabilidades' (optar entre demandar por sede contractual o extracontractual ante un mismo incumplimiento):",
        opciones: ["A. Plenamente, el demandante siempre puede elegir la vía más favorable.", "B. Solo cuando el incumplimiento contractual constituye a la vez un delito penal.", "C. No se acepta como regla general, primando la responsabilidad contractual si hay un contrato válido entre las partes.", "D. Solo en los contratos de arrendamiento."],
        correcta: 2,
        explicacion: "La regla general es el no cúmulo (o no opción). Si el daño se produce por el incumplimiento de una obligación contractual, el acreedor está obligado a ejercer la acción contractual, no pudiendo elegir la extracontractual para saltarse las reglas del contrato."
    },
    {
        pregunta: "En responsabilidad por el hecho ajeno, si el empleador logra probar que actuó con la debida diligencia y cuidado, y que le fue imposible impedir el hecho de su trabajador:",
        opciones: ["A. De igual forma debe indemnizar porque su responsabilidad es objetiva.", "B. Queda exento de responsabilidad y la presunción de culpa se destruye.", "C. Debe pagar la mitad de la indemnización.", "D. El trabajador queda libre de pagar también."],
        correcta: 1,
        explicacion: "El Art. 2320 inciso final señala que cesará la responsabilidad del empleador si prueba que, con la autoridad y cuidado que su calidad le confiere, no hubiera podido impedir el hecho."
    },
    {
        pregunta: "La acción para exigir la indemnización por daño extracontractual:",
        opciones: ["A. Es personalísima, extinguiéndose con la muerte de la víctima.", "B. Es transmisible a los herederos de la víctima y transferible por acto entre vivos.", "C. Solo puede ser cedida a título gratuito.", "D. Prescribe a los 6 meses si hay daño moral."],
        correcta: 1,
        explicacion: "Como toda acción patrimonial, la acción indemnizatoria (Art. 2315) puede transmitirse a los herederos y cederse a terceros. El debate actual recae sobre si el daño moral puramente personal es transmisible si la víctima no demandó en vida."
    },
    // ==========================================
    // MÓDULO 5: INEFICACIA Y NULIDAD (ACTO JURÍDICO)
    // ==========================================
    {
        pregunta: "La omisión de formalidades 'habilitantes' (aquellas exigidas en consideración al estado o calidad de las personas que celebran el acto) se sanciona con:",
        opciones: ["A. Nulidad Absoluta.", "B. Nulidad Relativa.", "C. Inexistencia.", "D. Inoponibilidad."],
        correcta: 1,
        explicacion: "Las formalidades habilitantes (como la autorización judicial para enajenar bienes de un menor) miran al estado o calidad de las partes. Su omisión, según el Art. 1682 del Código Civil, acarrea la Nulidad Relativa."
    },
    {
        pregunta: "En materia de Nulidad Absoluta, ¿quién NO puede alegarla para solicitar que se declare nulo el acto o contrato?",
        opciones: ["A. El Ministerio Público en interés de la moral o de la ley.", "B. Cualquier persona que tenga interés en ello.", "C. El que ejecutó el acto o celebró el contrato, sabiendo o debiendo saber el vicio que lo invalidaba.", "D. El juez, de oficio, cuando aparece de manifiesto en el acto o contrato."],
        correcta: 2,
        explicacion: "El Art. 1683 establece el principio de que 'nadie puede aprovecharse de su propio dolo'. Por tanto, quien sabía o debía saber el vicio (ej. objeto ilícito) al momento de contratar, no está legitimado para pedir la nulidad absoluta."
    },
    {
        pregunta: "Respecto de los terceros, la declaración de nulidad judicialmente pronunciada (Nulidad Absoluta o Relativa) produce el siguiente efecto:",
        opciones: ["A. Da acción reivindicatoria contra terceros poseedores, sin importar si están de buena o mala fe.", "B. Solo afecta a los terceros si se prueba que estaban de mala fe.", "C. Es inoponible a terceros adquirentes a título oneroso.", "D. Afecta solo a los terceros que adquirieron derechos personales, no reales."],
        correcta: 0,
        explicacion: "El Art. 1689 es categórico: 'La nulidad judicialmente pronunciada da acción reivindicatoria contra terceros poseedores; sin perjuicio de las excepciones legales'. La buena fe del tercero no paraliza la acción reivindicatoria derivada de la nulidad en el sistema chileno."
    },
    {
        pregunta: "La 'inoponibilidad' por falta de publicidad (ej. falta de inscripción de la cesión de un crédito) tiene como consecuencia que:",
        opciones: ["A. El acto es nulo absolutamente de pleno derecho.", "B. El acto es válido entre las partes, pero sus efectos no pueden hacerse valer frente a terceros.", "C. El acto debe ser ratificado por el juez para valer.", "D. Convierte a las partes en deudores solidarios frente al tercero."],
        correcta: 1,
        explicacion: "La inoponibilidad es una sanción de ineficacia respecto de terceros. El acto es perfectamente válido entre quienes lo celebran (ej. cedente y cesionario), pero al faltar la publicidad exigida, los terceros (ej. el deudor cedido) pueden actuar como si el acto no existiera."
    },
    {
        pregunta: "El plazo para pedir la Nulidad Relativa por vicio de 'fuerza' se cuenta desde:",
        opciones: ["A. La fecha de celebración del contrato.", "B. El día en que se descubre el error.", "C. El día en que hubiere cesado la fuerza.", "D. El día en que se dicte la sentencia."],
        correcta: 2,
        explicacion: "El Art. 1691 señala expresamente que el plazo de 4 años para pedir la rescisión (nulidad relativa) en el caso de la fuerza, se cuenta desde el día en que esta hubiere cesado."
    },
    {
        pregunta: "Si en un contrato de compraventa, el vendedor sufre de 'incapacidad relativa' (ej. menor adulto), pero mediante dolo induce al comprador a creer que era mayor de edad, ¿qué ocurre con la nulidad?",
        opciones: ["A. El menor no podrá alegar la nulidad de ninguna forma.", "B. El menor o su representante pueden alegar la nulidad sin restricciones.", "C. El comprador pierde el derecho a exigir la restitución del precio.", "D. El acto pasa a ser nulo absolutamente."],
        correcta: 0,
        explicacion: "El Art. 1685 del Código Civil establece que si de parte del incapaz ha habido dolo para inducir al acto, ni él ni sus herederos o cesionarios podrán alegar la nulidad."
    },
    {
        pregunta: "En los actos simulados, frente a un conflicto entre las partes del acto y un tercero de buena fe que adquirió un derecho basado en el 'acto aparente', ¿qué prevalece?",
        opciones: ["A. La voluntad real (el acto oculto) anula siempre el derecho del tercero.", "B. El tercero de buena fe puede invocar el acto aparente, siendo inoponible la simulación respecto a él.", "C. El contrato se rescilia y se devuelve el dinero al tercero.", "D. Se requiere la autorización del juez para resolver el conflicto."],
        correcta: 1,
        explicacion: "En la simulación, la doctrina protege a los terceros de buena fe aplicando la inoponibilidad por fraude. El tercero confió en la apariencia creada por las partes, por lo que puede ampararse en el acto simulado."
    },
    // ==========================================
    // MÓDULO 6: TRADICIÓN, REGISTRO Y POSESIÓN (BIENES)
    // ==========================================
    {
        pregunta: "Los bienes que rinden un producto periódico, sin detrimento sensible de su sustancia, se denominan jurídicamente:",
        opciones: ["A. Productos.", "B. Frutos civiles.", "C. Frutos (naturales o civiles).", "D. Bienes consuntibles."],
        correcta: 2,
        explicacion: "En la teoría de los bienes, los frutos son aquellos que la cosa da periódicamente y sin alteración sensible de su sustancia, a diferencia de los 'productos', cuya extracción implica el agotamiento de la cosa (ej. carbón de una mina)."
    },
    {
        pregunta: "Para que la tradición de un derecho real sobre bienes raíces sea válida en Chile, el título que la antecede (ej. la compraventa) debe ser:",
        opciones: ["A. Consensual.", "B. Un título translaticio de dominio, que además conste por escritura pública si la ley lo exige para ese contrato.", "C. Judicial, dictado por sentencia.", "D. Gratuito."],
        correcta: 1,
        explicacion: "El Art. 675 exige un título translaticio de dominio (como venta, permuta o donación). Además, tratándose de inmuebles, el Art. 1801 exige que la compraventa se otorgue por escritura pública como solemnidad."
    },
    {
        pregunta: "El Conservador de Bienes Raíces (CBR) cumple diversos roles en el sistema jurídico chileno. ¿Cuál de los siguientes NO es un fin de la inscripción conservatoria?",
        opciones: ["A. Servir como único y exclusivo modo de adquirir el dominio de los bienes muebles.", "B. Realizar la tradición de los bienes raíces y de los derechos reales constituidos en ellos.", "C. Mantener la historia de la propiedad raíz y sus gravámenes.", "D. Servir de requisito, prueba y garantía de la posesión de los inmuebles."],
        correcta: 0,
        explicacion: "La inscripción en el CBR no aplica a los bienes muebles por regla general (ej. comprar un auto o un libro). Para los muebles, la tradición se efectúa por la entrega material o simbólica (Art. 684)."
    },
    {
        pregunta: "En la figura de la 'Agregación de Posesiones' (Art. 717 CC), si el poseedor actual decide agregar la posesión de su antecesor para alcanzar el plazo de prescripción, esta agregación:",
        opciones: ["A. Es facultativa, pero si decide agregarla, se la apropia con sus calidades y vicios.", "B. Es obligatoria por el principio de continuidad de la propiedad.", "C. Permite separar los vicios de la posesión anterior, asumiendo solo la buena fe.", "D. Transforma automáticamente la posesión irregular en regular."],
        correcta: 0,
        explicacion: "El Art. 717 establece que el poseedor puede agregar a la suya la posesión de sus antecesores, pero si lo hace, se la apropia con sus calidades y vicios. No puede elegir solo 'lo bueno' de la posesión anterior."
    },
    {
        pregunta: "La principal diferencia entre la 'Suspensión' y la 'Interrupción' de la prescripción es que:",
        opciones: ["A. La interrupción se aplica solo a los menores, la suspensión a los dementes.", "B. La interrupción hace perder todo el tiempo corrido anteriormente, mientras que la suspensión solo detiene el cómputo sin perder el tiempo ya transcurrido.", "C. La suspensión extingue la obligación, la interrupción no.", "D. La interrupción opera a favor de la mujer casada en sociedad conyugal."],
        correcta: 1,
        explicacion: "La interrupción (natural o civil) borra todo el tiempo de posesión anterior. En cambio, la suspensión (Art. 2509) es un beneficio legal a favor de ciertas personas (menores, dementes, etc.) que solo 'congela' el plazo mientras dura la incapacidad."
    },
    {
        pregunta: "Existe 'Interrupción Natural' de la prescripción adquisitiva cuando:",
        opciones: ["A. El dueño interpone una demanda reivindicatoria y esta es notificada legalmente.", "B. El predio se inunda y es imposible ejercer actos posesorios, o cuando la posesión pasa a otras manos por haber entrado otro en ella.", "C. Se inscribe una medida precautoria en el Conservador.", "D. El poseedor reconoce expresamente el dominio del dueño."],
        correcta: 1,
        explicacion: "El Art. 2502 define la interrupción natural, que ocurre cuando sin haber pasado la posesión a otras manos se hace imposible el ejercicio de actos posesorios (ej. inundación), o cuando se ha perdido la posesión por haber entrado en ella otra persona."
    },
    {
        pregunta: "La Acción Reivindicatoria exige como requisito fundamental que el actor deba:",
        opciones: ["A. Probar la posesión material durante 5 años.", "B. Demostrar su calidad de mero tenedor amparado por un contrato.", "C. Probar su calidad de dueño de la cosa singular reivindicada.", "D. Requerir previamente el pago de rentas atrasadas."],
        correcta: 2,
        explicacion: "La acción reivindicatoria (Art. 889) compete al dueño que ha perdido la posesión, por lo tanto, el onus probandi (carga de la prueba) de demostrar el dominio íntegro y exclusivo recae sobre quien demanda."
    },
    {
        pregunta: "En el contexto del juicio reivindicatorio y las prestaciones mutuas, las 'Mejoras Útiles' (aquellas que aumentan el valor venal de la cosa) deben ser abonadas por el reivindicante al poseedor vencido:",
        opciones: ["A. Solo si el poseedor estaba de buena fe al momento de hacerlas.", "B. Siempre, sin importar si el poseedor estaba de buena o mala fe.", "C. Solo si el poseedor es irregular.", "D. Nunca, las mejoras útiles quedan siempre a beneficio del dueño sin pago alguno."],
        correcta: 0,
        explicacion: "El Art. 909 establece que el poseedor de buena fe tiene derecho a que se le abonen las mejoras útiles hechas antes de la contestación de la demanda. El poseedor de mala fe no tiene este derecho, pero puede llevarse los materiales si no causan detrimento."
    },
    // ==========================================
    // MÓDULO 7: ACCIONES POSESORIAS Y LIMITACIONES AL DOMINIO
    // ==========================================
    {
        pregunta: "La Querella o Acción de Amparo tiene por objeto directo:",
        opciones: ["A. Recuperar la posesión material que ya ha sido arrebatada por violencia.", "B. Conservar la posesión de los bienes raíces o de derechos reales constituidos en ellos, cuando el poseedor es turbado o molestado en ella.", "C. Reivindicar el derecho de dominio frente al Fisco.", "D. Solicitar la partición de la comunidad hereditaria."],
        correcta: 1,
        explicacion: "El Art. 921 del Código Civil dispone que el poseedor tiene derecho para pedir que no se le turbe o embarace su posesión o se le despoje de ella (Querella de Amparo), la cual prescribe en 1 año desde la molestia."
    },
    {
        pregunta: "Si a un poseedor se le ha despojado injustamente de la posesión material de su inmueble, la acción posesoria idónea que debe interponer es:",
        opciones: ["A. Querella de Amparo.", "B. Acción de Precario.", "C. Querella de Restitución.", "D. Denuncia de Obra Nueva."],
        correcta: 2,
        explicacion: "La Querella de Restitución (Art. 926) tiene por objeto recuperar la posesión de que ha sido injustamente privado el poseedor (hubo despojo, no mera turbación)."
    },
    {
        pregunta: "El derecho de 'Usufructo' se caracteriza por ser un derecho real que:",
        opciones: ["A. Otorga al titular las facultades de uso, goce y disposición absoluta.", "B. Consiste en la facultad de gozar de una cosa con cargo de conservar su forma y sustancia, y de restituirla a su dueño.", "C. Es perpetuo e intransmisible a los herederos.", "D. Solo puede recaer sobre cosas fungibles (cuasiusufructo excluido)."],
        correcta: 1,
        explicacion: "El Art. 764 define el usufructo como un derecho real que consiste en la facultad de gozar de una cosa con cargo de conservar su forma y substancia, y de restituirla a su dueño, si la cosa no es fungible."
    },
    {
        pregunta: "La limitación al dominio conocida como 'Propiedad Fiduciaria' exige como requisito de la esencia:",
        opciones: ["A. La existencia de una condición, la cual, al cumplirse, obliga a restituir la cosa a un tercero (fideicomisario).", "B. El pago de un canon anual al Conservador.", "C. Que recaiga exclusivamente sobre bienes muebles.", "D. Que no exceda de 5 años de plazo."],
        correcta: 0,
        explicacion: "El Art. 733 establece que la propiedad fiduciaria es la que está sujeta al gravamen de pasar a otra persona por el hecho de verificarse una condición. La condición resolutoria (para el fiduciario) es esencial."
    },
    {
        pregunta: "El derecho de 'Uso y Habitación' se diferencia del usufructo principalmente porque:",
        opciones: ["A. Otorga derecho a percibir todos los frutos de la cosa.", "B. Es un derecho real que permite transferir la cosa.", "C. Es intransmisible e intransferible, limitándose a las necesidades personales del usuario o habitador y su familia.", "D. Solo recae sobre bienes raíces rústicos."],
        correcta: 2,
        explicacion: "El Art. 811 consagra el derecho de uso (y habitación si se refiere a una casa). El Art. 819 recalca que estos derechos son personalísimos, inalienables a herederos y no pueden cederse a ningún título."
    },
    {
        pregunta: "Las Servidumbres Legales son aquellas que:",
        opciones: ["A. Nacen exclusivamente por un contrato entre privados ante Notario Público.", "B. Son impuestas por la ley, ya sea por utilidad pública (ej. riberas para pesca) o por utilidad de los particulares (ej. servidumbre de tránsito para predios destituidos de comunicación).", "C. Operan solo en beneficio del Fisco chileno.", "D. Tienen un plazo de vigencia predeterminado de 10 años."],
        correcta: 1,
        explicacion: "El Art. 839 del CC define las servidumbres legales como aquellas impuestas por la ley, independientemente de la voluntad del dueño del predio sirviente, clasificándolas en de utilidad pública y utilidad de los particulares."
    },
    {
        pregunta: "Un ejemplo clásico de Servidumbre Natural, que no requiere inscripción ni pago de indemnización obligatoria por su ejercicio ordinario, es:",
        opciones: ["A. La servidumbre de luz y vista.", "B. La servidumbre de tránsito ciego.", "C. La servidumbre de libre descenso de las aguas desde los predios superiores a los inferiores.", "D. La servidumbre de acueducto industrial."],
        correcta: 2,
        explicacion: "El Art. 833 dispone que el predio inferior está sujeto a recibir las aguas que descienden del predio superior naturalmente, esto es, sin que la mano del hombre contribuya a ello. Es la única servidumbre propiamente 'natural' del CC."
    },
    {
        pregunta: "¿Puede adquirirse una servidumbre continua y aparente (como la de acueducto) por prescripción?",
        opciones: ["A. Sí, por prescripción adquisitiva ordinaria de 5 años.", "B. Sí, por la posesión de 5 años, sin importar si hay justo título y buena fe.", "C. No, las servidumbres nunca se prescriben.", "D. Solo por decreto judicial supremo."],
        correcta: 1,
        explicacion: "El Art. 882 establece excepcionalmente que las servidumbres continuas y aparentes pueden adquirirse por título o por la prescripción de 5 años. Las discontinuas o inaparentes no pueden adquirirse por prescripción, solo por título."
    },
    {
        pregunta: "En el procedimiento del DL 2.695 (Saneamiento de la pequeña propiedad raíz), una vez cumplido un año desde la inscripción de la resolución en el CBR:",
        opciones: ["A. El solicitante se convierte en mero tenedor.", "B. El solicitante adquiere el dominio por prescripción, produciéndose la 'cancelación legal' del dominio anterior.", "C. El verdadero dueño tiene 10 años adicionales para reivindicar.", "D. El Estado expropia el terreno para el uso público."],
        correcta: 1,
        explicacion: "El DL 2.695 establece un procedimiento rápido. La resolución inscrita sirve de justo título, y transcurrido el plazo de 1 año de posesión inscrita, el solicitante se hace dueño pleno por prescripción, extinguiendo los derechos del antiguo titular."
    },
    {
        pregunta: "Si el testador deja una herencia a 'sus herederos universales' sin asignarles cuotas específicas, estos suceden:",
        opciones: ["A. Por cabezas, en partes iguales sobre la totalidad del patrimonio.", "B. En proporción a la edad de cada heredero.", "C. Exclusivamente en los bienes muebles, pero no en los inmuebles.", "D. Solo como legatarios de la cuarta de mejoras."],
        correcta: 0,
        explicacion: "De acuerdo al Título de la Sucesión, los asignatarios a título universal, a quienes no se ha designado cuota, son herederos universales y dividen la herencia por partes iguales (por cabezas), sucediendo en todos los bienes, derechos y obligaciones transmisibles del difunto."
   },
    // ==========================================
    // MÓDULO 8: POSESIÓN, PRESTACIONES MUTUAS Y MERA TENENCIA
    // ==========================================
    {
        pregunta: "La regla general del Código Civil respecto a la inmutabilidad de la mera tenencia (Art. 716) señala que:",
        opciones: ["A. La mera tenencia se transforma en posesión regular a los 5 años.", "B. El simple lapso de tiempo no muda la mera tenencia en posesión.", "C. El mero tenedor puede usucapir si inscribe la propiedad.", "D. El mero tenedor adquiere los frutos por el paso del tiempo."],
        correcta: 1,
        explicacion: "El Art. 716 consagra el principio de inmutabilidad: el simple lapso de tiempo no muda la mera tenencia en posesión. Salvo la rarísima excepción del Art. 2510 regla 3ra (que exige que el dueño no haya reclamado y el tenedor no haya reconocido dominio en 10 años)."
    },
    {
        pregunta: "En el juicio reivindicatorio, respecto de los deterioros que ha sufrido la cosa, el poseedor de 'buena fe':",
        opciones: ["A. Responde siempre de todo deterioro, sea por su culpa o por caso fortuito.", "B. No responde de los deterioros, sino en cuanto se hubiere hecho más rico con ellos (ej. cortando y vendiendo madera de un bosque).", "C. Responde solo de los deterioros ocurridos después de la dictación de la sentencia.", "D. Paga el doble del valor de los deterioros."],
        correcta: 1,
        explicacion: "El Art. 906 del CC protege al poseedor de buena fe (antes de la contestación de la demanda). Como se creía dueño, pudo haber destruido parte de la cosa, y no responde por ello, salvo si obtuvo un provecho económico (se hizo más rico)."
    },
    {
        pregunta: "Las 'mejoras voluptuarias' (las que solo consisten en objetos de lujo y recreo) en las prestaciones mutuas:",
        opciones: ["A. Deben ser pagadas obligatoriamente por el reivindicante al poseedor de buena fe.", "B. El reivindicante no está obligado a pagarlas, pero el poseedor (de buena o mala fe) puede llevarse los materiales si pueden separarse sin detrimento.", "C. Quedan siempre a beneficio del reivindicante sin derecho a retiro.", "D. Se pagan a la mitad de su valor."],
        correcta: 1,
        explicacion: "El Art. 911 señala que el dueño no está obligado a abonar las mejoras voluptuarias a ningún poseedor, pero les concede el 'ius tollendi' (derecho de retiro) de los materiales, siempre que la cosa no sufra daño y el dueño no prefiera comprarlos."
    },
    {
        pregunta: "Si una persona recupera legalmente la posesión de la cual fue privada, la ley presume (Art. 731):",
        opciones: ["A. Que debe comenzar a contar el plazo de prescripción desde cero.", "B. Que ha tenido la posesión durante todo el tiempo intermedio, sin interrupción.", "C. Que su posesión se transformó en irregular.", "D. Que el usurpador le debe ceder sus propios plazos."],
        correcta: 1,
        explicacion: "Es una ficción legal de continuidad. El que recupera legalmente la posesión perdida se entenderá haberla tenido durante todo el tiempo intermedio (lo que borra la interrupción natural)."
    },
    // ==========================================
    // MÓDULO 9: TEORÍA DE LA CAUSA Y MODALIDADES
    // ==========================================
    {
        pregunta: "En el derecho civil chileno, respecto de la prueba de la Causa en los contratos (Art. 1467):",
        opciones: ["A. Debe siempre expresarse claramente en el contrato para que este sea válido.", "B. No es necesario expresarla, la ley presume que todo contrato tiene una causa real y lícita.", "C. Quien alega que existe una causa debe probarlo mediante testigos.", "D. Solo se requiere probarla en los contratos gratuitos."],
        correcta: 1,
        explicacion: "El Art. 1467 establece que no es necesario expresar la causa. La doctrina deriva de aquí la presunción de existencia y licitud de la causa; recayendo la carga de la prueba en quien alega que el acto carece de ella o que es ilícita."
    },
    {
        pregunta: "El fraude a la ley (buscar un resultado antijurídico amparándose en una norma lícita) es sancionado en nuestra doctrina civil principalmente por constituir:",
        opciones: ["A. Falta de consentimiento.", "B. Error esencial.", "C. Causa ilícita o fraude a la ley prohibitiva (Art. 10).", "D. Lesión enorme."],
        correcta: 2,
        explicacion: "El fraude a la ley se sanciona con nulidad absoluta, ya sea porque se entiende que viola el Art. 10 (actos prohibidos por la ley son nulos), o bien porque el móvil (causa final) busca eludir el cumplimiento de la ley, siendo una causa ilícita."
    },
    {
        pregunta: "En el caso de una obligación sujeta a 'condición suspensiva', mientras la condición se encuentra 'pendiente':",
        opciones: ["A. El acreedor puede exigir el pago inmediatamente.", "B. El deudor que paga por error no puede pedir restitución.", "C. No nace el derecho ni la obligación, pero el acreedor tiene una mera expectativa y puede impetrar providencias conservativas.", "D. El contrato se anula."],
        correcta: 2,
        explicacion: "El Art. 1492 señala que el acreedor condicional no puede exigir el cumplimiento (el derecho no ha nacido), pero sí puede impetrar providencias conservativas para proteger su expectativa de derecho."
    },
    {
        pregunta: "El 'plazo extintivo' se diferencia de la 'condición resolutoria' en que el plazo:",
        opciones: ["A. Es un hecho futuro e incierto.", "B. Opera retroactivamente, borrando los efectos del contrato desde su inicio.", "C. Es un hecho futuro y cierto, y su cumplimiento no tiene efecto retroactivo, sino que extingue el derecho hacia el futuro (ex nunc).", "D. Solo se aplica a las compraventas."],
        correcta: 2,
        explicacion: "El plazo es futuro y cierto (llegará de todas formas). A diferencia de la condición resolutoria que borra el derecho como si nunca hubiera existido (efecto retroactivo o ex tunc), el plazo solo le pone fin hacia el futuro."
    },
    // ==========================================
    // MÓDULO 10: EL PAGO Y EXTINCIÓN DE OBLIGACIONES
    // ==========================================
    {
        pregunta: "Si un tercero extraño paga una deuda 'sin el conocimiento' del deudor:",
        opciones: ["A. Se subroga en todos los derechos del acreedor, incluyendo garantías y privilegios.", "B. Solo tiene derecho a que el deudor le reembolse lo pagado, pero no se subroga legalmente en los derechos del acreedor.", "C. No tiene derecho a reembolso alguno, perdiendo su dinero.", "D. El pago es nulo y el acreedor debe devolver el dinero."],
        correcta: 1,
        explicacion: "Según el Art. 1573, el que paga sin el conocimiento del deudor no tendrá acción sino para que este le reembolse lo pagado, y no se entenderá subrogado legalmente, a menos que el acreedor le ceda voluntariamente su acción."
    },
    {
        pregunta: "El pago efectuado por un tercero 'contra la voluntad' del deudor genera el siguiente efecto (Art. 1574):",
        opciones: ["A. Obliga al deudor a reembolsar íntegramente con intereses.", "B. El tercero no tiene derecho a reembolso alguno por parte del deudor, a menos que el acreedor le ceda voluntariamente su acción.", "C. Produce la subrogación legal automática.", "D. Transforma al tercero en deudor solidario."],
        correcta: 1,
        explicacion: "El que paga contra la voluntad del deudor no tiene derecho a que el deudor le reembolse (Art. 1574), salvo que consiga que el acreedor que recibió el pago le ceda convencionalmente sus derechos."
    },
    {
        pregunta: "La 'Subrogación Legal' ocurre por el ministerio de la ley, aun contra la voluntad del acreedor, en casos como:",
        opciones: ["A. El del prestamista que paga una obligación natural.", "B. El del comprador de un inmueble que paga a los acreedores hipotecarios que tenían créditos sobre la propiedad.", "C. El del tercero que paga una deuda ajena contra la voluntad del deudor.", "D. El del deudor principal que paga su propia deuda."],
        correcta: 1,
        explicacion: "El Art. 1610 enumera los casos de subrogación legal, destacando el N° 2: A favor del que habiendo comprado un inmueble, es obligado a pagar a los acreedores a quienes el inmueble está hipotecado."
    },
    {
        pregunta: "En el 'Pago de lo no debido', para que quien pagó por error pueda exigir la restitución (condictio indebiti), es necesario probar:",
        opciones: ["A. Que el pago se hizo bajo amenaza o fuerza física.", "B. Que no existía obligación alguna (o se pagó a quien no era acreedor) y que el pago se hizo por error.", "C. Que hubo dolo por parte del que recibió el pago.", "D. Que el monto superaba las 100 UF."],
        correcta: 1,
        explicacion: "El cuasicontrato del pago de lo no debido (Art. 2295) exige dos requisitos: la inexistencia de la deuda (o pago a persona equivocada/por persona equivocada) y el error en el pago (incluso error de derecho según el Art. 2297)."
    },
    {
        pregunta: "En la dación en pago, si la nueva cosa entregada por el deudor al acreedor sufre evicción (resulta ser de un tercero que la reclama judicialmente):",
        opciones: ["A. Renace la obligación antigua con todos sus privilegios e hipotecas.", "B. La obligación antigua no renace, pero el acreedor tiene derecho a ser indemnizado por las reglas de la compraventa.", "C. El deudor queda libre de toda responsabilidad.", "D. El acreedor pierde su derecho y debe pagar las costas."],
        correcta: 1,
        explicacion: "Gran parte de la doctrina asimila la dación en pago a una compraventa o una novación. La posición mayoritaria indica que la obligación original se extinguió irrevocablemente, y el acreedor solo tiene la acción de saneamiento por evicción contra el deudor."
    },
    // ==========================================
    // MÓDULO 11: RESPONSABILIDAD EXTRACONTRACTUAL PROFUNDA
    // ==========================================
    {
        pregunta: "El dueño de un animal 'fiero', de que no se reporta utilidad para la guarda de un predio, si causa daño:",
        opciones: ["A. Responde solo si se prueba que actuó con dolo.", "B. Responde solo si la víctima demuestra que el dueño fue negligente al amarrarlo.", "C. Es siempre responsable del daño que cause, sin importar si alega que no pudo impedir el daño (presunción de derecho de culpa).", "D. No responde, el riesgo lo asume la comunidad."],
        correcta: 2,
        explicacion: "El Art. 2327 contiene una presunción de derecho ineludible (responsabilidad casi objetiva pura). El daño causado por un animal fiero inútil imputa responsabilidad absoluta al que lo tenga, no admitiéndose prueba en contrario."
    },
    {
        pregunta: "La responsabilidad de los padres por los delitos o cuasidelitos cometidos por sus hijos menores que habitan en su misma casa:",
        opciones: ["A. Se rige por la responsabilidad objetiva absoluta.", "B. Es una presunción simplemente legal de culpa in vigilando, pudiendo eximirse si prueban que con la autoridad y cuidado respectivo no hubieran podido impedir el hecho.", "C. Solo aplica si los hijos son mayores de 16 años.", "D. Solo aplica a los daños en el colegio."],
        correcta: 1,
        explicacion: "Es el caso clásico del Art. 2320 inc. 2. Existe presunción de culpa, pero el padre puede eximirse probando que empleó el cuidado y la vigilancia debidos (Art. 2320 inciso final)."
    },
    {
        pregunta: "Si un daño es imputable a la concurrencia de causas atribuibles a varias personas independientes entre sí (pero no actuaron en conjunto):",
        opciones: ["A. Todos son solidariamente responsables frente a la víctima.", "B. Nadie responde, el caso fortuito los exime.", "C. Cada uno responde por su cuota o parte en la generación del daño (no hay solidaridad porque no hubo concierto previo).", "D. Solo responde el de mayor patrimonio."],
        correcta: 0,
        explicacion: "La doctrina moderna y la jurisprudencia interpretan ampliamente el Art. 2317: todos aquellos cuya acción u omisión culpable concurrió a causar un mismo daño, responden solidariamente, sin importar si actuaron concertados o no."
    },
    {
        pregunta: "El principio de reparación integral del daño en materia extracontractual implica que:",
        opciones: ["A. La indemnización debe ser superior al daño causado para servir de escarmiento.", "B. La indemnización debe limitarse solo al daño material o patrimonial directo.", "C. La indemnización debe poner a la víctima en la misma situación en que se encontraría si el hecho dañoso no hubiera ocurrido, sin que implique un enriquecimiento sin causa.", "D. El Estado complementará la indemnización si el deudor es insolvente."],
        correcta: 2,
        explicacion: "El principio basal es que todo el daño debe ser reparado (emergente, lucro cesante y moral), pero nada más que el daño. La indemnización civil tiene carácter compensatorio, no punitivo (no existen los 'daños punitivos' como en EE.UU.)."
    },
    // ==========================================
    // MÓDULO 12: TEORÍA GENERAL Y LEY
    // ==========================================
    {
        pregunta: "De acuerdo a la Ley sobre Efecto Retroactivo de las Leyes, respecto de los contratos válidamente celebrados:",
        opciones: ["A. Una ley nueva puede modificar sus cláusulas inmediatamente.", "B. En todo contrato se entienden incorporadas las leyes vigentes al tiempo de su celebración.", "C. Los contratos caducan si cambia la ley que los regula.", "D. Se rigen por la ley vigente al momento de su término."],
        correcta: 1,
        explicacion: "El Art. 22 de la LSERL consagra la teoría de los derechos adquiridos en materia contractual. Las leyes vigentes al tiempo de celebrar un contrato se entienden incorporadas a él (excepto leyes procesales o de apremio)."
    },
    {
        pregunta: "En el Derecho Civil chileno, la 'Costumbre' (Art. 2 CC):",
        opciones: ["A. Constituye derecho siempre que no sea contraria a la moral.", "B. No constituye derecho sino en los casos en que la ley se remite a ella (costumbre secundum legem).", "C. Suple el silencio de la ley en materias contractuales (costumbre praeter legem).", "D. Puede derogar una ley antigua (costumbre contra legem)."],
        correcta: 1,
        explicacion: "En materia civil, la costumbre es muy restringida. El Art. 2 establece claramente que la costumbre no constituye derecho sino en los casos en que la ley se remite a ella explícitamente (ej. Art. 1940 sobre reparaciones locativas)."
    },
    {
        pregunta: "La derogación 'tácita' de una ley ocurre cuando:",
        opciones: ["A. El Congreso dicta una ley que dice 'derógase la ley X'.", "B. La nueva ley contiene disposiciones que no pueden conciliarse con las de la ley anterior.", "C. Una ley deja de aplicarse por desuso prolongado (desuetudo).", "D. Un tribunal declara la ley inconstitucional en un fallo."],
        correcta: 1,
        explicacion: "El Art. 52 del CC define la derogación tácita. Ocurre cuando la nueva ley contiene disposiciones incompatibles con la antigua. El desuso no deroga la ley en Chile."
    },
    {
        pregunta: "En las reglas de Interpretación de la Ley (Art. 19 CC), si el sentido de la ley es claro:",
        opciones: ["A. No se desatenderá su tenor literal a pretexto de consultar su espíritu.", "B. El juez debe buscar obligatoriamente la historia fidedigna de su establecimiento.", "C. Se aplicará siempre la equidad natural por sobre el texto.", "D. El juez debe elevar consulta a la Corte Suprema."],
        correcta: 0,
        explicacion: "Es el elemento Gramatical de interpretación. El Art. 19 inc. 1 señala que cuando el sentido de la ley es claro, no se desatenderá su tenor literal a pretexto de consultar su espíritu."
    },
    {
        pregunta: "Cuando la ley utiliza una 'presunción de derecho' (presunción iure et de iure):",
        opciones: ["A. Permite a la contraparte rendir prueba para desvirtuarla.", "B. Obliga al juez a pedir informes periciales.", "C. No se admite prueba en contrario, asumiendo el hecho como una verdad inamovible.", "D. Solo se aplica en el derecho penal, no en el civil."],
        correcta: 2,
        explicacion: "El Art. 47 del CC señala que si una presunción es de derecho, se rechaza la prueba que intente demostrar que el hecho presumido es falso. (A diferencia de las presunciones simplemente legales, que sí admiten prueba en contrario)."
    },
    {
        pregunta: "El domicilio civil (Art. 59) se compone de dos elementos inseparables:",
        opciones: ["A. Residencia material y el pago de contribuciones.", "B. La residencia acompañada del ánimo (real o presuntivo) de permanecer en ella.", "C. La nacionalidad y el registro civil.", "D. La propiedad de un bien raíz y el asiento familiar."],
        correcta: 1,
        explicacion: "El domicilio es la residencia (elemento material u objetivo) acompañada del ánimo de permanecer en ella (elemento psicológico o subjetivo)."
    },
    {
        pregunta: "La existencia legal de toda persona principia al nacer (Art. 74). Para que esto ocurra, la ley exige:",
        opciones: ["A. Haber sido concebido dentro del matrimonio.", "B. Estar inscrito en el Registro Civil dentro de 30 días.", "C. Separarse completamente de su madre y haber sobrevivido a la separación un momento siquiera.", "D. Pesar más de un kilo al momento del parto."],
        correcta: 2,
        explicacion: "El Art. 74 define el principio de la existencia legal. Requiere separación completa del cuerpo de la madre (corte del cordón umbilical) y sobrevivencia a dicha separación, aunque sea por un instante."
    },
{
        pregunta: "Respecto a la muerte presunta (Art. 80), el principal objetivo de esta declaración judicial es:",
        opciones: ["A. Perseguir penalmente al homicida del desaparecido.", "B. Liberar de impuestos los bienes del ausente.", "C. Proteger el interés del desaparecido, de los terceros que tienen derechos sobre sus bienes, y permitir la apertura de su sucesión.", "D. Declarar el divorcio automático de su cónyuge al año de desaparición."],
        correcta: 2,
        explicacion: "La muerte presunta busca solucionar la incerteza jurídica de la persona desaparecida sin que se tenga noticia de ella por un largo tiempo (5 años regla general), permitiendo administrar su patrimonio y eventualmente repartirlo a sus herederos."
    },
    // ==========================================
    // NUEVO BLOQUE 1 DE 5: LEY, PERSONAS Y OBLIGACIONES I
    // ==========================================
    {
        pregunta: "Según la Teoría de la Ley en Chile, la costumbre jurídica en materia civil:",
        opciones: ["A. Suple el silencio de la ley en todo caso (costumbre praeter legem).", "B. Puede derogar una ley si su uso es generalizado y constante (costumbre contra legem).", "C. No constituye derecho sino en los casos en que la ley se remite a ella (costumbre secundum legem).", "D. Tiene la misma fuerza obligatoria que la jurisprudencia de la Corte Suprema."],
        correcta: 2,
        explicacion: "El Art. 2 del Código Civil chileno consagra la estricta limitación de la costumbre, estableciendo que 'no constituye derecho sino en los casos en que la ley se remite a ella' (costumbre secundum legem)."
    },
    {
        pregunta: "Una norma jurídica se caracteriza por su 'heteronomía', lo cual significa que:",
        opciones: ["A. Regula conductas tanto internas como externas del ser humano.", "B. Es impuesta por una voluntad exterior (la del creador de la norma), debiendo acatarse independientemente de la adhesión íntima del sujeto.", "C. Admite la posibilidad de ser cumplida por la fuerza pública.", "D. No prevé casos concretos, sino situaciones-tipo abstractas."],
        correcta: 1,
        explicacion: "La heteronomía es la característica de la norma jurídica que indica su origen externo; es creada por una autoridad (el legislador) y se impone al sujeto obligado sin importar si este está moral o íntimamente de acuerdo con ella."
    },
    {
        pregunta: "En las reglas de interpretación de la ley, cuando el juez atiende a la 'historia fidedigna de su establecimiento' (Art. 19 inc. 2), está aplicando el elemento:",
        opciones: ["A. Lógico.", "B. Sistemático.", "C. Gramatical.", "D. Histórico."],
        correcta: 3,
        explicacion: "El elemento histórico de la interpretación busca el sentido de la ley en la historia de su dictación, esto es, en el mensaje del Ejecutivo, las mociones, actas de comisiones y debates parlamentarios."
    },
    {
        pregunta: "La 'derogación tácita' de una ley (Art. 52 CC) se produce cuando:",
        opciones: ["A. La nueva ley señala expresamente 'derógase la ley X'.", "B. La ley antigua deja de aplicarse por más de 10 años (desuetudo).", "C. La nueva ley contiene disposiciones que no pueden conciliarse con las de la ley anterior.", "D. El Tribunal Constitucional así lo declara."],
        correcta: 2,
        explicacion: "El Art. 52 y 53 del CC establecen que la derogación tácita ocurre cuando la nueva ley contiene disposiciones incompatibles con las de la antigua, subsistiendo la original en todo aquello que no pugne con la nueva."
    },
    {
        pregunta: "Según el Código Civil, la 'existencia legal' de toda persona natural principia:",
        opciones: ["A. Con la concepción.", "B. Al momento de la inscripción en el Registro Civil.", "C. Al separarse completamente de su madre, habiendo sobrevivido a la separación un momento siquiera.", "D. A las 24 horas después del parto."],
        correcta: 2,
        explicacion: "El Art. 74 consagra la teoría de la vitalidad. Se exige la separación completa (corte del cordón umbilical) y la sobrevivencia, aunque sea por un instante. La criatura que muere en el vientre materno se reputa no haber existido jamás."
    },
    {
        pregunta: "La presunción del Artículo 76 del Código Civil sobre la época de la concepción es una presunción:",
        opciones: ["A. Simplemente legal, pues admite prueba de ADN en contrario en todo caso.", "B. De derecho, asumiendo que la concepción ha precedido al nacimiento no menos de 180 días cabales, y no más de 300.", "C. Judicial, pues depende de la apreciación del juez de familia.", "D. Exclusiva para la determinación de herencias intestadas."],
        correcta: 1,
        explicacion: "El Art. 76 establece una presunción de derecho (iure et de iure) para fijar la época de la concepción, lapso vital para determinar filiación y derechos del nasciturus. No admite prueba en contra respecto al cálculo de plazos (180 a 300 días)."
    },
    {
        pregunta: "Si a un 'nasciturus' (el que está por nacer) se le defiere una herencia, ¿qué ocurre con esos derechos según el Art. 77 del Código Civil?",
        opciones: ["A. Se adjudican de inmediato a su madre.", "B. Pasan directamente al Fisco.", "C. Quedan suspensos hasta que el nacimiento se efectúe; si nace vivo, entra en el goce de dichos derechos.", "D. Caducan automáticamente."],
        correcta: 2,
        explicacion: "La ley protege los derechos eventuales del que está por nacer. Los derechos deferidos quedan en suspenso. Si el nacimiento constituye principio de existencia, entra en el goce de los mismos con efecto retroactivo."
    },
    {
        pregunta: "En la institución de la Muerte Presunta, ¿cuál es el plazo general que debe transcurrir sin tenerse noticias del desaparecido para que el juez dicte la declaración?",
        opciones: ["A. 1 año.", "B. 3 años.", "C. 5 años desde la fecha de las últimas noticias.", "D. 10 años."],
        correcta: 2,
        explicacion: "El Art. 81 N°1 exige como regla general el transcurso de 5 años desde la fecha de las últimas noticias que se tuvieron de la existencia del desaparecido para que el juez conceda la posesión provisoria de los bienes."
    },
    {
        pregunta: "En el Derecho chileno, las Personas Jurídicas de derecho privado con fines de lucro se denominan:",
        opciones: ["A. Corporaciones.", "B. Fundaciones.", "C. Sociedades.", "D. Organismos No Gubernamentales (ONG)."],
        correcta: 2,
        explicacion: "Las personas jurídicas de derecho privado se dividen por su fin: si no persiguen lucro son corporaciones o fundaciones (Título XXXIII Libro I). Si persiguen el lucro y la repartición de utilidades entre sus miembros, son Sociedades."
    },
    {
        pregunta: "De acuerdo a la Ley 20.393, en Chile las personas jurídicas:",
        opciones: ["A. Carecen totalmente de responsabilidad penal.", "B. Tienen responsabilidad penal respecto de cualquier delito cometido por sus gerentes.", "C. Tienen responsabilidad penal, pero limitada a ciertos delitos como lavado de activos, financiamiento del terrorismo y cohecho.", "D. Solo tienen responsabilidad civil extracontractual."],
        correcta: 2,
        explicacion: "Modificando el dogma 'societas delinquere non potest', la Ley 20.393 introdujo la responsabilidad penal de las personas jurídicas en Chile para un catálogo cerrado de delitos, especialmente vinculados a la corrupción y criminalidad financiera."
    },
    {
        pregunta: "Desde el punto de vista del Derecho de las Obligaciones, la distinción fundamental entre 'Derecho Real' y 'Derecho Personal' radica en que:",
        opciones: ["A. El derecho real recae sobre inmuebles y el personal sobre muebles.", "B. El derecho real se tiene sobre una cosa sin respecto a determinada persona, mientras el personal solo puede reclamarse de ciertas personas que han contraído la obligación.", "C. El derecho personal prescribe, el derecho real no.", "D. El derecho real nace de los contratos y el personal de los cuasicontratos."],
        correcta: 1,
        explicacion: "Esta es la definición clásica de Bello en los Arts. 577 y 578. El derecho real crea una relación directa sujeto-cosa y genera acciones absolutas (erga omnes); el personal crea una relación acreedor-deudor y genera acciones relativas."
    },
    {
        pregunta: "Una obligación civil se diferencia de una obligación natural porque la civil:",
        opciones: ["A. Emana del derecho romano.", "B. Da derecho para exigir su cumplimiento (otorga acción).", "C. Solo genera excepción para retener lo pagado.", "D. No puede caucionarse con hipoteca o prenda."],
        correcta: 1,
        explicacion: "El Art. 1470 define la obligación civil como aquella que da derecho para exigir su cumplimiento, estando amparada por una acción (a diferencia de la natural que carece de ella)."
    },
    {
        pregunta: "Una de las diferencias fundamentales entre 'Solidaridad' e 'Indivisibilidad' en las obligaciones con pluralidad de sujetos es:",
        opciones: ["A. La solidaridad no se transmite a los herederos, mientras que la indivisibilidad sí se transmite.", "B. La solidaridad permite cobrar el total, la indivisibilidad solo permite cobrar cuotas.", "C. La indivisibilidad puede renunciarse libremente, la solidaridad no.", "D. Ambas son idénticas en cuanto a sus efectos transmisibles."],
        correcta: 0,
        explicacion: "Según los apuntes, la obligación solidaria (art. 1523) no se transmite como solidaria a los herederos (salvo pacto en contrario), dividiéndose a prorrata. La indivisibilidad, por emanar de la naturaleza de la cosa, sí se transmite a los herederos (Art. 1528)."
    },
    {
        pregunta: "La 'condición resolutoria ordinaria' produce sus efectos de la siguiente manera:",
        opciones: ["A. Requiere sentencia judicial ejecutoriada.", "B. Opera de pleno derecho (ipso facto) una vez cumplida la condición, extinguiendo el derecho sin necesidad de resolución judicial.", "C. Otorga al deudor el derecho a pedir plazo extra.", "D. Permite al deudor pagar aún después de cumplida la condición."],
        correcta: 1,
        explicacion: "A diferencia de la condición resolutoria tácita (que requiere demanda judicial), la condición resolutoria ordinaria (cualquier hecho futuro e incierto que no sea el incumplimiento) opera de pleno derecho, extinguiendo la obligación inmediatamente."
    },
    {
        pregunta: "Si en un contrato de compraventa se estipula un 'Pacto Comisorio Simple' por el no pago del precio, su principal característica procesal es que:",
        opciones: ["A. El contrato se resuelve automáticamente al día siguiente del no pago.", "B. Requiere demanda judicial, pero el deudor puede enervar la acción pagando en el plazo de 24 horas desde la notificación de la demanda.", "C. El vendedor no puede pedir indemnización de perjuicios.", "D. Es irrenunciable por el comprador."],
        correcta: 1,
        explicacion: "El pacto comisorio (Art. 1877 y 1879) no resuelve el contrato ipso facto. Requiere declaración judicial, y el comprador conserva la facultad de subsistir el contrato pagando el precio dentro del plazo fatal de 24 horas post notificación."
    },
    {
        pregunta: "En la teoría de los riesgos (Art. 1550), la pérdida fortuita de la especie o cuerpo cierto debido, estando pendiente la entrega y sin que el deudor esté en mora, es asumida por:",
        opciones: ["A. El Fisco.", "B. El deudor, quien debe devolver el precio.", "C. El acreedor, extinguiéndose la obligación de entrega del deudor sin que el acreedor se exima de su contraprestación.", "D. Ambas partes a medias."],
        correcta: 2,
        explicacion: "El Art. 1550 consagra el principio res perit creditori (la cosa perece para el acreedor). Si la cosa perece por caso fortuito, el acreedor sufre la pérdida y debe cumplir con su propia obligación (ej. pagar el precio), aunque el Código ha sido duramente criticado por esta norma inequitativa."
    },
    {
        pregunta: "Las 'Obligaciones de Medio', a diferencia de las de Resultado, se caracterizan porque en ellas el deudor:",
        opciones: ["A. Se obliga a lograr un objetivo específico y garantizado.", "B. Se compromete a emplear toda la diligencia y cuidado posible para alcanzar un fin, sin garantizar su éxito.", "C. Responde de culpa levísima en todo caso.", "D. Queda exento de probar caso fortuito."],
        correcta: 1,
        explicacion: "En las obligaciones de medio (ej. el contrato de prestación de servicios médicos o de abogado), el deudor no promete la sanación o ganar el juicio (resultado), sino que compromete su actuar diligente y pericia conforme a la lex artis."
    },
    {
        pregunta: "Una 'Obligación Real' o 'Propter Rem' tiene como particularidad que el sujeto pasivo (el deudor):",
        opciones: ["A. Está determinado por su calidad de dueño o poseedor de una cosa determinada, y la obligación se transfiere junto con la cosa.", "B. Es siempre el Estado.", "C. Es un deudor solidario e inmutable.", "D. Contrae la obligación mediante escritura pública exclusivamente."],
        correcta: 0,
        explicacion: "Las obligaciones ambulatorias o propter rem son aquellas vinculadas a la titularidad de un derecho real. Si el dueño transfiere la cosa (ej. vende un departamento), las deudas por gastos comunes 'siguen' a la cosa, afectando al nuevo dueño."
    },
    {
        pregunta: "El 'Plazo Extintivo' se diferencia de la 'Condición Resolutoria' porque el plazo:",
        opciones: ["A. Tiene efecto retroactivo.", "B. Es un hecho futuro e incierto.", "C. Es un hecho futuro y cierto (llegará ineludiblemente), y su cumplimiento pone fin a la obligación ex nunc (hacia el futuro, sin borrar los efectos pasados).", "D. Requiere declaración judicial para operar."],
        correcta: 2,
        explicacion: "El plazo extintivo pone término a los efectos de un acto (ej. arriendo a un año). A diferencia de la condición, es un hecho cierto y no opera con efecto retroactivo; lo producido antes de su llegada es firme e inamovible."
    },
    {
        pregunta: "Para que el deudor quede constituido en 'Mora' en una obligación con plazo expresamente estipulado, el Art. 1551 N°1 del Código Civil dispone que:",
        opciones: ["A. Se requiere siempre la interpelación judicial mediante notificación de demanda.", "B. Basta el solo vencimiento del término estipulado para que se entienda constituido en mora (interpelación contractual expresa).", "C. Se requiere enviar una carta certificada.", "D. El acreedor debe otorgar un plazo de gracia de 5 días."],
        correcta: 1,
        explicacion: "La regla 'dies interpellat pro homine' (el plazo interpela por el hombre). Si las partes fijaron plazo, la llegada de éste constituye en mora al deudor automáticamente, salvo que la ley exija en casos específicos un requerimiento."
    },
    {
        pregunta: "La 'Cláusula Penal' (Art. 1535) cumple una triple función jurídica. ¿Cuál de las siguientes NO es una de ellas?",
        opciones: ["A. Avaluación convencional y anticipada de los perjuicios.", "B. Caución personal que garantiza el cumplimiento de la obligación principal.", "C. Pena civil o sanción por el incumplimiento.", "D. Extinción automática del contrato principal por el solo ministerio de la ley."],
        correcta: 3,
        explicacion: "La cláusula penal avalúa perjuicios, sirve de garantía (especialmente si es asumida por un tercero) y constituye una pena civil. Sin embargo, no extingue automáticamente el contrato; el acreedor incluso puede optar entre pedir la pena o exigir el cumplimiento (salvo pacto en contrario)."
    },
    {
        pregunta: "La 'Cláusula Penal Enorme' en los contratos conmutativos se produce cuando:",
        opciones: ["A. La pena excede del duplo de la obligación principal, permitiendo pedir su rebaja.", "B. Se pacta en Unidades de Fomento.", "C. La pena impone prisión por deudas.", "D. La pena se hace exigible por un incumplimiento recíproco."],
        correcta: 0,
        explicacion: "El Art. 1544 regula la lesión enorme en la cláusula penal. Si se estipula una pena para asegurar una cantidad determinada, y la pena excede el duplo de esa cantidad principal, el deudor puede solicitar al juez que se rebaje a dicho máximo."
    },
    {
        pregunta: "La 'Fuerza Obligatoria de los Contratos' (Pacta Sunt Servanda) está consagrada en el Código Civil chileno en el principio de que:",
        opciones: ["A. Todo contrato legalmente celebrado puede ser modificado por el juez por equidad.", "B. Todo contrato legalmente celebrado es una ley para los contratantes, y no puede ser invalidado sino por su consentimiento mutuo o causas legales.", "C. Los contratos solo obligan si son ratificados notarialmente.", "D. Los contratos obligan mientras las circunstancias económicas no cambien."],
        correcta: 1,
        explicacion: "Es el tenor literal del Art. 1545. Consagra el principio del 'contrato-ley', cerrando la puerta (en principio) a la teoría de la imprevisión en la dogmática clásica chilena, salvo contadas excepciones jurisprudenciales recientes."
    },
    {
        pregunta: "La obligación de 'entregar' una cosa mueble comprende intrínsecamente:",
        opciones: ["A. La obligación accesoria de conservarla hasta la entrega si es un cuerpo cierto.", "B. La obligación de garantizar su funcionamiento por 10 años.", "C. El pago del precio por anticipado.", "D. La obligación de sanear la lesión enorme."],
        correcta: 0,
        explicacion: "Según el Art. 1548, la obligación de dar contiene la de entregar; y la obligación de entregar una especie o cuerpo cierto contiene la de conservarlo hasta la entrega, respondiendo el deudor de los descuidos."
    },
    {
        pregunta: "Si el deudor incumple una obligación de 'no hacer', el acreedor tiene derecho a (Art. 1555):",
        opciones: ["A. Solo a indemnización de perjuicios, ya que el hecho es irreversible.", "B. Pedir la destrucción de lo hecho (si es posible y necesario), o indemnización de perjuicios si la destrucción es imposible.", "C. Demandar por delito penal de desacato.", "D. Retener los bienes raíces del deudor."],
        correcta: 1,
        explicacion: "El Art. 1555 otorga al acreedor el derecho a solicitar que se destruya lo hecho contraveniendo la obligación, pudiendo el acreedor pedir autorización para destruirlo a expensas del deudor. Si no es posible destruir, procede la indemnización."
    },
    // ==========================================
    // NUEVO BLOQUE 2 DE 5: LEY, PERSONAS Y OBLIGACIONES II
    // ==========================================
    {
        pregunta: "Respecto al efecto territorial de la ley chilena, el Artículo 14 del Código Civil establece que:",
        opciones: ["A. La ley es obligatoria solo para los ciudadanos chilenos, estén donde estén.", "B. La ley es obligatoria para todos los habitantes de la República, con inclusión de los extranjeros.", "C. Los extranjeros solo se rigen por la ley chilena después de un año de residencia.", "D. Los diplomáticos se rigen por la ley chilena en todo acto."],
        correcta: 1,
        explicacion: "El Art. 14 consagra el principio de la territorialidad de la ley: obliga a todos los habitantes de la República, sin distinguir entre chilenos y extranjeros, salvo las excepciones del Derecho Internacional (como la inmunidad diplomática)."
    },
    {
        pregunta: "La sanción general que el Código Civil (Art. 10) impone a los actos que prohíbe la ley es:",
        opciones: ["A. La inexistencia jurídica.", "B. La nulidad relativa.", "C. Son nulos y de ningún valor, salvo en cuanto designe expresamente otro efecto que el de nulidad para el caso de contravención.", "D. La indemnización de perjuicios al Fisco."],
        correcta: 2,
        explicacion: "El Art. 10 del CC dispone expresamente que los actos que la ley prohíbe son nulos y de ningún valor (nulidad absoluta por objeto ilícito), dejando a salvo que el legislador disponga otra sanción específica para la contravención."
    },
    {
        pregunta: "En materia de interpretación de la ley, el 'elemento sistemático' (Art. 22) implica que:",
        opciones: ["A. Se debe atender a la historia fidedigna del establecimiento de la ley.", "B. Se interpretarán las palabras según el diccionario de la RAE.", "C. El contexto de la ley servirá para ilustrar el sentido de cada una de sus partes, de manera que haya entre todas ellas la debida correspondencia y armonía.", "D. El juez debe fallar según su propia consciencia y sistema moral."],
        correcta: 2,
        explicacion: "El Art. 22 inciso 1° define el elemento sistemático, considerando a la ley como un todo orgánico donde las distintas disposiciones deben leerse en armonía y contexto, no de forma aislada."
    },
    {
        pregunta: "En la institución de la 'Comoriencia' (Art. 79), si dos o más personas perecen en un mismo acontecimiento y no puede saberse el orden en que han fallecido:",
        opciones: ["A. Se presume que murió primero el de mayor edad.", "B. Se presume que murió primero el más débil por razones biológicas.", "C. Se procederá en todos casos como si dichas personas hubiesen perecido en un mismo momento, y ninguna de ellas habrá sucedido en los bienes de las otras.", "D. Los bienes de ambos pasan automáticamente al Fisco."],
        correcta: 2,
        explicacion: "A diferencia del derecho romano, el Art. 79 del Código Civil chileno rechaza las presunciones de sobrevivencia por fuerza o edad. Asume que perecieron en el mismo momento, evitando la transmisión sucesoria entre los comurientes."
    },
    {
        pregunta: "¿Cuál de los siguientes es un atributo de la personalidad que poseen las Personas Naturales, pero del cual CARECEN absolutamente las Personas Jurídicas?",
        opciones: ["A. Nombre.", "B. Domicilio.", "C. Patrimonio.", "D. Estado Civil."],
        correcta: 3,
        explicacion: "Las personas jurídicas poseen nombre (razón social), domicilio, patrimonio y nacionalidad. Sin embargo, carecen de Estado Civil, pues este se funda en las relaciones de familia (matrimonio, parentesco) exclusivas del ser humano."
    },
    {
        pregunta: "La diferencia esencial entre una Corporación y una Fundación (ambas personas jurídicas sin fines de lucro) es que:",
        opciones: ["A. La Corporación es una colectividad de personas asociadas para un fin común, mientras que la Fundación es una afectación de bienes o un patrimonio destinado a un fin específico.", "B. La Corporación busca el lucro encubierto, la Fundación no.", "C. La Corporación es creada por el Estado, la Fundación por privados.", "D. La Corporación no tiene domicilio, la Fundación sí."],
        correcta: 0,
        explicacion: "Según la doctrina clásica de los apuntes, el elemento básico de la corporación es la agrupación de personas (universitas personarum), mientras que en la fundación el elemento basal es el patrimonio destinado a un fin (universitas bonorum)."
    },
    {
        pregunta: "Según el Artículo 1437 del Código Civil, ¿cuáles son las fuentes tradicionales de las obligaciones en el derecho chileno?",
        opciones: ["A. Solo el contrato y la ley.", "B. El contrato, el cuasicontrato, el delito, el cuasidelito y la ley.", "C. El contrato, la promesa, la indemnización y la costumbre.", "D. El acto jurídico, el hecho jurídico y el enriquecimiento sin causa."],
        correcta: 1,
        explicacion: "El Art. 1437 enumera la clasificación pentapartita clásica (heredada de Pothier y Justiniano): convenciones/contratos, hecho voluntario lícito (cuasicontrato), hecho voluntario ilícito con intención (delito), sin intención (cuasidelito), y la ley."
    },
    {
        pregunta: "Si un deudor paga voluntariamente una 'obligación natural' teniendo la libre administración de sus bienes, el efecto jurídico principal es:",
        opciones: ["A. Puede demandar la restitución alegando pago de lo no debido.", "B. El acreedor está autorizado para retener lo que se ha dado o pagado en razón de ella.", "C. La obligación natural se transforma automáticamente en civil.", "D. El Fisco retiene un 10% por concepto de impuestos."],
        correcta: 1,
        explicacion: "Es la característica definitoria de la obligación natural (Art. 1470). Aunque no otorga acción para exigir el pago, si el deudor paga voluntariamente, el acreedor goza de 'excepción' para retener lo pagado (soluti retentio)."
    },
    {
        pregunta: "El Código Civil clasifica las obligaciones naturales en dos grupos (Art. 1470). Un ejemplo de las llamadas 'obligaciones civiles nulas o rescindibles' es:",
        opciones: ["A. La obligación extinguida por la prescripción.", "B. La obligación que no fue reconocida en juicio por falta de prueba.", "C. Las contraídas por menores adultos sin la autorización de sus representantes legales.", "D. El pago de una apuesta en un juego de azar ilícito."],
        correcta: 2,
        explicacion: "El Art. 1470 N° 1 menciona a las obligaciones contraídas por ciertas personas que tienen suficiente juicio y discernimiento (menores adultos) pero son incapaces relativos. Esta es una obligación civil abortada que queda como natural."
    },
    {
        pregunta: "En una obligación 'simplemente conjunta' (o mancomunada) donde existen varios deudores y un acreedor, la regla legal en Chile determina que:",
        opciones: ["A. El acreedor puede exigir el total de la deuda a cualquiera de los deudores.", "B. Cada deudor está obligado a pagar solamente su cuota o parte en la deuda.", "C. Los deudores responden solidariamente por mandato constitucional.", "D. La obligación se vuelve indivisible automáticamente."],
        correcta: 1,
        explicacion: "La regla general en Chile frente a la pluralidad de sujetos es la obligación simplemente conjunta (Art. 1511). La deuda se divide en tantas partes como deudores haya, y el acreedor solo puede cobrar la cuota correspondiente a cada uno."
    },
    {
        pregunta: "En la Solidaridad Pasiva, si la cosa debida perece por culpa o durante la mora de uno de los codeudores solidarios (Art. 1526):",
        opciones: ["A. Todos los codeudores quedan eximidos de responsabilidad.", "B. Solo el culpable debe pagar el precio de la cosa y los perjuicios.", "C. Todos quedan obligados solidariamente al pago del precio de la cosa, pero la indemnización de perjuicios solo puede ser exigida al codeudor culpable (o moroso).", "D. El acreedor debe demandar al Estado en subsidio."],
        correcta: 2,
        explicacion: "El Art. 1526 distingue: el precio de la cosa sigue siendo solidario para todos, pero la indemnización de perjuicios (que es una sanción por la culpa) solo recae sobre el codeudor negligente o moroso."
    },
    {
        pregunta: "Una obligación se considera 'Indivisible' cuando:",
        opciones: ["A. Así lo decreta el juez por motivos de equidad.", "B. Tiene por objeto una cosa susceptible de división física, pero de gran valor.", "C. Su objeto, por su naturaleza, no es susceptible de división material o intelectual (ej. la obligación de conceder una servidumbre de tránsito).", "D. Se trata de una obligación de pagar una suma de dinero."],
        correcta: 2,
        explicacion: "El Art. 1524 señala que la obligación es indivisible si el objeto de la prestación no admite división, sea física o intelectual. Conceder una servidumbre de paso no puede cumplirse por partes; se concede o no se concede."
    },
    {
        pregunta: "En una obligación bajo 'condición suspensiva', mientras la condición se encuentra PENDIENTE:",
        opciones: ["A. El derecho y la obligación ya nacieron y son exigibles.", "B. El deudor puede ser obligado a pagar coercitivamente.", "C. El vínculo jurídico existe, pero el nacimiento del derecho y la obligación exigible están en suspenso.", "D. Opera la prescripción extintiva inmediatamente."],
        correcta: 2,
        explicacion: "Mientras la condición suspensiva pende, el derecho del acreedor no ha nacido, es una 'mera expectativa'. Por ende, no puede exigir el cumplimiento, ni corre la prescripción, ni puede haber compensación."
    },
    {
        pregunta: "Una condición se reputa 'fallida' si es positiva (consiste en acontecer una cosa) cuando:",
        opciones: ["A. Llega a ser cierto que el hecho NO sucederá, o expira el tiempo dentro del cual el acontecimiento ha debido verificarse.", "B. El deudor decide unilateralmente no cumplirla.", "C. Pasan más de 24 horas desde el contrato.", "D. Se cumple el hecho pero a medias."],
        correcta: 0,
        explicacion: "El Art. 1482 establece cuándo falla la condición. Si es positiva, falla si llega a ser cierto que el hecho no se realizará (ej. 'si Juan se casa con María', y María fallece soltera), o si expira el plazo máximo estipulado sin que ocurra."
    },
    {
        pregunta: "El 'efecto retroactivo' de la condición cumplida es una ficción legal que implica que:",
        opciones: ["A. Se devuelven los impuestos pagados al Fisco.", "B. Se considera que el derecho del acreedor existió desde el momento en que se celebró el contrato, como si nunca hubiese estado sujeto a condición.", "C. El contrato se anula y vuelve todo al estado anterior.", "D. Los terceros de buena fe siempre deben restituir los bienes."],
        correcta: 1,
        explicacion: "La doctrina mayoritaria chilena acepta la retroactividad de la condición (inspirada en el CC Francés). Cumplida la condición suspensiva, los efectos del acto se retrotraen a la época de la celebración del contrato."
    },
    {
        pregunta: "¿Cuál es la diferencia estructural fundamental entre la Condición y el Plazo?",
        opciones: ["A. El plazo siempre es tácito, la condición expresa.", "B. La condición es un hecho pasado, el plazo un hecho futuro.", "C. La condición es un hecho futuro e INCIERTO, mientras que el plazo es un hecho futuro y CIERTO (inevitablemente llegará).", "D. El plazo no extingue obligaciones, la condición sí."],
        correcta: 2,
        explicacion: "La incertidumbre es el núcleo de la condición. Puede ocurrir o no. El plazo, por el contrario, es un hecho que de todas maneras sucederá (certidumbre), como una fecha determinada o la muerte de una persona."
    },
    {
        pregunta: "La 'Caducidad del Plazo' (Art. 1496) priva al deudor del beneficio de pagar en el tiempo estipulado, haciéndose la obligación exigible de inmediato. Esto ocurre, por ejemplo, cuando:",
        opciones: ["A. El deudor se va de vacaciones.", "B. El deudor está constituido en quiebra (procedimiento concursal) o se halla en notoria insolvencia.", "C. El acreedor necesita el dinero con urgencia.", "D. Han pasado más de 30 días sin noticias del deudor."],
        correcta: 1,
        explicacion: "El Art. 1496 consagra la caducidad legal del plazo. El acreedor puede exigir el pago anticipado si el deudor quiebra (liquidación) o sufre insolvencia notoria, o si sus cauciones han disminuido considerablemente por hecho o culpa suya."
    },
    {
        pregunta: "En una 'obligación modal', el modo consiste en la aplicación que debe darse a la cosa asignada (un fin o carga). Si se estipula una 'cláusula resolutoria' por el incumplimiento del modo:",
        opciones: ["A. El incumplimiento transforma el modo en un plazo.", "B. Otorga el derecho a pedir la restitución de la cosa y de los frutos, si no se cumple el modo.", "C. Impone una pena de cárcel al deudor.", "D. Convierte al contrato en una donación irrevocable."],
        correcta: 1,
        explicacion: "El Art. 1090 define la cláusula resolutoria en las asignaciones modales: la obligación de restituir la cosa y sus frutos si no se cumple el modo fijado por el testador o donante."
    },
    {
        pregunta: "En las 'Obligaciones de Resultado', a diferencia de las obligaciones de medios:",
        opciones: ["A. El deudor se compromete solo a actuar con diligencia, sin asegurar el éxito.", "B. El deudor se obliga a proporcionar un resultado determinado. Si el resultado no se logra, se presume su culpa y debe indemnizar (ej. obligación del constructor de entregar una casa terminada).", "C. La culpa debe ser probada rigurosamente por el acreedor.", "D. Jamás se admite la eximente de caso fortuito."],
        correcta: 1,
        explicacion: "En las obligaciones de resultado, el simple hecho de no alcanzar el fin prometido constituye el incumplimiento y hace operar la presunción de culpa del Art. 1547 inc. 3, debiendo el deudor probar caso fortuito para liberarse."
    },
    {
        pregunta: "En la clasificación de los contratos, aquellos cuyas obligaciones se van cumpliendo de forma periódica y prolongada en el tiempo (ej. contrato de arrendamiento o de trabajo) se denominan:",
        opciones: ["A. Contratos de ejecución instantánea.", "B. Contratos de tracto sucesivo.", "C. Contratos solemnes.", "D. Contratos de ejecución diferida."],
        correcta: 1,
        explicacion: "Los contratos de tracto sucesivo son aquellos donde el cumplimiento de las prestaciones se realiza de forma continuada, repitiéndose en el tiempo. Aquí, la nulidad o resolución no puede tener efecto retroactivo pleno, operando más bien la 'terminación'."
    },
    {
        pregunta: "La obligación de dar (Art. 1548) es la que tiene por objeto:",
        opciones: ["A. Entregar el mero uso de una cosa.", "B. Transferir el dominio o constituir un derecho real sobre la cosa en favor del acreedor.", "C. Efectuar un trabajo material a favor del acreedor.", "D. Entregar dinero al Fisco por concepto de impuestos."],
        correcta: 1,
        explicacion: "En el derecho chileno, 'dar' no es solo entregar físicamente. La obligación de dar implica el compromiso de transferir el derecho de dominio (o constituir otro derecho real). La simple entrega material es una obligación de 'hacer'."
    },
    {
        pregunta: "En el Derecho Civil, si un deudor se obliga a entregar 'un caballo' sin especificar cuál (Obligación de Género):",
        opciones: ["A. El caso fortuito de la muerte de sus caballos extingue siempre la obligación.", "B. El acreedor puede exigir un caballo de calidad superior y de raza específica.", "C. El deudor cumple entregando cualquier individuo del género, con tal que sea de una calidad a lo menos mediana.", "D. La obligación es nula por falta de objeto determinable."],
        correcta: 2,
        explicacion: "El Art. 1509 consagra que en las obligaciones de género el deudor cumple entregando cualquier individuo de dicho género, pero de una calidad a lo menos mediana. Además, rige el principio 'el género no perece'."
    },
    {
        pregunta: "Las 'operaciones de crédito de dinero' en Chile, regidas por la Ley 18.010, establecen como regla general que:",
        opciones: ["A. No generan intereses, por aplicación del Código Civil original.", "B. Toda operación de crédito de dinero devenga intereses corrientes, salvo pacto expreso en contrario o disposición legal (presunción de onerosidad).", "C. Generan intereses solo si el deudor está en mora.", "D. Son siempre a título gratuito."],
        correcta: 1,
        explicacion: "La Ley 18.010 alteró la regla clásica civil (donde la gratuidad era la regla en el mutuo). En las operaciones de crédito de dinero, se presume que no son gratuitas, devengando interés corriente salvo estipulación expresa que los exima."
    },
    {
        pregunta: "El 'Domicilio Político' de una persona natural se refiere a:",
        opciones: ["A. La dirección donde paga sus impuestos.", "B. El territorio del Estado en general, y se vincula a su nacionalidad y derechos políticos.", "C. El lugar determinado donde tiene su asiento principal de negocios.", "D. La comuna donde está inscrito para votar exclusivamente."],
        correcta: 1,
        explicacion: "El Art. 60 del CC distingue entre domicilio político (relativo al territorio del Estado en general, confiriendo la calidad de domiciliado en Chile) y domicilio civil (relativo a una parte o comuna determinada del territorio)."
    },
    {
        pregunta: "En la interpretación de la ley, el 'elemento lógico' implica:",
        opciones: ["A. Aplicar fórmulas matemáticas a la ley.", "B. Desentrañar la intención o el espíritu de la ley, buscando la concordancia de la norma consigo misma y con el motivo que la inspiró.", "C. Analizar las discusiones en el congreso.", "D. Consultar el diccionario."],
        correcta: 1,
        explicacion: "El elemento lógico (Art. 19 inc. 2 y Art. 22) busca la ratio legis: la armonía interna de la ley y los fines o motivos reales que tuvo el legislador para dictarla (el espíritu de la ley)."
    },
    // ==========================================
    // NUEVO BLOQUE 3 DE 5: OBLIGACIONES III (MODOS DE EXTINGUIR Y PRELACIÓN)
    // ==========================================
    {
        pregunta: "Para que opere la 'Resciliación' o mutuo disenso (Art. 1567), es requisito fundamental que:",
        opciones: ["A. Exista incumplimiento por una de las partes.", "B. Las partes sean capaces de disponer libremente de lo suyo y consientan en dejar sin efecto el contrato.", "C. Intervenga el juez dictando sentencia absolutoria.", "D. El contrato sea de tracto sucesivo."],
        correcta: 1,
        explicacion: "El Art. 1567 establece que toda obligación puede extinguirse por una convención en que las partes interesadas, siendo capaces de disponer libremente de lo suyo, consienten en darla por nula (resciliarla)."
    },
    {
        pregunta: "Si un tercero extraño paga una deuda con el consentimiento expreso o tácito del deudor:",
        opciones: ["A. Se produce subrogación legal, pasando a ocupar el lugar del acreedor con todos sus privilegios e hipotecas.", "B. Solo tiene derecho a reembolso simple, sin subrogación.", "C. El pago es nulo.", "D. El deudor queda liberado de pagarle al tercero."],
        correcta: 0,
        explicacion: "Según el Art. 1610 N°5, opera la subrogación legal a favor del que paga una deuda ajena consintiéndolo expresa o tácitamente el deudor. Adquiere la misma posición y garantías del acreedor original."
    },
    {
        pregunta: "El 'Pago por Consignación' (Art. 1599) es un modo válido de extinguir la obligación que procede cuando:",
        opciones: ["A. El deudor no tiene dinero para pagar.", "B. El acreedor se niega a recibir el pago, no comparece, o existe incertidumbre acerca de su persona.", "C. El bien debido perece por caso fortuito.", "D. Las partes pactan un nuevo contrato para sustituir el antiguo."],
        correcta: 1,
        explicacion: "La consignación es el depósito de la cosa que se debe en manos de un tercero, previa oferta legal. Es la herramienta del deudor para liberarse cuando el acreedor incurre en 'mora de recibir' (mora accipiendi) o no es habido."
    },
    {
        pregunta: "La principal diferencia entre la 'Dación en Pago' y las obligaciones facultativas es que:",
        opciones: ["A. La dación en pago es un contrato solemne.", "B. En la dación, la sustitución del objeto se acuerda al momento del pago; en la facultativa, el deudor tiene la facultad de pagar con otra cosa desde el nacimiento de la obligación.", "C. La dación solo aplica a bienes raíces.", "D. La obligación facultativa requiere intervención judicial."],
        correcta: 1,
        explicacion: "En la obligación facultativa (Art. 1505) el deudor ya tiene el derecho de elegir con qué pagar desde el inicio. En la dación, la obligación original exigía algo específico, pero al momento de pagar, el acreedor acepta voluntariamente recibir una cosa distinta."
    },
    {
        pregunta: "La novación por cambio de deudor (Art. 1631 N°3) requiere ineludiblemente:",
        opciones: ["A. Que el nuevo deudor sea más solvente.", "B. El consentimiento expreso del acreedor para liberar al deudor primitivo.", "C. Que ambos deudores firmen una escritura pública.", "D. Que el nuevo deudor pague la mitad de la deuda de inmediato."],
        correcta: 1,
        explicacion: "Para que haya verdadera novación (y no una simple delegación imperfecta o asunción de deuda solidaria), el acreedor debe declarar expresamente que libera al deudor antiguo, aceptando al nuevo (Art. 1635)."
    },
    {
        pregunta: "La 'Compensación Legal' no opera (no extingue las deudas) si una de las obligaciones es:",
        opciones: ["A. Una deuda en dinero.", "B. Líquida y exigible.", "C. De dar una especie o cuerpo cierto.", "D. Entre partes que se deben mutuamente."],
        correcta: 2,
        explicacion: "El Art. 1656 exige que para que opere la compensación, ambas deudas deben ser de dinero o de cosas fungibles de la misma especie y calidad. Un cuerpo cierto no se puede compensar legalmente."
    },
    {
        pregunta: "La remisión o condonación de una deuda, cuando se hace a título gratuito, está sujeta en nuestro derecho a las reglas de:",
        opciones: ["A. La compraventa.", "B. Las donaciones entre vivos (incluyendo el trámite de insinuación si supera cierto monto).", "C. El testamento abierto.", "D. Los cuasicontratos."],
        correcta: 1,
        explicacion: "El Art. 1653 establece que la remisión que procede de mera liberalidad, está en todo sujeta a las reglas de la donación entre vivos."
    },
    {
        pregunta: "La 'Confusión' (Art. 1665) extingue la obligación cuando:",
        opciones: ["A. Concurren en una misma persona las calidades de acreedor y deudor de la misma obligación.", "B. Las partes redactan mal el contrato y su lectura es incomprensible.", "C. El deudor pierde la memoria.", "D. Existen más de tres codeudores solidarios."],
        correcta: 0,
        explicacion: "Es la definición legal. Por ejemplo, cuando el deudor hereda los bienes del acreedor; jurídicamente nadie puede ser deudor de sí mismo, por lo que la obligación se extingue."
    },
    {
        pregunta: "Si el cuerpo cierto que se debe perece por culpa de un tercero del que el deudor no es responsable, sin estar el deudor en mora:",
        opciones: ["A. El deudor debe pagar el precio con su patrimonio.", "B. La obligación se extingue, pero el acreedor puede exigir que el deudor le ceda las acciones que tenga contra el tercero autor del daño.", "C. Responde solidariamente el deudor y el tercero.", "D. El contrato se anula por objeto ilícito."],
        correcta: 1,
        explicacion: "El Art. 1677 señala que, aunque la obligación se extinga por pérdida fortuita para el deudor, el acreedor tiene derecho a que se le cedan las acciones para perseguir al tercero culpable del daño."
    },
    {
        pregunta: "El plazo general y común para la 'Prescripción Extintiva' de las acciones ejecutivas y ordinarias es, respectivamente:",
        opciones: ["A. 1 año y 3 años.", "B. 3 años y 5 años.", "C. 5 años y 10 años.", "D. 10 años y 15 años."],
        correcta: 1,
        explicacion: "El Art. 2515 establece que la acción ejecutiva se prescribe por 3 años, y la ordinaria por 5. (La acción ejecutiva, al prescribir en 3 años, se transforma en ordinaria por 2 años más)."
    },
    {
        pregunta: "La interrupción civil de la prescripción extintiva a favor del acreedor se produce por:",
        opciones: ["A. El reconocimiento expreso de la deuda por parte del deudor.", "B. La demanda judicial notificada legalmente al deudor antes del vencimiento del plazo.", "C. El envío de una carta de cobranza extrajudicial.", "D. El simple transcurso del tiempo de suspensión."],
        correcta: 1,
        explicacion: "El Art. 2503 consagra la interrupción civil, la cual requiere todo recurso judicial intentado por el que se pretende acreedor (demanda) que sea notificado válidamente al deudor."
    },
    {
        pregunta: "La prescripción puede ser renunciada (Art. 2494):",
        opciones: ["A. Anticipadamente en el contrato mismo.", "B. Solo después de cumplida, ya sea de forma expresa o tácita.", "C. En cualquier momento, mediante decreto judicial.", "D. Solo por el Fisco."],
        correcta: 1,
        explicacion: "La prescripción no puede renunciarse anticipadamente (sería una cláusula de estilo que destruiría la institución). Solo puede renunciarse una vez que se ha cumplido el plazo (ej. el deudor que, sabiendo que prescribió, paga los intereses)."
    },
    {
        pregunta: "En el sistema de prelación de créditos (Art. 2470), los 'Privilegios' propiamente tales cubren exclusivamente a:",
        opciones: ["A. Todas las clases de créditos.", "B. Solo a la primera clase.", "C. A la primera, segunda y cuarta clase de créditos.", "D. A la tercera y quinta clase."],
        correcta: 2,
        explicacion: "El Art. 2471 establece que gozan de privilegio solamente los créditos de la 1ª, 2ª y 4ª clase. La 3ª clase (hipoteca) es una preferencia, pero no se denomina privilegio en sentido estricto, y la 5ª clase no tiene preferencia alguna."
    },
    {
        pregunta: "¿Cuál de los siguientes créditos pertenece a la Primera Clase (y por ende se paga antes que todos los demás)?",
        opciones: ["A. Los créditos del Fisco por impuestos adeudados.", "B. Los créditos del acreedor hipotecario.", "C. Las costas judiciales, las expensas del funeral y las remuneraciones de los trabajadores.", "D. Los pagarés bancarios."],
        correcta: 2,
        explicacion: "El Art. 2472 enumera la primera clase de créditos. Son los más sagrados y tienen privilegio general sobre todos los bienes: costas judiciales, deudas mortuorias, gastos de enfermedad, salarios y asignaciones familiares."
    },
    {
        pregunta: "La principal característica de los créditos de la Segunda Clase (ej. el acreedor prendario o el posadero) es que:",
        opciones: ["A. Tienen privilegio general sobre todo el patrimonio del deudor.", "B. Son especiales, es decir, prefieren solo sobre determinados bienes muebles (ej. la cosa empeñada).", "C. Prefieren incluso a los créditos de la primera clase.", "D. Se pagan sin necesidad de juicio."],
        correcta: 1,
        explicacion: "Los créditos de segunda clase (Art. 2474) gozan de un privilegio especial, pues solo pueden invocarse sobre ciertos y determinados bienes muebles que están en poder del acreedor."
    },
    {
        pregunta: "Los créditos de la Tercera Clase corresponden a los hipotecarios. Si hay varias hipotecas sobre el mismo bien inmueble, ¿cómo prefieren entre sí?",
        opciones: ["A. En orden al monto de la deuda (de mayor a menor).", "B. En el orden de las fechas de sus respectivas inscripciones en el Conservador de Bienes Raíces.", "C. Se pagan a prorrata, todos por igual.", "D. El acreedor más antiguo en edad tiene preferencia."],
        correcta: 1,
        explicacion: "El Art. 2477 establece que los créditos hipotecarios prefieren sobre la finca hipotecada, y si hay varios, prefieren unos a otros en el orden de las fechas de sus respectivas inscripciones."
    },
    {
        pregunta: "Los créditos de los pupilos contra sus tutores, o de la mujer contra el marido por la administración de sus bienes, corresponden a:",
        opciones: ["A. La Primera Clase.", "B. La Segunda Clase.", "C. La Cuarta Clase.", "D. La Quinta Clase."],
        correcta: 2,
        explicacion: "El Art. 2481 enumera la cuarta clase de créditos. Son privilegios generales que protegen a ciertas personas cuyos bienes son administrados por otros (Fisco, instituciones de caridad, mujeres casadas, pupilos)."
    },
    {
        pregunta: "Los créditos de la Quinta Clase (valistas o quirografarios) se caracterizan porque:",
        opciones: ["A. Tienen garantía estatal.", "B. Se pagan a prorrata sobre el sobrante de la masa concursada, sin consideración a su fecha.", "C. Prefieren sobre los hipotecarios en caso de quiebra.", "D. Jamás se extinguen por prescripción."],
        correcta: 1,
        explicacion: "El Art. 2489 dispone que la quinta clase no goza de preferencia. Los acreedores valistas se pagarán a prorrata sobre el sobrante, sin importar qué contrato se firmó primero."
    },
    {
        pregunta: "Para que exista el contrato de Transacción (Art. 2446), la doctrina y la jurisprudencia exigen como requisito esencial:",
        opciones: ["A. Que exista un derecho dudoso o litigioso, y que las partes se hagan concesiones recíprocas.", "B. Que conste por escritura pública.", "C. Que participe un juez árbitro.", "D. Que trate exclusivamente sobre deudas de dinero."],
        correcta: 0,
        explicacion: "La transacción no es cualquier renuncia. Exige la preexistencia de un derecho controvertido y que ambas partes sacrifiquen algo de sus pretensiones (concesiones recíprocas) para precaver un litigio eventual o terminar uno pendiente."
    },
    {
        pregunta: "El 'Beneficio de Competencia' (Art. 1625) es una excepción a la regla de que el pago debe ser total, y consiste en:",
        opciones: ["A. Pagar con los bienes de la sociedad conyugal.", "B. Conceder a ciertos deudores (ej. ascendientes o descendientes) el derecho a no ser obligados a pagar más de lo que buenamente puedan, dejándoles lo indispensable para una modesta subsistencia.", "C. Pagar la deuda prestando servicios laborales.", "D. Declarar la insolvencia automática del deudor."],
        correcta: 1,
        explicacion: "Es un beneficio humano del Código Civil. El deudor amparado por él paga lo que puede en el momento, y el saldo queda pendiente para cuando mejore de fortuna."
    },
    {
        pregunta: "La 'Acción Oblicua o Subrogatoria' permite a los acreedores:",
        opciones: ["A. Revocar las ventas hechas por el deudor.", "B. Ejercer los derechos y acciones patrimoniales que el deudor negligente no quiere ejercer, para así hacer ingresar bienes a su patrimonio.", "C. Demandar directamente al Estado.", "D. Subastar la casa del deudor sin juicio."],
        correcta: 1,
        explicacion: "Esta acción es una herramienta para evitar la inactividad del deudor. El acreedor se pone en el lugar de su deudor inactivo y cobra los créditos que este tenía abandonados."
    },
    {
        pregunta: "El 'Derecho de Prenda General' (Art. 2465) consagra que toda obligación personal da al acreedor el derecho de perseguir su ejecución sobre:",
        opciones: ["A. Todos los bienes raíces del deudor, presentes y futuros, exceptuando los inembargables.", "B. Solo los bienes que el deudor entregó en prenda física.", "C. Todos los bienes raíces y muebles del deudor, sean presentes o futuros, exceptuándose solamente los no embargables.", "D. Solo el sueldo del deudor."],
        correcta: 2,
        explicacion: "El Art. 2465 es la piedra angular del cobro. El patrimonio completo del deudor (salvo lo inembargable, como la cama o el sueldo mínimo) sirve de garantía para el cumplimiento de sus obligaciones."
    },
    {
        pregunta: "Si el acreedor entra en 'Mora de Recibir' (mora accipiendi), una de las principales consecuencias es que:",
        opciones: ["A. El deudor queda liberado automáticamente de la deuda.", "B. Se descarga al deudor del cuidado ordinario de la cosa, pasando a responder solo por dolo o culpa lata.", "C. El acreedor debe pagar una indemnización equivalente al doble de la deuda.", "D. La obligación se vuelve natural."],
        correcta: 1,
        explicacion: "El Art. 1680 (y 1548) señala que si el acreedor está en mora de recibir, los riesgos de la cosa se alteran. El deudor ya no responde por culpa leve, disminuyendo su grado de responsabilidad a culpa grave o dolo."
    },
    {
        pregunta: "En materia de Solidaridad Pasiva, un codeudor demandado puede oponer 'excepciones reales', las cuales se caracterizan por:",
        opciones: ["A. Ser personales de otro codeudor (ej. menor edad).", "B. Resultar de la naturaleza de la obligación (ej. nulidad absoluta por objeto ilícito, pago, prescripción), y por tanto, pueden ser opuestas por cualquiera de los deudores solidarios.", "C. Oponerse solo si la cosa debida es un bien raíz.", "D. Ser exclusivas del fiador."],
        correcta: 1,
        explicacion: "El Art. 1520 distingue entre excepciones personales (ej. incapacidad, que solo puede oponerla el afectado) y reales o comunes, que atacan el corazón del crédito y aprovechan a todos los codeudores solidarios."
    },
    {
        pregunta: "La subrogación que opera a favor del fiador solidario que paga la deuda (Art. 1610 N°3):",
        opciones: ["A. Le permite cobrar el total de la deuda a cualquiera de sus antiguos codeudores.", "B. Le transmite las acciones del acreedor, pero frente a los otros codeudores solidarios solo puede exigirles la parte o cuota que a cada uno le corresponde en la deuda.", "C. Solo le permite recuperar la mitad de lo pagado.", "D. Genera una nueva obligación solidaria."],
        correcta: 1,
        explicacion: "Aunque se subrogue en los derechos del acreedor, la solidaridad no pasa al fiador que paga. Al dirigirse contra sus codeudores (la 'contribución a las deudas'), la obligación se divide a prorrata de sus cuotas (Art. 1522)."
},
    // ==========================================
    // NUEVO BLOQUE 4 DE 5: PROFUNDIZACIÓN EN LEY Y PERSONA
    // ==========================================
    {
        pregunta: "El Artículo 1 del Código Civil define a la ley como 'una declaración de la voluntad soberana que, manifestada en la forma prescrita por la Constitución, manda, prohíbe o permite'. Una de las principales críticas doctrinales a esta definición es:",
        opciones: ["A. Que es demasiado extensa.", "B. Que olvida el elemento de la coercibilidad.", "C. Que parece decir que la ley manda, prohíbe o permite por el solo hecho de manifestarse constitucionalmente, ignorando que su legitimidad de fondo y fin es la justicia y el bien común.", "D. Que le otorga demasiado poder a los jueces."],
        correcta: 2,
        explicacion: "La doctrina (Claro Solar, Borda) critica a Bello por enfocarse puramente en la 'forma' (voluntad soberana, forma constitucional) y omitir el 'fondo', es decir, que la ley debe ser justa y buscar el orden y bien común, a diferencia de la definición de Santo Tomás de Aquino."
    },
    {
        pregunta: "Respecto a las sentencias judiciales (Art. 3 del Código Civil), su efecto es:",
        opciones: ["A. General y vinculante para todos los tribunales de inferior jerarquía (stare decisis).", "B. Relativo, pues no tienen fuerza obligatoria sino respecto de las causas en que actualmente se pronunciaren.", "C. Absoluto, erga omnes en todos los casos civiles.", "D. Derogatorio, pueden anular una ley vigente."],
        correcta: 1,
        explicacion: "El Art. 3 consagra el efecto relativo de las sentencias en Chile. No existe el precedente obligatorio (common law). El fallo solo obliga a las partes del juicio en particular, aunque sirva como fuente material de inspiración."
    },
    {
        pregunta: "La 'Jurisprudencia' como fuente del derecho en el ordenamiento civil chileno se considera una:",
        opciones: ["A. Fuente formal directa de aplicación obligatoria.", "B. Norma de rango constitucional.", "C. Fuente material y auxiliar, que influye pero no obliga directamente en casos futuros.", "D. Costumbre contra legem."],
        correcta: 2,
        explicacion: "Al tener las sentencias efecto relativo (Art. 3), la jurisprudencia no es fuente formal del derecho en Chile. Sin embargo, es una fuente material importantísima por el peso argumentativo y persuasivo de las decisiones de los tribunales superiores."
    },
    {
        pregunta: "En la interpretación de la ley, si existe contradicción entre una ley de aplicación general y una ley especial (ej. Código Civil vs Código de Minería), ¿cuál prevalece?",
        opciones: ["A. Prevalece el Código Civil por ser la norma supletoria común.", "B. Prevalece la ley posterior en el tiempo, sin importar su especialidad.", "C. Prevalecen las disposiciones especiales (Art. 4), pues la ley especial deroga o prefiere a la general en su materia específica.", "D. Queda al arbitrio del juez."],
        correcta: 2,
        explicacion: "El Art. 4 y el Art. 13 consagran el principio de especialidad (lex specialis derogat legi generali). Las disposiciones especiales se aplicarán con preferencia a las del Código Civil."
    },
    {
        pregunta: "Para proteger la existencia del 'nasciturus', el Artículo 75 del Código Civil establece que:",
        opciones: ["A. La madre puede pedir una indemnización anticipada.", "B. El juez podrá tomar, a petición de cualquier persona o de oficio, todas las providencias que le parezcan convenientes para proteger la existencia del no nacido.", "C. Se debe constituir un curador adjunto siempre.", "D. Se le reconoce plena personalidad jurídica inmediata."],
        correcta: 1,
        explicacion: "Esta norma entrega al juez amplias facultades, incluso de oficio, si cree que la vida del que está por nacer peligra, complementando la protección constitucional de la vida del nasciturus."
    },
    {
        pregunta: "Con respecto a los 'Atributos de la Personalidad', el Estado Civil:",
        opciones: ["A. Corresponde tanto a personas naturales como jurídicas.", "B. Es la calidad de un individuo en cuanto le habilita para ejercer derechos políticos.", "C. Es la calidad de un individuo en cuanto le habilita para ejercer ciertos derechos o contraer ciertas obligaciones civiles, derivado de sus relaciones de familia.", "D. Se adquiere al cumplir la mayoría de edad."],
        correcta: 2,
        explicacion: "El Art. 304 define el estado civil, el cual es un atributo exclusivo de las personas naturales, indivisible, irrenunciable e imprescriptible, que nace de la filiación o el matrimonio."
    },
    {
        pregunta: "En Chile, la 'Capacidad de Goce' se define como:",
        opciones: ["A. La facultad de poder administrar los bienes propios.", "B. La aptitud legal de una persona para ser titular de derechos y obligaciones, la cual es inherente a toda persona natural por el solo hecho de serlo.", "C. La aptitud para comparecer en juicio.", "D. El derecho a disfrutar de los frutos de una cosa."],
        correcta: 1,
        explicacion: "La capacidad de goce (o adquisitiva) es un atributo esencial de la personalidad. Toda persona, por existir legalmente, la tiene. En cambio, la capacidad de ejercicio (poder actuar por sí mismo) puede estar limitada en incapaces."
    },
    {
        pregunta: "Si se declara la Muerte Presunta de una persona, el día presuntivo de la muerte que fijará el juez será, por regla general:",
        opciones: ["A. El primer día del último año en que se tuvieron noticias.", "B. El último día del primer bienio (2 años) contado desde la fecha de las últimas noticias.", "C. El día exacto en que se vio por última vez al desaparecido.", "D. Cinco años exactos desde la desaparición."],
        correcta: 1,
        explicacion: "El Art. 81 N°6 establece la regla matemática para fijar el día presuntivo de muerte: el último día del primer bienio (2 años) contado desde las últimas noticias. A partir de ahí se calculan los plazos para las posesiones provisorias y definitivas."
    },
    {
        pregunta: "La responsabilidad extracontractual CIVIL de una persona jurídica:",
        opciones: ["A. No existe, pues las personas jurídicas no tienen voluntad propia para cometer delitos o cuasidelitos.", "B. Solo responde subsidiariamente el Estado.", "C. Es plenamente aceptada. Responde tanto por los hechos propios (actos de sus órganos o representantes en el ejercicio de sus funciones) como por el hecho de sus dependientes.", "D. Se limita solo al monto de sus utilidades."],
        correcta: 2,
        explicacion: "La doctrina y jurisprudencia chilena sostienen que la persona jurídica comete delito o cuasidelito civil a través de sus órganos, respondiendo directamente por el hecho propio, y respondiendo por presunción (hecho ajeno) respecto de sus empleados subalternos."
    },
    {
        pregunta: "Respecto al domicilio, la ley presume el 'ánimo de permanecer' y avecindarse en un lugar por hechos como:",
        opciones: ["A. Estar de viaje como turista por más de 30 días.", "B. Abrir en él una tienda, botica o fábrica, o aceptar en dicho lugar un cargo concejil (empleo permanente).", "C. Pagar una multa de tránsito en dicha comuna.", "D. Arrendar una habitación por un fin de semana."],
        correcta: 1,
        explicacion: "El Art. 64 enuncia presunciones positivas de domicilio civil, basadas en actos que denotan la intención clara de arraigarse, como abrir un negocio o aceptar un trabajo fijo en la localidad."
    },
    {
        pregunta: "Si una persona muere, su 'Existencia Legal' termina y su patrimonio:",
        opciones: ["A. Pasa a ser de los acreedores.", "B. Se transfiere al Estado de inmediato.", "C. Se transmite a sus herederos, porque los derechos y obligaciones patrimoniales son, por regla general, transmisibles por causa de muerte.", "D. Se extingue, desapareciendo sus deudas."],
        correcta: 2,
        explicacion: "Con la muerte de la persona natural (Art. 78) termina la existencia, pero su patrimonio no desaparece, se genera la Sucesión por Causa de Muerte, continuando los herederos en la posición jurídica del causante."
    },
    // ==========================================
    // NUEVO BLOQUE 5 DE 5: OBLIGACIONES AVANZADAS (MIXTAS)
    // ==========================================
    {
        pregunta: "En una obligación alternativa (Art. 1499), que es aquella en que se deben varias cosas y la ejecución de una exonera de la otra, la regla general sobre a quién corresponde la elección de la cosa a entregar es:",
        opciones: ["A. Corresponde al acreedor siempre.", "B. Corresponde al juez.", "C. Corresponde al deudor, a menos que se haya pactado lo contrario.", "D. Deben elegir de mutuo acuerdo."],
        correcta: 2,
        explicacion: "El Art. 1500 dispone que la elección es del deudor, por regla general. Por tanto, el deudor cumple entregando cualquiera de las cosas debidas, y el acreedor no puede exigir determinadamente una de ellas."
    },
    {
        pregunta: "En las obligaciones facultativas (Art. 1505), donde se debe una sola cosa pero el deudor tiene la facultad de pagar con otra:",
        opciones: ["A. Si la cosa principal debida perece por caso fortuito, la obligación se extingue y el acreedor no puede exigir la cosa facultativa.", "B. El acreedor puede elegir exigir la cosa principal o la facultativa.", "C. Hay pluralidad de prestaciones y ambas son exigibles.", "D. Si la cosa perece, el deudor debe pagar indemnización obligatoriamente."],
        correcta: 0,
        explicacion: "El Art. 1506 es claro: el acreedor solo tiene derecho a pedir la cosa principal debida. Si esta perece por caso fortuito, antes de haberse constituido en mora, la obligación se extingue, aunque exista la cosa facultativa (pues esta es un mero beneficio del deudor)."
    },
    {
        pregunta: "La 'Mora del Acreedor' (Mora Accipiendi) se produce cuando el acreedor se niega injustificadamente a recibir el pago. Una de sus consecuencias legales es:",
        opciones: ["A. Hace caducar la obligación inmediatamente.", "B. El deudor queda liberado de pagar indemnización moratoria y su responsabilidad por la cosa se reduce solo a culpa grave o dolo.", "C. El acreedor pierde el derecho a demandar para siempre.", "D. Se extingue la deuda y el deudor se queda con la cosa."],
        correcta: 1,
        explicacion: "La mora del acreedor purga la mora del deudor. Si el deudor quiere entregar y el acreedor no recibe, los riesgos y expensas de cuidado pasan al acreedor, y la responsabilidad del deudor baja al mínimo (Art. 1680 y 1548)."
    },
    {
        pregunta: "Respecto al Pago, si el deudor es insolvente y efectúa una 'Cesión de Bienes' (Art. 1614) a sus acreedores:",
        opciones: ["A. Extingue sus deudas íntegramente, aunque los bienes no alcancen a cubrir el total.", "B. Se presume fraudulenta y es un delito penal.", "C. Comprende el abandono voluntario que hace el deudor de todos sus bienes (salvo inembargables) para que los acreedores se paguen con ellos, extinguiendo las deudas hasta la cantidad en que sean satisfechas.", "D. El deudor pierde su libertad de movimiento."],
        correcta: 2,
        explicacion: "La cesión de bienes es un mecanismo de insolvencia civil. El deudor abandona sus bienes a los acreedores. Las deudas solo se extinguen hasta donde alcancen los bienes; si queda saldo insoluto y el deudor mejora de fortuna después, los acreedores pueden seguir persiguiéndolo."
    },
    {
        pregunta: "El 'Mutuo Disenso' o Resciliación, al ser una convención para extinguir obligaciones, exige según el Art. 1567 que:",
        opciones: ["A. Las obligaciones estén íntegramente cumplidas.", "B. Las partes sean capaces de disponer libremente de lo suyo y la obligación aún no esté íntegramente cumplida (queden obligaciones pendientes).", "C. Haya un vicio de nulidad en el contrato original.", "D. Intervenga el Conservador de Bienes Raíces."],
        correcta: 1,
        explicacion: "Para que las partes consientan en dar por nula o resciliada la obligación, debe existir algo que resciliar. Si el contrato ya se cumplió por ambas partes íntegramente, no hay obligación que extinguir, aunque podrían hacer un nuevo contrato que revierta los efectos materiales."
    },
    {
        pregunta: "La Novación por cambio de acreedor (Novación Subjetiva Activa) difiere de la Cesión de Derechos en que:",
        opciones: ["A. La novación requiere que conste en instrumento público.", "B. En la cesión pasa el mismo crédito con sus garantías; en la novación, se extingue el crédito antiguo con todas sus garantías (hipotecas, fianzas) y nace uno nuevo.", "C. La novación no requiere consentimiento del deudor, la cesión sí.", "D. Son exactamente la misma figura legal."],
        correcta: 1,
        explicacion: "La esencia de la novación es la extinción. Al nacer una nueva obligación a favor de un nuevo acreedor, mueren los privilegios, prendas e hipotecas de la antigua obligación (a menos que se reserve expresamente), a diferencia de la cesión que transfiere la obligación idéntica y completa."
    },
    {
        pregunta: "La 'Remisión' o condonación tácita de la deuda se produce cuando (Art. 1654):",
        opciones: ["A. El acreedor no cobra la deuda en 1 año.", "B. El acreedor entrega voluntariamente al deudor el título (documento) de la obligación, o lo destruye o cancela con ánimo de extinguir la deuda.", "C. El deudor declara que no puede pagar.", "D. Las partes dejan de enviarse correos."],
        correcta: 1,
        explicacion: "El Código presume la remisión cuando el acreedor, de manera voluntaria, devuelve al deudor el documento donde consta la deuda, o lo rompe, lo que evidencia su ánimo de liberarlo del pago."
    },
    {
        pregunta: "El 'Fraude Pauliano', que da origen a la Acción Pauliana (Art. 2468), requiere que el deudor insolvente haya celebrado un acto perjudicial para sus acreedores. Si el acto perjudicial fue ONEROSO (ej. una compraventa simulando un precio bajo), la ley exige probar el fraude:",
        opciones: ["A. Solo en el deudor.", "B. Tanto en el deudor que vende como en el tercero que adquiere (conocimiento del mal estado de los negocios del deudor).", "C. En el Conservador.", "D. No es necesario probar fraude, opera objetivamente."],
        correcta: 1,
        explicacion: "El Art. 2468 establece una distinción vital: si el acto es oneroso, para revocarlo se requiere probar el 'consilium fraudis' (mala fe) tanto del otorgante (deudor) como del adquirente. Si el acto fue gratuito (ej. donación), basta probar la mala fe del deudor."
    },
    {
        pregunta: "La 'Delegación' en materia de obligaciones (donde el deudor encarga a un tercero que pague por él):",
        opciones: ["A. Produce siempre novación.", "B. No produce novación, a menos que el acreedor exprese claramente que da por libre al deudor primitivo (delegación perfecta).", "C. Hace solidarios a ambos deudores siempre.", "D. Es inoponible al acreedor."],
        correcta: 1,
        explicacion: "La delegación (Art. 1631) puede ser perfecta o imperfecta. Solo si el acreedor asiente y declara liberar al primer deudor, hay novación (perfecta). Si el acreedor no lo libera, tiene dos deudores, pero no hay novación."
    },
    {
        pregunta: "En una obligación sujeta a condición resolutoria ordinaria, verificada la condición (el hecho futuro e incierto se cumple):",
        opciones: ["A. Se requiere dictar sentencia para extinguir el derecho.", "B. El derecho se extingue ipso facto (de pleno derecho) y debe restituirse lo recibido bajo tal condición.", "C. El acreedor debe elegir entre la resolución o el cumplimiento.", "D. Solo procede el pago de indemnización."],
        correcta: 1,
        explicacion: "La condición resolutoria ordinaria opera de pleno derecho, a diferencia de la tácita y el pacto comisorio, que requieren resolución judicial a elección del acreedor cumplidor."
    },
    {
        pregunta: "Respecto a los bienes inembargables que restringen el Derecho de Prenda General, el Código Civil y el CPC excluyen, entre otros, a:",
        opciones: ["A. Todos los vehículos motorizados.", "B. Las cuentas corrientes bancarias.", "C. El lecho del deudor, su ropa, los libros relativos a su profesión y las remuneraciones hasta cierto límite legal.", "D. Los bienes heredados."],
        correcta: 2,
        explicacion: "El Art. 1618 del CC y el 445 del CPC establecen un catálogo de bienes inembargables por razones de humanidad, dignidad y subsistencia, protegiendo lo mínimo que necesita el deudor para vivir y trabajar."
    },
    {
        pregunta: "En las reglas de imputación al pago (Art. 1595 y ss), si la deuda devenga intereses y el deudor hace un abono que no alcanza para cubrir capital e intereses:",
        opciones: ["A. El pago se imputa primero al capital y el resto a intereses.", "B. El pago se imputa a la deuda más antigua.", "C. El pago se imputa primero a los intereses, salvo que el acreedor consienta expresamente que se impute al capital.", "D. El pago se imputa por mitades iguales a ambos ítems."],
        correcta: 2,
        explicacion: "El Art. 1595 es una regla protectora del crédito. Si se deben capital e intereses, el pago se imputará primero a los intereses. De lo contrario, el capital disminuiría, generando menos intereses a futuro, perjudicando al acreedor."
    },
    {
        pregunta: "El 'Acreedor Quirografario' es aquel que:",
        opciones: ["A. Tiene su crédito respaldado con una firma de quiromancia.", "B. No goza de ninguna preferencia o privilegio, perteneciendo a la quinta clase de créditos, pagándose a prorrata de lo que sobre.", "C. Goza de un privilegio prendario.", "D. Representa al Fisco en materias tributarias."],
        correcta: 1,
        explicacion: "El término 'quirografario' (o valista) designa al acreedor común y corriente que carece de garantías reales (hipoteca, prenda) o privilegios legales. Cobra al final con el 'derecho de prenda general'."
    },
    {
        pregunta: "Según la teoría general, un 'Contrato Conmutativo' es aquel en que:",
        opciones: ["A. La utilidad consiste en una contingencia incierta de ganancia o pérdida.", "B. Solo se transfiere el uso y goce de la cosa.", "C. Cada una de las partes se obliga a dar o hacer una cosa que se mira como equivalente a lo que la otra parte debe dar o hacer a su vez.", "D. Solo una de las partes contrae obligaciones, pero de gran magnitud."],
        correcta: 2,
        explicacion: "El Art. 1441 define la conmutatividad. Las partes miran sus prestaciones como equivalentes (ej. el precio de la casa es equivalente al valor de la casa). Si la utilidad es incierta, es un contrato Aleatorio."
    },
    // ==========================================
    // LOTE FINAL: 101 A 125 (OBLIGACIONES FINAS, LEY Y PERSONA)
    // ==========================================
    {
        pregunta: "El Artículo 8° del Código Civil dispone que 'Nadie podrá alegar ignorancia de la ley después que ésta haya entrado en vigencia'. Jurídicamente, esta norma consagra:",
        opciones: ["A. Una presunción simplemente legal, que admite prueba en contrario si la persona es analfabeta.", "B. Una ficción legal que asume el conocimiento general para dar seguridad y certeza al ordenamiento jurídico, no admitiendo prueba en contrario.", "C. Una garantía constitucional de educación cívica.", "D. Un principio exclusivo del derecho penal."],
        correcta: 1,
        explicacion: "El Art. 8 consagra una ficción (o presunción de derecho, según algunos autores clásicos) indispensable para la seguridad jurídica. Impide que las personas se excusen de cumplir sus obligaciones o evadan sanciones alegando que no conocían la ley."
    },
    {
        pregunta: "Según el Artículo 5° del Código Civil, ¿qué obligación tienen la Corte Suprema y las Cortes de Alzada respecto de la legislación chilena?",
        opciones: ["A. Derogar las leyes que consideren inconstitucionales.", "B. Dictar leyes de reemplazo si hay un vacío legal.", "C. Dar cuenta anual al Presidente de la República de las dudas y dificultades en la inteligencia y aplicación de las leyes, y de los vacíos que noten en ellas.", "D. Consultar al Congreso antes de dictar sentencia en casos dudosos."],
        correcta: 2,
        explicacion: "El Art. 5 impone esta obligación a los tribunales superiores. No pueden crear ni derogar leyes (principio de separación de poderes), pero colaboran con el Ejecutivo informando sobre los defectos y vacíos legislativos."
    },
    {
        pregunta: "Una 'presunción negativa de domicilio' (Art. 63) ocurre cuando:",
        opciones: ["A. Una persona abre una fábrica en un territorio.", "B. El individuo reside temporalmente en un lugar de forma obligada (ej. confinado por decreto) o por una circunstancia transitoria (como un viaje).", "C. Una persona vota en dos comunas distintas.", "D. El sujeto se muda sin avisar al Registro Civil."],
        correcta: 1,
        explicacion: "El Art. 63 señala que la mera residencia que se hace por motivos forzosos o por un interés meramente pasajero (sin intención real de quedarse) no constituye domicilio."
    },
    {
        pregunta: "Si bien la capacidad de goce es inherente a toda persona, la 'Capacidad de Ejercicio' (Art. 1445) puede faltar en ciertos individuos. Son absolutamente incapaces:",
        opciones: ["A. Los menores adultos y los disipadores interdictos.", "B. Los sordos o sordomudos que no pueden darse a entender claramente, los dementes y los impúberes.", "C. Las mujeres casadas en sociedad conyugal.", "D. Los quebrados y los extranjeros indocumentados."],
        correcta: 1,
        explicacion: "El Art. 1447 señala taxativamente a los incapaces absolutos. Sus actos no surten ni aun obligaciones naturales y no admiten caución. Solo pueden actuar en la vida jurídica representados por terceros."
    },
    {
        pregunta: "El fin de las personas jurídicas de derecho privado corporativas se produce, entre otras causas, por:",
        opciones: ["A. El fallecimiento de su socio más antiguo.", "B. Disolución voluntaria, disminución de sus miembros a un número inferior al que la ley exige, o por cancelación de su personalidad mediante autoridad pública.", "C. Automáticamente al no reportar utilidades por 3 años.", "D. Cuando el Presidente de la República asume como miembro honorario."],
        correcta: 1,
        explicacion: "Las Corporaciones terminan por causales legales, voluntad de la asamblea, o por decisión estatal si comprometen la seguridad o el orden público, o si no cumplen los fines para los que fueron creadas."
    },
    {
        pregunta: "En la teoría alemana moderna de las obligaciones, se distingue entre 'Schuld' y 'Haftung', lo que en español se traduce como:",
        opciones: ["A. Contrato y Cuasicontrato.", "B. Deuda (el deber de prestación) y Responsabilidad (la sujeción del patrimonio del deudor al poder del acreedor).", "C. Daño emergente y Lucro cesante.", "D. Obligación principal y Obligación accesoria."],
        correcta: 1,
        explicacion: "El Schuld es el deber de observar la conducta (la deuda). El Haftung es la consecuencia del incumplimiento: el patrimonio del deudor queda sujeto a la agresión del acreedor (la responsabilidad o garantía)."
    },
    {
        pregunta: "El 'Anatocismo', prohibido originariamente por el Código Civil de Bello pero permitido bajo ciertas condiciones por la Ley 18.010, consiste en:",
        opciones: ["A. El cobro de intereses usureros sobre el 50%.", "B. La capitalización de intereses, es decir, cobrar intereses sobre los intereses ya devengados y atrasados.", "C. Cobrar en moneda extranjera y exigir el pago en pesos.", "D. La extinción de la deuda por inflación."],
        correcta: 1,
        explicacion: "El anatocismo es el interés del interés. La Ley 18.010 sobre operaciones de crédito de dinero permite la capitalización de intereses siempre que se trate de períodos no inferiores a 30 días."
    },
    {
        pregunta: "En una 'Obligación Simplemente Conjunta', si uno de los codeudores cae en insolvencia total:",
        opciones: ["A. Su cuota impaga se reparte automáticamente entre los demás codeudores solventes.", "B. Su cuota impaga recae como pérdida exclusiva del acreedor, no gravando a los demás codeudores.", "C. El acreedor puede rematar la casa de cualquier codeudor solidario.", "D. El Estado asume subsidiariamente el pago."],
        correcta: 1,
        explicacion: "El Art. 1511 inc. 1 señala la independencia de las cuotas en las obligaciones conjuntas. La insolvencia de uno no afecta a los demás deudores, siendo un riesgo exclusivo del acreedor."
    },
    {
        pregunta: "El Art. 1526 del Código Civil establece excepciones a la divisibilidad del pago en obligaciones que, aunque son de objeto divisible, la ley exige el cumplimiento total. Un ejemplo clásico de esto es:",
        opciones: ["A. La obligación de pagar alimentos al cónyuge.", "B. La acción hipotecaria o prendaria, que se dirige contra el codeudor o heredero que posea la cosa hipotecada o empeñada en su totalidad.", "C. La compraventa de acciones en la bolsa.", "D. El préstamo de dinero entre amigos."],
        correcta: 1,
        explicacion: "Es la Indivisibilidad de Pago Pasiva (Art. 1526 N°1). La hipoteca y la prenda son indivisibles, gravando toda la cosa a la seguridad de la deuda. El acreedor persigue el bien entero, aunque el heredero poseedor solo deba una cuota de la deuda."
    },
    {
        pregunta: "Una 'Condición Meramente Potestativa', de aquellas que dependen exclusivamente de la voluntad del deudor (ej. 'Te pagaré 100 mil pesos si yo quiero'):",
        opciones: ["A. Es perfectamente válida como contrato unilateral.", "B. Es nula, puesto que no existe verdadera intención de obligarse (falta de seriedad del vínculo).", "C. Pasa a ser una obligación natural.", "D. Obliga al deudor si se puso por escrito."],
        correcta: 1,
        explicacion: "El Art. 1478 sanciona con nulidad las obligaciones contraídas bajo una condición que consista en la mera voluntad de la persona que se obliga, porque destruye el concepto mismo de obligación (vinculación imperativa)."
    },
    {
        pregunta: "Según la regla general del Art. 1488, si una condición suspensiva se cumple y tiene efecto retroactivo, ¿qué ocurre con los frutos producidos por la cosa mientras la condición estuvo pendiente?",
        opciones: ["A. Deben restituirse íntegramente al acreedor junto con la cosa.", "B. Quedan a beneficio del Fisco.", "C. Pertenecen al deudor que tenía la cosa, no debiendo restituirlos salvo pacto o ley en contrario.", "D. Deben dividirse a medias entre las partes."],
        correcta: 2,
        explicacion: "Verificada la condición, no se deben los frutos percibidos en el tiempo intermedio (Art. 1488). La retroactividad de la condición en Chile tiene sus excepciones protectoras, como el resguardo de frutos y actos de administración."
    },
    {
        pregunta: "La 'Acción Resolutoria' emanada de la condición resolutoria tácita (Art. 1489) prescribe:",
        opciones: ["A. En 5 años desde que la obligación se hizo exigible, aplicándose las reglas de la prescripción ordinaria.", "B. En 4 años contados desde la celebración del contrato, como la nulidad relativa.", "C. No prescribe nunca.", "D. En 6 meses."],
        correcta: 0,
        explicacion: "A diferencia de la acción rescisoria (nulidad relativa que prescribe en 4 años) o el pacto comisorio que prescribe en máximo 4 años, la acción resolutoria tácita general sigue la regla de las acciones ordinarias: prescribe en 5 años desde la exigibilidad (Art. 2515)."
    },
    {
        pregunta: "Si un deudor de una obligación a plazo decide pagar 'antes' de que venza el término estipulado (pago anticipado):",
        opciones: ["A. El acreedor está obligado a devolverle el dinero por pago indebido.", "B. Se presume dolo por parte del deudor.", "C. Lo que se paga antes de cumplirse el plazo no está sujeto a restitución, pues supone una renuncia al beneficio del plazo (Art. 1495).", "D. Se aplican intereses moratorios en su contra."],
        correcta: 2,
        explicacion: "El deudor que paga antes de plazo renuncia a su derecho (si el plazo está a su favor). El pago es válido, extingue la obligación y no puede repetir lo pagado alegando error en el cómputo del tiempo."
    },
    {
        pregunta: "En la Cláusula Penal (Art. 1535), ¿puede el acreedor exigir al mismo tiempo la pena y la indemnización de perjuicios ordinaria?",
        opciones: ["A. Sí, en todos los casos, es el principal beneficio de la pena.", "B. Solo si demanda en juicio ejecutivo.", "C. No puede exigirlas conjuntamente, a menos que se haya estipulado así expresamente, porque la pena es una avaluación anticipada de los perjuicios.", "D. Sí, si el juez lo autoriza por dolo."],
        correcta: 2,
        explicacion: "El Art. 1543 establece la no acumulación. No podrá exigirse a la vez la pena y la indemnización de perjuicios, a menos de haberse estipulado así expresamente (evitando un doble pago por el mismo daño)."
    },
    {
        pregunta: "El 'Pago por Consignación' requiere una fase extrajudicial (Oferta) y una fase judicial. ¿A cargo de quién corren los gastos de una consignación válida?",
        opciones: ["A. Del deudor, por ser el interesado en liberarse.", "B. Del acreedor, por haber provocado la consignación al negarse a recibir el pago oportunamente o no comparecer.", "C. Se pagan a medias entre acreedor y deudor.", "D. Los absorbe el Estado como garantía constitucional."],
        correcta: 1,
        explicacion: "El Art. 1604 dispone que las expensas (gastos) de toda oferta y consignación válidas serán de cargo del acreedor, como sanción a su falta de diligencia o mora accipiendi."
    },
    {
        pregunta: "En la 'Dación en Pago', al ser un acto de transferencia de dominio donde se entrega una cosa distinta para extinguir una deuda, el deudor debe:",
        opciones: ["A. Tener plena capacidad de enajenar y ser dueño de la cosa entregada.", "B. Ser menor adulto.", "C. Pedir permiso al Conservador de Bienes Raíces siempre.", "D. Entregar únicamente cosas fungibles."],
        correcta: 0,
        explicacion: "La dación en pago es un título traslaticio y pago a la vez. Aplicando las reglas del pago (Art. 1575), si la obligación es de transferir la propiedad, el que paga debe ser dueño de la cosa y tener capacidad para enajenarla, so pena de ineficacia."
    },
    {
        pregunta: "La 'Novación Objetiva por cambio de causa' ocurre cuando:",
        opciones: ["A. Se cambia al acreedor original.", "B. Se cambia al deudor original.", "C. La obligación sigue siendo de la misma cantidad y personas, pero cambia su fuente jurídica (ej. de deber el precio de una compraventa, a deber ese mismo dinero como préstamo o mutuo).", "D. Se otorga un plazo mayor para pagar."],
        correcta: 2,
        explicacion: "Es una de las formas de novación (Art. 1631 N°1). La obligación antigua se extingue y nace una nueva porque se cambia la causa (el título o fuente) de la deuda, aunque el objeto siga siendo el mismo."
    },
    {
        pregunta: "Si el acreedor de manera voluntaria perdona una deuda mediante la 'Remisión', ¿qué solemnidad exige la ley si la deuda perdonada es cuantiosa (supera los 2 centavos legales/2 UTM históricas)?",
        opciones: ["A. Escritura pública exclusivamente.", "B. Testigos presenciales.", "C. La remisión a título gratuito se sujeta a las reglas de la donación entre vivos, requiriendo el trámite judicial de la 'insinuación'.", "D. Aprobación del Banco Central."],
        correcta: 2,
        explicacion: "Al ser una liberalidad, el Art. 1653 la sujeta a las reglas de las donaciones. Si el monto condonado supera la medida de las pequeñas donaciones consuetudinarias, el juez debe autorizarla previamente (insinuación) para proteger a los herederos y acreedores del remitente."
    },
    {
        pregunta: "Si la especie o cuerpo cierto que se debe perece por culpa del deudor (Art. 1672):",
        opciones: ["A. La obligación se extingue por imposibilidad material absoluta.", "B. La obligación subsiste, pero varía de objeto: el deudor es obligado al precio de la cosa y a la indemnización de perjuicios.", "C. El contrato se resuelve automáticamente.", "D. El acreedor pierde su derecho y asume el riesgo."],
        correcta: 1,
        explicacion: "El Art. 1672 establece la perpetuatio obligationis. La obligación no muere; se transforma. En lugar del cuerpo cierto destruido por negligencia, el deudor debe entregar su valor en dinero, más los daños causados por el incumplimiento."
    },
    {
        pregunta: "Para que un acto procesal produzca la 'Interrupción Civil' de la prescripción a favor del acreedor, la jurisprudencia y la ley exigen que:",
        opciones: ["A. Se presente la demanda en la secretaría del tribunal, sin importar si el deudor se entera.", "B. Se notifique legalmente la demanda al deudor ANTES de que se cumpla el plazo de prescripción.", "C. El acreedor publique un aviso en el periódico.", "D. El juez dicte sentencia definitiva."],
        correcta: 1,
        explicacion: "El Art. 2503 consagra que no hay interrupción si no se notifica válidamente al deudor. La notificación es el acto que rompe el silencio del acreedor y pone al deudor en conocimiento inequívoco del cobro."
    },
    {
        pregunta: "Existen casos donde la interrupción civil iniciada por el acreedor resulta 'ineficaz' (Art. 2503), por ejemplo cuando:",
        opciones: ["A. El acreedor desiste expresamente de la demanda o se declara abandonado el procedimiento.", "B. El deudor contesta la demanda alegando incompetencia del tribunal.", "C. El juicio dura más de 5 años.", "D. El deudor se declara en quiebra."],
        correcta: 0,
        explicacion: "El CC castiga al acreedor negligente o que se arrepiente. Si se desiste, o deja paralizado el juicio hasta que el juez declare el abandono del procedimiento, o si obtiene sentencia absolutoria para el deudor, se entiende que la prescripción nunca se interrumpió."
    },
    {
        pregunta: "Las prescripciones extintivas de 'corto tiempo' (Art. 2521 y ss) incluyen plazos muy breves para ciertas profesiones. El cobro de honorarios de médicos, abogados o ingenieros prescribe en:",
        opciones: ["A. 6 meses.", "B. 1 año.", "C. 2 años.", "D. 5 años."],
        correcta: 2,
        explicacion: "El Art. 2521 establece expresamente que prescriben en 2 años los honorarios de jueces, abogados, procuradores; los de médicos y cirujanos; los de directores o profesores de colegios y escuelas, etc."
    },
    {
        pregunta: "El fenómeno de la 'Interversión de la Prescripción' ocurre en las prescripciones de corto tiempo (ej. cobranza comercial de 1 año) cuando:",
        opciones: ["A. El deudor se muda de ciudad.", "B. El deudor firma un pagaré o documento reconociendo la deuda, transformando el plazo corto original en el plazo largo de la acción ejecutiva (3 años) u ordinaria (5 años).", "C. El acreedor interpone una acción reivindicatoria.", "D. El juez reduce el plazo a la mitad por equidad."],
        correcta: 1,
        explicacion: "El Art. 2523 contempla que las prescripciones de corto tiempo no se suspenden, pero se 'intervierten' (cambian de naturaleza y plazo) si interviene pagaré u obligación escrita, o concesión de un nuevo plazo por el acreedor, pasando a las reglas generales."
    },
    {
        pregunta: "En el contrato de Transacción (Art. 2446), la ley le otorga un efecto extraordinario a este acuerdo entre particulares:",
        opciones: ["A. No tiene mayor peso probatorio que un simple recibo.", "B. Produce el efecto de cosa juzgada en última instancia (al igual que una sentencia ejecutoriada de la Corte Suprema), impidiendo que el asunto transigido vuelva a tribunales.", "C. Permite a terceros impugnarlo libremente.", "D. Genera solidaridad automática entre las partes."],
        correcta: 1,
        explicacion: "El Art. 2460 consagra el poder de la transacción: 'produce el efecto de cosa juzgada en última instancia'. Es un equivalente jurisdiccional; las partes, haciéndose concesiones mutuas, matan el litigio para siempre."
    },
    {
        pregunta: "Respecto a la clasificación pentapartita clásica (Contrato, Cuasicontrato, Delito, Cuasidelito y Ley), uno de los principales Cuasicontratos regulados en el Código Civil es:",
        opciones: ["A. La Compraventa comercial.", "B. El mandato judicial.", "C. La Agencia Oficiosa (cuando una persona asume voluntariamente la administración de negocios ajenos sin mandato).", "D. El dolo contractual."],
        correcta: 2,
        explicacion: "El Art. 2285 enuncia los tres principales cuasicontratos del Código: la agencia oficiosa, el pago de lo no debido, y la comunidad. Son hechos voluntarios, lícitos y no convencionales que generan obligaciones (ej. el deber de reembolso al gestor oficioso)."
    },
    // ==========================================
    // NUEVO BLOQUE 3 DE 5: MODOS DE EXTINGUIR Y PRELACIÓN
    // ==========================================
    {
        pregunta: "El 'Pago Efectivo' o Solución (Art. 1568) se define jurídicamente como:",
        opciones: ["A. La entrega de una suma de dinero en efectivo.", "B. La prestación de lo que se debe, sea esta una obligación de dar, hacer o no hacer.", "C. La firma de un finiquito ante notario.", "D. La dación en pago autorizada por el acreedor."],
        correcta: 1,
        explicacion: "El pago no solo es dinero. Según el Art. 1568, el pago es la prestación de lo que se debe. Si la obligación es pintar una casa, el pago es pintar la casa (hecho); si es no construir, el pago es la abstención."
    },
    {
        pregunta: "¿A quién debe hacerse el pago para que sea válido y extinga la obligación (Art. 1576)?",
        opciones: ["A. Únicamente al acreedor en persona.", "B. Al acreedor, a su representante legal o voluntario, o al poseedor del crédito si se paga de buena fe.", "C. Al cónyuge del acreedor en todos los casos.", "D. Al juez de la causa siempre."],
        correcta: 1,
        explicacion: "Para que el pago sea válido debe hacerse al acreedor (bajo cuyo nombre se incluyen sus herederos), a quien el acreedor designe (diputado para el pago) o a quien la ley o el juez autoricen. También vale al poseedor del crédito si se hace de buena fe."
    },
    {
        pregunta: "Si se paga a una persona distinta del acreedor o su representante, el pago puede validarse posteriormente si (Art. 1577):",
        opciones: ["A. El deudor es pobre.", "B. El acreedor ratifica el pago expresa o tácitamente, o si el que recibió el pago sucede en el crédito al acreedor.", "C. Pasan más de 48 horas sin reclamos.", "D. El monto es inferior a 1 UTM."],
        correcta: 1,
        explicacion: "Un pago inicialmente nulo por hacerse a persona no legítima se valida si el acreedor lo ratifica o si quien recibió el pago adquiere después la calidad de acreedor (ej. por herencia)."
    },
    {
        pregunta: "La 'Novación' (Art. 1628) es un modo de extinguir obligaciones que consiste en:",
        opciones: ["A. Dar un plazo más largo para pagar.", "B. La sustitución de una nueva obligación a otra anterior, la cual queda por tanto extinguida.", "C. El perdón de la deuda por parte del acreedor.", "D. El pago de la deuda mediante una propiedad."],
        correcta: 1,
        explicacion: "La esencia de la novación es que nace una obligación para matar a la anterior. Requiere una obligación válida anterior, una nueva obligación, diferencia entre ambas y el animus novandi."
    },
    {
        pregunta: "En la novación por cambio de deudor, si el acreedor acepta al nuevo deudor pero NO libera al antiguo, ¿qué figura jurídica se produce?",
        opciones: ["A. Novación subjetiva perfecta.", "B. Delegación imperfecta o asunción de deuda (ambos deudores quedan obligados, usualmente solidarios).", "C. Resciliación parcial.", "D. Confusión de patrimonios."],
        correcta: 1,
        explicacion: "Para que haya novación por cambio de deudor, el acreedor debe declarar expresamente su voluntad de liberar al deudor primitivo. Si no lo hace, solo suma un nuevo deudor, pero la obligación original no muere."
    },
    {
        pregunta: "Para que opere la 'Compensación Legal' (Art. 1656), las deudas deben ser, entre otros requisitos:",
        opciones: ["A. De igual monto exactamente.", "B. De dinero o cosas fungibles de igual género y calidad, líquidas y actualmente exigibles.", "C. Entre más de tres personas simultáneamente.", "D. Solo de obligaciones naturales."],
        correcta: 1,
        explicacion: "La compensación legal exige: reciprocidad, fungibilidad (misma especie/calidad), liquidez (monto determinado) y exigibilidad (que se puedan cobrar ya)."
    },
    {
        pregunta: "La 'Remisión' es un modo de extinguir las obligaciones que consiste en:",
        opciones: ["A. Enviar el pago por correo.", "B. El perdón de la deuda que hace el acreedor al deudor.", "C. La pérdida de la cosa debida por culpa del deudor.", "D. El traslado de la deuda a otra comuna."],
        correcta: 1,
        explicacion: "La remisión o condonación es la renuncia gratuita que hace el acreedor de su derecho de crédito. Para que sea válida como modo de extinguir, el acreedor debe ser legalmente capaz de disponer de la cosa."
    },
    {
        pregunta: "La 'Confusión' como modo de extinguir (Art. 1665) se produce cuando:",
        opciones: ["A. El contrato está redactado de forma incomprensible.", "B. Concurren en una misma persona las calidades de acreedor y deudor de una misma obligación.", "C. El acreedor olvida el monto de la deuda.", "D. Se pierden los títulos de crédito."],
        correcta: 1,
        explicacion: "Ocurre frecuentemente por causa de muerte (ej. el deudor hereda al acreedor). Jurídicamente, nadie puede ser deudor de sí mismo, por lo que la obligación se extingue por el ministerio de la ley."
    },
    {
        pregunta: "Si el cuerpo cierto que se debe perece por 'caso fortuito' ANTES de que el deudor esté en mora, la regla general es que:",
        opciones: ["A. El deudor debe pagar el precio.", "B. La obligación se extingue y el deudor queda libre de responsabilidad.", "C. El deudor debe entregar otra cosa igual.", "D. El acreedor puede demandar por dolo."],
        correcta: 1,
        explicacion: "El Art. 1670 establece que si el cuerpo cierto perece, se destruye o deja de estar en el comercio por caso fortuito, la obligación se extingue. (Ad impossibilia nemo tenetur: nadie está obligado a lo imposible)."
    },
    {
        pregunta: "La 'Prescripción Extintiva' exige para su procedencia (Art. 2492):",
        opciones: ["A. Que el deudor se niegue a pagar por escrito.", "B. El transcurso de un lapso de tiempo durante el cual no se hayan ejercido las acciones, y que estas sean prescriptibles.", "C. Que el acreedor fallezca sin dejar herederos.", "D. La autorización del Conservador de Bienes Raíces."],
        correcta: 1,
        explicacion: "La prescripción extintiva es un modo de extinguir las acciones y derechos ajenos por no haberse ejercido dichas acciones durante cierto lapso de tiempo, concurriendo los demás requisitos legales."
    },
    {
        pregunta: "La interrupción civil de la prescripción extintiva requiere (Art. 2503):",
        opciones: ["A. Una carta certificada enviada al deudor.", "B. Todo recurso judicial intentado por el acreedor, siempre que se notifique legalmente la demanda antes de cumplirse el plazo.", "C. Un aviso en el diario oficial.", "D. La declaración de quiebra del deudor."],
        correcta: 1,
        explicacion: "No basta con presentar la demanda; para interrumpir civilmente la prescripción, la demanda debe ser notificada válidamente al deudor dentro del plazo legal."
    },
    {
        pregunta: "Respecto a la Prelación de Créditos, los créditos que gozan de 'Privilegio' son los de las clases:",
        opciones: ["A. Todas las clases.", "B. Primera, segunda y cuarta.", "C. Solo la tercera (hipotecarios).", "D. Quinta clase solamente."],
        correcta: 1,
        explicacion: "El Art. 2471 señala que gozan de privilegio los créditos de la 1ª, 2ª y 4ª clase. Los de la 3ª son preferentes (hipotecas) pero no se llaman privilegios, y los de la 5ª no tienen preferencia alguna (valistas)."
    },
    {
        pregunta: "Dentro de la Primera Clase de créditos (Art. 2472), ¿cuál tiene la máxima prioridad absoluta?",
        opciones: ["A. Los sueldos de los trabajadores.", "B. Las costas judiciales que se causen en interés general de los acreedores.", "C. Las expensas funerales necesarias del deudor difunto.", "D. Los créditos del Fisco."],
        correcta: 1,
        explicacion: "El orden del Art. 2472 es jerárquico. Las costas judiciales (N°1) se pagan antes que los funerales (N°2), los gastos de enfermedad (N°3) y las remuneraciones (N°5)."
    },
    {
        pregunta: "Los créditos de la Segunda Clase (Art. 2474) se caracterizan por ser privilegios 'especiales', lo que significa que:",
        opciones: ["A. Se pagan con cualquier bien del deudor.", "B. Solo pueden cobrarse sobre determinados bienes muebles del deudor (ej. el crédito del posadero sobre los efectos del cliente).", "C. Solo los puede cobrar el Estado.", "D. No prescriben nunca."],
        correcta: 1,
        explicacion: "A diferencia de los de 1ª clase (privilegio general sobre todo el patrimonio), los de 2ª clase están vinculados a bienes específicos. Si el bien no alcanza para pagar, el saldo restante pasa a ser de 5ª clase (valista)."
    },
    {
        pregunta: "La Tercera Clase de créditos comprende a los créditos hipotecarios. Su preferencia es:",
        opciones: ["A. General sobre todos los muebles.", "B. Especial sobre la finca hipotecada.", "C. Subsidiaria de la quinta clase.", "D. Solo sobre las naves mercantes."],
        correcta: 1,
        explicacion: "El acreedor hipotecario tiene preferencia para pagarse con el producto de la subasta del inmueble específico que garantiza su deuda (Art. 2477)."
    },
    {
        pregunta: "Los créditos de la Quinta Clase se llaman créditos 'valistas' o 'quirografarios' porque:",
        opciones: ["A. Son créditos de honor.", "B. No gozan de ninguna preferencia y se pagan a prorrata sobre el sobrante de la masa, sin consideración a su fecha.", "C. Se firman con la palma de la mano.", "D. Tienen prioridad sobre el Fisco."],
        correcta: 1,
        explicacion: "Los valistas son los acreedores comunes. Cobran al final, si queda algo después de pagar las cuatro clases preferentes, repartiéndose el dinero en proporción a sus créditos."
    },
    {
        pregunta: "El 'Beneficio de Competencia' (Art. 1625) es una excepción a la integridad del pago que permite a ciertos deudores:",
        opciones: ["A. No pagar nada.", "B. No ser obligados a pagar más de lo que buenamente puedan, dejándoseles lo indispensable para una modesta subsistencia.", "C. Pagar con trabajo comunitario.", "D. Elegir qué bienes entregar para el remate."],
        correcta: 1,
        explicacion: "Es un beneficio fundado en la piedad o parentesco (se otorga a ascendientes, descendientes, cónyuges, etc.), impidiendo que el acreedor deje al deudor en la miseria absoluta."
    },
    {
        pregunta: "La 'Dación en Pago' se diferencia de la Novación en que:",
        opciones: ["A. La dación requiere escritura pública siempre.", "B. La dación extingue la obligación mediante la ejecución de una prestación distinta a la debida, pero NO hace nacer una obligación nueva para matar la anterior.", "C. La dación solo se aplica a deudas de dinero.", "D. La novación es gratuita, la dación onerosa."],
        correcta: 1,
        explicacion: "En la novación hay un paso intermedio: nace una obligación nueva que extingue la vieja. En la dación, el acreedor simplemente acepta una cosa distinta al momento de recibir el pago, extinguiendo el vínculo de inmediato."
    },
    {
        pregunta: "En las obligaciones con 'Cláusula Penal', si el deudor cumple solo una parte de la obligación principal y el acreedor la acepta:",
        opciones: ["A. El deudor pierde el derecho a rebaja de la pena.", "B. El deudor tiene derecho a que se rebaje proporcionalmente la pena estipulada (Art. 1539).", "C. La pena se duplica por incumplimiento parcial.", "D. El contrato se vuelve nulo."],
        correcta: 1,
        explicacion: "El Art. 1539 protege la equidad: si el deudor cumplió parcialmente y el acreedor aceptó, la pena debe moderarse proporcionalmente al beneficio recibido por el acreedor."
    },
    {
        pregunta: "La 'Acción Pauliana' o revocatoria (Art. 2468) prescribe en un plazo de:",
        opciones: ["A. 6 meses.", "B. 1 año contado desde la fecha del acto o contrato.", "C. 5 años desde la mora.", "D. 10 años."],
        correcta: 1,
        explicacion: "La acción pauliana tiene un plazo de prescripción muy corto (1 año) para dar seguridad a las transferencias de bienes y evitar que los contratos queden en la incertidumbre por mucho tiempo."
    },
    {
        pregunta: "El 'Derecho de Retención' que la ley otorga a ciertos acreedores (ej. al comodatario o al arrendatario) les permite:",
        opciones: ["A. Hacerse dueños de la cosa por el paso del tiempo.", "B. Conservar la tenencia de la cosa del deudor que ya deberían restituir, hasta que se les pague o asegure el pago de lo que se les debe por razón de esa misma cosa.", "C. Vender la cosa en subasta pública por sí mismos.", "D. Destruir la cosa si no les pagan."],
        correcta: 1,
        explicacion: "Es una garantía legal que permite al detentador de una cosa ajena negarse a devolverla mientras el dueño no le pague las indemnizaciones o expensas que la ley señala."
    },
    {
        pregunta: "Si una persona paga 'por error' una deuda que ya estaba prescrita:",
        opciones: ["A. Puede pedir la restitución por pago de lo no debido.", "B. No puede pedir la restitución, pues la prescripción extintiva transforma la obligación civil en natural, y esta autoriza a retener lo pagado.", "C. El acreedor comete el delito de estafa.", "D. El pago es nulo de pleno derecho."],
        correcta: 1,
        explicacion: "La prescripción no extingue el derecho, solo la acción. La deuda sobrevive como obligación natural (Art. 1470 N°2). Por lo tanto, el pago es válido y el acreedor puede retenerlo legítimamente."
    },
    {
        pregunta: "El 'Abandono de la instancia' en un juicio de cobro produce que:",
        opciones: ["A. La deuda se extinga para siempre.", "B. Se pierda todo el tiempo de interrupción civil de la prescripción, entendiéndose que esta nunca se interrumpió.", "C. El acreedor deba pagar el doble de la deuda.", "D. El deudor sea declarado solvente automáticamente."],
        correcta: 1,
        explicacion: "Según el Art. 2503 N°2, si el acreedor deja morir el juicio por inactividad, el efecto de interrupción de la prescripción desaparece, favoreciendo al deudor."
    },
    {
        pregunta: "La 'Purga de la Hipoteca' ocurre cuando:",
        opciones: ["A. El dueño de la casa paga la deuda.", "B. La finca hipotecada se vende en pública subasta ordenada por el juez, notificando personalmente a los acreedores hipotecarios, lo que extingue las hipotecas sobre el bien.", "C. Se quema la propiedad.", "D. Pasan 50 años desde la inscripción."],
        correcta: 1,
        explicacion: "Es el mecanismo para limpiar la propiedad de gravámenes. Si se cumplen los requisitos del Art. 2428 (subasta judicial y citación de acreedores), el comprador adquiere la propiedad libre de hipotecas."
    },
    {
        pregunta: "En la Solidaridad Pasiva, si el acreedor condona la deuda a UNO de los deudores solidarios sin reserva de sus derechos contra los demás:",
        opciones: ["A. Solo se perdona la cuota de ese deudor.", "B. La obligación se extingue respecto de TODOS los deudores solidarios.", "C. Los demás deudores deben pagar el doble.", "D. El deudor perdonado debe pagarle a sus compañeros."],
        correcta: 1,
        explicacion: "Debido a la unidad de la prestación en la solidaridad, la remisión o perdón total de la deuda hecho a uno de los deudores, sin reserva de la solidaridad, extingue la obligación para todos (Art. 1518)."
   },
    // ==========================================
    // NUEVO BLOQUE 4 DE 5: LEY, PERSONA Y OBLIGACIONES II
    // ==========================================
    {
        pregunta: "Respecto a la nacionalidad de las Personas Jurídicas, Chile aplica principalmente el criterio de:",
        opciones: ["A. La nacionalidad de los socios mayoritarios.", "B. El lugar de la sede social o domicilio principal.", "C. La nacionalidad del Estado que las autoriza o bajo cuya ley se constituyeron.", "D. El país donde realizan la mayor cantidad de ventas."],
        correcta: 2,
        explicacion: "Según tus apuntes de Persona, Chile sigue el criterio de la constitución: la persona jurídica tiene la nacionalidad del Estado que la autoriza o reconoce, lo cual es coherente con el principio de soberanía nacional."
    },
    {
        pregunta: "El Artículo 12 del Código Civil permite la renuncia de los derechos conferidos por las leyes, siempre que:",
        opciones: ["A. Se haga por escritura pública.", "B. El derecho mire solo al interés individual del renunciante y no esté prohibida su renuncia.", "C. El renunciante sea una persona jurídica de derecho público.", "D. Se cuente con la aprobación del Defensor Público."],
        correcta: 1,
        explicacion: "Es la norma fundamental sobre autonomía de la voluntad. Solo se pueden renunciar derechos patrimoniales privados. Los derechos que miran al orden público (irrenunciables) no pueden ser objeto de renuncia."
    },
    {
        pregunta: "En la interpretación de la ley, si las palabras son técnicas de una ciencia o arte (Art. 21), se tomarán en el sentido que les den los que profesan dicha ciencia, a menos que:",
        opciones: ["A. El diccionario de la RAE diga lo contrario.", "B. Aparezca claramente que se han tomado en sentido diverso.", "C. El juez sea experto en dicha materia.", "D. La ley sea de carácter penal."],
        correcta: 1,
        explicacion: "El Art. 21 establece que el lenguaje técnico prevalece, pero cede ante la intención clara del legislador de usar la palabra con un significado distinto o general."
    },
    {
        pregunta: "El 'Elemento Sistemático' de interpretación (Art. 22) ordena que las pasajes oscuros de una ley pueden ser ilustrados por:",
        opciones: ["A. El sentido natural y obvio de las palabras.", "B. Otras leyes, particularmente si versan sobre la misma materia.", "C. La opinión de los autores de doctrina.", "D. Los tratados internacionales no ratificados."],
        correcta: 1,
        explicacion: "El sistema jurídico es un todo armónico. Por ello, una norma no debe interpretarse aislada, sino en conjunto con otras leyes que regulan materias similares para mantener la coherencia del ordenamiento."
    },
    {
        pregunta: "En la estructura de la obligación, el 'Vínculo Jurídico' se define como:",
        opciones: ["A. El documento físico donde consta la deuda.", "B. La relación de parentesco entre acreedor y deudor.", "C. El lazo legal que liga al deudor con el acreedor, permitiendo a este último usar el poder coactivo del Estado para el cumplimiento.", "D. La entrega material de la cosa."],
        correcta: 2,
        explicacion: "Es el elemento que distingue a la obligación jurídica de los deberes morales. Otorga al acreedor el 'Haftung' o responsabilidad: el derecho de agredir el patrimonio del deudor ante el incumplimiento."
    },
    {
        pregunta: "Las obligaciones 'Intuitu Personae' son aquellas en que:",
        opciones: ["A. El deudor puede delegar el pago a cualquier tercero.", "B. La identidad o aptitudes especiales del deudor son determinantes para el acreedor, por lo que el error en la persona vicia el consentimiento.", "C. Solo se pueden cumplir en dinero.", "D. Son siempre transmisibles a los herederos."],
        correcta: 1,
        explicacion: "Ejemplo clásico es el contrato para que un artista famoso pinte un cuadro. Si muere el artista, la obligación se extingue porque el acreedor contrató en consideración a esa persona específica."
    },
    {
        pregunta: "Una 'Condición Meramente Potestativa' que depende de la pura voluntad de la persona que se obliga (Art. 1478) produce:",
        opciones: ["A. Nulidad de la obligación.", "B. La transformación en obligación natural.", "C. El nacimiento de una obligación pura y simple.", "D. Una presunción de dolo."],
        correcta: 0,
        explicacion: "Si el cumplimiento depende de 'si quiero pagar', no hay vínculo jurídico serio. El legislador sanciona con nulidad estas condiciones porque carecen de seriedad y voluntad real de obligarse."
    },
    {
        pregunta: "Si una condición suspensiva se cumple, por regla general, ¿qué sucede con los frutos percibidos mientras la condición estuvo pendiente (Art. 1488)?",
        opciones: ["A. Deben devolverse íntegramente al acreedor.", "B. No se deben los frutos, a menos que la ley o el testador hayan dispuesto lo contrario.", "C. Se dividen en partes iguales.", "D. Pasan al Fisco."],
        correcta: 1,
        explicacion: "Aunque la condición cumplida tiene efecto retroactivo en cuanto a la propiedad, el Art. 1488 protege al deudor condicional permitiéndole quedarse con los frutos percibidos en el tiempo intermedio."
    },
    {
        pregunta: "El 'Plazo Fatal' se caracteriza porque:",
        opciones: ["A. Requiere una sentencia para vencer.", "B. Por el solo cómputo del tiempo se extingue el derecho que debió ejercitarse dentro de él (caducidad).", "C. Siempre se puede prorrogar por el juez.", "D. No corre para los incapaces."],
        correcta: 1,
        explicacion: "A diferencia del plazo ordinario, el fatal no admite espera. Si no se actúa dentro de él, el derecho se pierde irrevocablemente (ej. plazos para interponer recursos procesales)."
    },
    {
        pregunta: "Para que el deudor esté en 'Mora' en un caso donde no hay plazo estipulado, el Art. 1551 N°3 exige:",
        opciones: ["A. Que hayan pasado 30 días.", "B. Que el deudor haya sido judicialmente reconvenido por el acreedor (notificación de la demanda).", "C. Que el acreedor envíe una carta certificada.", "D. Que intervengan dos testigos."],
        correcta: 1,
        explicacion: "Es la interpelación judicial. Si las partes no fijaron plazo, la ley exige que el acreedor 'despierte' al deudor mediante un recurso judicial notificado para que comiencen los efectos de la mora."
    },
    {
        pregunta: "En el sistema del Art. 1547, si un contrato solo reporta beneficio para el ACREEDOR (ej. Depósito gratuito), el deudor responde de:",
        opciones: ["A. Culpa levísima.", "B. Culpa leve.", "C. Culpa grave o lata (que equivale al dolo).", "D. Solo de caso fortuito."],
        correcta: 2,
        explicacion: "La responsabilidad es inversamente proporcional al beneficio. Como el deudor no gana nada (favor al acreedor), la ley solo le exige un cuidado mínimo, respondiendo solo por negligencia grosera (culpa lata)."
    },
    {
        pregunta: "La indemnización del 'Daño Moral' en sede CONTRACTUAL en Chile:",
        opciones: ["A. Está expresamente prohibida por el Código Civil.", "B. Solo se admite si se pactó una cláusula penal.", "C. Es aceptada por la doctrina y jurisprudencia moderna basada en el principio de reparación integral.", "D. Solo se paga en el contrato de matrimonio."],
        correcta: 2,
        explicacion: "Aunque el Código Civil se enfocó originalmente en daños patrimoniales, hoy se reconoce que un incumplimiento de contrato puede causar un sufrimiento psíquico o moral que debe ser indemnizado."
    },
    {
        pregunta: "Para que un hecho sea considerado 'Caso Fortuito o Fuerza Mayor', debe cumplir tres requisitos. ¿Cuál de estos NO es uno de ellos?",
        opciones: ["A. Imprevisibilidad.", "B. Irresistibilidad.", "C. Exterioridad (ajeno a la voluntad del deudor).", "D. Que el deudor sea insolvente."],
        correcta: 3,
        explicacion: "La insolvencia es un problema económico, no una fuerza de la naturaleza o acto de autoridad irresistible. El caso fortuito debe ser un evento que nadie podría haber previsto ni evitado."
    },
    {
        pregunta: "La 'Excepción de Contrato no Cumplido' (Art. 1552) permite que:",
        opciones: ["A. El deudor pague cuando quiera.", "B. En los contratos bilaterales, una parte pueda negarse a cumplir si la otra tampoco ha cumplido ni se allana a cumplir.", "C. El juez anule el contrato por falta de causa.", "D. Se devuelvan los bienes al Estado."],
        correcta: 1,
        explicacion: "Es la purga de la mora. 'La mora purga la mora'. Si tú no me entregas la casa, yo no tengo la obligación de pagarte el precio todavía, y mi retraso no se considera mora legal."
    },
    {
        pregunta: "La protección de los 'derechos patrimoniales eventuales' del que está por nacer implica que:",
        opciones: ["A. Sus derechos se pierden si no nace en 9 meses.", "B. Los derechos quedan suspensos hasta el nacimiento y, si nace vivo, se entiende que los adquirió retroactivamente desde que le fueron deferidos.", "C. El padre los administra y puede gastarlos.", "D. Solo heredan si son hijos matrimoniales."],
        correcta: 1,
        explicacion: "El Art. 77 protege al nasciturus. Si nace y entra en la existencia legal, la ley hace una ficción de que 'siempre estuvo ahí' para recibir su herencia o donación."
    },
    {
        pregunta: "La diferencia entre Existencia Natural y Existencia Legal es que:",
        opciones: ["A. La natural empieza al nacer y la legal al cumplir 18 años.", "B. La natural empieza con la concepción y la legal con el nacimiento (separación completa y sobrevivencia).", "C. Son conceptos idénticos en Chile.", "D. La existencia legal solo la tienen las empresas."],
        correcta: 1,
        explicacion: "La existencia natural es una realidad biológica protegida por el derecho, pero la personalidad jurídica (existencia legal) solo se adquiere al nacer, según el estricto criterio del Art. 74."
    },
    {
        pregunta: "El 'Domicilio Legal' es aquel que:",
        opciones: ["A. Elige la persona libremente para vivir.", "B. La ley impone imperativamente a ciertas personas en razón de su estado de dependencia o del cargo que desempeñan (ej. el hijo bajo patria potestad).", "C. Está registrado en la licencia de conducir.", "D. Se usa para pagar contribuciones."],
        correcta: 1,
        explicacion: "El Art. 72 establece que el domicilio de los que están bajo potestad de otros es el de la persona a quien obedecen. Es un domicilio forzoso fijado por el legislador."
    },
    {
        pregunta: "Una Persona Jurídica de derecho privado corporativa termina o se disuelve por:",
        opciones: ["A. La muerte de cualquiera de sus socios.", "B. El cumplimiento de su fin, la voluntad de sus miembros o la cancelación de su personalidad por la autoridad.", "C. No pagar patentes municipales por 6 meses.", "D. El cambio de nombre de la institución."],
        correcta: 1,
        explicacion: "Las corporaciones y fundaciones tienen causales de extinción específicas vinculadas a la pérdida de su sustrato personal o patrimonial, o por sanción del Estado."
    },
    {
        pregunta: "En la clasificación de los Derechos, los Derechos Reales se caracterizan por ser:",
        opciones: ["A. Derechos de crédito exigibles a personas determinadas.", "B. Derechos absolutos que se tienen sobre una cosa sin respecto a determinada persona (erga omnes).", "C. Derechos que solo recaen sobre el dinero.", "D. Derechos transitorios que mueren al mes."],
        correcta: 1,
        explicacion: "El derecho real (Art. 577) crea una relación directa entre el titular y la cosa. Por eso puedo perseguir mi cosa de manos de quien la tenga (acción reivindicatoria)."
    },
    {
        pregunta: "Las 'Obligaciones Naturales' provenientes de juegos de azar lícitos (donde predomina el esfuerzo físico o intelectual) se caracterizan porque:",
        opciones: ["A. No se pueden cobrar nunca.", "B. Se pueden cobrar igual que una obligación civil.", "C. Si se pagan, no se puede pedir la devolución.", "D. Son nulas absolutamente."],
        correcta: 1,
        explicacion: "Ojo: los juegos donde predomina la destreza (ej. una carrera o ajedrez) generan obligaciones civiles perfectas. Solo los de puro azar (ilegales) o los de suerte permitidos generan obligaciones naturales o excepciones."
    },
    {
        pregunta: "La 'Indivisibilidad de Pago' (Art. 1526 N°1) en el caso de la acción hipotecaria significa que:",
        opciones: ["A. El acreedor debe dividir la deuda entre todos los herederos.", "B. El acreedor puede perseguir el total de la deuda sobre el inmueble hipotecado, sin importar si este pasó a manos de un solo heredero o de varios.", "C. La hipoteca se extingue si muere el deudor.", "D. Solo se puede hipotecar la mitad de una casa."],
        correcta: 1,
        explicacion: "La prenda y la hipoteca son indivisibles. Gravan la cosa entera. Por eso el acreedor no tiene que andar cobrando pedacitos a cada heredero; remata la propiedad completa para pagarse."
    },
    {
        pregunta: "La 'Capacidad de Goce' es un atributo de la personalidad que:",
        opciones: ["A. Se puede perder por sentencia judicial.", "B. Es la aptitud para ser titular de derechos, y la posee todo ser humano por el hecho de ser persona.", "C. Solo la tienen los mayores de edad.", "D. Se puede vender o transferir."],
        correcta: 1,
        explicacion: "Nadie carece de capacidad de goce. Es la esencia de ser persona. Lo que puede faltar es la capacidad de ejercicio (la facultad de actuar por sí mismo sin representante)."
    },
    {
        pregunta: "En una obligación 'Pura y Simple', el cumplimiento debe realizarse:",
        opciones: ["A. A los 10 días de la firma.", "B. Inmediatamente después de que nace la obligación, pues no hay modalidad que suspenda su exigibilidad.", "C. Cuando el deudor tenga fondos suficientes.", "D. En el próximo año calendario."],
        correcta: 1,
        explicacion: "A falta de plazo o condición suspensiva, la deuda es 'actual'. El acreedor puede exigir el pago en el mismo instante en que se perfecciona el contrato."
    },
    {
        pregunta: "La 'Fuerza Obligatoria' de los contratos (Art. 1545) implica que un contrato válidamente celebrado:",
        opciones: ["A. Puede ser anulado por el juez si le parece injusto.", "B. Es una ley para las partes y solo puede dejarse sin efecto por mutuo consentimiento o causas legales.", "C. Caduca automáticamente a los 5 años.", "D. No obliga a los herederos."],
        correcta: 1,
        explicacion: "Es el principio del 'Contrato-Ley'. El legislador eleva el contrato privado a la categoría de norma obligatoria para quienes lo firman, dando estabilidad al tráfico jurídico."
    },
    {
        pregunta: "Según el Art. 1438, el contrato o convención es un acto por el cual una parte se obliga para con otra a dar, hacer o no hacer alguna cosa. La crítica doctrinal a esta definición es que:",
        opciones: ["A. Es muy corta.", "B. Confunde los términos 'Contrato' (crea obligaciones) y 'Convención' (género que crea, modifica o extingue), usándolos como sinónimos.", "C. No menciona el pago en dinero.", "D. Exige escritura pública para todo."],
        correcta: 1,
        explicacion: "Bello usó 'contrato' y 'convención' como sinónimos, pero la doctrina aclara que la Convención es el género (ej. el Pago es una convención porque extingue, pero no es un contrato porque no crea obligaciones)."
    }
];

module.exports = bancoPreguntasAlucilex;