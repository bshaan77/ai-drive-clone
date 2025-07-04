# Phase 2: RAG Integration

## Overview
Integrate the vector database with the application to enable intelligent essay analysis and context-aware suggestions.

## Goals
- Build semantic search functionality
- Create relevance scoring system
- Implement context retrieval
- Connect RAG to existing file system

## Tasks

### 1. Semantic Search Implementation
```typescript
// lib/rag/semantic-search.ts
export class SemanticSearch {
  constructor(
    private vectorDB: VectorDatabase,
    private embedder: EmbeddingGenerator
  ) {}

  async searchSimilarEssays(
    userEssay: string,
    options: SearchOptions = {}
  ): Promise<SimilarEssay[]> {
    const {
      topK = 5,
      schoolFilter,
      promptType,
      minSimilarity = 0.7
    } = options;

    // Generate embedding for user essay
    const embedding = await this.embedder.generateEmbedding(userEssay);
    
    // Build filters
    const filters = this.buildFilters({ schoolFilter, promptType });
    
    // Search vector DB
    const results = await this.vectorDB.search({
      vector: embedding,
      topK,
      filter: filters,
      includeMetadata: true
    });
    
    // Filter by similarity threshold
    return results
      .filter(r => r.score >= minSimilarity)
      .map(r => this.formatResult(r));
  }

  async findRelevantSections(
    paragraph: string,
    targetSchool: string
  ): Promise<RelevantSection[]> {
    // Search for similar paragraphs from successful essays
    // Useful for specific improvements
  }
}
```

### 2. Relevance Scoring System
```typescript
// lib/rag/relevance-scorer.ts
export class RelevanceScorer {
  calculateRelevance(
    userEssay: Essay,
    referenceEssay: Essay,
    similarity: number
  ): RelevanceScore {
    const factors = {
      // Similarity from vector search
      vectorSimilarity: similarity,
      
      // School match bonus
      schoolMatch: userEssay.targetSchool === referenceEssay.school ? 0.2 : 0,
      
      // Prompt type match
      promptMatch: userEssay.promptType === referenceEssay.promptType ? 0.15 : 0,
      
      // Success indicator
      admissionSuccess: referenceEssay.admitted ? 0.1 : -0.05,
      
      // Recency bonus (newer essays more relevant)
      recencyBonus: this.calculateRecencyBonus(referenceEssay.year),
      
      // Length similarity
      lengthSimilarity: this.calculateLengthSimilarity(
        userEssay.wordCount,
        referenceEssay.wordCount
      )
    };
    
    return {
      totalScore: this.weightedAverage(factors),
      factors,
      explanation: this.generateExplanation(factors)
    };
  }
}
```

### 3. Context Retrieval System
```typescript
// lib/rag/context-retriever.ts
export class ContextRetriever {
  async getContextForImprovement(
    userEssay: string,
    improvementType: ImprovementType
  ): Promise<ImprovementContext> {
    const contexts = {
      opening: await this.getOpeningExamples(userEssay),
      structure: await this.getStructureExamples(userEssay),
      conclusion: await this.getConclusionExamples(userEssay),
      specificity: await this.getSpecificityExamples(userEssay),
      voice: await this.getVoiceExamples(userEssay)
    };
    
    return contexts[improvementType];
  }
  
  private async getOpeningExamples(essay: string): Promise<OpeningContext> {
    // Extract first paragraph
    const opening = this.extractOpening(essay);
    
    // Find successful openings
    const similarOpenings = await this.semanticSearch.searchSimilarEssays(
      opening,
      { 
        topK: 10,
        sectionType: 'opening' 
      }
    );
    
    // Categorize by effectiveness
    return {
      strongExamples: similarOpenings.filter(e => e.rating > 8),
      weakExamples: similarOpenings.filter(e => e.rating < 5),
      analysis: this.analyzeOpeningPatterns(similarOpenings)
    };
  }
}
```

