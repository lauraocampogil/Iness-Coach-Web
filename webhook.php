<?php
// webhook.php - À placer dans le répertoire racine de votre site
require_once('vendor/composer/autoload.php');

// ====== CONFIGURATION - À MODIFIER ======
if (file_exists('.env')) {
    $lines = file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

$stripe_secret_key = $_ENV['STRIPE_SECRET_KEY'] ?? '';
$stripe_webhook_secret = $_ENV['STRIPE_WEBHOOK_SECRET'] ?? '';

\Stripe\Stripe::setApiKey($stripe_secret_key);

// Mapping des prix Stripe vers vos fichiers PDF
$ebook_files = [
    'price_prod_T7C12RFJzkpfjy' => [
        'file' => 'pdf/le-mental-arme-invisible.pdf',
        'title' => 'Le mental : l\'arme invisible des jeunes footballeurs',
        'price' => '10€'
    ],
    'price_prod_T7C4fbRKCJpK6k' => [
        'file' => 'pdf/comment-garder-le-plaisir.pdf',
        'title' => 'Comment garder le plaisir au cœur du jeu ?',
        'price' => '10€'
    ],
    'price_prod_T7C603Y6VadDEz' => [
        'file' => 'pdf/se-relever-apres-echec.pdf',
        'title' => 'Se relever après un échec',
        'price' => '10€'
    ],
    'price_prod_T7C59uJGL5ECMk' => [
        'file' => 'pdf/communication-non-violente.pdf',
        'title' => 'La communication non violente dans le sport',
        'price' => '15€'
    ],
    'price_prod_T7C734WyZ0jX9Q' => [
        'file' => 'pdf/4-piliers-preparation-mentale.pdf',
        'title' => 'Les 4 piliers de la préparation mentale',
        'price' => '10€'
    ]
];

// ====== TRAITEMENT DU WEBHOOK ======
$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

// Log pour débogage
error_log("Webhook reçu : " . date('Y-m-d H:i:s'));

try {
    $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $stripe_webhook_secret);
} catch(\UnexpectedValueException $e) {
    error_log('Payload invalide');
    http_response_code(400);
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    error_log('Signature invalide');
    http_response_code(400);
    exit();
}

// Traitement des différents types d'événements
switch ($event['type']) {
    case 'checkout.session.completed':
        $session = $event['data']['object'];
        handleSuccessfulPayment($session, $ebook_files);
        break;
        
    case 'payment_intent.succeeded':
        error_log('Paiement confirmé : ' . $event['data']['object']['id']);
        break;
        
    default:
        error_log('Type d\'événement non géré : ' . $event['type']);
}

function handleSuccessfulPayment($session, $ebook_files) {
    // Récupération des informations client
    $customer_email = $session['customer_details']['email'];
    $customer_name = $session['customer_details']['name'] ?? 'Client';
    
    error_log("Paiement réussi pour : $customer_email");
    
    try {
        // Récupération des articles achetés
        $line_items = \Stripe\Checkout\Session::allLineItems($session['id']);
        
        foreach ($line_items['data'] as $item) {
            $price_id = $item['price']['id'];
            
            if (isset($ebook_files[$price_id])) {
                $ebook = $ebook_files[$price_id];
                $success = sendEbookEmail($customer_email, $customer_name, $ebook);
                
                if ($success) {
                    error_log("E-book envoyé avec succès : " . $ebook['title']);
                } else {
                    error_log("Erreur envoi e-book : " . $ebook['title']);
                    // Optionnel : envoyer une notification admin
                    notifyAdmin($customer_email, $ebook['title'], "Échec envoi automatique");
                }
            } else {
                error_log("Prix ID non reconnu : $price_id");
            }
        }
        
    } catch (Exception $e) {
        error_log("Erreur traitement paiement : " . $e->getMessage());
        notifyAdmin($customer_email, "Erreur", $e->getMessage());
    }
}

