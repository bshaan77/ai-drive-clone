# Project Rules: Google Drive Clone

This document defines the project structure, file naming conventions, and development rules for building an AI-first codebase that is modular, scalable, and easy to understand.

## AI-First Development Principles

### **Core Philosophy**

- **Modularity**: Each file has a single, clear responsibility
- **Scalability**: Structure supports growth without refactoring
- **Readability**: Code is self-documenting and easy to understand
- **AI Compatibility**: Optimized for AI tool comprehension and assistance

### **Key Requirements**

- **File Size Limit**: No file exceeds 500 lines
- **Descriptive Names**: All files, functions, and variables have clear, descriptive names
- **Documentation**: Every file has a header comment explaining its purpose
- **JSDoc/TSDoc**: All functions have proper documentation with parameters and return types
- **Consistent Structure**: Predictable file organization and naming patterns

## Directory Structure

```
drive-tutorial-ishaan/
├── _docs/                          # Project documentation
│   ├── project-overview.md
│   ├── user-flow.md
│   ├── tech-stack.md
│   ├── ui-rules.md
│   ├── theme-rules.md
│   └── project-rules.md
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── (auth)/                 # Authentication routes
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx
│   │   │   └── sign-up/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/            # Protected dashboard routes
│   │   │   ├── files/
│   │   │   │   ├── [fileId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── shared/
│   │   │   │   └── page.tsx
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── api/                    # API routes
│   │   │   ├── auth/
│   │   │   │   └── route.ts
│   │   │   ├── files/
│   │   │   │   ├── [fileId]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── upload/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── search/
│   │   │   │   └── route.ts
│   │   │   └── sse/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/                 # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── breadcrumbs.tsx
│   │   ├── files/                  # File-related components
│   │   │   ├── file-card.tsx
│   │   │   ├── folder-card.tsx
│   │   │   ├── file-grid.tsx
│   │   │   ├── file-list.tsx
│   │   │   ├── upload-zone.tsx
│   │   │   ├── file-preview.tsx
│   │   │   └── context-menu.tsx
│   │   ├── forms/                  # Form components
│   │   │   ├── file-upload-form.tsx
│   │   │   ├── share-dialog.tsx
│   │   │   └── search-form.tsx
│   │   ├── feedback/               # User feedback components
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   ├── notification.tsx
│   │   │   └── error-boundary.tsx
│   │   └── icons/                  # Custom icons
│   │       ├── file-type-icons.tsx
│   │       ├── action-icons.tsx
│   │       └── index.ts
│   ├── lib/                        # Utility libraries and configurations
│   │   ├── auth.ts                 # Authentication utilities
│   │   ├── database.ts             # Database connection
│   │   ├── storage.ts              # File storage utilities
│   │   ├── search.ts               # Search functionality
│   │   ├── validation.ts           # Input validation schemas
│   │   ├── utils.ts                # General utilities
│   │   └── constants.ts            # Application constants
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-files.ts            # File management hooks
│   │   ├── use-upload.ts           # Upload functionality hooks
│   │   ├── use-search.ts           # Search functionality hooks
│   │   ├── use-share.ts            # Sharing functionality hooks
│   │   ├── use-auth.ts             # Authentication hooks
│   │   └── use-sse.ts              # Server-Sent Events hooks
│   ├── types/                      # TypeScript type definitions
│   │   ├── file.ts                 # File-related types
│   │   ├── user.ts                 # User-related types
│   │   ├── api.ts                  # API response types
│   │   ├── auth.ts                 # Authentication types
│   │   └── index.ts                # Type exports
│   ├── server/                     # Server-side code
│   │   ├── db/                     # Database schema and queries
│   │   │   ├── schema.ts           # Drizzle schema definitions
│   │   │   ├── migrations/         # Database migrations
│   │   │   └── queries/            # Database query functions
│   │   │       ├── files.ts
│   │   │       ├── users.ts
│   │   │       └── shares.ts
│   │   ├── auth/                   # Authentication logic
│   │   │   ├── clerk-config.ts
│   │   │   └── middleware.ts
│   │   └── services/               # Business logic services
│   │       ├── file-service.ts
│   │       ├── storage-service.ts
│   │       ├── search-service.ts
│   │       └── notification-service.ts
│   └── styles/                     # Global styles and themes
│       ├── globals.css
│       ├── components.css
│       └── theme.css
├── public/                         # Static assets
│   ├── icons/
│   ├── images/
│   └── favicon.ico
├── tests/                          # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/                        # Build and utility scripts
│   ├── setup-db.ts
│   └── seed-data.ts
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## File Naming Conventions

### **General Rules**

- **Descriptive Names**: Use clear, descriptive names that indicate purpose
- **Consistent Casing**: Use kebab-case for files and directories
- **No Abbreviations**: Avoid abbreviations unless universally understood
- **Group by Feature**: Organize files by feature rather than type

### **Component Files**

```
✅ Good Examples:
- file-card.tsx          # Single file component
- upload-zone.tsx        # Upload functionality
- search-results.tsx     # Search results display
- user-profile-modal.tsx # Modal for user profile

