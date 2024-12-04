import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import MenuBar from "./TopVar.jsx";
import "./styles.css";

// Add Material Icons CDN
const materialIconsCDN = document.createElement("link");
materialIconsCDN.rel = "stylesheet";
materialIconsCDN.href =
  "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(materialIconsCDN);

// Add custom styles for undo/redo buttons
const customStyles = `
.ql-toolbar button.ql-undo:before {
    font-family: 'Material Icons';
    content: 'undo';
}
.ql-toolbar button.ql-redo:before {
    font-family: 'Material Icons';
    content: 'redo';
}`;

const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  ["undo", "redo"],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ["small", "normal", "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"],
];

export default function Editor() {
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";

    // Create custom toolbar HTML
    const toolbar = document.createElement("div");
    toolbar.id = "toolbar";
    toolbar.innerHTML = `
         <span class="ql-formats">
           <button class="ql-undo"></button>
           <button class="ql-redo"></button>
         </span>

         <span class="ql-formats">
           <select class="ql-header">
             <option value="1">Heading 1</option>
             <option value="2">Heading 2</option>
             <option value="3">Heading 3</option>
             <option value="4">Heading 4</option>
             <option value="5">Heading 5</option>
             <option value="6">Heading 6</option>
             <option value="false">Normal</option>
           </select>
         </span>

         <span class="ql-formats">
           <select class="ql-font"></select>
         </span>

         <span class="ql-formats">
           <select class="ql-size">
             <option value="8px">8px</option>
             <option value="10px">10px</option>
             <option value="12px">12px</option>
             <option value="14px">14px</option>
             <option value="16px">16px</option>
             <option value="18px">18px</option>
             <option value="20px">20px</option>
             <option value="24px">24px</option>
             <option value="32px">32px</option>
             <option value="48px">48px</option>
           </select>
         </span>

         <span class="ql-formats">
           <button class="ql-bold"></button>
           <button class="ql-italic"></button>
           <button class="ql-underline"></button>
           <button class="ql-strike"></button>
         </span>

         <span class="ql-formats">
           <button class="ql-blockquote"></button>
           <button class="ql-code-block"></button>
         </span>

         <span class="ql-formats">
           <button class="ql-script" value="sub"></button>
           <button class="ql-script" value="super"></button>
         </span>

         <span class="ql-formats">
           <select class="ql-color"></select>
           <select class="ql-background"></select>
         </span>

         <span class="ql-formats">
           <button class="ql-list" value="ordered"></button>
           <button class="ql-list" value="bullet"></button>
         </span>

         <span class="ql-formats">
           <button class="ql-indent" value="-1"></button>
           <button class="ql-indent" value="+1"></button>
         </span>

         <span class="ql-formats">
           <select class="ql-align"></select>
         </span>

         <span class="ql-formats">
           <button class="ql-link"></button>
           <button class="ql-image"></button>
           <button class="ql-video"></button>
         </span>

         <span class="ql-formats">
           <button class="ql-clean"></button>
         </span>
       `;

    // Add the styles for the toolbar
    const style = document.createElement("style");
    style.textContent = `
        .toolbar-divider {
          height: 24px;
          width: 1px;
          background-color: #D1D5DB;
          margin: 0 8px;
          display: inline-block;
          vertical-align: middle;
        }

        #toolbar {
          display: flex;
          align-items: center;
          padding: 8px;
          gap: 8px;
          border-bottom: 1px solid #ccc;
        }
      `;
    document.head.appendChild(style);

    // Create editor div
    const editor = document.createElement("div");

    // Important: Add toolbar before editor
    wrapper.appendChild(toolbar);
    wrapper.appendChild(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: {
          container: "#toolbar",
          handlers: {
            undo: function () {
              this.quill.history.undo();
            },
            redo: function () {
              this.quill.history.redo();
            },
          },
        },
        history: {
          delay: 50,
          maxStack: 1000,
          userOnly: true,
          stackType: "user",
        },
        table: true,
        "emoji-toolbar": true,
        "emoji-textarea": true,
        "emoji-shortname": true,
      },
      debug: "info",
      bounds: editor,
    });

    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return (
    <>
      <MenuBar />
      <div className="container" ref={wrapperRef}></div>
    </>
  );
}
