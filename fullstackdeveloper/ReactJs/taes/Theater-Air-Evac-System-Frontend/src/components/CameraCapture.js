import React, { useState } from 'react';
   import { openDB } from 'idb';

   const CameraCapture = () => {
     const [imageSrc, setImageSrc] = useState(null);

     // Initialize IndexedDB
     const initDB = async () => {
       return openDB('cameraAppDB', 1, {
         upgrade(db) {
           db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
         },
       });
     };

     // Capture and display image
     const handleCapture = (event) => {
       const file = event.target.files[0];
       if (file) {
         const reader = new FileReader();
         reader.onload = () => setImageSrc(reader.result);
         reader.readAsDataURL(file);
       }
     };

     // Save image to IndexedDB
     const saveImage = async () => {
       if (imageSrc) {
         const db = await initDB();
         await db.put('images', { src: imageSrc });
         alert('Image saved offline!');
       }
     };

     return (
       <div>
         <input type="file" accept="image/*" capture="environment" onChange={handleCapture} />
         {imageSrc && <img src={imageSrc} alt="Captured" style={{ width: '100%' }} />}
         <button onClick={saveImage} disabled={!imageSrc}>Save Offline</button>
       </div>
     );
   };

   export default CameraCapture;