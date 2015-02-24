<?php

header('X-Frame-Options: GOFORIT');
if (isset($_GET['id'])) {
    echo file_get_contents('https://twitter.com/i/profiles/popup?async_social_proof=true&user_id=' . $_GET['id'], false, null);
} else if (isset($_GET['url'])) {
    echo file_get_contents($_GET['url'], false, null);
}
?>
