# Kubernetes Context

## Objetivo
Se preparó estructura Kubernetes para desplegar app-luisops con base reutilizable y overlay de producción.

## Lo que ya estaba creado (base)
- `k8s/base/namespace.yaml`
- `k8s/base/serviceaccount.yaml`
- `k8s/base/clusterrole.yaml`
- `k8s/base/clusterrolebinding.yaml`

## Lo que se creó ahora

### Base (`k8s/base`)
- `deployment-backend.yaml`
  - Imagen: `ghcr.io/luisrodvilladaorg/app-luisops-backend:latest`
  - Puerto contenedor: `3100`
  - `serviceAccountName: dashboard-reader`
  - Probes: `readiness` y `liveness` en `/api/health`
  - Variables de entorno:
    - `PORT=3100`
    - `CORS_ORIGIN=*`
    - `PROMETHEUS_URL=http://kube-prom-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090`
    - `ARGOCD_API_URL=https://argocd.wellness.local/api/v1`
    - `ARGOCD_TOKEN` desde secret `backend-secrets`
    - `GITHUB_TOKEN` desde secret `backend-secrets` (opcional)

- `deployment-frontend.yaml`
  - Imagen: `ghcr.io/luisrodvilladaorg/app-luisops-frontend:latest`
  - Puerto contenedor: `80`
  - Probes HTTP en `/`

- `service-backend.yaml`
  - Tipo: `ClusterIP`
  - Puerto: `3100 -> 3100`

- `service-frontend.yaml`
  - Tipo: `ClusterIP`
  - Puerto: `80 -> 80`

- `kustomization.yaml`
  - Incluye namespace, RBAC, deployments y services.

### Overlay prod (`k8s/overlays/prod`)
- `kustomization.yaml`
  - Base: `../../base`
  - Incluye `sealedsecret-backend-tokens.yaml`
  - Override de imágenes con tags:
    - `ghcr.io/luisrodvilladaorg/app-luisops-backend:REPLACE_WITH_BACKEND_TAG`
    - `ghcr.io/luisrodvilladaorg/app-luisops-frontend:REPLACE_WITH_FRONTEND_TAG`

- `sealedsecret-backend-tokens.yaml`
  - Define `SealedSecret` llamado `backend-secrets` en namespace `dashboard`
  - Llaves esperadas:
    - `ARGOCD_TOKEN`
    - `GITHUB_TOKEN`
  - Valores actuales son placeholders y deben reemplazarse con valores cifrados reales de `kubeseal`.

## Validaciones realizadas
- `kubectl kustomize k8s/base` renderiza correctamente.
- `kubectl kustomize k8s/overlays/prod` renderiza correctamente.

## Pendiente para dejar prod aplicable
1. Reemplazar placeholders de `sealedsecret-backend-tokens.yaml` con valores cifrados reales.
2. Reemplazar tags `REPLACE_WITH_*_TAG` en `k8s/overlays/prod/kustomization.yaml`.
3. Aplicar overlay:
   - `kubectl apply -k k8s/overlays/prod`
4. Verificar rollout:
   - `kubectl -n dashboard rollout status deploy/luisops-backend`
   - `kubectl -n dashboard rollout status deploy/luisops-frontend`
