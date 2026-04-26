import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Cargar variables de entorno
dotenv.config();

const app = express();

// 2. Middlewares esenciales
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// 3. Configuración de la API de Google
// Asegúrate de que GEMINI_API_KEY en Render no tenga espacios extra
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 4. Ruta de salud (Health Check)
app.get("/", (req, res) => {
  res.send("Servidor Miller AI activo y listo para procesar mensajes 🚀");
});

// 5. Ruta principal del Chat
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ 
      error: "Petición inválida", 
      message: "El campo 'message' es obligatorio en el cuerpo de la solicitud." 
    });
  }

  try {
    /**
     * IMPORTANTE: Usamos 'gemini-1.5-flash-latest'. 
     * Este alias fuerza al SDK a buscar la versión más reciente disponible 
     * en la región de tu servidor, evitando el error 404 de rutas beta.
     */
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest" 
    });

    // Generación del contenido
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Respuesta exitosa al cliente
    res.json({ 
      reply: text 
    });

  } catch (error) {
    console.error("--- ERROR EN LA LLAMADA A GEMINI ---");
    console.error(error);

    // Respuesta detallada para depuración en Hoppscotch
    res.status(500).json({
      error: "Error en el procesamiento del mensaje",
      detail: error.message,
      check: "Verifica que la API Key en Render sea correcta y no tenga espacios."
    });
  }
});

// 6. Encendido del servidor
app.listen(PORT, () => {
  console.log(`>>> Servidor Miller AI corriendo en: http://localhost:${PORT}`);
  console.log(`>>> Puerto configurado: ${PORT}`);
});
