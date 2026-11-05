import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const SCHEMA_NAME = 'org.gnome.shell.extensions.logoactivities';
const KEY_LABEL = 'label';
const KEY_POPUP = 'popup';
const KEY_TEXT = 'text';
const KEY_ICON = 'icon';
const KEY_ICONNAME = 'icon-name';
const KEY_SCROLL = 'scroll';
const KEY_PANEL = 'panel-indicator';
const KEY_WORKSPACE_SWITCHER = 'show-workspace-indicators';

export default class ActivitiesInLPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of the extension'),
        });
        page.add(group);

        // Show Workspace Indicators
        group.add(this._createSwitchRow(
            _('Show Workspace Indicators'),
            _('Enable or disable workspace indicators'),
            settings,
            KEY_WORKSPACE_SWITCHER
        ));

        // Icon
        group.add(this._createSwitchRow(
            _('Icon'),
            _('Show icon'),
            settings,
            KEY_ICON
        ));

        // Icon Name
        group.add(this._createEntryRow(
            _('Icon Name'),
            _('Enter icon name'),
            settings,
            KEY_ICONNAME
        ));

        // Label
        group.add(this._createSwitchRow(
            _('Label'),
            _('Show label'),
            settings,
            KEY_LABEL
        ));

        // Label Text
        group.add(this._createEntryRow(
            _('Label Text'),
            _('Enter label text'),
            settings,
            KEY_TEXT
        ));

        // Desktop Scroll
        group.add(this._createSwitchRow(
            _('Desktop Scroll'),
            _('Enable desktop scroll to switch workspaces'),
            settings,
            KEY_SCROLL
        ));

        // Popup Indicator
        group.add(this._createSwitchRow(
            _('Popup Indicator'),
            _('Show workspace switcher popup on scroll'),
            settings,
            KEY_POPUP
        ));

        // Panel Indicator
        group.add(this._createSwitchRow(
            _('Panel Indicator'),
            _('Show panel indicator on right side'),
            settings,
            KEY_PANEL
        ));
    }

    _createSwitchRow(title, subtitle, settings, key) {
        const row = new Adw.SwitchRow({
            title: title,
            subtitle: subtitle,
            active: settings.get_boolean(key),
        });
        row.connect('notify::active', (row) => {
            settings.set_boolean(key, row.active);
        });
        return row;
    }

    _createEntryRow(title, subtitle, settings, key) {
        const row = new Adw.EntryRow({
            title: title,
            subtitle: subtitle,
            text: settings.get_string(key),
        });
        row.connect('notify::text', (row) => {
            settings.set_string(key, row.text);
        });
        return row;
    }
}
