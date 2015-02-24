<?php

require_once 'mailSender.php';


$date = $MY_GET['servertime'];
$active = $MY_GET['active_module'];
$problem = $MY_GET['type'];
$detail = $MY_GET['detail'];


$body = "<style> *{font-family: Arial 12px} tr td:first-child{color:#28AAE2} </style>"
        . "<table> "
        . "<tr><td>Kullanıcı</td><td>$user_name</td>"
        . "<tr><td>Kullanıcı ID</td><td>$uid</td>"
        . "<tr><td>Sunucu Tarih-Zaman</td><td>$date</td>"
        . "<tr><td>Aktif Modül</td><td>$active</td>"
        . "<tr><td>Problem</td><td>$problem</td>"
        . "<tr><td>Problem Ayrıntısı</td><td>$detail</td>"
        . "</table>";


// Compose  
$mail->Subject = "soRate Uygulama Hata Mesajı";     // Subject (which isn't required)  
$mail->Body = $body; // Body of our message  

$mail->AddAddress("cihad.turhan@ngine.com.tr"); // Where to send it  // Send To

/*$mail->AddAddress("a.altintop@ngine.com.tr");   $mail->AddAddress("halid.yildiz@sbtanaliz.com"); // Where to send it  // Send To  
  $mail->AddAddress("fatih.demirhan@sbtanaliz.com"); // Where to send it  // Send To
  $mail->AddCC("emrah.saglik@sbtanaliz.com"); // Where to send it  // Send To
   // Where to send it  // Send To */


echo $mail->send();      // Send!
