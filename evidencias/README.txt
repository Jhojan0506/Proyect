Proyecto: Monitoreo, Optimización y CI/CD

Este proyecto implementa un sistema de monitoreo y análisis de rendimiento para una aplicación basada en microservicios utilizando Prometheus, Grafana y Docker, con un flujo de Integración Continua (CI) mediante GitHub Actions.

Objetivo general:

Optimizar la eficiencia, observabilidad y control del rendimiento de una aplicación web mediante la implementación de contenedores Docker y herramientas de monitoreo modernas.

Objetivos específicos:

Configurar una aplicación básica en Node.js con métricas Prometheus integradas.

Implementar Prometheus para recolectar las métricas del servicio.

Utilizar Grafana para visualizar los datos de rendimiento en tiempo real.

Generar tráfico simulado para observar el comportamiento del sistema.

Implementar un flujo de CI/CD en GitHub Actions.

Evaluar mejoras de optimización (como compresión HTTP y escalado de contenedores).

Tecnologías utilizadas:

Node.js

Express.js

Prometheus

Grafana

Docker y Docker Compose

Git / GitHub

GitHub Actions

Estructura del proyecto:
monitoring-project/
├─ app/
│  ├─ package.json
│  └─ server.js
├─ docker/
│  └─ prometheus.yml
├─ Dockerfile
├─ docker-compose.yml
└─ evidencias/

Pasos principales realizados:
Paso 1. Creación del proyecto

Se creó la estructura del proyecto con carpetas app y docker.

Se agregaron los archivos: package.json, server.js, Dockerfile y docker-compose.yml.

Paso 2. Configuración de la aplicación

Se desarrolló un servicio en Node.js que expone métricas para Prometheus.

Endpoints creados:

/api → Procesa solicitudes simuladas.

/health → Verifica el estado del servicio.

/metrics → Devuelve métricas Prometheus.

Paso 3. Contenerización con Docker

Se construyó la imagen del microservicio con Dockerfile.

Se configuraron los servicios de Prometheus y Grafana con docker-compose.yml.

Comando ejecutado:

docker compose up -d --build

Paso 4. Configuración en Grafana

Se agregó Prometheus como fuente de datos (http://prometheus:9090).

Se creó el dashboard Microservice Metrics con la consulta:

sum(rate(http_request_duration_seconds_count[1m]))

Paso 5. Generación de tráfico

Se simularon solicitudes a la app con PowerShell:

1..200 | % { Invoke-WebRequest -Uri http://localhost:3000/api -UseBasicParsing | Out-Null }


Esto permitió visualizar picos y tasas de peticiones en Grafana.

Paso 6. Optimización

Se aplicó compresión HTTP agregando la librería compression al servidor.

Se probaron variaciones en la carga y el escalado (--scale app=2).

Paso 7. Integración Continua (CI)

Se configuró GitHub Actions con un workflow básico para ejecutar:

Instalación de dependencias.

Construcción del contenedor Docker.

Ejecución de pruebas automáticas.

Consultas utilizadas en Grafana:
Métrica	Descripción
sum(rate(http_request_duration_seconds_count[1m]))	Solicitudes por segundo (RPS)
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))	Latencia al 95%
http_request_duration_seconds_count	Total de solicitudes procesadas

Resultados:

Se logró monitorear en tiempo real las solicitudes al servidor Node.js.

Prometheus registró correctamente las métricas y Grafana las visualizó en dashboards.

Tras aplicar compresión HTTP, se observó una reducción en la latencia promedio.

El pipeline CI/CD en GitHub se ejecutó automáticamente al hacer push al repositorio.

Conclusiones:

La integración entre Prometheus y Grafana permite una observabilidad completa del sistema.

Docker Compose facilita el despliegue y la escalabilidad de servicios.

Con GitHub Actions, se garantiza la ejecución automatizada de pruebas y despliegues continuos.

Las optimizaciones aplicadas mejoran la eficiencia general del sistema y demuestran el impacto de una buena monitorización.


Autores:
Jhojan Stiven Carabali Palacios
Cristhian Farley Garces Bonilla
