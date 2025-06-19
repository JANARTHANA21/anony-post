import React from 'react'
import { useSelector } from 'react-redux'
import { postSelectorAll } from '../features/Posts/Postssclice'
import { useParams } from 'react-router-dom' 

const Eachpost = () => {
  const { id } = useParams();
  const posts = useSelector(postSelectorAll)
  const post = posts.find(p => String(p.id) === id) 

  if (!post) return <div>Post not found</div>

  return (
    <div>
      <h2>{post.text}</h2>
      <p>🌍 {post.country}</p>
      <p>🕒 {post.createdAt}</p>
      <p>❤️ {post.likes} likes</p>
    </div>
  )
}

export default Eachpost