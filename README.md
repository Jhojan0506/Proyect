Proyecto: Arquitectura de Sistemas Computacionales con Enfoque Cloud  

Integrantes y Roles del Equipo:

| Nombre Completo | Rol Principal | Responsabilidades Específicas |
|----------------|---------------|-------------------------------|
| **Jhojan Stiven Carabali Palacios** | DevOps Engineer & Backend Lead | • Configuración de Docker y Docker Compose<br>• Implementación de Prometheus y Grafana<br>• Pipeline CI/CD con GitHub Actions<br>• Optimización de rendimiento |
| **Cristhian Farley Garces Bonilla** | Backend Developer & Testing | • Desarrollo de la API en Node.js<br>• Integración de métricas Prometheus<br>• Pruebas de carga y escalabilidad<br>• Documentación técnica |

------------------------------------------------------------------------------------------------------------------------------------------

Propósito: 
Este proyecto implementa un **sistema completo de monitoreo, análisis de rendimiento y optimización** para aplicaciones basadas en microservicios, utilizando tecnologías cloud-native y prácticas modernas de DevOps.

El sistema está diseñado para demostrar la aplicación integral de conceptos de arquitectura cloud, incluyendo:
- Observabilidad en tiempo real
- Automatización de despliegues (CI/CD)
- Pruebas de rendimiento y escalabilidad
- Optimización continua basada en métricas

------------------------------------------------------------------------------------------------------------------------------------------

Alcance del Sistema:

El sistema incluye las siguientes funcionalidades implementadas:

**Aplicación Backend:**
- API REST en Node.js con Express
- Endpoints de negocio (`/api`) y salud (`/health`)
- Exposición de métricas Prometheus (`/metrics`)

**Monitoreo Completo:**
- Recolección automática de métricas con Prometheus
- Dashboards interactivos en Grafana
- Alertas configurables basadas en umbrales

**Optimización:**
- Compresión HTTP para reducir latencia
- Escalado horizontal de contenedores
- Análisis de cuellos de botella

**CI/CD:**
- Pipeline automatizado con GitHub Actions
- Tests automáticos en cada commit
- Validación de contenedores Docker

------------------------------------------------------------------------------------------------------------------------------------------

Arquitectura del Sistema:

┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA CLOUD                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │  Cliente │─────▶│  Node.js App │─────▶│  Prometheus  │  │
│  │  HTTP    │      │   (Express)  │      │  (Métricas)  │  │
│  └──────────┘      └──────────────┘      └──────────────┘  │
│                            │                      │          │
│                            │                      ▼          │
│                            │              ┌──────────────┐  │
│                            │              │   Grafana    │  │
│                            │              │ (Dashboard)  │  │
│                            ▼              └──────────────┘  │
│                    ┌──────────────┐                         │
│                    │  PostgreSQL  │                         │
│                    │  (Opcional)  │                         │
│                    └──────────────┘                         │
│                                                              │
│  Todo orquestado con Docker Compose                         │
└─────────────────────────────────────────────────────────────┘
------------------------------------------------------------------------------------------------------------------------------------------

Tecnologías Utilizadas:

### Backend y APIs
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18.x | Runtime de JavaScript |
| **Express.js** | 4.x | Framework web minimalista |
| **prom-client** | 15.x | Cliente de métricas Prometheus |
| **compression** | 1.x | Compresión HTTP gzip |
| **winston** | 3.x | Logging estructurado |

### Monitoreo y Observabilidad
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Prometheus** | 2.45+ | Sistema de métricas time-series |
| **Grafana** | 10.x | Visualización de dashboards |

### DevOps y Contenedores
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Docker** | 24.x | Contenedorización |
| **Docker Compose** | 2.x | Orquestación multi-contenedor |
| **GitHub Actions** | - | CI/CD pipeline automatizado |

### Pruebas de Rendimiento
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **k6** | 0.47+ | Load testing moderno |
| **PowerShell** | 7.x | Scripts de pruebas |

### Deployment (Producción - Opciones Gratuitas)
| Servicio | Plan | Uso |
|----------|------|-----|
| **Render.com** | Free Tier | Hosting del backend |
| **Railway.app** | Free Tier | Alternativa de hosting |

------------------------------------------------------------------------------------------------------------------------------------------

Aplicación de Conceptos del Curso

1.Diseño de Arquitectura Cloud

**Implementación en el proyecto:**
- Arquitectura basada en microservicios
- Separación de responsabilidades (App, Monitoreo, Visualización)
- Comunicación via REST APIs
- Contenedorización con Docker

**Principios aplicados:**
- **Loose Coupling:** Cada servicio puede actualizarse independientemente
- **Stateless:** La app no mantiene estado entre requests
- **Containerization:** Todo corre en contenedores Docker
- **Service Discovery:** Los servicios se comunican por nombres DNS

2.Monitoreo y Métricas de Rendimiento

**Implementación:**
- **Prometheus:** Recolección automática de métricas cada 5 segundos
- **Grafana:** Visualización con dashboards personalizados
- **Métricas capturadas:** CPU, Memoria, Latencia, RPS, Error Rate

**Instrumentación del código:**
javascript
const client = require('prom-client');
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

3.Pipeline CI/CD

