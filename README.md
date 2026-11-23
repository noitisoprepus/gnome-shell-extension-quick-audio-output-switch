# Quick Audio Output Switch

A GNOME Shell extension to quickly switch between audio output devices from the top bar

<img width="1920" height="1080" alt="Quick audio output switch demo" src="https://github.com/user-attachments/assets/4f7a818b-7cfc-4524-a77c-f173257dd863" />

## Requirements

- GNOME Shell 49, 50, or 51
- `gnome-extensions`
- `pactl` (often provided by `pulseaudio-utils`)
- PulseAudio or PipeWire with `pipewire-pulse`

## Install

1. Clone the repository.

   ```sh
   git clone https://github.com/noitisoprepus/gnome-shell-extension-quick-audio-output-switch.git
   ```

2. Enter the repository folder.

   ```sh
   cd gnome-shell-extension-quick-audio-output-switch
   ```

3. Run the installer.

   ```sh
   ./install.sh
   ```

4. Log out and back in.
5. Open the Extensions app and enable **Quick Audio Output Switch**.

## Usage

Open the extension's preferences in the Extensions app. Choose the two audio outputs to switch between, and set whether to show the volume OSD.

<img width="345" height="313" alt="image" src="https://github.com/user-attachments/assets/68840776-b835-4c6a-8728-fb57aca30d51" />

Click the speaker in the top bar to switch. If another output is currently active, the first click selects your first configured output.

<img width="1920" height="100" alt="image" src="https://github.com/user-attachments/assets/00cf5504-c4d5-4e78-bc62-ec880785cc2e" />

Both selected outputs must be available to switch. Reopen Preferences after connecting a new device to refresh the list. Two ports exposed through the same playback sink appear as one output.

## Credits

- Dimitris Batis added the Quick Settings label lookup to [Audio Switch Shortcuts](https://github.com/dbatis/gnome-shell-extension-audio-switch-shortcuts/commit/fbcb3468450e0d638c6193b6ae0ae5cb972a8304), which inspired this extension's OSD label lookup.
- Marcin Jahn authored [Quick Settings Audio Devices Hider](https://github.com/marcinjahn/gnome-quicksettings-audio-devices-hider-extension), which Audio Switch Shortcuts credits for its mixer code, and [Quick Settings Audio Devices Renamer](https://github.com/marcinjahn/gnome-quicksettings-audio-devices-renamer-extension), which prompted the original feature.
