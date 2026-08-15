const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // CommonJS to ES Module simple replacements
            content = content.replace(/const\s+(.+?)\s*=\s*require\(['"](.+?)['"]\);/g, "import $1 from '$2';");
            content = content.replace(/module\.exports\s*=\s*(.+?);/g, "export default $1;");
            
            const newPath = fullPath.replace(/\.js$/, '.ts');
            fs.writeFileSync(newPath, content, 'utf8');
            fs.unlinkSync(fullPath);
            console.log(`Renamed and patched: ${newPath}`);
        }
    }
}

processDir(srcDir);
