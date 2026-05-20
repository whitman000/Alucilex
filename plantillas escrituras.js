require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Conexión a tu base de datos Supabase usando las credenciales de tu archivo .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// =========================================================================
// ZONA DE INYECCIÓN DE DATOS:
// Reemplaza el arreglo vacío "const TEMPLATES = [];" por el arreglo completo 
// que copiarás en el PASO 2.
// =========================================================================
const TEMPLATES = [
  {
    "id": "compraventa_inmueble",
    "title": "Compraventa de inmueble",
    "category": "Bienes raíces / compraventas",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "compraventa (3).docx",
      "MODELO DE COMPRAVENTA.docx",
      "Rep. XXX-2018 COMPRAVENTA REDACTADA EN NOTARÍA VALLEJOS-GARRIDO.doc",
      "REP.819-2023.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "parte_vendedora",
        "label": "Parte vendedora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "parte_compradora",
        "label": "Parte compradora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "inmueble_descripcion",
        "label": "Descripción completa del inmueble",
        "type": "textarea",
        "placeholder": "Dirección, comuna, provincia/región, rol de avalúo, superficie, destino, plano, lote/sitio/departamento/estacionamiento/bodega.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "deslindes",
        "label": "Deslindes",
        "type": "textarea",
        "placeholder": "Norte, Sur, Oriente/Este y Poniente/Oeste; medidas y colindantes.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "inscripcion_dominio",
        "label": "Inscripción de dominio vigente",
        "type": "textarea",
        "placeholder": "Fojas, número, año, Registro de Propiedad y Conservador de Bienes Raíces.",
        "required": true,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "titulo_adquisicion",
        "label": "Título de adquisición",
        "type": "textarea",
        "placeholder": "Compraventa, herencia, adjudicación, permuta, dación, etc.; notaría, repertorio, fecha.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "gravamenes",
        "label": "Gravámenes, prohibiciones, hipotecas, litigios",
        "type": "textarea",
        "placeholder": "Libre de gravámenes/prohibiciones/embargos/litigios o detalle exacto de cargas.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "precio",
        "label": "Precio",
        "type": "text",
        "placeholder": "Monto en pesos, UF u otra unidad, en números y palabras.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, transferencia, vale vista, crédito hipotecario, subsidio, carta de instrucciones, saldo.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "entrega_material",
        "label": "Entrega material",
        "type": "textarea",
        "placeholder": "En este acto / al inscribirse / en fecha determinada / contra pago del saldo.",
        "required": false,
        "group": "7. Entrega"
      },
      {
        "key": "declaraciones_sii",
        "label": "Declaraciones SII / tributarias",
        "type": "textarea",
        "placeholder": "Avalúo fiscal, contribuciones, Formulario 2890, IVA si aplica, declaraciones de enajenación.",
        "required": false,
        "group": "8. Tributario"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Copia de inscripción de dominio vigente",
      "Certificado de hipotecas, gravámenes, prohibiciones e interdicciones",
      "Certificado de avalúo fiscal y rol",
      "Certificado de deuda de contribuciones si corresponde",
      "Formulario 2890 cuando proceda",
      "Revisión de régimen matrimonial y autorizaciones"
    ],
    "body": "COMPRAVENTA\n{{parte_vendedora}}\nA\n{{parte_compradora}}\n\nEn {{ciudad}}, República de Chile, a {{fecha_texto}}, ante {{notario_nombre}}, {{oficio_notarial}}, comparecen: {{comparecientes}}\n\nPRIMERO: Dominio. La parte vendedora declara ser dueña del inmueble que se individualiza como sigue: {{inmueble_descripcion}}.\n\nSEGUNDO: Deslindes. Los deslindes del inmueble son los siguientes: {{deslindes}}.\n\nTERCERO: Título e inscripción. El dominio rola inscrito a fojas/número/año según: {{inscripcion_dominio}}. El título de adquisición corresponde a: {{titulo_adquisicion}}.\n\nCUARTO: Venta. Por el presente instrumento, la parte vendedora vende, cede y transfiere a la parte compradora, quien compra, acepta y adquiere para sí, el inmueble ya singularizado, con todos sus usos, costumbres, derechos y servidumbres activas y pasivas.\n\nQUINTO: Precio. El precio de la compraventa es {{precio}}, que se paga de la siguiente forma: {{forma_pago}}.\n\nSEXTO: Entrega material. La entrega material se efectuará en los siguientes términos: {{entrega_material}}.\n\nSÉPTIMO: Gravámenes y prohibiciones. {{gravamenes}}\n\nOCTAVO: Declaraciones tributarias y administrativas. {{declaraciones_sii}}\n\nNOVENO: Gastos. {{gastos}}\n\nDÉCIMO: Personerías y cierre. {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 1
  },
  {
    "id": "compraventa_serviu_prohibicion",
    "title": "Compraventa con subsidio SERVIU y prohibición",
    "category": "Bienes raíces / compraventas",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "COMPRAVENTA SERVIU.pdf",
      "Carta Instruccion CV  SERVIU.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "parte_vendedora",
        "label": "Parte vendedora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "parte_compradora",
        "label": "Parte compradora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "inmueble_descripcion",
        "label": "Descripción completa del inmueble",
        "type": "textarea",
        "placeholder": "Dirección, comuna, provincia/región, rol de avalúo, superficie, destino, plano, lote/sitio/departamento/estacionamiento/bodega.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "deslindes",
        "label": "Deslindes",
        "type": "textarea",
        "placeholder": "Norte, Sur, Oriente/Este y Poniente/Oeste; medidas y colindantes.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "inscripcion_dominio",
        "label": "Inscripción de dominio vigente",
        "type": "textarea",
        "placeholder": "Fojas, número, año, Registro de Propiedad y Conservador de Bienes Raíces.",
        "required": true,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "titulo_adquisicion",
        "label": "Título de adquisición",
        "type": "textarea",
        "placeholder": "Compraventa, herencia, adjudicación, permuta, dación, etc.; notaría, repertorio, fecha.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "gravamenes",
        "label": "Gravámenes, prohibiciones, hipotecas, litigios",
        "type": "textarea",
        "placeholder": "Libre de gravámenes/prohibiciones/embargos/litigios o detalle exacto de cargas.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "precio",
        "label": "Precio",
        "type": "text",
        "placeholder": "Monto en pesos, UF u otra unidad, en números y palabras.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, transferencia, vale vista, crédito hipotecario, subsidio, carta de instrucciones, saldo.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "entrega_material",
        "label": "Entrega material",
        "type": "textarea",
        "placeholder": "En este acto / al inscribirse / en fecha determinada / contra pago del saldo.",
        "required": false,
        "group": "7. Entrega"
      },
      {
        "key": "declaraciones_sii",
        "label": "Declaraciones SII / tributarias",
        "type": "textarea",
        "placeholder": "Avalúo fiscal, contribuciones, Formulario 2890, IVA si aplica, declaraciones de enajenación.",
        "required": false,
        "group": "8. Tributario"
      },
      {
        "key": "subsidio_serviu",
        "label": "Subsidio SERVIU / programa habitacional",
        "type": "textarea",
        "placeholder": "Tipo de subsidio, resolución, monto, beneficiario, entidad patrocinante.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "prohibicion_serviu",
        "label": "Prohibiciones SERVIU / limitaciones de disposición",
        "type": "textarea",
        "placeholder": "Prohibición de enajenar, gravar, arrendar u otra limitación; plazo e inscripción.",
        "required": true,
        "group": "8. Tributario"
      },
      {
        "key": "carta_instrucciones",
        "label": "Carta de instrucciones asociada",
        "type": "textarea",
        "placeholder": "Condiciones para liberar vale vista, subsidio, crédito o saldo.",
        "required": false,
        "group": "6. Precio y pago"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Copia de inscripción de dominio vigente",
      "Certificado de hipotecas, gravámenes, prohibiciones e interdicciones",
      "Certificado de avalúo fiscal y rol",
      "Certificado de deuda de contribuciones si corresponde",
      "Formulario 2890 cuando proceda",
      "Revisión de régimen matrimonial y autorizaciones",
      "Resolución o certificado del subsidio",
      "Carta de instrucciones aprobada",
      "Condiciones especiales SERVIU"
    ],
    "body": "COMPRAVENTA Y PROHIBICIÓN SERVIU\n{{parte_vendedora}}\nA\n{{parte_compradora}}\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen: {{comparecientes}}\n\nPRIMERO: Inmueble. {{inmueble_descripcion}}. Deslindes: {{deslindes}}.\n\nSEGUNDO: Dominio. {{inscripcion_dominio}}. Título: {{titulo_adquisicion}}.\n\nTERCERO: Compraventa. La parte vendedora vende a la parte compradora el inmueble individualizado.\n\nCUARTO: Precio y pago. El precio es {{precio}} y se paga así: {{forma_pago}}. Subsidio o beneficio habitacional: {{subsidio_serviu}}.\n\nQUINTO: Carta de instrucciones. {{carta_instrucciones}}\n\nSEXTO: Prohibiciones y obligaciones SERVIU. Las partes dejan constancia de las siguientes prohibiciones, restricciones u obligaciones: {{prohibicion_serviu}}.\n\nSÉPTIMO: Entrega, gastos y declaraciones. Entrega: {{entrega_material}}. Gastos: {{gastos}}. Declaraciones SII/CBR: {{declaraciones_sii}}.\n\nOCTAVO: Personerías y cierre. {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 2
  },
  {
    "id": "compraventa_y_cesion_derechos",
    "title": "Compraventa y cesión de derechos",
    "category": "Bienes raíces / compraventas",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "COMPRAVENTA Y CESION DE DERECHOS.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "parte_vendedora",
        "label": "Parte vendedora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "parte_compradora",
        "label": "Parte compradora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "inmueble_descripcion",
        "label": "Descripción completa del inmueble",
        "type": "textarea",
        "placeholder": "Dirección, comuna, provincia/región, rol de avalúo, superficie, destino, plano, lote/sitio/departamento/estacionamiento/bodega.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "deslindes",
        "label": "Deslindes",
        "type": "textarea",
        "placeholder": "Norte, Sur, Oriente/Este y Poniente/Oeste; medidas y colindantes.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "inscripcion_dominio",
        "label": "Inscripción de dominio vigente",
        "type": "textarea",
        "placeholder": "Fojas, número, año, Registro de Propiedad y Conservador de Bienes Raíces.",
        "required": true,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "titulo_adquisicion",
        "label": "Título de adquisición",
        "type": "textarea",
        "placeholder": "Compraventa, herencia, adjudicación, permuta, dación, etc.; notaría, repertorio, fecha.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "gravamenes",
        "label": "Gravámenes, prohibiciones, hipotecas, litigios",
        "type": "textarea",
        "placeholder": "Libre de gravámenes/prohibiciones/embargos/litigios o detalle exacto de cargas.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "precio",
        "label": "Precio",
        "type": "text",
        "placeholder": "Monto en pesos, UF u otra unidad, en números y palabras.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, transferencia, vale vista, crédito hipotecario, subsidio, carta de instrucciones, saldo.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "entrega_material",
        "label": "Entrega material",
        "type": "textarea",
        "placeholder": "En este acto / al inscribirse / en fecha determinada / contra pago del saldo.",
        "required": false,
        "group": "7. Entrega"
      },
      {
        "key": "declaraciones_sii",
        "label": "Declaraciones SII / tributarias",
        "type": "textarea",
        "placeholder": "Avalúo fiscal, contribuciones, Formulario 2890, IVA si aplica, declaraciones de enajenación.",
        "required": false,
        "group": "8. Tributario"
      },
      {
        "key": "derechos_cedidos",
        "label": "Derechos cedidos",
        "type": "textarea",
        "placeholder": "Porcentaje, cuota, acciones y derechos, derechos hereditarios o comunitarios, origen.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "cedentes_adicionales",
        "label": "Cedentes o vendedores adicionales",
        "type": "textarea",
        "placeholder": "Detalle si existen múltiples cedentes/vendedores.",
        "required": false,
        "group": "3. Partes"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Copia de inscripción de dominio vigente",
      "Certificado de hipotecas, gravámenes, prohibiciones e interdicciones",
      "Certificado de avalúo fiscal y rol",
      "Certificado de deuda de contribuciones si corresponde",
      "Formulario 2890 cuando proceda",
      "Revisión de régimen matrimonial y autorizaciones"
    ],
    "body": "COMPRAVENTA Y CESIÓN DE DERECHOS\n{{parte_vendedora}}\nA\n{{parte_compradora}}\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen: {{comparecientes}}\n\nPRIMERO: Antecedentes de dominio. {{inscripcion_dominio}} {{titulo_adquisicion}}\n\nSEGUNDO: Objeto. La parte vendedora vende y cede a la parte compradora los siguientes derechos: {{derechos_cedidos}}, vinculados al inmueble: {{inmueble_descripcion}}.\n\nTERCERO: Deslindes y cargas. Deslindes: {{deslindes}}. Gravámenes/prohibiciones: {{gravamenes}}.\n\nCUARTO: Precio. {{precio}}. Forma de pago: {{forma_pago}}.\n\nQUINTO: Cesión, tradición e inscripción. Las partes acuerdan efectuar las inscripciones, subinscripciones y anotaciones que correspondan ante el Conservador respectivo.\n\nSEXTO: Entrega, gastos y cierre. {{entrega_material}} {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 3
  },
  {
    "id": "compraventa_usufructo_nuda",
    "title": "Compraventa con usufructo vitalicio / nuda propiedad",
    "category": "Bienes raíces / compraventas",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "cv con usuf.docx",
      "NUDA PROPIEDAD.docx",
      "NUDA PROPIEDAD 1.png",
      "NUDA PROPIEDAD 2.png"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "parte_vendedora",
        "label": "Parte vendedora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "parte_compradora",
        "label": "Parte compradora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "inmueble_descripcion",
        "label": "Descripción completa del inmueble",
        "type": "textarea",
        "placeholder": "Dirección, comuna, provincia/región, rol de avalúo, superficie, destino, plano, lote/sitio/departamento/estacionamiento/bodega.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "deslindes",
        "label": "Deslindes",
        "type": "textarea",
        "placeholder": "Norte, Sur, Oriente/Este y Poniente/Oeste; medidas y colindantes.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "inscripcion_dominio",
        "label": "Inscripción de dominio vigente",
        "type": "textarea",
        "placeholder": "Fojas, número, año, Registro de Propiedad y Conservador de Bienes Raíces.",
        "required": true,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "titulo_adquisicion",
        "label": "Título de adquisición",
        "type": "textarea",
        "placeholder": "Compraventa, herencia, adjudicación, permuta, dación, etc.; notaría, repertorio, fecha.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "gravamenes",
        "label": "Gravámenes, prohibiciones, hipotecas, litigios",
        "type": "textarea",
        "placeholder": "Libre de gravámenes/prohibiciones/embargos/litigios o detalle exacto de cargas.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "precio",
        "label": "Precio",
        "type": "text",
        "placeholder": "Monto en pesos, UF u otra unidad, en números y palabras.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, transferencia, vale vista, crédito hipotecario, subsidio, carta de instrucciones, saldo.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "entrega_material",
        "label": "Entrega material",
        "type": "textarea",
        "placeholder": "En este acto / al inscribirse / en fecha determinada / contra pago del saldo.",
        "required": false,
        "group": "7. Entrega"
      },
      {
        "key": "declaraciones_sii",
        "label": "Declaraciones SII / tributarias",
        "type": "textarea",
        "placeholder": "Avalúo fiscal, contribuciones, Formulario 2890, IVA si aplica, declaraciones de enajenación.",
        "required": false,
        "group": "8. Tributario"
      },
      {
        "key": "usufructuario",
        "label": "Usufructuario/a",
        "type": "textarea",
        "placeholder": "Individualización completa del usufructuario.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "nudo_propietario",
        "label": "Nudo propietario/a",
        "type": "textarea",
        "placeholder": "Individualización completa del nudo propietario.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "modalidad_usufructo",
        "label": "Modalidad del usufructo",
        "type": "textarea",
        "placeholder": "Vitalicio, temporal, gratuito u oneroso; derechos, obligaciones y extinción.",
        "required": true,
        "group": "6. Usufructo"
      },
      {
        "key": "uso_goce",
        "label": "Uso, goce y administración",
        "type": "textarea",
        "placeholder": "Quién usa, percibe frutos, paga gastos, contribuciones, mantención, seguros.",
        "required": false,
        "group": "6. Usufructo"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Copia de inscripción de dominio vigente",
      "Certificado de hipotecas, gravámenes, prohibiciones e interdicciones",
      "Certificado de avalúo fiscal y rol",
      "Certificado de deuda de contribuciones si corresponde",
      "Formulario 2890 cuando proceda",
      "Revisión de régimen matrimonial y autorizaciones",
      "Definir si hay reserva o constitución de usufructo",
      "Indicar duración y cargas del usufructo"
    ],
    "body": "COMPRAVENTA DE NUDA PROPIEDAD Y CONSTITUCIÓN / RESERVA DE USUFRUCTO\n{{parte_vendedora}}\nA\n{{parte_compradora}}\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen: {{comparecientes}}\n\nPRIMERO: Inmueble. {{inmueble_descripcion}}. Deslindes: {{deslindes}}. Inscripción: {{inscripcion_dominio}}.\n\nSEGUNDO: Venta de nuda propiedad. La parte vendedora vende, cede y transfiere la nuda propiedad a {{nudo_propietario}}, por el precio de {{precio}}, pagado conforme a: {{forma_pago}}.\n\nTERCERO: Usufructo. Se constituye o reserva usufructo en favor de {{usufructuario}}, bajo la siguiente modalidad: {{modalidad_usufructo}}.\n\nCUARTO: Uso, goce, frutos y cargas. {{uso_goce}}\n\nQUINTO: Gravámenes, declaraciones y cierre. {{gravamenes}} {{declaraciones_sii}} {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 4
  },
  {
    "id": "compraventa_admin_bienes_mujer",
    "title": "Compraventa con comparecencia por administración de bienes / autorización conyugal",
    "category": "Bienes raíces / compraventas",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "cvta administrador de los bienes - dueña la mujer.doc"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "parte_vendedora",
        "label": "Parte vendedora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "parte_compradora",
        "label": "Parte compradora",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "inmueble_descripcion",
        "label": "Descripción completa del inmueble",
        "type": "textarea",
        "placeholder": "Dirección, comuna, provincia/región, rol de avalúo, superficie, destino, plano, lote/sitio/departamento/estacionamiento/bodega.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "deslindes",
        "label": "Deslindes",
        "type": "textarea",
        "placeholder": "Norte, Sur, Oriente/Este y Poniente/Oeste; medidas y colindantes.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "inscripcion_dominio",
        "label": "Inscripción de dominio vigente",
        "type": "textarea",
        "placeholder": "Fojas, número, año, Registro de Propiedad y Conservador de Bienes Raíces.",
        "required": true,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "titulo_adquisicion",
        "label": "Título de adquisición",
        "type": "textarea",
        "placeholder": "Compraventa, herencia, adjudicación, permuta, dación, etc.; notaría, repertorio, fecha.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "gravamenes",
        "label": "Gravámenes, prohibiciones, hipotecas, litigios",
        "type": "textarea",
        "placeholder": "Libre de gravámenes/prohibiciones/embargos/litigios o detalle exacto de cargas.",
        "required": false,
        "group": "5. Dominio y CBR"
      },
      {
        "key": "precio",
        "label": "Precio",
        "type": "text",
        "placeholder": "Monto en pesos, UF u otra unidad, en números y palabras.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, transferencia, vale vista, crédito hipotecario, subsidio, carta de instrucciones, saldo.",
        "required": true,
        "group": "6. Precio y pago"
      },
      {
        "key": "entrega_material",
        "label": "Entrega material",
        "type": "textarea",
        "placeholder": "En este acto / al inscribirse / en fecha determinada / contra pago del saldo.",
        "required": false,
        "group": "7. Entrega"
      },
      {
        "key": "declaraciones_sii",
        "label": "Declaraciones SII / tributarias",
        "type": "textarea",
        "placeholder": "Avalúo fiscal, contribuciones, Formulario 2890, IVA si aplica, declaraciones de enajenación.",
        "required": false,
        "group": "8. Tributario"
      },
      {
        "key": "regimen_matrimonial",
        "label": "Régimen matrimonial y autorización",
        "type": "textarea",
        "placeholder": "Sociedad conyugal, separación de bienes, participación en gananciales, patrimonio reservado, autorización o comparecencia del cónyuge.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "administrador_bienes",
        "label": "Administrador o representante de bienes",
        "type": "textarea",
        "placeholder": "Individualización y fundamento de representación/administración.",
        "required": false,
        "group": "3. Partes"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Copia de inscripción de dominio vigente",
      "Certificado de hipotecas, gravámenes, prohibiciones e interdicciones",
      "Certificado de avalúo fiscal y rol",
      "Certificado de deuda de contribuciones si corresponde",
      "Formulario 2890 cuando proceda",
      "Revisión de régimen matrimonial y autorizaciones",
      "Revisar régimen matrimonial y facultades de disposición"
    ],
    "body": "COMPRAVENTA CON DECLARACIÓN DE RÉGIMEN PATRIMONIAL Y ADMINISTRACIÓN DE BIENES\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen: {{comparecientes}}\n\nPRIMERO: Partes. Vendedor/a: {{parte_vendedora}}. Comprador/a: {{parte_compradora}}.\n\nSEGUNDO: Régimen patrimonial y autorización. Las partes declaran lo siguiente respecto del régimen matrimonial, administración de bienes o autorización que corresponda: {{regimen_matrimonial}}. Administrador/representante: {{administrador_bienes}}.\n\nTERCERO: Inmueble, dominio y venta. {{inmueble_descripcion}}. Deslindes: {{deslindes}}. Inscripción: {{inscripcion_dominio}}. La parte vendedora vende a la compradora el inmueble singularizado.\n\nCUARTO: Precio y pago. {{precio}}. Forma de pago: {{forma_pago}}.\n\nQUINTO: Cargas, entrega y cierre. {{gravamenes}} {{entrega_material}} {{declaraciones_sii}} {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 5
  },
  {
    "id": "compraventa_vehiculo",
    "title": "Compraventa de vehículo motorizado",
    "category": "Vehículos y bienes muebles",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "CV VEHÍCULOS.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "vendedor",
        "label": "Vendedor",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "comprador",
        "label": "Comprador",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "vehiculo",
        "label": "Individualización del vehículo",
        "type": "textarea",
        "placeholder": "Tipo, marca, modelo, año, color, placa patente, N° motor, N° chasis/VIN, inscripción RVM.",
        "required": true,
        "group": "4. Vehículo"
      },
      {
        "key": "padron",
        "label": "Padrón / inscripción Registro Civil",
        "type": "textarea",
        "placeholder": "Número de inscripción, propietario, limitaciones al dominio.",
        "required": false,
        "group": "4. Vehículo"
      },
      {
        "key": "precio",
        "label": "Precio",
        "type": "text",
        "placeholder": "Monto en números y palabras.",
        "required": true,
        "group": "5. Precio y pago"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, transferencia, vale vista, cuotas, saldo.",
        "required": true,
        "group": "5. Precio y pago"
      },
      {
        "key": "entrega",
        "label": "Entrega material y documentos",
        "type": "textarea",
        "placeholder": "Fecha de entrega, llaves, padrón, permiso circulación, revisión técnica, TAG/multas.",
        "required": false,
        "group": "6. Entrega"
      },
      {
        "key": "deudas_multas",
        "label": "Multas, TAG, permisos y gravámenes",
        "type": "textarea",
        "placeholder": "Declaración de multas, permisos, prohibiciones, prenda, limitaciones.",
        "required": false,
        "group": "6. Entrega"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Certificado de anotaciones vigentes",
      "Padrón",
      "Revisión de multas/TAG/permiso de circulación",
      "Cédulas de identidad"
    ],
    "body": "CONTRATO DE COMPRAVENTA DE VEHÍCULO MOTORIZADO\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{vendedor}} y {{comprador}}.\n\nPRIMERO: Vehículo. El vendedor declara ser dueño del vehículo: {{vehiculo}}. Padrón/inscripción: {{padron}}.\n\nSEGUNDO: Venta. Por este acto vende, cede y transfiere al comprador, quien compra y acepta para sí, el vehículo individualizado.\n\nTERCERO: Precio. El precio es {{precio}}, pagado de la siguiente forma: {{forma_pago}}.\n\nCUARTO: Entrega. {{entrega}}\n\nQUINTO: Multas, deudas y limitaciones. {{deudas_multas}}\n\nSEXTO: Gastos y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 6
  },
  {
    "id": "promesa_compraventa_inmobiliaria",
    "title": "Promesa de compraventa inmobiliaria",
    "category": "Bienes raíces / promesas",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "Escritura promesa. Inmobiliaria san agustin limitada a andrea isabel seguel.docx",
      "PROMESA CASA LAUTARO Guzman con Campos .docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "promitente_vendedor",
        "label": "Promitente vendedor",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "promitente_comprador",
        "label": "Promitente comprador",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "inmueble_descripcion",
        "label": "Inmueble prometido",
        "type": "textarea",
        "placeholder": "Descripción, dirección, comuna, rol, superficie, inscripción si existe.",
        "required": true,
        "group": "4. Inmueble"
      },
      {
        "key": "precio",
        "label": "Precio prometido",
        "type": "text",
        "placeholder": "Monto total y moneda/unidad.",
        "required": true,
        "group": "5. Precio y pago"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago prometida",
        "type": "textarea",
        "placeholder": "Reserva, pie, crédito, subsidio, saldo, instrucciones.",
        "required": true,
        "group": "5. Precio y pago"
      },
      {
        "key": "plazo_escritura",
        "label": "Plazo para celebrar compraventa definitiva",
        "type": "textarea",
        "placeholder": "Fecha o evento para otorgar la escritura definitiva.",
        "required": true,
        "group": "6. Condiciones"
      },
      {
        "key": "condiciones",
        "label": "Condiciones suspensivas/resolutorias",
        "type": "textarea",
        "placeholder": "Aprobación de crédito, alzamiento, saneamiento, entrega de documentos, recepción municipal.",
        "required": false,
        "group": "6. Condiciones"
      },
      {
        "key": "multa",
        "label": "Multa o cláusula penal",
        "type": "textarea",
        "placeholder": "Monto y modalidad de aplicación.",
        "required": false,
        "group": "7. Incumplimiento"
      },
      {
        "key": "documentos_pendientes",
        "label": "Documentos pendientes",
        "type": "textarea",
        "placeholder": "Certificados, inscripción, planos, recepción, alzamientos, subsidio, etc.",
        "required": false,
        "group": "8. Documentos"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Dominio vigente",
      "Certificados CBR",
      "Avalúo/rol",
      "Condiciones de financiamiento",
      "Cláusula penal clara"
    ],
    "body": "PROMESA DE COMPRAVENTA\n{{promitente_vendedor}}\nA\n{{promitente_comprador}}\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen: {{comparecientes}}\n\nPRIMERO: Promesa. Las partes prometen celebrar contrato definitivo de compraventa respecto del inmueble: {{inmueble_descripcion}}.\n\nSEGUNDO: Precio y pago. El precio prometido será {{precio}}, pagado en la forma siguiente: {{forma_pago}}.\n\nTERCERO: Plazo para la escritura definitiva. {{plazo_escritura}}\n\nCUARTO: Condiciones. {{condiciones}}\n\nQUINTO: Incumplimiento y cláusula penal. {{multa}}\n\nSEXTO: Documentos y antecedentes. {{documentos_pendientes}}\n\nSÉPTIMO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 7
  },
  {
    "id": "carta_instrucciones_compraventa",
    "title": "Carta de instrucciones para compraventa",
    "category": "Bienes raíces / compraventas",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "Carta Instruccion CV  SERVIU.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "instruyentes",
        "label": "Instruyentes / partes",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "operacion",
        "label": "Operación asociada",
        "type": "textarea",
        "placeholder": "Compraventa, promesa, crédito, subsidio, alzamiento u otra.",
        "required": true,
        "group": "3. Operación"
      },
      {
        "key": "documentos_valores",
        "label": "Documentos o valores entregados",
        "type": "textarea",
        "placeholder": "Vale vista, cheque, dinero, documentos, certificado, instrucciones bancarias.",
        "required": true,
        "group": "4. Valores"
      },
      {
        "key": "condiciones_entrega",
        "label": "Condiciones para entrega/liberación",
        "type": "textarea",
        "placeholder": "Inscripción a nombre del comprador, alzamiento, entrega de certificados, plazo, cumplimiento.",
        "required": true,
        "group": "5. Condiciones"
      },
      {
        "key": "depositario",
        "label": "Depositario / notaría",
        "type": "textarea",
        "placeholder": "Nombre de notaría o persona que guarda valores/documentos.",
        "required": false,
        "group": "6. Custodia"
      },
      {
        "key": "plazo",
        "label": "Plazo de vigencia",
        "type": "text",
        "placeholder": "Fecha límite o evento de término.",
        "required": false,
        "group": "6. Custodia"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Identificar vale vista/documentos",
      "Definir condiciones objetivas de liberación",
      "Definir plazo y devolución si no se cumple"
    ],
    "body": "CARTA DE INSTRUCCIONES\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{instruyentes}}, quienes imparten las siguientes instrucciones vinculadas a la operación: {{operacion}}.\n\nPRIMERO: Documentos y valores. Se entregan en custodia los siguientes documentos o valores: {{documentos_valores}}.\n\nSEGUNDO: Condiciones de entrega o liberación. El depositario deberá entregar o liberar los documentos/valores únicamente cuando se cumplan las siguientes condiciones: {{condiciones_entrega}}.\n\nTERCERO: Depositario y plazo. Depositario: {{depositario}}. Plazo o vigencia: {{plazo}}.\n\nCUARTO: Gastos, constancias y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 8
  },
  {
    "id": "arriendo_inmueble",
    "title": "Contrato de arrendamiento de inmueble",
    "category": "Arriendos",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "ARRIENDO INMUBLE.docx",
      "REP.ARRIENDO ELISEO MARDONES modificado.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "arrendador",
        "label": "Arrendador",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "arrendatario",
        "label": "Arrendatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "bien_arrendado",
        "label": "Bien arrendado",
        "type": "textarea",
        "placeholder": "Descripción del inmueble/local/vehículo/servidumbre; dirección, rol, superficie o identificación.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "destino",
        "label": "Destino autorizado",
        "type": "textarea",
        "placeholder": "Habitacional, comercial, agrícola, telecomunicaciones, vehículo, etc.",
        "required": true,
        "group": "5. Uso"
      },
      {
        "key": "plazo",
        "label": "Plazo del contrato",
        "type": "textarea",
        "placeholder": "Fecha de inicio, duración, renovación, término anticipado.",
        "required": true,
        "group": "6. Plazo"
      },
      {
        "key": "renta",
        "label": "Renta o canon",
        "type": "textarea",
        "placeholder": "Monto, periodicidad, reajuste, forma de pago.",
        "required": true,
        "group": "7. Renta"
      },
      {
        "key": "garantia",
        "label": "Garantía",
        "type": "textarea",
        "placeholder": "Monto, restitución, imputaciones, estado del bien.",
        "required": false,
        "group": "7. Renta"
      },
      {
        "key": "obligaciones_arrendador",
        "label": "Obligaciones del arrendador",
        "type": "textarea",
        "placeholder": "Entrega, reparaciones, saneamiento, servicios.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "obligaciones_arrendatario",
        "label": "Obligaciones del arrendatario",
        "type": "textarea",
        "placeholder": "Pago, cuidado, prohibiciones, subarriendo, restitución, servicios.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "termino",
        "label": "Término anticipado / restitución",
        "type": "textarea",
        "placeholder": "Causales, aviso, multa, acta de entrega.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "inventario",
        "label": "Inventario y estado de entrega",
        "type": "textarea",
        "placeholder": "Estado del inmueble, medidores, llaves, anexos, fotografías.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Cédulas/RUT partes",
      "Dominio o facultad para arrendar",
      "Inventario o acta de entrega",
      "Garantía y comprobante",
      "Destino permitido y permisos si corresponde"
    ],
    "body": "CONTRATO DE ARRENDAMIENTO DE INMUEBLE\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{arrendador}} y {{arrendatario}}.\n\nPRIMERO: Objeto. El arrendador da en arrendamiento al arrendatario el siguiente inmueble: {{bien_arrendado}}.\n\nSEGUNDO: Destino. El inmueble será destinado exclusivamente a: {{destino}}.\n\nTERCERO: Plazo. {{plazo}}\n\nCUARTO: Renta y garantía. La renta será: {{renta}}. Garantía: {{garantia}}.\n\nQUINTO: Entrega e inventario. {{inventario}}\n\nSEXTO: Obligaciones. Del arrendador: {{obligaciones_arrendador}}. Del arrendatario: {{obligaciones_arrendatario}}.\n\nSÉPTIMO: Término y restitución. {{termino}}\n\nOCTAVO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 9
  },
  {
    "id": "arriendo_local_comercial",
    "title": "Contrato de arriendo de local comercial",
    "category": "Arriendos",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MINUTA DE CONTRATO DE ARRIENDO DE LOCAL COMERCIAL FLORERÍA LAS ENCINAS.doc",
      "MODELO DE CONTRATO DE ARRIENDO POR ESCRITURA PUBLICA.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "arrendador",
        "label": "Arrendador",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "arrendatario",
        "label": "Arrendatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "bien_arrendado",
        "label": "Bien arrendado",
        "type": "textarea",
        "placeholder": "Descripción del inmueble/local/vehículo/servidumbre; dirección, rol, superficie o identificación.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "destino",
        "label": "Destino autorizado",
        "type": "textarea",
        "placeholder": "Habitacional, comercial, agrícola, telecomunicaciones, vehículo, etc.",
        "required": true,
        "group": "5. Uso"
      },
      {
        "key": "plazo",
        "label": "Plazo del contrato",
        "type": "textarea",
        "placeholder": "Fecha de inicio, duración, renovación, término anticipado.",
        "required": true,
        "group": "6. Plazo"
      },
      {
        "key": "renta",
        "label": "Renta o canon",
        "type": "textarea",
        "placeholder": "Monto, periodicidad, reajuste, forma de pago.",
        "required": true,
        "group": "7. Renta"
      },
      {
        "key": "garantia",
        "label": "Garantía",
        "type": "textarea",
        "placeholder": "Monto, restitución, imputaciones, estado del bien.",
        "required": false,
        "group": "7. Renta"
      },
      {
        "key": "obligaciones_arrendador",
        "label": "Obligaciones del arrendador",
        "type": "textarea",
        "placeholder": "Entrega, reparaciones, saneamiento, servicios.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "obligaciones_arrendatario",
        "label": "Obligaciones del arrendatario",
        "type": "textarea",
        "placeholder": "Pago, cuidado, prohibiciones, subarriendo, restitución, servicios.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "termino",
        "label": "Término anticipado / restitución",
        "type": "textarea",
        "placeholder": "Causales, aviso, multa, acta de entrega.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "patente_permisos",
        "label": "Patentes, permisos y actividad comercial",
        "type": "textarea",
        "placeholder": "Giro, patente municipal, permisos sanitarios, letreros, horarios, normativa.",
        "required": true,
        "group": "5. Uso"
      },
      {
        "key": "mejoras",
        "label": "Mejoras, instalaciones y restitución",
        "type": "textarea",
        "placeholder": "Autorización para mejoras, retiro o beneficio del inmueble.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Cédulas/RUT partes",
      "Dominio o facultad para arrendar",
      "Inventario o acta de entrega",
      "Garantía y comprobante",
      "Destino permitido y permisos si corresponde",
      "Revisar destino comercial y patente municipal"
    ],
    "body": "CONTRATO DE ARRENDAMIENTO DE LOCAL COMERCIAL\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{arrendador}} y {{arrendatario}}.\n\nPRIMERO: Local. {{bien_arrendado}}.\n\nSEGUNDO: Destino comercial. El local se destinará a {{destino}}. Patentes, permisos y exigencias: {{patente_permisos}}.\n\nTERCERO: Plazo, renta y garantía. Plazo: {{plazo}}. Renta: {{renta}}. Garantía: {{garantia}}.\n\nCUARTO: Mejoras e instalaciones. {{mejoras}}\n\nQUINTO: Obligaciones y término. Arrendador: {{obligaciones_arrendador}}. Arrendatario: {{obligaciones_arrendatario}}. Término/restitución: {{termino}}.\n\nSEXTO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 10
  },
  {
    "id": "arriendo_escritura_publica",
    "title": "Contrato de arriendo por escritura pública",
    "category": "Arriendos",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MODELO DE CONTRATO DE ARRIENDO POR ESCRITURA PUBLICA.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "arrendador",
        "label": "Arrendador",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "arrendatario",
        "label": "Arrendatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "bien_arrendado",
        "label": "Bien arrendado",
        "type": "textarea",
        "placeholder": "Descripción del inmueble/local/vehículo/servidumbre; dirección, rol, superficie o identificación.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "destino",
        "label": "Destino autorizado",
        "type": "textarea",
        "placeholder": "Habitacional, comercial, agrícola, telecomunicaciones, vehículo, etc.",
        "required": true,
        "group": "5. Uso"
      },
      {
        "key": "plazo",
        "label": "Plazo del contrato",
        "type": "textarea",
        "placeholder": "Fecha de inicio, duración, renovación, término anticipado.",
        "required": true,
        "group": "6. Plazo"
      },
      {
        "key": "renta",
        "label": "Renta o canon",
        "type": "textarea",
        "placeholder": "Monto, periodicidad, reajuste, forma de pago.",
        "required": true,
        "group": "7. Renta"
      },
      {
        "key": "garantia",
        "label": "Garantía",
        "type": "textarea",
        "placeholder": "Monto, restitución, imputaciones, estado del bien.",
        "required": false,
        "group": "7. Renta"
      },
      {
        "key": "obligaciones_arrendador",
        "label": "Obligaciones del arrendador",
        "type": "textarea",
        "placeholder": "Entrega, reparaciones, saneamiento, servicios.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "obligaciones_arrendatario",
        "label": "Obligaciones del arrendatario",
        "type": "textarea",
        "placeholder": "Pago, cuidado, prohibiciones, subarriendo, restitución, servicios.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "termino",
        "label": "Término anticipado / restitución",
        "type": "textarea",
        "placeholder": "Causales, aviso, multa, acta de entrega.",
        "required": false,
        "group": "8. Obligaciones"
      },
      {
        "key": "inscripcion_arriendo",
        "label": "Inscripción o anotación del arriendo",
        "type": "textarea",
        "placeholder": "Indicar si se solicitará inscripción/subinscripción del contrato o prohibiciones.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Cédulas/RUT partes",
      "Dominio o facultad para arrendar",
      "Inventario o acta de entrega",
      "Garantía y comprobante",
      "Destino permitido y permisos si corresponde",
      "Definir si procede inscripción o protocolización"
    ],
    "body": "CONTRATO DE ARRENDAMIENTO POR ESCRITURA PÚBLICA\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen {{comparecientes}}.\n\nPRIMERO: Arrendamiento. {{arrendador}} da en arrendamiento a {{arrendatario}} el bien: {{bien_arrendado}}.\n\nSEGUNDO: Destino, plazo y renta. Destino: {{destino}}. Plazo: {{plazo}}. Renta: {{renta}}. Garantía: {{garantia}}.\n\nTERCERO: Obligaciones. {{obligaciones_arrendador}} {{obligaciones_arrendatario}}\n\nCUARTO: Término, restitución e inscripción. {{termino}} {{inscripcion_arriendo}}\n\nQUINTO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 11
  },
  {
    "id": "arriendo_vehiculo",
    "title": "Contrato de arrendamiento de vehículo",
    "category": "Arriendos / vehículos",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "CONTRATO DE ARRENDAMIENTO VEHICULO N 12.doc"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "arrendador",
        "label": "Arrendador",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "arrendatario",
        "label": "Arrendatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "vehiculo",
        "label": "Vehículo arrendado",
        "type": "textarea",
        "placeholder": "Marca, modelo, año, patente, motor, chasis/VIN, padrón, estado.",
        "required": true,
        "group": "4. Vehículo"
      },
      {
        "key": "plazo",
        "label": "Plazo",
        "type": "textarea",
        "placeholder": "Inicio, duración, devolución, renovación.",
        "required": true,
        "group": "5. Plazo y renta"
      },
      {
        "key": "renta",
        "label": "Renta",
        "type": "textarea",
        "placeholder": "Monto, periodicidad, forma de pago, garantía.",
        "required": true,
        "group": "5. Plazo y renta"
      },
      {
        "key": "uso_autorizado",
        "label": "Uso autorizado",
        "type": "textarea",
        "placeholder": "Transporte, particular, comercial, kilometraje, conductor autorizado.",
        "required": true,
        "group": "6. Uso y seguros"
      },
      {
        "key": "seguros_mantencion",
        "label": "Seguros, mantención, permisos y multas",
        "type": "textarea",
        "placeholder": "Responsable de seguro, mantención, combustible, TAG, multas, siniestros.",
        "required": true,
        "group": "6. Uso y seguros"
      },
      {
        "key": "entrega_devolucion",
        "label": "Entrega y devolución",
        "type": "textarea",
        "placeholder": "Acta de entrega, estado, llaves, documentos, accesorios.",
        "required": false,
        "group": "7. Entrega"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Padrón",
      "Certificado anotaciones vigentes",
      "Seguro",
      "Acta de entrega",
      "Licencia del conductor si procede"
    ],
    "body": "CONTRATO DE ARRENDAMIENTO DE VEHÍCULO\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{arrendador}} y {{arrendatario}}.\n\nPRIMERO: Vehículo. El arrendador entrega en arrendamiento el vehículo: {{vehiculo}}.\n\nSEGUNDO: Plazo y renta. Plazo: {{plazo}}. Renta: {{renta}}.\n\nTERCERO: Uso autorizado. {{uso_autorizado}}\n\nCUARTO: Seguros, mantención, permisos y multas. {{seguros_mantencion}}\n\nQUINTO: Entrega y devolución. {{entrega_devolucion}}\n\nSEXTO: Término, gastos y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 12
  },
  {
    "id": "arriendo_servidumbre_telecom",
    "title": "Arriendo, servidumbre de telecomunicaciones y paso",
    "category": "Arriendos / servidumbres",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "ARRIENDO SERVIDUMBRE.doc"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "propietario",
        "label": "Propietario / constituyente",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "empresa",
        "label": "Empresa arrendataria / beneficiaria",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "predio",
        "label": "Predio afectado",
        "type": "textarea",
        "placeholder": "Ubicación, rol, inscripción, superficie, plano.",
        "required": true,
        "group": "4. Predio"
      },
      {
        "key": "servidumbre",
        "label": "Servidumbre y área afectada",
        "type": "textarea",
        "placeholder": "Telecomunicaciones, paso, trazado, metros, coordenadas, plano, acceso.",
        "required": true,
        "group": "5. Servidumbre"
      },
      {
        "key": "canon",
        "label": "Canon o renta",
        "type": "textarea",
        "placeholder": "Monto, reajuste, periodicidad, forma de pago.",
        "required": true,
        "group": "6. Pago"
      },
      {
        "key": "plazo",
        "label": "Plazo",
        "type": "textarea",
        "placeholder": "Duración, renovación, término.",
        "required": true,
        "group": "6. Pago"
      },
      {
        "key": "obras",
        "label": "Obras, instalaciones y mantención",
        "type": "textarea",
        "placeholder": "Antenas, ductos, caminos, energía, mantención, retiro.",
        "required": true,
        "group": "7. Obras"
      },
      {
        "key": "indemnidad",
        "label": "Responsabilidad, seguros e indemnidad",
        "type": "textarea",
        "placeholder": "Daños, seguridad, seguros, permisos, responsabilidad ambiental.",
        "required": false,
        "group": "7. Obras"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Dominio vigente",
      "Plano de servidumbre",
      "Autorizaciones comunitarias/indígenas si aplica",
      "Permisos técnicos/municipales"
    ],
    "body": "CONTRATO DE ARRIENDO, SERVIDUMBRE DE TELECOMUNICACIONES Y SERVIDUMBRE DE PASO\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen {{comparecientes}}.\n\nPRIMERO: Predio. {{predio}}\n\nSEGUNDO: Constitución y objeto. El propietario constituye en favor de {{empresa}} la siguiente servidumbre y/o arriendo: {{servidumbre}}.\n\nTERCERO: Canon y plazo. Canon/renta: {{canon}}. Plazo: {{plazo}}.\n\nCUARTO: Obras e instalaciones. {{obras}}\n\nQUINTO: Responsabilidad. {{indemnidad}}\n\nSEXTO: Gastos, inscripción y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 13
  },
  {
    "id": "resciliacion_arriendo",
    "title": "Resciliación de contrato de arrendamiento",
    "category": "Arriendos / término",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "resciliacion arriendo lehker lehker.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "arrendador",
        "label": "Arrendador",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "arrendatario",
        "label": "Arrendatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "contrato_original",
        "label": "Contrato original",
        "type": "textarea",
        "placeholder": "Fecha, notaría/repertorio si fue escritura pública, inmueble, partes.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "fecha_termino",
        "label": "Fecha efectiva de término",
        "type": "text",
        "placeholder": "Fecha desde la cual queda sin efecto.",
        "required": true,
        "group": "4. Término"
      },
      {
        "key": "estado_cuentas",
        "label": "Estado de pagos, rentas, servicios y garantía",
        "type": "textarea",
        "placeholder": "Rentas pagadas/adeudadas, garantía, servicios, indemnizaciones.",
        "required": true,
        "group": "5. Liquidación"
      },
      {
        "key": "restitucion",
        "label": "Restitución del inmueble/bien",
        "type": "textarea",
        "placeholder": "Entrega de llaves, acta, inventario, estado, saldos.",
        "required": false,
        "group": "5. Liquidación"
      },
      {
        "key": "finiquito",
        "label": "Finiquito y renuncias",
        "type": "textarea",
        "placeholder": "Mutuo finiquito, reserva de acciones, deudas pendientes.",
        "required": false,
        "group": "6. Finiquito"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Contrato original",
      "Acta de entrega",
      "Estado de cuentas",
      "Comprobantes de pago"
    ],
    "body": "RESCILIACIÓN DE CONTRATO DE ARRENDAMIENTO\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{arrendador}} y {{arrendatario}}.\n\nPRIMERO: Antecedentes. Las partes celebraron el contrato siguiente: {{contrato_original}}.\n\nSEGUNDO: Resciliación. Por este acto, de común acuerdo, las partes rescilián y dejan sin efecto el contrato desde {{fecha_termino}}.\n\nTERCERO: Estado de cuentas. {{estado_cuentas}}\n\nCUARTO: Restitución. {{restitucion}}\n\nQUINTO: Finiquito y reservas. {{finiquito}}\n\nSEXTO: Gastos y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 14
  },
  {
    "id": "termino_finiquito_arriendo",
    "title": "Término y finiquito de contrato de arrendamiento",
    "category": "Arriendos / término",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "TÉRMINO CTTO ARRIENDO.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "arrendador",
        "label": "Arrendador",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "arrendatario",
        "label": "Arrendatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "contrato_original",
        "label": "Contrato original",
        "type": "textarea",
        "placeholder": "Fecha, objeto, partes, notaría si procede.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "causal_termino",
        "label": "Causal o acuerdo de término",
        "type": "textarea",
        "placeholder": "Mutuo acuerdo, vencimiento, incumplimiento, restitución voluntaria.",
        "required": true,
        "group": "4. Término"
      },
      {
        "key": "fecha_termino",
        "label": "Fecha de término",
        "type": "text",
        "placeholder": "Fecha exacta.",
        "required": true,
        "group": "4. Término"
      },
      {
        "key": "liquidacion",
        "label": "Liquidación de obligaciones",
        "type": "textarea",
        "placeholder": "Rentas, servicios, garantía, daños, saldos, documentos.",
        "required": true,
        "group": "5. Finiquito"
      },
      {
        "key": "finiquito",
        "label": "Finiquito",
        "type": "textarea",
        "placeholder": "Amplio y total finiquito o reservas.",
        "required": false,
        "group": "5. Finiquito"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Contrato original",
      "Acta de restitución",
      "Comprobantes",
      "Reserva de acciones si existe deuda"
    ],
    "body": "TÉRMINO Y FINIQUITO DE CONTRATO DE ARRENDAMIENTO\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{arrendador}} y {{arrendatario}}.\n\nPRIMERO: Contrato original. {{contrato_original}}\n\nSEGUNDO: Término. Las partes declaran terminado el contrato por: {{causal_termino}}, con fecha efectiva {{fecha_termino}}.\n\nTERCERO: Liquidación. {{liquidacion}}\n\nCUARTO: Finiquito. {{finiquito}}\n\nQUINTO: Cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 15
  },
  {
    "id": "cesion_derechos",
    "title": "Cesión de derechos",
    "category": "Cesiones / derechos",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "CESION DE DERECHOS _.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "cedente",
        "label": "Cedente",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "cesionario",
        "label": "Cesionario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "derechos",
        "label": "Derechos objeto de cesión",
        "type": "textarea",
        "placeholder": "Naturaleza, porcentaje/cuota, origen, título, inscripción si procede.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "precio",
        "label": "Precio o causa",
        "type": "textarea",
        "placeholder": "Precio, gratuidad, dación, compensación u otra causa.",
        "required": true,
        "group": "5. Precio"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, cuotas, compensación, saldo.",
        "required": false,
        "group": "5. Precio"
      },
      {
        "key": "notificacion",
        "label": "Notificación o aceptación",
        "type": "textarea",
        "placeholder": "Notificación al deudor, aceptación, inscripción o subinscripción si procede.",
        "required": false,
        "group": "6. Efectos"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Título de los derechos",
      "Identificación de deudor o bien asociado",
      "Revisar necesidad de notificación/inscripción"
    ],
    "body": "CESIÓN DE DERECHOS\n{{cedente}}\nA\n{{cesionario}}\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen {{comparecientes}}.\n\nPRIMERO: Antecedentes. El cedente declara ser titular de los siguientes derechos: {{derechos}}.\n\nSEGUNDO: Cesión. Por este acto, cede y transfiere a {{cesionario}} los derechos indicados.\n\nTERCERO: Precio o causa. {{precio}} Forma de pago: {{forma_pago}}.\n\nCUARTO: Notificación, inscripción y efectos. {{notificacion}}\n\nQUINTO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 16
  },
  {
    "id": "cesion_derecho_real_herencia",
    "title": "Cesión del derecho real de herencia",
    "category": "Cesiones / herencia",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "CESIÓN DEL DERECHO REAL DE HERENCIA.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "cedente",
        "label": "Cedente",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "cesionario",
        "label": "Cesionario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "derechos",
        "label": "Derechos objeto de cesión",
        "type": "textarea",
        "placeholder": "Naturaleza, porcentaje/cuota, origen, título, inscripción si procede.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "precio",
        "label": "Precio o causa",
        "type": "textarea",
        "placeholder": "Precio, gratuidad, dación, compensación u otra causa.",
        "required": true,
        "group": "5. Precio"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, cuotas, compensación, saldo.",
        "required": false,
        "group": "5. Precio"
      },
      {
        "key": "causante",
        "label": "Causante",
        "type": "textarea",
        "placeholder": "Nombre, RUT, fecha defunción, último domicilio.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "posesion_efectiva",
        "label": "Posesión efectiva / antecedentes sucesorios",
        "type": "textarea",
        "placeholder": "Resolución, inscripción, Registro Civil, testamento, inventario si existe.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "herederos",
        "label": "Herederos y cuota cedida",
        "type": "textarea",
        "placeholder": "Individualizar herederos, cuota o derechos hereditarios que se ceden.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Certificado defunción",
      "Posesión efectiva",
      "Certificados nacimiento/matrimonio si procede",
      "Inventario de bienes",
      "Certificado pago/exención impuesto herencia si corresponde"
    ],
    "body": "CESIÓN DEL DERECHO REAL DE HERENCIA\n{{cedente}}\nA\n{{cesionario}}\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen: {{comparecientes}}\n\nPRIMERO: Causante y herencia. La cesión se refiere a la herencia quedada al fallecimiento de {{causante}}. Antecedentes de posesión efectiva/sucesión: {{posesion_efectiva}}.\n\nSEGUNDO: Derechos cedidos. El cedente cede a la cesionaria los derechos hereditarios siguientes: {{derechos}}. Herederos/cuota: {{herederos}}.\n\nTERCERO: Precio o causa. {{precio}}. Forma de pago: {{forma_pago}}.\n\nCUARTO: Inscripciones, subinscripciones y trámites. Las partes solicitarán las inscripciones y anotaciones que procedan.\n\nQUINTO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 17
  },
  {
    "id": "constitucion_usufructo",
    "title": "Constitución de derecho de usufructo",
    "category": "Cesiones / usufructo",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "2260 D° DE USUFRUCTO ELVIRA LEPIN.doc"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "constituyente",
        "label": "Constituyente / propietario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "usufructuario",
        "label": "Usufructuario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "bien",
        "label": "Bien sobre el cual recae el usufructo",
        "type": "textarea",
        "placeholder": "Inmueble, derechos, acciones; descripción, inscripción, rol, deslindes.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "modalidad",
        "label": "Modalidad del usufructo",
        "type": "textarea",
        "placeholder": "Vitalicio, temporal, gratuito, oneroso; fecha de inicio/término.",
        "required": true,
        "group": "5. Usufructo"
      },
      {
        "key": "facultades",
        "label": "Facultades de uso y goce",
        "type": "textarea",
        "placeholder": "Uso, frutos, administración, prohibiciones, terceros.",
        "required": true,
        "group": "5. Usufructo"
      },
      {
        "key": "cargas",
        "label": "Cargas y obligaciones",
        "type": "textarea",
        "placeholder": "Contribuciones, mantención, reparaciones, seguros, inventario, caución si aplica.",
        "required": false,
        "group": "6. Cargas"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Título de dominio",
      "Inscripción CBR si es inmueble",
      "Definir plazo/vitalicio",
      "Definir cargas, inventario y caución"
    ],
    "body": "CONSTITUCIÓN DE DERECHO DE USUFRUCTO\n{{constituyente}}\nA\n{{usufructuario}}\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen {{comparecientes}}.\n\nPRIMERO: Dominio y bien afecto. El constituyente declara ser titular del siguiente bien o derecho: {{bien}}.\n\nSEGUNDO: Constitución. Por este acto constituye derecho de usufructo en favor de {{usufructuario}}, bajo la modalidad siguiente: {{modalidad}}.\n\nTERCERO: Facultades. {{facultades}}\n\nCUARTO: Cargas y obligaciones. {{cargas}}\n\nQUINTO: Inscripción y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 18
  },
  {
    "id": "renuncia_usufructo",
    "title": "Renuncia de usufructo",
    "category": "Cesiones / usufructo",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "RENUNCIA DE USUFRUCTO-RICARDO ROA SILVA.doc"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "usufructuario",
        "label": "Usufructuario renunciante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "nudo_propietario",
        "label": "Nudo propietario / propietario consolidado",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "usufructo_origen",
        "label": "Origen del usufructo",
        "type": "textarea",
        "placeholder": "Escritura, inscripción, fecha, repertorio, CBR.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "bien",
        "label": "Bien afecto",
        "type": "textarea",
        "placeholder": "Descripción inmueble/derechos, rol, inscripción.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "declaracion_renuncia",
        "label": "Declaración de renuncia",
        "type": "textarea",
        "placeholder": "Renuncia pura y simple, gratuita u onerosa, aceptación del nudo propietario.",
        "required": true,
        "group": "5. Renuncia"
      },
      {
        "key": "inscripcion_cancelacion",
        "label": "Cancelación / subinscripción",
        "type": "textarea",
        "placeholder": "Instrucciones al CBR para cancelar inscripción de usufructo.",
        "required": false,
        "group": "6. Inscripción"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Inscripción del usufructo",
      "Dominio vigente",
      "Identificación del nudo propietario",
      "Instrucción de cancelación CBR"
    ],
    "body": "RENUNCIA DE USUFRUCTO\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparecen {{comparecientes}}.\n\nPRIMERO: Antecedentes. El usufructo tiene su origen en: {{usufructo_origen}}, y recae sobre: {{bien}}.\n\nSEGUNDO: Renuncia. {{usufructuario}} declara renunciar al usufructo en los siguientes términos: {{declaracion_renuncia}}.\n\nTERCERO: Consolidación e inscripción. {{nudo_propietario}} acepta, si corresponde, la consolidación del dominio. {{inscripcion_cancelacion}}\n\nCUARTO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 19
  },
  {
    "id": "permuta",
    "title": "Permuta",
    "category": "Contratos patrimoniales",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "PERMUTA.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "permutante_uno",
        "label": "Permutante uno",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "permutante_dos",
        "label": "Permutante dos",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "bien_uno",
        "label": "Bien que entrega el permutante uno",
        "type": "textarea",
        "placeholder": "Descripción, dominio, inscripción, valor asignado.",
        "required": true,
        "group": "4. Bienes"
      },
      {
        "key": "bien_dos",
        "label": "Bien que entrega el permutante dos",
        "type": "textarea",
        "placeholder": "Descripción, dominio, inscripción, valor asignado.",
        "required": true,
        "group": "4. Bienes"
      },
      {
        "key": "diferencia_precio",
        "label": "Diferencia de precio / alcance",
        "type": "textarea",
        "placeholder": "Si hay saldo, monto, forma de pago, plazo.",
        "required": false,
        "group": "5. Precio"
      },
      {
        "key": "entrega",
        "label": "Entrega y tradición",
        "type": "textarea",
        "placeholder": "Entrega material, inscripción, plazos.",
        "required": false,
        "group": "6. Entrega"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Títulos de dominio de ambos bienes",
      "Avalúos/valores",
      "Gravámenes",
      "Forma de enterar diferencia"
    ],
    "body": "PERMUTA\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{permutante_uno}} y {{permutante_dos}}.\n\nPRIMERO: Bienes permutados. El permutante uno entrega: {{bien_uno}}. El permutante dos entrega: {{bien_dos}}.\n\nSEGUNDO: Permuta. Las partes permutan los bienes individualizados, obligándose a efectuar las tradiciones, inscripciones y entregas correspondientes.\n\nTERCERO: Diferencia de valores. {{diferencia_precio}}\n\nCUARTO: Entrega. {{entrega}}\n\nQUINTO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 20
  },
  {
    "id": "dacion_pago",
    "title": "Dación en pago",
    "category": "Contratos patrimoniales",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "dacion pago MARIA GAJARDO-PEDRO GAJARDO.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "deudor",
        "label": "Deudor / dador en pago",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "acreedor",
        "label": "Acreedor / receptor",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "obligacion",
        "label": "Obligación que se extingue",
        "type": "textarea",
        "placeholder": "Origen de la deuda, monto, documento, vencimiento.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "bien_dado_pago",
        "label": "Bien o derecho dado en pago",
        "type": "textarea",
        "placeholder": "Descripción, dominio, inscripción, valor asignado.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "avaluacion",
        "label": "Valoración e imputación",
        "type": "textarea",
        "placeholder": "Valor del bien y si extingue total o parcialmente la deuda.",
        "required": true,
        "group": "5. Pago"
      },
      {
        "key": "saldo",
        "label": "Saldo pendiente o finiquito",
        "type": "textarea",
        "placeholder": "Indicar si queda saldo, condonación o finiquito total.",
        "required": false,
        "group": "5. Pago"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Documento que acredita deuda",
      "Título/dominio del bien",
      "Valor asignado",
      "Revisar efectos tributarios"
    ],
    "body": "DACIÓN EN PAGO\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{deudor}} y {{acreedor}}.\n\nPRIMERO: Obligación. El deudor mantiene la siguiente obligación respecto del acreedor: {{obligacion}}.\n\nSEGUNDO: Dación. Para pagar total o parcialmente dicha obligación, el deudor da en pago el siguiente bien o derecho: {{bien_dado_pago}}.\n\nTERCERO: Valoración e imputación. {{avaluacion}}\n\nCUARTO: Saldo o finiquito. {{saldo}}\n\nQUINTO: Gastos, inscripción y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 21
  },
  {
    "id": "transaccion",
    "title": "Transacción / acuerdo extrajudicial",
    "category": "Contratos patrimoniales",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "Notaria-Transaccion.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "parte_uno",
        "label": "Parte uno",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "parte_dos",
        "label": "Parte dos",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "controversia",
        "label": "Controversia o conflicto",
        "type": "textarea",
        "placeholder": "Hechos, contrato, deuda, causa judicial, accidente, reclamo.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "prestaciones",
        "label": "Prestaciones recíprocas",
        "type": "textarea",
        "placeholder": "Pago, entrega, obligación de hacer/no hacer, desistimiento, reparación.",
        "required": true,
        "group": "4. Acuerdo"
      },
      {
        "key": "plazos",
        "label": "Plazos y cumplimiento",
        "type": "textarea",
        "placeholder": "Cuotas, fechas, condiciones, lugar de pago.",
        "required": true,
        "group": "5. Cumplimiento"
      },
      {
        "key": "finiquito_renuncia",
        "label": "Finiquito, renuncias y reserva de acciones",
        "type": "textarea",
        "placeholder": "Amplio finiquito o reservas expresas.",
        "required": false,
        "group": "6. Cierre"
      },
      {
        "key": "clausula_incumplimiento",
        "label": "Incumplimiento",
        "type": "textarea",
        "placeholder": "Cláusula penal, aceleración, mérito ejecutivo si corresponde.",
        "required": false,
        "group": "6. Cierre"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Identificar conflicto",
      "Verificar capacidad para transigir",
      "No transigir materias indisponibles",
      "Definir incumplimiento claramente"
    ],
    "body": "CONTRATO DE TRANSACCIÓN\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{parte_uno}} y {{parte_dos}}.\n\nPRIMERO: Antecedentes. Las partes mantienen o han mantenido la siguiente controversia: {{controversia}}.\n\nSEGUNDO: Transacción. Para precaver o poner término al conflicto, acuerdan las siguientes prestaciones: {{prestaciones}}.\n\nTERCERO: Plazos y cumplimiento. {{plazos}}\n\nCUARTO: Incumplimiento. {{clausula_incumplimiento}}\n\nQUINTO: Finiquito y renuncias. {{finiquito_renuncia}}\n\nSEXTO: Gastos y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 22
  },
  {
    "id": "pagare",
    "title": "Pagaré",
    "category": "Obligaciones de dinero",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "PAGARE CARO.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "suscriptor",
        "label": "Suscriptor/deudor",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "beneficiario",
        "label": "Beneficiario/acreedor",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "monto",
        "label": "Monto",
        "type": "text",
        "placeholder": "Monto en números y palabras; moneda/unidad.",
        "required": true,
        "group": "3. Obligación"
      },
      {
        "key": "fecha_vencimiento",
        "label": "Vencimiento",
        "type": "textarea",
        "placeholder": "Fecha exacta, a la vista, cuotas, vencimientos sucesivos.",
        "required": true,
        "group": "3. Obligación"
      },
      {
        "key": "intereses",
        "label": "Intereses y reajustes",
        "type": "textarea",
        "placeholder": "Tasa, reajuste, mora, máximo convencional si aplica.",
        "required": false,
        "group": "3. Obligación"
      },
      {
        "key": "lugar_pago",
        "label": "Lugar y forma de pago",
        "type": "textarea",
        "placeholder": "Cuenta, domicilio, transferencia, cuotas.",
        "required": true,
        "group": "4. Pago"
      },
      {
        "key": "protesto",
        "label": "Protesto y cobranza",
        "type": "textarea",
        "placeholder": "Cláusula sin obligación de protesto o reglas de cobranza, gastos.",
        "required": false,
        "group": "5. Cobranza"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Monto en palabras y números",
      "Vencimiento claro",
      "Firma autorizada si se requiere",
      "Impuesto de timbres si corresponde"
    ],
    "body": "PAGARÉ\n\nEn {{ciudad}}, a {{fecha_texto}}, {{suscriptor}} declara deber y se obliga a pagar a {{beneficiario}}, o a su orden, la suma de {{monto}}.\n\nPRIMERO: Vencimiento. {{fecha_vencimiento}}\n\nSEGUNDO: Lugar y forma de pago. {{lugar_pago}}\n\nTERCERO: Intereses, reajustes y mora. {{intereses}}\n\nCUARTO: Protesto, cobranza y gastos. {{protesto}}\n\nQUINTO: Cierre. {{identidad}} {{clausulas_especiales}}",
    "number": 23
  },
  {
    "id": "mandato_general_amplio",
    "title": "Mandato general amplio",
    "category": "Mandatos y poderes",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MANDATO GENERAL AMPLIO.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "mandante",
        "label": "Mandante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "mandatario",
        "label": "Mandatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "facultades",
        "label": "Facultades conferidas",
        "type": "textarea",
        "placeholder": "Enumerar de forma expresa las facultades: administrar, vender, comprar, firmar, cobrar, representar, transigir, etc.",
        "required": true,
        "group": "4. Facultades"
      },
      {
        "key": "bienes_asociados",
        "label": "Bienes, asuntos o trámites asociados",
        "type": "textarea",
        "placeholder": "Inmuebles, vehículos, juicio, cuenta, institución, trámite, posesión efectiva.",
        "required": false,
        "group": "5. Objeto"
      },
      {
        "key": "vigencia",
        "label": "Vigencia / revocabilidad",
        "type": "textarea",
        "placeholder": "Indefinido, hasta término de gestión, fecha; posibilidad de revocación.",
        "required": false,
        "group": "6. Vigencia"
      },
      {
        "key": "rendicion",
        "label": "Rendición de cuentas / limitaciones",
        "type": "textarea",
        "placeholder": "Obligación de rendir cuenta, límites, prohibiciones.",
        "required": false,
        "group": "6. Vigencia"
      },
      {
        "key": "facultades_especiales",
        "label": "Facultades especiales expresas",
        "type": "textarea",
        "placeholder": "Vender, hipotecar, transigir, percibir, firmar escrituras, delegar, autocontratar si procede.",
        "required": true,
        "group": "4. Facultades"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Identidad mandante/mandatario",
      "Facultades especiales deben ser expresas",
      "Definir autocontratación/delegación si se permitirá"
    ],
    "body": "MANDATO GENERAL AMPLIO\n{{mandante}}\nA\n{{mandatario}}\n\nEn {{ciudad}}, a {{fecha_texto}}, ante {{notario_nombre}}, comparece {{mandante}}, quien confiere mandato general amplio a {{mandatario}}.\n\nPRIMERO: Facultades generales. El mandatario podrá representar al mandante en toda clase de actos, contratos, gestiones judiciales, extrajudiciales, administrativas, bancarias y patrimoniales, dentro de los límites legales y de este mandato.\n\nSEGUNDO: Facultades especiales. {{facultades_especiales}}\n\nTERCERO: Bienes o asuntos asociados. {{bienes_asociados}}\n\nCUARTO: Vigencia, rendición y limitaciones. {{vigencia}} {{rendicion}}\n\nQUINTO: Personerías y cierre. {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 24
  },
  {
    "id": "mandato_especial_compra",
    "title": "Mandato especial para comprar",
    "category": "Mandatos y poderes",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MANDATO ESPECIAL COMPRA.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "mandante",
        "label": "Mandante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "mandatario",
        "label": "Mandatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "facultades",
        "label": "Facultades conferidas",
        "type": "textarea",
        "placeholder": "Enumerar de forma expresa las facultades: administrar, vender, comprar, firmar, cobrar, representar, transigir, etc.",
        "required": true,
        "group": "4. Facultades"
      },
      {
        "key": "bienes_asociados",
        "label": "Bienes, asuntos o trámites asociados",
        "type": "textarea",
        "placeholder": "Inmuebles, vehículos, juicio, cuenta, institución, trámite, posesión efectiva.",
        "required": false,
        "group": "5. Objeto"
      },
      {
        "key": "vigencia",
        "label": "Vigencia / revocabilidad",
        "type": "textarea",
        "placeholder": "Indefinido, hasta término de gestión, fecha; posibilidad de revocación.",
        "required": false,
        "group": "6. Vigencia"
      },
      {
        "key": "rendicion",
        "label": "Rendición de cuentas / limitaciones",
        "type": "textarea",
        "placeholder": "Obligación de rendir cuenta, límites, prohibiciones.",
        "required": false,
        "group": "6. Vigencia"
      },
      {
        "key": "bien_a_comprar",
        "label": "Bien que se autoriza comprar",
        "type": "textarea",
        "placeholder": "Inmueble/vehículo/derecho, precio máximo, ubicación, condiciones.",
        "required": true,
        "group": "5. Objeto"
      },
      {
        "key": "precio_maximo",
        "label": "Precio máximo y financiamiento",
        "type": "textarea",
        "placeholder": "Monto máximo, crédito, subsidio, pago al contado, firma de instrucciones.",
        "required": false,
        "group": "5. Objeto"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Identificar bien",
      "Definir precio máximo",
      "Definir facultades de firmar escritura y pagar"
    ],
    "body": "MANDATO ESPECIAL PARA COMPRAR\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{mandante}}, quien confiere mandato especial a {{mandatario}} para comprar el siguiente bien o derecho: {{bien_a_comprar}}.\n\nPRIMERO: Facultades. {{facultades}}\n\nSEGUNDO: Precio y financiamiento. {{precio_maximo}}\n\nTERCERO: Documentos e inscripciones. El mandatario queda facultado para firmar escrituras, minutas, formularios, solicitudes, instrucciones notariales y documentos necesarios para la operación, según las facultades conferidas.\n\nCUARTO: Vigencia y límites. {{vigencia}} {{rendicion}}\n\nQUINTO: Cierre. {{identidad}} {{personerias}} {{clausulas_especiales}}",
    "number": 25
  },
  {
    "id": "mandato_administracion",
    "title": "Mandato especial de administración",
    "category": "Mandatos y poderes",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MANDATO DE ADMINISTRACIÓN.docx",
      "MANDATO ESPECIAL DE ADMINISTRACIÓN.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "mandante",
        "label": "Mandante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "mandatario",
        "label": "Mandatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "facultades",
        "label": "Facultades conferidas",
        "type": "textarea",
        "placeholder": "Enumerar de forma expresa las facultades: administrar, vender, comprar, firmar, cobrar, representar, transigir, etc.",
        "required": true,
        "group": "4. Facultades"
      },
      {
        "key": "bienes_asociados",
        "label": "Bienes, asuntos o trámites asociados",
        "type": "textarea",
        "placeholder": "Inmuebles, vehículos, juicio, cuenta, institución, trámite, posesión efectiva.",
        "required": false,
        "group": "5. Objeto"
      },
      {
        "key": "vigencia",
        "label": "Vigencia / revocabilidad",
        "type": "textarea",
        "placeholder": "Indefinido, hasta término de gestión, fecha; posibilidad de revocación.",
        "required": false,
        "group": "6. Vigencia"
      },
      {
        "key": "rendicion",
        "label": "Rendición de cuentas / limitaciones",
        "type": "textarea",
        "placeholder": "Obligación de rendir cuenta, límites, prohibiciones.",
        "required": false,
        "group": "6. Vigencia"
      },
      {
        "key": "propiedades",
        "label": "Propiedades o bienes a administrar",
        "type": "textarea",
        "placeholder": "Dirección, rol, inscripción, arrendatarios, cuentas, gastos.",
        "required": true,
        "group": "5. Objeto"
      },
      {
        "key": "facultades_cobro",
        "label": "Facultades de cobro y pago",
        "type": "textarea",
        "placeholder": "Cobrar rentas, pagar servicios/contribuciones, contratar reparaciones, firmar recibos.",
        "required": true,
        "group": "4. Facultades"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Individualizar bienes",
      "Definir autorización para arrendar/subarrendar",
      "Definir límites de gasto y rendición"
    ],
    "body": "MANDATO ESPECIAL DE ADMINISTRACIÓN\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{mandante}}, quien confiere mandato especial de administración a {{mandatario}} respecto de: {{propiedades}}.\n\nPRIMERO: Facultades de administración. {{facultades}}\n\nSEGUNDO: Cobros, pagos y reparaciones. {{facultades_cobro}}\n\nTERCERO: Limitaciones y rendición de cuentas. {{rendicion}}\n\nCUARTO: Vigencia. {{vigencia}}\n\nQUINTO: Cierre. {{identidad}} {{personerias}} {{clausulas_especiales}}",
    "number": 26
  },
  {
    "id": "mandato_admin_representacion_corporacion",
    "title": "Mandato especial de administración y representación legal",
    "category": "Mandatos y poderes",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MANDATO ESPECIAL DE ADMINISTRACIÓN.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "mandante",
        "label": "Mandante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "mandatario",
        "label": "Mandatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "facultades",
        "label": "Facultades conferidas",
        "type": "textarea",
        "placeholder": "Enumerar de forma expresa las facultades: administrar, vender, comprar, firmar, cobrar, representar, transigir, etc.",
        "required": true,
        "group": "4. Facultades"
      },
      {
        "key": "bienes_asociados",
        "label": "Bienes, asuntos o trámites asociados",
        "type": "textarea",
        "placeholder": "Inmuebles, vehículos, juicio, cuenta, institución, trámite, posesión efectiva.",
        "required": false,
        "group": "5. Objeto"
      },
      {
        "key": "vigencia",
        "label": "Vigencia / revocabilidad",
        "type": "textarea",
        "placeholder": "Indefinido, hasta término de gestión, fecha; posibilidad de revocación.",
        "required": false,
        "group": "6. Vigencia"
      },
      {
        "key": "rendicion",
        "label": "Rendición de cuentas / limitaciones",
        "type": "textarea",
        "placeholder": "Obligación de rendir cuenta, límites, prohibiciones.",
        "required": false,
        "group": "6. Vigencia"
      },
      {
        "key": "entidad",
        "label": "Entidad representada",
        "type": "textarea",
        "placeholder": "Corporación, sociedad, fundación u organización: nombre, RUT, personería, cargo.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "acuerdo_organo",
        "label": "Acuerdo del órgano competente",
        "type": "textarea",
        "placeholder": "Acta, directorio, asamblea, fecha, facultades aprobadas.",
        "required": false,
        "group": "3. Partes"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Revisar estatutos",
      "Acta o acuerdo de directorio/asamblea",
      "Certificado de vigencia de personalidad jurídica"
    ],
    "body": "MANDATO ESPECIAL DE ADMINISTRACIÓN Y REPRESENTACIÓN\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{mandante}}, en representación de {{entidad}}, y confiere mandato especial a {{mandatario}}.\n\nPRIMERO: Personería y acuerdo. {{personerias}} {{acuerdo_organo}}\n\nSEGUNDO: Facultades. {{facultades}}\n\nTERCERO: Objeto y trámites asociados. {{bienes_asociados}}\n\nCUARTO: Vigencia, límites y rendición. {{vigencia}} {{rendicion}}\n\nQUINTO: Cierre. {{identidad}} {{clausulas_especiales}}",
    "number": 27
  },
  {
    "id": "mandato_judicial",
    "title": "Mandato judicial",
    "category": "Mandatos judiciales",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MANDATO JUDICIAL DIVORCIO.doc",
      "MODELO DE MANDATO JUDICIAL A SOCIEDAD.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "mandante",
        "label": "Mandante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "abogado_mandatario",
        "label": "Abogado/mandatario judicial",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "juicio_materia",
        "label": "Juicio o materia",
        "type": "textarea",
        "placeholder": "Materia, tribunal, RIT/Rol si existe, contraparte, etapa.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "facultades_judiciales",
        "label": "Facultades judiciales",
        "type": "textarea",
        "placeholder": "Patrocinar, representar, contestar, transigir, percibir, desistirse, sustituir, delegar, absolver posiciones si procede.",
        "required": true,
        "group": "5. Facultades"
      },
      {
        "key": "domicilio_notificaciones",
        "label": "Domicilio/correo para notificaciones",
        "type": "textarea",
        "placeholder": "Domicilio, correo, oficina, poder judicial virtual.",
        "required": false,
        "group": "6. Notificaciones"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Verificar habilitación abogado",
      "Facultades especiales deben otorgarse expresamente",
      "Poder Judicial Virtual si aplica"
    ],
    "body": "MANDATO JUDICIAL\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{mandante}}, quien confiere mandato judicial a {{abogado_mandatario}}.\n\nPRIMERO: Objeto. El mandato se confiere para representar al mandante en: {{juicio_materia}}.\n\nSEGUNDO: Facultades. {{facultades_judiciales}}\n\nTERCERO: Notificaciones. {{domicilio_notificaciones}}\n\nCUARTO: Vigencia y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 28
  },
  {
    "id": "mandato_judicial_especial",
    "title": "Mandato judicial y especial",
    "category": "Mandatos judiciales",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MANDATO JUDICIAL ESPECIAL.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "mandante",
        "label": "Mandante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "mandatario",
        "label": "Mandatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "materia",
        "label": "Materia específica",
        "type": "textarea",
        "placeholder": "Juicio, trámite, negociación, institución, rol, partes.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "facultades",
        "label": "Facultades judiciales y especiales",
        "type": "textarea",
        "placeholder": "Comparecer, demandar, contestar, transigir, percibir, desistirse, firmar documentos, solicitar copias.",
        "required": true,
        "group": "5. Facultades"
      },
      {
        "key": "limitaciones",
        "label": "Limitaciones",
        "type": "textarea",
        "placeholder": "Actos que no puede realizar o requieren autorización expresa.",
        "required": false,
        "group": "6. Límites"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Definir materia exacta",
      "Facultades especiales expresas",
      "Verificar calidad del mandatario"
    ],
    "body": "MANDATO JUDICIAL Y ESPECIAL\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{mandante}}, quien confiere mandato judicial y especial a {{mandatario}}.\n\nPRIMERO: Materia. {{materia}}\n\nSEGUNDO: Facultades. {{facultades}}\n\nTERCERO: Limitaciones. {{limitaciones}}\n\nCUARTO: Cierre. {{identidad}} {{personerias}} {{clausulas_especiales}}",
    "number": 29
  },
  {
    "id": "mandato_divorcio",
    "title": "Mandato especial para divorcio",
    "category": "Mandatos judiciales / familia",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MANDATO JUDICIAL ESPECIAL DIVORCIO.docx",
      "MANDATO JUDICIAL DIVORCIO.doc"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "mandante",
        "label": "Mandante/cónyuge",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "abogado_mandatario",
        "label": "Abogado/mandatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "tipo_divorcio",
        "label": "Tipo de divorcio",
        "type": "textarea",
        "placeholder": "Mutuo acuerdo, unilateral, culposo, cese convivencia, compensación económica.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "facultades_divorcio",
        "label": "Facultades especiales",
        "type": "textarea",
        "placeholder": "Demandar, contestar, conciliar, transigir, percibir, desistirse, acordar compensación, alimentos, cuidado personal, relación directa y regular.",
        "required": true,
        "group": "5. Facultades"
      },
      {
        "key": "antecedentes_familia",
        "label": "Antecedentes familiares",
        "type": "textarea",
        "placeholder": "Matrimonio, hijos, régimen matrimonial, cese convivencia, acuerdos.",
        "required": false,
        "group": "6. Antecedentes"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Certificado matrimonio",
      "Certificados nacimiento hijos",
      "Cese convivencia",
      "Acuerdo completo y suficiente si procede"
    ],
    "body": "MANDATO ESPECIAL PARA DIVORCIO\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{mandante}}, quien confiere mandato especial a {{abogado_mandatario}} para tramitar {{tipo_divorcio}}.\n\nPRIMERO: Facultades. {{facultades_divorcio}}\n\nSEGUNDO: Antecedentes familiares. {{antecedentes_familia}}\n\nTERCERO: Vigencia, gastos y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 30
  },
  {
    "id": "revocacion_mandato_judicial",
    "title": "Revocación de mandato judicial",
    "category": "Mandatos judiciales",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "REVOCACIÓN MANDATO JUDICIAL.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "revocante",
        "label": "Revocante/mandante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "mandatario_revocado",
        "label": "Mandatario revocado",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "mandato_original",
        "label": "Mandato original",
        "type": "textarea",
        "placeholder": "Fecha, notaría, repertorio, materia o juicio.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "nuevo_mandatario",
        "label": "Nuevo mandatario si corresponde",
        "type": "textarea",
        "placeholder": "Individualización del nuevo abogado/mandatario o indicar que no se designa.",
        "required": false,
        "group": "4. Revocación"
      },
      {
        "key": "notificaciones",
        "label": "Notificaciones y comunicaciones",
        "type": "textarea",
        "placeholder": "A quién se notificará: tribunal, abogado, contraparte, institución.",
        "required": false,
        "group": "5. Efectos"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Identificar mandato original",
      "Notificar al tribunal si existe causa",
      "Designar nuevo patrocinio si corresponde"
    ],
    "body": "REVOCACIÓN DE MANDATO JUDICIAL\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{revocante}}.\n\nPRIMERO: Mandato original. El compareciente otorgó mandato a {{mandatario_revocado}} según: {{mandato_original}}.\n\nSEGUNDO: Revocación. Por este acto revoca, en todas sus partes, el mandato indicado.\n\nTERCERO: Nuevo mandatario. {{nuevo_mandatario}}\n\nCUARTO: Notificaciones. {{notificaciones}}\n\nQUINTO: Cierre. {{identidad}} {{clausulas_especiales}}",
    "number": 31
  },
  {
    "id": "carta_poder",
    "title": "Carta poder / poder simple autorizado",
    "category": "Poderes simples",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "Notaria-Carta poder.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "poderdante",
        "label": "Poderdante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "apoderado",
        "label": "Apoderado",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "tramite",
        "label": "Trámite autorizado",
        "type": "textarea",
        "placeholder": "Institución, trámite, documentos a firmar/retirar, facultades específicas.",
        "required": true,
        "group": "4. Objeto"
      },
      {
        "key": "vigencia",
        "label": "Vigencia",
        "type": "text",
        "placeholder": "Hasta fecha o hasta término del trámite.",
        "required": false,
        "group": "5. Vigencia"
      },
      {
        "key": "limitaciones",
        "label": "Limitaciones",
        "type": "textarea",
        "placeholder": "Lo que no puede hacer el apoderado.",
        "required": false,
        "group": "5. Vigencia"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Cédula poderdante",
      "Cédula apoderado",
      "Definir trámite exacto"
    ],
    "body": "CARTA PODER\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{poderdante}}, quien confiere poder especial a {{apoderado}} para realizar el siguiente trámite: {{tramite}}.\n\nVigencia: {{vigencia}}.\nLimitaciones: {{limitaciones}}.\n\n{{identidad}}",
    "number": 32
  },
  {
    "id": "poder_posesion_efectiva",
    "title": "Poder para posesión efectiva",
    "category": "Mandatos y poderes / herencia",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "Notaria-Poder Posesion Efectiva.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "mandante",
        "label": "Mandante/heredero",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "mandatario",
        "label": "Mandatario",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "causante",
        "label": "Causante",
        "type": "textarea",
        "placeholder": "Nombre, RUT, fecha de fallecimiento, último domicilio.",
        "required": true,
        "group": "3. Sucesión"
      },
      {
        "key": "tramites",
        "label": "Trámites autorizados",
        "type": "textarea",
        "placeholder": "Solicitar posesión efectiva, rectificar, acompañar documentos, retirar certificados, pagar derechos, inscribir bienes.",
        "required": true,
        "group": "4. Facultades"
      },
      {
        "key": "bienes_herencia",
        "label": "Bienes de la herencia",
        "type": "textarea",
        "placeholder": "Inmuebles, vehículos, cuentas, derechos, acciones.",
        "required": false,
        "group": "5. Bienes"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Certificado defunción",
      "Certificados nacimiento/matrimonio",
      "Inventario de bienes",
      "Clave Única/Registro Civil si aplica"
    ],
    "body": "PODER ESPECIAL PARA POSESIÓN EFECTIVA\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{mandante}}, quien confiere poder especial a {{mandatario}}.\n\nPRIMERO: Causante. El poder se otorga respecto de la sucesión de {{causante}}.\n\nSEGUNDO: Facultades. {{tramites}}\n\nTERCERO: Bienes o antecedentes conocidos. {{bienes_herencia}}\n\nCUARTO: Vigencia y cierre. {{vigencia}} {{identidad}} {{clausulas_especiales}}",
    "number": 33
  },
  {
    "id": "liquidacion_sc_divorciados",
    "title": "Liquidación de sociedad conyugal - divorciados",
    "category": "Familia / régimen patrimonial",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "LIQUIDACION SC DIVORCIADOS.doc"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "ex_conyuge_uno",
        "label": "Ex cónyuge uno",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "ex_conyuge_dos",
        "label": "Ex cónyuge dos",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "matrimonio_divorcio",
        "label": "Antecedentes de matrimonio y divorcio",
        "type": "textarea",
        "placeholder": "Fecha matrimonio, régimen, sentencia divorcio, inscripción/subinscripción.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "bienes",
        "label": "Bienes sociales",
        "type": "textarea",
        "placeholder": "Inmuebles, vehículos, cuentas, deudas, derechos.",
        "required": true,
        "group": "4. Inventario"
      },
      {
        "key": "adjudicacion",
        "label": "Adjudicación y liquidación",
        "type": "textarea",
        "placeholder": "Qué se adjudica a cada parte, valores, compensaciones, saldos.",
        "required": true,
        "group": "5. Liquidación"
      },
      {
        "key": "deudas",
        "label": "Deudas y pasivos",
        "type": "textarea",
        "placeholder": "Quién asume cada deuda, liberaciones, garantías.",
        "required": false,
        "group": "5. Liquidación"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Certificado matrimonio con subinscripción divorcio",
      "Sentencia divorcio",
      "Inventario valorizado",
      "Dominio y gravámenes de bienes"
    ],
    "body": "LIQUIDACIÓN DE SOCIEDAD CONYUGAL ENTRE DIVORCIADOS\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{ex_conyuge_uno}} y {{ex_conyuge_dos}}.\n\nPRIMERO: Antecedentes. {{matrimonio_divorcio}}\n\nSEGUNDO: Inventario. Los bienes, derechos y deudas de la sociedad conyugal son: {{bienes}}.\n\nTERCERO: Liquidación y adjudicación. {{adjudicacion}}\n\nCUARTO: Pasivos. {{deudas}}\n\nQUINTO: Finiquito y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 34
  },
  {
    "id": "liquidacion_sc_sin_bienes",
    "title": "Separación de bienes y liquidación de sociedad conyugal sin bienes",
    "category": "Familia / régimen patrimonial",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "LIQUIDACION SC SIN BIENES.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "conyuge_uno",
        "label": "Cónyuge uno",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "conyuge_dos",
        "label": "Cónyuge dos",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "antecedentes_matrimonio",
        "label": "Antecedentes del matrimonio",
        "type": "textarea",
        "placeholder": "Fecha, régimen, domicilio, hijos si hay regulación conjunta.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "declaracion_sin_bienes",
        "label": "Declaración de inexistencia de bienes sociales",
        "type": "textarea",
        "placeholder": "Declaración de que no existen bienes ni deudas sociales que liquidar.",
        "required": true,
        "group": "4. Liquidación"
      },
      {
        "key": "relaciones_mutuas",
        "label": "Relaciones mutuas / hijos / acuerdos",
        "type": "textarea",
        "placeholder": "Alimentos, cuidado, relación directa, compensación económica, si procede.",
        "required": false,
        "group": "5. Acuerdos"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Certificado matrimonio",
      "Verificar existencia de bienes/deudas",
      "Acuerdo completo si se usa para divorcio mutuo acuerdo"
    ],
    "body": "SEPARACIÓN DE BIENES, LIQUIDACIÓN DE SOCIEDAD CONYUGAL SIN BIENES Y REGULACIÓN DE RELACIONES MUTUAS\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{conyuge_uno}} y {{conyuge_dos}}.\n\nPRIMERO: Antecedentes. {{antecedentes_matrimonio}}\n\nSEGUNDO: Separación y liquidación. Las partes declaran: {{declaracion_sin_bienes}}.\n\nTERCERO: Relaciones mutuas y familiares. {{relaciones_mutuas}}\n\nCUARTO: Cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 35
  },
  {
    "id": "liquidacion_sc_con_bienes",
    "title": "Liquidación de sociedad conyugal con bienes y adjudicación",
    "category": "Familia / régimen patrimonial",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "LIQUIDACIÓN DE SC CON BIENES.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "conyuge_uno",
        "label": "Cónyuge uno",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "conyuge_dos",
        "label": "Cónyuge dos",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "antecedentes_matrimonio",
        "label": "Antecedentes del matrimonio",
        "type": "textarea",
        "placeholder": "Fecha, régimen, estado actual, hijos si corresponde.",
        "required": true,
        "group": "3. Antecedentes"
      },
      {
        "key": "inventario_activos",
        "label": "Inventario de activos",
        "type": "textarea",
        "placeholder": "Inmuebles, vehículos, cuentas, derechos, acciones, muebles, valores.",
        "required": true,
        "group": "4. Inventario"
      },
      {
        "key": "inventario_pasivos",
        "label": "Inventario de pasivos",
        "type": "textarea",
        "placeholder": "Créditos, deudas, hipotecas, saldos, tarjetas, cargas.",
        "required": false,
        "group": "4. Inventario"
      },
      {
        "key": "adjudicaciones",
        "label": "Adjudicaciones",
        "type": "textarea",
        "placeholder": "A quién se adjudica cada bien, valor, alcance, compensación, saldo.",
        "required": true,
        "group": "5. Liquidación"
      },
      {
        "key": "inscripciones",
        "label": "Inscripciones y subinscripciones",
        "type": "textarea",
        "placeholder": "CBR, Registro Civil, vehículos, alzamientos.",
        "required": false,
        "group": "6. CBR"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Inventario valorizado",
      "Certificados CBR",
      "Gravámenes",
      "Certificados vehículos",
      "Régimen matrimonial",
      "Efectos tributarios"
    ],
    "body": "LIQUIDACIÓN DE SOCIEDAD CONYUGAL CON BIENES Y ADJUDICACIÓN\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{conyuge_uno}} y {{conyuge_dos}}.\n\nPRIMERO: Antecedentes. {{antecedentes_matrimonio}}\n\nSEGUNDO: Inventario de activos. {{inventario_activos}}\n\nTERCERO: Pasivos. {{inventario_pasivos}}\n\nCUARTO: Liquidación y adjudicaciones. {{adjudicaciones}}\n\nQUINTO: Inscripciones. {{inscripciones}}\n\nSEXTO: Gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 36
  },
  {
    "id": "constitucion_srl",
    "title": "Constitución de sociedad de responsabilidad limitada",
    "category": "Sociedades y acciones",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "MODELO DE CONSTITUCION DE SOCIEDAD RESPNSABILIDAD LIMITADA.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "socios",
        "label": "Socios",
        "type": "textarea",
        "placeholder": "Individualización completa de cada socio y porcentaje/participación.",
        "required": true,
        "group": "3. Socios"
      },
      {
        "key": "razon_social",
        "label": "Razón social",
        "type": "text",
        "placeholder": "Nombre o razón social propuesta.",
        "required": true,
        "group": "4. Sociedad"
      },
      {
        "key": "objeto",
        "label": "Objeto social",
        "type": "textarea",
        "placeholder": "Giro y actividades permitidas.",
        "required": true,
        "group": "4. Sociedad"
      },
      {
        "key": "capital",
        "label": "Capital social",
        "type": "textarea",
        "placeholder": "Monto total, aportes, forma de pago, cuotas o derechos.",
        "required": true,
        "group": "5. Capital"
      },
      {
        "key": "administracion",
        "label": "Administración y uso de razón social",
        "type": "textarea",
        "placeholder": "Quién administra, facultades, limitaciones, firma social.",
        "required": true,
        "group": "6. Administración"
      },
      {
        "key": "duracion_domicilio",
        "label": "Duración y domicilio",
        "type": "textarea",
        "placeholder": "Domicilio, duración, prórroga, sucursales.",
        "required": true,
        "group": "4. Sociedad"
      },
      {
        "key": "utilidades",
        "label": "Utilidades y pérdidas",
        "type": "textarea",
        "placeholder": "Distribución, retiros, balances.",
        "required": false,
        "group": "7. Reglas internas"
      },
      {
        "key": "cesion_derechos_sociales",
        "label": "Cesión de derechos sociales",
        "type": "textarea",
        "placeholder": "Restricciones, preferencia, consentimiento.",
        "required": false,
        "group": "7. Reglas internas"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Verificar nombre/razón social",
      "Definir objeto amplio pero claro",
      "Capital y aportes",
      "Administración y facultades",
      "Publicación/inscripción si corresponde"
    ],
    "body": "CONSTITUCIÓN DE SOCIEDAD DE RESPONSABILIDAD LIMITADA\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen: {{socios}}.\n\nPRIMERO: Constitución y razón social. Los comparecientes constituyen una sociedad de responsabilidad limitada denominada {{razon_social}}.\n\nSEGUNDO: Objeto. {{objeto}}\n\nTERCERO: Domicilio y duración. {{duracion_domicilio}}\n\nCUARTO: Capital. {{capital}}\n\nQUINTO: Administración y uso de la razón social. {{administracion}}\n\nSEXTO: Utilidades, pérdidas y balances. {{utilidades}}\n\nSÉPTIMO: Cesión de derechos sociales. {{cesion_derechos_sociales}}\n\nOCTAVO: Personerías, gastos y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 37
  },
  {
    "id": "compraventa_acciones",
    "title": "Contrato de compraventa de acciones",
    "category": "Sociedades y acciones",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "CONTRATO DE COMPRAVENTA DE ACCIONES ASOCIACIÓN CHILENA DE SEGURIDAD -A-  XAVIER MAC-ADDO.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "vendedor",
        "label": "Vendedor de acciones",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "comprador",
        "label": "Comprador de acciones",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "sociedad_emisora",
        "label": "Sociedad o entidad emisora",
        "type": "textarea",
        "placeholder": "Nombre, RUT, registro, estatutos, restricciones.",
        "required": true,
        "group": "4. Acciones"
      },
      {
        "key": "acciones",
        "label": "Acciones o cuotas vendidas",
        "type": "textarea",
        "placeholder": "Cantidad, serie, número, porcentaje, títulos, derechos asociados.",
        "required": true,
        "group": "4. Acciones"
      },
      {
        "key": "precio",
        "label": "Precio",
        "type": "text",
        "placeholder": "Monto y moneda.",
        "required": true,
        "group": "5. Precio"
      },
      {
        "key": "forma_pago",
        "label": "Forma de pago",
        "type": "textarea",
        "placeholder": "Contado, cuotas, transferencia, vale vista.",
        "required": true,
        "group": "5. Precio"
      },
      {
        "key": "registro_accionistas",
        "label": "Registro y comunicaciones",
        "type": "textarea",
        "placeholder": "Inscripción en registro de accionistas, endoso de títulos, notificación a sociedad.",
        "required": true,
        "group": "6. Registro"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Revisar estatutos y restricciones",
      "Títulos/registro de acciones",
      "Notificación a sociedad",
      "Impuestos si corresponde"
    ],
    "body": "CONTRATO DE COMPRAVENTA DE ACCIONES\n\nEn {{ciudad}}, a {{fecha_texto}}, comparecen {{vendedor}} y {{comprador}}.\n\nPRIMERO: Sociedad emisora. {{sociedad_emisora}}\n\nSEGUNDO: Acciones. El vendedor vende al comprador las siguientes acciones o derechos: {{acciones}}.\n\nTERCERO: Precio y pago. El precio es {{precio}}, pagado de la siguiente forma: {{forma_pago}}.\n\nCUARTO: Registro, endoso y comunicaciones. {{registro_accionistas}}\n\nQUINTO: Declaraciones, gastos y cierre. {{gastos}} {{personerias}} {{identidad}} {{clausulas_especiales}}",
    "number": 38
  },
  {
    "id": "demanda_interdiccion",
    "title": "Demanda de interdicción por demencia / discapacidad",
    "category": "Escritos judiciales",
    "level": "Minuta profesional adaptable",
    "sourceDocs": [
      "DEMANDA INTERDICCIÓN.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "tribunal",
        "label": "Tribunal competente",
        "type": "text",
        "placeholder": "Juzgado Civil/Familia competente según materia y domicilio.",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "demandante",
        "label": "Demandante(s)",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "demandado",
        "label": "Persona respecto de quien se solicita interdicción",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "abogado",
        "label": "Abogado patrocinante y apoderado",
        "type": "textarea",
        "placeholder": "Nombre, RUT, domicilio, correo, poder.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "hechos",
        "label": "Hechos",
        "type": "textarea",
        "placeholder": "Relato cronológico y circunstancias que justifican la solicitud.",
        "required": true,
        "group": "4. Fundamentos"
      },
      {
        "key": "diagnosticos",
        "label": "Antecedentes médicos y certificados",
        "type": "textarea",
        "placeholder": "Informes, diagnósticos, tratamientos, exámenes, dependencia.",
        "required": true,
        "group": "4. Fundamentos"
      },
      {
        "key": "derecho",
        "label": "Fundamentos de derecho",
        "type": "textarea",
        "placeholder": "Normas aplicables y procedencia. Revisar por abogado antes de presentar.",
        "required": true,
        "group": "5. Derecho"
      },
      {
        "key": "peticiones",
        "label": "Peticiones concretas",
        "type": "textarea",
        "placeholder": "Declaración de interdicción, nombramiento curador, oficios, inscripción, medidas.",
        "required": true,
        "group": "6. Petitorio"
      },
      {
        "key": "documentos",
        "label": "Documentos acompañados",
        "type": "textarea",
        "placeholder": "Certificados, informes médicos, cédulas, parentesco, testigos.",
        "required": true,
        "group": "7. Documentos"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Debe revisarlo abogado habilitado",
      "Certificados médicos actualizados",
      "Certificados parentesco",
      "Competencia del tribunal",
      "Normativa vigente y procedimiento"
    ],
    "body": "EN LO PRINCIPAL: DEMANDA DE INTERDICCIÓN. PRIMER OTROSÍ: ACOMPAÑA DOCUMENTOS. SEGUNDO OTROSÍ: PATROCINIO Y PODER.\n\nS.J.L. DE {{tribunal}}\n\n{{demandante}}, a US. respetuosamente digo:\n\nI. PARTES. Se interpone la presente solicitud respecto de {{demandado}}. Abogado/patrocinio: {{abogado}}.\n\nII. HECHOS. {{hechos}}\n\nIII. ANTECEDENTES MÉDICOS. {{diagnosticos}}\n\nIV. DERECHO. {{derecho}}\n\nV. PETICIONES. Solicito a US.: {{peticiones}}\n\nPRIMER OTROSÍ: Sírvase tener por acompañados los siguientes documentos: {{documentos}}.\n\nSEGUNDO OTROSÍ: Patrocinio y poder según se indicará.\n\nControl profesional: {{control_profesional}}",
    "number": 39
  },
  {
    "id": "formulario_2890_ficha",
    "title": "Ficha de datos para Formulario 2890 / enajenación de bienes raíces",
    "category": "Controles administrativos / SII",
    "level": "Ficha administrativa de apoyo",
    "sourceDocs": [
      "formulario-173519699.pdf",
      "formulario-173519699 (1).pdf",
      "circular sii.pdf"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "notario_rut",
        "label": "RUT notario",
        "type": "text",
        "placeholder": "RUT notario si se requiere.",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "propiedad",
        "label": "Información de la propiedad enajenada",
        "type": "textarea",
        "placeholder": "Comuna, código comuna, rol, dirección, destino, avalúo, inscripción.",
        "required": true,
        "group": "3. Propiedad"
      },
      {
        "key": "enajenantes",
        "label": "Enajenantes",
        "type": "textarea",
        "placeholder": "RUT, nombre, domicilio, porcentaje, calidad.",
        "required": true,
        "group": "4. Partes"
      },
      {
        "key": "adquirentes",
        "label": "Adquirentes",
        "type": "textarea",
        "placeholder": "RUT, nombre, domicilio, porcentaje, calidad.",
        "required": true,
        "group": "4. Partes"
      },
      {
        "key": "acto",
        "label": "Acto o contrato",
        "type": "textarea",
        "placeholder": "Compraventa, adjudicación, dación, permuta, cesión, precio, fecha escritura.",
        "required": true,
        "group": "5. Acto"
      },
      {
        "key": "valores",
        "label": "Valores declarados",
        "type": "textarea",
        "placeholder": "Precio, avalúo, forma de pago, exenciones, afectaciones.",
        "required": true,
        "group": "5. Acto"
      },
      {
        "key": "observaciones",
        "label": "Observaciones de llenado",
        "type": "textarea",
        "placeholder": "Datos pendientes, revisión SII, rectificatoria/original.",
        "required": false,
        "group": "6. Control"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Rol de avalúo",
      "Comuna/código comuna",
      "RUT partes",
      "Precio/valor",
      "Fecha escritura",
      "Revisión original/rectificatoria"
    ],
    "body": "FICHA INTERNA PARA FORMULARIO 2890\n\nFecha de preparación: {{fecha_texto}}\nCiudad/notaría: {{ciudad}} - {{notario_nombre}} - RUT notario: {{notario_rut}}\n\n1. Propiedad enajenada:\n{{propiedad}}\n\n2. Enajenantes:\n{{enajenantes}}\n\n3. Adquirentes:\n{{adquirentes}}\n\n4. Acto o contrato:\n{{acto}}\n\n5. Valores declarados:\n{{valores}}\n\n6. Observaciones y control:\n{{observaciones}}\n\nNota: Esta ficha es de apoyo para capturar datos; el llenado oficial debe verificarse en la plataforma y normativa SII vigente.",
    "number": 40
  },
  {
    "id": "protocolizacion_documento",
    "title": "Solicitud/minuta de protocolización o guarda de documentos",
    "category": "Controles notariales",
    "level": "Minuta administrativa notarial",
    "sourceDocs": [
      "REP.819-2023 ANEXO.pdf",
      "REP.819-2023 ANEXO (1).pdf",
      "REP.819-2023 ANEXO (2).pdf",
      "Guia rapida para tramitación en Notarías.docx"
    ],
    "fields": [
      {
        "key": "ciudad",
        "label": "Ciudad de otorgamiento",
        "type": "text",
        "placeholder": "Temuco / Santiago / Osorno / Valparaíso",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "fecha_texto",
        "label": "Fecha de otorgamiento en palabras",
        "type": "text",
        "placeholder": "diecisiete de mayo de dos mil veintiséis",
        "required": true,
        "group": "1. Datos generales"
      },
      {
        "key": "notario_nombre",
        "label": "Notario / Notaria autorizante",
        "type": "text",
        "placeholder": "Nombre completo del Notario Público",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "oficio_notarial",
        "label": "Oficio notarial",
        "type": "text",
        "placeholder": "Notaría de la agrupación de comunas de..., con oficio en calle...",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "repertorio",
        "label": "Repertorio / bimestre / año",
        "type": "text",
        "placeholder": "Repertorio N° ___ - 2026; Bimestre ___",
        "required": false,
        "group": "1. Datos generales"
      },
      {
        "key": "comparecientes",
        "label": "Comparecencia completa",
        "type": "textarea",
        "placeholder": "Individualice a todos los comparecientes: nombre completo, nacionalidad, estado civil, profesión/oficio, cédula/RUT, domicilio, representación y calidad en que actúa.",
        "required": true,
        "group": "2. Comparecencia"
      },
      {
        "key": "identidad",
        "label": "Acreditación de identidad",
        "type": "text",
        "placeholder": "Los comparecientes acreditan su identidad con sus cédulas vigentes.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "personerias",
        "label": "Personerías, mandatos o documentos habilitantes",
        "type": "textarea",
        "placeholder": "Escritura social, certificado de vigencia, poder, mandato, autorización, certificado, resolución, inscripción, acta u otro.",
        "required": false,
        "group": "2. Comparecencia"
      },
      {
        "key": "solicitante",
        "label": "Solicitante",
        "type": "textarea",
        "placeholder": "Nombre completo/razón social, nacionalidad, estado civil, profesión/oficio, RUT/cédula, domicilio, representación y datos de contacto si procede.",
        "required": true,
        "group": "3. Partes"
      },
      {
        "key": "documentos",
        "label": "Documentos a protocolizar o guardar",
        "type": "textarea",
        "placeholder": "Nombre, fecha, cantidad de páginas, origen, copias, anexos.",
        "required": true,
        "group": "3. Documentos"
      },
      {
        "key": "finalidad",
        "label": "Finalidad",
        "type": "textarea",
        "placeholder": "Uso del documento, constancia, anexo de escritura, conservación.",
        "required": true,
        "group": "4. Finalidad"
      },
      {
        "key": "instrucciones",
        "label": "Instrucciones notariales",
        "type": "textarea",
        "placeholder": "Repertorio, copias autorizadas, retiro, custodia, devolución.",
        "required": false,
        "group": "5. Instrucciones"
      },
      {
        "key": "gastos",
        "label": "Gastos, impuestos y derechos",
        "type": "textarea",
        "placeholder": "Indique quién paga gastos notariales, impuestos, derechos CBR, inscripción, certificados, Formulario 2890 u otros.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "clausulas_especiales",
        "label": "Cláusulas especiales / observaciones",
        "type": "textarea",
        "placeholder": "Condiciones, prohibiciones, autorizaciones, reservas, constancias, pactos especiales o instrucciones de la notaría.",
        "required": false,
        "group": "9. Cierre y control"
      },
      {
        "key": "control_profesional",
        "label": "Control profesional previo",
        "type": "textarea",
        "placeholder": "Checklist interno: capacidad, régimen matrimonial, personerías, vigencia, dominio, gravámenes, impuestos, certificados, legalidad y solemnidades.",
        "required": false,
        "group": "9. Cierre y control"
      }
    ],
    "checklist": [
      "Revisar documentos originales/copia",
      "Número de páginas",
      "Instrucción de copias autorizadas",
      "Relación con escritura principal"
    ],
    "body": "SOLICITUD / MINUTA DE PROTOCOLIZACIÓN DE DOCUMENTOS\n\nEn {{ciudad}}, a {{fecha_texto}}, comparece {{solicitante}}.\n\nPRIMERO: Documentos. Solicita protocolizar o dejar en custodia los siguientes documentos: {{documentos}}.\n\nSEGUNDO: Finalidad. {{finalidad}}\n\nTERCERO: Instrucciones. {{instrucciones}}\n\nCUARTO: Gastos y cierre. {{gastos}} {{identidad}} {{clausulas_especiales}}",
    "number": 41
  }
];
const SOURCE_DOCS = [
  {
    "file": "2260 D° DE USUFRUCTO ELVIRA LEPIN.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 65024,
    "chars": 33209,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N° 2260 - 2012 Bimestre IV CONSTITUCION DERECHO DE USUFRUCTO COMUNIDAD INDIGENA MATEO ÑIRRIPIL A ELVIRA PATRICIA LIPIN MILLALEN EN LA CIUDAD DE TEMUCO, República de Chile, a cinco de Julio del año dos mil doce, ante mí, CARLOS ALARCON RAMIREZ, Abogado, "
  },
  {
    "file": "ANT_RNDPA_700015104899_12603304.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 35869,
    "chars": 1115,
    "preview": "SERVICIO DE REGISTRO CIVIL E IDENTIFICACIÓN REPUBLICA DE CHILE FOLIO : 700015104899 Código Verificación: d336d5ff4cc3 700015104899 CERTIFICADO GENERAL DEUDA DE ALIMENTOS IDENTIFICACIÓN DEL DEUDOR R.U.N. : 12.603.304-4 Nombre inscrito : EDUARDO MARCELO NÚÑEZ NÚÑEZ DATOS DEL REGISTRO Fecha de inscripción : 25-01-2023 Monto de la deuda : 117,590500 Mo"
  },
  {
    "file": "APUNTES DE NOTARÍA Y CBR.pdf",
    "ext": ".pdf",
    "type": "Apunte / doctrina / guía",
    "size": 496081,
    "chars": 11019,
    "preview": "MÓDULO II – CLASE N° 2 1. NOTARÍA Y CONSERVADOR Una vez ya identificada la estructura base de un contrato de uso tan cotidiano como lo es la escritura públicai o instrumentos privados (transacción, finiquito en el desempeño de la labor profesional, podemos adentrarnos en las diligencias que pueden llevarse a cabo por las y los habilitados en Derech"
  },
  {
    "file": "ARRIENDO INMUBLE.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 29383,
    "chars": 15730,
    "preview": "CONTRATO DE ARRENDAMIENTO En Valparaíso, a xx 2022, por una parte: don xx, nacionalidad chilena, cédula nacional de identidad N°xx, casado, Ingeniero, domiciliado en Calle Blanca N° 655, Cerro Placeres comuna de Valparaíso, quién en adelante se denominará indistintamente como la parte “Arrendadora”; y por la otra, y también indistintamente como “Ar"
  },
  {
    "file": "ARRIENDO SERVIDUMBRE.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 61952,
    "chars": 21272,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO.TEMUCO. Registro de Instrumentos Públicos. Repertorio N°6310-2017. Bimestre IV CONTRATO DE ARRIENDO, SERVIDUMBRE DE TELECOMUNICACIONES Y SERVIDUMBRE DE PASO TELEFÓNICA DEL SUR S.A. Y COMITÉ DE ADELANTO Y DESARROLLO RENACER EN LA CIUDAD DE TEMUCO, República de Chile, a treinta de Agosto del año dos mil dieci"
  },
  {
    "file": "avaluo fiscal (1).pdf",
    "ext": ".pdf",
    "type": "Certificado / inscripción / respaldo",
    "size": 55573,
    "chars": 650,
    "preview": "Fecha de Emisión: 01 de Junio de 2023 CERTIFICADO DE AVALÚO FISCAL Avalúos en pesos del PRIMER SEMESTRE DE 2023 Comuna : OSORNO Número de Rol de Avalúo : 00184 − 00097 Dirección o Nombre del bien raíz : PASAJE 1 ST 17 EL ESFUERZ Destino del bien raíz : HABITACIONAL AVALÚO TOTAL : $ 16.494.445 AVALÚO EXENTO DE IMPUESTO : $ 16.494.445 AVALÚO AFECTO A"
  },
  {
    "file": "AVALUO FISCAL 3253-438.pdf",
    "ext": ".pdf",
    "type": "Certificado / inscripción / respaldo",
    "size": 55567,
    "chars": 643,
    "preview": "Fecha de Emisión: 02 de Septiembre de 2022 CERTIFICADO DE AVALÚO FISCAL Avalúos en pesos del SEGUNDO SEMESTRE DE 2022 Comuna : TEMUCO Número de Rol de Avalúo : 03253 − 00438 Dirección o Nombre del bien raíz : TROMEN HIJUELA N 5 Destino del bien raíz : AGRICOLA AVALÚO TOTAL : $ 7.497.878 AVALÚO EXENTO DE IMPUESTO : $ 7.497.878 AVALÚO AFECTO A IMPUES"
  },
  {
    "file": "Carta Instruccion CV  SERVIU.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 215820,
    "chars": 7740,
    "preview": "1 INSTRUCCIONES NOTARIALES En la ciudad de Los Ángeles, a 12 de agosto de 2022, por una parte, doña PATRICIA MIRIAM MORA NANCO, chilena, dueña de casa, viuda, cédula de identidad número 8.857.883-K; don RAMON EDUARDO RIOSECO MORA, chileno, técnico forestal, soltero, cédula de identidad número 16.061.354-8; doña MARCELA ALEJANDRA RIOSECO MORA, chile"
  },
  {
    "file": "CBR-Depto.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 482426,
    "chars": 2830,
    "preview": "COPIA DE INSCRIPCION REGISTRO DE PROPIEDAD El Conservador que suscribe certifica que la inscripción adjunta, y que rola a fojas 7332 vta, nº 6819, año 2019, de este registro, está conforme con su original, y que la inscripción que consta en ella se encuentra: VIGENTE.- San Miguel, 13 de Febrero de 2020.- c: 2020019762 Documento emitido con Firma El"
  },
  {
    "file": "certificado de matrimonio (1).pdf",
    "ext": ".pdf",
    "type": "Certificado / inscripción / respaldo",
    "size": 34428,
    "chars": 835,
    "preview": "SERVICIO DE REGISTRO CIVIL E IDENTIFICACIÓN REPUBLICA DE CHILE FOLIO : 500512199166 Código Verificación: 726bc31d110e 500512199166 CERTIFICADO DE MATRIMONIO Circunscripción : OSORNO Nro. inscripción : 569 Registro : Año : 1990 Nombre del Marido : CÉSAR HERNÁN TORRES BAHAMÓNDEZ R.U.N. : 10.450.238-5 Fecha nacimiento : 3 Septiembre 1965 Nombre de la "
  },
  {
    "file": "CESION DE DERECHOS _.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 25954,
    "chars": 7297,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N°1561-2012 Bimestre III CESION DE DERECHOS MARITZA LAURA SÁEZ SANDOVAL A JUANITA CANIULLAN HUERAMAN EN LA CIUDAD DE TEMUCO, República de Chile, a siete de Mayo del año dos mil doce, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Público Titular de l"
  },
  {
    "file": "CESIÓN DEL DERECHO REAL DE HERENCIA.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 128586,
    "chars": 5684,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO.TEMUCO. Registro de Instrumentos Públicos. Repertorio N° 8821-2017. Bimestre VI CESION DEL DERECHO REAL DE HERENCIA MARCELA PEREZ BOISIER Y OTRAS A MARIA VERONICA BOISIER GONZALEZ EN LA CIUDAD DE TEMUCO, República de Chile, a veintinueve de noviembre del año dos mil diecisiete, ante mí, CARLOS ULLOA GONZALE"
  },
  {
    "file": "circular sii.pdf",
    "ext": ".pdf",
    "type": "Apunte / doctrina / guía",
    "size": 269175,
    "chars": 20753,
    "preview": "1 DEPARTAMENTO EMISOR: SUBDIRECCION DE AVALUACIONES CIRCULAR Nº 7 SISTEMA DE PUBLICACIONES ADMINISTRATIVAS FECHA: 17 de enero de 2020 MATERIA: Actualiza instrucciones para la aplicación “F2890 EN LÍNEA”, sobre declaración de enajenación e inscripción de bienes raíces y procedimiento de traspaso de información de Notarios y Conservadores de Bienes R"
  },
  {
    "file": "compraventa (3).docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 22243,
    "chars": 13283,
    "preview": "COMPRAVENTA FREDY ALBERTO RAMIREZ MANCILLA Y OTROS A PEDRO ERNESTO MANZO BETANCUR En Osorno, República de Chile, a tres de junio de dos mil veintitrés, ante mí, don PABLO ANDRES EISENDECHER BERTIN, Abogado, Notario Público Titular de Osorno, con Oficio en calle Bernardo O´Higgins número seiscientos noventa y uno, comparecen: Don FREDY ALBERTO RAMIR"
  },
  {
    "file": "COMPRAVENTA SERVIU.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 3027173,
    "chars": 1505,
    "preview": "Notario de Los Angeles Rodrigo Orlando Cantuarias Costa Certifico que el presente documento electrónico es copia fiel e íntegra de COMPRAVENTA Y PROHIBICION otorgado el 11 de Agosto de 2022 reproducido en las siguientes páginas. Notario de Los Angeles Rodrigo Orlando Cantuarias Costa.- Lautaro 371.- Repertorio Nro: 1611 - 2022.- Los Angeles, 17 de "
  },
  {
    "file": "COMPRAVENTA Y CESION DE DERECHOS.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 21082,
    "chars": 12290,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N° - 2011 Bimestre VI COMPRAVENTA Y CESION DE DERECHOS SOCIEDAD DE INVERSIONES PUMALAL LIMITADA A VALERIA YARKA LANDEROS ALVAREZ Y OTROS EN LA CIUDAD DE TEMUCO, República de Chile, a de Noviembre del año dos mil once, ante mí, CARLOS ALARCON RAMIREZ, Ab"
  },
  {
    "file": "CONTRATO DE ARRENDAMIENTO VEHICULO N 12.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 39424,
    "chars": 5325,
    "preview": "CONTRATO DE ARRENDAMIENTO DE VEHÍCULO TRANSPORTE 3 BENDICIONES SPA y SERVICIOS LOGÍSTICOS GOODPACKET LIMITADA En Dalcahue, República de Chile, a fecha 22 de septiembre de 2023, comparecen: TRANSPORTE 3 BENDICIONES SPA, Rut 77.609.059-k, representante legal don CARLOS GONZALO GUERRERO BARRIENTOS, soltero, transportista, cédula de identidad 17.719.68"
  },
  {
    "file": "CONTRATO DE COMPRAVENTA DE ACCIONES ASOCIACIÓN CHILENA DE SEGURIDAD -A-  XAVIER MAC-ADDO.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 25305,
    "chars": 10449,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N° - 2011 Bimestre VI CONTRATO DE COMPRAVENTA DE ACCIONES ASOCIACION CHILENA DE SEGURIDAD A XAVIER HENRY MAC- ADOO QUEVEDO EN LA CIUDAD DE TEMUCO, República de Chile, a de Diciembre del año dos mil once, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario"
  },
  {
    "file": "COPIA INSCRIPCIÓN INMOBILIARIA.pdf",
    "ext": ".pdf",
    "type": "Certificado / inscripción / respaldo",
    "size": 3174340,
    "chars": 1052,
    "preview": "Documento incorpora firma electrónica avanzada conforme a Ley N°19.799. La vigencia de la firma electrónica en el documento, al igual que la integridad y autenticidad del mismo, deben ser verificados en www.cbrtemuco.cl, donde estará disponible por 60 días contados desde la fecha de su emisión. Documento impreso es sólo una copia del documento orig"
  },
  {
    "file": "cv con usuf.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 13083,
    "chars": 9204,
    "preview": "EN LA CIUDAD DE TEMUCO, República de Chile, a dieciocho de abril del año dos mil diecinueve, ante mí, XX, Abogado, Notario Público Titular de la Cuarta Notaría de la agrupación de las Comunas de Temuco, Padre Las Casas, Vilcún, Melipeuco, Cunco, y Freire, con oficio en esta ciudad de Temuco, calle Claro Solar número ochocientos treinta y uno, compa"
  },
  {
    "file": "CV VEHÍCULOS.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 15017,
    "chars": 4093,
    "preview": "comparece: don XX, nacionalidad, profesión u oficio, estado civil, cédula de identidad número XX, en representación legal de la sociedad XX, sociedad de su giro, Rol Único Tributario número XX, ambos domiciliados para estos efectos en XX de la comuna de XX y de paso en esta ciudad de Temuco, por una parte y en adelante “Los vendedores” y por la otr"
  },
  {
    "file": "cvta administrador de los bienes - dueña la mujer.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 54272,
    "chars": 10015,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N° - 2016 Bimestre III COMPRAVENTA MARCELINA ROSA MARILEO ANCAMIL A JUAN ROSENDO MARILEO RAIN EN LA CIUDAD DE TEMUCO, República de Chile, a de Junio del año dos mil catorce, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Público Titular de la agrupac"
  },
  {
    "file": "dacion pago MARIA GAJARDO-PEDRO GAJARDO.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 39978,
    "chars": 11118,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO TEMUCO. Registro de Instrumentos Públicos. Repertorio N° 1329-2019 Bimestre II DACIÓN EN PAGO MARIA EUGENIA GAJARDO MAYORGA A PEDRO JAVIER GAJARDO GAJARDO EN LA CIUDAD DE TEMUCO, República de Chile, a primero de marzo del año dos mil diecinueve, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Público Titu"
  },
  {
    "file": "DEMANDA INTERDICCIÓN.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 76943,
    "chars": 10410,
    "preview": "Procedimiento : Ordinario. Materia : Interdicción por demencia. Demandante 1 : Luis Sergio Raúl Del Valle Moraga. RUT : 6.426.497-4. Demandante 2 : Luis Alejandro Del Valle Muñoz. RUT : 15.513.027-K. Demandante 3 : Sergio Andrés Del Valle Muñoz. RUT : 16.238.437-6. Abog. Patrocinante : Philipp Hemmelmann Raimil. RUT : 16.048.896-4. Demandada : Alic"
  },
  {
    "file": "ESCRITURA DE COMPRAVENTA Y DOCUMENTOS.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 981450,
    "chars": 0,
    "preview": ""
  },
  {
    "file": "Escritura promesa. Inmobiliaria san agustin limitada a andrea isabel seguel.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 30954,
    "chars": 14258,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PÚBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N° 875 - 2019 Bimestre I PROMESA DE COMPRAVENTA INMOBILIARIA SAN AGUSTÍN LIMITADA A ANDREA ISABEL SEGUEL CURAPIL EN LA CIUDAD DE TEMUCO, República de Chile, a cuatro de Febrero de dos mil diecinueve, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Púb"
  },
  {
    "file": "formulario-173519699 (1).pdf",
    "ext": ".pdf",
    "type": "Formulario / control administrativo",
    "size": 16632,
    "chars": 1788,
    "preview": "pag 1/2 DECLARACIÓN SOBRE ENAJENACIÓN E INSCRIPCIÓN DE BIENES RAÍCES FORMULARIO ELECTRÓNICO NRO. ATENCIÓN 173519699 FECHA DE LLENADO 02-03-2023 USO EXCLUSIVO DEL NOTARIO ORIGINAL RECTIFICATORIA X RUT NOTARIO 12.746.849-4 INFORMACIÓN DE LA PROPIEDAD ENAJENADA NOMBRE COMUNA CÓDIGO COMUNA N° ROL DE AVALÚO ASIGNADO CERTIFICADO ASIGNACIÓN ROLES OSORNO 1"
  },
  {
    "file": "formulario-173519699.pdf",
    "ext": ".pdf",
    "type": "Formulario / control administrativo",
    "size": 16632,
    "chars": 1788,
    "preview": "pag 1/2 DECLARACIÓN SOBRE ENAJENACIÓN E INSCRIPCIÓN DE BIENES RAÍCES FORMULARIO ELECTRÓNICO NRO. ATENCIÓN 173519699 FECHA DE LLENADO 02-03-2023 USO EXCLUSIVO DEL NOTARIO ORIGINAL RECTIFICATORIA X RUT NOTARIO 12.746.849-4 INFORMACIÓN DE LA PROPIEDAD ENAJENADA NOMBRE COMUNA CÓDIGO COMUNA N° ROL DE AVALÚO ASIGNADO CERTIFICADO ASIGNACIÓN ROLES OSORNO 1"
  },
  {
    "file": "Guia rapida para tramitación en Notarías.docx",
    "ext": ".docx",
    "type": "Apunte / doctrina / guía",
    "size": 33754,
    "chars": 30016,
    "preview": "Tramites más frecuentes en las notarías Constitución de Sociedades Escrituras Públicas Legalización de documentos otorgados en el extranjero Arriendo de predios agrícolas La compraventa de un bien raíz Promesas de compraventa Impuestos de timbres en pagarés bancarios Transferencia sobre vehículos motorizados Testamento La Guarda de Documentos y las"
  },
  {
    "file": "HP.png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 155864,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "IMG_9774.jpg",
    "ext": ".jpg",
    "type": "Imagen / respaldo visual",
    "size": 2840634,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "IMG_9831.jpg",
    "ext": ".jpg",
    "type": "Imagen / respaldo visual",
    "size": 2861852,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "IMG_9832.jpg",
    "ext": ".jpg",
    "type": "Imagen / respaldo visual",
    "size": 3441068,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "index (1).pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 406264,
    "chars": 1515,
    "preview": "COPIA VIGENTE Conservador de Bienes Raíces de Osorno Certifico que el presente documento electrónico es copia fiel e íntegra de su original, reproducido en las siguientes páginas. Conservador de Bienes Raíces de Osorno certifica que la copia de la inscripción de fojas 3353 número 2828 correspondiente al Registro de Propiedad del año 2022, adjunta a"
  },
  {
    "file": "index-2 (1).pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 437350,
    "chars": 1462,
    "preview": "COPIA AUTORIZADA Conservador de Bienes Raíces de Osorno Certifico que el presente documento electrónico es copia fiel e íntegra de su original, reproducido en las siguientes páginas. Conservador de Bienes Raíces de Osorno certifica que la copia de la inscripción de fojas 935 número 781 correspondiente al Registro de Propiedad del año 2022, adjunta "
  },
  {
    "file": "INSCRIPCIÓN AGUAS (1).pdf",
    "ext": ".pdf",
    "type": "Certificado / inscripción / respaldo",
    "size": 116789,
    "chars": 0,
    "preview": ""
  },
  {
    "file": "INSCRIPCIÓN DE DOMINIO (1).png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 641128,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "INSCRIPCIÓN DE DOMINIO (2).png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 584696,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "INSCRIPCIÓN FS. 4173 VTA N° 5913 AÑO 1984.png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 461478,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "INSCRIPCIÓN INTERDICCIÓN  (1).pdf",
    "ext": ".pdf",
    "type": "Certificado / inscripción / respaldo",
    "size": 128028,
    "chars": 0,
    "preview": ""
  },
  {
    "file": "INSCRIPCIÓN MANUSCRITA (1).pdf",
    "ext": ".pdf",
    "type": "Certificado / inscripción / respaldo",
    "size": 384704,
    "chars": 0,
    "preview": ""
  },
  {
    "file": "INSRIPCIÓN DE DOMINIO 2.png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 458878,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "INSRIPCIÓN DOMINIO.png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 117243,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "LIQUIDACION SC DIVORCIADOS.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 32256,
    "chars": 2976,
    "preview": "LIQUIDACION SOCIEDAD CONYUGAL XXXXXXXXXXXXXXXXXXX Y XXXXXXXXXXXXXXXX don XXXX, chileno, divorciado, conductor, XXXXXX, domiciliado en XXXXX, y doña OLGA ELENA BERAUD ALBORNOZ, chilena, divorciada, cédula de identidad XXXXXX, vendedora, domiciliada en XXXXXXXX, ambos comparecientes mayores de edad, quienes me acreditaron sus identidades con sus resp"
  },
  {
    "file": "LIQUIDACION SC SIN BIENES.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 36191,
    "chars": 4659,
    "preview": "SEPARACIÓN DE BIENES Y LIQUIDACION DE SOCIEDAD CONYUGAL Y REGULACIÓN DE RELACIONES MUTUAS DE LOS CÓNYUGES Y DE LOS HIJOS, PARA DIVORCIO DE COMUN ACUERDO. XXXXXXXXXXX (CÓNYUGE) A XXXXXXXXXXXXX (CÓNYUGE) EN LA CIUDAD DE TEMUCO, República de Chile, a XX de XXX del año XXX, ante mí, XXXXX, Abogado, Notario Público de la XXXXXX, comparecen: don XXXXX, c"
  },
  {
    "file": "LIQUIDACIÓN DE SC CON BIENES.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 17483,
    "chars": 6233,
    "preview": "SEPARACIÓN TOTAL DE BIENES, LIQUIDACION DE SOCIEDAD CONYUGAL y ADJUDICACION XXXXXXXXXXXXXXXXXXXX A XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Don XXXXXXXXX, chileno, casado, pensionado, cédula de identidad número XXXXXX, con domicilio en calle XXXXXXXXXX, y doña XXXXXX, chilena, casada, empleada, cédula de identidad número XXXXXX"
  },
  {
    "file": "MANDATO DE ADMINISTRACIÓN.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 14749,
    "chars": 2333,
    "preview": "Mandato especial. COMPARECE: Doña Elba Rodríguez Parra, Cedula de identidad 4.435.745-3, chilena, viuda, labores de casa, domiciliada en calle Canal Beagle Nro.569 , Valle de Mirasur, de la ciudad Temuco y expone: Que viene en conferir mandato especial a don Juan Antonio Salazar Rodríguez, cedula 10.705.735-8, chileno, Ingeniero. Domiciliado en Can"
  },
  {
    "file": "MANDATO ESPECIAL COMPRA.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 22572,
    "chars": 3476,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N°4955 -2012 Bimestre VI MANDATO ESPECIAL VIOLA DEL ROSARIO OJEDA RUIZ A FRANCISCO JAVIER MUÑOZ BAHAMONDE EN LA CIUDAD DE TEMUCO, República de Chile, a catorce de Diciembre del año dos mil doce, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Público "
  },
  {
    "file": "MANDATO ESPECIAL DE ADMINISTRACIÓN.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 16950,
    "chars": 9019,
    "preview": "MANDATO ESPECIAL DE ADMINISTRACIÓN Y REPRESENTACION LEGAL CORPORACION DE TURISMO, RUTA PATRIMONIAL HUELLAS DE PABLO NERUDA, TEMUCO-CHILE. A XXXXXXXXXXXXXX Comparece: don XXXXXXXXXXXXXXX, chileno, dependiente, soltero cédula XXXXXXXXXXXXXXXXXXXXx, en representación y con el cargo de presidente de la CORPORACIÓN DE TURISMO, RUTA PATRIMONIAL HUELLAS D"
  },
  {
    "file": "MANDATO GENERAL AMPLIO.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 130525,
    "chars": 16043,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO.TEMUCO. Registro de Instrumentos Públicos. Repertorio N° 7854-2017. Bimestre V MANDATO GENERAL AMPLIO JOSÉ ANGEL VERGARA GONZÁLEZ A MIGUEL ANGEL VERGARA CORDOVA EN LA CIUDAD DE TEMUCO, República de Chile, a veintiséisde octubre del año dos mil diecisiete, ante mí, CARLOS ULLOA GONZALEZ, Abogado, Notario Púb"
  },
  {
    "file": "MANDATO JUDICIAL DIVORCIO.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 32256,
    "chars": 3879,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N° -2016 Bimestre III MANDATO JUDICIAL CLORINDA DEL CARMEN BUSTAMANTE GONZALEZ A ABELINO ANTONIO GUTIERREZ ESCOBAR EN LA CIUDAD DE TEMUCO, República de Chile, a seis de Mayo del año dos mil dieciséis, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Pú"
  },
  {
    "file": "MANDATO JUDICIAL ESPECIAL DIVORCIO.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 34250,
    "chars": 9081,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PÚBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N° 6497 - 2016 Bimestre V MANDATO ESPECIAL PARA DIVORCIO HECTOR ROSENDO TREUMUN TREUMUN Y OTRA A KATHERINE VERONICA BARRIENTOS UTRERAS EN LA CIUDAD DE TEMUCO, República de Chile, a veinticinco de octubre del año dos mil dieciséis, ante mí, CARLOS ALARCO"
  },
  {
    "file": "MANDATO JUDICIAL ESPECIAL.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 17606,
    "chars": 6908,
    "preview": "MANDATO JUDICIAL Y ESPECIAL comparece: Don XX, de nacionalidad chileno, cedula de identidad número XX, estado civil divorciado, de profesión trabajador independiente, domiciliado en Kilometro dieciocho sector el Laurel, comuna de Rio Bueno, Región de La Araucanía; y doña XX, nacionalidad chilena, estado civil soltera, trabajador dependiente en alim"
  },
  {
    "file": "MAT_AF_500467070109_7882811.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 34396,
    "chars": 857,
    "preview": "SERVICIO DE REGISTRO CIVIL E IDENTIFICACIÓN REPUBLICA DE CHILE FOLIO : 500467070109 Código Verificación: d2d9068840ea 500467070109 CERTIFICADO DE MATRIMONIO Uso exclusivo para ASIGNACION FAMILIAR Circunscripción : TEMUCO Nro. inscripción : 612 Registro : Año : 1981 Nombre del Marido : PEDRO LEVIPIL TRIPAILAF R.U.N. : 7.882.811-0 Fecha nacimiento : "
  },
  {
    "file": "MINUTA DE CONTRATO DE ARRIENDO DE LOCAL COMERCIAL FLORERÍA LAS ENCINAS.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 20480,
    "chars": 5108,
    "preview": "MINUTA DE CONTRATO DE ARRIENDO DE LOCAL COMERCIAL. En Temuco, del mes de del Año Dos Mil Quince, entre doña Lastenia Aros Cárdenas, Factor de Comercio; cédula nacional de identidad número seis millones noventa y siete mil setecientos noventa y dos guión cinco; con domicilio en Avenida Las Encinas número cero mil doscientos noventa y ocho, de la ciu"
  },
  {
    "file": "MODELO DE COMPRAVENTA.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 17150,
    "chars": 8744,
    "preview": "COMPRAVENTA CONSTRUCTORA CyC LIMITADA A INVERSIONES RUPANGUE LIMITADA Comparecen: La sociedad “XXXXXXXXXXXXXXXX”, persona jurídica Giro de su denominación, rol único tributario numero XXXXXXXXXXXXXXXXXX, representada legalmente por don XXXXXXXXXXXXXXXXXXXXXXXX, chileno, soltero, independiente, cedula de identidad número XXXXXXXXXXXXXX, con domicili"
  },
  {
    "file": "MODELO DE CONSTITUCION DE SOCIEDAD RESPNSABILIDAD LIMITADA.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 26407,
    "chars": 14802,
    "preview": "CONSTITUCION DE SOCIEDAD RESPONSABILIDAD LIMITADA “XXXXXXXXXXXXXX LIMITADA” , Comparecen: don XXXXXXXXXXXXXXXXXX, y don XXXXXXXXXXXXXXXXXx, ambos mayores de edad, quienes acreditan su identidad con las cédulas ya anotadas y exponen que han convenido en el siguiente contrato de sociedad: PRIMERO: Por el presente instrumento constituyen una sociedad "
  },
  {
    "file": "MODELO DE CONTRATO DE ARRIENDO POR ESCRITURA PUBLICA.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 30887,
    "chars": 20815,
    "preview": "CONTRATO DE ARRENDAMIENTO XXXXXXXXXXXXXXXXXXX A OPERADORA DE ESTACIONES DE SERVICIO OPES LIMITADA , Comparecen: doña XXXXXXXXXXXXXXXXXXXx, chilena, dueña de casa, soltera, cédula de identidad número XXXXXXXXXXXXXXXXXXXXXXXXX domiciliada en calle XXXXXXXXXXXXXX ciudad de Temuco en adelante también denominada la “ARRENDADORA”, por una parte; y, por l"
  },
  {
    "file": "MODELO DE MANDATO JUDICIAL A SOCIEDAD.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 15933,
    "chars": 3527,
    "preview": "MANDATO JUDICIAL CARLOS ALFONSO GUZMÁN CONTRERAS Y OTRA -A- ELIAZER ALEJANDRO POBLETE TORRES CVG.****************************************************** En Temuco, República de Chile, a dos de septiembre de dos mil diecinueve. Ante mí, JORGE ELIAS TADRES HALES, Abogado, Notario Público Titular de la Agrupación de las comunas de Temuco, Padre las Cas"
  },
  {
    "file": "NAC_AF_500467070522_7882811.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 34468,
    "chars": 887,
    "preview": "SERVICIO DE REGISTRO CIVIL E IDENTIFICACIÓN REPUBLICA DE CHILE FOLIO : 500467070522 Código Verificación: ae01bdbd0865 500467070522 CERTIFICADO DE NACIMIENTO Uso exclusivo para ASIGNACION FAMILIAR Circunscripción : TEMUCO Nro. inscripción : 858 Registro : Año : 1958 Nombre inscrito : PEDRO LEVIPIL TRIPAILAF R.U.N. : 7.882.811-0 Fecha nacimiento : 10"
  },
  {
    "file": "not-pabaneiber-Copia Escritura  COMPRAVENTA-123456815765_pages-to-jpg-0001 (1).pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 2082984,
    "chars": 0,
    "preview": ""
  },
  {
    "file": "Notaria-Carta poder.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 3992417,
    "chars": 0,
    "preview": ""
  },
  {
    "file": "Notaria-Poder Posesion Efectiva.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 581604,
    "chars": 911,
    "preview": "Notario Titular de Peumo Alejandro Andres Pardo Kuschel Certifico que el presente documento electrónico es copia fiel e íntegra de PODER DE LUIS ALBERTO PARRA BALBOA otorgado el 05 de Mayo de 2021 reproducido en las siguientes páginas. Notario Titular de Peumo Alejandro Andres Pardo Kuschel.- Carmen 11, Peumo.- Peumo, 05 de Mayo de 2021.- Emito el "
  },
  {
    "file": "Notaria-Transaccion.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 2946763,
    "chars": 1704,
    "preview": "Notario y Conservador de Bienes Raices Vilcun Carlos Gustavo Martinez Elgueta Certifico que el presente documento electrónico es copia fiel e íntegra de TRANSACCION otorgado el 30 de Septiembre de 2021 reproducido en las siguientes páginas. Notario y Conservador de Bienes Raices Vilcun Carlos Gustavo Martinez Elgueta.- Yungay 374.- Repertorio Nro: "
  },
  {
    "file": "NUDA PROPIEDAD 1.png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 505876,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "NUDA PROPIEDAD 2.png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 620915,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "NUDA PROPIEDAD.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 36433,
    "chars": 17232,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO.TEMUCO. Registro de Instrumentos Públicos. Repertorio N° -2015. Bimestre II CONTRATO COMPRAVENTA Y USUFRUCTO VITALICIO ALFONSO ROBERTO GEBERT KIEKEBUSCH A ROSMARIE YANETT GEBERT FRITZ EN LA CIUDAD DE TEMUCO, República de Chile, a - - - - - - - - - - - - - -del año dos mil quince, ante mí, CARLOS ALARCON RAM"
  },
  {
    "file": "PAGARE CARO.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 34442,
    "chars": 24304,
    "preview": "UNIVERSIDAD CATOLICA DE TEMUCO R.U.T. 71.918.700-5 Rut: Fecha N° Folio : 19.070.240-5 : 19/08/2019 : 201910966 PAGARÉ (FONDO SOLIDARIO DE CREDITO UNIVERSITARIO) Debo y pagaré a la Universidad Católica de Temuco, a su orden o a sus cesionarios, la suma de $1.498.040 equivalentes a 30,98.- Unidades Tributarias Mensuales (UTM), fijadas por Ley y actua"
  },
  {
    "file": "PERMUTA.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 24186,
    "chars": 8057,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N°2250 - 2012 Bimestre IV PERMUTA IVAN MAXIMILIANO POLANCO CELIS Y OTROS A JUAN VICENTE POLANCO CALABRANO EN LA CIUDAD DE TEMUCO, República de Chile, a tres de Julio del año dos mil doce, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Público Titular"
  },
  {
    "file": "PH.png",
    "ext": ".png",
    "type": "Imagen / respaldo visual",
    "size": 166329,
    "chars": 55,
    "preview": "[Imagen: requiere revisión visual; sin texto extraído.]"
  },
  {
    "file": "PROMESA CASA LAUTARO Guzman con Campos .docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 22812,
    "chars": 6056,
    "preview": "PROMESA DE COMPRAVENTA “JUAN PABLO ANDRES GUZMAN TORRES” A “NATALY ELIZABETH CAMPOS AGUAYO.” En Temuco a 22 de Octubre del año 2020, entre Don JUAN PABLO ANDRES GUZMAN TORRES, chileno, soltero, empresario, cédula de identidad número doce millones novecientos ochenta y cuatro mil trescientos noventa y tres guion cuatro, domiciliado en Antonio Varas "
  },
  {
    "file": "RENUNCIA DE USUFRUCTO-RICARDO ROA SILVA.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 31744,
    "chars": 3441,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO.TEMUCO. Registro de Instrumentos Públicos. Repertorio N°5643-2018 Bimestre IV RENUNCIA DE USUFRUCTO DE RICARDO ENRIQUE ROA SILVA EN LA CIUDAD DE TEMUCO, República de Chile, a ---- de Julio del año dos mil dieciocho, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Público Titular de la agrupación de las Co"
  },
  {
    "file": "Rep. XXX-2018 COMPRAVENTA REDACTADA EN NOTARÍA VALLEJOS-GARRIDO.doc",
    "ext": ".doc",
    "type": "Modelo / minuta revisable",
    "size": 152576,
    "chars": 15822,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO.TEMUCO. Registro de Instrumentos Públicos. Repertorio N° 2461 -2018 Bimestre II COMPRAVENTA JUAN DEL CARMEN VALLEJOS VILLAGRA A HERNÁN ALEJANDRO GARRIDO QUIDEL EN LA CIUDAD DE TEMUCO, República de Chile, a dieciséis de abril del año dos mil dieciocho, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Públic"
  },
  {
    "file": "REP.819-2023 ANEXO (1).pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 1964434,
    "chars": 1101,
    "preview": "Notario Titular de Osorno Pablo Andrés Eisendecher Bertin Certifico que el presente documento electrónico es copia fiel e íntegra de DOCUMENTO PROTOCOLIZADO otorgado el 21 de Febrero de 2023 reproducido en las siguientes páginas. Notario Titular de Osorno Pablo Andrés Eisendecher Bertin.- Bernardo O'higgins 691, Osorno.- Repertorio Nro: 819 - 2023."
  },
  {
    "file": "REP.819-2023 ANEXO (2).pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 1964434,
    "chars": 1101,
    "preview": "Notario Titular de Osorno Pablo Andrés Eisendecher Bertin Certifico que el presente documento electrónico es copia fiel e íntegra de DOCUMENTO PROTOCOLIZADO otorgado el 21 de Febrero de 2023 reproducido en las siguientes páginas. Notario Titular de Osorno Pablo Andrés Eisendecher Bertin.- Bernardo O'higgins 691, Osorno.- Repertorio Nro: 819 - 2023."
  },
  {
    "file": "REP.819-2023 ANEXO.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 1964434,
    "chars": 1101,
    "preview": "Notario Titular de Osorno Pablo Andrés Eisendecher Bertin Certifico que el presente documento electrónico es copia fiel e íntegra de DOCUMENTO PROTOCOLIZADO otorgado el 21 de Febrero de 2023 reproducido en las siguientes páginas. Notario Titular de Osorno Pablo Andrés Eisendecher Bertin.- Bernardo O'higgins 691, Osorno.- Repertorio Nro: 819 - 2023."
  },
  {
    "file": "REP.819-2023.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 4882721,
    "chars": 1558,
    "preview": "Notario Titular de Osorno Pablo Andrés Eisendecher Bertin Certifico que el presente documento electrónico es copia fiel e íntegra de COMPRAVENTA otorgado el 21 de Febrero de 2023 reproducido en las siguientes páginas. Notario Titular de Osorno Pablo Andrés Eisendecher Bertin.- Bernardo O'higgins 691, Osorno.- Repertorio Nro: 819 - 2023.- Osorno, 02"
  },
  {
    "file": "REP.ARRIENDO ELISEO MARDONES modificado.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 27912,
    "chars": 8942,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N°1476 - 2015 Bimestre II CONTRATO DE ARRENDAMIENTO DE BIEN RAIZ, CASA HABITACION Y LOCAL COMERCIAL EVELYN MARITZA NIDIA MARDONES VILLALOBOS A ELISEO ZENON MARDONES CONTRERAS EN LA CIUDAD DE TEMUCO, República de Chile, a dieciseis de Marzo del año dos m"
  },
  {
    "file": "resciliacion arriendo lehker lehker.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 18255,
    "chars": 5551,
    "preview": "﻿PROTOCOLO INSTRUMENTOS PUBLICOS. ___ BIMESTRE ____ REPERTORIO Nº -___ RESCILIACION CONTRATO DE ARRENDAMIENTO SOCIEDAD AGRICOLA LEHKER LIMITADA y JAN LARS LEHKER STUCKI EN LA CIUDAD DE LA TEMUCO, REPUBLICA DE CHILE, a __ de mayo del año dos mil catorce, ante mí, CARLOS ALARCON RAMIREZ, Abogado, Notario Público Titular, , con domicilio en calle Andr"
  },
  {
    "file": "REVOCACIÓN MANDATO JUDICIAL.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 27621,
    "chars": 3010,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO.TEMUCO. Registro de Instrumentos Públicos. Repertorio N°2952-2015. Bimestre III REVOCACION DE MANDATO JUDICIAL RUTH DEL CARMEN MELIVILU RAÑIQUEO Y OTRAS A JAIME MARCELO MORAGA CARRASCO EN LA CIUDAD DE TEMUCO, República de Chile, a veintidós de mayo del dos mil quince, ante mí, MARCELO ALBERTO CEVAS FUENTES,"
  },
  {
    "file": "TRASLADO COMPRAVENTA 9016-7616.pdf",
    "ext": ".pdf",
    "type": "Modelo / minuta revisable",
    "size": 137962,
    "chars": 3061,
    "preview": "Nº7373.- TRASLADO COMPRAVENTA RIQUELME CURIHUAL TITO HERNAN DE PAINIAN CARRILLO FERNANDO REP. 4663 SOL. 30951 FR. 27603 ISC OCHO MIL SETENTA Y CUATRO 8074 Temuco, República de Chile, Veintiuno de Noviembre del año dos mil once.- Al Segundo Conservador de Bienes Raíces de Temuco, se le ha presentado para su Inscripción en este Registro de Propiedad,"
  },
  {
    "file": "TÉRMINO CTTO ARRIENDO.docx",
    "ext": ".docx",
    "type": "Modelo / minuta revisable",
    "size": 30064,
    "chars": 4667,
    "preview": "CARLOS F. ALARCON RAMIREZ NOTARIO PUBLICO. TEMUCO. Registro de Instrumentos Públicos. Repertorio N° 1585 -2011 Bimestre III TERMINO Y FINIQUITO CONTRATO ARRENDAMIENTO BANCO BILBAO VIZCAYA ARGENTARIA, CHILE A JOSE NICODEMUS GATICA ORTIZ EN LA CIUDAD DE TEMUCO, República de Chile, a trece de Junio del año dos mil once, ante mí, CARLOS ALARCON RAMIREZ"
  }
];
const OFFICIAL_LINKS = [
  {
    "area": "Normativa notarial",
    "title": "Código Orgánico de Tribunales - Notarios y ministros de fe pública",
    "url": "https://www.bcn.cl/leychile/navegar?idNorma=25563",
    "note": "Base legal general para función notarial, autorización, custodia y copias."
  },
  {
    "area": "Código Civil",
    "title": "Código Civil de Chile - contratos, usufructo, sociedad conyugal, mandato",
    "url": "https://www.bcn.cl/leychile/navegar?idNorma=172986",
    "note": "Referencia base para compraventa, arrendamiento civil, mandato, usufructo y régimen patrimonial."
  },
  {
    "area": "Arriendos urbanos",
    "title": "Ley N° 18.101 - Normas especiales sobre arrendamiento de predios urbanos",
    "url": "https://www.bcn.cl/leychile/navegar?idNorma=29526",
    "note": "Referencia principal para contratos de arriendo de inmuebles urbanos."
  },
  {
    "area": "Sociedades",
    "title": "Ley N° 3.918 - Sociedades de responsabilidad limitada",
    "url": "https://www.bcn.cl/leychile/navegar?idNorma=24349",
    "note": "Referencia para constitución y modificaciones de sociedades de responsabilidad limitada."
  },
  {
    "area": "Familia",
    "title": "Ley N° 19.947 - Nueva Ley de Matrimonio Civil",
    "url": "https://www.bcn.cl/leychile/navegar?idNorma=225128",
    "note": "Referencia para mandatos de divorcio, separación, nulidad y materias asociadas."
  },
  {
    "area": "SII / Bienes raíces",
    "title": "SII - Pregunta frecuente: ¿Para qué se utiliza el Formulario 2890?",
    "url": "https://www.sii.cl/preguntas_frecuentes/aval_contrib_bbrr/001_165_8878.htm",
    "note": "Uso tributario y catastral del F2890 en enajenaciones de bienes raíces."
  },
  {
    "area": "SII / Bienes raíces",
    "title": "SII - Manual de usuario Formulario N° 2890",
    "url": "https://www.sii.cl/sitios_de_interes/manual_usuario_f2890_.pdf",
    "note": "Manual operativo del Formulario N° 2890."
  },
  {
    "area": "Diario Oficial",
    "title": "Diario Oficial - Procedimiento de constitución de sociedad",
    "url": "https://www.diariooficial.interior.gob.cl/sociedades-web/procedimiento-de-constitucion-de-una-sociedad/",
    "note": "Publicación de extractos de constitución, modificación y disolución de sociedades."
  },
  {
    "area": "Diario Oficial",
    "title": "Diario Oficial - Publicar sociedades",
    "url": "https://www.diariooficial.interior.gob.cl/tramites/sociedades/publicar/",
    "note": "Ruta para publicar extractos societarios cuando corresponda."
  },
  {
    "area": "Vivienda / subsidios",
    "title": "MINVU - Subsidio habitacional DS1",
    "url": "https://www.minvu.gob.cl/beneficio/vivienda/subsidio-habitacional-para-comprar-una-vivienda-de-hasta-2200-uf-ds1/",
    "note": "Referencia para operaciones con subsidio habitacional."
  },
  {
    "area": "Vivienda / subsidios",
    "title": "MINVU - Subsidio DS49",
    "url": "https://www.minvu.gob.cl/beneficio/vivienda/subsidio-para-comprar-una-vivienda-construida-de-hasta-950-uf-ds49/",
    "note": "Referencia para compraventas con subsidio y restricciones asociadas."
  },
  {
    "area": "Poder Judicial",
    "title": "Oficina Judicial Virtual - Poder Judicial de Chile",
    "url": "https://oficinajudicialvirtual.pjud.cl/",
    "note": "Uso externo para revisión de causas y presentación de escritos judiciales cuando corresponda."
  }
];
// =========================================================================

