export const BRAND_LOGO = "https://www.roicas.com/logo-roicas-email.png";
export const brandHeader = '<tr><td style="padding:22px 28px;background:#ffffff;border-bottom:3px solid #b21f31"><a href="https://www.roicas.com" style="text-decoration:none"><img src="' + BRAND_LOGO + '" width="240" height="80" alt="ROICAS · CRM y Automatizaciones" style="display:block;width:240px;max-width:100%;height:auto;border:0"></a></td></tr>';
export const escapeEmailHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
