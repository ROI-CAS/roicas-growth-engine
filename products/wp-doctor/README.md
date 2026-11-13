# WP Doctor · Roicas

Referencia vigente: PRD **v1.3**, archivo `PRD_WebExpress_WP_Doctor v3.md`. Workers TypeScript con landing, captación y operación comercial preparadas, motor PageSpeed y ejecutor Playwright de laboratorio privado. [Estado actual y pendientes](docs/CURRENT_STATUS.md).

La captación publicada permanece cerrada. Browser Run solo se ha habilitado para pruebas privadas en sitios propios: no existe escáner público activo ni se han enviado reportes reales. Completar requisitos de operación/privacidad antes de producción. Los resultados de pruebas anteriores y la existencia de configuración no equivalen al MVP completo.

## Preparación y comprobaciones

El despliegue usa Node 24.x, npm y Windows/Linux con soporte de workerd. Las comprobaciones iniciales locales se ejecutaron con Node 25.8.2; Cloudflare compiló con Node 24.18.0. Los scripts de instalación permitidos se limitan a las versiones fijadas de esbuild y workerd en `package.json`.

```powershell
npm ci
npm run check
$env:PLAYWRIGHT_BROWSERS_PATH = "$PWD/.cache/playwright"
npx playwright install chromium --only-shell
npm run test:runner
npm run test:e2e
```

`check` ejecuta TypeScript, ESLint, pruebas de contratos/integración y build. Las pruebas D1 usan Miniflare; E2E usa Chromium y axe. Siteverify y la identidad Access se simulan exclusivamente en fixtures, mediante un verificador controlado y JWT firmados de prueba. Esto no acredita un deploy ni una configuración Access real.

## Vista local

```powershell
npm run db:local
npm run dev
```

Abrir `http://localhost:8787`. Sin claves y configuración reales, la landing se muestra pero el envío queda deshabilitado. No existe un bypass local de Access en los Workers.

Para recorrer el formulario y el panel con **datos ficticios**, ejecutar:

```powershell
npm run demo:fixtures
```

La demo usa D1 efímero: público `http://127.0.0.1:4173`; panel `http://127.0.0.1:4174`. Sustituye el widget y Siteverify por fixtures identificados como simulados. La ruta local `http://127.0.0.1:4174/__fixture__/login` emite una cookie de identidad ficticia; después abre la raíz del panel. Esas rutas y sustituciones no se incluyen en los entrypoints de Wrangler. No introducir datos reales en fixtures ni exponer esos puertos a Internet.

## Arquitectura y despliegue

Para la landing de preparación mediante la integración GitHub de Cloudflare, seleccionar el Worker `webexpress-wp-doctor`, directorio raíz `/`, build `npm run build` y deploy `npx wrangler deploy`. El archivo raíz `wrangler.jsonc` define el Worker y sus assets. Esta vista usa `ENVIRONMENT=preview`: no recibe solicitudes ni necesita D1, claves o panel. La captación completa requiere los pasos y configuraciones por entorno de la guía siguiente.

- [Arquitectura](docs/ARCHITECTURE.md)
- [Seguridad y límites](docs/SECURITY.md)
- [Configuración y deploy Cloudflare](docs/DEPLOYMENT_CLOUDFLARE.md)
- [Publicar doctor.roicas.com mediante Vercel](docs/DEPLOYMENT_VERCEL.md)
- [Embudo Diagnóstico Express y estado de operación](docs/DIAGNOSTICO_EXPRESS.md)
- [Conectar diagnóstico y entrega automática](docs/ACTIVACION_DIAGNOSTICO.md)
- [Resultados de esta entrega](docs/DELIVERY.md)
- [Ejecutor aislado y evidencia SSRF](docs/RUNNER_SECURITY.md)
- [Auditoría frente al PRD v1.3](docs/AUDITORIA_PRD_V1_3.md)

Las migraciones están en `infra/migrations`. Los secretos de cifrado y HMAC no van en Git. La configuración remota se genera solo con IDs de recursos reales; los archivos locales no contienen IDs inventados de producción. No hay dependencia de Docker, PostgreSQL ni Redis.

## Funcionalidad y límites

- Catálogo configurable en COP, condiciones y páginas legales en borrador hasta revisión del responsable.
- Aceptación de datos y autorización de revisión en una casilla, registradas con versión; sin opt-in de marketing. El diagnóstico PDF solicita WhatsApp y omite correo.
- Contactos, notas, próximas acciones y textos de ofertas cifrados AES-GCM con contexto por registro/campo.
- Idempotencia, batch transaccional D1, límites por IP/dominio, Siteverify y protección de origen.
- Identidad Access verificada criptográficamente y rol activo en D1; técnicos no acceden al panel comercial de esta etapa.
- Ofertas registradas manualmente. Marcar «Enviada» registra una comunicación ya realizada; no dispara un envío.
- Embudo inicial sin PII, medición de navegación opcional. Se cuentan eventos y etapas, no visitantes únicos ni cohortes. CAC, margen y pagos no se calculan.
- Retención automática completa, solicitudes de supresión, cifrado con rotación de claves y restauración son pendientes antes de admitir datos reales en producción. Solo se limpian automáticamente los contadores de rate limit expirados.
- Browser Run, outbox, Queues, R2, informes técnicos y APIs opcionales pertenecen a la siguiente etapa y no se simulan como implementados.
