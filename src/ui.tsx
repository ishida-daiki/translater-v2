import "!prismjs/themes/prism.css";

import {
  Button,
  Container,
  Dropdown,
  DropdownOption,
  render,
  Text,
  SearchTextbox,
  SelectableItem,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { h, JSX, RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";

import styles from "./styles.css";
import { InsertCodeHandler } from "./types";

function Plugin() {
  const handleTranslate = useCallback((selectedLanguage: string) => {
    if (selectedLanguage !== null) {
      // FigmaのプラグインAPIを使用してメインスクリプトにメッセージを送信
      parent.postMessage({ pluginMessage: { type: "translate", lang: selectedLanguage } }, '*');
    }
  }, []);

  // Dropdown の選択肢を作成
  const language = [
    "アラビア語",
    "チェコ",
    "ラトビア",
    "イタリア",
    "デンマーク",
    "リトアニア",
    "インドネシア",
    "ドイツ",
    "ルーマニア",
    "ウクライナ",
    "トルコ",
    "ロシア",
    "エストニア",
    "ノルウェー",
    "英",
    "オランダ",
    "ハンガリー",
    "韓国",
    "ギリシャ",
    "フィンランド",
    "中国",
    "スウェーデン",
    "フランス",
    "日本",
    "スペイン",
    "ブルガリア",
    "スロバキア",
    "ポーランド",
    "スロベニア",
    "ポルトガル",
  ];
  const options: Array<DropdownOption> = language.map((value) => ({
    value: value,
  }));

  // 選択した言語をDropdownで表示
  const [value, setValue] = useState<null | string>(null);
  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    setValue(newValue);
  }

  // CSS in JS
  const title = {
    fontSize: "0.75rem",
    display: "flex",
    alignPtems: "center",
  };
  return (
    <Container space="medium">
      <Text style={title}>選択した要素</Text>
      <VerticalSpace space="large" />
      <Text style={title}>翻訳後の言語を選択してください</Text>
      <VerticalSpace space="medium" />
      <Dropdown onChange={handleChange} options={options} value={value} />
      <VerticalSpace space="small" />
      <Button
        disabled={value === null}
        fullWidth
        onClick={() => value && handleTranslate(value)}
      >
        Translate
      </Button>
      <VerticalSpace space="large" />
    </Container>
  );
}

export default render(Plugin);
