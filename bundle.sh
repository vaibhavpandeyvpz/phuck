#!/bin/bash

PHP_SOURCES=(src/Fs.php src/Shell.php src/functions.php src/entry-point.php)

echo "<?php" > phuck.dist.php

for i in "${PHP_SOURCES[@]}"
do
    sed -e "s/^<?php//" "$i" >> phuck.dist.php
done
