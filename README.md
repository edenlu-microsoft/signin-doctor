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

once things are working, may do the deployment below

```
az login
az acr login --name edencontainer
docker tag signin-doctor:1.0 edencontainer.azurecr.io/signin-doctor:1.0
docker push edencontainer.azurecr.io/signin-doctor:1.0
```

if seeing below error

```
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

it means the docker is not opened, start your Docker app and run it again
