import { Faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

let faro: Faro | null = null
export function initInstrumentation(): void {
  if (typeof window === 'undefined' || faro !== null || process.env.nodeEnv !== "production") return
  console.log('Initializing Faro')

  getFaro()
}

export function getFaro(): Faro {
  if (faro != null) return faro
  faro = initializeFaro({
    url: process.env.faroUrl,
    app: {
      name: process.env.faroAppName,
      namespace: process.env.faroNamespace,
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
      }),
      new TracingInstrumentation(),
    ],
  })
  return faro
}