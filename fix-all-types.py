#!/usr/bin/env python3
"""
Complete TypeScript Type Fixer Script - Production Ready
Fixes all useState, useParams, date handling, and type assignment issues
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
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    END = '\033[0m'

def log(message: str, color: str = Colors.BLUE):
    print(f"{color}{message}{Colors.END}")

def add_types_import(content: str) -> Tuple[str, bool]:
    """Add Tables import from Supabase types if not present"""
    if 'from "@/integrations/supabase/types"' in content:
        return content, False
    
    # Check if we need the import
    if 'Tables<' not in content and 'useState<any' not in content:
        return content, False
    
    # Find the first import statement
    import_pattern = r'^(import\s+.*?from\s+.*?;?\n)'
    match = re.search(import_pattern, content, re.MULTILINE)
    
    if match:
        first_import = match.group(0)
        new_import = 'import type { Tables } from "@/integrations/supabase/types";\n'
        content = content.replace(first_import, new_import + first_import, 1)
        log(f"  ✓ Added Tables type import", Colors.GREEN)
        return content, True
    
    return content, False

def fix_single_vs_array_types(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix cases where single item is assigned to array state or vice versa"""
    modified = False
    
    # Pattern 1: useState<Type[]>([]) but setting single item with .single()
    # Look for: const [var, setVar] = useState<Tables<"x">[]>([])
    # followed by: setVar(data) where data comes from .single()
    
    # First, detect if file uses .single() or .maybeSingle()
    uses_single = '.single()' in content or '.maybeSingle()' in content
    
    if uses_single:
        # Find useState declarations with array types
        pattern = r'const\s+\[(\w+),\s*set\w+\]\s*=\s*(?:React\.)?useState<Tables<"(\w+)">\[\]>\(\[\]\)'
        matches = list(re.finditer(pattern, content))
        
        for match in matches:
            var_name = match.group(1)
            table_name = match.group(2)
            
            # Check if this variable is set with a single item (not an array)
            # Look for patterns like: setVarName(data) where data is from .single()
            set_pattern = rf'set{var_name[0].upper()}{var_name[1:]}\(data\)'
            
            if re.search(set_pattern, content):
                # Change from array type to single item with null
                old_code = match.group(0)
                new_code = old_code.replace(
                    f'useState<Tables<"{table_name}">[]>([])',
                    f'useState<Tables<"{table_name}"> | null>(null)'
                )
                content = content.replace(old_code, new_code, 1)
                modified = True
                log(f"  ✓ Fixed {var_name}: array type → single item type", Colors.GREEN)
    
    # Pattern 2: Also check for direct type mismatches
    # useState<Type[]> but setting single Type
    pattern2 = r'const\s+\[(\w+),\s*set\w+\]\s*=\s*(?:React\.)?useState<Tables<"(\w+)">\[\]>\(\[\]\)'
    for match in re.finditer(pattern2, content):
        var_name = match.group(1)
        # Check if variable name is singular (destination, experience, journey, blogPost)
        if var_name.lower() in ['destination', 'experience', 'journey', 'blogpost', 'post', 'package']:
            old_code = match.group(0)
            table_name = match.group(2)
            new_code = old_code.replace(
                f'useState<Tables<"{table_name}">[]>([])',
                f'useState<Tables<"{table_name}"> | null>(null)'
            )
            content = content.replace(old_code, new_code, 1)
            modified = True
            log(f"  ✓ Fixed {var_name}: changed from array to single item type", Colors.GREEN)
    
    return content, modified

