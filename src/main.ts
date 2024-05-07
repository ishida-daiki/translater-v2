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

let textNodesContent: {
  id: string;
  name: string;
  characters: string;
}[]

export default function () {
  // 選択した要素のテキストノードを取得
  figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      // 何も選択されていない場合
      figma.ui.postMessage({ type: "selection-cleared" });
    } else {
      // 選択中の全てのテキストノードを取得
      const allTextNodes = findAllTextNodes(selection);
      // 取得したテキストノードの情報をUIに送信
      textNodesContent = allTextNodes.map(node => ({
        id: node.id,
        name: node.name,
        characters: node.characters
      }));
      figma.ui.postMessage({ type: "element-selected" });
    }
  });
  // プラグインUIからのメッセージを受信
  figma.ui.onmessage = async (pluginMessage) => {
    if (pluginMessage.type === "translate") {
      const textNodes = figma.currentPage.selection;
    }
  };
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
