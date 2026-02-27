import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const DEVICE_A = 62;
const DEVICE_B = 59;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Quick Audio Output Switch'), true);

        this._currentAudioOutput = DEVICE_A;

        this._icon = new St.Icon({
            icon_name: 'audio-speakers-symbolic',
            style_class: 'system-status-icon',
        });
        this.add_child(this._icon);

        this.connect('button-press-event', () => {
            log('Button pressed!');
            this._switchAudioOutput();
        })
    }

    _switchAudioOutput() {
        let audioOutput = this._currentAudioOutput === DEVICE_A ? DEVICE_B : DEVICE_A;
        GLib.spawn_command_line_async(`wpctl set-default ${audioOutput}`);
        this._currentAudioOutput = audioOutput;
        this._updateIcon();
    }

    _updateIcon() {
        if (this._icon) {
            this._icon.set_icon_name(
                this._currentAudioOutput === DEVICE_A ? 'audio-speakers-symbolic' : 'audio-card-symbolic'
            );
        }
    }
});

export default class QuickAudioOutputSwitchExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
