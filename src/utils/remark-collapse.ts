import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin để chuyển đổi cú pháp collapse block thành thẻ <details>/<summary>
 * 
 * Cú pháp sử dụng:
 * :::collapse("Tiêu đề")
 * Nội dung markdown bên trong
 * :::
 */
export function remarkCollapse() {
    return function (tree: Root) {
        interface CollapseBlock {
            startIndex: number;
            endIndex: number;
            parent: any;
            title: string;
            isOpen: boolean;
        }

        const blocksToProcess: CollapseBlock[] = [];

        // Helper to get text content from a node
        const getNodeText = (node: any): string => {
            if (node.type === 'text') return node.value || '';
            if (node.type === 'inlineCode') return node.value || '';
            if (node.children) {
                return node.children.map((c: any) => getNodeText(c)).join('');
            }
            return '';
        };

        // Find collapse blocks
        visit(tree, (node: any, index, parent) => {
            if (index === undefined || !parent) return;

            const text = getNodeText(node).trim();

            // Check for opening tag
            const openMatch = text.match(/^:::collapse\(["'"„""](.+?)["'"„""]\s*(?:,\s*(open))?\s*\)$/);
            if (openMatch) {
                console.log('[remarkCollapse] Found opening:', text);

                // Find closing :::
                for (let i = (index as number) + 1; i < parent.children.length; i++) {
                    const siblingText = getNodeText(parent.children[i]).trim();
                    if (siblingText === ':::') {
                        console.log('[remarkCollapse] Found closing at index:', i);
                        blocksToProcess.push({
                            startIndex: index as number,
                            endIndex: i,
                            parent,
                            title: openMatch[1],
                            isOpen: openMatch[2] === 'open'
                        });
                        break;
                    }
                }
            }
        });

        // Process in reverse order
        blocksToProcess.sort((a, b) => b.startIndex - a.startIndex);

        for (const block of blocksToProcess) {
            const { startIndex, endIndex, parent, title, isOpen } = block;

            // Content nodes between open and close
            const contentNodes = parent.children.slice(startIndex + 1, endIndex);

            const openHtml = {
                type: 'html',
                value: `<details class="collapse-block"${isOpen ? ' open' : ''}>\n<summary class="collapse-title">${title}</summary>\n<div class="collapse-content">`
            };

            const closeHtml = {
                type: 'html',
                value: `</div>\n</details>`
            };

            parent.children.splice(startIndex, endIndex - startIndex + 1, openHtml, ...contentNodes, closeHtml);
            console.log('[remarkCollapse] Replaced block:', title);
        }

        console.log('[remarkCollapse] Total blocks processed:', blocksToProcess.length);
    };
}
