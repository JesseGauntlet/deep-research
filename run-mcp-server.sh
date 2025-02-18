#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting MCP server from directory: $SCRIPT_DIR"

# Source the environment variables
if [ -f "$SCRIPT_DIR/.env.local" ]; then
  echo "Loading environment from .env.local"
  set -o allexport
  source "$SCRIPT_DIR/.env.local"
  set +o allexport
else
  echo "Warning: .env.local not found. Make sure you have set up your environment variables."
  exit 1
fi

echo "Starting MCP server..."
# Run the compiled MCP server
node "$SCRIPT_DIR/dist/mcp-server.js"
echo "Server process exited with code $?" 