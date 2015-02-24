<?php

require_once './mailSender.php';


$id = $_POST['user_id'];
$user_name = $_POST['user_name'];
$user_id = $_POST['user_id'];
$date = date('Y-m-d H:i:s');
$query = $_POST['query'];
$textStatus = $_POST['textStatus'];
$message = $_POST['message'];

$body = "<style> *{font-family: Arial 12px} tr td:first-child{color:#28AAE2} </style>"
        . "<table> "
        . "<tr><td>Kullanıcı</td><td>$user_name</td>"
        . "<tr><td>Kullanıcı ID</td><td>$user_id</td>"
        . "<tr><td>Tarih-Zaman</td><td>$date</td>"
        . "<tr><td>Atılan Sorgu</td><td>$query</td>"
        . "<tr><td>Dönen Cevap</td><td>$textStatus</td>"
        . "<tr><td>Ayrıntılı Cevap</td><td>$message</td>"
        . "</table>";


// Compose  
$mail->Subject = "soRate Sorgu Hata Mesajı";     // Subject (which isn't required)  
$mail->Body = $body; // Body of our message  

$mail->AddAddress("cihad.turhan@ngine.com.tr"); // Where to send it  // Send To
/*$mail->AddAddress("a.altintop@ngine.com.tr");  
$mail->AddAddress("halid.yildiz@sbtanaliz.com"); // Where to send it  // Send To  
$mail->AddAddress("fatih.demirhan@sbtanaliz.com"); // Where to send it  // Send To 
$mail->AddCC("emrah.saglik@sbtanaliz.com"); // Where to send it  // Send To  
 // Where to send it  // Send To  */


echo $mail->send();      // Send!

