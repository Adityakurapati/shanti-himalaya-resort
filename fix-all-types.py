#!/usr/bin/env python3
"""
Complete Production-Ready TypeScript Fixer
Fixes: useState, useParams, dates, array vs single, map callbacks, image imports
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

def replace_custom_types_with_supabase(content: str, file_path: str) -> Tuple[str, bool]:
    """Replace custom type definitions with Supabase Tables types"""
    modified = False
    
    # Map of common type names to their Supabase table equivalents
    type_mappings = {
        r'type Destination = {[^}]+}': ('Destination', 'destinations'),
        r'type Experience = {[^}]+}': ('Experience', 'experiences'),
        r'type Journey = {[^}]+}': ('Journey', 'journeys'),
        r'type Enquiry = {[^}]+}': ('Enquiry', 'enquiries'),
        r'type Package = {[^}]+}': ('Package', 'packages'),
        r'interface MealPlan {[^}]+}': ('MealPlan', 'meal_plans'),
        r'interface DiningSchedule {[^}]+}': ('DiningSchedule', 'dining_schedule'),
        r'interface Activity {[^}]+}': ('Activity', 'resort_activities'),
        r'interface GalleryItem {[^}]+}': ('GalleryItem', 'resort_gallery'),
        r'interface ResortPackage {[^}]+}': ('ResortPackage', 'resort_packages'),
    }
    
    # Check if Tables import already exists
    has_tables_import = 'from "@/integrations/supabase/types"' in content
    
    for pattern, (type_name, table_name) in type_mappings.items():
        # Look for the custom type definition
        match = re.search(pattern, content, re.DOTALL)
        if match:
            # Remove the custom type definition
            content = re.sub(pattern, '', content)
            modified = True
            log(f"  ✓ Removed custom type: {type_name}", Colors.GREEN)
            
            # Add Tables import if not present
            if not has_tables_import:
                first_import = re.search(r'^(import\s+.*?;?\n)', content, re.MULTILINE)
                if first_import:
                    content = content.replace(
                        first_import.group(0),
                        'import type { Tables } from "@/integrations/supabase/types";\n' + first_import.group(0),
                        1
                    )
                    has_tables_import = True
                    log(f"  ✓ Added Tables import", Colors.GREEN)
            
            # Add type alias after imports
            imports_end = list(re.finditer(r'^import\s+.*?;?\n', content, re.MULTILINE))
            if imports_end:
                last_import = imports_end[-1]
                insert_pos = last_import.end()
                type_alias = f'\ntype {type_name} = Tables<"{table_name}">;\n'
                content = content[:insert_pos] + type_alias + content[insert_pos:]
                log(f"  ✓ Added type alias: {type_name} = Tables<\"{table_name}\">", Colors.GREEN)
    
    # Handle AdminUser and PendingUser (they come from Functions, not Tables)
    admin_patterns = [
        (r'interface AdminUser {[^}]+}', 'AdminUser'),
        (r'interface PendingUser {[^}]+}', 'PendingUser'),
    ]
    
    for pattern, type_name in admin_patterns:
        if re.search(pattern, content, re.DOTALL):
            # These are return types from functions, leave them but note them
            log(f"  ℹ️  Found {type_name} (function return type, keeping as-is)", Colors.YELLOW)
    
    return content, modified
    """Add Tables import from Supabase types if not present"""
    if 'from "@/integrations/supabase/types"' in content:
        return content, False
    
    if 'Tables<' not in content and 'useState<any' not in content:
        return content, False
    
    import_pattern = r'^(import\s+.*?from\s+.*?;?\n)'
    match = re.search(import_pattern, content, re.MULTILINE)
    
    if match:
        first_import = match.group(0)
        new_import = 'import type { Tables } from "@/integrations/supabase/types";\n'
        content = content.replace(first_import, new_import + first_import, 1)
        log(f"  ✓ Added Tables type import", Colors.GREEN)
        return content, True
    
    return content, False

def fix_map_any_types(content: str) -> Tuple[str, bool]:
    """Fix implicit 'any' in map callbacks"""
    modified = False
    
    # Pattern 1: .map((item, index) => where item has no type
    # Common patterns to look for
    patterns = [
        # Array of strings
        (r'\.map\(\((\w+),\s*(\w+)\)\s*=>', r'.map((\1: string, \2: number) =>'),
        # Features, includes, activities, highlights, etc.
        (r'(features|includes|activities|highlights|tags|travel_tips)\.map\(\((\w+),\s*(\w+)\)\s*=>', 
         r'\1.map((\2: string, \3: number) =>'),
    ]
    
    for pattern, replacement in patterns:
        if re.search(pattern, content):
            # Check if already typed
            check_pattern = pattern.replace(r'\(', r'\([^:)]+:')
            if not re.search(check_pattern, content):
                content = re.sub(pattern, replacement, content)
                modified = True
                log(f"  ✓ Fixed implicit 'any' in map callback", Colors.GREEN)
    
    # Pattern 2: Specific arrays we know the types of
    specific_maps = {
        r'breakfast\.map\(\((\w+),\s*(\w+)\)': r'breakfast.map((\1: string, \2: number)',
        r'lunch\.map\(\((\w+),\s*(\w+)\)': r'lunch.map((\1: string, \2: number)',
        r'dinner\.map\(\((\w+),\s*(\w+)\)': r'dinner.map((\1: string, \2: number)',
        r'\[1,\s*2,\s*3,\s*4,\s*5\]\.map\(\((\w+)\s*:\s*any\)': r'[1, 2, 3, 4, 5].map((\1: number)',
    }
    
    for pattern, replacement in specific_maps.items():
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            modified = True
            log(f"  ✓ Fixed specific map type", Colors.GREEN)
    
    return content, modified

def fix_image_imports(content: str) -> Tuple[str, bool]:
    """Fix static image imports and regular <img> tags to use Next.js Image component"""
    modified = False
    
    # Check if file imports images from assets
    has_image_import = re.search(r'import\s+\w+\s+from\s+["\']@/assets/.*\.(jpg|png|jpeg|webp|gif)', content)
    has_img_tag = '<img' in content
    
    if has_img_tag:
        # Add Next.js Image import if not present
        if 'import Image from "next/image"' not in content:
            # Find first import
            first_import = re.search(r'^(import\s+.*?;?\n)', content, re.MULTILINE)
            if first_import:
                content = content.replace(
                    first_import.group(0),
                    'import Image from "next/image";\n' + first_import.group(0),
                    1
                )
                modified = True
                log(f"  ✓ Added Next.js Image import", Colors.GREEN)
        
        # Pattern 1: <img src={staticImport} ... /> (static imports from @/assets)
        if has_image_import:
            patterns = [
                # With className, self-closing
                (r'<img\s+src={(\w+)}\s+alt="([^"]+)"\s+className="([^"]+)"\s*/?>',
                 r'<Image src={\1} alt="\2" className="\3" width={800} height={600} />'),
                # With className, without self-closing
                (r'<img\s+src={(\w+)}\s+alt="([^"]+)"\s+className="([^"]+)">',
                 r'<Image src={\1} alt="\2" className="\3" width={800} height={600} />'),
                # Without className
                (r'<img\s+src={(\w+)}\s+alt="([^"]+)"\s*/?>',
                 r'<Image src={\1} alt="\2" width={800} height={600} />'),
            ]
            
            for pattern, replacement in patterns:
                if re.search(pattern, content):
                    content = re.sub(pattern, replacement, content)
                    modified = True
                    log(f"  ✓ Converted static <img> to <Image>", Colors.GREEN)
        
        # Pattern 2: <img src={urlString || fallback} ... /> (dynamic URLs)
        # These should stay as <img> or be handled differently
        # Only convert if it's clearly a static import
        
        # Pattern 3: <img src="string" ... /> (string URLs should stay as <img>)
        # We don't convert these as they're external URLs
    
    return content, modified

def fix_single_vs_array_types(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix cases where single item is assigned to array state"""
    modified = False
    
    uses_single = '.single()' in content or '.maybeSingle()' in content
    
    if uses_single:
        pattern = r'const\s+\[(\w+),\s*set\w+\]\s*=\s*(?:React\.)?useState<Tables<"(\w+)">\[\]>\(\[\]\)'
        matches = list(re.finditer(pattern, content))
        
        for match in matches:
            var_name = match.group(1)
            table_name = match.group(2)
            
            set_pattern = rf'set{var_name[0].upper()}{var_name[1:]}\(data\)'
            
            if re.search(set_pattern, content):
                old_code = match.group(0)
                new_code = old_code.replace(
                    f'useState<Tables<"{table_name}">[]>([])',
                    f'useState<Tables<"{table_name}"> | null>(null)'
                )
                content = content.replace(old_code, new_code, 1)
                modified = True
                log(f"  ✓ Fixed {var_name}: array → single item type", Colors.GREEN)
    
    # Check singular variable names
    pattern2 = r'const\s+\[(\w+),\s*set\w+\]\s*=\s*(?:React\.)?useState<Tables<"(\w+)">\[\]>\(\[\]\)'
    for match in re.finditer(pattern2, content):
        var_name = match.group(1)
        if var_name.lower() in ['destination', 'experience', 'journey', 'blogpost', 'post', 'package']:
            old_code = match.group(0)
            table_name = match.group(2)
            new_code = old_code.replace(
                f'useState<Tables<"{table_name}">[]>([])',
                f'useState<Tables<"{table_name}"> | null>(null)'
            )
            content = content.replace(old_code, new_code, 1)
            modified = True
            log(f"  ✓ Fixed {var_name}: changed to single item type", Colors.GREEN)
    
    return content, modified

