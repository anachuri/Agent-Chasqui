# Chasqui Tech — Especificación

App: https://agente-chasqui-tech.vercel.app

Agente para el hackathon **Agents on Open Rails** (Celo × Ripio), pista **Stable Agents: LatAm**.

## Qué es
Un agente que coordina y liquida los pagos de operaciones de exportación e importación en stablecoin locales de Ripio (wBRL, wARS), sin pasar por el dolar. conecta a tres partes:una empresa que exporta una que importa y un transportista que transpota la carga para el regreso.
Caso de ejemplo: una empresa del norte argentino exporta bebidas a Brasil, otra empresa necesita insumos importados (pulpas y concentrados frutales) y el transportista aprovecha el viaje para traerlos.

## Qué es real y qué no (completar antes de entregar)
- Real: _COMPLETAR (pagos en Celo mainnet, hashes)_
- Simulado o de ejemplo: "las empresas, la carga y el transportista de la operacion son de ejemplo; solo se prueba el pago on-chain"
- Fuera de alcance por ahora: conversión a pesos en cuenta bancaria y trámites de exportación.

## Reglas del hackathon y evidencia
| Regla | Estado | Evidencia |
|---|---|---|
| Solo Celo mainnet (42220) | pendiente | _enlace al explorador_ |
| Pagos con wFIAT real de Ripio | pendiente | _hash del pago_ |
| Tag ERC-8021 en cada transacción | pendiente | _hash verificado_ |
| Identidad ERC-8004 desde la wallet del agente | pendiente | _enlace_ |
| Gas pagado en stablecoin | pendiente | _hash_ |
| Repo público | pendiente | _enlace_ |

## Límites (código fijo, el agente no puede cambiarlos)
- Tope por pago.
- Presupuesto diario.
- Solo se paga a las partes confirmadas de cada operación (exportador, importador y transportista).
- Modo ensayo por defecto; los pagos reales exigen dos variables explícitas.
- Montos siempre en moneda local del usuario.

## Qué decide el agente
- Propone el emparejamiento entre exportador, importador y transportista de una operación.
- Decide a quién pagar y cuánto, solo dentro de los límites.
- Si un pago es rechazado, lo explica en lenguaje simple y no busca rodeos.

## Qué no hace
- No modifica sus propios límites.
- No maneja claves de las empresas: la clave del agente vive solo en variables de entorno del servidor.
- No envía transacciones sin el tag de atribución.
- No reemplaza los trámites de exportación e importación ni da asesoramiento legal.

## Cómo se prueba
- `npm test`: lógica de límites, montos, tag y agent card.
- `npm run dry-run`: ensayo del pago sin mover dinero.
- `npm run register`: ensayo del registro ERC-8004, que valida la agent card antes de enviar.

## Arquitectura de transacciones
- Todas las transacciones las envía la wallet del agente, con el tag de atribución ERC-8021 agregado en el cliente, y el gas lo paga esa misma wallet en USDC mediante fee abstraction.
- Cada operación la confirman las partes desde la aplicación; las empresas no gestionan gas ni claves.
- No se usan relayers ni gas patrocinado por terceros. (Confirmar al entregar que sigue siendo cierto.)
- Los pagos reales se limitan a las partes confirmadas de cada operación y a los topes definidos en código.

- ## Origen de usuarios y volumen
- Billeteras de la demo: pendiente de completar cuando existan, indicando cuáles son del equipo y cuáles de personas externas con actividad previa en Celo.
- Las billeteras creadas y fondeadas por el equipo no se cuentan como usuarios independientes.

- ## Lo que ve el usuario y lo que pasa por debajo
| Lo que ve el usuario | Lo que pasa por debajo |
|---|---|
| Un cobro o pago en pesos o reales | Una transferencia de wARS o wBRL en Celo mainnet, con tag |
| Operación confirmada por las partes | Confirmación registrada antes de ejecutar cualquier pago |
| Un comprobante | Un enlace al explorador con el hash de la transacción |
