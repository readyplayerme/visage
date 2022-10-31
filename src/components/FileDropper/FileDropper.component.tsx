import React, { useEffect, FC, useRef, useState, ReactNode, ReactElement, Children, cloneElement } from 'react';

interface DropContainerProps {
  children?: ReactNode | ReactNode[];
  borderColor?: string;
  activeBorderColor?: string;
  placeholder?: string;
}

export const FileDropper: FC<DropContainerProps> = ({
  children,
  borderColor = 'grey',
  activeBorderColor = 'black',
  placeholder = 'Drag and drop a .glb file.'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [modelSrc, setModelSrc] = useState('');

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.items[0].kind === 'file') {
      const file = e.dataTransfer.items[0].getAsFile();

      if (file!.name?.endsWith('.glb')) {
        setModelSrc(await getBase64(file!));
      }
      const b64 = await getBase64(file!);
      setModelSrc(b64 as string);
    }
  };

  useEffect(() => {
    const element = ref.current!;

    element.addEventListener('dragenter', handleDragIn);
    element.addEventListener('dragleave', handleDragOut);
    element.addEventListener('dragover', handleDrag);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragenter', handleDragIn);
      element.removeEventListener('dragleave', handleDragOut);
      element.removeEventListener('dragover', handleDrag);
      element.removeEventListener('drop', handleDrop);
    };
  });

  return (
    <div
      className="file-drop-container"
      style={{
        border: `3px dashed ${isDragging ? activeBorderColor : borderColor}`,
        width: '100%',
        height: '100%',
        display: 'inline-flex',
        borderRadius: '4px',
        overflow: 'hidden',
        padding: '10px;'
      }}
      ref={ref}
    >
      {modelSrc.length < 1
        ? placeholder
        : Children.map(Children.toArray(children), (child) => cloneElement(child as ReactElement, { modelSrc }))}
    </div>
  );
};
