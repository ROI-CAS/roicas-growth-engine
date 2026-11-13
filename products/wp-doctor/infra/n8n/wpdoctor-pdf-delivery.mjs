import {
  workflow,
  node,
  trigger,
  ifElse,
  expr,
  newCredential,
} from "@n8n/workflow-sdk";
const s0 = trigger({
  type: "n8n-nodes-base.webhook",
  version: 2.1,
  config: {
    name: "Entrada WP Doctor",
    parameters: {
      httpMethod: "POST",
      path: "wpdoctor-delivery-v1",
      authentication: "none",
      responseMode: "responseNode",
      options: {},
    },
  },
  output: [
    {
      json: {
        body: {
          delivery_id: "00000000-0000-4000-8000-000000000001:whatsapp",
          token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          dry_run: true,
        },
      },
    },
  ],
});
const s1 = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Validar solicitud WP Doctor",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const raw = $input.first().json;\nconst b = raw.body ?? raw;\nif (!b || typeof b !== 'object' || Array.isArray(b) || Object.keys(b).some(k => !['delivery_id','token','dry_run'].includes(k))) throw new Error('Solicitud no valida');\nif (!/^[a-f0-9-]{36}:whatsapp$/.test(b.delivery_id || '') || !/^[A-Za-z0-9_-]{43}$/.test(b.token || '') || typeof b.dry_run !== 'boolean') throw new Error('Solicitud no valida');\nreturn [{json:{delivery_id:b.delivery_id,token:b.token,dry_run:b.dry_run}}];",
    },
  },
  output: [
    {
      json: {
        delivery_id: "00000000-0000-4000-8000-000000000001:whatsapp",
        token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        dry_run: true,
      },
    },
  ],
});
const s2 = ifElse({
  type: "n8n-nodes-base.if",
  version: 2.3,
  config: {
    name: "Solo simulación",
    parameters: {
      conditions: {
        options: {
          caseSensitive: true,
          leftValue: "",
          typeValidation: "strict",
        },
        conditions: [
          {
            leftValue: expr("{{ $json.dry_run }}"),
            rightValue: true,
            operator: { type: "boolean", operation: "true", singleValue: true },
          },
        ],
        combinator: "and",
      },
      options: {},
    },
  },
  output: [{ json: { dry_run: true } }],
});
const s3 = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Responder simulación",
    parameters: {
      respondWith: "json",
      responseBody:
        '{"dry_run":true,"accepted":false,"message":"Simulacion validada; no se enviaron mensajes."}',
      options: { responseCode: 200 },
    },
  },
  output: [{ json: { dry_run: true, accepted: false } }],
});
const s4 = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.5,
  config: {
    name: "Reclamar entrega en Worker",
    parameters: {
      method: "POST",
      url: "https://webexpress-wp-doctor.casinmiedo.workers.dev/api/v1/dispatch/claim",
      authentication: "none",
      sendBody: true,
      contentType: "json",
      specifyBody: "json",
      jsonBody: expr(
        "{{ ({delivery_id:$json.delivery_id,token:$json.token}) }}",
      ),
      options: {
        timeout: 15000,
        redirect: { redirect: { followRedirects: false } },
        response: {
          response: {
            fullResponse: true,
            neverError: true,
            responseFormat: "json",
          },
        },
      },
    },
  },
  output: [
    { json: { statusCode: 200, body: { authorized: false, dry_run: true } } },
  ],
});
const s5 = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Validar autorización de documento",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const r=$input.first().json;\nconst b=r.body;\nif(r.statusCode!==200 || b?.authorized!==true || b?.dry_run!==false) return [{json:{allow_send:false,dry_run:b?.dry_run===true}}];\nconst original=$('Validar solicitud WP Doctor').first().json;\nconst p=b.payload;\nif(b.delivery_id!==original.delivery_id || b.business_phone_number_id!=='1007628075756742' || p?.messaging_product!=='whatsapp' || p?.type!=='template' || !/^[1-9][0-9]{7,14}$/.test(p?.to||'')) throw new Error('Autorizacion de envio no valida');\nconst header=p.template?.components?.find(c=>c.type==='header');\nconst doc=header?.parameters?.[0];\nif(doc?.type!=='document' || !/^https:\\/\\/doctor\\.roicas\\.com\\/informe\\/[A-Za-z0-9_-]{43}\\.pdf$/.test(doc?.document?.link||'') || doc.document.filename!=='Diagnostico-WebExpress.pdf') throw new Error('Documento no autorizado');\nreturn [{json:{allow_send:true,business_phone_number_id:b.business_phone_number_id,payload:p}}];",
    },
  },
  output: [{ json: { allow_send: false, dry_run: true } }],
});
const s6 = ifElse({
  type: "n8n-nodes-base.if",
  version: 2.3,
  config: {
    name: "Envío autorizado",
    parameters: {
      conditions: {
        options: {
          caseSensitive: true,
          leftValue: "",
          typeValidation: "strict",
        },
        conditions: [
          {
            leftValue: expr("{{ $json.allow_send }}"),
            rightValue: true,
            operator: { type: "boolean", operation: "true", singleValue: true },
          },
        ],
        combinator: "and",
      },
      options: {},
    },
  },
  output: [{ json: { allow_send: false } }],
});
const s7 = node({
  type: "@kapso/n8n-nodes-kapso.kapso",
  version: 1,
  config: {
    name: "Enviar PDF por Kapso",
    parameters: {
      resource: "whatsAppMessage",
      operation: "sendRaw",
      phoneNumberId: "1007628075756742",
      payloadJson: expr("{{ $json.payload }}"),
    },
    credentials: { kapsoApi: newCredential("Kapso account") },
  },
  output: [{ json: { messages: [{ id: "wamid.fixture" }] } }],
});
const s8 = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Confirmar aceptación Kapso",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const b=$input.first().json;\nconst id=b.messages?.[0]?.id ?? b.data?.messages?.[0]?.id ?? b.message?.id;\nif(typeof id!=='string' || !id || id.length>200) throw new Error('Resultado de envio no confirmado');\nreturn [{json:{accepted:true,provider_id:id}}];",
    },
  },
  output: [{ json: { accepted: true, provider_id: "wamid.fixture" } }],
});
const s9 = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Responder entrega",
    parameters: {
      respondWith: "json",
      responseBody: expr("{{ $json }}"),
      options: { responseCode: 200 },
    },
  },
  output: [{ json: { accepted: true, provider_id: "wamid.fixture" } }],
});
const s10 = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Responder bloqueo",
    parameters: {
      respondWith: "json",
      responseBody: '{"accepted":false,"error":"dispatch_not_authorized"}',
      options: { responseCode: 409 },
    },
  },
  output: [{ json: { accepted: false } }],
});
export default workflow("wpdoctor-pdf-delivery", "WP Doctor · PDF por WhatsApp")
  .add(s0)
  .to(s1)
  .to(
    s2
      .onTrue(s3)
      .onFalse(s4.to(s5).to(s6.onTrue(s7.to(s8).to(s9)).onFalse(s10))),
  )
  .group("Autorización de un solo uso", [s4, s5])
  .group("Entrega del PDF", [s7, s8]);
