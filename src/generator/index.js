document.getElementById("config-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const config = {
    channelName: formData.get("channelName"),
    chatStripMode: formData.get("chatStripMode") === "on",
    maxMessages: parseInt(formData.get("maxMessages")),
    showBadges: formData.get("showBadges") === "on",
    showPronouns: formData.get("showPronouns") === "on",
    removeMessagesAfterTimer: formData.get("removeMessagesAfterTimer") === "on",
    messageRemovalTimer: parseInt(formData.get("messageRemovalTimer")) * 1000, // Convert seconds to milliseconds
  };

  try {
    const searchParams = new URLSearchParams(config);
    const url = `http://localhost:3002/build?${searchParams}`;

    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate overlay");
    }

    // The browser will automatically download the file
    window.location.href = url;
  } catch (error) {
    alert(error.message);
  }
});
