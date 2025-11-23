#!/usr/bin/env python3
"""
TypeScript Type Fixer Script
Automatically fixes common TypeScript type issues in Next.js projects using Supabase
"""

import os
import re
from pathlib import Path
from typing import List, Tuple

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    END = '\033[0m'

def log(message: str, color: str = Colors.BLUE):
    print(f"{color}{message}{Colors.END}")

def fix_use_params(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix useParams() to handle string | string[] type"""
    modified = False
    
    # Pattern 1: const { id } = useParams()
    pattern1 = r'const\s+{\s*id\s*}\s*=\s*useParams\(\s*\)'
    if re.search(pattern1, content):
        # Check if already fixed
        if 'Array.isArray(params.id)' not in content:
            content = re.sub(
                pattern1,
                'const params = useParams();\n  const id = Array.isArray(params.id) ? params.id[0] : params.id',
                content
            )
            modified = True
            log(f"  ✓ Fixed useParams() destructuring", Colors.GREEN)
    
    # Pattern 2: const { id } = useParams<{ id: string }>()
    pattern2 = r'const\s+{\s*id\s*}\s*=\s*useParams<{\s*id:\s*string\s*}>\(\s*\)'
    if re.search(pattern2, content):
        if 'Array.isArray(params.id)' not in content:
            content = re.sub(
                pattern2,
                'const params = useParams<{ id: string }>();\n  const id = Array.isArray(params.id) ? params.id[0] : params.id',
                content
            )
            modified = True
            log(f"  ✓ Fixed typed useParams() destructuring", Colors.GREEN)
    
    return content, modified

def fix_state_types(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix useState with proper types from Supabase"""
    modified = False
    
    # Map common state variable names to their Supabase table types
    type_mappings = {
        'blogPosts': 'Tables<"packages">[]',
        'filteredPosts': 'Tables<"packages">[]',
        'posts': 'Tables<"packages">[]',
        'destinations': 'Tables<"destinations">[]',
        'destination': 'Tables<"destinations"> | null',
        'experiences': 'Tables<"experiences">[]',
        'experience': 'Tables<"experiences"> | null',
        'journeys': 'Tables<"journeys">[]',
        'journey': 'Tables<"journeys"> | null',
        'enquiries': 'Tables<"enquiries">[]',
        'categories': 'string[]',
        'relatedPosts': 'Tables<"packages">[]',
    }
    
    # Check if Types import exists
    has_types_import = 'from "@/integrations/supabase/types"' in content
    
    for var_name, type_def in type_mappings.items():
        # Pattern: const [varName, setVarName] = useState([])
        pattern = rf'const\s+\[\s*{var_name}\s*,\s*set[A-Z]\w*\s*\]\s*=\s*useState\(\s*\[\s*\]\s*\)'
        if re.search(pattern, content):
            if f'useState<{type_def}>' not in content or f'useState<any' in content:
                content = re.sub(
                    pattern,
                    f'const [{var_name}, set{var_name[0].upper()}{var_name[1:]}] = useState<{type_def}>([])',
                    content
                )
                modified = True
                log(f"  ✓ Fixed useState type for {var_name}", Colors.GREEN)
                
                # Add Types import if needed and not present
                if 'Tables<' in type_def and not has_types_import:
                    # Find the import section
                    import_match = re.search(r'(import.*from.*;\n)+', content)
                    if import_match:
                        last_import = import_match.group(0)
                        new_import = 'import type { Tables } from "@/integrations/supabase/types";\n'
                        content = content.replace(last_import, last_import + new_import)
                        has_types_import = True
                        log(f"  ✓ Added Tables import", Colors.GREEN)
        
        # Pattern: const [varName, setVarName] = useState(null)
        if '| null' in type_def:
            pattern_null = rf'const\s+\[\s*{var_name}\s*,\s*set[A-Z]\w*\s*\]\s*=\s*useState\(\s*null\s*\)'
            if re.search(pattern_null, content):
                if f'useState<{type_def}>' not in content:
                    content = re.sub(
                        pattern_null,
                        f'const [{var_name}, set{var_name[0].upper()}{var_name[1:]}] = useState<{type_def}>(null)',
                        content
                    )
                    modified = True
                    log(f"  ✓ Fixed useState type for {var_name}", Colors.GREEN)
    
    # Fix any remaining useState<any> patterns
    if 'useState<any>' in content or 'useState<any[]>' in content:
        log(f"  ⚠ Found useState<any>, manual review recommended", Colors.YELLOW)
    
    return content, modified

def fix_supabase_queries(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix Supabase query type issues"""
    modified = False
    
    # Fix .eq() with potentially undefined id
    pattern = r'\.eq\([\'"]id[\'"]\s*,\s*id\s*\)'
    if re.search(pattern, content):
        # Check if id is already cast or handled
        if 'as string' not in content and 'Array.isArray' in content:
            content = re.sub(
                pattern,
                '.eq("id", id as string)',
                content
            )
            modified = True
            log(f"  ✓ Added type assertion for .eq() query", Colors.GREEN)
    
    return content, modified

def add_type_imports(content: str) -> Tuple[str, bool]:
    """Ensure necessary type imports are present"""
    modified = False
    
    # Check if we need Tables type
    needs_tables = 'Tables<' in content
    has_tables_import = 'from "@/integrations/supabase/types"' in content
    
    if needs_tables and not has_tables_import:
        # Find last import statement
        import_pattern = r'(import\s+.*from\s+["\'].*["\'];?\n)'
        imports = re.findall(import_pattern, content)
        
        if imports:
            last_import = imports[-1]
            new_import = 'import type { Tables } from "@/integrations/supabase/types";\n'
            content = content.replace(last_import, last_import + new_import, 1)
            modified = True
            log(f"  ✓ Added Tables type import", Colors.GREEN)
    
    return content, modified

def fix_map_callbacks(content: str) -> Tuple[str, bool]:
    """Fix type issues in map callbacks"""
    modified = False
    
    # Replace any remaining (item: any) with proper typing where possible
    if re.search(r'\.map\(\s*\(\s*\w+:\s*any\s*\)', content):
        log(f"  ⚠ Found .map with 'any' type, manual review recommended", Colors.YELLOW)
    
    return content, modified

def process_file(file_path: Path) -> bool:
    """Process a single file and apply all fixes"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        content = original_content
        file_modified = False
        
        log(f"\n📝 Processing: {file_path.relative_to(Path.cwd())}", Colors.BLUE)
        
        # Apply all fixes
        content, modified = fix_use_params(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_state_types(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_supabase_queries(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = add_type_imports(content)
        file_modified = file_modified or modified
        
        content, modified = fix_map_callbacks(content)
        file_modified = file_modified or modified
        
        # Write back if modified
        if file_modified and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            log(f"✅ File updated successfully", Colors.GREEN)
            return True
        elif file_modified:
            log(f"ℹ️  No changes needed", Colors.YELLOW)
        else:
            log(f"ℹ️  No issues found", Colors.YELLOW)
            
        return file_modified
        
    except Exception as e:
        log(f"❌ Error processing {file_path}: {str(e)}", Colors.RED)
        return False

def find_typescript_files(directory: Path) -> List[Path]:
    """Find all TypeScript/TSX files in directory"""
    patterns = ['**/*.ts', '**/*.tsx']
    files = []
    
    for pattern in patterns:
        files.extend(directory.glob(pattern))
    
    # Filter out node_modules, .next, and other build directories
    excluded = {'node_modules', '.next', 'dist', 'build', '.git'}
    files = [f for f in files if not any(ex in f.parts for ex in excluded)]
    
    return files

def main():
    """Main execution function"""
    log("🚀 TypeScript Type Fixer Script", Colors.BLUE)
    log("=" * 50, Colors.BLUE)
    
    # Get project root
    project_root = Path.cwd()
    
    # Find directories to process
    directories_to_process = []
    for dir_name in ['app', 'components']:
        dir_path = project_root / dir_name
        if dir_path.exists():
            directories_to_process.append(dir_path)
    
    if not directories_to_process:
        log("❌ No 'app' or 'components' directory found!", Colors.RED)
        return
    
    # Find all TypeScript files
    all_files = []
    for directory in directories_to_process:
        log(f"\n📂 Scanning directory: {directory}", Colors.BLUE)
        files = find_typescript_files(directory)
        all_files.extend(files)
        log(f"   Found {len(files)} files", Colors.BLUE)
    
    if not all_files:
        log("\n❌ No TypeScript files found!", Colors.RED)
        return
    
    log(f"\n📊 Total files to process: {len(all_files)}", Colors.BLUE)
    log("=" * 50, Colors.BLUE)
    
    # Process all files
    modified_count = 0
    for file_path in all_files:
        if process_file(file_path):
            modified_count += 1
    
    # Summary
    log("\n" + "=" * 50, Colors.BLUE)
    log("📊 Summary:", Colors.BLUE)
    log(f"   Total files processed: {len(all_files)}", Colors.BLUE)
    log(f"   Files modified: {modified_count}", Colors.GREEN)
    log(f"   Files unchanged: {len(all_files) - modified_count}", Colors.YELLOW)
    log("\n✨ Done! Run 'npm run build' to verify fixes.", Colors.GREEN)

if __name__ == "__main__":
    main()