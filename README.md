# Logo-Activities

A GNOME Shell extension that adds a customizable icon and label to the Activities button in the top panel, with optional workspace indicators.

## Features

- **Custom Icon**: Set any icon name (default: `start-here`)
- **Custom Label**: Set custom text for the Activities button (default: "Activities")
- **Workspace Indicators**: Visual dots showing active/inactive workspaces with smooth animations
- **Desktop Scroll**: Switch workspaces by scrolling on the desktop
- **Popup Indicator**: Show workspace switcher popup when scrolling
- **Panel Indicator**: Optional second indicator on the right side of the panel

## Installation

### From Source (Local Development)

```bash
# Clone the repository
git clone https://github.com/psam21/Logo-Activities
cd Logo-Activities

# Compile the GSettings schema
cd logoactivities@github.com.orbitcorrection
glib-compile-schemas schemas/

# Install to local extensions directory
cp -r logoactivities@github.com.orbitcorrection ~/.local/share/gnome-shell/extensions/

# Enable the extension
gnome-extensions enable logoactivities@github.com.orbitcorrection

# Restart GNOME Shell to apply changes
# X11: Alt+F2, type 'r', press Enter
# Wayland: Log out and log back in
```

### Quick Deploy (for local development)

```bash
# One-liner to deploy latest changes
cp -r logoactivities@github.com.orbitcorrection ~/.local/share/gnome-shell/extensions/ && \
glib-compile-schemas ~/.local/share/gnome-shell/extensions/logoactivities@github.com.orbitcorrection/schemas/ && \
gnome-extensions enable logoactivities@github.com.orbitcorrection
```

### Using Extension Manager

1. Install [Extension Manager](https://flathub.org/apps/com.mattjakeman.ExtensionManager) from Flathub
2. Search for "Logo Activities" and install

## Managing the Extension

```bash
# Check if extension is enabled
gnome-extensions list --enabled | grep logoactivities

# View extension info
gnome-extensions info logoactivities@github.com.orbitcorrection

# Open preferences
gnome-extensions prefs logoactivities@github.com.orbitcorrection

# Disable extension
gnome-extensions disable logoactivities@github.com.orbitcorrection

# Uninstall (remove from local directory)
rm -rf ~/.local/share/gnome-shell/extensions/logoactivities@github.com.orbitcorrection
```

## Configuration

Open the extension preferences via:
- **Extension Manager** → Logo Activities → Settings
- **Command line**: `gnome-extensions prefs logoactivities@github.com.orbitcorrection`

### Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Show Workspace Indicators** | Display workspace dots on the panel | Enabled |
| **Icon** | Show custom icon | Enabled |
| **Icon Name** | Icon name from theme (e.g., `start-here`, `view-grid-symbolic`) | `start-here` |
| **Label** | Show custom label text | Disabled |
| **Label Text** | Custom text for the label | `Activities` |
| **Desktop Scroll** | Switch workspaces by scrolling on desktop | Enabled |
| **Popup Indicator** | Show workspace switcher popup on scroll | Disabled |
| **Panel Indicator** | Show additional indicator on right panel | Disabled |

## Compatibility

- **GNOME Shell 45+** (Fedora 39+, Ubuntu 24.04+, Arch, etc.)
- Uses modern ESM modules and libadwaita preferences UI

## Development

The extension uses:
- **ESM modules** (GNOME 45+)
- **libadwaita** for preferences (`Adw.PreferencesPage`, `Adw.SwitchRow`, `Adw.EntryRow`)
- **GSettings** for configuration storage

### Project Structure

```
logoactivities@github.com.orbitcorrection/
├── extension.js          # Main extension logic
├── prefs.js              # Preferences UI (GNOME 45+ API)
├── metadata.json         # Extension metadata
├── stylesheet.css        # Styling
└── schemas/
    └── org.gnome.shell.extensions.logoactivities.gschema.xml
```

## License

GPL-2.0-or-later

## Credits

Originally by [howbea](https://github.com/howbea/logo-activities), updated for GNOME 45+ compatibility.
