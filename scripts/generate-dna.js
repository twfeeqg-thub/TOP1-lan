import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const dirsToScan = ['app', 'components', 'lib', 'hooks'];

console.log("🕸️ بدء نسج الشبكة العنكبوتية للملفات (DNA Structure)...");

// دالة لاستخراج ارتباطات الملف (Imports)
function getConnections(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
        let imports = [];
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[3]);
        }
        return imports.length > 0 ? imports.join(' | ') : 'لا يوجد ارتباطات خارجية';
    } catch(e) { return 'تعذر القراءة'; }
}

function processDirectory(dirPath) {
    const fullPath = path.join(ROOT_DIR, dirPath);
    if (!fs.existsSync(fullPath)) return;

    const files = fs.readdirSync(fullPath);
    let structure = '\n### 🕸️ الهيكل الآلي والارتباطات (AUTO_STRUCTURE)\n';
    let hasFiles = false;

    files.forEach(file => {
        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processDirectory(path.join(dirPath, file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
            hasFiles = true;
            const connections = getConnections(filePath);
            structure += `- **${file}**: يرتبط بـ [ ${connections} ]\n`;
        }
    });

    if (hasFiles) {
        const readmePath = path.join(fullPath, 'README_LOGIC.md');
        let existingContent = '';
        if (fs.existsSync(readmePath)) {
            existingContent = fs.readFileSync(readmePath, 'utf8');
            // مسح الهيكل القديم إن وجد لتحديثه
            existingContent = existingContent.replace(/### 🕸️ الهيكل الآلي والارتباطات[\s\S]*/, '');
        } else {
            existingContent = `### المنطق البشري (HUMAN_LOGIC)\n(يتم توثيق هدف هذا المجلد هنا لاحقاً)\n`;
        }

        fs.writeFileSync(readmePath, existingContent.trim() + '\n' + structure);
        console.log(`✅ تم تحديث الشبكة العنكبوتية للملفات في: ${dirPath}/README_LOGIC.md`);
    }
}

dirsToScan.forEach(dir => processDirectory(dir));
console.log("✅ تم التحديث بنجاح: تم حقن وسوم الأتمتة وتوليد الشبكة العنكبوتية لكل ملف.");
