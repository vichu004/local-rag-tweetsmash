#!/bin/bash

# Create data directory

mkdir -p data

# CORE_FEATURES.txt

cat << 'EOF' > data/core_features.txt
TweetSmash - Core Features

TweetSmash is a tool to curate, organize, read, and export Twitter/X bookmarks.

Key Features:

1. Data Ingestion:

* Works using a Chrome Extension
* Extracts bookmarks, threads, and media
* Syncs data from Twitter to Tweetsmash database

2. AI Chat:

* Press Cmd + K to chat with bookmarks
* Supports GPT, Claude, Gemini
* Can summarize threads and extract insights

3. Smart Folders:

* Auto-organizes bookmarks using rules
* Based on authors, keywords, and trends

4. Keyboard Shortcuts:

* J / K → Navigate tweets
* Tab + R → Mark as read
* A → Archive

5. Email Digests:

* Daily or weekly curated bookmark summaries

6. Export Features:

* Export to Notion, Google Sheets, PDF, Zotero

7. Bookmark Safety:

* All bookmarks are backed up
* Safe even if Twitter deletes them
  EOF

# AI_FEATURES.txt

cat << 'EOF' > data/ai_features.txt
AI Features in TweetSmash

* Chat with bookmarks using AI
* Trigger using Cmd + K
* Supports multiple models (GPT, Claude, Gemini)

Capabilities:

* Summarize long threads
* Extract key insights
* Answer questions based on saved tweets
* Analyze writing styles

Use Case:
Users can treat bookmarks like a knowledge base and query them like ChatGPT.
EOF

# ORGANIZATION.txt

cat << 'EOF' > data/organization.txt
Bookmark Organization

TweetSmash organizes bookmarks using:

1. Smart Folders:

* Auto categorization
* Based on:

  * Authors
  * Keywords
  * Tags

2. Folder Features:

* Custom folders
* Auto-routing rules
* Tag-based grouping

3. Auto Organization:

* Viral tweets
* Recent bookmarks
* Topic-based clustering

4. Thread Handling:

* Full thread unrolling
* Replies grouped together

5. Archive System:

* Archive tweets without deleting
* Keeps UI clean
  EOF

# SEARCH_FEATURES.txt

cat << 'EOF' > data/search.txt
Search Features

TweetSmash provides advanced search capabilities:

1. Full-text search:

* Search inside tweet content

2. Author search:

* Find tweets from specific authors

3. Filters:

* Tweet type (thread, media)
* Year
* Labels
* Keywords

4. Exclusion search:

* Example: "AI !ChatGPT"

5. Multilingual support:

* Works across multiple languages

6. Sorting:

* View oldest or newest bookmarks
  EOF

# EXPORTS.txt

cat << 'EOF' > data/exports.txt
Export Features

TweetSmash supports multiple export options:

1. Notion:

* Auto-sync bookmarks
* Includes threads and media

2. Google Sheets:

* Export tweets as rows
* Auto-sync new bookmarks

3. PDF Export:

* Export tweets and threads
* Includes:

  * Images
  * Videos
  * Links

4. Zotero:

* Sync research content
* Useful for academic work

5. Newsletter:

* Convert bookmarks into newsletters
  EOF

# PRICING.txt

cat << 'EOF' > data/pricing.txt
Pricing Plans

1. Reader Pass:

* $14/month
* Includes:

  * AI chat
  * Smart folders
  * Email digests
  * Export features

2. Yearly Pass:

* $99/year

3. Exports Only:

* $49 one-time
* For backup/export only

4. Believer Pass:

* $198 lifetime
* Includes all features + priority support

Trial:

* 7-day free trial available

Refund Policy:

* Full refund within 7 days
  EOF

# TROUBLESHOOTING.txt

cat << 'EOF' > data/troubleshooting.txt
Common Issues & Solutions

1. Missing Bookmarks:
   Problem:

* Twitter removes old bookmarks

Solution:

* Use Tweetsmash extension to back them up

2. Sync Issues:
   Problem:

* Bookmarks not syncing

Solution:

* Ensure Chrome extension is active
* Manually click "Sync to Tweetsmash"

3. Notion Export Issues:
   Problem:

* Data not syncing properly

Solution:

* Select "Use template provided by developer"

4. Cannot Find Old Bookmarks:
   Solution:

* Use full-text search
* Use filters and sorting

5. Accidental Actions:

* Shift + R → Undo read
* Shift + A → Unarchive

6. Clutter:

* Use Archive instead of delete
  EOF

# INTEGRATIONS.txt

cat << 'EOF' > data/integrations.txt
Integrations

1. Chrome Extension:

* Required for syncing bookmarks

2. Notion:

* Auto-sync bookmarks into database

3. Google Sheets:

* Real-time data export

4. Zotero:

* Sync research papers

5. Email:

* Digest delivery system
  EOF

# SUPPORT.txt

cat << 'EOF' > data/support.txt
Support Information

Contact Methods:

1. Email:

* [support@tweetsmash.com](mailto:support@tweetsmash.com)
* [hello@tweetsmash.com](mailto:hello@tweetsmash.com)

2. Twitter Support:

* DM official Tweetsmash account

Response Time:

* Within 2 business days

Data Deletion:

* Request via email
* Completed within 48 hours
  EOF

# SECURITY.txt

cat << 'EOF' > data/security.txt
Security & Privacy

1. Data Protection:

* Bookmarks are backed up securely

2. Extension Privacy:

* Only reads bookmark data
* Does NOT access:

  * Passwords
  * Messages

3. Compliance:

* GDPR compliant
* CCPA compliant

4. Data Deletion:

* Full deletion available on request
  EOF
cat << 'EOF' > 
echo "✅ All files created successfully inside ./data folder"
