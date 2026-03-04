// Fix Sinhala encoding - simple direct replacement approach
const fs = require('fs');
const path = require('path');

const BASE = __dirname;

function fixFile(filePath) {
    const buf = fs.readFileSync(filePath);
    // Interpret bytes as latin1 to get the raw byte values
    const latin1 = buf.toString('latin1');

    // Re-encode: treat each char code as a byte, then decode as UTF-8
    const bytes = [];
    for (let i = 0; i < latin1.length; i++) {
        bytes.push(latin1.charCodeAt(i));
    }

    // The buffer IS already UTF-8, so just read as utf8
    let content = buf.toString('utf8');

    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);

    const original = content;

    // Fix known garbled patterns using their exact garbled form
    // These are the byte sequences as they appear in the file when read as UTF-8 text

    // The Sinhala brand name - direct approach: read the file bytes,
    // find the double-encoded sequences and fix them

    // Method: read as latin1 (raw bytes), look for the actual Sinhala UTF-8 byte patterns
    // in the double-encoded form, then replace

    // Direct string replacements for the mojibake patterns we see in view_file output:
    // We need to handle this character by character

    // Let me just do the raw buffer approach
    // Read all bytes
    const rawBytes = Array.from(buf);
    const fixedBytes = [];
    let changed = false;

    let i = 0;
    while (i < rawBytes.length) {
        // Look for double-encoded UTF-8 pattern:
        // Original UTF-8 byte 0xE0 becomes C3 A0 (UTF-8 encoding of U+00E0)
        // Original UTF-8 byte 0xB6 becomes C2 B6 (UTF-8 encoding of U+00B6)
        // etc.

        // Two-byte UTF-8 sequence encoding a byte >= 0x80:
        // C2 xx -> xx (where xx is 80-BF)
        // C3 xx -> xx+40 (where xx is 80-BF, giving C0-FF)

        if (i + 1 < rawBytes.length) {
            if (rawBytes[i] === 0xC3 && rawBytes[i + 1] >= 0x80 && rawBytes[i + 1] <= 0xBF) {
                // This is a double-encoded byte: decode to original value
                const originalByte = rawBytes[i + 1] + 0x40;
                // Check if the surrounding context suggests Sinhala or special chars
                fixedBytes.push(originalByte);
                i += 2;
                changed = true;
                continue;
            }
            if (rawBytes[i] === 0xC2 && rawBytes[i + 1] >= 0x80 && rawBytes[i + 1] <= 0xBF) {
                // This is a double-encoded byte: decode to original value
                const originalByte = rawBytes[i + 1];
                fixedBytes.push(originalByte);
                i += 2;
                changed = true;
                continue;
            }
        }

        fixedBytes.push(rawBytes[i]);
        i++;
    }

    if (changed) {
        const fixedBuf = Buffer.from(fixedBytes);
        let fixedContent = fixedBuf.toString('utf8');
        // Add BOM
        fs.writeFileSync(filePath, '\uFEFF' + fixedContent, 'utf8');
        return true;
    }
    return false;
}

// Fix index.html
console.log('index.html:', fixFile(path.join(BASE, 'index.html')) ? 'FIXED' : 'no changes');

// Fix 404.html
console.log('404.html:', fixFile(path.join(BASE, '404.html')) ? 'FIXED' : 'no changes');

// Fix all product pages
const productsDir = path.join(BASE, 'products');
let count = 0;
const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.html'));
for (const file of files) {
    if (fixFile(path.join(productsDir, file))) {
        count++;
    }
}
console.log('Product pages fixed:', count, '/', files.length);

// Cleanup
try { fs.unlinkSync(path.join(BASE, 'fix_encoding.py')); } catch (e) { }
try { fs.unlinkSync(path.join(BASE, 'fix_encoding.js')); } catch (e) { }

console.log('Done!');