def fix_use_state_empty_array(content: str, file_path: str) -> Tuple[str, bool]:
    """Fix useState([]) with proper types"""
    modified = False
    
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
    
    table_type = 'packages'
    for key, value in table_mappings.items():
        if key in file_path.lower():
            table_type = value
            break
    
    pattern1 = r'const\s+\[(\w+),\s*set\w+\]\s*=\s*React\.useState\(\[\]\)'
    matches = re.finditer(pattern1, content)
    
    for match in matches:
        var_name = match.group(1).lower()
        
        if 'useState<' in content[max(0, match.start()-50):match.start()]:
            continue
        
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
            continue
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
    
    pattern2 = r'const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\(\[\]\)'
    matches = re.finditer(pattern2, content)
    
    for match in matches:
        var_name = match.group(1).lower()
        
        if 'useState<' in content[max(0, match.start()-50):match.start()]:
            continue
        
        if 'categor' in var_name:
            old_match = match.group(0)
            new_code = old_match.replace('useState([])', 'useState<string[]>([])')
            content = content.replace(old_match, new_code, 1)
            modified = True
            log(f"  ✓ Fixed {match.group(1)} type → string[]", Colors.GREEN)
            continue
        
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
    
    patterns = [
        r'const\s+\[(\w+),\s*set\w+\]\s*=\s*React\.useState\(null\)',
        r'const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\(null\)',
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, content)
        for match in matches:
            var_name = match.group(1).lower()
            
            if 'useState<' in content[max(0, match.start()-50):match.start()]:
                continue
            
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

