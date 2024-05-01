import "!prismjs/themes/prism.css";

import {
  Button,
  Container,
  Dropdown,
  DropdownOption,
  render,
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
      parent.postMessage({ pluginMessage: { type: "load" } }, "*");
    },
    [code]
  );
  const [value, setValue] = useState<null | string>(null);
  const options: Array<DropdownOption> = [
    {
      value: "English",
    },
    {
      value: "Japanese",
    },
    {
      value: "Spanish",
    },
    {
      value: "French",
    },
    {
      value: "German",
    },
    {
      value: "Italian",
    },
    {
      value: "Dutch",
    },
    {
      value: "Polish",
    },
    "-",
    {
      header: "Header",
    },
    {
      value: "qux",
    },
  ];
  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    console.log(newValue);
    setValue(newValue);
  }

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Dropdown onChange={handleChange} options={options} value={value} />
      <VerticalSpace space="small" />
      <Button fullWidth onClick={handleInsertCodeButtonClick}>
        Translate
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