**Implementación:**
- GitHub Actions configurado en `.github/workflows/ci.yml`
- Workflow automático: checkout → test → build → validate
- Ejecución automática en cada push

**Beneficios obtenidos:**
-Detección temprana de errores
-Builds reproducibles
-Documentación automática del proceso

4.Pruebas de Rendimiento y Escalabilidad

**Herramientas utilizadas:**
- **PowerShell:** Scripts para generar tráfico (200-500 requests)
- **Grafana:** Visualización del impacto en tiempo real
- **Docker Compose:** Escalado horizontal (`--scale app=3`)

**Escenarios de prueba:**
- Carga normal: 50 requests/segundo
- Carga pico: 100 requests/segundo
- Escalado: 3 réplicas simultáneas

**Resultados:**
- Sistema estable hasta 100 VUs
- Latencia p95 < 250ms bajo carga
- Distribución equitativa entre réplicas (33% cada una)

5.Autoescalado y Balanceo de Carga

**Implementación:**
```bash
# Escalado horizontal
docker-compose up -d --scale app=3

# Docker distribuye automáticamente la carga
```

**Configuración de recursos:**
```yaml
deploy:
  replicas: 3
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

**Resultados:**
- Capacidad total aumentó 3x
- Latencia se mantuvo estable
- Tolerancia a fallos mejorada

6.Evaluación de Costos y Sostenibilidad

**Recursos utilizados (100% gratuitos en desarrollo):**

| Recurso | Plan | Costo Mensual |
|---------|------|---------------|
| GitHub | Free | $0 |
| GitHub Actions | Free | $0 (2000 min/mes) |
| Docker Desktop | Personal | $0 |
| Prometheus | Open Source | $0 |
| Grafana | Open Source | $0 |

**Proyección en producción:**

| Servicio | Proveedor | Plan | Costo/Mes |
|----------|-----------|------|-----------|
| Backend API | Render.com | Starter | $7 |
| Base de Datos | MongoDB Atlas | M0 Free | $0 |
| Prometheus | Grafana Cloud | Free | $0 |
| **Total** | | | **$7/mes** |

**Optimizaciones aplicadas:**
- Compresión HTTP (-81% transferencia)
- Contenedores ligeros (< 100MB)
- Recursos limitados por contenedor
- Escalado bajo demanda

------------------------------------------------------------------------------------------------------------------------------------------

Conclusiones y Aprendizajes del Equipo:

-Logros Principales

1. **Implementación exitosa de arquitectura cloud moderna**
   - Sistema completo de microservicios funcional
   - Todos los componentes se comunican correctamente
   - Sistema escalable y observable

2. **Dominio de herramientas de monitoreo**
   - Instrumentación de código con Prometheus
   - Dashboards útiles en Grafana
   - Comprensión de la importancia de la observabilidad

3. **Experiencia práctica con CI/CD**
   - Pipeline automatizado funcional
   - Tiempo de despliegue reducido
   - Confianza para iterar rápidamente

4. **Comprensión de escalabilidad**
   - Escalado horizontal mejora capacidad 3x
   - Identificación de cuellos de botella
   - Optimizaciones basadas en datos reales

-Dificultades Encontradas y Soluciones

| Desafío | Solución Aplicada |
|---------|-------------------|
| **Configuración inicial de Docker** | Usar docker-compose con redes aisladas |
| **Métricas no aparecían en Prometheus** | Verificar endpoints y configurar targets correctamente |
| **Grafana no conectaba con Prometheus** | Usar nombre del servicio (`prometheus:9090`) |
| **Pruebas de carga colapsaban el sistema** | Configurar límites de recursos en Docker |

------------------------------------------------------------------------------------------------------------------------------------------

-Aprendizajes Técnicos Clave

**Jhojan Stiven Carabali:**
> "Aprendí que el monitoreo no es opcional en sistemas modernos. Prometheus y Grafana nos dieron visibilidad total sobre qué estaba pasando en cada momento. Sin métricas, desplegábamos código a ciegas."

**Cristhian Farley Garces:**
> "La experiencia con pruebas de carga fue reveladora. Descubrimos cuellos de botella que no habríamos detectado sin testing. Docker Compose facilita muchísimo el trabajo con múltiples servicios."

------------------------------------------------------------------------------------------------------------------------------------------

Reflexión sobre Sostenibilidad:

**Viabilidad económica:**
- Es posible construir sistemas robustos sin inversión inicial
- Herramientas open source son enterprise-grade
- Costo en producción ($7/mes) accesible para startups

**Escalabilidad financiera:**
- Modelo "pay as you grow" ideal para MVPs
- Costos crecen proporcionalmente al uso real
- Sin vendor lock-in (todo open source)

------------------------------------------------------------------------------------------------------------------------------------------

Mejoras Futuras Propuestas:

1. **Implementar alerting automático** con Prometheus AlertManager
2. **Agregar base de datos PostgreSQL** para persistencia
3. **Implementar caching con Redis** para mejorar latencia
4. **Configurar Kubernetes** para auto-scaling real
5. **Agregar tests unitarios** con Jest/Mocha
6. **Implementar logging centralizado** con ELK Stack

Ultima actualizacion: Noviembre 2025

