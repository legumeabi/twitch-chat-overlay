export function preserveConfigScript() {
  let savedConfig = null;

  return {
    name: "preserve-config-script",
    enforce: "pre",
    transformIndexHtml(html) {
      // First pass: extract and save the config
      if (!savedConfig) {
        const configScriptMatch = html.match(/<script id="overlay-config">[\s\S]*?<\/script>/);
        if (configScriptMatch) {
          savedConfig = configScriptMatch[0];
          // Remove the original script
          html = html.replace(configScriptMatch[0], "");
        }
      }

      // Always ensure the config is at the top of head
      if (savedConfig) {
        // Insert the config script at the start of the head tag
        html = html.replace(/<head>/i, `<head>\n    ${savedConfig}`);
      }

      return html;
    },

    handleHotUpdate(ctx) {
      // Reset saved config on HTML changes to allow re-extraction
      if (ctx.file.endsWith("index.html")) {
        savedConfig = null;
      }
    },
  };
}
