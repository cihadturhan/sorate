<?php

function print_subfooter() {
    $website = Array();
    $website['sorate'] = "http://www.sbtanaliz.com";
    $website['sosyalim'] = "http://www.sourceone.com.tr";
    $site = $website[$_SESSION['hostname']];

    global $langArr;
	echo '';
    /*echo '<div id="copyright">
                <a href="' . $site . '" target="_blank"> <img src="img/brand_' . $_SESSION['hostname'] . '_logo.png"></a>
                <strong> Copyright © 2013</strong> 
                <span id="footer_info"> <img src="img/' . $_SESSION['hostname'] . '_16.png" alt="' . $_SESSION['hostname'] . '"> ' . $langArr['is_a_' . $_SESSION['hostname']] . ' </span>
            </div>';*/
}

function print_brand() {
    if ($_SESSION['hostname'] == 'sorate') {
        echo '';
        "<!--

        SSSSSSSSSSSSS    BBBBBBBBBBBBBB     TTTTTTTTTTTTTTTTTTTTTTT                       
     SS:::::::::::::::S  B::::::::::::::B   T:::::::::::::::::::::T               
    S:::::SSSSSS::::::S  B:::::BBBBB:::::B  T:::::::::::::::::::::T                
    S:::::S     SSSSSSS  B::::B     B:::::B TTTTTTTT::::::TTTTTTTTT               
    S:::::S              B::::B     B:::::B         T:::::T                      
    S:::::S              B::::B     B:::::B         T:::::T  >:>                   
     S::::SSSS           B::::BBBBBB:::::B          T:::::T  >::::>                
      SS::::::SSSSS      B:::::::::::::BB           T:::::T  >::::::>                 
        SSS::::::::SS    B::::BBBBBB:::::B          T:::::T  >::::::::>               
           SSSSS:::::S   B::::B     B:::::B         T:::::T  >::::::::::>                         
                S:::::S  B::::B     B:::::B         T:::::T  >:::::::::::>                    
                S:::::S  B::::B     B:::::B         T:::::T  >:::::::::>                     
    SSSSSSS     S:::::S  B::::BBBBBB::::::B         T:::::T  >:::::::>                  
    S::::::SSSSS::::::S  B:::::::::::::::B          T:::::T  >:::::>                           
    S:::::::::::::::S    B::::::::::::::B           T:::::T  >:::> 
      SSSSSSSSSSSSS      BBBBBBBBBBBBBB             TTTTTTT  >:>
    
                                                             Power To Know!
    
-->
    ";
    } else {
        echo "<!--
 ...  ,:                             
                                            ::,  :::                            
                                            ::`  ::,                            
                                           `::      .                           
   ::::    :::,    :::: :::   ::,   ,::::  ,::  ;';:  '' '''  '''   '' ;''  ''' 
  :::::  ,::::::  ::::: ,::  ,::  .::::::  ::: '''':  ''''''''''''  ''''''''''''
 ,::  ` `::, ,:: :::  ` `::  ::, `::: ,::  :::  '''. ,''' '''' ''' .''' '''' '''
 :::,   :::   ::`:::.    :: `::  :::  :::  ::`  '''  '''  '''  ''' ;''  '''  '''
  ::::  ::.   ::` ::::   ::`::, `::   :::  ::   ,''  '''  '''  ''; '''  '''  '''
   ,::: ::`  ,::   ::::  ::,::  .::   ::` ,::   :''  '',  ''.  ''. '',  '',  ''.
    ::: :::  :::    :::  .:::,  ,::  :::  :::  `::'  ''   ''   ''  ''   ''   '' 
`:::::. ::::::: ,:::::    :::    :::::::  :::  :. ' `''  .''  ,''  ''  `''  .'' 
,::::.   :::::  :::::`    ::.    ,::: ::  ::.  :  ' ;''  '''  ''' :''  ;''  ;'' 
                         :::                      '                             
                       ::::                                                     
                       :::                                                      
                       ,,                                                       

-->";
    }
}

?>
