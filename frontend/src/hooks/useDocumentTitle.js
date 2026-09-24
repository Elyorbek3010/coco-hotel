import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | Coco Hotel` : 'Coco Hotel';
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

export default useDocumentTitle;
