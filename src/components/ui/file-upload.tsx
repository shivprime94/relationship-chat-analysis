'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
      setError('Only ZIP files are supported');
      return;
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      setError('File size should be less than 500MB');
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    },
    maxFiles: 1
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700'
        } ${error ? 'border-red-500 dark:border-red-700' : ''} 
        dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-gray-600 dark:text-gray-400">
            {isDragActive ? (
              <p>Drop the ZIP file here</p>
            ) : (
              <>
                <p>Drag and drop your WhatsApp chat ZIP file here</p>
                <p className="text-sm">or</p>
              </>
            )}
          </div>
          <button className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
            Choose ZIP File
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Only ZIP files exported from WhatsApp are supported
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
} 