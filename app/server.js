const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Variables para métricas básicas
let requestCount = 0;
let errorCount = 0;
const startTime = Date.now();

// Middleware para contar requests
app.use((req, res, next) => {
  requestCount++;
  next();
});

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/campgo_orders';

mongoose.connect(MONGO_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    errorCount++;
  });

// Schema de Order
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'on_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryPersonId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ========== ENDPOINTS ==========

// Health Check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    service: 'Orders Microservice',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor((Date.now() - startTime) / 1000)}s`
  });
});

// Endpoint de métricas para Prometheus
app.get('/metrics', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage();
  
  const metrics = `
# HELP campgo_requests_total Total number of requests
# TYPE campgo_requests_total counter
campgo_requests_total ${requestCount}

# HELP campgo_errors_total Total number of errors
# TYPE campgo_errors_total counter
campgo_errors_total ${errorCount}

# HELP campgo_uptime_seconds Service uptime in seconds
# TYPE campgo_uptime_seconds gauge
campgo_uptime_seconds ${uptime}

# HELP campgo_memory_usage_bytes Memory usage in bytes
# TYPE campgo_memory_usage_bytes gauge
campgo_memory_usage_bytes{type="rss"} ${memoryUsage.rss}
campgo_memory_usage_bytes{type="heapTotal"} ${memoryUsage.heapTotal}
campgo_memory_usage_bytes{type="heapUsed"} ${memoryUsage.heapUsed}

# HELP campgo_db_status Database connection status (1=connected, 0=disconnected)
# TYPE campgo_db_status gauge
campgo_db_status ${mongoose.connection.readyState === 1 ? 1 : 0}
`;
  
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

// GET - Listar órdenes con paginación
app.get('/api/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Optimización de rendimiento
    
    const total = await Order.countDocuments();

    res.json({
      success: true,
      data: orders,
      pagination: { 
        page, 
        limit, 
        total, 
        pages: Math.ceil(total / limit) 
      }
    });
  } catch (error) {
    errorCount++;
    console.error('Error en GET /api/orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Crear nueva orden
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, restaurantId, items, deliveryAddress } = req.body;
    
    // Validación
    if (!userId || !restaurantId || !items || !deliveryAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Faltan campos requeridos: userId, restaurantId, items, deliveryAddress' 
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'items debe ser un array no vacío' 
      });
    }

    // Calcular total
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Crear orden
    const newOrder = new Order({
      userId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress
    });

    await newOrder.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Orden creada exitosamente',
      data: newOrder 
    });
  } catch (error) {
    errorCount++;
    console.error('Error en POST /api/orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Actualizar estado de orden
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status, deliveryPersonId } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        error: 'El campo status es requerido' 
      });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'on_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}` 
      });
    }

    const updateData = { status, updatedAt: new Date() };
    if (deliveryPersonId) updateData.deliveryPersonId = deliveryPersonId;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Estado actualizado correctamente',
      data: order 
    });
  } catch (error) {
    errorCount++;
    console.error('Error en PUT /api/orders/:id/status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obtener orden específica
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    errorCount++;
    console.error('Error en GET /api/orders/:id:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Cancelar orden
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Orden cancelada correctamente',
      data: order 
    });
  } catch (error) {
    errorCount++;
    console.error('Error en DELETE /api/orders/:id:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'CampGO Orders Microservice',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      orders: '/api/orders',
      createOrder: 'POST /api/orders',
      updateStatus: 'PUT /api/orders/:id/status',
      getOrder: 'GET /api/orders/:id',
      cancelOrder: 'DELETE /api/orders/:id'
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint no encontrado' 
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Métricas disponibles en http://localhost:${PORT}/metrics`);
  console.log(`💓 Health check en http://localhost:${PORT}/health`);
});