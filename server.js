import cors from "cors";
import express from "express";
import { join } from "path";
import process from "process";
import { fileURLToPath } from "url";
import { build, createServer } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const isDevelopment = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(join(projectRoot, "public")));

// Development server setup
async function startDevServer() {
  try {
    const devServer = await createServer({
      configFile: join(projectRoot, "vite.generator.config.js"),
    });

    await devServer.listen();
    console.log("Generator frontend dev server running at http://localhost:3000");
  } catch (error) {
    console.error("Failed to start dev server:", error);
  }
}

// Overlay build functionality
async function buildOverlay(config) {
  const {
    channelName,
    chatStripMode = false,
    maxMessages = 20,
    showBadges = false,
    showPronouns = true,
    removeMessagesAfterTimer = false,
    messageRemovalTimer = 5000,
  } = config;

  // Validate configuration
  if (!channelName) {
    throw new Error("Channel name is required");
  }

  if (typeof maxMessages !== "number" || maxMessages < 1) {
    throw new Error("maxMessages must be a positive number");
  }

  if (typeof messageRemovalTimer !== "number" || messageRemovalTimer < 1000) {
    throw new Error("messageRemovalTimer must be at leat 1000 milliseconds");
  }

  console.log("Starting Vite build for the overlay");

  const buildResult = await build({
    configFile: join(projectRoot, "vite.overlay.config.js"),
    define: {
      __CHANNEL_NAME__: JSON.stringify(channelName),
      __CHAT_STRIP_MODE__: JSON.stringify(chatStripMode),
      __MAX_MESSAGES__: JSON.stringify(maxMessages),
      __SHOW_BADGES__: JSON.stringify(showBadges),
      __SHOW_PRONOUNS__: JSON.stringify(showPronouns),
      __REMOVE_MESSAGES_AFTER_TIMER__: JSON.stringify(removeMessagesAfterTimer),
      __MESSAGE_REMOVAL_TIMER__: JSON.stringify(messageRemovalTimer),
    },
  });

  const output = buildResult.output?.[0];

  return {
    content: output.source,
    filename: `${channelName}-overlay.html`,
  };
}

// Express route handlers
app.get("/", async (req, res) => {
  try {
    build;
    const config = {
      channelName: req.query.channelName,
      chatStripMode: req.query.chatStripMode === "true",
      maxMessages: parseInt(req.query.maxMessages),
      showBadges: req.query.showBadges === "true",
      showPronouns: req.query.showPronouns === "true",
      removeMessagesAfterTimer: req.query.removeMessagesAfterTimer === "true",
      messageRemovalTimer: parseInt(req.query.messageRemovalTimer),
    };

    console.log("Received build request with query:", config);

    const result = await buildOverlay(config);

    // Set headers for file download
    res.set({
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Content-Length": result.content.length,
    });

    res.send(result.content);
  } catch (error) {
    console.error("Build error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  try {
    // 1. Start dev server if in development mode
    if (isDevelopment) {
      await startDevServer();
    }

    // 2. Start the main Express server (handles both static files and /build endpoint)
    app.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}`);
      console.log(`Server running in ${isDevelopment ? "development" : "production"} mode`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
