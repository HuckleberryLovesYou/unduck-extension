# Unduck Helper

A companion browser extension for [Unduck](https://github.com/huckleberrylovesyou/unduck) that enables search autofill on websites that don't natively support URL query parameters (like Google Gemini).

## Features

- **Seamless Redirects**: Detects specific `?unduck=QUERY` parameters and injects them into the target site's search bar.
- **Smart Injection**: Uses specialized logic to handle complex inputs.
- **Auto-Submit**: Configurable option to automatically press "Enter" or click "Send" after injection.
- **Detection**: Allows the main Unduck web app to verify if the extension is installed to provide a smooth user experience.
- **Auto Setup**: Automatically sets Unduck as (default) search engine. 

## Installation

### Install from Release

#### Chrome / Edge / Brave (chromium)

1. Download the latest `.crx` file from the [Releases page](https://github.com/HuckleberryLovesYou/unduck-extension/releases/latest).
2. Unpack the Archive
3. Open your browser's extensions page (`chrome://extensions` or `edge://extensions`).
4. Enable **Developer mode** in the top right corner.
5. Click on "Load unpacked"
6. Select the unpacked directory.

#### Firefox (gecko)

1. Download the latest `.xpi` file from the [Releases page](https://github.com/HuckleberryLovesYou/unduck-extension/releases/latest).
2. Open about:config in Firefox.
3. Set `xpinstall.signatures.required` to `false`.
4. Open `about:addons` in Firefox.
5. Click the gear icon ⚙️ next to "Manage Your Extensions".
6. Select **Install Add-on From File...**.
7. Choose the downloaded `.xpi` file.

## Configuration

Click the extension icon in your browser toolbar to open the settings:

- **Auto-Submit Queries**: Toggle whether the extension should automatically submit the search query or just fill the input field.

## Privacy

This extension runs **only** on specific supported domains (currently `gemini.google.com`). It does not track your browsing history or collect any personal data. It solely transfers the query from the URL to the page input.

## License

GPL-3.0