def fix_wrong_state_types(content: str) -> Tuple[str, bool]:
    """Fix useState with wrong types (e.g., Tables<packages> when it should be number)"""
    modified = False
    
    # Pattern: expandedActivity should be number | null, not Tables<"packages"> | null
    pattern = r'const\s+\[expandedActivity,\s*setExpandedActivity\]\s*=\s*useState<Tables<"packages">\s*\|\s*null>\(null\)'
    if re.search(pattern, content):
        content = re.sub(
            pattern,
            'const [expandedActivity, setExpandedActivity] = useState<number | null>(null)',
            content
        )
        modified = True
        log(f"  ✓ Fixed expandedActivity type: Tables → number", Colors.GREEN)
    
    return content, modified

def fix_use_params(content: str) -> Tuple[str, bool]:
    """Fix useParams() destructuring"""
    modified = False
    
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
    
    pattern1 = r'\{new Date\((\w+)\.(published_date|created_at|updated_at)\)\.toLocaleDateString\(\)\}'
    if re.search(pattern1, content):
        def replace_fn(match):
            var_name = match.group(1)
            field = match.group(2)
            return f'{{{var_name}.{field} ? new Date({var_name}.{field}).toLocaleDateString() : \'N/A\'}}'
        content = re.sub(pattern1, replace_fn, content)
        modified = True
        log(f"  ✓ Fixed nullable date in JSX with .toLocaleDateString()", Colors.GREEN)
    
    pattern2 = r'\{(\w+)\.(published_date|created_at|updated_at)\s*\?\s*new Date\(\1\.\2\)\s*:\s*new Date\(\)\.toLocaleDateString\(\)\}'
    if re.search(pattern2, content):
        def replace_fn(match):
            var_name = match.group(1)
            field = match.group(2)
            return f'{{{var_name}.{field} ? new Date({var_name}.{field}).toLocaleDateString() : \'N/A\'}}'
        content = re.sub(pattern2, replace_fn, content)
        modified = True
        log(f"  ✓ Fixed incomplete date ternary", Colors.GREEN)
    
    pattern3 = r'\{new Date\((\w+)\.(published_date|created_at|updated_at)\)\}'
    if re.search(pattern3, content):
        def replace_fn(match):
            var_name = match.group(1)
            field = match.group(2)
            return f'{{{var_name}.{field} ? new Date({var_name}.{field}).toLocaleDateString() : \'N/A\'}}'
        content = re.sub(pattern3, replace_fn, content)
        modified = True
        log(f"  ✓ Fixed Date object in JSX", Colors.GREEN)
    
    return content, modified

