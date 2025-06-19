import { useRef, useState } from "react"
import useClickOutside from "../hooks/useClickOutside"
import { useDispatch } from "react-redux"
import { addingPosts } from "../features/Posts/Postssclice"

export default function AddPosts(){
  const countries = [
  { code: 'GLOBAL', name: '🌍 Global' },
  { code: 'IN', name: '🇮🇳 India' },
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'UK', name: '🇬🇧 United Kingdom' },
  { code: 'CA', name: '🇨🇦 Canada' },
  { code: 'AU', name: '🇦🇺 Australia' },
]
    const [added,setadded]=useState(false)
    const boxref=useRef()
    const dispatch=useDispatch()
    useClickOutside(boxref,()=>setadded(false))
    function onSubmit(e){
        e.preventDefault()
        dispatch(addingPosts(e.target.elements.addform.value,e.target.elements.country.value))
        setadded(false)
    }
    const addformbutton=
    <div ref={boxref} className= "bg-blue-400/55 min-h-dvh w-dvw absolute flex justify-center items-center">
        <form  className="" action="" onSubmit={onSubmit}>
            <h2>add message</h2>
            <label htmlFor="addform">post message:</label>
            <input name="addform" id="addform" type="text" placeholder="enter message"/>
            <label htmlFor="country">choose country:</label>
            <select  name="country" id="country">{
            countries.map((country,idx)=>(<option  key={idx} value={country.code}>{country.name}</option>))
          }

          </select>
            
            <br />
            <button type="submit">Add</button>
        </form>
    </div>
    return (<>
        <button onClick={()=>setadded(true)} className="bg-amber-300 rounded-2xl">addposts</button>
        <div>
        {added?(addformbutton):(null)}
        </div>
        </>
    )
}