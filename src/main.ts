import { loadFontsAsync, once, showUI } from "@create-figma-plugin/utilities";
import { InsertCodeHandler } from "./types";

function findAllTextNodes(nodes: ReadonlyArray<SceneNode>): Array<TextNode> {
  let textNodes: Array<TextNode> = [];
  for (const node of nodes) {
    if (node.type === "TEXT") {
      textNodes.push(node);
    } else if ("children" in node) {
      // グループ化されたノードやフレームなど子ノードを持つ可能性があるものは再帰的に探索
      textNodes = textNodes.concat(findAllTextNodes(node.children));
    }
  }
  return textNodes;
}

export default function () {
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "load") {
    }
  };
  figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      // 何も選択されていない場合
      figma.ui.postMessage({ type: "selection-cleared" });
    } else {
      // 選択中の全てのテキストノードを取得
      const allTextNodes = findAllTextNodes(selection);
      // 取得したテキストノードの情報をUIに送信
      const textNodesContent = allTextNodes.map(node => ({
        id: node.id,
        name: node.name,
        characters: node.characters
      }));
      console.log(textNodesContent);
      figma.ui.postMessage({ type: "update-text-nodes", textNodes: textNodesContent });
    }
  });
  // once<InsertCodeHandler>('INSERT_CODE', async function (code: string) {
  //   const text = figma.createText()
  //   await loadFontsAsync([text])
  //   text.characters = code
  //   figma.currentPage.selection = [text]
  //   figma.viewport.scrollAndZoomIntoView([text])
  //   figma.closePlugin()
  // })
  showUI({ height: 240, width: 320 });
}
