import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";

interface DaDprops {
  handleDU: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const DragAndDrop: React.FC<DaDprops> = ({ handleDU }) => {
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
      const { files } = event.dataTransfer;
      handleDU(Array.from(files));
    }
  };

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      handleDU(Array.from(event.currentTarget.files));
    }
  };

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
    <>
      <section id="drop-area" className="DaD" ref={dropArea}>
        <form className="DaD__form">
          <p className="DaD__paragraph">
            Upload multiple files with the file dialog or by dragging and
            dropping images onto the dashed region!
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
    </>
  );
};

export default DragAndDrop;
