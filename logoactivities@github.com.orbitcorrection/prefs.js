/* pref.js
*
* this js is based on 'panel scroll - sun.wxg@gmail.com' extension.
* https://github.com/sunwxg/gnome-shell-extension-panelScroll
*
*/

const { Gtk, Gio } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const SCHEMA_NAME = 'org.gnome.shell.extensions.logoactivities';
const KEY_LABEL = 'label';
const KEY_POPUP = 'popup';
const KEY_TEXT = 'text';
const KEY_ICON = 'icon';
const KEY_ICONNAME = 'icon-name';
const KEY_SCROLL = 'scroll';

function init() {
}


function buildPrefsWidget() {
    let settings = ExtensionUtils.getSettings(SCHEMA_NAME);

    let widget = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin_top: 10,
        margin_bottom: 10,
        margin_start: 10,
        margin_end: 10,
    });

    let vbox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin_top: 10
    });
    vbox.set_size_request(550, 350);
let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
    vbox.append(addItemSwitch("Icon", KEY_ICON, settings));
    vbox.append(addText(KEY_ICONNAME, 'Enter icon name (default:start-here)', settings));
    vbox.append(addItemSwitch("Label", KEY_LABEL, settings));
    vbox.append(addText(KEY_TEXT, 'Enter label text (default:Activities)', settings));
    vbox.append(addItemSwitch("Scroll Desktop", KEY_SCROLL, settings));
    vbox.append(addItemSwitch("Workspace Switcher Popup", KEY_POPUP, settings));

    widget.append(vbox); widget.append(hbox);

    return widget;
}

function addItemSwitch(string, key, gsettings) {
        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 20});
        let info = new Gtk.Label({xalign: 0, hexpand: true});
        info.set_markup(string);
        hbox.append(info);

        let button = new Gtk.Switch({ active: gsettings.get_boolean(key) });
        button.connect('notify::active', (button) => { gsettings.set_boolean(key, button.active); });
        hbox.append(button);
        return hbox;
    }
    
function addText(key, placeholder_text, gsettings) {
        let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
        
        let info = new Gtk.Label({xalign: 0, hexpand: true});        
        //info.set_markup(string);
        
        let settingentry = new Gtk.Entry({hexpand: true, margin_start: 20});
        settingentry.set_placeholder_text(placeholder_text);
        settingentry.set_text(gsettings.get_string(key));
        settingentry.connect('changed', (entry) => {
            gsettings.set_string(key, entry.get_text());
        });

        hbox.append(info);
        hbox.append(settingentry);
        return hbox;
    }