def fix_use_state_empty_array(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix useState([]) with proper types"""
    modified = False
    
    # Determine table type based on file path and variable names
    table_mappings = {
        'blog': 'packages',
        'package': 'packages',
        'destination': 'destinations',
        'experience': 'experiences',
        'journey': 'journeys',
        'enquir': 'enquiries',
        'resort_activities': 'resort_activities',
        'resort_gallery': 'resort_gallery',
        'resort_packages': 'resort_packages',
        'meal_plans': 'meal_plans',
    }
    
    # Find appropriate table type
    table_type = 'packages'  # Default fallback
    for key, value in table_mappings.items():
        if key in file_path.lower():
            table_type = value
            break
    
    # Pattern 1: const [varName, setVarName] = React.useState([]);
    pattern1 = r'const\s+\[(\w+),\s*set\w+\]\s*=\s*React\.useState\(\[\]\)'
    matches = re.finditer(pattern1, content)
    
    for match in matches:
        var_name = match.group(1).lower()
        
        # Skip if already has type
        if 'useState<' in content[max(0, match.start()-50):match.start()]:
            continue
        
        # Determine specific type based on variable name
        if 'post' in var_name or 'blog' in var_name or 'package' in var_name:
            specific_type = 'packages'
        elif 'destination' in var_name:
            specific_type = 'destinations'
        elif 'experience' in var_name:
            specific_type = 'experiences'
        elif 'journey' in var_name and 'day' not in var_name:
            specific_type = 'journeys'
        elif 'day' in var_name:
            specific_type = 'journey_days'
        elif 'enquir' in var_name:
            specific_type = 'enquiries'
        elif 'categor' in var_name:
            continue  # Skip categories as they're string[]
        else:
            specific_type = table_type
        
        old_match = match.group(0)
        new_code = old_match.replace(
            'React.useState([])',
            f'React.useState<Tables<"{specific_type}">[]>([])'
        )
        content = content.replace(old_match, new_code, 1)
        modified = True
        log(f"  ✓ Fixed {match.group(1)} type → Tables<\"{specific_type}\">[]", Colors.GREEN)
    
    # Pattern 2: const [varName, setVarName] = useState([]);
    pattern2 = r'const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\(\[\]\)'
    matches = re.finditer(pattern2, content)
    
    for match in matches:
        var_name = match.group(1).lower()
        
        # Skip if already has type annotation
        if 'useState<' in content[max(0, match.start()-50):match.start()]:
            continue
        
        if 'categor' in var_name:
            old_match = match.group(0)
            new_code = old_match.replace('useState([])', 'useState<string[]>([])')
            content = content.replace(old_match, new_code, 1)
            modified = True
            log(f"  ✓ Fixed {match.group(1)} type → string[]", Colors.GREEN)
            continue
        
        # Determine specific type
        if 'post' in var_name or 'blog' in var_name or 'package' in var_name:
            specific_type = 'packages'
        elif 'destination' in var_name:
            specific_type = 'destinations'
        elif 'experience' in var_name:
            specific_type = 'experiences'
        elif 'journey' in var_name and 'day' not in var_name:
            specific_type = 'journeys'
        elif 'day' in var_name:
            specific_type = 'journey_days'
        elif 'enquir' in var_name:
            specific_type = 'enquiries'
        else:
            specific_type = table_type
        
        old_match = match.group(0)
        new_code = old_match.replace(
            'useState([])',
            f'useState<Tables<"{specific_type}">[]>([])'
        )
        content = content.replace(old_match, new_code, 1)
        modified = True
        log(f"  ✓ Fixed {match.group(1)} type → Tables<\"{specific_type}\">[]", Colors.GREEN)
    
    return content, modified

def fix_use_state_null(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix useState(null) with proper types"""
    modified = False
    
    # Determine table type
    if 'blog' in file_path.lower() or 'package' in file_path.lower():
        table_type = 'packages'
    elif 'destination' in file_path.lower():
        table_type = 'destinations'
    elif 'experience' in file_path.lower():
        table_type = 'experiences'
    elif 'journey' in file_path.lower():
        table_type = 'journeys'
    else:
        table_type = 'packages'
    
    # Pattern: const [varName, setVarName] = React.useState(null) or useState(null)
    patterns = [
        r'const\s+\[(\w+),\s*set\w+\]\s*=\s*React\.useState\(null\)',
        r'const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\(null\)',
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, content)
        for match in matches:
            var_name = match.group(1).lower()
            
            # Skip if already has type
            if 'useState<' in content[max(0, match.start()-50):match.start()]:
                continue
            
            # Determine specific type
            if 'post' in var_name or 'blog' in var_name or 'package' in var_name:
                specific_type = 'packages'
            elif 'destination' in var_name:
                specific_type = 'destinations'
            elif 'experience' in var_name:
                specific_type = 'experiences'
            elif 'journey' in var_name:
                specific_type = 'journeys'
            else:
                specific_type = table_type
            
            old_match = match.group(0)
            if 'React.useState' in old_match:
                new_code = old_match.replace(
                    'React.useState(null)',
                    f'React.useState<Tables<"{specific_type}"> | null>(null)'
                )
            else:
                new_code = old_match.replace(
                    'useState(null)',
                    f'useState<Tables<"{specific_type}"> | null>(null)'
                )
            
            content = content.replace(old_match, new_code, 1)
            modified = True
            log(f"  ✓ Fixed {match.group(1)} type → Tables<\"{specific_type}\"> | null", Colors.GREEN)
    
    return content, modified

def fix_use_params(content: str) -> Tuple[str, bool]:
    """Fix useParams() destructuring"""
    modified = False
    
    # Pattern 1: const { id } = useParams()
    pattern1 = r'const\s+{\s*id\s*}\s*=\s*useParams\(\s*\)'
    if re.search(pattern1, content):
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

def fix_nullable_dates(content: str) -> Tuple[str, bool]:
    """Fix nullable date fields in new Date() and JSX"""
    modified = False
    
    # Pattern 1: Inside JSX - {new Date(post.published_date).toLocaleDateString()}
    pattern1 = r'\{new Date\((\w+)\.(published_date|created_at|updated_at)\)\.toLocaleDateString\(\)\}'
    if re.search(pattern1, content):
        def replace_fn(match):
            var_name = match.group(1)
            field = match.group(2)
            return f'{{{var_name}.{field} ? new Date({var_name}.{field}).toLocaleDateString() : \'N/A\'}}'
        content = re.sub(pattern1, replace_fn, content)
        modified = True
        log(f"  ✓ Fixed nullable date in JSX with .toLocaleDateString()", Colors.GREEN)
    
    # Pattern 2: Incomplete ternary - {post.published_date ? new Date(post.published_date) : ...}
    pattern2 = r'\{(\w+)\.(published_date|created_at|updated_at)\s*\?\s*new Date\(\1\.\2\)\s*:\s*new Date\(\)\.toLocaleDateString\(\)\}'
    if re.search(pattern2, content):
        def replace_fn(match):
            var_name = match.group(1)
            field = match.group(2)
            return f'{{{var_name}.{field} ? new Date({var_name}.{field}).toLocaleDateString() : \'N/A\'}}'
        content = re.sub(pattern2, replace_fn, content)
        modified = True
        log(f"  ✓ Fixed incomplete date ternary", Colors.GREEN)
    
    # Pattern 3: Plain Date object in JSX - {new Date(post.published_date)}
    pattern3 = r'\{new Date\((\w+)\.(published_date|created_at|updated_at)\)\}'
    if re.search(pattern3, content):
        def replace_fn(match):
            var_name = match.group(1)
            field = match.group(2)
            return f'{{{var_name}.{field} ? new Date({var_name}.{field}).toLocaleDateString() : \'N/A\'}}'
        content = re.sub(pattern3, replace_fn, content)
        modified = True
        log(f"  ✓ Fixed Date object in JSX - added null check and .toLocaleDateString()", Colors.GREEN)
    
    return content, modified

def process_file(file_path: Path) -> bool:
    """Process a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        content = original_content
        file_modified = False
        
        # Check if file needs processing
        needs_processing = (
            'useState(' in content or
            'useParams()' in content or
            'new Date(' in content
        )
        
        if not needs_processing:
            return False
        
        log(f"\n📝 Processing: {file_path.relative_to(Path.cwd())}", Colors.CYAN)
        
        # Apply all fixes in order
        content, modified = fix_use_params(content)
        file_modified = file_modified or modified
        
        content, modified = fix_single_vs_array_types(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_use_state_empty_array(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_use_state_null(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_nullable_dates(content)
        file_modified = file_modified or modified
        
        # Add imports if needed
        if file_modified:
            content, modified = add_types_import(content)
        
        # Write back if modified
        if file_modified and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            log(f"✅ File updated successfully", Colors.GREEN)
            return True
        elif not file_modified:
            log(f"ℹ️  No issues found", Colors.YELLOW)
        
        return file_modified
        
    except Exception as e:
        log(f"❌ Error: {str(e)}", Colors.RED)
        return False

def find_typescript_files(directory: Path) -> List[Path]:
    """Find all TypeScript/TSX files"""
    patterns = ['**/*.ts', '**/*.tsx']
    files = []
    
    for pattern in patterns:
        files.extend(directory.glob(pattern))
    
    # Filter excluded directories
    excluded = {'node_modules', '.next', 'dist', 'build', '.git'}
    files = [f for f in files if not any(ex in f.parts for ex in excluded)]
    
    return files

def main():
    """Main execution"""
    log("🚀 Production-Ready TypeScript Type Fixer", Colors.MAGENTA)
    log("=" * 70, Colors.MAGENTA)
    log("Fixes: useState types, useParams, nullable dates, array vs single items", Colors.CYAN)
    log("=" * 70, Colors.MAGENTA)
    
    project_root = Path.cwd()
    
    # Process app and components directories
    directories = []
    for dir_name in ['app', 'components']:
        dir_path = project_root / dir_name
        if dir_path.exists():
            directories.append(dir_path)
    
    if not directories:
        log("❌ No app or components directory found!", Colors.RED)
        return
    
    # Find all files
    all_files = []
    for directory in directories:
        log(f"\n📂 Scanning: {directory.name}/", Colors.BLUE)
        files = find_typescript_files(directory)
        all_files.extend(files)
        log(f"   Found {len(files)} TypeScript files", Colors.BLUE)
    
    log(f"\n📊 Total files to process: {len(all_files)}", Colors.BLUE)
    log("=" * 70, Colors.BLUE)
    
    # Process files
    modified_count = 0
    for file_path in all_files:
        if process_file(file_path):
            modified_count += 1
    
    # Summary
    log("\n" + "=" * 70, Colors.MAGENTA)
    log("📊 Summary:", Colors.MAGENTA)
    log(f"   Total files scanned: {len(all_files)}", Colors.BLUE)
    log(f"   Files modified: {modified_count}", Colors.GREEN)
    log(f"   Files unchanged: {len(all_files) - modified_count}", Colors.YELLOW)
    log("\n✨ Done! Now run: npm run build", Colors.GREEN)
    log("=" * 70, Colors.MAGENTA)

if __name__ == "__main__":
    main()