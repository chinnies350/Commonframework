export const handleCancelData = (setExcelFile, setExcelFileError, setExcelData, fileInputRef) => {
    setExcelFile(null);
    setExcelFileError(null);
    setExcelData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };