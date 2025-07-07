export function preserveConfigScript() {
  let savedConfig = null;
  let savedTheme = null;

  return {
    name: "preserve-config-script",
    enforce: "pre",
    transformIndexHtml(html) {
      // First pass: extract and save the config and theme
      if (!savedConfig || !savedTheme) {
        const configScriptMatch = html.match(/<script id="overlay-config">[\s\S]*?<\/script>/);
        const themeStyleMatch = html.match(/<style id="overlay-theme">[\s\S]*?<\/style>/);

        if (configScriptMatch) {
          savedConfig = configScriptMatch[0];
          // Remove the original script
          html = html.replace(configScriptMatch[0], "");
        }

        if (themeStyleMatch) {
          savedTheme = themeStyleMatch[0];
          // Remove the original style
          html = html.replace(themeStyleMatch[0], "");
        }
      }

      // Always ensure the config and theme are at the top of head
      if (savedConfig || savedTheme) {
        // Insert the config script and theme style at the start of the head tag
        let insertContent = "";
        if (savedConfig) insertContent += savedConfig;
        if (savedTheme) insertContent += "\n    " + savedTheme;
        html = html.replace(/<head>/i, `<head>\n    ${insertContent}`);
      }

      return html;
    },

    handleHotUpdate(ctx) {
      // Reset saved config and theme on HTML changes to allow re-extraction
      if (ctx.file.endsWith("index.html")) {
        savedConfig = null;
        savedTheme = null;
      }
    },
  };
}