❌ Bad Examples:
- FileCard.tsx           # Pascal case for files
- upload.tsx             # Too generic
- sr.tsx                 # Abbreviation
- component.tsx          # Generic name
```

### **Utility Files**

```
✅ Good Examples:
- file-utils.ts          # File-related utilities
- auth-helpers.ts        # Authentication helpers
- validation-schemas.ts  # Input validation
- api-client.ts          # API client utilities

❌ Bad Examples:
- utils.ts               # Too generic
- helpers.ts             # Too generic
- func.ts                # Abbreviation
- helper-functions.ts    # Redundant
```

### **Type Definition Files**

```
✅ Good Examples:
- file-types.ts          # File-related types
- api-response-types.ts  # API response types
- user-permissions.ts    # User permission types

❌ Bad Examples:
- types.ts               # Too generic
- file.ts                # Could be confused with component
- api.ts                 # Too generic
```

## File Header Documentation

### **Component Files**

```typescript
/**
 * FileCard Component
 *
 * Displays a single file or folder in a card format within the file grid/list view.
 * Handles file selection, context menu, and basic file operations.
 *
 * Features:
 * - File/folder icon display
 * - File name and metadata
 * - Selection state management
 * - Context menu integration
 * - Drag and drop support
 *
 * @component
 * @example
 * <FileCard
 *   file={fileData}
 *   isSelected={false}
 *   onSelect={handleSelect}
 *   onContextMenu={handleContextMenu}
 * />
 */
```

### **Utility Files**

```typescript
/**
 * File Utilities
 *
 * Collection of utility functions for file operations, validation, and formatting.
 * Provides helper functions for file size formatting, type detection, and metadata extraction.
 *
 * Functions:
 * - formatFileSize: Converts bytes to human-readable format
 * - getFileIcon: Returns appropriate icon for file type
 * - validateFile: Validates file upload requirements
 * - extractMetadata: Extracts file metadata for search indexing
 *
 * @module file-utils
 */
```

### **Type Definition Files**

```typescript
/**
 * File Types
 *
 * TypeScript type definitions for file-related data structures.
 * Defines interfaces for file objects, upload states, and file operations.
 *
 * Types:
 * - File: Core file object structure
 * - FileUpload: Upload state and progress
 * - FilePermissions: Access control permissions
 * - FileMetadata: File metadata for search and display
 *
 * @module file-types
 */
```

## Function Documentation Standards

### **JSDoc/TSDoc Format**

```typescript
/**
 * Uploads a file to cloud storage and creates database record
 *
 * Handles the complete file upload process including:
 * - File validation and size checking
 * - Cloud storage upload with progress tracking
 * - Database record creation with metadata
 * - Search index update for file content
 *
 * @param file - The file object to upload
 * @param userId - ID of the user uploading the file
 * @param folderId - Optional folder ID for file placement
 * @param onProgress - Optional callback for upload progress updates
 *
 * @returns Promise<UploadResult> - Upload result with file ID and metadata
 *
 * @throws {ValidationError} When file validation fails
 * @throws {StorageError} When cloud storage upload fails
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await uploadFile(
 *   file,
 *   'user-123',
 *   'folder-456',
 *   (progress) => console.log(`Upload: ${progress}%`)
 * );
 */
async function uploadFile(
  file: File,
  userId: string,
  folderId?: string,
  onProgress?: (progress: number) => void,
): Promise<UploadResult> {
  // Implementation...
}
```

### **Component Props Documentation**

```typescript
interface FileCardProps {
  /** File data object containing all file information */
  file: File;

  /** Whether the file is currently selected */
  isSelected: boolean;

  /** Callback function when file is selected/deselected */
  onSelect: (fileId: string, selected: boolean) => void;

  /** Callback function for context menu events */
  onContextMenu: (event: React.MouseEvent, file: File) => void;

  /** Optional custom styling for the card */
  className?: string;

