cd build

if ! lsof -i :$PORT > /dev/null; then
    echo "Starting"
    serve -s . > server.log 2>&1 &
fi

cd ../
