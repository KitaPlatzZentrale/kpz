# KPZ Frontend

## Docker

### Build

```bash
docker build -t goodbuy/kpz-prod-frontend .
```

### Run locally

`--rm` removes the container after stiopping it.\
`-d` runs the container in the background.\
`-p` maps the port 5173 of the host to the port 5173 of the container.\
`--name` sets the name of the container to `kpz-prod-frontend`.\
`goodbuy/kpz-prod-frontend` is the name of the image to run.

```bash
docker run --rm -d -p 5173:5173 --name kpz-frontend goodbuy/kpz-prod-frontend
```

