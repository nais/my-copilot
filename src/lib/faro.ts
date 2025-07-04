import { Faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

let faro: Faro | null = null

export function initInstrumentation(): void {
  if (typeof window === 'undefined' || faro !== null || process.env.NODE_ENV !== "production") return
  console.log('Initializing Faro')

  getFaro()
}

export function getFaro(): Faro {
  if (faro != null) return faro
  faro = initializeFaro({
    url: process.env.NEXT_PUBLIC_FARO_URL || "https://telemetry.ekstern.dev.nav.no/collect",
    app: {
      name: process.env.NEXT_PUBLIC_FARO_APP_NAME || "min-copilot",
      namespace: process.env.NEXT_PUBLIC_FARO_NAMESPACE || "nais",
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