# Quick Audio Output Switch

A GNOME Shell extension to quickly switch between audio output devices from the top bar

![Quick audio output switch demo](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDg2MzBxdXphNDF1Ymhzc3h3bnY2b3Z3YmV0MGI0Z2Z2bnQyc3FqNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FJ7biK38Glxs2OHUCu/giphy.gif)

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

Click the speaker in the top bar to switch. If another output is currently active, the first click selects your first configured output.

Both selected outputs must be available to switch. Reopen Preferences after connecting a new device to refresh the list. Two ports exposed through the same playback sink appear as one output.

## Credits

- Dimitris Batis added the Quick Settings label lookup to [Audio Switch Shortcuts](https://github.com/dbatis/gnome-shell-extension-audio-switch-shortcuts/commit/fbcb3468450e0d638c6193b6ae0ae5cb972a8304), which inspired this extension's OSD label lookup.
- Marcin Jahn authored [Quick Settings Audio Devices Hider](https://github.com/marcinjahn/gnome-quicksettings-audio-devices-hider-extension), which Audio Switch Shortcuts credits for its mixer code, and [Quick Settings Audio Devices Renamer](https://github.com/marcinjahn/gnome-quicksettings-audio-devices-renamer-extension), which prompted the original feature.
