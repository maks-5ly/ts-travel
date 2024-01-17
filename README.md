add `.env` file into the `app` directory

it requires only 1 variable

```dotenv
VITE_API_URL=http:localhost:PORT # REPLACE PORT with value you set in api/.env
```


add `.env` file into the `api` directory (see `.env.example`)

```dotenv
# APP
APP_NAME=travels
APP_ENV=development
APP_LANGUAGE=en
APP_HOST=0.0.0.0
APP_PORT=8080 # you can set your value
APP_DEBUG=true
APP_HTTP_ON=true

# MIDDLEWARES
MIDDLEWARE_TIMEOUT=100s # default response timeout

# AUTH
AUTH_JWT_ACCESS_TOKEN_SECRET_KEY= # you_secret
AUTH_JWT_ACCESS_TOKEN_EXPIRED=  # e.g. 365d

# DATABASE
POSTGRES_HOST=postgres # postgres if you run app in docker or `localhost` if you run it locally
POSTGRES_PORT=5432 #DB port, you can change it 
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
POSTGRES_DB=travels
AUTO_CREATE_DB=true
#DATABASE_DEBUG=true
DATABASE_DEBUG=false

# NEST
NEST_DEBUG=

# SYSTEM SEED
SYSTEM_ADMIN_EMAIL= # will be used for seeding of DB, e.g. maksim.z@5ly.co
SYSTEM_ADMIN_PASSWORD= # your password for admin, e.g. 123456
```

After you have added the `.env` files, the project can be started with the following command:

```shell
 docker compose --env-file=./api/.env --profile dev up --build --wait
```
