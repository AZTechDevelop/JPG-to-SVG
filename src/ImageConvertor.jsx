import React, { useState } from 'react';
import ImageTracer from 'imagetracerjs';

const ImageConverter = () => {
  const [image, setImage] = useState('');
  const [svg, setSvg] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      ImageTracer.imageToSVG(reader.result, (svgString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const svgElement = doc.querySelector('svg');
        
        if (svgElement) {
          // Preia dimensiunile originale ale SVG-ului, dacă sunt disponibile
          const width = svgElement.getAttribute("width") || 600; // Folosește 600 ca fallback
          const height = svgElement.getAttribute("height") || 600; // Folosește 600 ca fallback
      
          // Setează width și height la 200px
          svgElement.setAttribute("width", "800");
          svgElement.setAttribute("height", "500");
      
          // Setează viewBox-ul pentru a se asigura că întreaga imagine se încadrează, păstrând proporțiile
          svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
      
          const serializer = new XMLSerializer();
          const serializedSVG = serializer.serializeToString(svgElement);
          
          setSvg(serializedSVG);
        }
      }, {ltres:1,qtres:1,pathomit:8});
      
      
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <input type="file" onChange={handleImageChange} className="input"/>
      {svg && <div className="image" dangerouslySetInnerHTML={{ __html: svg }} />}
    </div>
  );
};

export default ImageConverter;
