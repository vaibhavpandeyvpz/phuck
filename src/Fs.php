<?php

class PhuckFs
{
    /**
     * @param string $source
     * @param string $destination
     * @return bool
     */
    public static function decompress($source, $destination)
    {
        if (!extension_loaded('zip')) {
            return false;
        }

        $zip = new \ZipArchive();
        if ($zip->open($source) === true) {
            $zip->extractTo($destination);
            $zip->close();
            return true;
        }

        return false;
    }

    /**
     * @param array $sources
     * @param string $destination
     * @param string|null $base
     * @return bool
     */
    public static function compress(array $sources, $destination, $base = null)
    {
        if (!extension_loaded('zip')) {
            return false;
        }

        if (empty($base)) {
            $base = getcwd();
        }

        $zip = new \ZipArchive();
        $zip->open($destination,  \ZipArchive::CREATE);
        foreach ($sources as $path) {
            if (is_link($path)) {
                $path = readlink($path);
            }

            $entry = new \SplFileInfo($path);
            if ($entry->isDir()) {
                $name = str_replace($base, '', $entry->getRealPath());
                if (stripos(PHP_OS, 'WIN') === 0) {
                    $name = str_replace('\\', '/', $name);
                }

                $zip->addEmptyDir(ltrim($name, '/').'/');
                try {
                    $children = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(
                        $entry->getRealPath(), \FilesystemIterator::SKIP_DOTS
                    ));
                } catch (\Exception $ignore) {
                    continue;
                }

                foreach ($children as $child) {
                    /** @var \SplFileInfo $child */
                    $name = str_replace($base, '', $child->getRealPath());
                    if (stripos(PHP_OS, 'WIN') === 0) {
                        $name = str_replace('\\', '/', $name);
                    }

                    if ($child->isDir()) {
                        $zip->addEmptyDir(ltrim($name.'/').'/');
                    } else if ($child->isFile()) {
                        $zip->addFile($child->getPathname(), $name);
                    }
                }
            } else if ($entry->isFile() || $entry->isLink()) {
                $zip->addFile($entry->getPathname(), $entry->getFilename());
            }
        }

        $zip->close();
        return true;
    }

    /**
     * @param string $path
     * @param string $into
     * @param int $mode
     * @return bool
     */
    public static function copy($path, $into, $mode = 0777)
    {
        $name = basename($path);
        $dest = $into.DIRECTORY_SEPARATOR.$name;
        if (is_file($path)) {
            return copy($path, $dest);
        } elseif (is_link($path)) {
            return symlink(readlink($path), $dest);
        }

        @mkdir($dest, $mode);
        $dir = dir($path);
        while (($entry = $dir->read()) !== false) {
            if (in_array($entry, array('.', '..'))) {
                continue;
            }

            self::copy($path.DIRECTORY_SEPARATOR.$entry, $dest, $mode);
        }

        $dir->close();
        return true;
    }

    /**
     * @param string $path
     * @param string $name
     * @return bool
     */
    public static function download($path, $name = null)
    {
        $path = realpath($path);
        if (is_file($path)) {
            $mime = 'application/octet-stream';
            if (extension_loaded('fileinfo')) {
                $finfo = finfo_open();
                $mime = finfo_file($finfo, $path, FILEINFO_MIME_TYPE);
                finfo_close($finfo);
            }

            if (empty($name)) {
                $name = basename($path);
            }

            header('Cache-Control: must-revalidate');
            header('Content-Description: File Transfer');
            header(sprintf('Content-disposition: attachment; filename="%s"', $name));
            header('Content-Length: '.filesize($path));
            header('Content-Transfer-Encoding: Binary');
            header("Content-Type: $mime");
            header('Expires: 0');
            header('Pragma: public');
            readfile($path);
            return true;
        }

        return false;
    }

    /**
     * @param string $dir
     * @return array
     */
    public static function files($dir)
    {
        $finfo = extension_loaded('fileinfo') ? finfo_open() : false;
        $files = array();
        try {
            $children = new \FilesystemIterator($dir);
            foreach ($children as $child) {
                /** @var \SplFileInfo $child */
                $real = $child->isLink() ? new \SplFileInfo($child->getRealPath()) : $child;
                $mime = null;
                if ($real->isFile()) {
                    $mime = 'application/octet-stream';
                    if ($finfo) {
                        /** @noinspection PhpComposerExtensionStubsInspection */
                        $mime = finfo_file($finfo, $real->getFilename(), FILEINFO_MIME_TYPE);
                    }
                }

                $files[] = array(
                    'hidden' => strpos($child->getBasename(), '.') === 0,
                    'mime' => $mime,
                    'modified' => $child->getMTime(),
                    'name' => $child->getBasename(),
                    'path' => $child->getPathname(),
                    'path_real' => $child->getRealPath(),
                    'permissions' => substr(sprintf('%o', $child->getPerms()), -4),
                    'size' => $child->getSize(),
                    'type' => $child->getType(),
                    'type_real' => $real->getType(),
                );
            }
        } catch (\Exception $ignore) {
        }

        if ($finfo) {
            /** @noinspection PhpComposerExtensionStubsInspection */
            finfo_close($finfo);
        }

        usort($files, function ($lhs, $rhs) {
            if ($lhs['type'] === $rhs['type']) {
                return strcmp($lhs['name'], $rhs['name']);
            } elseif (($lhs['type'] === 'dir') && ($rhs['type'] === 'file')) {
                return -1;
            } elseif (($rhs['type'] === 'dir') && ($lhs['type'] === 'file')) {
                return 1;
            }

            return 0;
        });
        $parent = new \SplFileInfo(dirname($dir));
        $up = array(
            'hidden' => false,
            'mime' => null,
            'modified' => $parent->getMTime(),
            'name' => '..',
            'path' => $parent->getPathname(),
            'permissions' => null,
            'size' => 0,
            'type' => 'dir',
        );
        $up['path_real'] = $up['path'];
        $up['type_real'] = $up['type'];
        array_unshift($files, $up);
        return $files;
    }

    /**
     * @param string $path
     * @return string
     */
    public static function read($path)
    {
        return file_get_contents(realpath($path));
    }

    /**
     * @param string $path
     * @return bool
     */
    public static function rimraf($path)
    {
        if (is_file($path) || is_link($path)) {
            return unlink($path);
        }

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($files as $file) {
            /** @var \SplFileInfo $file */
            if ($file->isDir()) {
                self::rimraf($file->getPathname());
            } else {
                unlink($file->getPathname());
            }
        }

        return rmdir($path);
    }

    /**
     * @param array $file
     * @param string $into
     * @return bool
     */
    public static function upload(array $file, $into)
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return false;
        }

        $destination = $into.DIRECTORY_SEPARATOR.$file['name'];
        return move_uploaded_file($file['tmp_name'], $destination);
    }

    /**
     * @param string $path
     * @param string $contents
     * @return bool
     */
    public static function write($path, $contents)
    {
        return file_put_contents(realpath($path), $contents) !== false;
    }
}
