#!/bin/bash

is_bootstrapped () {
    [ $# != 2 ] && echo is_bootstrapped requires two arguments: node_ip node_port && exit 1
    node_ip=$1
    node_port=$2
    curl -s -X POST --data '{ "jsonrpc":"2.0", "id"     :1, "method" :"health.getLiveness" }' -H 'content-type:application/json;' $node_ip:$node_port/ext/health | grep true > /dev/null
}

axiago_ip=127.0.0.1
axiago_ports=$(seq 80 2 9658)

max_bootstrapping_time=130

[ $# != 2 ] && echo usage: $0 avash_dir axiajs_dir && exit 1

avash_location=$1
axiajs_location=$2

# make absolute paths
avash_location=$(cd $avash_location; pwd)
axiajs_location=$(cd $axiajs_location; pwd)

# create avash ipc fifo
fifo_fname=$avash_location/avash.fifo
rm -f $fifo_fname
mkfifo $fifo_fname
sleep 6000 > $fifo_fname &

# start avash network
cd $avash_location
./avash < $fifo_fname &
echo runscript scripts/five_node_staking.lua >> $fifo_fname

# wait network bootstrapping
start_time=$(date -u +%s)
elapsed=0
sleep 2
for port in $axiago_ports
do
    echo waiting for node $axiago_ip:$port to finish bootstrapping
    is_bootstrapped $axiago_ip $port
    while [ $? != 0 ] && [ $elapsed -lt $max_bootstrapping_time ]
    do
        sleep 5
        end_time=$(date -u +%s)
        elapsed=$(($end_time-$start_time))
        is_bootstrapped $axiago_ip $port
    done
done
echo elapsed: $elapsed seconds
if [ $elapsed -gt $max_bootstrapping_time ]
then
    echo WARN: elapsed time is greater than max_bootstrapping_time $max_bootstrapping_time
fi

# execute tests
export AXIAGO_IP=$axiago_ip
export AXIAGO_PORT=$(echo $axiago_ports | cut -d" " -f1)
echo testing on axiago $AXIAGO_IP:$AXIAGO_PORT
cd $axiajs_location
yarn test -i --roots e2e_tests

# end avash network
cd $avash_location
echo exit >> $fifo_fname
echo killall axiago

# cleanup
rm -f $fifo_fname