### 4. Integration with File System
```typescript
// lib/rag/file-integration.ts
export class RAGFileIntegration {
  async processUploadedEssay(fileId: string, userId: string) {
    // 1. Retrieve file content
    const file = await db.files.findUnique({ where: { id: fileId } });
    const content = await this.downloadContent(file.url);
    
    // 2. Extract text (handle different formats)
    const text = await this.extractText(content, file.mimeType);
    
    // 3. Initial analysis
    const analysis = await this.performInitialAnalysis(text);
    
    // 4. Find similar essays
    const similar = await this.semanticSearch.searchSimilarEssays(text, {
      schoolFilter: analysis.detectedSchools,
      promptType: analysis.detectedPromptType
    });
    
    // 5. Store analysis results
    await db.essayAnalysis.create({
      data: {
        fileId,
        userId,
        analysis: analysis,
        similarEssays: similar,
        createdAt: new Date()
      }
    });
    
    return { fileId, analysisId: analysis.id };
  }
}
```

### 5. Real-time Suggestion Engine
```typescript
// lib/rag/suggestion-engine.ts
export class SuggestionEngine {
  async generateSuggestions(
    essay: string,
    context: EssayContext
  ): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = [];
    
    // 1. Overall structure suggestions
    const structure = await this.analyzeStructure(essay);
    if (structure.issues.length > 0) {
      suggestions.push(...this.generateStructureSuggestions(structure));
    }
    
    // 2. Content-specific suggestions
    const similar = await this.findSimilarSuccessful(essay, context);
    suggestions.push(...this.generateContentSuggestions(essay, similar));
    
    // 3. School-specific optimizations
    if (context.targetSchool) {
      const schoolTips = await this.getSchoolSpecificTips(
        essay,
        context.targetSchool
      );
      suggestions.push(...schoolTips);
    }
    
    // 4. Cliché detection
    const cliches = await this.detectCliches(essay);
    suggestions.push(...this.generateClicheSuggestions(cliches));
    
    // Rank by importance
    return this.rankSuggestions(suggestions);
  }
}
```

### 6. API Endpoints for RAG Features
```typescript
// app/api/essays/analyze/route.ts
export async function POST(req: Request) {
  const { fileId } = await req.json();
  const userId = await getUserId();
  
  // Trigger RAG analysis
  const result = await ragIntegration.processUploadedEssay(fileId, userId);
  
  return Response.json(result);
}

// app/api/essays/suggestions/route.ts
export async function POST(req: Request) {
  const { essay, context } = await req.json();
  
  const suggestions = await suggestionEngine.generateSuggestions(
    essay,
    context
  );
  
  return Response.json({ suggestions });
}

// app/api/essays/similar/route.ts
export async function POST(req: Request) {
  const { essay, filters } = await req.json();
  
  const similar = await semanticSearch.searchSimilarEssays(essay, filters);
  
  return Response.json({ similar });
}
```

### 7. Caching Layer
```typescript
// lib/rag/cache.ts
export class RAGCache {
  private redis: Redis;
  
  async getCachedSuggestions(essayHash: string): Promise<Suggestion[] | null> {
    const cached = await this.redis.get(`suggestions:${essayHash}`);
    return cached ? JSON.parse(cached) : null;
  }
  
  async cacheSuggestions(
    essayHash: string,
    suggestions: Suggestion[]
  ): Promise<void> {
    await this.redis.setex(
      `suggestions:${essayHash}`,
      3600, // 1 hour TTL
      JSON.stringify(suggestions)
    );
  }
}
```

## Success Criteria
- [ ] Semantic search returns relevant essays with <500ms latency
- [ ] Relevance scoring accurately ranks results
- [ ] Context retrieval provides actionable insights
- [ ] Integration with file uploads seamless
- [ ] Suggestion generation helpful and specific

## Timeline: 1.5 Weeks
- Day 1-2: Semantic search implementation
- Day 3-4: Relevance scoring system
- Day 5-6: Context retrieval development
- Day 7-8: File system integration
- Day 9-10: Testing and refinement

## Dependencies
- Phase 1 completion (vector DB setup)
- LLM API for suggestion generation
- Redis for caching (optional but recommended)
- Additional compute for real-time analysis