docker compose down
docker compose --project-name=carhive --file=./compose.dev.yml --progress=tty --parallel=-1 \
  up --build --watch
