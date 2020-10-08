#!/bin/bash

AUTH="kibana:changeme"

echo "Checking if Elasticsearch is up before continuing"
COUNTER=0
RECHECK=true
while [ "$RECHECK" = true ]; do
    touch /tmp/esupcheck.txt
    curl -XGET 'http://localhost:9200/' -u $AUTH -o /tmp/esupcheck.txt 2>/dev/null
    if [ $? == 0 ]; then
        RECHECK=false
        continue
    fi
    echo "Elasticsearch not up yet, sleeping another few seconds."
    sleep 3
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -eq "20" ]; then
        echoerror "Elasticsearch still not up, waited for way too long. Continuing and hoping for the best."
        RECHECK=false
    fi
done
rm /tmp/esupcheck.txt
#echo "Waiting 10s for Elasticsearch to be fully operational"
#sleep 10 # just to give Elasticsearch some extra time.

echo "Installing Elasticsearch index templates"
curl -X POST "http://localhost:9200/_template/rtops" -H "Content-Type: application/json" -u $AUTH -d @./redelk_elasticsearch_template_rtops.json

echo "Installing Kibana index pattern"
curl -X POST "http://localhost:5601/api/saved_objects/_import?overwrite=true" -H 'kbn-xsrf: true' -u $AUTH -F file=@./redelk_kibana_index-pattern_rtops.ndjson

echo "Importing test data"
elasticdump --input=rtops-2020.03.29.json --output=http://elastic:changeme@localhost:9200/rtops-2020.03.29
elasticdump --input=rtops-2020.03.30.json --output=http://elastic:changeme@localhost:9200/rtops-2020.03.30
elasticdump --input=rtops-2020.10.03.json --output=http://elastic:changeme@localhost:9200/rtops-2020.10.03
