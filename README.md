# Calculadora de gastos

Aplicación web estática para registrar ingresos/gastos mensuales y consultar un resumen anual. También incluye un conversor de monedas simple pensado como ayuda rápida dentro de la misma interfaz.

## Qué mejora esta revisión

- Corrige validaciones rotas en el formulario principal y en el conversor.
- Reemplaza la clave embebida por una consulta dinámica a un endpoint abierto y sin clave.
- Mejora el texto visible, el idioma del documento y algunos detalles de accesibilidad.
- Hace más robusta la lectura desde `localStorage` para evitar que datos corruptos rompan la UI.

## Estructura

- `index.html`: marcado principal de la aplicación.
- `css/app.css`: reset/base global.
- `css/style.css`: estilos de la interfaz.
- `scripts/app.js`: lógica de ingresos, gastos y resumen anual.
- `scripts/currencyConverter.js`: lógica del conversor de monedas.

## Cómo ejecutar

Como es un proyecto estático, basta con abrir `index.html` en el navegador. Si quieres evitar problemas con rutas absolutas (`/css/...`, `/scripts/...`), conviene servir la carpeta con un servidor local sencillo.

Ejemplo con Python:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Próximas mejoras recomendadas

1. Persistir también cada movimiento individual, no solo el acumulado mensual.
2. Separar la lógica de negocio del acceso al DOM para poder testearla.
3. Añadir tests automáticos para validaciones y cálculos.
4. Si el proyecto crece, mover la consulta de divisas a un backend propio para cachear respuestas y controlar errores/rate limits.


## Conversor de divisas

El conversor consulta cotizaciones actualizadas contra el endpoint abierto de ExchangeRate-API y muestra la fecha de la última actualización devuelta por el servicio.
