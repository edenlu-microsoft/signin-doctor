## React + TypeScript + Vite
debug locally run `npm run dev`

## Deployment
```
az login
az account set --subscription "D365_Commerce_Rendering_Corp_NonProd"
az webapp deployment user set --user-name edenlu --password 123456
az webapp deployment source config-local-git --name signin-doctor --resource-group rg-ecommerce-global
git push https://signin-doctor.scm.azurewebsites.net:443/signin-doctor.git master
```