async function ejecutarMigracion() {
    console.log(`\n🚀 Iniciando migración masiva de ${TEMPLATES.length} plantillas a Supabase...`);
    let exito = 0;
    let errores = 0;

    for (const plantilla of TEMPLATES) {
        try {
            // Mapeo de la estructura de tu archivo JS a las columnas de la tabla en Supabase
            const { error } = await supabase
                .from('plantillas_legales')
                .insert([
                    {
                        titulo: plantilla.title,
                        categoria: plantilla.category || 'Escrituras Públicas', 
                        cuerpo_matriz: plantilla.content,
                        campos_config: JSON.stringify(plantilla.fields)
                    }
                ]);

            if (error) {
                console.error(`[❌ ERROR] Fallo al subir "${plantilla.title}":`, error.message);
                errores++;
            } else {
                console.log(`[✅ ÉXITO] Plantilla subida y procesada: ${plantilla.title}`);
                exito++;
            }
        } catch (err) {
            console.error(`[❌ EXCEPCIÓN CRÍTICA] En plantilla "${plantilla.title}":`, err.message);
            errores++;
        }
    }
    
    console.log(`\n=================================================`);
    console.log(`📊 REPORTE FINAL DE MIGRACIÓN`);
    console.log(`=================================================`);
    console.log(`Instrumentos migrados correctamente : ${exito}`);
    console.log(`Errores de inserción encontrados    : ${errores}`);
    console.log(`=================================================\n`);
    process.exit(0);
}

// Ejecutar el motor
ejecutarMigracion();