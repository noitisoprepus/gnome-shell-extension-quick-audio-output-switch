import Gio from 'gi://Gio';

Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

export async function pactl(args, cancellable) {
    if (cancellable.is_cancelled())
        throw new Error('Audio request cancelled.');

    const process = Gio.Subprocess.new(
        ['pactl', ...args],
        Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
    );

    let stdout, stderr;
    try {
        [stdout, stderr] = await process.communicate_utf8_async(null, cancellable);
    } catch (error) {
        // Cancelling the read doesn't stop pactl itself
        process.force_exit();
        throw error;
    }

    if (!process.get_successful())
        throw new Error(stderr.trim() || 'pactl failed.');

    return stdout.trim();
}

export async function listOutputs(cancellable) {
    const json = await pactl(['--format=json', 'list', 'sinks'], cancellable);
    return JSON.parse(json);
}

export function savedOutput(settings, key) {
    const name = settings.get_string(key);
    // Old settings used numeric node IDs
    return /^\d+$/.test(name) ? '' : name;
}

export function switchTarget(outputs, first, second, current) {
    if (!first || !second || first === second)
        throw new Error('Choose two different outputs in Extension Preferences.');

    const a = outputs.find(output => output.name === first);
    const b = outputs.find(output => output.name === second);
    if (!a || !b)
        throw new Error('Reconnect both outputs or choose another pair in Extension Preferences.');

    return current === first ? b : a;
}
