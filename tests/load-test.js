import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de requests deben responder en menos de 500ms
    http_req_failed: ['rate<0.01'],   // Menos del 1% de errores
  },
};

export default function () {
  // Test del health check
  const healthRes = http.get('http://localhost:57050/health');
  check(healthRes, {
    'health status es 200': (r) => r.status === 200,
    'health responde OK': (r) => r.json('status') === 'OK',
  });

  sleep(0.5);

  // Test de listar órdenes
  const ordersRes = http.get('http://localhost:57050/api/orders?limit=5');
  check(ordersRes, {
    'orders status es 200': (r) => r.status === 200,
    'orders devuelve data': (r) => r.json('success') === true,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options = {}) {
  const indent = options.indent || '';
  const colors = options.enableColors;
  
  let summary = `
${indent}Resumen de Prueba de Carga
${indent}═══════════════════════════
${indent}Duración total: ${data.state.testRunDurationMs}ms
${indent}VUs (usuarios virtuales): ${data.metrics.vus.values.max}
${indent}
${indent}HTTP Requests:
${indent}  Total: ${data.metrics.http_reqs.values.count}
${indent}  Rate: ${data.metrics.http_reqs.values.rate.toFixed(2)}/s
${indent}  Failed: ${data.metrics.http_req_failed.values.passes || 0}
${indent}
${indent}Response Time:
${indent}  Min: ${data.metrics.http_req_duration.values.min.toFixed(2)}ms
${indent}  Avg: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
${indent}  Max: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms
${indent}  P95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
`;
  
  return summary;
}