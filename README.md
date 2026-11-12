---
title: OpenClaw Cloud Gateway
emoji: 🦀
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# 24/7 OpenClaw Cloud Gateway for SHIV AI (Hugging Face Spaces)

This repository deploys a persistent OpenClaw Gateway on **Hugging Face Spaces** (with 16 GB RAM and 2 vCPUs) connected to `https://shiv-aiserver.onrender.com/v1`.

## Features
- **16 GB RAM**: Completely free, zero memory bottlenecks or OOM crashes.
- **Secure WebSockets (`wss://`)**: Native TLS encryption needed by the OpenClaw Android companion app.
- **SHIV AI Integration**: Automatically configures `shivai/shiv-ai-v2` with `x-api-key: shivai-production-key-2026`.
- **Pre-Patched**: Bypasses FastAPI JWT authorization header conflicts.

## Configuration
- Port: `7860` (Hugging Face default)
- Gateway Token: `shivai-gateway-secret-2026`
