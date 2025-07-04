# Phase 1: Vector Database Setup

## Overview
Establish the foundation for RAG by setting up a vector database, embedding pipeline, and initial essay corpus.

## Goals
- Choose and configure vector database
- Implement embedding generation pipeline  
- Design essay metadata schema
- Build initial corpus of 100+ essays

## Tasks

### 1. Vector Database Selection & Setup
**Options Analysis:**
- **pgvector** (Recommended)
  - Pros: Already using PostgreSQL, no additional infrastructure
  - Cons: Less specialized than dedicated vector DBs
  - Setup: Install extension on Neon database
  
- **Pinecone**
  - Pros: Purpose-built for vectors, great performance
  - Cons: Additional service to manage, costs
  
- **Weaviate**
  - Pros: Open source, flexible
  - Cons: More complex setup

**Implementation:**
```sql
-- If using pgvector
CREATE EXTENSION vector;

CREATE TABLE essay_embeddings (
  id SERIAL PRIMARY KEY,
  essay_id VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON essay_embeddings USING ivfflat (embedding vector_cosine_ops);
```

### 2. Embedding Pipeline
```typescript
// lib/embeddings/generator.ts
import { OpenAI } from 'openai';

export class EmbeddingGenerator {
  private openai: OpenAI;
  
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  }
  
  async processEssay(essay: Essay): Promise<ProcessedEssay> {
    // Break into chunks if needed
    // Generate embeddings
    // Store with metadata
  }
}
```

### 3. Essay Metadata Schema
```typescript
interface EssayMetadata {
  // Identification
  id: string;
  title: string;
  
  // Categorization
  schoolName: string;
  schoolTier: 'ivy' | 'top20' | 'top50' | 'other';
  promptType: 'personal' | 'why-us' | 'extracurricular' | 'academic';
  
  // Success Metrics
  admissionResult: 'accepted' | 'waitlisted' | 'rejected' | 'unknown';
  essayRating?: number; // 1-10 if available
  
  // Content Analysis
  wordCount: number;
  themes: string[];
  writingStyle: 'narrative' | 'analytical' | 'creative' | 'mixed';
  
  // Technical
  yearSubmitted: number;
  source: 'public' | 'licensed' | 'synthetic';
  language: string;
}
```

### 4. Initial Corpus Collection

**Sources:**
- Public essay databases (with proper licensing)
- Published successful essay books
- Partner with college counselors
- Synthetic examples for edge cases

**Quality Criteria:**
- Verified admission results
- Diverse schools and backgrounds
- Various prompt types
- Recent (within 5 years)

### 5. Data Processing Pipeline
```typescript
// lib/embeddings/pipeline.ts
export class EssayPipeline {
  async ingestEssay(essayData: RawEssayData) {
    // 1. Clean and normalize text
    const cleaned = this.cleanText(essayData.content);
    
    // 2. Extract metadata
    const metadata = this.extractMetadata(essayData);
    
    // 3. Chunk if necessary (for long essays)
    const chunks = this.chunkText(cleaned);
    
    // 4. Generate embeddings
    const embeddings = await this.generateEmbeddings(chunks);
    
    // 5. Store in vector DB
    await this.storeEmbeddings(embeddings, metadata);
  }
}
```

### 6. API Endpoints
```typescript
// app/api/essays/embed/route.ts
export async function POST(req: Request) {
  const { essayContent, metadata } = await req.json();
  
  // Process and store essay
  const result = await essayPipeline.ingestEssay({
    content: essayContent,
    ...metadata
  });
  
  return Response.json({ success: true, id: result.id });
}

// app/api/essays/search/route.ts  
export async function POST(req: Request) {
  const { query, filters } = await req.json();
  
  // Generate query embedding
  const queryEmbedding = await embedder.generateEmbedding(query);
  
  // Search vector DB
  const results = await vectorDB.search(queryEmbedding, filters);
  
  return Response.json({ results });
}
```

## Success Criteria
- [ ] Vector database configured and accessible
- [ ] Embedding generation working with <200ms latency
- [ ] 100+ high-quality essays indexed
- [ ] Basic search functionality operational
- [ ] Metadata schema validated with test queries

## Timeline: 1 Week
- Day 1-2: Database setup and configuration
- Day 3-4: Embedding pipeline implementation
- Day 5-6: Essay collection and processing
- Day 7: Testing and optimization

## Dependencies
- OpenAI API key for embeddings
- Vector database credentials
- Essay content sources
- Additional storage for essay texts