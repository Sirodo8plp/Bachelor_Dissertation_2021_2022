import React,{useEffect} from 'react';


export const useCameraPermissions = () => {
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        }).catch()
      }, []);
}