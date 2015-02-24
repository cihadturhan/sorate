<?php

require_once('lib/generalConfiguration.php');
require_once('lib/helper.php');
//sessCtrl();

$channels = getChannels();
echo json_encode($channels);

?>
