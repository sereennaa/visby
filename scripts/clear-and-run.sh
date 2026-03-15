#!/usr/bin/env bash
# Force Metro/Expo to serve the latest code (4 tabs, display-only needs).
set -e
cd "$(dirname "$0")/.."

echo "Stopping any Metro/Node on 8081 and 8082..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:8082 | xargs kill -9 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
sleep 2

echo "Clearing caches..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true

echo "Starting Expo with --clear..."
npx expo start --clear
