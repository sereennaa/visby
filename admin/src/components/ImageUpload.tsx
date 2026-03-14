import React, { useRef, useState } from 'react';
import { uploadImage } from '../lib/supabase';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = 'Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    const url = await uploadImage(file, 'content-images');
    setUploading(false);

    if (url) {
      onChange(url);
      setPreview(url);
    }
  };

  return (
    <div className="image-upload">
      <label>{label}</label>
      <div className="image-upload-area" onClick={() => fileRef.current?.click()}>
        {preview ? (
          <img src={preview} alt="Preview" className="image-preview" />
        ) : (
          <div className="image-placeholder">
            <span className="image-placeholder-icon">+</span>
            <span>Click to upload</span>
          </div>
        )}
        {uploading && <div className="image-uploading">Uploading...</div>}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      {value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className="image-url-input"
        />
      )}
    </div>
  );
};
