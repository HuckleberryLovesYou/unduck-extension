# Unduck Helper

A companion browser extension for [Unduck](https://github.com/huckleberrylovesyou/unduck) that enables search autofill on websites that don't natively support URL query parameters (like Google Gemini).

## Features

-   **Seamless Redirects**: Detects specific `?unduck=QUERY` parameters and injects them into the target site's search bar.
-   **Smart Injection**: Uses specialized logic to handle complex inputs (like rich text editors on Gemini).
-   **Auto-Submit**: Configurable option to automatically press "Enter" or click "Send" after injection.
-   **Detection**: Allows the main Unduck web app to verify if the extension is installed to provide a smooth user experience.

## Installation

### Load Unpacked (Developer Mode)

1.  Clone this repository.
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the directory containing `manifest.json`.

## Configuration

Click the extension icon in your browser toolbar to open the settings:

-   **Auto-Submit Queries**: Toggle whether the extension should automatically submit the search query or just fill the input field.

## Privacy

This extension runs **only** on specific supported domains (currently `gemini.google.com`). It does not track your browsing history or collect any personal data. It solely transfers the query from the URL to the page input.

## License

MIT
