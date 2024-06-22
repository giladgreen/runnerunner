'use client';

import React from "react";

export default function SetupStyle() {

    const [currentStyle, setCurrentStyle] = React.useState('blue');
    function loadStyle(color: string){
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `https://runnerunner-gilad-greens-projects.vercel.app/${color}.css`);
        document.head.appendChild(link);
    }
    setInterval(() => {
        const styleName = localStorage.getItem('style');
        console.log('## currentStyle', currentStyle)
        console.log('## styleName', styleName)
        if (styleName && styleName !== currentStyle) {
            loadStyle(styleName);
            setCurrentStyle(styleName)
            localStorage.setItem('style', styleName);
        } else if (!styleName) {
            localStorage.setItem('style', currentStyle);
        }

    }, 3000);


    return (
      <div>

      </div>
  );
}

