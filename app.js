const { createBot, createProvider, createFlow, addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')

/**
 * Declaramos las conexiones de PostgreSQL
 */

const POSTGRES_DB_HOST = 'localhost'
const POSTGRES_DB_USER = 'postgres'
const POSTGRES_DB_PASSWORD = 'qwerty'
const POSTGRES_DB_NAME = 'postgres'
const POSTGRES_DB_PORT = '5433'

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowSecundario = addKeyword(['3', 'siguiente']).addAnswer(['📄 Otro flujo'])

const flowUno = addKeyword(['1', 'uno']).addAnswer(
    [
        '📄 Aquí encontras las ayuda que necesitas',
        '\n*3* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDos = addKeyword(['2', 'dos']).addAnswer(
    [
        '🙌 Aquí encontrarás ayuda de un asesor',
        '\n*3* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙌 Hola tenemos algo que contarte *responde:* ')
    .addAnswer(
        [
            '👉 *1* Si quieres saber más',
            '👉 *2* si quieres contactar un asesor',
        ],
        null,
        null,
        [flowUno,  flowDos]
    )

const main = async () => {
    try {
        const adapterDB = new PostgreSQLAdapter({
            host: POSTGRES_DB_HOST,
            user: POSTGRES_DB_USER,
            database: POSTGRES_DB_NAME,
            password: POSTGRES_DB_PASSWORD,
            port: POSTGRES_DB_PORT,
        })
        const adapterFlow = createFlow([flowPrincipal])
        const adapterProvider = createProvider(BaileysProvider)
        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        })
        QRPortalWeb()
    } catch (error) {
        console.error('Error al inicializar el bot:', error);
    }
}

main().catch(error => console.error('Error en la función principal:', error));


// Manejo global de errores para promesas no manejadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
