import React, { useState } from 'react'
import Posts from '../components/Posts'
import AddPosts from '../components/AddPosts'

const PostsUI = () => {

  const countries = [
  { code: 'GLOBAL', name: '🌍 Global' },
  { code: 'IN', name: '🇮🇳 India' },
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'UK', name: '🇬🇧 United Kingdom' },
  { code: 'CA', name: '🇨🇦 Canada' },
  { code: 'AU', name: '🇦🇺 Australia' },
]

  const [countryname,setCountryName]=useState('GLOBAL')
  function contrychange(e){
    setCountryName(e.target.value)
  }
  
  return (
    <div>
      <header className='text-3xl text-black text-center'>
        <h1>POSTS</h1>
        <nav>
          <label htmlFor="country">choose country</label>
          <select onChange={(e)=>contrychange(e)}  name="country" id="country">{
            countries.map((country,idx)=>(<option  key={idx} value={country.code}>{country.name}</option>))
          }

          </select>
        </nav>
        <AddPosts/>
      </header>
      <Posts countryname={countryname}/>
    </div>
  )
}

export default PostsUI
