#!/usr/bin/env php
<?php

$phpFiles = array(
    __DIR__.'/src/Fs.php',
    __DIR__.'/src/Shell.php',
    __DIR__.'/src/functions.php',
    __DIR__.'/src/entry-point.php',
);

$phpSource = "<?php\n\n";
foreach ($phpFiles as $file) {
    $contents = file_get_contents($file);
    $contents = str_replace('<?php', '', $contents);
    $phpSource .= trim($contents);
    $phpSource .= "\n\n";
}

$phpSource .= "?>\n\n";

$htmlSource = file_get_contents(__DIR__.'/dist/index.html');
$htmlSource = preg_replace_callback(
    array(
        '/<(link) href="\/((.*).css)" rel="stylesheet">/',
        '/<(script) src="\/((.*).js)".*><\/script>/',
    ),
    function (array $matches) {
        $contents = file_get_contents(__DIR__.'/dist/'.$matches[2]);
        if ($matches[1] === 'link') {
            return '<style>'.$contents.'</style>';
        } elseif ($matches[1] === 'script') {
            return '<script>'.$contents.'</script>';
        }

        return '';
    },
    $htmlSource
);

file_put_contents(__DIR__.'/phuck.dist.php', $phpSource."\n".$htmlSource);
