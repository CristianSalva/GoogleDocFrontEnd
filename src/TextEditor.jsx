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
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ align: [] }],
  ["link", "image", "video", "formula"],
  [{ header: "1" }, { header: "2" }],
  ["clean"],
  ["code"],
  [{ table: [] }],
  ["emoji"],
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
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: {
          container: TOOLBAR_OPTIONS,
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
