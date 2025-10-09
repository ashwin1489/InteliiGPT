



// // routes/chat.js
// import express from "express";
// import Thread from "../models/Thread.js";
// import getOpenAIAPIResponse from "../utils/openai.js";

// const router = express.Router();

// // Test route (avoid unique collisions)
// router.post("/test", async (req, res) => {
//   try {
//     const thread = new Thread({
//       threadId: `test-${Date.now()}`,
//       title: "Testing New Thread2"
//     });

//     const response = await thread.save();
//     return res.send(response);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: "Failed to save in DB" });
//   }
// });

// // Get all threads
// router.get("/thread", async (req, res) => {
//   try {
//     const threads = await Thread.find({}).sort({ updatedAt: -1 });
//     return res.json(threads);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: "Failed to fetch threads" });
//   }
// });

// // Get messages for a thread
// router.get("/thread/:threadId", async (req, res) => {
//   const { threadId } = req.params;

//   try {
//     const thread = await Thread.findOne({ threadId });

//     if (!thread) {
//       return res.status(404).json({ error: "Thread not found" });
//     }

//     return res.json(thread.messages);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: "Failed to fetch chat" });
//   }
// });

// // Delete a thread
// router.delete("/thread/:threadId", async (req, res) => {
//   const { threadId } = req.params;

//   try {
//     const deletedThread = await Thread.findOneAndDelete({ threadId });

//     if (!deletedThread) {
//       return res.status(404).json({ error: "Thread not found" });
//     }

//     return res.status(200).json({ success: "Thread deleted successfully" });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: "Failed to delete thread" });
//   }
// });

// // Chat route
// router.post("/chat", async (req, res) => {
//   const { threadId, message } = req.body;

//   if (!threadId || typeof message !== "string" || message.trim() === "") {
//     return res.status(400).json({ error: "missing required fields" });
//   }

//   try {
//     let thread = await Thread.findOne({ threadId });

//     if (!thread) {
//       // Create a new thread in DB
//       thread = new Thread({
//         threadId,
//         title: message.slice(0, 100),
//         messages: [{ role: "user", content: message }]
//       });
//     } else {
//       thread.messages.push({ role: "user", content: message });
//     }

//     // Call OpenAI safely
//     const assistantReply = await getOpenAIAPIResponse(message);

//     // Only push valid assistant content
//     thread.messages.push({ role: "assistant", content: assistantReply });
//     thread.updatedAt = new Date();

//     await thread.save();
//     return res.json({ reply: assistantReply });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: err.message || "something went wrong" });
//   }
// });

// export default router;


// routes/chat.js
import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";

const router = express.Router();

// Test route: create a thread
router.post("/test", async (_req, res) => {
  try {
    const thread = new Thread({
      threadId: `test-${Date.now()}`,
      title: "Testing New Thread2",
    });
    const response = await thread.save();
    return res.send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to save in DB" });
  }
});

// List threads
router.get("/thread", async (_req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    return res.json(threads);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get messages for a thread (by custom threadId)
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    return res.json(thread.messages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete a thread (by custom threadId)
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) return res.status(404).json({ error: "Thread not found" });
    return res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to delete thread" });
  }
});

// Chat (Gemini only)
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.slice(0, 100),
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGeminiAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    return res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message || "something went wrong" });
  }
});

export default router;
