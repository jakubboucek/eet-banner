rm -r ./build/*
grunt
aws s3 sync ./build/ s3://eet-banner/ --exclude '*' --include "*.js" --content-type="application/javascript;charset=utf-8" --delete --cache-control "public, max-age=86400"
aws s3 sync ./build/ s3://eet-banner/ --exclude ".gitignore" --exclude "*.js" --cache-control "public, max-age=86400" --delete