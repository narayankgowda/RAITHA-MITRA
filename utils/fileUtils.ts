
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    // Check if it's an image to apply compression
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Aggressive resizing to max 600px for fastest AI inference
                const MAX_DIMENSION = 600; 

                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                
                // Compress to JPEG with 0.5 quality
                const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
                const base64 = dataUrl.split(',')[1];
                resolve({ base64, mimeType: 'image/jpeg' });
            };
            img.onerror = (e) => reject(new Error('Failed to load image for compression'));
            img.src = event.target?.result as string;
        };
        reader.onerror = (e) => reject(new Error('FileReader error'));
        reader.readAsDataURL(file);
    } else {
        // Fallback for non-image files
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve({ base64, mimeType: file.type });
        };
        reader.onerror = reject;
    }
  });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
};
