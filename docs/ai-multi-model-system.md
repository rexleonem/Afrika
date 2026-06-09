# AFRIKA AI Multi-Model System

AFRIKA does not use multiple models interchangeably.

It uses specialized cognitive roles.

## Role Split

### Gemini

Role: structure and multimodal intelligence.

Use it for:

- card structuring
- extraction
- classification
- context building
- geo and semantic linking

### Groq

Role: real-time speed engine.

Use it for:

- live search parsing
- streaming UX responses
- quick reasoning
- feed interaction explanations

### DeepSeek

Role: deep reasoning and intelligence engine.

Use it for:

- ranking
- insight generation
- comparisons
- trend reasoning
- decision support

## Golden Rule

Never overlap roles.

- Structure data with Gemini
- Serve fast UX with Groq
- Rank and reason with DeepSeek

## System Loop

Ingestion -> Gemini -> clean schema -> DeepSeek -> ranking/insight -> Groq -> user-facing response

## Cost Control

Store DeepSeek ranking decisions in a cache and reuse them until freshness changes justify recomputation.
