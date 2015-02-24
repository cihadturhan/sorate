<?php

require 'PHPMailer/class.phpmailer.php';
date_default_timezone_set('Europe/Istanbul');
$mail = new PHPMailer();
// Set up SMTP  
$mail->IsSMTP();                // Sets up a SMTP connection  
$mail->SMTPDebug = false;          // This will print debugging info  
$mail->SMTPAuth = true;         // Connection with the SMTP does require authorization  
$mail->SMTPSecure = "ssl";      // Connect using a TLS connection  
$mail->Host = "mail.sbtanaliz.com";
$mail->Port = 465;
$mail->CharSet = 'UTF-8';       // SMS uses 7-bit encoding  
// Authentication  
$mail->Username = "noreply@sbtanaliz.com"; // Login  
$mail->Password = "1234567"; // Password  

$mail->From = "noreply@sbtanaliz.com";
$mail->FromName = "soRate";
$mail->Subject = "This is the subject";
$mail->AltBody = "This is the body when user views in plain text format"; //Text Body
$mail->WordWrap = 100; // set word wrap

$mail->IsHTML(true);

?>