import React, { useEffect, useRef } from "react";

const DragAndDrop: React.FC<{}> = () => {
  const dropArea = useRef<HTMLBodyElement>(null);

  const preventDefaults = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const highlight = (e: Event) => {
    dropArea.current!.classList.add("DaD--highlight");
  };

  const unhighlight = (e: Event) => {
    dropArea.current!.classList.remove("DaD--highlight");
  };

  const handleDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files) {
      console.log(event.dataTransfer.files);
    }
  };

  const onChangeHandler = () => {};

  useEffect(() => {
    if (dropArea && dropArea.current) {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.current!.addEventListener(eventName, preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.current!.addEventListener(eventName, highlight, false);
      });
      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.current!.addEventListener(eventName, unhighlight, false);
      });

      dropArea.current!.addEventListener("drop", handleDrop, false);
    }
  }, [dropArea]);

  return (
    <section id="drop-area" className="DaD" ref={dropArea}>
      <form className="DaD__form">
        <p className="DaD__paragraph">
          Upload multiple files with the file dialog or by dragging and dropping
          images onto the dashed region!
        </p>
        <input
          type="file"
          id="fileElem"
          multiple
          accept="image/*"
          onChange={onChangeHandler}
          className="DaD__input"
        />
        <label className="DaD__label" htmlFor="fileElem">
          Select some files
        </label>
      </form>
    </section>
  );
};

export default DragAndDrop;
