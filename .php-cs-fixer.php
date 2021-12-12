<?php

/*
 * This file is part of Phuck package.
 *
 * (c) Vaibhav Pandey <contact@vaibhavpandey.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.md.
 */

$header = <<<EOF
This file is part of Phuck package.

(c) Vaibhav Pandey <contact@vaibhavpandey.com>

This source file is subject to the MIT license that is bundled
with this source code in the file LICENSE.md.
EOF;

$finder = PhpCsFixer\Finder::create()
    ->exclude(array('.git', '.parcel_cache', 'dist', 'node_modules', 'vendor', 'phuck.dist.php'))
    ->in(__DIR__);

$config = new PhpCsFixer\Config();
$config->setFinder($finder);
$config->setRules(array(
    '@PSR2' => true,
    'header_comment' => array('header' => $header),
    'array_syntax' => array('syntax' => 'long'),
));
return $config;
