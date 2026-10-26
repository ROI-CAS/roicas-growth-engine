# Welcome to your Lovable project

## Correos con Resend (Vercel)

Los formularios de contacto y cotización llaman a `/api/send-email`, que envía
desde `ventas@roicas.com` hacia `herebus_cas@hotmail.com` usando Resend.
El cotizador tiene tres pasos sin preguntas técnicas ni presupuesto obligatorio.
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

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
