import { useEffect } from "react";

export default function useClickOutside(boxref,handler){
    useEffect(()=>{
        function listern(e){
        if (!boxref.current||boxref.current.contains(e.target)){
            return 
        }
        handler()
    }
        document.addEventListener('mousedown',listern)
        document.addEventListener('touchstart',listern)
        return ()=>{
        document.addEventListener('mousedown',listern)
        document.addEventListener('touchstart',listern)

        }
    },[boxref,handler])
};