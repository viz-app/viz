import React from 'react';

const FileInfoContext = React.createContext({
	folder: '',
	currentFileIndex: 0,
	filesInFolder: []
});

export default FileInfoContext;