def process_file(file_path: Path) -> bool:
    """Process a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        content = original_content
        file_modified = False
        
        needs_processing = (
            'useState(' in content or
            'useParams()' in content or
            'new Date(' in content or
            '.map((' in content or
            'import' in content and 'from "@/assets' in content
        )
        
        if not needs_processing:
            return False
        
        log(f"\n📝 Processing: {file_path.relative_to(Path.cwd())}", Colors.CYAN)
        
        # Apply all fixes
        content, modified = fix_use_params(content)
        file_modified = file_modified or modified
        
        content, modified = fix_single_vs_array_types(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_use_state_empty_array(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_use_state_null(content, str(file_path))
        file_modified = file_modified or modified
        
        content, modified = fix_wrong_state_types(content)
        file_modified = file_modified or modified
        
        content, modified = fix_nullable_dates(content)
        file_modified = file_modified or modified
        
        content, modified = fix_map_any_types(content)
        file_modified = file_modified or modified
        
        content, modified = fix_image_imports(content)
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
    
    excluded = {'node_modules', '.next', 'dist', 'build', '.git'}
    files = [f for f in files if not any(ex in f.parts for ex in excluded)]
    
    return files

def main():
    """Main execution"""
    log("🚀 Complete Production TypeScript Fixer", Colors.MAGENTA)
    log("=" * 70, Colors.MAGENTA)
    log("Fixes: useState, useParams, dates, arrays, map callbacks, images", Colors.CYAN)
    log("=" * 70, Colors.MAGENTA)
    
    project_root = Path.cwd()
    
    directories = []
    for dir_name in ['app', 'components']:
        dir_path = project_root / dir_name
        if dir_path.exists():
            directories.append(dir_path)
    
    if not directories:
        log("❌ No app or components directory found!", Colors.RED)
        return
    
    all_files = []
    for directory in directories:
        log(f"\n📂 Scanning: {directory.name}/", Colors.BLUE)
        files = find_typescript_files(directory)
        all_files.extend(files)
        log(f"   Found {len(files)} TypeScript files", Colors.BLUE)
    
    log(f"\n📊 Total files to process: {len(all_files)}", Colors.BLUE)
    log("=" * 70, Colors.BLUE)
    
    modified_count = 0
    for file_path in all_files:
        if process_file(file_path):
            modified_count += 1
    
    log("\n" + "=" * 70, Colors.MAGENTA)
    log("📊 Summary:", Colors.MAGENTA)
    log(f"   Total files scanned: {len(all_files)}", Colors.BLUE)
    log(f"   Files modified: {modified_count}", Colors.GREEN)
    log(f"   Files unchanged: {len(all_files) - modified_count}", Colors.YELLOW)
    log("\n✨ Done! Now run: npm run build", Colors.GREEN)
    log("=" * 70, Colors.MAGENTA)

if __name__ == "__main__":
    main()