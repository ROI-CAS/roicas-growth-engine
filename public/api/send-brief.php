<?php
/**
 * ROICAS E-commerce Brief Email Dispatcher & Logger
 * Target Recipient: herebus_cas@hotmail.com
 * Official Sender: ventas@roicas.com
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Respond to OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Read JSON input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

$leadId = isset($data['lead_id']) ? htmlspecialchars($data['lead_id']) : ('ROI-EC-' . time());
$businessName = isset($data['business']['business_name']) ? htmlspecialchars($data['business']['business_name']) : 'Sin nombre';
$contactName = isset($data['contact']['contact_name']) ? htmlspecialchars($data['contact']['contact_name']) : 'Cliente';
$contactEmail = isset($data['contact']['contact_email']) ? filter_var($data['contact']['contact_email'], FILTER_SANITIZE_EMAIL) : '';
$whatsapp = isset($data['contact']['full_whatsapp']) ? htmlspecialchars($data['contact']['full_whatsapp']) : '';
$complexity = isset($data['internal']['complexity_hint']) ? strtoupper(htmlspecialchars($data['internal']['complexity_hint'])) : 'ESTANDAR';

// Check email notification block
$htmlBody = isset($data['email_notification']['html']) ? $data['email_notification']['html'] : '';
$textSummary = isset($data['summary_text']) ? $data['summary_text'] : '';

$recipient = 'herebus_cas@hotmail.com';
$sender = 'ventas@roicas.com';
$subject = "[Brief E-commerce] Nueva cotización: {$businessName} ({$contactName}) - Complejidad {$complexity}";

// Log to file for audit & zero lead loss
$logDir = __DIR__ . '/../../storage';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}
$logFile = $logDir . '/brief_leads.jsonl';
$logEntry = json_encode([
    'timestamp' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'lead' => $data
], JSON_UNESCAPED_UNICODE) . "\n";
@file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);

// Prepare email headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = "From: ROICAS Ventas <{$sender}>";
if ($contactEmail) {
    $headers[] = "Reply-To: {$contactName} <{$contactEmail}>";
}
$headers[] = 'X-Mailer: ROICAS-Brief-Engine/1.0';

// Send email via PHP mail()
$mailSent = false;
if (!empty($htmlBody)) {
    $mailSent = @mail($recipient, '=?UTF-8?B?' . base64_encode($subject) . '?=', $htmlBody, implode("\r\n", $headers));
}

// Response
http_response_code(200);
echo json_encode([
    'success' => true,
    'lead_id' => $leadId,
    'mail_sent' => $mailSent,
    'logged' => true,
    'recipient' => $recipient,
    'sender' => $sender
]);
