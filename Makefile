install-deps:
	npm ci

publish:
	npm publish --dry-run
	
lint:
	npx eslint .

test:
	npx jest

ps: 
	node bin/page-loader.js
page-loader:
	node bin/page-loader.js
	