function sendEbookEmail($email, $name, $ebook) {
    $file_path = $ebook['file'];
    
    // Vérifier que le fichier existe
    if (!file_exists($file_path)) {
        error_log("Fichier PDF introuvable : $file_path");
        return false;
    }
    
    // Préparation de l'email
    $to = $email;
    $subject = "Votre e-book InessCoach : " . $ebook['title'];
    
    // Corps de l'email (HTML)
    $html_message = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b5d17; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            .button { background: #3b5d17; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🎉 Merci pour votre achat !</h1>
            </div>
            <div class='content'>
                <p>Bonjour <strong>$name</strong>,</p>
                
                <p>Merci d'avoir acheté notre e-book :</p>
                <h2 style='color: #3b5d17;'>📚 " . $ebook['title'] . "</h2>
                
                <p>Vous trouverez votre e-book en <strong>pièce jointe</strong> de cet email. Vous pouvez le télécharger et le conserver définitivement.</p>
                
                <p><strong>💡 Conseils :</strong></p>
                <ul>
                    <li>Sauvegardez le fichier sur votre ordinateur</li>
                    <li>Vous pouvez l'imprimer pour une lecture plus confortable</li>
                    <li>N'hésitez pas à le relire plusieurs fois pour bien intégrer les concepts</li>
                </ul>
                
                <p>Si vous avez des questions ou besoin d'accompagnement personnalisé, n'hésitez pas à nous contacter.</p>
                
                <p>Bonne lecture et merci de votre confiance ! 🚀</p>
                
                <hr style='margin: 30px 0; border: 1px solid #ddd;'>
                
                <p><strong>L'équipe InessCoach</strong><br>
                Préparation mentale pour jeunes footballeurs</p>
                
                <p>📧 ferrahiness.info@gmail.com<br>
                🌐 https://iness-coach.com</p>
            </div>
            
            <div class='footer'>
                <p>Cet email a été envoyé automatiquement suite à votre achat.<br>
                Merci de ne pas répondre à cet email.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Version texte simple
    $text_message = "
    Bonjour $name,
    
    Merci d'avoir acheté notre e-book : " . $ebook['title'] . "
    
    Vous trouverez votre e-book en pièce jointe de cet email.
    
    Bonne lecture !
    
    L'équipe InessCoach
    ferrahiness.info@gmail.com
    ";
    
    // Headers pour email multipart avec pièce jointe
    $boundary = md5(uniqid(time()));
    
    $headers = [
        'From: InessCoach <noreply@iness-coach.com>',
        'Reply-To: ferrahiness.info@gmail.com',
        'MIME-Version: 1.0',
        'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Construction du message multipart
    $message = "--$boundary\r\n";
    $message .= "Content-Type: multipart/alternative; boundary=\"alt-$boundary\"\r\n\r\n";
    
    // Version texte
    $message .= "--alt-$boundary\r\n";
    $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $message .= $text_message . "\r\n\r\n";
    
    // Version HTML
    $message .= "--alt-$boundary\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $message .= $html_message . "\r\n\r\n";
    
    $message .= "--alt-$boundary--\r\n\r\n";
    
    // Pièce jointe PDF
    $pdf_content = file_get_contents($file_path);
    $pdf_encoded = base64_encode($pdf_content);
    $pdf_chunks = chunk_split($pdf_encoded);
    
    $message .= "--$boundary\r\n";
    $message .= "Content-Type: application/pdf; name=\"" . basename($file_path) . "\"\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n";
    $message .= "Content-Disposition: attachment; filename=\"" . basename($file_path) . "\"\r\n\r\n";
    $message .= $pdf_chunks . "\r\n";
    $message .= "--$boundary--\r\n";
    
    // Envoi de l'email
    $success = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if ($success) {
        // Log de succès
        error_log("Email envoyé avec succès à $email pour " . $ebook['title']);
        
        // Optionnel : notification admin
        $admin_subject = "Vente e-book : " . $ebook['title'];
        $admin_message = "Nouveau achat :\n- Client: $name ($email)\n- Produit: " . $ebook['title'] . "\n- Prix: " . $ebook['price'];
        mail('ferrahiness.info@gmail.com', $admin_subject, $admin_message);
        
    } else {
        error_log("Échec envoi email à $email");
    }
    
    return $success;
}

function notifyAdmin($customer_email, $product_title, $error_message) {
    $subject = "🚨 Erreur webhook Stripe";
    $message = "Erreur lors du traitement d'un paiement :\n\n";
    $message .= "Client : $customer_email\n";
    $message .= "Produit : $product_title\n";
    $message .= "Erreur : $error_message\n";
    $message .= "Date : " . date('Y-m-d H:i:s') . "\n";
    
    mail('ferrahiness.info@gmail.com', $subject, $message);
}

// Réponse de succès pour Stripe
http_response_code(200);
echo "OK";
?>