  /** Whether to show file preview on hover */
  showPreview?: boolean;
}
```

## Code Organization Rules

### **File Structure Guidelines**

1. **Imports Order**:

   ```typescript
   // 1. React and Next.js imports
   import React from "react";
   import { useRouter } from "next/navigation";

   // 2. Third-party library imports
   import { Button } from "@/components/ui/button";
   import { Card } from "@/components/ui/card";

   // 3. Internal component imports
   import { FileIcon } from "@/components/icons/file-type-icons";
   import { useFiles } from "@/hooks/use-files";

   // 4. Type imports
   import type { File, FileCardProps } from "@/types/file";

   // 5. Utility imports
   import { formatFileSize } from "@/lib/utils";
   ```

2. **Component Structure**:

   ```typescript
   // 1. Component documentation
   /**
    * Component description...
    */

   // 2. Type definitions
   interface ComponentProps {
     // Props...
   }

   // 3. Component implementation
   export function Component({ prop1, prop2 }: ComponentProps) {
     // 4. Hooks
     const [state, setState] = useState();
     const { data } = useHook();

     // 5. Event handlers
     const handleClick = () => {
       // Handler logic...
     };

     // 6. Computed values
     const computedValue = useMemo(() => {
       // Computation...
     }, [dependencies]);

     // 7. Render
     return (
       <div>
         {/* JSX */}
       </div>
     );
   }
   ```

### **Function Organization**

1. **Pure Functions First**: Place pure functions at the top
2. **Event Handlers**: Group event handlers together
3. **Effects**: Place useEffect hooks after state and handlers
4. **Render Logic**: Keep render logic simple and readable

## AI Tool Compatibility

### **Code Comments for AI**

```typescript
// Use descriptive comments that explain "why" not just "what"
// AI tools benefit from context about business logic and requirements

/**
 * Filters files based on search query and user permissions
 *
 * Business Logic:
 * - Users can only see files they own or have been shared with
 * - Search includes file name, content, and metadata
 * - Results are sorted by relevance and recency
 * - Pagination is applied for performance
 */
function filterFiles(files: File[], query: string, userId: string): File[] {
  // Implementation...
}
```

### **Variable Naming for AI**

```typescript
// Use descriptive names that AI can understand
const userFilePermissions = getUserFilePermissions(userId, fileId);
const isFileAccessible = checkFileAccessibility(file, userPermissions);
const shouldShowDeleteButton = canUserDeleteFile(userId, fileId);

// Avoid cryptic names
const perm = getPerms(uid, fid); // ❌ Bad
const flag = checkFlag(f, p); // ❌ Bad
```

### **Error Handling for AI**

```typescript
// Provide context in error messages for AI debugging
try {
  await uploadFile(file, userId);
} catch (error) {
  // Log detailed error for AI analysis
  console.error("File upload failed:", {
    fileId: file.id,
    fileName: file.name,
    fileSize: file.size,
    userId,
    error: error.message,
    stack: error.stack,
  });

  throw new Error(`Failed to upload ${file.name}: ${error.message}`);
}
```

## Testing and Quality Assurance

### **Test File Organization**

```
tests/
├── unit/
│   ├── components/
│   │   └── file-card.test.tsx
│   ├── hooks/
│   │   └── use-files.test.ts
│   └── utils/
│       └── file-utils.test.ts
├── integration/
│   ├── file-upload.test.ts
│   └── search.test.ts
└── e2e/
    ├── file-management.spec.ts
    └── user-authentication.spec.ts
```

### **Test Documentation**

```typescript
/**
 * FileCard Component Tests
 *
 * Tests the FileCard component's rendering, interactions, and state management.
 * Covers file selection, context menu, and accessibility features.
 */
describe("FileCard", () => {
  // Test descriptions should be clear and descriptive
  it("should display file name and icon correctly", () => {
    // Test implementation...
  });

  it("should handle file selection with keyboard navigation", () => {
    // Test implementation...
  });
});
```

## Performance Guidelines

### **Code Splitting**

```typescript
// Use dynamic imports for large components
const FilePreview = dynamic(() => import('@/components/files/file-preview'), {
  loading: () => <FilePreviewSkeleton />,
  ssr: false // Disable SSR for heavy components
});

// Lazy load non-critical features
const AdvancedSearch = lazy(() => import('@/components/search/advanced-search'));
```

### **Bundle Optimization**

```typescript
// Import only what you need
import { formatFileSize } from "@/lib/utils/file-utils";
// Instead of: import * as utils from '@/lib/utils';

// Use tree-shakeable imports
import { Button } from "@/components/ui/button";
// Instead of: import { Button } from '@/components/ui';
```

## Security and Best Practices

### **Input Validation**

```typescript
/**
 * Validates file upload requirements
 *
 * Security checks:
 * - File size limits
 * - Allowed file types
 * - Malware scanning (if implemented)
 * - User quota validation
 */
function validateFileUpload(file: File, userId: string): ValidationResult {
  // Implementation with security checks...
}
```

### **Error Boundaries**

```typescript
/**
 * Error Boundary for File Operations
 *
 * Catches and handles errors in file-related components
 * Provides fallback UI and error reporting
 */
class FileErrorBoundary extends React.Component {
  // Implementation...
}
```

## Documentation Maintenance

### **Keeping Documentation Updated**

1. **Code Changes**: Update documentation when code changes
2. **API Changes**: Update type definitions and examples
3. **New Features**: Document new components and utilities
4. **Breaking Changes**: Clearly mark breaking changes in documentation

### **Documentation Review**

- Review documentation during code reviews
- Ensure examples are current and working
- Verify that all public APIs are documented
- Check that file headers are accurate and complete

This project structure and these rules ensure that our codebase remains AI-friendly, maintainable, and scalable as we build the Google Drive clone.
