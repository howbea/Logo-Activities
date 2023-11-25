/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Atk from 'gi://Atk';
import Gio from 'gi://Gio';
import St from 'gi://St';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';
import * as Panel from 'resource:///org/gnome/shell/ui/panel.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as WorkspaceSwitcherPopup from 'resource:///org/gnome/shell/ui/workspaceSwitcherPopup.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const SCHEMA_NAME = 'org.gnome.shell.extensions.logoactivities';
const KEY_LABEL = 'label';
const KEY_POPUP = 'popup';
const KEY_TEXT = 'text';
const KEY_ICON = 'icon';
const KEY_ICONNAME = 'icon-name';
const KEY_SCROLL = 'scroll';

    const ActivitiesIndicator = GObject.registerClass(
    class ActivitiesIndicator extends PanelMenu.Button {
    
    _init(settings) {
        super._init(0.0, null, true);
        this.accessible_role = Atk.Role.TOGGLE_BUTTON;
        
        this.name = 'panelActivities';
        
        /* Translators: If there is no suitable word for "Activities"
           in your language, you can use the word for "Overview". */
           
        
        this.text_label = settings.get_boolean(KEY_LABEL);        
        this.activities_icon = settings.get_boolean(KEY_ICON);
        this.text = settings.get_string(KEY_TEXT);
        this.activities_icon_name = settings.get_string(KEY_ICONNAME);
        this.desktopscroll = settings.get_boolean(KEY_SCROLL);
        this.popup = settings.get_boolean(KEY_POPUP);
        
        this._settingsID = settings.connect("changed", () => {
            this.text_label = settings.get_boolean(KEY_LABEL);
            this.activities_icon = settings.get_boolean(KEY_ICON);
            this.text = settings.get_string(KEY_TEXT);
            this.activities_icon_name = settings.get_string(KEY_ICONNAME);
            this.desktopscroll = settings.get_boolean(KEY_SCROLL);
            this.popup = settings.get_boolean(KEY_POPUP);
            this._set_label();
            this._set_icon();
        });
        
        let bin = new St.Bin();
        this.add_actor(bin);
        
        this._container = new St.BoxLayout({style_class: 'activities-layout'});
        bin.set_child(this._container);
        
        this._iconBox = new St.Bin({
        y_align: Clutter.ActorAlign.CENTER,
        });         
        this._container.add_actor(this._iconBox);        
          
        this._label = new St.Label({
            text: _('Activities'),
            y_align: Clutter.ActorAlign.CENTER,
        });        
        this._container.add_actor(this._label);
        
        this._set_icon();              
        this._set_label();
        
        this.label_actor = this._label;
        
        this._showingSignal = Main.overview.connect('showing', () => {
            this.add_style_pseudo_class('overview');
            this.add_accessible_state(Atk.StateType.CHECKED);
        });        
        
        this._hidingSignal = Main.overview.connect('hiding', () => {
            this.remove_style_pseudo_class('overview');
            this.remove_accessible_state(Atk.StateType.CHECKED);
        });

        this._scrollEventId = this.connect('scroll-event', this.scrollEvent.bind(this));
        //this._puId = this.connect('enter-event', this.switchWorkspacet.bind(this));
        //this._pufId = this.connect('leave-event', this.switchWorkspacett.bind(this));
                
        this._xdndTimeOut = 0;
        this.wm = global.workspace_manager;
        this.set_track_hover(true);
        this.set_reactive(true);
        
    }   
   
     _set_icon() {
     
     if (this.activities_icon) {
        const icon = new St.Icon({
            icon_name: 'start-here',
            style_class: 'activities-icon',
        });
        this._iconBox.set_child(icon);
        
        icon.icon_name = this.activities_icon_name;
        
        if(this.activities_icon_name === '')
        this._iconBox.visible = false;

        this._iconBox.visible = true;
        }
        else {
        this._iconBox.visible = false;
        }
        
    }
    
    _set_label() {
    
        if(this.text_label) {
        this._label.set_text(this.text);
        
        if(this.text === '')
        this._label.visible = false;
        
        this._label.visible = true;
        }
        else {
        this._label.visible = false;
        }
        
    }

    handleDragOver(source, _actor, _x, _y, _time) {
        if (source != Main.xdndHandler)
            return DND.DragMotionResult.CONTINUE;

        if (this._xdndTimeOut != 0)
            GLib.source_remove(this._xdndTimeOut);
        this._xdndTimeOut = GLib.timeout_add(GLib.PRIORITY_DEFAULT, BUTTON_DND_ACTIVATION_TIMEOUT, () => {
            this._xdndToggleOverview();
        });
        GLib.Source.set_name_by_id(this._xdndTimeOut, '[gnome-shell] this._xdndToggleOverview');

        return DND.DragMotionResult.CONTINUE;
    }

    vfunc_event(event) {
        if (event.type() == Clutter.EventType.TOUCH_END ||
            event.type() == Clutter.EventType.BUTTON_RELEASE) {
            if (Main.overview.shouldToggleByCornerOrButton())
                Main.overview.toggle();
        }
        return Clutter.EVENT_PROPAGATE;
    }

    vfunc_key_release_event(keyEvent) {
        let symbol = keyEvent.keyval;
        if (symbol == Clutter.KEY_Return || symbol == Clutter.KEY_space) {
            if (Main.overview.shouldToggleByCornerOrButton()) {
                Main.overview.toggle();
                return Clutter.EVENT_PROPAGATE;
            }
        }

        return Clutter.EVENT_PROPAGATE;
    }

    _xdndToggleOverview() {
        let [x, y] = global.get_pointer();
        let pickedActor = global.stage.get_actor_at_pos(Clutter.PickMode.REACTIVE, x, y);

        if (pickedActor == this && Main.overview.shouldToggleByCornerOrButton())
            Main.overview.toggle();

        GLib.source_remove(this._xdndTimeOut);
        this._xdndTimeOut = 0;
        return GLib.SOURCE_REMOVE;
    }
    
    scrollEvent(actor, event) {
        let direction;
        switch (event.get_scroll_direction()) {
        case Clutter.ScrollDirection.UP:
        case Clutter.ScrollDirection.LEFT:
            direction = Meta.MotionDirection.UP;
            break;
        case Clutter.ScrollDirection.DOWN:
        case Clutter.ScrollDirection.RIGHT:
            direction = Meta.MotionDirection.DOWN;
            break;
        default:
            return Clutter.EVENT_STOP;
        }
        
        let gap = event.get_time() - this._time;
        if (gap < 192 && gap >= 0)
            return Clutter.EVENT_STOP;
        this._time = event.get_time();

        this.switchWorkspace(direction);

        return Clutter.EVENT_STOP;
    }


    switchWorkspace(direction) {
        let ws = this.getWorkSpace();

        let activeIndex = this.wm.get_active_workspace_index();

        let newWs;
        if (direction == Meta.MotionDirection.UP) {
            if (activeIndex == 0 )
                newWs = 0; //ws.length - 1;
            else
                newWs = activeIndex - 1;
        } else {
            if (activeIndex == (ws.length - 1) )
                newWs = ws.length - 1; //0;
            else
                newWs = activeIndex + 1;
        }
        
        if (this.desktopscroll)
        this.actionMoveWorkspace(ws[newWs]);
        else
        return
        
        if (this.popup)
        this.switcherPopup(direction, ws[newWs]);
        else
        return 
        
    }
    
    switchWorkspacet(direction) {
        let ws = this.getWorkSpace();

        let activeIndex = this.wm.get_active_workspace_index();

        let newWs;
                newWs = activeIndex;

        if (this.popup)
        this.switcherPopupt(direction, ws[newWs]);
        else
        return        
    }
    
    switchWorkspacett(direction) {
        let ws = this.getWorkSpace();

        let activeIndex = this.wm.get_active_workspace_index();

        let newWs;
                newWs = activeIndex;
        
        this.switcherPopupt.destroy();
        
    }
    
    
    switcherPopup(direction, newWs) {
        if (!Main.overview.visible) {
            if (this._workspaceSwitcherPopup == null) {
                Main.wm._workspaceTracker.blockUpdates();
                this._workspaceSwitcherPopup = new WorkspaceSwitcherPopup.WorkspaceSwitcherPopup();
                this._workspaceSwitcherPopup.connect('destroy', () => {
                    Main.wm._workspaceTracker.unblockUpdates();
                    this._workspaceSwitcherPopup = null;
                });
            }
            this._workspaceSwitcherPopup.display(newWs.index());
        }
    }
    
    switcherPopupt(direction, newWs) {
        if (!Main.overview.visible) {
            if (this._workspaceSwitcherPopup == null) {
                Main.wm._workspaceTracker.blockUpdates();
                this._workspaceSwitcherPopup = new WorkspaceSwitcherPopupT.WorkspaceSwitcherPopup();
                this._workspaceSwitcherPopup.connect('destroy', () => {
                    Main.wm._workspaceTracker.unblockUpdates();
                    this._workspaceSwitcherPopup = null;
                });
            }
            this._workspaceSwitcherPopup.display(newWs.index());
        }
    }

    getWorkSpace() {
        let activeWs = this.wm.get_active_workspace();

        let activeIndex = activeWs.index();
        let ws = [];

        ws[activeIndex] = activeWs;

        const vertical = this.wm.layout_rows === -1;
        for (let i = activeIndex - 1; i >= 0; i--) {
            if (vertical)
                ws[i] = ws[i + 1].get_neighbor(Meta.MotionDirection.UP);
            else
                ws[i] = ws[i + 1].get_neighbor(Meta.MotionDirection.LEFT);
        }

        for (let i = activeIndex + 1; i < this.wm.n_workspaces; i++) {
            if (vertical)
                ws[i] = ws[i - 1].get_neighbor(Meta.MotionDirection.DOWN);
            else
                ws[i] = ws[i - 1].get_neighbor(Meta.MotionDirection.RIGHT);
        }

        return ws;
    }

    actionMoveWorkspace(workspace) {
        if (!Main.sessionMode.hasWorkspaces)
            return;

        let activeWorkspace = this.wm.get_active_workspace();

        if (activeWorkspace != workspace)
            workspace.activate(global.get_current_time());
    }
    
     _onDestroy() {
        if (this._showingSignal) {
            Main.overview.disconnect(this._showingSignal);
            this._showingSignal = null;
        }

        if (this._hidingSignal) {
            Main.overview.disconnect(this._hidingSignal);
            this._hidingSignal = null;
        }

        if (this._xdndTimeOut) {
            GLib.Source.remove(this._xdndTimeOut);
            this._xdndTimeOut = null;
        }
        
        if (this._scrollEventId != null) {
            this.disconnect(this._scrollEventId);
            this._scrollEventId = null;
        }
        
        if (this._settingsID) {
        settings.disconnect(this._settingID);
        this._settingsID = null;
        }        
        
        super.destroy();
    }
});

export default class ActivitiesExtension extends Extension {

    enable() {
        this._settings = this.getSettings();
        
        Main.panel.statusArea['activities'].hide();
        
        this._indicator = new ActivitiesIndicator(this._settings);
        
        Main.panel.addToStatusArea(this._uuid, this._indicator, 0, 'left');
}

    disable() {
        this._settings = null;
        this._indicator.destroy();
        this._indicator = null;
      
        if (Main.sessionMode.currentMode !== 'unlock-dialog')
            Main.panel.statusArea['activities'].show();
    }
}


