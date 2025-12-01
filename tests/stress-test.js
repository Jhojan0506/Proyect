import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up a 10 usuarios
    { duration: '30s', target: 30 },   // Incremento a 30 usuarios
    { duration: '30s', target: 50 },   // Incremento a 50 usuarios
    { duration: '30s', target: 100 },  // Estrés máximo: 100 usuarios
    { duration: '1m', target: 0 },     // Ramp down gradual
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% bajo 1 segundo en estrés
    http_req_failed: ['rate<0.05'],    // Máximo 5% de errores permitidos
  },
};

export default function () {
  // Test de health
  const healthRes = http.get('http://localhost:57050/health');
  check(healthRes, {
    'health status OK': (r) => r.status === 200,
  });

  sleep(0.3);

  // Test de listado de órdenes
  const ordersRes = http.get('http://localhost:57050/api/orders');
  check(ordersRes, {
    'orders responde': (r) => r.status === 200 || r.status === 500,
    'orders no timeout': (r) => r.status !== 0,
  });

  sleep(1);
}

export function handleSummary(data) {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('   RESULTADOS DE PRUEBA DE ESTRÉS');
  console.log('═══════════════════════════════════════');
  console.log(`Requests totales: ${data.metrics.http_reqs.values.count}`);
  console.log(`Requests fallidos: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
  console.log(`Duración promedio: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`);
  console.log(`P95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);
  console.log(`P99: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms`);
  console.log('═══════════════════════════════════════');
  
  return {
    'stdout': JSON.stringify(data, null, 2),
  };
}