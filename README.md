## React + TypeScript + Vite

debug locally run `npm run dev`

## Deployment

Build image:

```
docker login
docker build -t signin-doctor:1.0 .

```

testing locally:

```
docker run -p 8080:8080 signin-doctor:1.0
```

once things are working, may do the deployment:

```
docker tag signin-doctor:1.0 edencontainer.azurecr.io/signin-doctor:1.0
az login
az acr login --name edencontainer
docker push edencontainer.azurecr.io/signin-doctor:1.0
```
