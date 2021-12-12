<?php

if (version_compare(PHP_VERSION, '5.3.0') < 0) {
    die('PHP must be at least of 5.3.0; '.PHP_VERSION.' found.');
}

if (function_exists('ini_set')) {
    ini_set('max_execution_time', '0');
    ini_set('memory_limit', '-1');
}

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

    exit;
}

$phuck_handled = phuck_handle_action();
if ($phuck_handled) {
    exit;
}
