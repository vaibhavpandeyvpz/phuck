<?php

if (version_compare(PHP_VERSION, '5.3.0') < 0) {
    die('PHP must be at least of 5.3.0; '.PHP_VERSION.' found.');
}

if (function_exists('ini_set')) {
    ini_set('max_execution_time', '0');
    ini_set('memory_limit', '-1');
}

$phuck_handled = phuck_handle_action();
if ($phuck_handled) {
    exit;
}
