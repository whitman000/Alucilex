// banco_articulos.js
// Cátedra Estática y Diccionario de Oro para Alucilex (Latencia Cero) - 50 Artículos

const bancoArticulosAlucilex = [
    {
        numero: "Art. 1",
        titulo: "La Ley",
        texto: `La ley es una declaración de la voluntad soberana que, manifestada en la forma prescrita por la Constitución, manda, prohíbe o permite.`,
        analisisIA: `El Artículo 1 del Código Civil chileno consagra la definición clásica y dogmática de la ley, redactada por Andrés Bello. Este precepto establece que la ley no es una mera sugerencia, sino un mandato imperativo emanado de la "voluntad soberana". Su validez depende estrictamente de cumplir con los procedimientos formales dictados por la Constitución Política de la República. Al clasificar las leyes en imperativas, prohibitivas y permisivas, Bello estructura todo el ordenamiento jurídico. En la práctica profesional, esta distinción es vital, ya que la infracción de una ley prohibitiva acarrea la nulidad absoluta del acto, mientras que la infracción de una imperativa o permisiva puede tener sanciones distintas. Es la piedra angular que garantiza certeza jurídica en las relaciones privadas.`
    },
    {
        numero: "Art. 2",
        titulo: "La Costumbre",
        texto: `La costumbre no constituye derecho sino en los casos en que la ley se remite a ella.`,
        analisisIA: `A diferencia del derecho comercial donde la costumbre suple el silencio normativo, el Artículo 2 del Código Civil restringe severamente su valor en el derecho civil chileno. La costumbre civil solo tiene fuerza obligatoria cuando una ley expresamente la llama a regir una situación específica (costumbre secundum legem). Un ejemplo clásico es el contrato de arrendamiento, donde la ley permite que la costumbre determine los periodos de pago si las partes nada han estipulado. Esta limitación buscaba unificar el derecho en todo el territorio nacional, eliminando la dispersión de las prácticas coloniales. Para el abogado litigante, esto significa que jamás podrá fundamentar una demanda civil basándose únicamente en la práctica habitual, a menos que exista un precepto legal que la autorice expresamente.`
    },
    {
        numero: "Art. 12",
        titulo: "Renuncia de los Derechos",
        texto: `Podrán renunciarse los derechos conferidos por las leyes, con tal que sólo miren al interés individual del renunciante, y que no esté prohibida su renuncia.`,
        analisisIA: `Este artículo consagra el principio de la autonomía de la voluntad y la libre disposición de los bienes. Permite a cualquier persona abdicar de un derecho que le beneficia, siempre que se cumplan dos requisitos copulativos: que el derecho mire exclusivamente al interés del renunciante y que la ley no prohíba expresamente su renuncia (como ocurre con el derecho a pedir alimentos). En la práctica contractual, este artículo es el fundamento que permite a las partes insertar cláusulas de renuncia a acciones resolutorias o plazos. Es fundamental comprender que los derechos se presumen renunciables por regla general, pero el límite infranqueable es el interés social y el orden público, protegiendo así a la parte que el legislador considera más débil en la relación jurídica.`
    },
    {
        numero: "Art. 14",
        titulo: "Territorialidad",
        texto: `La ley es obligatoria para todos los habitantes de la República, inclusos los extranjeros.`,
        analisisIA: `Establece el principio de territorialidad de la ley chilena, una norma esencial de soberanía nacional. Significa que, dentro de las fronteras de Chile, rige exclusivamente el derecho nacional para todas las personas, sin importar su nacionalidad o estatus migratorio. Este precepto elimina el antiguo sistema personalista donde a cada individuo se le aplicaba la ley de su nación de origen. En términos prácticos, si un extranjero celebra un contrato o comete un ilícito civil en Chile, queda sometido de inmediato a la jurisdicción y normas del Código Civil. Aunque tiene excepciones estrictas en el Art. 15, esta regla garantiza uniformidad y seguridad jurídica, asegurando que las disputas dentro del territorio nacional se resuelvan bajo un solo marco normativo.`
    },
    {
        numero: "Art. 19",
        titulo: "Interpretación de la Ley",
        texto: `Cuando el sentido de la ley es claro, no se desatenderá su tenor literal a pretexto de consultar su espíritu...`,
        analisisIA: `Este precepto consagra el elemento gramatical y el elemento lógico/histórico de la interpretación legal. El legislador impone un límite al juez: frente a una norma nítida, está vedado torcer sus palabras buscando intenciones ocultas, protegiendo la seguridad jurídica. Sin embargo, permite que ante ambigüedades el intérprete indague en la "ratio legis" acudiendo a la intención claramente manifestada o a la historia fidedigna de su establecimiento (debates parlamentarios). Para un abogado, dominar el Artículo 19 es el paso previo a cualquier alegato, ya que define si el debate se centrará en la estricta literalidad del texto o si requerirá un análisis dogmático profundo para desentrañar el verdadero mandato del legislador en la historia.`
    },
    {
        numero: "Art. 44",
        titulo: "Culpa y Dolo",
        texto: `La ley distingue tres especies de culpa o descuido... El dolo consiste en la intención positiva de inferir injuria...`,
        analisisIA: `Es el corazón de la responsabilidad civil en Chile. Establece la "teoría de la prestación de las culpas", dividiéndola en grave, leve y levísima. La culpa grave se asimila al dolo, significando una negligencia tan extrema que se castiga con igual severidad que la intención de dañar. La culpa leve es el estándar general del "buen padre de familia". Además, define el Dolo como una "intención positiva" de causar daño. Dominar este artículo es vital, pues determina quién debe responder patrimonialmente por los daños en un contrato incumplido, dependiendo de a quién beneficiaba el acto y el nivel de diligencia que la ley exigía al deudor en esa relación jurídica específica.`
    },
    {
        numero: "Art. 45",
        titulo: "Caso Fortuito",
        texto: `Se llama fuerza mayor o caso fortuito el imprevisto a que no es posible resistir...`,
        analisisIA: `Define la principal causal de exención de responsabilidad. Para que un evento libere al deudor, la norma exige imprevisibilidad e irresistibilidad. Un evento es caso fortuito si un hombre prudente no pudo anticiparlo y si el obstáculo es absolutamente imposible de superar. En litigación contractual, alegar fuerza mayor requiere probar que el evento fue externo, ajeno a la culpa del deudor y totalmente paralizante. Opera como la barrera definitiva frente a la indemnización de perjuicios, ya que rompe el nexo causal entre el hecho del deudor y el daño sufrido por el acreedor, extinguiendo la obligación de responder bajo el principio de que "nadie está obligado a lo imposible".`
    },
    {
        numero: "Art. 46",
        titulo: "Cauciones",
        texto: `Caución significa generalmente cualquiera obligación que se contrae para la seguridad de otra obligación propia o ajena.`,
        analisisIA: `Define el concepto genérico de caución, diferenciándolo de la garantía general. La caución es una obligación accesoria destinada a asegurar el cumplimiento de una principal. El artículo menciona especies como la fianza, la hipoteca y la prenda. Entender este precepto es vital por el principio de accesoriedad: la caución no existe por sí sola; nace, vive y muere con la obligación principal. Si la deuda principal se extingue o se declara nula, la hipoteca o fianza sigue la misma suerte. Para el estudiante, este artículo es fundamental para comprender cómo se blinda el crédito en el tráfico civil y cómo operan los derechos reales de garantía sobre los bienes del deudor.`
    },
    {
        numero: "Art. 582",
        titulo: "El Dominio",
        texto: `El dominio (que se llama también propiedad) es el derecho real en una cosa corporal, para gozar y disponer de ella arbitrariamente; no siendo contra la ley o contra derecho ajeno.`,
        analisisIA: `Es la definición cumbre de los derechos reales. El dominio otorga las facultades de uso, goce y disposición. Aunque menciona la palabra "arbitrariamente", el propio artículo establece límites: la ley y el derecho ajeno (función social de la propiedad). Es un derecho absoluto, exclusivo y perpetuo. En la práctica, el dominio es el pilar de la economía y el derecho privado. Entender su definición permite distinguir entre el dueño, el poseedor y el mero tenedor. Para el examen de grado, este artículo es el punto de partida para estudiar los modos de adquirir y las acciones protectoras, como la acción reivindicatoria, que busca proteger precisamente este derecho real frente a perturbaciones de terceros.`
    },
    {
        numero: "Art. 670",
        titulo: "La Tradición",
        texto: `La tradición es un modo de adquirir el dominio de las cosas y consiste en la entrega que el dueño hace de ellas a otro, habiendo por una parte la facultad e intención de transferir el dominio, y por otra la capacidad e intención de adquirirlo.`,
        analisisIA: `Define el modo de adquirir derivativo más utilizado en nuestro ordenamiento. Consiste en la entrega material o simbólica con la intención compartida de transferir la propiedad. Exige siempre la existencia de un título translaticio previo, como una compraventa. Para bienes raíces, esta "entrega" se materializa exclusivamente mediante la inscripción en el Conservador de Bienes Raíces, requisito esencial en cualquier estudio de títulos. Diferencia tajantemente el contrato (que crea derechos) del modo (que los transfiere).`
    },
    {
        numero: "Art. 700",
        titulo: "La Posesión",
        texto: `La posesión es la tenencia de una cosa determinada con ánimo de señor o dueño...`,
        analisisIA: `El precepto define la posesión uniendo dos elementos inseparables: la tenencia física (corpus) y el ánimo de dueño (animus). Otorga una presunción legal fortísima, asumiendo que el poseedor es el dueño mientras nadie pruebe lo contrario, siendo este el escudo defensivo en juicios posesorios. Además, es la vía directa para adquirir el dominio mediante la prescripción. Diferenciarla de la mera tenencia (como la del arrendatario, que reconoce dominio ajeno) es crucial en litigios de precario o restitución.`
    },
    {
        numero: "Art. 1437",
        titulo: "Fuentes de las Obligaciones",
        texto: `Las obligaciones nacen, ya del concurso real de las voluntades de dos o más personas, como en los contratos o convenciones; ya de un hecho voluntario de la persona que se obliga, como en la aceptación de una herencia o legado y en todos los cuasicontratos; ya a consecuencia de un hecho que ha inferido injuria o daño a otra persona, como en los delitos y cuasidelitos; ya por disposición de la ley...`,
        analisisIA: `Este precepto es el mapa fundacional del derecho patrimonial. Clasifica estrictamente el origen de todo vínculo jurídico en cinco fuentes: contrato, cuasicontrato, delito civil, cuasidelito y la ley. Determina la vía procesal de cualquier demanda; si hay acuerdo previo, rige la responsabilidad contractual; si hay daño sin contrato, la extracontractual. Su dominio es obligatorio para estructurar correctamente la causa de pedir en cualquier demanda indemnizatoria o de cobro judicial.`
    },
    {
        numero: "Art. 1438",
        titulo: "Contrato",
        texto: `Contrato o convención es un acto por el cual una parte se obliga para con otra a dar, hacer o no hacer alguna cosa. Cada parte puede ser una o muchas personas.`,
        analisisIA: `Identifica el contrato con la convención, aunque la doctrina los distingue como especie y género. El contrato es el acuerdo de voluntades destinado a crear derechos y obligaciones. Define además la prestación: dar (transferir dominio), hacer (ejecutar un hecho) o no hacer (abstenerse). Es la base del derecho patrimonial. Pese a las críticas por confundir el objeto del contrato con el objeto de la obligación, es el precepto que da vida a la autonomía de la voluntad. Para el estudiante, es el punto de partida para clasificar los actos jurídicos y entender que en cada contrato hay un intercambio de prestaciones que el derecho ampara y hace exigibles mediante el poder coercitivo del Estado.`
    },
    {
        numero: "Art. 1444",
        titulo: "Elementos del Acto",
        texto: `Se distinguen en cada contrato las cosas que son de su esencia, las que son de su naturaleza, y las puramente accidentales...`,
        analisisIA: `Es la herramienta de análisis de todo acto jurídico. Las cosas de la esencia son indispensables para que el contrato exista (como el precio); las de la naturaleza se entienden incorporadas por ley sin necesidad de cláusulas (como la condición resolutoria tácita); y las accidentales requieren estipulación expresa (como un plazo). Para el abogado, esta distinción es vital al redactar contratos, pues le indica qué puede omitir y qué debe incluir obligatoriamente. Determina la validez y eficacia de los acuerdos: si falta un elemento de la esencia, el acto es nulo o degenera en otro, mientras que omitir uno de la naturaleza no afecta la validez, pues la ley suple el silencio de las partes.`
    },
    {
        numero: "Art. 1445",
        titulo: "Requisitos de Validez",
        texto: `Para que una persona se obligue a otra por un acto o declaración de voluntad es necesario: 1º que sea legalmente capaz; 2º que consienta en dicho acto o declaración y su consentimiento no adolezca de vicio; 3º que recaiga sobre un objeto lícito; 4º que tenga una causa lícita.`,
        analisisIA: `Es la norma rectora de la validez de los actos jurídicos. Enumera los cuatro requisitos para que un acto nazca sano. La falta de capacidad absoluta, objeto o causa ilícita produce nulidad absoluta. Los vicios del consentimiento (error, fuerza, dolo) producen nulidad relativa. Es el primer filtro que un juez aplica a cualquier litigio contractual. Si alguno de estos pilares falla, la estructura obligacional puede ser derribada. Para el jurista, estudiar este artículo implica profundizar en cada numeral: entender quién es capaz, cuándo el consentimiento es libre, qué objetos están fuera del comercio y qué motivos (causa) persigue el legislador al permitir que los ciudadanos se obliguen entre sí.`
    },
    {
        numero: "Art. 1545",
        titulo: "Fuerza Obligatoria",
        texto: `Todo contrato legalmente celebrado es una ley para los contratantes, y no puede ser invalidado sino por su consentimiento mutuo o por causas legales.`,
        analisisIA: `Consagra el principio Pacta Sunt Servanda. Eleva el contrato a la categoría de ley entre las partes. Ni el juez ni un tercero pueden alterar lo pactado bajo pretexto de equidad. Solo puede invalidarse por consentimiento mutuo (resciliación) o por causas legales. Otorga estabilidad y certeza al tráfico jurídico: lo que se firma debe cumplirse. Es la norma más invocada en demandas por incumplimiento contractual. El abogado debe saber que este artículo protege la voluntad original de los contratantes frente a cambios posteriores en las circunstancias, obligando al deudor a cumplir exactamente lo prometido so pena de responder con todo su patrimonio por los perjuicios causados.`
    },
    {
        numero: "Art. 1546",
        titulo: "Buena Fe",
        texto: `Los contratos deben ejecutarse de buena fe, y por consiguiente obligan no sólo a lo que en ellos se expresa, sino a todas las cosas que emanan precisamente de la naturaleza de la obligación, o que por la ley o la costumbre pertenecen a ella.`,
        analisisIA: `Consagra la buena fe objetiva como estándar de conducta. Obliga no solo a lo escrito, sino a todo lo que emana de la naturaleza de la obligación o la ley. Le otorga al juez la facultad de integrar el contrato para evitar abusos. Significa que las partes deben actuar con lealtad y rectitud durante la ejecución. Si un contratante actúa de forma desleal, aunque cumpla la literalidad del texto, puede estar violando este artículo. Es un principio expansivo que protege las expectativas legítimas de los contratantes y asegura que el contrato cumpla su función social y económica de manera justa, equilibrada y correcta para ambas partes involucradas.`
    },
    {
        numero: "Art. 1560",
        titulo: "Intención de los Contratantes",
        texto: `Conocida claramente la intención de los contratantes, debe estarse a ella más que a lo literal de las palabras.`,
        analisisIA: `Consagra la regla de oro en la interpretación de los contratos, priorizando la voluntad real y subjetiva por sobre la literalidad del texto. Si las palabras de una escritura contradicen el propósito evidente del negocio, el juez debe hacer valer lo que las partes realmente quisieron pactar. En tribunales, esto exige probar el contexto, las tratativas previas y la ejecución práctica del acuerdo, protegiendo el consentimiento verdadero frente a errores o vacíos de redacción.`
    },
    {
        numero: "Art. 1698",
        titulo: "Prueba de las Obligaciones",
        texto: `Incumbe probar las obligaciones o su extinción al que alega aquéllas o ésta.`,
        analisisIA: `Establece la carga de la prueba (onus probandi). Quien afirma que existe una deuda debe probarla; quien afirma que la pagó o se extinguió, debe probar ese hecho. Es la base de todo juicio civil. Determina el éxito o fracaso de una demanda. El abogado debe preparar sus medios de prueba (documentos, testigos, peritajes) basándose en este precepto. En derecho, lo que no se prueba no existe para el juez. Es una regla de justicia procesal que evita que las personas tengan que probar hechos negativos ("yo no debo"), traspasando la carga a quien pretende alterar el estado de cosas existente mediante una acción judicial.`
    },
    {
        numero: "Art. 2314",
        titulo: "Responsabilidad Extracontractual",
        texto: `El que ha cometido un delito o cuasidelito que ha inferido daño a otro, es obligado a la indemnización; sin perjuicio de la pena que le impongan las leyes por el delito o cuasidelito.`,
        analisisIA: `Piedra angular del sistema indemnizatorio por daños ocurridos fuera de un contrato. Establece que quien cause un perjuicio, sea con intención (delito) o por mera negligencia (cuasidelito), está obligado a repararlo íntegramente. Exige probar el hecho imputable, la culpa o dolo, el daño y el nexo causal. Es el precepto donde se fundan todas las demandas por accidentes, negligencias y daños morales, buscando devolver a la víctima al estado patrimonial anterior al ilícito.`
    },
    {
        numero: "Art. 2465",
        titulo: "Derecho de Prenda General",
        texto: `Toda obligación personal da al acreedor el derecho de perseguir su ejecución sobre todos los bienes raíces o muebles del deudor, sean presentes o futuros, exceptuándose solamente los no embargables, designados en el artículo 1618.`,
        analisisIA: `Institución clave para la seguridad del crédito. Establece que quien contrae una obligación personal compromete universalmente su patrimonio para asegurar el cumplimiento. Permite al acreedor embargar y rematar los bienes del deudor moroso. Conocer este precepto es el paso previo ineludible antes de iniciar un juicio ejecutivo o de cobro, pues justifica la necesidad de realizar búsquedas de patrimonio en el Conservador o el Registro Civil para asegurar que existan bienes suficientes para embargar.`
    },
    {
        numero: "Art. 2492",
        titulo: "La Prescripción",
        texto: `La prescripción es un modo de adquirir las cosas ajenas, o de extinguir las acciones y derechos ajenos, por haberse poseído las cosas o no haberse ejercido dichas acciones y derechos durante cierto lapso de tiempo, y concurriendo los demás requisitos legales.`,
        analisisIA: `Define la prescripción adquisitiva y extintiva. Es una institución de orden público basada en la seguridad jurídica. El paso del tiempo, unido a la inacción del dueño o acreedor, produce efectos legales definitivos. La adquisitiva permite ganar el dominio por poseer la cosa; la extintiva hace perder la facultad de cobrar una deuda por no haber demandado a tiempo. Es la defensa definitiva en los juicios: si la acción está prescrita, el deudor queda liberado. Busca evitar que las situaciones de incertidumbre jurídica se prolonguen indefinidamente, consolidando las situaciones de hecho en derechos firmes y definitivos para la paz social y la estabilidad del sistema legal.`
    },
    {
        numero: "Art. 102",
        titulo: "El Matrimonio",
        texto: `El matrimonio es un contrato solemne por el cual dos personas se unen actual e indisolublemente, y por toda la vida, con el fin de vivir juntos, de procrear, y de auxiliarse mutuamente.`,
        analisisIA: `Este artículo consagra la base del derecho de familia patrimonial. Define el matrimonio como un contrato solemne, exigiendo formalidades estrictas ante el Oficial del Registro Civil. Establece los tres fines clásicos: convivencia, procreación y auxilio mutuo. Aunque la ley de divorcio alteró la indisolubilidad originaria, el precepto mantiene su vigencia dogmática. Es vital en litigios civiles porque de este acto nacen obligaciones alimenticias infranqueables, derechos hereditarios privilegiados y el régimen de bienes que regirá el patrimonio de ambos contratantes.`
    },
    {
        numero: "Art. 565",
        titulo: "Bienes Corporales e Incorporales",
        texto: `Los bienes consisten en cosas corporales o incorporales. Corporales son las que tienen un ser real y pueden ser percibidas por los sentidos... Incorporales las que consisten en meros derechos.`,
        analisisIA: `Es la clasificación fundamental del patrimonio. Los bienes corporales (muebles e inmuebles) son susceptibles de posesión material. La genialidad de Bello radica en los incorporales: "cosificación" de los derechos. Al tratar los derechos personales (créditos) y reales (dominio) como cosas, permite que sean objeto de contratos. Gracias a este precepto, un abogado puede ceder un crédito, embargar derechos litigiosos o reivindicar una herencia, sometiendo elementos intangibles a las reglas de circulación de la riqueza.`
    },
    {
        numero: "Art. 724",
        titulo: "Posesión de Bienes Raíces",
        texto: `Si la cosa es de aquellas cuya tradición deba hacerse por inscripción en el Registro del Conservador, nadie podrá adquirir la posesión de ella sino por este medio.`,
        analisisIA: `Es la piedra angular de la "Teoría de la Posesión Inscrita". En Chile, el Conservador de Bienes Raíces es el registro supremo de la propiedad inmueble. Este artículo establece que el apoderamiento material de un terreno no sirve para adquirir la posesión regular si la propiedad ya está inscrita a nombre de otro. Para el litigante, esto significa que el papel (la inscripción) vence a la realidad material frente a ocupantes o usurpadores, siendo el escudo protector definitivo contra el fraude inmobiliario.`
    },
    {
        numero: "Art. 728",
        titulo: "Cancelación de la Inscripción",
        texto: `Para que cese la posesión inscrita, es necesario que la inscripción se cancele, sea por voluntad de las partes, o por una nueva inscripción en que el poseedor inscrito transfiere su derecho a otro.`,
        analisisIA: `Complemento directo del Art. 724. Mientras una inscripción en el Conservador no sea cancelada (tachada legalmente), el poseedor original mantiene sus derechos intactos, incluso si otra persona toma control físico del inmueble por años. Solo se cancela por voluntad de las partes (resciliación), por sentencia judicial ejecutoriada o por una nueva transferencia válida. Esto otorga una certeza jurídica de acero al mercado inmobiliario, impidiendo que el dominio se pierda por el mero paso del tiempo sin un acto registral.`
    },
    {
        numero: "Art. 951",
        titulo: "Sucesión por Causa de Muerte",
        texto: `Se sucede a una persona difunta a título universal o a título singular...`,
        analisisIA: `Define el único modo de adquirir el dominio derivativo y gratuito que opera por el fallecimiento de una persona. La sucesión a título universal transmite todo el patrimonio transmisible (activos y deudas) creando a los herederos. La sucesión a título singular transfiere bienes específicos, creando a los legatarios. Para un abogado, la distinción es crítica: el heredero responde por las deudas del causante incluso con su propio patrimonio (salvo beneficio de inventario), mientras que el legatario generalmente no asume ese riesgo pasivo.`
    },
    {
        numero: "Art. 999",
        titulo: "El Testamento",
        texto: `El testamento es un acto más o menos solemne, en que una persona dispone del todo o de una parte de sus bienes para que tenga pleno efecto después de sus días, conservando la facultad de revocar.`,
        analisisIA: `Consagra la herramienta principal de la voluntad póstuma. Sus características son inquebrantables: es un acto unilateral (solo requiere la voluntad del testador), personalísimo (no admite mandatarios) y esencialmente revocable hasta el último minuto de vida. Obliga al cumplimiento de asignaciones forzosas (como las legítimas para hijos y cónyuge). Un testamento mal redactado que vulnere estas asignaciones no es nulo, pero expone al abogado a una acción de reforma que modificará forzosamente la voluntad de su cliente.`
    },
    {
        numero: "Art. 1473",
        titulo: "Modalidades de las Obligaciones",
        texto: `Es obligación pura y simple la que no está sujeta a modalidad alguna. Modalidades son la condición, el plazo y el modo.`,
        analisisIA: `Establece la distinción entre obligaciones que nacen y se hacen exigibles de inmediato, y aquellas cuyos efectos están alterados por cláusulas especiales. La condición suspende el nacimiento del derecho (ej. "te pago si te gradúas"); el plazo posterga su exigibilidad (ej. "pago en 30 días"); y el modo impone una carga al beneficiario. Dominar este precepto permite estructurar contratos complejos, diseñando un cronograma legal preciso para la ejecución y blindando las prestaciones hasta que se cumplan los hitos pactados.`
    },
    {
        numero: "Art. 1489",
        titulo: "Condición Resolutoria Tácita",
        texto: `En los contratos bilaterales va envuelta la condición resolutoria de no cumplirse por uno de los contratantes lo pactado. Pero en tal caso podrá el otro contratante pedir a su arbitrio o la resolución o el cumplimiento.`,
        analisisIA: `Es la principal arma de defensa frente al incumplimiento en contratos sinalagmáticos. Si una parte no cumple, la ley le otorga a la parte diligente un derecho alternativo: forzar judicialmente el cumplimiento o destruir el contrato (resolución), siempre con indemnización de perjuicios en ambos casos. A diferencia de un pacto comisorio expreso, requiere sentencia judicial para operar. Permite al deudor demandado "enervar" la acción pagando lo adeudado hasta antes de la citación para oír sentencia en primera instancia.`
    },
    {
        numero: "Art. 1552",
        titulo: "La Mora Purga la Mora",
        texto: `En los contratos bilaterales ninguno de los contratantes está en mora dejando de cumplir lo pactado, mientras el otro no lo cumple por su parte, o no se allana a cumplirlo en la forma y tiempo debidos.`,
        analisisIA: `Consagra la excepción de contrato no cumplido (exceptio non adimpleti contractus). Es un principio de equidad brutal: nadie puede demandar por incumplimiento si él mismo no ha cumplido o no está dispuesto a cumplir su parte. En un juicio, paraliza completamente las acciones indemnizatorias y la exigibilidad de las cláusulas penales. Es la primera defensa procesal que un abogado esgrime cuando su cliente es demandado, obligando al demandante a probar primero su propia diligencia antes de acusar la ajena.`
    },
    {
        numero: "Art. 1567",
        titulo: "Modos de Extinguir",
        texto: `Toda obligación puede extinguirse por una convención en que las partes interesadas... consienten en darla por nula. Las obligaciones se extinguen además en todo o parte: 1º Por la solución o pago... 10º Por la prescripción.`,
        analisisIA: `Enumera taxativamente las vías legales para aniquilar una deuda. Abre reconociendo la resciliación (mutuo acuerdo extintivo) como reflejo de la autonomía de la voluntad. Luego lista mecanismos como el pago, novación, compensación y prescripción. Es el índice de consulta obligatorio para la defensa de deudores. En el sistema procesal, cada uno de estos numerales constituye una excepción perentoria que, de ser probada, destruye el título ejecutivo del acreedor y pone finiquito definitivo al litigio.`
    },
    {
        numero: "Art. 1568",
        titulo: "El Pago Efectivo",
        texto: `El pago efectivo es la prestación de lo que se debe.`,
        analisisIA: `Aunque parece redundante, es la definición técnica más exacta. Pagar no es solo entregar dinero; es cumplir la prestación exacta estipulada, sea dar, hacer o no hacer. Para que el pago extinga la obligación, debe ser íntegro, oportuno e idéntico a lo pactado. El acreedor no puede ser forzado a recibir una cosa distinta, ni a recibir el pago por parcialidades, salvo convención expresa. Esta rigidez protege al acreedor de cumplimientos a medias o sustituciones arbitrarias impuestas por el deudor moroso.`
    },
    {
        numero: "Art. 1625",
        titulo: "Solidaridad Pasiva",
        texto: `Acreedor o deudor solidario es aquel que, existiendo varios de su especie, puede exigir o está obligado a pagar el total de la deuda.`,
        analisisIA: `Excepción mayúscula a la regla de que las deudas conjuntas se dividen en cuotas. La solidaridad pasiva es la garantía personal más potente y usada en bancos y comercio. Autoriza al acreedor a demandar el 100% de la deuda a cualquiera de los deudores o avales a su arbitrio, sin que estos puedan excusarse pidiendo división. Nunca se presume: debe declararse por ley, testamento o convención expresa en el contrato. Quien paga el total, asume una acción de reembolso contra sus codeudores.`
    },
    {
        numero: "Art. 1655",
        titulo: "La Compensación",
        texto: `Cuando dos personas son deudoras una de otra, se opera entre ellas una compensación que extingue ambas deudas.`,
        analisisIA: `Mecanismo extintivo que opera de pleno derecho para evitar un doble pago innecesario. Requiere requisitos copulativos estrictos: ambas deudas deben ser de dinero o cosas fungibles del mismo género, líquidas (monto determinado) y actualmente exigibles. Es una figura de enorme utilidad en el derecho comercial y en quiebras, permitiendo simplificar relaciones jurídicas cruzadas. Judicialmente, se alega como excepción, rebajando el cobro del demandante hasta la concurrencia del crédito que el demandado tiene en su contra.`
    },
    {
        numero: "Art. 1670",
        titulo: "Pérdida de la Cosa Debida",
        texto: `Cuando el cuerpo cierto que se debe perece, o porque se destruye, o porque deja de estar en el comercio... la obligación se extingue.`,
        analisisIA: `Consagra la teoría de la imposibilidad de ejecución para obligaciones de especie o cuerpo cierto (ej. un caballo específico o un auto con patente). Si la cosa perece sin culpa del deudor y antes de estar en mora, opera la extinción. Si perece por culpa del deudor, la obligación no se extingue, sino que muta o varía de objeto: ahora se debe el precio de la cosa más indemnización. Es la regla madre para determinar quién soporta el riesgo (la pérdida patrimonial) cuando un evento fortuito destruye el bien contratado.`
    },
    {
        numero: "Art. 1681",
        titulo: "La Nulidad",
        texto: `Es nulo todo acto o contrato a que falta alguno de los requisitos que la ley prescribe para el valor del mismo acto... La nulidad puede ser absoluta o relativa.`,
        analisisIA: `Define la máxima sanción civil que destruye retroactivamente los efectos de un contrato viciado. La nulidad absoluta sanciona la infracción al orden público (objeto ilícito, causa ilícita, omisión de solemnidades) y puede solicitarla cualquier interesado, prescribiendo en 10 años. La relativa protege el interés privado (vicios del consentimiento como dolo o fuerza, incapacidad relativa) y solo puede pedirla la parte afectada, prescribiendo en 4 años. Lograr que un tribunal declare la nulidad obliga a las partes a devolverse todo lo entregado.`
    },
    {
        numero: "Art. 1715",
        titulo: "Capitulaciones Matrimoniales",
        texto: `Se conocen con el nombre de capitulaciones matrimoniales las convenciones de carácter patrimonial que celebren los esposos antes de contraer matrimonio o en el acto de su celebración.`,
        analisisIA: `Permite a los futuros cónyuges estructurar la economía de su matrimonio de forma preventiva. Es el instrumento legal para optar por la separación total de bienes o participación en los gananciales en lugar del régimen legal supletorio. Evita la mezcla de patrimonios y blinda los bienes propios frente a los acreedores del otro cónyuge. Para el asesor jurídico, recomendar este pacto pre-nupcial es la estrategia principal de planificación patrimonial, garantizando independencia comercial y financiera en la sociedad.`
    },
    {
        numero: "Art. 1718",
        titulo: "Sociedad Conyugal",
        texto: `A falta de pacto en contrario se entenderá, por el mero hecho del matrimonio, contraída la sociedad de bienes entre los cónyuges.`,
        analisisIA: `Establece el régimen patrimonial supletorio general de Chile. Si no se firman capitulaciones, el sistema asume la formación de este fondo común. El marido es el administrador de los bienes sociales y de los propios de la mujer, sujeto a graves restricciones (requiere autorización de la esposa para gravar o enajenar raíces). Es un régimen de alta complejidad contable que distingue bienes propios, haber absoluto y haber relativo. Su liquidación es fuente constante de litigios, requiriendo un peritaje preciso para calcular recompensas y gananciales.`
    },
    {
        numero: "Art. 1793",
        titulo: "La Compraventa",
        texto: `La compraventa es un contrato en que una de las partes se obliga a dar una cosa y la otra a pagarla en dinero. Aquélla se dice vender y ésta comprar.`,
        analisisIA: `El contrato bilateral, oneroso y conmutativo por antonomasia; el motor del tráfico comercial. Define las obligaciones recíprocas esenciales: el vendedor debe entregar la cosa (y amparar al comprador en el dominio) y el comprador debe pagar el precio pactado exclusivamente en dinero (si paga en especies, degenera en permuta). Es el modelo base que el legislador utiliza para suplir vacíos en otros contratos. Perfeccionarla correctamente, mediante escritura pública si recae sobre inmuebles, es la base del derecho de propiedad chileno.`
    },
    {
        numero: "Art. 1889",
        titulo: "Lesión Enorme",
        texto: `El vendedor sufre lesión enorme, cuando el precio que recibe es inferior a la mitad del justo precio de la cosa que vende...`,
        analisisIA: `Opera como una excepción al principio del libre mercado, sancionando la desproporción aritmética grave en la compraventa de bienes raíces. Permite al afectado demandar la rescisión (nulidad) del contrato. Protege a personas desesperadas o ignorantes de vender su propiedad por migajas. En tribunales, requiere un informe pericial tasador impecable. Si el juez declara la lesión, el demandado tiene el derecho optativo de anular la venta o mantenerla pagando o restituyendo la diferencia para alcanzar la equidad.`
    },
    {
        numero: "Art. 1915",
        titulo: "El Arrendamiento",
        texto: `El arrendamiento es un contrato en que las dos partes se obligan recíprocamente, la una a conceder el goce de una cosa... y la otra a pagar por este goce un precio determinado.`,
        analisisIA: `Contrato de concesión de uso por excelencia. Genera derechos estrictamente personales, no transfiere el dominio. El arrendador debe mantener la cosa en estado de servir, mientras el arrendatario debe conservarla, pagar la renta y restituirla al término. En la práctica, genera un alto volumen de litigios de precario, término de contrato y cobro de rentas bajo la ley especial 18.101. Redactar cláusulas de garantía sólidas y de competencia arbitral en este contrato salva al cliente de juicios de desalojo interminables.`
    },
    {
        numero: "Art. 2053",
        titulo: "La Sociedad",
        texto: `La sociedad o compañía es un contrato en que dos o más personas estipulan poner algo en común con la mira de repartir entre sí los beneficios que de ello provengan.`,
        analisisIA: `Fundamento del derecho societario y corporativo. Exige aportes (dinero, bienes o trabajo) y el affectio societatis (ánimo de asociarse y compartir riesgos). Su efecto más importante es la creación de una persona jurídica distinta de los socios, con patrimonio propio. Para el abogado de empresas, la elección entre una SpA, SRL o sociedad anónima nace de este principio general, siendo el mecanismo legal para limitar la responsabilidad de los inversionistas y organizar el capital privado.`
    },
    {
        numero: "Art. 2116",
        titulo: "El Mandato",
        texto: `El mandato es un contrato en que una persona confía la gestión de uno o más negocios lícitos a otra, que se hace cargo de ellos por cuenta y riesgo de la primera.`,
        analisisIA: `Instrumento jurídico que permite la representación legal. Los actos ejecutados por el mandatario dentro de los límites de sus poderes obligan directamente al patrimonio del mandante, como si él mismo los hubiera firmado. Es un contrato basado en la confianza estricta, siendo esencialmente revocable. Para los abogados, el mandato judicial contenido en la escritura pública es su habilitación para litigar; una omisión en las facultades especiales (como percibir o transigir) puede hacer fracasar un juicio ganado.`
    },
    {
        numero: "Art. 2196",
        titulo: "El Mutuo",
        texto: `El mutuo o préstamo de consumo es un contrato en que una de las partes entrega a la otra cierta cantidad de cosas fungibles con cargo de restituir otras tantas del mismo género y calidad.`,
        analisisIA: `El contrato central del mercado financiero y bancario. Es un contrato real que se perfecciona con la entrega del dinero o especies. Transfiere el dominio del dinero al mutuario, asumiendo este el riesgo de pérdida y la obligación de devolver el equivalente. En la práctica financiera moderna, siempre va asociado a intereses y a pagarés notariales, permitiendo la ejecución acelerada en caso de no pago de una de las cuotas mediante la clásica cláusula de aceleración.`
    },
    {
        numero: "Art. 2211",
        titulo: "El Comodato",
        texto: `El comodato o préstamo de uso es un contrato en que una de las partes entrega a la otra gratuitamente una especie... para que haga uso de ella... con cargo de restituir la misma especie.`,
        analisisIA: `A diferencia del mutuo, el comodato es esencialmente gratuito y recae sobre especies no fungibles (ej. prestar una máquina o una casa). El comodatario asume una responsabilidad altísima de conservación (responde hasta de la culpa levísima) y no adquiere el dominio, siendo un mero tenedor. En estrategias civiles, a menudo se usa para encubrir donaciones o permitir ocupaciones temporales que prevengan que el ocupante alegue posesión y demande prescripción adquisitiva posteriormente.`
    },
    {
        numero: "Art. 2320",
        titulo: "Responsabilidad por el Hecho Ajeno",
        texto: `Toda persona es responsable no sólo de sus propias acciones, sino del hecho de aquellos que estuvieren a su cuidado.`,
        analisisIA: `Rompe la regla de la responsabilidad personal. Presume la culpa in vigilando o in eligendo (falta de vigilancia o mala elección). Permite a la víctima demandar al padre por los destrozos del hijo, al empresario por el accidente causado por su trabajador o al colegio por el actuar del alumno. Es una norma vital en demandas de indemnización profundas, permitiendo al abogado perseguir al "bolsillo profundo" (la empresa o institución) en lugar del empleado insolvente que causó el daño material.`
    },
    {
        numero: "Art. 2329",
        titulo: "Presunción de Culpabilidad",
        texto: `Por regla general todo daño que pueda imputarse a malicia o negligencia de otra persona, debe ser reparado por ésta...`,
        analisisIA: `Es la norma de clausura de la responsabilidad extracontractual. La jurisprudencia la ha interpretado como una presunción de culpa por el hecho propio cuando el accidente se produce por el desempeño de actividades peligrosas o cuando la falta de cuidado es evidente (res ipsa loquitur). Para la víctima, invocar este artículo invierte la carga de la prueba, obligando al demandado a probar que actuó diligentemente, facilitando enormemente el éxito de la demanda indemnizatoria.`
    },
    {
        numero: "Art. 2384",
        titulo: "La Prenda",
        texto: `Por el contrato de empeño o prenda se entrega una cosa mueble a un acreedor para la seguridad de su crédito.`,
        analisisIA: `Es la caución real propia de los bienes muebles. Se perfecciona con la entrega física del bien al acreedor, otorgándole derechos de retención, preferencia en el pago y persecución si pierde la tenencia. Aunque hoy existen las prendas sin desplazamiento registrales, la prenda civil tradicional sigue siendo un mecanismo de garantía rápida. Protege el crédito comercial aislando el bien pignorado del resto de los acreedores valistas en caso de que el deudor caiga en insolvencia comercial.`
    },
    {
        numero: "Art. 2514",
        titulo: "Requisitos de la Prescripción",
        texto: `La prescripción que extingue las acciones y derechos ajenos exige solamente cierto lapso de tiempo, durante el cual no se hayan ejercido dichas acciones.`,
        analisisIA: `Establece el funcionamiento procesal de la extinción de deudas. Para que el acreedor pierda el derecho a cobrar en tribunales, solo se requiere inactividad total y el paso del tiempo tasado por la ley (ej. 5 años acciones ordinarias, 3 ejecutivas, 1 año letras de cambio). Requiere ser alegada expresamente; el juez no la puede declarar de oficio. Es el reloj fatal que apremia a los abogados a notificar demandas rápidamente para "interrumpir" este plazo antes de que la deuda se vuelva incobrable e inexigible.`
    }
];

module.exports = bancoArticulosAlucilex;