import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [profileImage, setImage] = useState(null);
  const [previewImage, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/svg+xml" || file.type === "image/jpg")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file (JPEG, PNG, SVG, JPG)");
    }
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    if (!profileImage) {
      alert("Please select an image to upload");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", profileImage);
      formData.append("upload_preset", upload_preset);

      const response = await axios.post("https://api.cloudinary.com/v1_1/dv5tddhyx/image/upload", formData);
      const imageURL = response.data.secure_url;

      setPreview(null);
      setLoading(false);
      alert(`Image uploaded successfully: ${imageURL}`);
      console.log(imageURL);
    } catch (error) {
      console.log("Error uploading image:", error.message);
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center space-y-10 w-[100vw] h-screen bg-slate-300'>
      <h1 className='text-xl text-green-500 font-bold'>Image Upload with Cloudinary</h1>
      <input type="file" accept='image/png,image/svg,image/jpg,image/jpeg' onChange={handleImageChange} />
      <button type='submit' onClick={uploadImage}>Upload Image</button>
      {loading && <span className='text-red-500 animate-bounce font-normal'>Uploading ....</span>}
      <div className="profilePhoto">
        {previewImage && (
          <img className="h-40 w-32 rounded-md" src={previewImage} alt="Profile Preview" />
        )}
      </div>
    </div>
  );
};

export default App;
