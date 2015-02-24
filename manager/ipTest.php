<?php

require_once('../_libs/generalConfiguration.php');
include('ip2locationlite.class.php');

//Load the class
$ipLite = new ip2location_lite;
$ipLite->setKey('e6f444f8914d3b31741f4fb4542b3e506b9a05797568354ee0c77d9e1bf9dd80');

set_time_limit(0);

$ip_addresses = $db->getQKeyValue("
    SELECT l1.ip FROM  
        (SELECT DISTINCT detailed_log.ip FROM detailed_log UNION SELECT DISTINCT log.ip FROM log) 
    AS l1 LEFT JOIN 
        (SELECT ip_address AS ip FROM ip_list ) 
    AS l2 ON l1.ip = l2.ip 
    WHERE l2.ip IS NULL");



if ($ip_addresses)
    foreach ($ip_addresses as $ip) {
        if ($ip['ip'] != "" && $ip['ip'] != '127.0.0.1') {
            $locations = $ipLite->getCity($ip['ip']);
            $locations = $ipLite->getCity('95.9.51.88');
            $city = $locations['cityName'];
            $country = $locations['countryName'];
            $db->setQ("INSERT INTO ip_list VALUES('" . $ip['ip'] . "','$country','$city')");
        }
        usleep(50000);
    }
?>