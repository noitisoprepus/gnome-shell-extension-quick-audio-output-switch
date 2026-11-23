import Atk from 'gi://Atk';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {getMixerControl} from 'resource:///org/gnome/shell/ui/status/volume.js';

import {listOutputs, pactl, savedOutput, switchTarget} from './audio.js';

export default class QuickAudioOutputSwitchExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._indicator = new PanelMenu.Button(0, _('Switch Audio Output'), true);
        this._indicator.accessible_role = Atk.Role.PUSH_BUTTON;
        this._indicator.add_child(new St.Icon({
            icon_name: 'audio-speakers-symbolic',
            style_class: 'system-status-icon',
        }));

        this._indicator.connect('button-press-event', (_actor, event) => {
            if (event.get_button() !== Clutter.BUTTON_PRIMARY)
                return Clutter.EVENT_PROPAGATE;
            this._switchAudioOutput();
            return Clutter.EVENT_STOP;
        });

        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._request?.cancel();
        this._request = null;
        this._indicator?.destroy();
        this._indicator = null;
        this._settings = null;
    }

    async _switchAudioOutput() {
        if (this._request)
            return;

        const request = new Gio.Cancellable();
        this._request = request;
        try {
            const outputs = await listOutputs(request);
            const current = await pactl(['get-default-sink'], request);
            if (request.is_cancelled())
                return;

            // Quick Settings can change the default between clicks
            const first = savedOutput(this._settings, 'device-a');
            const second = savedOutput(this._settings, 'device-b');
            const target = switchTarget(outputs, first, second, current);
            await pactl(['set-default-sink', target.name], request);
            const actual = await pactl(['get-default-sink'], request);
            if (request.is_cancelled())
                return;
            if (actual !== target.name)
                throw new Error('The audio server did not switch to the selected output.');

            if (this._settings.get_boolean('show-volume-osd'))
                this._showVolume(target);
        } catch (error) {
            if (!request.is_cancelled())
                Main.notify(_('Quick Audio Output Switch'), error.message);
        } finally {
            // An old request can finish after the extension was enabled again
            if (this._request === request)
                this._request = null;
        }
    }

    _showVolume(output) {
        const channels = Object.values(output.volume ?? {}).map(channel => channel.value);
        // PulseAudio uses 65536 for 100% volume
        const level = output.mute ? 0 : Math.max(0, ...channels) / 65536;
        const icons = ['muted', 'low', 'medium', 'high'];
        const icon = new Gio.ThemedIcon({
            name: `audio-volume-${icons[Math.min(3, Math.ceil(level * 3))]}-symbolic`,
        });
        const label = this._getOutputLabel(output);
        Main.osdWindowManager.showAll(icon, label, level, Math.max(1, level));
    }

    // Quick Settings label lookup inspired by Dimitris Batis's Audio Switch Shortcuts.
    // https://github.com/dbatis/gnome-shell-extension-audio-switch-shortcuts/commit/fbcb3468450e0d638c6193b6ae0ae5cb972a8304
    _getOutputLabel(output) {
        const fallback = output.description || output.name;
        try {
            const mixer = getMixerControl();
            const sink = mixer.get_sinks().find(stream => stream.get_name() === output.name);
            const device = sink && mixer.lookup_device_from_stream(sink);
            if (!device)
                return fallback;

            // shortcut: Quick Settings stores labels in private fields, use a public label API when available.
            const items = Main.panel.statusArea.quickSettings?._volumeOutput?._output?._deviceItems;
            const label = items?.get(device.get_id())?.label?.get_text();
            return label?.trim() ? label : fallback;
        } catch {
            return fallback;
        }
    }
}
