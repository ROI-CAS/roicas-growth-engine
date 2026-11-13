# Roicas Growth Engine

Proyecto principal con Diagnóstico Digital, Web Express y el código de WP Doctor.
Consulta [la integración, los comandos y el despliegue](docs/FUSION_ROICAS.md).


## Correos con Resend (Vercel)

Los formularios de contacto y cotización llaman a `/api/send-email`, que envía
desde `ventas@roicas.com` hacia `herebus_cas@hotmail.com` usando Resend.
El cotizador tiene cinco bloques guiados: negocio, catálogo, operación, marca y
funciones, y contacto. Incluye respuestas personalizadas por bloque y enlaces a
materiales de identidad corporativa; no publica precios base ni pide presupuesto.
El aviso interno presenta todas las preguntas y respuestas por secciones.
Ambos correos usan el logo real de la web desde /logo-roicas-email.png.
Después del aviso interno se envía una confirmación personalizada al correo del
solicitante, con referencia y enlace a WhatsApp. Cada correo usa su propia clave
de idempotencia; si falla la confirmación se permite reintentar sin duplicar el aviso.
El formulario confirma el envío cuando Resend devuelve un identificador de correo;
esto confirma la aceptación por el proveedor, no la llegada a la bandeja de entrada.

1. Verificar `roicas.com` en Resend y añadir los registros DNS que indique.
2. Guardar `RESEND_API_KEY` como variable sensible del proyecto Vercel, en Production.
3. Desplegar nuevamente después de configurar o cambiar la variable.

La clave se usa solo en el servidor. No debe tener prefijo `VITE_` ni incluirse
en GitHub. Los reintentos usan una clave de idempotencia para evitar correos duplicados.
Las copias de cotizaciones en el navegador son locales; no son una base de datos central.
