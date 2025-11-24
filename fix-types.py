#!/usr/bin/env python3
"""
Script to update TypeScript files to use Supabase generated types.
Adds import statement and replaces custom type definitions with Tables<"tablename">.
"""

import os
import re
from pathlib import Path

# Mapping of type/interface names to their corresponding Supabase table names
TYPE_MAPPINGS = {
    'Enquiry': 'enquiries',
    'Experience': 'experiences',
    'Journey': 'journeys',
    'MealPlan': 'meal_plans',
    'DiningSchedule': 'dining_schedule',
    'Package': 'packages',
    'Activity': 'resort_activities',
    'GalleryItem': 'resort_gallery',
    'ResortPackage': 'resort_packages',
}

# Types that should remain as custom interfaces (no direct table mapping)
SKIP_TYPES = {'AdminUser', 'PendingUser'}

IMPORT_STATEMENT = 'import type { Tables } from "@/integrations/supabase/types";'


def has_supabase_import(content: str) -> bool:
    """Check if file already has Supabase types import."""
    return 'from "@/integrations/supabase/types"' in content


def add_import_after_react(content: str) -> str:
    """Add Supabase types import after React imports."""
    if has_supabase_import(content):
        return content
    
    # Find the last import statement
    lines = content.split('\n')
    last_import_idx = -1
    
    for idx, line in enumerate(lines):
        if line.strip().startswith('import '):
            last_import_idx = idx
    
    if last_import_idx >= 0:
        lines.insert(last_import_idx + 1, IMPORT_STATEMENT)
        return '\n'.join(lines)
    
    return content


def replace_type_definitions(content: str) -> str:
    """Replace custom type/interface definitions with Supabase Tables types."""
    
    for type_name, table_name in TYPE_MAPPINGS.items():
        # Pattern for type definitions (type TypeName = {...})
        type_pattern = rf'type\s+{type_name}\s*=\s*\{{[^}}]*\}}'
        if re.search(type_pattern, content, re.DOTALL):
            replacement = f'type {type_name} = Tables<"{table_name}">'
            content = re.sub(type_pattern, replacement, content, flags=re.DOTALL)
            print(f"  ✓ Replaced type {type_name} with Tables<\"{table_name}\">")
        
        # Pattern for interface definitions (interface TypeName {...})
        interface_pattern = rf'interface\s+{type_name}\s*\{{[^}}]*\}}'
        if re.search(interface_pattern, content, re.DOTALL):
            if type_name not in SKIP_TYPES:
                replacement = f'type {type_name} = Tables<"{table_name}">'
                content = re.sub(interface_pattern, replacement, content, flags=re.DOTALL)
                print(f"  ✓ Replaced interface {type_name} with Tables<\"{table_name}\">")
    
    return content


def add_null_coalescing_for_booleans(content: str) -> str:
    """Add null coalescing operator (?? false) for boolean fields that can be null."""
    
    # Fields that are boolean | null in Supabase types
    nullable_boolean_fields = ['featured', 'approved', 'is_read']
    
    for field in nullable_boolean_fields:
        # Pattern: field: object.field
        # Replace with: field: object.field ?? false
        pattern = rf'(\s+{field}:\s+\w+\.{field})(?!\s*\?\?)'
        replacement = rf'\1 ?? false'
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            print(f"  ✓ Added null coalescing for {field}")
    
    return content


def process_file(file_path: Path) -> bool:
    """Process a single TypeScript file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Add import statement
        content = add_import_after_react(content)
        
        # Replace type definitions
        content = replace_type_definitions(content)
        
        # Add null coalescing for nullable booleans
        content = add_null_coalescing_for_booleans(content)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"  ✗ Error processing {file_path}: {e}")
        return False


def main():
    """Main function to process all TypeScript files in components folder."""
    # Get components folder path (adjust as needed)
    components_dir = Path('./components')
    
    if not components_dir.exists():
        print(f"Error: Directory '{components_dir}' not found!")
        print("Please run this script from your project root or adjust the path.")
        return
    
    # Find all .tsx and .ts files
    ts_files = list(components_dir.rglob('*.tsx')) + list(components_dir.rglob('*.ts'))
    
    if not ts_files:
        print(f"No TypeScript files found in {components_dir}")
        return
    
    print(f"Found {len(ts_files)} TypeScript files in {components_dir}")
    print("-" * 60)
    
    modified_count = 0
    
    for file_path in ts_files:
        print(f"\nProcessing: {file_path.relative_to(components_dir)}")
        
        if process_file(file_path):
            modified_count += 1
            print(f"  ✓ File updated successfully")
        else:
            print(f"  ○ No changes needed")
    
    print("\n" + "=" * 60)
    print(f"Summary: Modified {modified_count} out of {len(ts_files)} files")
    print("=" * 60)


if __name__ == '__main__':
    main()