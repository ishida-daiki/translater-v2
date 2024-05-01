import { loadFontsAsync, once, showUI } from '@create-figma-plugin/utilities';
import { InsertCodeHandler } from './types';

export default function () {
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "load") {
      const authKey = 'API_KEY';
      const textToTranslate = msg.text;
      const targetLang = 'FR'; // ここで目的の言語を設定

      // fetch APIを使用してDeepL APIへとリクエストを送信
      try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${authKey}`, // セキュアな場所にキーを格納する
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `text=${encodeURIComponent(textToTranslate)}&target_lang=${targetLang}`
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.translations[0].text); // 翻訳結果を表示
      } catch (error) {
        console.error('Translation error:', error);
      }
    }
  }
  once<InsertCodeHandler>('INSERT_CODE', async function (code: string) {
    const text = figma.createText()
    await loadFontsAsync([text])
    text.characters = code
    figma.currentPage.selection = [text]
    figma.viewport.scrollAndZoomIntoView([text])
    figma.closePlugin()
  })
  showUI({ height: 240, width: 320 })
}