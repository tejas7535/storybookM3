# Goldwind Application

## Contributoring

### Run "dev" configuration (against china dev env)

simply run `npm run start -- goldwind --configuration dev` in the project root directory

### Run "local" configuration (against mock server)

1. Start the mock server with from the `apps/goldwind` directory with `npm run mock-server` (may require a `npm install` before to get the tooling) this will serve a mocked api replication of the backend implementation
2. Start the actual live server of the application from the project root directory with `npm run start -- goldwind --configuration local`
