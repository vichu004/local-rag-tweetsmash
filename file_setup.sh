#!/bin/bash

echo "📦 Creating Tweetsmash RAG dataset..."

mkdir -p tweetsmash_rag
cd tweetsmash_rag

# homepage.txt
cat << 'EOF' > homepage.txt
Tweetsmash Homepage Overview

Tweetsmash is an AI-powered platform designed to help users manage and extract value from their Twitter bookmarks. It transforms saved tweets into structured knowledge and actionable insights.

The platform improves productivity by organizing unstructured content into readable formats. Users can interact with bookmarks using AI for faster discovery and understanding.

It is widely used by creators, developers, marketers, and knowledge workers.
EOF

# api_docs.txt
cat << 'EOF' > api_docs.txt
Tweetsmash API Documentation

Authentication:
All API requests require an API key using Bearer authentication.
Authorization: Bearer YOUR_API_KEY

Usage:
Base URL: https://api.tweetsmash.com/v1/

Headers:
- Authorization: Bearer YOUR_API_KEY
- Content-Type: application/json

Example:
GET /v1/bookmarks

Response:
- status
- data
- metadata

Bookmark Data:
- Post ID
- Tweet text
- Tweet link
- Timestamp
- Author name
- Author username

Rate Limits:
- 100 requests/hour

Errors:
- 401 Unauthorized
- 402 Subscription Required
- 429 Too Many Requests
- 500 Internal Server Error

Endpoints:
- Fetch bookmarks
- Manage labels
- Assign/remove labels

Integrations:
- MCP
- n8n
- Webhooks
EOF

# resources.txt
cat << 'EOF' > resources.txt
Tweetsmash Resources

Tweetsmash transforms Twitter bookmarks into structured knowledge.

Users can analyze tweets, extract insights, and generate readable summaries or digests.

The platform allows AI-based querying of bookmarks and exporting structured data to external tools.
EOF

# features.txt
cat << 'EOF' > features.txt
Tweetsmash Features

AI Chat:
Interact with bookmarks using AI to extract insights.

Auto Organization:
Categorizes tweets by topic, author, and content.

Digest Generation:
Creates summaries and newsletters from bookmarks.

Recipe Filtering:
Filters content by themes or writing styles.

Content Structuring:
Converts unstructured tweets into readable knowledge.
EOF

# usage.txt
cat << 'EOF' > usage.txt
Tweetsmash Usage Workflow

1. Import Twitter bookmarks
2. System organizes content automatically
3. Query bookmarks using AI
4. Generate summaries or insights
5. Consume structured content

This workflow helps manage large volumes of tweets efficiently.
EOF

# integrations.txt
cat << 'EOF' > integrations.txt
Tweetsmash Integrations

- Notion: Export structured insights
- Google Sheets: Store and analyze data
- Webhooks: Trigger automations
- n8n: Build workflows
- MCP: Advanced AI integrations
EOF

# summary.txt
cat << 'EOF' > summary.txt
Tweetsmash Summary

Tweetsmash is an AI platform that transforms Twitter bookmarks into structured knowledge.

It provides:
- AI analysis
- Bookmark organization
- Digest generation
- API access

It improves productivity and enables efficient knowledge extraction.
EOF

# tweetsmash_full.txt
cat << 'EOF' > tweetsmash_full.txt
===== HOMEPAGE =====
Tweetsmash is an AI-powered platform that helps users manage Twitter bookmarks and extract insights.

===== API =====
Bearer authentication, bookmark endpoints, label management, rate limits, and integrations.

===== FEATURES =====
AI chat, auto organization, digest generation, filtering.

===== USAGE =====
Import → organize → query → generate insights.

===== INTEGRATIONS =====
Notion, Google Sheets, Webhooks, n8n, MCP.

===== SUMMARY =====
Transforms unstructured tweets into structured knowledge using AI.
EOF

echo "✅ All files created in tweetsmash_rag/"