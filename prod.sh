docker compose down
docker compose --project-name=carhive --file=./compose.prod.yml --progress=tty --parallel=-1 up
