import { createSlice, nanoid } from "@reduxjs/toolkit";
import {sub,formatDistanceToNow,parseISO} from 'date-fns'
function datechange(date){
      let timeAgo=''
      if (date){
        timeAgo=`${formatDistanceToNow(parseISO(date))} Ago`

      }
      return timeAgo
    }
const initialState = {
  posts: [
    {
      id: 1,
      text: "Be kind to yourself then what is this.",
      country: "US",
      createdAt: datechange(sub(new Date() ,{minutes:10}).toISOString()),
      likes: 0,
      comands: "",
      share: ""
    },
    {
      id: 2,
      text: "You are not alone.",
      country: "IN",
      createdAt:  datechange(sub(new Date() ,{minutes:5}).toISOString()),
      likes: 0,
      comands: "",
      share: ""
    },
    {
      id: 3,
      text: "Love everyone.",
      country: "GLOBAL",
      createdAt:  datechange(sub(new Date() ,{minutes:12}).toISOString()),
      likes: 0,
      comands: "",
      share: ""
    },
  ]
};


 const Postssclice =createSlice({
    name:'Posts',
    initialState,
    reducers:{
        incrementLikes:{reducer(state,action){
            const post =state.posts.find(p=>p.id===action.payload)
            if (post){ post.likes+=1}
        }},
        addingPosts:{
        reducer(state,actions){
          state.posts.push(actions.payload)
        },
        prepare(message,country){
             return {
              payload:{     
                id: nanoid(),
                text: message ,
                country: country,
                createdAt: datechange(new Date().toISOString()),
                likes: 0,
                comands: "",
                share: ""
              }
            }
        }},
    }}
  )
export const postSelectorAll=(state)=>state.Posts.posts;
export const {incrementLikes,addingPosts}=Postssclice.actions
export default Postssclice.reducer;
