import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import {listOutputs, savedOutput} from './audio.js';

export default class Preferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({title: _('Audio Outputs')});
        page.add(group);
        window.add(page);

        const status = new Adw.ActionRow({title: _('Loading outputs…')});
        group.add(status);

        const osd = new Adw.SwitchRow({title: _('Show Volume OSD')});
        group.add(osd);
        settings.bind('show-volume-osd', osd, 'active', Gio.SettingsBindFlags.DEFAULT);

        const request = new Gio.Cancellable();
        window.connect('close-request', () => {
            request.cancel();
            return false;
        });
        this._loadOutputs(group, status, settings, request);
    }

    async _loadOutputs(group, status, settings, request) {
        try {
            const outputs = await listOutputs(request);
            if (request.is_cancelled())
                return;

            const first = savedOutput(settings, 'device-a');
            const second = savedOutput(settings, 'device-b');
            const choices = [{name: '', label: _('Not selected')}];
            for (const {name, description} of outputs) {
                const duplicate = outputs.some(output =>
                    output.name !== name && output.description === description);
                const label = duplicate ? `${description} (${name})` : (description || name);
                choices.push({name, label});
            }

            // Keep the saved choice visible when the device is unplugged
            for (const name of [first, second]) {
                if (name && !choices.some(choice => choice.name === name))
                    choices.push({name, label: `${_('Unavailable')}: ${name}`});
            }

            if (outputs.length === 0)
                status.title = _('No playback outputs found');
            else
                group.remove(status);

            this._addSelector(group, settings, choices, 'device-a', 'device-b', _('First Output'));
            this._addSelector(group, settings, choices, 'device-b', 'device-a', _('Second Output'));
        } catch (error) {
            if (!request.is_cancelled()) {
                status.title = _('Could not load audio outputs');
                status.subtitle = error.message;
            }
        }
    }

    _addSelector(group, settings, choices, key, otherKey, title) {
        const row = new Adw.ComboRow({
            title,
            model: Gtk.StringList.new(choices.map(choice => choice.label)),
            selected: choices.findIndex(choice => choice.name === savedOutput(settings, key)),
        });
        group.add(row);

        row.connect('notify::selected', () => {
            const name = choices[row.selected].name;
            const saved = savedOutput(settings, key);
            if (name === saved)
                return;

            if (name && name === savedOutput(settings, otherKey)) {
                row.subtitle = _('Choose a different output for each slot.');
                row.selected = choices.findIndex(choice => choice.name === saved);
                return;
            }

            settings.set_string(key, name);
            row.subtitle = '';
        });
    }
}
