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
import { emit } from "@create-figma-plugin/utilities";
import { h, JSX, RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";

import styles from "./styles.css";
import { InsertCodeHandler } from "./types";

function Plugin() {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);
  const containerElementRef: RefObject<HTMLDivElement> = useRef(null);
  const handleInsertCodeButtonClick = useCallback(
    function () {
      console.log("Hello");
      // emit<InsertCodeHandler>('INSERT_CODE', code)
    },
    [code]
  );
  useEffect(
    function () {
      async function fetchData() {
        const response = await fetch(
          "https://deepl-translation-proxy-git-feat-f136b4-ishida-daikis-projects.vercel.app"
        );
        const data = await response.json();
        console.log(data);
      }
      fetchData();
    },
    [code]
  );

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
    fontSize: '0.75rem',
    display: 'flex',
    alignPtems: 'center',
  }

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text style={title}>翻訳する言語を選択してください</Text>
      <VerticalSpace space="medium" />
      <Dropdown onChange={handleChange} options={options} value={value} />
      <VerticalSpace space="small" />
      <Button disabled={value === null} fullWidth onClick={handleInsertCodeButtonClick}>
        Translate
      </Button>
      <VerticalSpace space="large" />
    </Container>
  );
}

export default render(Plugin);
