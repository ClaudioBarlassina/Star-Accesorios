import express from 'express';
import cors from 'cors';
import supabase from './supabase.js';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para obtener datos de una tabla (por ejemplo, "productos")
app.get('/productos', async (req, res) => {
  const { data, error } = await supabase.from('Productos').select('*');

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

// Endpoint para insertar un producto
app.post('/productos', async (req, res) => {
  const { nombre, precio } = req.body;
  const { data, error } = await supabase.from('productos').insert([{ nombre, precio }]);

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
