import { loadFontsAsync, once, showUI } from "@create-figma-plugin/utilities";
import { InsertCodeHandler } from "./types";

const API_GATEWAY_URL = 'https://398ze5m627.execute-api.ap-northeast-1.amazonaws.com/default/deepl-translater';

async function translateText(textNode: TextNode, targetLang: string) {
  // リクエストの本体を作成
  const requestBody = {
    text: textNode.characters,
    target_lang: targetLang
  };

  try {
    // API GatewayにHTTPリクエストを送信
    const response = await fetch(API_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // レスポンスがOKでなければエラーを投げる
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 翻訳されたテキストをレスポンスから取得
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    // エラーの処理
    console.error('Error:', error);
    figma.closePlugin(`Error: ${error}`);
  }
}

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
      figma.ui.postMessage({ type: "element-selected", content: textNodesContent });
    }
  });
  // プラグインUIからのメッセージを受信
  figma.ui.onmessage = async ({type, lang}) => {

    if (type === "translate") {
      const translationPromises = textNodesContent.map(async (textContent) => {
        const textNode = figma.getNodeById(textContent.id) as TextNode;
        if (textNode) {
          const translatedText = await translateText(textNode, lang);
          if (translatedText) {
            textNode.characters = translatedText;
          }
        }
      });
  
      // すべての翻訳が完了するまで待つ
      await Promise.all(translationPromises);
  
      // ここで翻訳が完了した後の処理を行う
      figma.notify('Translation complete');
      // const textNodes = figma.currentPage.selection;
      // console.log(lang)
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
