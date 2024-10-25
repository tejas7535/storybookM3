
### Run Lsa
make sure that configuration in app.js reflect your type of configuration, for lsa: 0
1. `nx build lsa --configuration local --watch`
2. `npx http-server --cors -c-1 --port 8000 dist/apps/lsa`
3. `npm run embed-app:webcomponent`

# Run ea
make sure that configuration in app.js reflect your type of configuration, for ea: 1

1. `nx build ea --configuration local --watch`
2. `npx http-server --cors -c-1 --port 8000 dist/apps/ea`
3. `npm run embed-app:webcomponent`
