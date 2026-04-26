import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Servidor Miller AI estable 🚀");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!message) {
    return res.status(400).json({ error: "Falta el mensaje" });
  }

  try {
    // LLAMADA DIRECTA POR FETCH (Evita el error 404 del SDK)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({
      error: "Error de conexión directa",
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Corriendo en puerto ${PORT}`);
});
