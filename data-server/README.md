# Badegewässer Berlin

## Docker

```bash
$ docker build -t technologiestiftung/badegewaesser .

# then
$ docker run --name badegewaesser -d -p 3535:3535  technologiestiftung/badegewaesser:latest

# check if it is running

$ docker ps

# and end it with the id from 
$ docker stop badegewaesser

# or kill it 

$ docker kill badegewaesser
```

Or easier would be:

```bash
# -d sends it to the background omit it and you will get the output
$ docker-compose up -d

```

**!Note:** If you used the `docker` way before you might get an error with the `--name badegewaesser`

```bash
$ docker-compose up
> ERROR: for badegewaesser  Cannot create container for service badegewaesser: Conflict. The container name "/badegewaesser" is already in use by container "9d614c06c3f128a4e7e6e6f62dc4fa19fe641f8cdee1a7baa3887a92e240f850". You have to remove (or rename) that container to be able to reuse that name.
# run to remove
$ docker rm badegewaesser
```


Test the if the api is running

```bash
$ curl "http://localhost:3535/test"
> {"message":"Get Test."}
```

```bash
$ curl "http://localhost:3535/berlin"
> {"message":"Hello Berlin"}
```

