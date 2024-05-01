import { loadFontsAsync, once, showUI } from '@create-figma-plugin/utilities'

import { InsertCodeHandler } from './types'

export default function () {
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "load") {
      console.log("cool");
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
