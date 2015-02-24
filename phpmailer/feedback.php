<?php

require_once 'mailSender.php';

$body = '<style> *{font-family: Arial 12px} tr td:first-child{color:#28AAE2} </style>'
        . '<table> '
        . '<tr><td>Kullanıcı</td>'. $_POST['user'] .'<td></td>'
        . '<tr><td>Kullanıcı ID</td><td>'. $_POST['user_id'].'</td>'
        . '<tr><td>Kullanıcı Yorumu</td><td>'. $_POST['user_info'].'</td>'
        . '<tr><td>Sunucu Tarih-Zaman</td><td>'.$date.'</td>'
        . '<tr><td>Eklenen Resim Sayısı</td><td>'.$count.'</td>'
        . '</table>';


// Compose  
$mail->Subject = "soRate Uygulama Geribildirim Mesajı";     // Subject (which isn't required)  
$mail->Body = $body; // Body of our message  

$mail->AddAddress("cihad.turhan@ngine.com.tr"); // Where to send it  // Send To
/*$mail->AddAddress("a.altintop@ngine.com.tr");  
 $mail->AddAddress("halid.yildiz@sbtanaliz.com"); // Where to send it  // Send To  
  $mail->AddAddress("fatih.demirhan@sbtanaliz.com"); // Where to send it  // Send To
  $mail->AddAddress("emrah.saglik@sbtanaliz.com"); // Where to send it  // Send To
   // Where to send it  // Send To */


echo $mail->send();      // Send!