# Twitch Chat Overlay Base

A base for customizable Twitch chat overlays. The base design is (_drumroll_) very basic and consists of a red-ish transparent rounded box to the left of the screen. The username and pronouns (if provided) are displayed with the user's chat color as the background. Standard Twitch emotes, BTTV, and FFZ emotes are supported. There is also a chat strip mode where the chat is displayed on a horizontal strip at the bottom of the screen.

## Integration into OBS

This guide describes OBS, but it should work almost identically in other streaming software.

The polling tool consists of a single HTML file that contains all the code and can be integrated into OBS as a browser source.

1. Download the latest version under the Release section of this GitHub repository (for example, `twitch-chat-overlay-4.0.0.html`).
2. Open the HTML file in your editor of choice and edit at least the channel name field to be your channel of choice. For example, replace `CHANNEL_NAME = 'legumeabi'` with `CHANNEL_NAME = 'mychannelname'` if you want the chat to display everything that happens on the Twitch channel "mychannelname".
3. Optionally edit the other options:

- `CHAT_STRIP_MODE = true`: to display a strip mode chat
- `MAX_MESSAGES = 20`: to limit the maximum number of messages displayed concurrently to the provided number
- `SHOW_BADGES = false`: to disable the display of badges next to usernames
- `SHOW_PRONOUNS = false`: to disable the display of pronouns next to usernames
- `REMOVE_MESSAGES_AFTER_TIMER = true`: to make messages disappear automatically after a certain time
- `MESSAGE_REMOVAL_TIMER = 60000`: the amount of time after which the messages should disappear (only considered when `REMOVE_MESSAGES_AFTER_TIMER = true`)

4. Create a new browser source in OBS.
5. In that browser source's properties, check `Local file` and then select the just edited Twitch chat overlay HTML file.
6. Set Width to 1920 and Height to 1080.

## Where do I start with changes to the code?

- Theming: If you want to make some theming changes (colors, font, spacing), the top-level CSS variables at the top of the HTML file are the right spot.
- Advanced Styling: If you want to get into the weeds, you can also edit the `legumes-theme.css` file or make a copy of it and include that in the HTML instead, where you can then make the changes you want in the core CSS.
- Advanced Code Changes: If you want to make changes, for example, to the order or structure of the HTML, check out `src/main.js`, and particularly the `createMessageHTMLElement()` function.

## Creating a New Release

This is a step-by-step guide to our own release process.

1. Create and push a new commit with the following things:

- Make sure the changelog is up-to-date: Everything that was "unreleased" previously should now live under a new version header under appropriate subheaders (features, bug fixes, internal changes).
- Make sure the same version number is updated in the package.json and also run `npm install` once so that it is reflected in the package-lock.json.

2. Trigger the GitHub workflow "Release a new version":

- Pick the `main` branch with the latest commit
- Enter the previously chosen version number and hit "Run workflow"
- This creates a draft release with that version number

3. Edit and Publish Draft Release

- Paste the changelog for the specific version into the draft release
- Verify that the HTML file is downloadable in the assets section
- Publish the release
