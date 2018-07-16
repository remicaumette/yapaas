curl localhost:3000/graphql \
  -F operations='{ "query": "mutation ($file: Upload!) { uploadProject(id: "28f876c1-8ca2-43e4-abb8-67d289156ff7", file: $file) { id } }", "variables": { "file": null } }' \
  -F map='{ "0": ["variables.file"] }' \
  -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiODhjYzk0OTItOGRhMC00ZTYyLTgyNGItODRiMmJjOTEzYjY0IiwiY3JlYXRlZF9hdCI6MTUzMTc0MTc4NjU0NSwiaWF0IjoxNTMxNzQxNzg2fQ.KVEyaMH0kJYVP0eq4p4NCyApjdEvg1f7SteGK6d4h3M' \
  -F 0=@./demo/php.zip
