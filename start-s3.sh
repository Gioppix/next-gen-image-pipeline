docker run -d \
    -p 9000:9000 \
    -p 9001:9001 \
    --name minio \
    -v minio:/data \
    -e "MINIO_ROOT_USER=username1" \
    -e "MINIO_ROOT_PASSWORD=password1" \
    -e "MINIO_CONSOLE_ADDRESS=:9001" \
    -e "MINIO_VOLUMES=/data" \
    quay.io/minio/minio server
