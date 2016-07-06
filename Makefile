.PHONY: upload
upload:
	curl -XPOST -Fconfig=@uploadConfig.txt -Fdata=@CI_Golftown_Inbound_fr.csv https://golfsmith.groupbycloud.com/data/v1/upload/stream

.PHONY: semantify
semantify:
	curl --data-binary @semantifyConfig.yaml http://ecomm.groupbycloud.com/semanticConfig 
