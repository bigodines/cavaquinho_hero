.PHONY: help install run build test clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

run: ## Run the development server
	npm run dev

build: ## Build the production application
	npm run build

start: ## Start the production server
	npm start

test: ## Run tests
	npm test

test-watch: ## Run tests in watch mode
	npm test -- --watch

lint: ## Run linter
	npm run lint

clean: ## Clean build artifacts and node_modules
	rm -rf .next node_modules

update-deps: ## Update dependencies
	npx npm-check-updates -u
	npm install
