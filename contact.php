<?php
// Advanced contact handler with CSRF protection and logging

session_start();

// Generate CSRF token if not exists
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["submit_contact"])) {
    
    // CSRF Protection
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die(json_encode(['status' => 'error', 'message' => 'Security validation failed. Please refresh the page.']));
    }
    
    // Get and sanitize input
    $name = trim(htmlspecialchars($_POST["name"] ?? "", ENT_QUOTES, 'UTF-8'));
    $email = trim(filter_var($_POST["email"] ?? "", FILTER_SANITIZE_EMAIL));
    $subject = trim(htmlspecialchars($_POST["subject"] ?? "general", ENT_QUOTES, 'UTF-8'));
    $message = trim(htmlspecialchars($_POST["message"] ?? "", ENT_QUOTES, 'UTF-8'));
    $captcha = trim($_POST["captcha"] ?? "");
    
    // Validation
    $errors = [];
    
    // Name validation
    if (empty($name)) {
        $errors[] = "Name is required.";
    } elseif (strlen($name) > 60) {
        $errors[] = "Name is too long (max 60 characters).";
    } elseif (!preg_match("/^[a-zA-Z\s\-']+$/", $name)) {
        $errors[] = "Name can only contain letters, spaces, hyphens, and apostrophes.";
    }
    
    // Email validation
    if (empty($email)) {
        $errors[] = "Email address is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please provide a valid email address.";
    }
    
    // Message validation
    if (empty($message)) {
        $errors[] = "Message cannot be empty.";
    } elseif (strlen($message) < 5) {
        $errors[] = "Message must be at least 5 characters.";
    } elseif (strlen($message) > 1000) {
        $errors[] = "Message is too long (max 1000 characters).";
    }
    
    // CAPTCHA validation (simple math)
    if ($captcha != "8") {
        $errors[] = "Incorrect CAPTCHA answer. Please try again.";
    }
    
    // Process if no errors
    if (empty($errors)) {
        // Log the submission
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT']
        ];
        
        $logFile = 'contact_submissions.log';
        $logEntry = json_encode($logData) . PHP_EOL;
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        // In a production environment, you would send an email here
        $to = "contact@cosmicobservatory.com";
        $email_subject = "Contact Form: " . ucfirst($subject);
        $email_body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
        $headers = "From: $email\r\nReply-To: $email\r\n";
        
        // Uncomment to send actual email
        // mail($to, $email_subject, $email_body, $headers);
        
        // Return success message
        echo '<div class="form-message success">✨ Thank you ' . $name . '! Your cosmic message has been received. We\'ll reach for the stars and get back to you within 24 hours! 🌠</div>';
        
        // Regenerate CSRF token
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    } else {
        // Return error messages
        echo '<div class="form-message error">❌ ' . implode("<br>", $errors) . '</div>';
    }
} else {
    // Not a POST request
    header("Location: index.html");
    exit();
}
?>