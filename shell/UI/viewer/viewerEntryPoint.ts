import { markdown } from "@codemirror/lang-markdown";
import { EditorState, type EditorStateConfig } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import type { Extension } from "@codemirror/state";

// NOTE: Later refactor this to use design patterns.



  function createEditorState(configuration: EditorStateConfig | undefined): EditorState {
    return EditorState.create(configuration);
  }
  export function buildViewerInitState(
    doc: string,
    allowedExtensions: Array<Extension>,
    DOMElement: HTMLElement,
  ): EditorView {
    return new EditorView({
      state: createEditorState({
        doc,
        extensions: allowedExtensions
      }),
      parent: DOMElement,
    });
  }


type ViwerInitializer = {
  initEditorView(entryPoint: HTMLDivElement): EditorView
}


export const viewer: ViwerInitializer = {
  initEditorView(entryPoint: HTMLDivElement): EditorView {
    return buildViewerInitState(
      "start", 
      [
        basicSetup, 
        markdown()
      ],
      entryPoint
    )
  }
}


export const initRender = viewer.initEditorView(
  document.querySelector<HTMLDivElement>("#editor-container")!);