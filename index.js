import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Inicialización de Google AI con tu API KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint de prueba para verificar que el servidor está activo
app.get("/", (req, res) => {
  res.send("Servidor Miller AI con Gemini funcionando 🚀");
});

// Endpoint principal del Chat
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Falta el mensaje en el cuerpo de la solicitud"
    });
  }

  try {
    // Usamos gemini-1.5-flash para evitar errores de cuota y 404
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generar respuesta
    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (error) {
    console.error("ERROR DETECTADO EN GEMINI:", error);

    // Si el error es por cuota o modelo no encontrado, lo detallamos
    res.status(500).json({
      error: "Error al conectar con la API de Gemini",
      detail: error.message
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de Miller corriendo exitosamente en el puerto ${PORT}`);
});
