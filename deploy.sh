cd build

if ! lsof -i :$PORT > /dev/null; then
    echo "Starting"
    http-server > server.log 2>&1 &
fi

cd ../
