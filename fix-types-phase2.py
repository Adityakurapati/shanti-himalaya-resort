#!/usr/bin/env python3
"""
Enhanced TypeScript Type Fixer Script - Phase 2
Fixes remaining useState<any> and adds proper type imports
"""

import os
import re
from pathlib import Path
from typing import List, Tuple

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    END = '\033[0m'

def log(message: str, color: str = Colors.BLUE):
    print(f"{color}{message}{Colors.END}")

def fix_useState_any(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix useState<any> with proper types"""
    modified = False
    
    # Check if Tables import exists
    has_types_import = 'from "@/integrations/supabase/types"' in content
    
    # Pattern: useState<any>(null) or useState<any | null>(null)
    patterns = [
        (r'useState<any>\(null\)', 'useState<any>(null)'),
        (r'useState<any \| null>\(null\)', 'useState<any | null>(null)'),
        (r'useState<any>\(\[\]\)', 'useState<any>([])'),
        (r'useState<any\[\]>\(\[\]\)', 'useState<any[]>([])'),
    ]
    
    # Determine the appropriate type based on the file and variable name
    if 'blog' in file_path.lower() or 'packages' in file_path.lower():
        table_type = 'Tables<"packages">'
    elif 'destination' in file_path.lower():
        table_type = 'Tables<"destinations">'
    elif 'experience' in file_path.lower():
        table_type = 'Tables<"experiences">'
    elif 'journey' in file_path.lower():
        table_type = 'Tables<"journeys">'
    elif 'enquir' in file_path.lower():
        table_type = 'Tables<"enquiries">'
    else:
        table_type = 'any'  # Fallback
    
    for pattern, _ in patterns:
        if re.search(pattern, content):
            if '(null)' in pattern:
                replacement = f'useState<{table_type} | null>(null)'
            else:
                replacement = f'useState<{table_type}[]>([])'
            
            content = re.sub(pattern, replacement, content)
            modified = True
            log(f"  ✓ Fixed useState<any> -> {replacement}", Colors.GREEN)
            
            # Add import if needed
            if table_type.startswith('Tables<') and not has_types_import:
                content = add_types_import(content)
                has_types_import = True
    
    return content, modified

def add_types_import(content: str) -> str:
    """Add Tables import from Supabase types"""
    # Find the first import statement
    import_pattern = r'^(import\s+.*?;?\n)'
    match = re.search(import_pattern, content, re.MULTILINE)
    
    if match:
        first_import = match.group(0)
        new_import = 'import type { Tables } from "@/integrations/supabase/types";\n'
        
        # Check if it's already there
        if new_import.strip() not in content:
            content = content.replace(first_import, new_import + first_import, 1)
            log(f"  ✓ Added Tables type import", Colors.GREEN)
    
    return content

def fix_blog_page_types(content: str, file_path: str) -> Tuple[str, bool]:
    """Specifically fix blog page type issues"""
    modified = False
    
    if 'blog' in file_path.lower():
        # Fix blogPost state
        if 'const [blogPost, setBlogPost] = React.useState<any>(null)' in content or \
           'const [blogPost, setBlogPost] = useState<any>(null)' in content:
            content = re.sub(
                r'useState<any>\(null\)',
                'useState<Tables<"packages"> | null>(null)',
                content,
                count=1
            )
            modified = True
            log(f"  ✓ Fixed blogPost type", Colors.GREEN)
        
        # Fix relatedPosts state
        if 'const [relatedPosts, setRelatedPosts] = React.useState<any[]>([])' in content or \
           'const [relatedPosts, setRelatedPosts] = useState<any[]>([])' in content:
            content = re.sub(
                r'useState<any\[\]>\(\[\]\)',
                'useState<Tables<"packages">[]>([])',
                content
            )
            modified = True
            log(f"  ✓ Fixed relatedPosts type", Colors.GREEN)
        
        # Ensure import exists
        if modified and 'from "@/integrations/supabase/types"' not in content:
            content = add_types_import(content)
    
    return content, modified

def fix_destinations_page(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix destinations page type issues"""
    modified = False
    
    if 'destinations' in file_path.lower() and '[id]' in file_path:
        # Fix destination state
        patterns = [
            (r'const \[destination, setDestination\] = useState<any>\(null\)',
             'const [destination, setDestination] = useState<Tables<"destinations"> | null>(null)'),
        ]
        
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                modified = True
                log(f"  ✓ Fixed destination type", Colors.GREEN)
        
        # Ensure import exists
        if modified and 'from "@/integrations/supabase/types"' not in content:
            content = add_types_import(content)
    
    return content, modified

def fix_experiences_page(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix experiences page type issues"""
    modified = False
    
    if 'experiences' in file_path.lower() and '[id]' in file_path:
        patterns = [
            (r'const \[experience, setExperience\] = useState<any>\(null\)',
             'const [experience, setExperience] = useState<Tables<"experiences"> | null>(null)'),
        ]
        
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                modified = True
                log(f"  ✓ Fixed experience type", Colors.GREEN)
        
        if modified and 'from "@/integrations/supabase/types"' not in content:
            content = add_types_import(content)
    
    return content, modified

def fix_journeys_page(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix journeys page type issues"""
    modified = False
    
    if 'journeys' in file_path.lower():
        patterns = [
            (r'const \[journey, setJourney\] = useState<any>\(null\)',
             'const [journey, setJourney] = useState<Tables<"journeys"> | null>(null)'),
            (r'const \[journeys, setJourneys\] = useState<any\[\]>\(\[\]\)',
             'const [journeys, setJourneys] = useState<Tables<"journeys">[]>([])'),
            (r'const \[days, setDays\] = useState<any\[\]>\(\[\]\)',
             'const [days, setDays] = useState<Tables<"journey_days">[]>([])'),
        ]
        
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                modified = True
                log(f"  ✓ Fixed journeys page types", Colors.GREEN)
        
        if modified and 'from "@/integrations/supabase/types"' not in content:
            content = add_types_import(content)
    
    return content, modified

def process_file(file_path: Path) -> bool:
    """Process a single file and apply all fixes"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        content = original_content
        file_modified = False
        
        # Skip if no useState<any> found
        if 'useState<any' not in content:
            return False
        
        log(f"\n📝 Processing: {file_path.relative_to(Path.cwd())}", Colors.BLUE)
        
        # Apply specific fixes based on file type
        content, modified = fix_blog_page_types(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_destinations_page(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_experiences_page(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_journeys_page(content, str(file_path))
        file_modified = file_modified or modified
        
        # Generic fix for remaining cases
        content, modified = fix_useState_any(content, str(file_path))
        file_modified = file_modified or modified
        
        # Write back if modified
        if file_modified and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            log(f"✅ File updated successfully", Colors.GREEN)
            return True
        else:
            log(f"ℹ️  No changes needed", Colors.YELLOW)
            
        return file_modified
        
    except Exception as e:
        log(f"❌ Error processing {file_path}: {str(e)}", Colors.RED)
        return False

def find_files_with_any(directory: Path) -> List[Path]:
    """Find all TypeScript files with useState<any>"""
    patterns = ['**/*.ts', '**/*.tsx']
    files = []
    
    for pattern in patterns:
        for file_path in directory.glob(pattern):
            # Skip excluded directories
            excluded = {'node_modules', '.next', 'dist', 'build', '.git'}
            if any(ex in file_path.parts for ex in excluded):
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'useState<any' in content:
                        files.append(file_path)
            except:
                pass
    
    return files

def main():
    """Main execution function"""
    log("🚀 Enhanced TypeScript Type Fixer - Phase 2", Colors.BLUE)
    log("=" * 50, Colors.BLUE)
    
    project_root = Path.cwd()
    
    # Find directories to process
    directories_to_process = []
    for dir_name in ['app', 'components']:
        dir_path = project_root / dir_name
        if dir_path.exists():
            directories_to_process.append(dir_path)
    
    # Find all files with useState<any>
    all_files = []
    for directory in directories_to_process:
        log(f"\n📂 Scanning directory: {directory}", Colors.BLUE)
        files = find_files_with_any(directory)
        all_files.extend(files)
        log(f"   Found {len(files)} files with useState<any>", Colors.BLUE)
    
    if not all_files:
        log("\n✅ No files with useState<any> found! All types are properly defined.", Colors.GREEN)
        return
    
    log(f"\n📊 Total files to fix: {len(all_files)}", Colors.BLUE)
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