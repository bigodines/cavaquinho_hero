.PHONY: help install run build test clean

help: 
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install:
	npm install

run: ## Run the development server
	npm run dev

build: ## Build the production application
	npm run build

start: ## Start the production server
	npm start

test:
	npm test

test-watch:
	npm test -- --watch

lint: ## Run linter
	npm run lint

clean: 
	rm -rf .next node_modules

update-deps: 
	npx npm-check-updates -u
	npm install
