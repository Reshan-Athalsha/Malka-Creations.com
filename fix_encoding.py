"""Fix Sinhala encoding issues in Malka website HTML files.
The files have UTF-8 bytes that were double-encoded (UTF-8 read as Latin-1 then re-encoded as UTF-8).
This script reads each file's bytes, detects double-encoded sequences, and fixes them.
"""
import os
import glob

BASE = r"c:\Users\athal\Desktop\Malka"

# Mapping of garbled -> proper text
REPLACEMENTS = {
    # Brand name: මල්කා මල් පාල
    "à¶¸à¶½à·\u0081à¶šà·\u008d à¶¸à¶½à·\u0081 à¶´à·\u008dà¶½": "\u0db8\u0dbd\u0dca\u0d9a\u0dcf \u0db8\u0dbd\u0dca \u0db4\u0dcf\u0dbd",
    # අපේ ජනප්‍රියම! (hero handnote alt text)
    "à¶\u0085à¶´à·\u0096 à¶¢à¶±à¶´à·\u0081â\u0080\u008dà¶»à·\u0092à¶ºà¶¸!": "\u0d85\u0db4\u0dd6 \u0da2\u0db1\u0db4\u0dca\u200d\u0dbb\u0dd2\u0dba\u0db8!",
    # em dash
    "â\u0080\u0093": "\u2014",
    # right arrow →
    "â\u0086\u0092": "\u2192",
    # down arrow ↓  
    "â\u0086\u0093": "\u2193",
    # multiplication × (close button)
    "Ã\u0097": "\u00d7",
    # copyright ©
    "Â©": "\u00a9",
    # box drawing ═
    "â\u0095\u0090": "\u2550",
    # up arrow ↑
    "â\u0086\u0091": "\u2191",
}

def fix_file(filepath):
    """Fix encoding in a single file."""
    with open(filepath, 'rb') as f:
        raw = f.read()
    
    # Try to decode as UTF-8
    try:
        content = raw.decode('utf-8')
    except UnicodeDecodeError:
        # Try as UTF-8 with BOM
        try:
            content = raw.decode('utf-8-sig')
        except UnicodeDecodeError:
            print(f"SKIP: {filepath} - cannot decode")
            return False
    
    original = content
    
    # Apply replacements
    for garbled, proper in REPLACEMENTS.items():
        content = content.replace(garbled, proper)
    
    if content != original:
        # Write back with UTF-8 BOM
        with open(filepath, 'wb') as f:
            f.write(b'\xef\xbb\xbf')  # UTF-8 BOM
            f.write(content.encode('utf-8'))
        return True
    return False

# Fix index.html
fixed = fix_file(os.path.join(BASE, "index.html"))
print(f"index.html: {'FIXED' if fixed else 'no changes'}")

# Fix 404.html
fixed = fix_file(os.path.join(BASE, "404.html"))
print(f"404.html: {'FIXED' if fixed else 'no changes'}")

# Fix all product pages
products_dir = os.path.join(BASE, "products")
count = 0
for html_file in glob.glob(os.path.join(products_dir, "*.html")):
    if fix_file(html_file):
        count += 1
        print(f"FIXED: {os.path.basename(html_file)}")

print(f"\nTotal product pages fixed: {count}")
print("Done!")
