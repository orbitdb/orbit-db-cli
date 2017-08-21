all: test

deps:
	npm install

test: deps
	npm run test
	
clean:
	rm -rf node_modules/
	rm -rf test/test-ipfs-data/

.PHONY: test build
