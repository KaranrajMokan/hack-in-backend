#!/bin/bash
set -e

to=$1
shift

echo "In DockerTimeout"
cont=$(sudo docker run --rm -d "$@")
code=$(timeout "$to" docker wait "$cont" || true)
echo $cont
sudo docker kill $cont &> /dev/null
echo -n 'status: '
if [ -z "$code" ]; then
    echo timeout
else
    echo exited: $code
fi

echo output:
# pipe to sed simply for pretty nice indentation
sudo docker logs $cont | sed 's/^/\t/'

sudo docker rm $cont &> /dev/null