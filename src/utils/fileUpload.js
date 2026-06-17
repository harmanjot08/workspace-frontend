export const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve({
                fileUrl: reader.result,
                fileName: file.name,
                fileType: file.type,
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const isImage = (fileType) => fileType.startsWith('image/');
export const isVideo = (fileType) => fileType.startsWith('video/');
export const isAudio = (fileType) => fileType.startsWith('audio/');
export const isPDF = (fileType) => fileType === 'application/pdf';