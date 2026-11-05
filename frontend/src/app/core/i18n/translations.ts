export type Language = 'es' | 'en' | 'pt';

export interface LanguageOption {
  code: Language;
  label: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

export const DEFAULT_LANGUAGE: Language = 'es';

const ES = {
  'meta.title': 'Chasqui Tech · Pagos de comercio exterior',
  'meta.description':
    'Chasqui Tech: agente que evalúa pagos de comercio exterior en pesos y reales digitales, dentro de límites fijos de código.',

  'app.brandAria': 'Chasqui Tech, inicio',
  'app.brandSubtitle': 'Pagos de comercio exterior',
  'app.navAria': 'Secciones',
  'app.navDemo': 'Demo',
  'app.navHow': 'Cómo funciona',
  'app.language': 'Idioma',
  'app.footerCredit': 'Chasqui Tech · Agents on Open Rails (Celo × Ripio)',
  'app.footerNote':
    'Cada pago real queda limitado por código: tope por pago, presupuesto diario y partes confirmadas.',

  'role.exportador': 'Exportador',
  'role.importador': 'Importador',
  'role.transportista': 'Transportista',

  'operation.OP-DEMO-1.title': 'Bebidas a Brasil, pulpas de vuelta',
  'operation.OP-DEMO-1.description':
    'Una empresa del norte argentino exporta bebidas y aprovecha el viaje de regreso para importar pulpas y concentrados frutales.',
  'operation.OP-DEMO-2.title': 'Misma operación, transportista sin confirmar',
  'operation.OP-DEMO-2.description':
    'Las partes todavía no cerraron la confirmación del transportista. Sirve para probar el rechazo por destinatario no habilitado.',

  'dashboard.eyebrow': 'Agents on Open Rails · Stable Agents LatAm',
  'dashboard.heroTitleLead': 'Liquidá comercio exterior',
  'dashboard.heroTitleHighlight': 'sin pasar por el dólar.',
  'dashboard.heroLead':
    'Chasqui Tech conecta exportador, importador y transportista, y evalúa pagos en pesos y reales digitales, siempre dentro de límites fijos de código.',
  'dashboard.heroLink': '¿Cómo funciona la app? →',
  'dashboard.summaryAria': 'Resumen',
  'dashboard.statsParties': 'Partes por operación',
  'dashboard.statsCap': 'Tope por pago',
  'dashboard.statsCurrencies': 'Monedas',
  'dashboard.statsCurrenciesValue': 'Pesos y reales',

  'dashboard.operationTitle': '1. Elegí la operación',
  'dashboard.operationHint': 'Datos de ejemplo',
  'dashboard.confirmedCount': '{count}/3 confirmadas',
  'dashboard.confirmed': 'Confirmado',
  'dashboard.unconfirmed': 'Sin confirmar',
  'dashboard.payTitle': '2. Evaluá un pago',
  'dashboard.payHint': 'El servidor valida; el navegador no decide',
  'dashboard.recipientRole': 'Destinatario (rol)',
  'dashboard.amountIn': 'Monto en {currency}',
  'dashboard.amountPlaceholder': '1.500,00',
  'dashboard.amountError': 'Ingresá un monto válido, por ejemplo 1.500,00.',
  'dashboard.presetsAria': 'Montos rápidos',
  'dashboard.evaluating': 'Evaluando…',
  'dashboard.evaluate': 'Evaluar pago',
  'dashboard.resultTitle': '3. Resultado',
  'dashboard.simulatedTag': 'respuesta simulada',
  'dashboard.amountLabel': 'Monto',
  'dashboard.operationLabel': 'Operación',
  'dashboard.recipientLabel': 'Destinatario',
  'dashboard.codeLabel': 'Código',
  'dashboard.techSummary': 'Ver detalle técnico',
  'dashboard.receipt': 'Comprobante',
  'dashboard.simulatedHashNote': 'hash simulado (ceros), no existe en la red',
  'dashboard.viewReceipt': 'Ver comprobante',
  'dashboard.empty': 'Todavía no evaluaste ningún pago. Elegí una operación, un rol y un monto.',
  'dashboard.simBar': 'Probar estados:',
  'dashboard.simCodeLabel': 'Probar un código:',
  'dashboard.simulate': 'Simular',

  'dashboard.limitsTitle': 'Límites fijos',
  'dashboard.limitsNote': 'Se leen del backend en cada visita. El agente no puede modificarlos.',
  'dashboard.perPayment': 'Tope por pago',
  'dashboard.dailyBudget': 'Presupuesto diario',
  'dashboard.recipients': 'Destinatarios',
  'dashboard.onlyConfirmed': 'Solo partes confirmadas',
  'dashboard.stepsTitle': 'Cómo funciona',
  'dashboard.step1Title': 'Confirmación',
  'dashboard.step1Text': 'Las tres partes confirman la operación antes de cualquier pago.',
  'dashboard.step2Title': 'Evaluación',
  'dashboard.step2Text':
    'El backend valida monto, tope diario y destinatario. El tag se verifica antes de enviar.',
  'dashboard.step3Title': 'Liquidación',
  'dashboard.step3Text':
    'En producción: transferencia de pesos o reales digitales con comprobante verificable.',
  'dashboard.juryTitle': 'Para el jurado',
  'dashboard.juryNote':
    'Red, tokens e identidad del agente. La operación se puede probar igual desde la pantalla principal.',
  'dashboard.network': 'Red',
  'dashboard.tokens': 'Tokens',
  'dashboard.identity': 'Identidad',
  'dashboard.attributionTag': 'Tag de atribución',
  'dashboard.operationAddresses': 'Direcciones de la operación',
  'dashboard.celoMainnet': 'Celo mainnet (chain {chainId})',

  'status.dry-run': 'Así quedaría el pago',
  'status.sent': 'Pago enviado',
  'status.rejected': 'Pago rechazado',
  'status.blocked': 'Pago detenido',
  'status.failed': 'Falló el envío',
  'message.dry-run': 'Así quedaría el pago.',
  'message.sent': 'El pago se envió correctamente.',
  'message.blocked': 'Pago detenido por una verificación interna.',
  'message.failed': 'No se pudo enviar. Probá de nuevo más tarde.',
  'message.fallback': 'Algo salió mal. Probá de nuevo.',
  'message.network': 'No se pudo contactar la API. Revisá la URL o el proxy de desarrollo.',

  'error.OVER_PER_PAYMENT_CAP': 'Supera el límite por pago.',
  'error.OVER_DAILY_BUDGET': 'Se alcanzó el límite del día.',
  'error.RECIPIENT_NOT_ALLOWED': 'Ese destinatario no está autorizado en esta operación.',
  'error.OPERATION_NOT_FOUND': 'No encontramos esa operación.',
  'error.AMOUNT_AMBIGUOUS': 'No entiendo el monto. Escribilo con coma, por ejemplo 1500,50.',
  'error.AMOUNT_TOO_PRECISE': 'Los montos llevan hasta dos decimales.',
  'error.AMOUNT_NOT_POSITIVE': 'El monto tiene que ser mayor que cero.',
  'error.AMOUNT_INVALID': 'Revisá los datos del pago.',
  'error.BAD_ADDRESS': 'Revisá los datos del pago.',
  'error.BAD_REQUEST': 'Revisá los datos del pago.',
  'error.SEND_FAILED': 'No se pudo enviar. Probá de nuevo más tarde.',
  'error.TAG_MISSING_OR_INVALID': 'Pago detenido por una verificación interna.',
  'error.TAG_NOT_APPENDED': 'Pago detenido por una verificación interna.',
  'error.DECIMALS_INVALID': 'Pago detenido por una verificación interna.',
  'error.NETWORK_ERROR': 'No se pudo contactar la API. Revisá la URL o el proxy de desarrollo.',

  'sim.dry-run': 'Así quedaría',
  'sim.sent': 'Enviado',
  'sim.failed': 'Falló',
  'sim.blocked': 'Bloqueado',

  'how.metaTitle': 'Cómo funciona · Chasqui Tech',
  'how.back': '← Volver a la app',
  'how.heroTitleLead': 'Cobrá y pagá comercio exterior',
  'how.heroTitleHighlight': 'sin pasar por el dólar.',
  'how.heroLead':
    'Chasqui Tech conecta a quien exporta, a quien importa y a quien transporta. Ordena la operación, revisa cada pago en pesos o reales digitales y lo deja listo para liquidar, siempre dentro de límites claros.',
  'how.tryDemo': 'Probar la demo',
  'how.viewCode': 'Ver el código',
  'how.statsLimits': 'Límites',
  'how.statsLimitsValue': 'Fijos, en código',

  'how.summaryTitle': 'En 30 segundos',
  'how.summaryLead':
    'Una operación, tres partes y un pago que se puede explicar sin tecnicismos.',
  'how.summary1Title': 'Tres partes, una operación',
  'how.summary1Text':
    'Quien exporta, quien importa y quien transporta la carga. Las tres tienen que confirmar antes de que se mueva un peso.',
  'how.summary2Title': 'Elegís a quién pagar',
  'how.summary2Text':
    'Podés pagarle al exportador, al importador o al transportista. No hace falta pegar direcciones: elegís el rol.',
  'how.summary3Title': 'Escribís el monto',
  'how.summary3Text':
    'En la moneda de la operación, por ejemplo ARS 1.500,00. Chasqui no adivina montos ambiguos: si no está claro, te lo pide de nuevo.',
  'how.summary4Title': 'Chasqui revisa',
  'how.summary4Text':
    'Mira que la parte haya confirmado, que el monto no supere el tope y que quede presupuesto para el resto del día.',
  'how.summary5Title': 'Te dice qué pasaría',
  'how.summary5Text':
    'Antes de mover nada, te muestra el resultado: el pago está listo, fue rechazado o quedó detenido. Sin sorpresas.',
  'how.summary6Title': 'Queda un comprobante',
  'how.summary6Text':
    'Cuando el pago se envía de verdad, queda un comprobante público que cualquiera puede verificar. En la demo, el comprobante es simulado.',

  'how.problemTitle': 'El problema',
  'how.problemLead': 'Hoy coordinar un pago de comercio exterior es más difícil de lo que debería.',
  'how.problem1Title': 'El dólar en el medio',
  'how.problem1Text':
    'Exportar desde Argentina y cobrar en Brasil suele obligar a pasar por el dólar. Cada conversión suma pasos, costo y tiempo.',
  'how.problem2Title': 'Tres partes, tres pagos',
  'how.problem2Text':
    'El exportador vende, el importador compra y el transportista vuelve con carga. Coordinar quién le paga a quién es trabajo manual.',
  'how.problem3Title': 'Confiar sin control',
  'how.problem3Text':
    'Si un agente puede mover dinero, necesita límites. Acá los límites están escritos en el sistema y el agente no los puede cambiar.',

  'how.flowTitle': 'Cómo funciona',
  'how.flowLead': 'De la operación confirmada al comprobante, en cinco pasos.',
  'how.flow1Title': 'Se arma la operación',
  'how.flow1Text':
    'Exportador, importador y transportista quedan asociados a la misma operación. Cada uno confirma su parte.',
  'how.flow2Title': 'Se elige el pago',
  'how.flow2Text':
    'Elegís a qué parte pagar y cuánto, en pesos o en reales. El monto se escribe como en la vida real: con coma decimal.',
  'how.flow3Title': 'Chasqui revisa las reglas',
  'how.flow3Text':
    'Verifica que la parte haya confirmado, que el pago no supere el tope y que el presupuesto del día alcance.',
  'how.flow4Title': 'Se decide, sin mover plata',
  'how.flow4Text':
    'La demo te muestra qué pasaría. Si todo está en orden, el pago queda listo. Si algo falla, te explica por qué en lenguaje simple.',
  'how.flow5Title': 'Se liquida y queda el comprobante',
  'how.flow5Text':
    'Cuando el modo real está habilitado, el pago sale en Celo y queda un enlace público para verificarlo. En la demo, nada sale a la red.',

  'how.exampleTitle': 'Un ejemplo concreto',
  'how.exampleLead':
    'Una empresa del norte argentino exporta bebidas a Brasil y trae pulpas de vuelta. El transportista cobra por el viaje de regreso.',
  'how.tableSituation': 'La situación',
  'how.tableAction': 'Lo que hace Chasqui',
  'how.tableResult': 'Lo que ves',
  'how.example1Situation': 'Las tres partes confirmaron y el pago es de ARS 1.500,00',
  'how.example1Action': 'Revisa los límites y lo deja listo para liquidar',
  'how.example1Result': 'Así quedaría el pago',
  'how.example2Situation': 'El transportista todavía no confirmó',
  'how.example2Action': 'No paga a una parte que no cerró la operación',
  'how.example2Result': 'Ese destinatario no está autorizado',
  'how.example3Situation': 'El monto supera el tope por pago',
  'how.example3Action': 'Lo frena antes de enviar',
  'how.example3Result': 'Supera el límite por pago',
  'how.example4Situation': 'El monto se escribió como “1.500”',
  'how.example4Action': 'No adivina: pide que lo escribas de nuevo',
  'how.example4Result': 'Escribilo con coma, por ejemplo 1.500,00',
  'how.calloutTitle': 'La demo tiene límites de verdad.',
  'how.calloutText':
    'ARS 5.000 por pago y ARS 20.000 por día. Sirven para mostrar el freno. El envío real usa límites todavía más chicos y exige una confirmación extra del equipo.',

  'how.underTitle': 'Lo que ves y lo que pasa por debajo',
  'how.underLead': 'La experiencia es simple; la infraestructura hace el trabajo pesado.',
  'how.under1Kicker': 'Pagás',
  'how.under1Title': 'Un monto en tu moneda',
  'how.under1Text':
    'Por debajo se mueve una stablecoin local de Ripio, como wARS o wBRL, en la red Celo. Sin una conversión previa al dólar.',
  'how.under2Kicker': 'Confirmás',
  'how.under2Title': 'Una operación entre tres',
  'how.under2Text':
    'La confirmación de las partes queda registrada antes de cualquier pago. Si falta una, el pago a esa parte no avanza.',
  'how.under3Kicker': 'Verificás',
  'how.under3Title': 'Un comprobante público',
  'how.under3Text':
    'Cada pago real deja un registro en el explorador de Celo. Podés mostrarle a cualquiera que la transferencia existió.',

  'how.trustTitle': 'Por qué podés confiar',
  'how.trustLead': 'Un agente útil no es el que puede todo, sino el que respeta las reglas.',
  'how.cannotTitle': 'Lo que el agente no puede hacer',
  'how.cannot1': 'Cambiar sus propios límites.',
  'how.cannot2': 'Pagar a una parte que no confirmó la operación.',
  'how.cannot3': 'Superar el tope por pago o el presupuesto del día.',
  'how.cannot4': 'Mover dinero desde el navegador.',
  'how.cannot5': 'Enviar un pago sin dejar su sello de atribución.',
  'how.canTitle': 'Lo que queda en tus manos',
  'how.can1': 'Elegir la operación, la parte y el monto.',
  'how.can2': 'Confirmar la operación entre las tres partes.',
  'how.can3': 'Probar todo antes de habilitar pagos reales.',
  'how.can4': 'Verificar cada comprobante en el explorador.',
  'how.can5': 'Decidir cuándo se activa el modo real.',
  'how.quote':
    '“El agente puede decidir, pero no puede salirse de las reglas. Los límites están en el sistema, no en el humor del modelo.”',

  'how.todayTitle': 'Qué hay hoy',
  'how.todayLead': 'Sin humo: esto es lo que ya se puede ver y lo que viene después.',
  'how.today1Kicker': 'Listo',
  'how.today1Title': 'Demo pública',
  'how.today1Text':
    'Podés evaluar pagos desde el navegador, probar rechazos y ver los límites vigentes.',
  'how.today2Kicker': 'Preparado',
  'how.today2Title': 'Envío real',
  'how.today2Text':
    'La transferencia en Celo ya está implementada. Se activa solo con una confirmación explícita del equipo.',
  'how.today3Kicker': 'Publicada',
  'how.today3Title': 'Identidad del agente',
  'how.today3Text':
    'El agente tiene wallet propia y una identidad pública ERC-8004, con su sello de atribución.',
  'how.today4Kicker': 'Próximo paso',
  'how.today4Title': 'Asistente autónomo',
  'how.today4Text':
    'Que converse con las partes, proponga el pago y decida dentro de los límites. Hoy la evaluación es determinística.',
  'how.today5Kicker': 'Fuera de alcance',
  'how.today5Title': 'Retiro a banco',
  'how.today5Text':
    'No incluye convertir a pesos en una cuenta bancaria ni reemplazar los trámites de exportación e importación.',

  'how.jurySummary': 'Datos para el jurado',
  'how.currenciesValue': 'wARS y wBRL de Ripio',
  'how.attribution': 'Atribución',
  'how.howTested': 'Cómo se prueba',
  'how.howTestedText':
    'La demo evalúa pagos sin claves. Los scripts de envío verifican el sello antes de enviar y piden una confirmación explícita del equipo.',
  'how.linksTitle': 'Links',
  'how.openDemo': 'Abrir la demo',
  'how.repo': 'Repositorio',
  'how.agentCard': 'Agent card',
  'how.agentWallet': 'Wallet del agente',
} as const;

export type TranslationKey = keyof typeof ES;

const EN: Record<TranslationKey, string> = {
  'meta.title': 'Chasqui Tech · Foreign trade payments',
  'meta.description':
    'Chasqui Tech: an agent that evaluates foreign trade payments in digital pesos and reais, within fixed code limits.',

  'app.brandAria': 'Chasqui Tech, home',
  'app.brandSubtitle': 'Foreign trade payments',
  'app.navAria': 'Sections',
  'app.navDemo': 'Demo',
  'app.navHow': 'How it works',
  'app.language': 'Language',
  'app.footerCredit': 'Chasqui Tech · Agents on Open Rails (Celo × Ripio)',
  'app.footerNote':
    'Every real payment is limited by code: per-payment cap, daily budget and confirmed parties.',

  'role.exportador': 'Exporter',
  'role.importador': 'Importer',
  'role.transportista': 'Carrier',

  'operation.OP-DEMO-1.title': 'Beverages to Brazil, pulp on the way back',
  'operation.OP-DEMO-1.description':
    'A company from northern Argentina exports beverages and uses the return trip to import fruit pulp and concentrates.',
  'operation.OP-DEMO-2.title': 'Same operation, carrier not confirmed',
  'operation.OP-DEMO-2.description':
    'The parties have not completed the carrier confirmation yet. Use it to test the rejection for an unauthorized recipient.',

  'dashboard.eyebrow': 'Agents on Open Rails · Stable Agents LatAm',
  'dashboard.heroTitleLead': 'Settle foreign trade',
  'dashboard.heroTitleHighlight': 'without going through the dollar.',
  'dashboard.heroLead':
    'Chasqui Tech connects exporter, importer and carrier, and evaluates payments in digital pesos and reais, always within fixed code limits.',
  'dashboard.heroLink': 'How does the app work? →',
  'dashboard.summaryAria': 'Summary',
  'dashboard.statsParties': 'Parties per operation',
  'dashboard.statsCap': 'Cap per payment',
  'dashboard.statsCurrencies': 'Currencies',
  'dashboard.statsCurrenciesValue': 'Pesos and reais',

  'dashboard.operationTitle': '1. Choose the operation',
  'dashboard.operationHint': 'Sample data',
  'dashboard.confirmedCount': '{count}/3 confirmed',
  'dashboard.confirmed': 'Confirmed',
  'dashboard.unconfirmed': 'Not confirmed',
  'dashboard.payTitle': '2. Evaluate a payment',
  'dashboard.payHint': 'The server validates; the browser does not decide',
  'dashboard.recipientRole': 'Recipient (role)',
  'dashboard.amountIn': 'Amount in {currency}',
  'dashboard.amountPlaceholder': '1,500.00',
  'dashboard.amountError': 'Enter a valid amount, for example 1,500.00.',
  'dashboard.presetsAria': 'Quick amounts',
  'dashboard.evaluating': 'Evaluating…',
  'dashboard.evaluate': 'Evaluate payment',
  'dashboard.resultTitle': '3. Result',
  'dashboard.simulatedTag': 'simulated response',
  'dashboard.amountLabel': 'Amount',
  'dashboard.operationLabel': 'Operation',
  'dashboard.recipientLabel': 'Recipient',
  'dashboard.codeLabel': 'Code',
  'dashboard.techSummary': 'View technical details',
  'dashboard.receipt': 'Receipt',
  'dashboard.simulatedHashNote': 'simulated hash (zeros), it does not exist on the network',
  'dashboard.viewReceipt': 'View receipt',
  'dashboard.empty':
    'You have not evaluated any payment yet. Choose an operation, a role and an amount.',
  'dashboard.simBar': 'Test states:',
  'dashboard.simCodeLabel': 'Test a code:',
  'dashboard.simulate': 'Simulate',

  'dashboard.limitsTitle': 'Fixed limits',
  'dashboard.limitsNote':
    'They are read from the backend on every visit. The agent cannot change them.',
  'dashboard.perPayment': 'Cap per payment',
  'dashboard.dailyBudget': 'Daily budget',
  'dashboard.recipients': 'Recipients',
  'dashboard.onlyConfirmed': 'Only confirmed parties',
  'dashboard.stepsTitle': 'How it works',
  'dashboard.step1Title': 'Confirmation',
  'dashboard.step1Text': 'All three parties confirm the operation before any payment.',
  'dashboard.step2Title': 'Evaluation',
  'dashboard.step2Text':
    'The backend validates amount, daily cap and recipient. The tag is verified before sending.',
  'dashboard.step3Title': 'Settlement',
  'dashboard.step3Text':
    'In production: transfer of digital pesos or reais with a verifiable receipt.',
  'dashboard.juryTitle': 'For the judges',
  'dashboard.juryNote':
    'Network, tokens and agent identity. The operation can still be tried from the main screen.',
  'dashboard.network': 'Network',
  'dashboard.tokens': 'Tokens',
  'dashboard.identity': 'Identity',
  'dashboard.attributionTag': 'Attribution tag',
  'dashboard.operationAddresses': 'Operation addresses',
  'dashboard.celoMainnet': 'Celo mainnet (chain {chainId})',

  'status.dry-run': 'This is how the payment would look',
  'status.sent': 'Payment sent',
  'status.rejected': 'Payment rejected',
  'status.blocked': 'Payment stopped',
  'status.failed': 'Send failed',
  'message.dry-run': 'This is how the payment would look.',
  'message.sent': 'The payment was sent successfully.',
  'message.blocked': 'Payment stopped by an internal check.',
  'message.failed': 'Could not send. Please try again later.',
  'message.fallback': 'Something went wrong. Please try again.',
  'message.network': 'Could not reach the API. Check the URL or the development proxy.',

  'error.OVER_PER_PAYMENT_CAP': 'Exceeds the per-payment limit.',
  'error.OVER_DAILY_BUDGET': 'The daily limit has been reached.',
  'error.RECIPIENT_NOT_ALLOWED': 'That recipient is not authorized for this operation.',
  'error.OPERATION_NOT_FOUND': 'We could not find that operation.',
  'error.AMOUNT_AMBIGUOUS':
    'The amount is ambiguous. Use a decimal separator, for example 1500.50.',
  'error.AMOUNT_TOO_PRECISE': 'Amounts have at most two decimals.',
  'error.AMOUNT_NOT_POSITIVE': 'The amount must be greater than zero.',
  'error.AMOUNT_INVALID': 'Check the payment details.',
  'error.BAD_ADDRESS': 'Check the payment details.',
  'error.BAD_REQUEST': 'Check the payment details.',
  'error.SEND_FAILED': 'Could not send. Please try again later.',
  'error.TAG_MISSING_OR_INVALID': 'Payment stopped by an internal check.',
  'error.TAG_NOT_APPENDED': 'Payment stopped by an internal check.',
  'error.DECIMALS_INVALID': 'Payment stopped by an internal check.',
  'error.NETWORK_ERROR': 'Could not reach the API. Check the URL or the development proxy.',

  'sim.dry-run': 'Would look like',
  'sim.sent': 'Sent',
  'sim.failed': 'Failed',
  'sim.blocked': 'Blocked',

  'how.metaTitle': 'How it works · Chasqui Tech',
  'how.back': '← Back to the app',
  'how.heroTitleLead': 'Get paid and pay for foreign trade',
  'how.heroTitleHighlight': 'without going through the dollar.',
  'how.heroLead':
    'Chasqui Tech connects exporters, importers and carriers. It organizes the operation, reviews every payment in digital pesos or reais and leaves it ready to settle, always within clear limits.',
  'how.tryDemo': 'Try the demo',
  'how.viewCode': 'View the code',
  'how.statsLimits': 'Limits',
  'how.statsLimitsValue': 'Fixed, in code',

  'how.summaryTitle': 'In 30 seconds',
  'how.summaryLead':
    'One operation, three parties and a payment that can be explained without jargon.',
  'how.summary1Title': 'Three parties, one operation',
  'how.summary1Text':
    'The exporter, the importer and the carrier. All three must confirm before a single peso moves.',
  'how.summary2Title': 'You choose who to pay',
  'how.summary2Text':
    'You can pay the exporter, the importer or the carrier. No need to paste addresses: you choose the role.',
  'how.summary3Title': 'You enter the amount',
  'how.summary3Text':
    "In the operation's currency, for example ARS 1,500.00. Chasqui does not guess ambiguous amounts: if it is not clear, it asks you again.",
  'how.summary4Title': 'Chasqui checks',
  'how.summary4Text':
    'It checks that the party has confirmed, that the amount does not exceed the cap and that there is budget left for the rest of the day.',
  'how.summary5Title': 'It tells you what would happen',
  'how.summary5Text':
    'Before moving anything, it shows you the result: the payment is ready, was rejected or was stopped. No surprises.',
  'how.summary6Title': 'A receipt remains',
  'how.summary6Text':
    'When the payment is actually sent, a public receipt remains that anyone can verify. In the demo, the receipt is simulated.',

  'how.problemTitle': 'The problem',
  'how.problemLead':
    'Today, coordinating a foreign trade payment is harder than it should be.',
  'how.problem1Title': 'The dollar in the middle',
  'how.problem1Text':
    'Exporting from Argentina and getting paid in Brazil usually forces you through the dollar. Every conversion adds steps, cost and time.',
  'how.problem2Title': 'Three parties, three payments',
  'how.problem2Text':
    'The exporter sells, the importer buys and the carrier returns with cargo. Coordinating who pays whom is manual work.',
  'how.problem3Title': 'Trust without control',
  'how.problem3Text':
    'If an agent can move money, it needs limits. Here the limits are written into the system and the agent cannot change them.',

  'how.flowTitle': 'How it works',
  'how.flowLead': 'From the confirmed operation to the receipt, in five steps.',
  'how.flow1Title': 'The operation is set up',
  'how.flow1Text':
    'Exporter, importer and carrier are associated with the same operation. Each one confirms their part.',
  'how.flow2Title': 'The payment is chosen',
  'how.flow2Text':
    'You choose which party to pay and how much, in pesos or reais. The amount is written as in real life: with a decimal comma.',
  'how.flow3Title': 'Chasqui checks the rules',
  'how.flow3Text':
    "It verifies that the party has confirmed, that the payment does not exceed the cap and that the day's budget is enough.",
  'how.flow4Title': 'It is decided, without moving money',
  'how.flow4Text':
    'The demo shows you what would happen. If everything is in order, the payment is ready. If something fails, it explains why in plain language.',
  'how.flow5Title': 'It settles and the receipt remains',
  'how.flow5Text':
    'When real mode is enabled, the payment goes out on Celo and a public link remains to verify it. In the demo, nothing goes to the network.',

  'how.exampleTitle': 'A concrete example',
  'how.exampleLead':
    'A company from northern Argentina exports beverages to Brazil and brings pulp back. The carrier charges for the return trip.',
  'how.tableSituation': 'The situation',
  'how.tableAction': 'What Chasqui does',
  'how.tableResult': 'What you see',
  'how.example1Situation': 'All three parties confirmed and the payment is ARS 1,500.00',
  'how.example1Action': 'It checks the limits and leaves it ready to settle',
  'how.example1Result': 'This is how the payment would look',
  'how.example2Situation': 'The carrier has not confirmed yet',
  'how.example2Action': 'It does not pay a party that has not closed the operation',
  'how.example2Result': 'That recipient is not authorized',
  'how.example3Situation': 'The amount exceeds the per-payment cap',
  'how.example3Action': 'It stops it before sending',
  'how.example3Result': 'Exceeds the per-payment limit',
  'how.example4Situation': 'The amount was written as “1,500”',
  'how.example4Action': 'It does not guess: it asks you to write it again',
  'how.example4Result': 'Write it with a decimal separator, for example 1,500.00',
  'how.calloutTitle': 'The demo has real limits.',
  'how.calloutText':
    'ARS 5,000 per payment and ARS 20,000 per day. They show the brake. The real send uses even smaller limits and requires an extra team confirmation.',

  'how.underTitle': 'What you see and what happens underneath',
  'how.underLead': 'The experience is simple; the infrastructure does the heavy lifting.',
  'how.under1Kicker': 'You pay',
  'how.under1Title': 'An amount in your currency',
  'how.under1Text':
    'Under the hood, a local Ripio stablecoin, such as wARS or wBRL, moves on the Celo network. Without a prior conversion to dollars.',
  'how.under2Kicker': 'You confirm',
  'how.under2Title': 'An operation among three',
  'how.under2Text':
    "The parties' confirmation is recorded before any payment. If one is missing, the payment to that party does not proceed.",
  'how.under3Kicker': 'You verify',
  'how.under3Title': 'A public receipt',
  'how.under3Text':
    'Every real payment leaves a record on the Celo explorer. You can show anyone that the transfer existed.',

  'how.trustTitle': 'Why you can trust it',
  'how.trustLead':
    'A useful agent is not the one that can do everything, but the one that respects the rules.',
  'how.cannotTitle': 'What the agent cannot do',
  'how.cannot1': 'Change its own limits.',
  'how.cannot2': 'Pay a party that has not confirmed the operation.',
  'how.cannot3': "Exceed the per-payment cap or the day's budget.",
  'how.cannot4': 'Move money from the browser.',
  'how.cannot5': 'Send a payment without leaving its attribution stamp.',
  'how.canTitle': 'What stays in your hands',
  'how.can1': 'Choose the operation, the party and the amount.',
  'how.can2': 'Confirm the operation among the three parties.',
  'how.can3': 'Test everything before enabling real payments.',
  'how.can4': 'Verify every receipt on the explorer.',
  'how.can5': 'Decide when real mode is activated.',
  'how.quote':
    '“The agent can decide, but it cannot break the rules. The limits are in the system, not in the model’s mood.”',

  'how.todayTitle': 'What exists today',
  'how.todayLead': 'No smoke: this is what can already be seen and what comes next.',
  'how.today1Kicker': 'Ready',
  'how.today1Title': 'Public demo',
  'how.today1Text':
    'You can evaluate payments from the browser, test rejections and see the current limits.',
  'how.today2Kicker': 'Prepared',
  'how.today2Title': 'Real send',
  'how.today2Text':
    'The Celo transfer is already implemented. It is activated only with an explicit team confirmation.',
  'how.today3Kicker': 'Published',
  'how.today3Title': 'Agent identity',
  'how.today3Text':
    'The agent has its own wallet and a public ERC-8004 identity, with its attribution stamp.',
  'how.today4Kicker': 'Next step',
  'how.today4Title': 'Autonomous assistant',
  'how.today4Text':
    'So it can talk with the parties, propose the payment and decide within the limits. Today the evaluation is deterministic.',
  'how.today5Kicker': 'Out of scope',
  'how.today5Title': 'Bank withdrawal',
  'how.today5Text':
    'It does not include converting to pesos in a bank account or replacing export and import procedures.',

  'how.jurySummary': 'Data for the judges',
  'how.currenciesValue': 'Ripio wARS and wBRL',
  'how.attribution': 'Attribution',
  'how.howTested': 'How it is tested',
  'how.howTestedText':
    'The demo evaluates payments without keys. The send scripts verify the stamp before sending and require an explicit team confirmation.',
  'how.linksTitle': 'Links',
  'how.openDemo': 'Open the demo',
  'how.repo': 'Repository',
  'how.agentCard': 'Agent card',
  'how.agentWallet': 'Agent wallet',
};

const PT: Record<TranslationKey, string> = {
  'meta.title': 'Chasqui Tech · Pagamentos de comércio exterior',
  'meta.description':
    'Chasqui Tech: agente que avalia pagamentos de comércio exterior em pesos e reais digitais, dentro de limites fixos de código.',

  'app.brandAria': 'Chasqui Tech, início',
  'app.brandSubtitle': 'Pagamentos de comércio exterior',
  'app.navAria': 'Seções',
  'app.navDemo': 'Demo',
  'app.navHow': 'Como funciona',
  'app.language': 'Idioma',
  'app.footerCredit': 'Chasqui Tech · Agents on Open Rails (Celo × Ripio)',
  'app.footerNote':
    'Cada pagamento real fica limitado por código: limite por pagamento, orçamento diário e partes confirmadas.',

  'role.exportador': 'Exportador',
  'role.importador': 'Importador',
  'role.transportista': 'Transportador',

  'operation.OP-DEMO-1.title': 'Bebidas para o Brasil, polpas na volta',
  'operation.OP-DEMO-1.description':
    'Uma empresa do norte da Argentina exporta bebidas e aproveita a viagem de volta para importar polpas e concentrados de frutas.',
  'operation.OP-DEMO-2.title': 'Mesma operação, transportador sem confirmar',
  'operation.OP-DEMO-2.description':
    'As partes ainda não concluíram a confirmação do transportador. Serve para testar a rejeição por destinatário não habilitado.',

  'dashboard.eyebrow': 'Agents on Open Rails · Stable Agents LatAm',
  'dashboard.heroTitleLead': 'Liquide comércio exterior',
  'dashboard.heroTitleHighlight': 'sem passar pelo dólar.',
  'dashboard.heroLead':
    'Chasqui Tech conecta exportador, importador e transportador, e avalia pagamentos em pesos e reais digitais, sempre dentro de limites fixos de código.',
  'dashboard.heroLink': 'Como funciona o app? →',
  'dashboard.summaryAria': 'Resumo',
  'dashboard.statsParties': 'Partes por operação',
  'dashboard.statsCap': 'Limite por pagamento',
  'dashboard.statsCurrencies': 'Moedas',
  'dashboard.statsCurrenciesValue': 'Pesos e reais',

  'dashboard.operationTitle': '1. Escolha a operação',
  'dashboard.operationHint': 'Dados de exemplo',
  'dashboard.confirmedCount': '{count}/3 confirmadas',
  'dashboard.confirmed': 'Confirmado',
  'dashboard.unconfirmed': 'Sem confirmar',
  'dashboard.payTitle': '2. Avalie um pagamento',
  'dashboard.payHint': 'O servidor valida; o navegador não decide',
  'dashboard.recipientRole': 'Destinatário (papel)',
  'dashboard.amountIn': 'Valor em {currency}',
  'dashboard.amountPlaceholder': '1.500,00',
  'dashboard.amountError': 'Informe um valor válido, por exemplo 1.500,00.',
  'dashboard.presetsAria': 'Valores rápidos',
  'dashboard.evaluating': 'Avaliando…',
  'dashboard.evaluate': 'Avaliar pagamento',
  'dashboard.resultTitle': '3. Resultado',
  'dashboard.simulatedTag': 'resposta simulada',
  'dashboard.amountLabel': 'Valor',
  'dashboard.operationLabel': 'Operação',
  'dashboard.recipientLabel': 'Destinatário',
  'dashboard.codeLabel': 'Código',
  'dashboard.techSummary': 'Ver detalhes técnicos',
  'dashboard.receipt': 'Comprovante',
  'dashboard.simulatedHashNote': 'hash simulado (zeros), não existe na rede',
  'dashboard.viewReceipt': 'Ver comprovante',
  'dashboard.empty':
    'Você ainda não avaliou nenhum pagamento. Escolha uma operação, um papel e um valor.',
  'dashboard.simBar': 'Testar estados:',
  'dashboard.simCodeLabel': 'Testar um código:',
  'dashboard.simulate': 'Simular',

  'dashboard.limitsTitle': 'Limites fixos',
  'dashboard.limitsNote':
    'São lidos do backend a cada visita. O agente não pode modificá-los.',
  'dashboard.perPayment': 'Limite por pagamento',
  'dashboard.dailyBudget': 'Orçamento diário',
  'dashboard.recipients': 'Destinatários',
  'dashboard.onlyConfirmed': 'Apenas partes confirmadas',
  'dashboard.stepsTitle': 'Como funciona',
  'dashboard.step1Title': 'Confirmação',
  'dashboard.step1Text': 'As três partes confirmam a operação antes de qualquer pagamento.',
  'dashboard.step2Title': 'Avaliação',
  'dashboard.step2Text':
    'O backend valida valor, limite diário e destinatário. A tag é verificada antes de enviar.',
  'dashboard.step3Title': 'Liquidação',
  'dashboard.step3Text':
    'Em produção: transferência de pesos ou reais digitais com comprovante verificável.',
  'dashboard.juryTitle': 'Para o júri',
  'dashboard.juryNote':
    'Rede, tokens e identidade do agente. A operação pode ser testada da mesma forma na tela principal.',
  'dashboard.network': 'Rede',
  'dashboard.tokens': 'Tokens',
  'dashboard.identity': 'Identidade',
  'dashboard.attributionTag': 'Tag de atribuição',
  'dashboard.operationAddresses': 'Endereços da operação',
  'dashboard.celoMainnet': 'Celo mainnet (chain {chainId})',

  'status.dry-run': 'Assim ficaria o pagamento',
  'status.sent': 'Pagamento enviado',
  'status.rejected': 'Pagamento rejeitado',
  'status.blocked': 'Pagamento bloqueado',
  'status.failed': 'Falha no envio',
  'message.dry-run': 'Assim ficaria o pagamento.',
  'message.sent': 'O pagamento foi enviado com sucesso.',
  'message.blocked': 'Pagamento bloqueado por uma verificação interna.',
  'message.failed': 'Não foi possível enviar. Tente novamente mais tarde.',
  'message.fallback': 'Algo deu errado. Tente novamente.',
  'message.network':
    'Não foi possível contatar a API. Verifique a URL ou o proxy de desenvolvimento.',

  'error.OVER_PER_PAYMENT_CAP': 'Excede o limite por pagamento.',
  'error.OVER_DAILY_BUDGET': 'O limite diário foi atingido.',
  'error.RECIPIENT_NOT_ALLOWED': 'Esse destinatário não está autorizado nesta operação.',
  'error.OPERATION_NOT_FOUND': 'Não encontramos essa operação.',
  'error.AMOUNT_AMBIGUOUS': 'Não entendi o valor. Escreva com vírgula, por exemplo 1500,50.',
  'error.AMOUNT_TOO_PRECISE': 'Os valores têm no máximo duas casas decimais.',
  'error.AMOUNT_NOT_POSITIVE': 'O valor deve ser maior que zero.',
  'error.AMOUNT_INVALID': 'Verifique os dados do pagamento.',
  'error.BAD_ADDRESS': 'Verifique os dados do pagamento.',
  'error.BAD_REQUEST': 'Verifique os dados do pagamento.',
  'error.SEND_FAILED': 'Não foi possível enviar. Tente novamente mais tarde.',
  'error.TAG_MISSING_OR_INVALID': 'Pagamento bloqueado por uma verificação interna.',
  'error.TAG_NOT_APPENDED': 'Pagamento bloqueado por uma verificação interna.',
  'error.DECIMALS_INVALID': 'Pagamento bloqueado por uma verificação interna.',
  'error.NETWORK_ERROR':
    'Não foi possível contatar a API. Verifique a URL ou o proxy de desenvolvimento.',

  'sim.dry-run': 'Assim ficaria',
  'sim.sent': 'Enviado',
  'sim.failed': 'Falhou',
  'sim.blocked': 'Bloqueado',

  'how.metaTitle': 'Como funciona · Chasqui Tech',
  'how.back': '← Voltar para o app',
  'how.heroTitleLead': 'Receba e pague comércio exterior',
  'how.heroTitleHighlight': 'sem passar pelo dólar.',
  'how.heroLead':
    'Chasqui Tech conecta quem exporta, quem importa e quem transporta. Organiza a operação, revisa cada pagamento em pesos ou reais digitais e o deixa pronto para liquidar, sempre dentro de limites claros.',
  'how.tryDemo': 'Testar a demonstração',
  'how.viewCode': 'Ver o código',
  'how.statsLimits': 'Limites',
  'how.statsLimitsValue': 'Fixos, no código',

  'how.summaryTitle': 'Em 30 segundos',
  'how.summaryLead':
    'Uma operação, três partes e um pagamento que pode ser explicado sem jargão.',
  'how.summary1Title': 'Três partes, uma operação',
  'how.summary1Text':
    'Quem exporta, quem importa e quem transporta a carga. As três precisam confirmar antes de que um peso seja movimentado.',
  'how.summary2Title': 'Você escolhe quem pagar',
  'how.summary2Text':
    'Você pode pagar ao exportador, ao importador ou ao transportador. Não é preciso colar endereços: você escolhe o papel.',
  'how.summary3Title': 'Você digita o valor',
  'how.summary3Text':
    'Na moeda da operação, por exemplo ARS 1.500,00. Chasqui não adivinha valores ambíguos: se não estiver claro, pede que você digite de novo.',
  'how.summary4Title': 'Chasqui revisa',
  'how.summary4Text':
    'Verifica se a parte confirmou, se o valor não supera o limite e se ainda há orçamento para o resto do dia.',
  'how.summary5Title': 'Diz o que aconteceria',
  'how.summary5Text':
    'Antes de movimentar qualquer coisa, mostra o resultado: o pagamento está pronto, foi rejeitado ou foi bloqueado. Sem surpresas.',
  'how.summary6Title': 'Fica um comprovante',
  'how.summary6Text':
    'Quando o pagamento é enviado de verdade, fica um comprovante público que qualquer pessoa pode verificar. Na demonstração, o comprovante é simulado.',

  'how.problemTitle': 'O problema',
  'how.problemLead':
    'Hoje, coordenar um pagamento de comércio exterior é mais difícil do que deveria.',
  'how.problem1Title': 'O dólar no meio',
  'how.problem1Text':
    'Exportar da Argentina e receber no Brasil geralmente obriga a passar pelo dólar. Cada conversão adiciona etapas, custo e tempo.',
  'how.problem2Title': 'Três partes, três pagamentos',
  'how.problem2Text':
    'O exportador vende, o importador compra e o transportador volta com carga. Coordenar quem paga a quem é trabalho manual.',
  'how.problem3Title': 'Confiar sem controle',
  'how.problem3Text':
    'Se um agente pode movimentar dinheiro, ele precisa de limites. Aqui os limites estão escritos no sistema e o agente não pode alterá-los.',

  'how.flowTitle': 'Como funciona',
  'how.flowLead': 'Da operação confirmada ao comprovante, em cinco passos.',
  'how.flow1Title': 'A operação é montada',
  'how.flow1Text':
    'Exportador, importador e transportador ficam associados à mesma operação. Cada um confirma sua parte.',
  'how.flow2Title': 'O pagamento é escolhido',
  'how.flow2Text':
    'Você escolhe a qual parte pagar e quanto, em pesos ou reais. O valor é escrito como na vida real: com vírgula decimal.',
  'how.flow3Title': 'Chasqui revisa as regras',
  'how.flow3Text':
    'Verifica se a parte confirmou, se o pagamento não supera o limite e se o orçamento do dia é suficiente.',
  'how.flow4Title': 'Decide-se, sem movimentar dinheiro',
  'how.flow4Text':
    'A demonstração mostra o que aconteceria. Se tudo estiver em ordem, o pagamento fica pronto. Se algo falhar, explica o motivo em linguagem simples.',
  'how.flow5Title': 'Liquida-se e fica o comprovante',
  'how.flow5Text':
    'Quando o modo real está habilitado, o pagamento sai na Celo e fica um link público para verificá-lo. Na demonstração, nada é enviado à rede.',

  'how.exampleTitle': 'Um exemplo concreto',
  'how.exampleLead':
    'Uma empresa do norte da Argentina exporta bebidas para o Brasil e traz polpas de volta. O transportador cobra pela viagem de volta.',
  'how.tableSituation': 'A situação',
  'how.tableAction': 'O que o Chasqui faz',
  'how.tableResult': 'O que você vê',
  'how.example1Situation': 'As três partes confirmaram e o pagamento é de ARS 1.500,00',
  'how.example1Action': 'Revisa os limites e o deixa pronto para liquidar',
  'how.example1Result': 'Assim ficaria o pagamento',
  'how.example2Situation': 'O transportador ainda não confirmou',
  'how.example2Action': 'Não paga a uma parte que não fechou a operação',
  'how.example2Result': 'Esse destinatário não está autorizado',
  'how.example3Situation': 'O valor supera o limite por pagamento',
  'how.example3Action': 'Ele o bloqueia antes de enviar',
  'how.example3Result': 'Excede o limite por pagamento',
  'how.example4Situation': 'O valor foi escrito como “1.500”',
  'how.example4Action': 'Não adivinha: pede que você escreva de novo',
  'how.example4Result': 'Escreva com vírgula, por exemplo 1.500,00',
  'how.calloutTitle': 'A demonstração tem limites de verdade.',
  'how.calloutText':
    'ARS 5.000 por pagamento e ARS 20.000 por dia. Servem para mostrar o freio. O envio real usa limites ainda menores e exige uma confirmação extra da equipe.',

  'how.underTitle': 'O que você vê e o que acontece por baixo',
  'how.underLead': 'A experiência é simples; a infraestrutura faz o trabalho pesado.',
  'how.under1Kicker': 'Você paga',
  'how.under1Title': 'Um valor na sua moeda',
  'how.under1Text':
    'Por baixo, uma stablecoin local da Ripio, como wARS ou wBRL, se move na rede Celo. Sem uma conversão prévia para o dólar.',
  'how.under2Kicker': 'Você confirma',
  'how.under2Title': 'Uma operação entre três',
  'how.under2Text':
    'A confirmação das partes fica registrada antes de qualquer pagamento. Se faltar uma, o pagamento a essa parte não avança.',
  'how.under3Kicker': 'Você verifica',
  'how.under3Title': 'Um comprovante público',
  'how.under3Text':
    'Cada pagamento real deixa um registro no explorador da Celo. Você pode mostrar a qualquer pessoa que a transferência existiu.',

  'how.trustTitle': 'Por que você pode confiar',
  'how.trustLead': 'Um agente útil não é o que pode tudo, mas o que respeita as regras.',
  'how.cannotTitle': 'O que o agente não pode fazer',
  'how.cannot1': 'Alterar seus próprios limites.',
  'how.cannot2': 'Pagar a uma parte que não confirmou a operação.',
  'how.cannot3': 'Superar o limite por pagamento ou o orçamento do dia.',
  'how.cannot4': 'Movimentar dinheiro a partir do navegador.',
  'how.cannot5': 'Enviar um pagamento sem deixar seu selo de atribuição.',
  'how.canTitle': 'O que fica nas suas mãos',
  'how.can1': 'Escolher a operação, a parte e o valor.',
  'how.can2': 'Confirmar a operação entre as três partes.',
  'how.can3': 'Testar tudo antes de habilitar pagamentos reais.',
  'how.can4': 'Verificar cada comprovante no explorador.',
  'how.can5': 'Decidir quando o modo real é ativado.',
  'how.quote':
    '“O agente pode decidir, mas não pode sair das regras. Os limites estão no sistema, não no humor do modelo.”',

  'how.todayTitle': 'O que existe hoje',
  'how.todayLead': 'Sem fumaça: isto é o que já pode ser visto e o que vem depois.',
  'how.today1Kicker': 'Pronto',
  'how.today1Title': 'Demonstração pública',
  'how.today1Text':
    'Você pode avaliar pagamentos pelo navegador, testar rejeições e ver os limites vigentes.',
  'how.today2Kicker': 'Preparado',
  'how.today2Title': 'Envio real',
  'how.today2Text':
    'A transferência na Celo já está implementada. É ativada apenas com uma confirmação explícita da equipe.',
  'how.today3Kicker': 'Publicada',
  'how.today3Title': 'Identidade do agente',
  'how.today3Text':
    'O agente tem carteira própria e uma identidade pública ERC-8004, com seu selo de atribuição.',
  'how.today4Kicker': 'Próximo passo',
  'how.today4Title': 'Assistente autônomo',
  'how.today4Text':
    'Que converse com as partes, proponha o pagamento e decida dentro dos limites. Hoje a avaliação é determinística.',
  'how.today5Kicker': 'Fora do escopo',
  'how.today5Title': 'Saque para banco',
  'how.today5Text':
    'Não inclui converter para pesos em uma conta bancária nem substituir os trâmites de exportação e importação.',

  'how.jurySummary': 'Dados para o júri',
  'how.currenciesValue': 'wARS e wBRL da Ripio',
  'how.attribution': 'Atribuição',
  'how.howTested': 'Como é testado',
  'how.howTestedText':
    'A demonstração avalia pagamentos sem chaves. Os scripts de envio verificam o selo antes de enviar e exigem uma confirmação explícita da equipe.',
  'how.linksTitle': 'Links',
  'how.openDemo': 'Abrir a demonstração',
  'how.repo': 'Repositório',
  'how.agentCard': 'Agent card',
  'how.agentWallet': 'Carteira do agente',
};

export const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  es: ES,
  en: EN,
  pt: PT,
};
