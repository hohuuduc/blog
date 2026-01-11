import { visit } from 'unist-util-visit';

/**
 * Remark plugin để chuyển đổi cú pháp ::iframe("URL") thành thẻ <iframe>
 * 
 * Cú pháp sử dụng:
 * ::iframe("https://example.com")
 * ::iframe("https://example.com", height=600)
 * ::iframe("https://example.com", height=600, width=100%)
 * 
 * Hoặc với dấu nháy đơn:
 * ::iframe('https://example.com')
 */
export function remarkIframe() {
    return function (tree: any) {
        visit(tree, 'paragraph', (node: any, index: number | undefined, parent: any) => {
            if (index === undefined || !parent) return;
            if (!node.children || node.children.length === 0) return;

            // Xây dựng lại text đầy đủ từ các children
            // vì URL thường bị autolink parser tách thành node riêng
            let fullText = '';
            let extractedUrl = '';

            for (const child of node.children) {
                if (child.type === 'text') {
                    fullText += child.value;
                } else if (child.type === 'link') {
                    // URL đã bị autolink, lấy URL từ đây
                    fullText += child.url;
                    extractedUrl = child.url;
                }
            }

            const text = fullText.trim();

            // Debug log
            if (text.includes('::iframe')) {
                console.log('=== FOUND IFRAME SYNTAX ===');
                console.log('fullText:', text);
            }

            // Match pattern ::iframe("URL") hoặc ::iframe("URL", attributes)
            // Hỗ trợ cả dấu nháy đơn, nháy kép và smart quotes (do remark-smartypants)
            // Smart quotes: " = \u201c, " = \u201d
            const iframeRegex = /^::iframe\(["'\u201c\u201d]([^"'\u201c\u201d]+)["'\u201c\u201d](?:,\s*(.+))?\)$/;
            const match = text.match(iframeRegex);

            if (!match) return;

            const url = match[1];
            const attributesStr = match[2] || '';

            // Parse attributes
            let height = '450';
            let width = '100%';

            if (attributesStr) {
                const heightMatch = attributesStr.match(/height=(\S+)/);
                const widthMatch = attributesStr.match(/width=(\S+)/);

                if (heightMatch) height = heightMatch[1].replace(/,/g, '');
                if (widthMatch) width = widthMatch[1].replace(/,/g, '');
            }

            // Replace node with iframe HTML
            const iframeHtml = {
                type: 'html',
                value: `<div class="iframe-container">
  <iframe 
    src="${url}" 
    width="${width}" 
    height="${height}" 
    style="border: none; border-radius: 8px;" 
    loading="lazy"
    allowfullscreen>
  </iframe>
</div>`
            };

            parent.children.splice(index, 1, iframeHtml);
        });
    };
}
