import { db } from '../Config/firebase-config'
import './RegisterForm.css'
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc,} from "firebase/firestore"
import { useEffect, useState } from 'react'

function RegisterForm() {
  

  const usersCollectionRef = collection(db, "user")
  const [errorMessage, setErrorMessage] = useState('')
  const [userList, setUsers] = useState([])


  useEffect(()=>{
    const getUser = async() => {
        const data = await getDocs(usersCollectionRef)
        setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }
    getUser()
  }, [])


function ifEmailExists(email)
{
  let check = false
  userList.map((user) => {
    if(user.email == email)
    {
      check = true
    }
  })
  return check
}

async function register(e)
{
  e.preventDefault()

  let newEmail = e.target.email.value
  let newPassword = e.target.password.value

  
  if(newEmail == "" || newPassword == ""){
    setErrorMessage('please input all fields!')
  }else if(!newEmail.endsWith('@gmail.com')){
    setErrorMessage('please input a gmail email!')
  }else if(ifEmailExists(newEmail)){
    setErrorMessage('email already exists!')
  }
  else{ 
    await addDoc(usersCollectionRef, {email : newEmail, password : newPassword})  
    window.location.replace('/login')
  }
}


  return (
<div class="w-full max-w-xs" id="registerForm">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={register}>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Email
      </label>
      <input name="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="example@gmail.com"/>
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
      <p class="text-red-500 text-xs italic">{errorMessage}</p>
    </div>
    <div class="flex items-center justify-between">
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Sign Up
      </button>
      <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a>
    </div>
  </form>
  <p class="text-center text-gray-500 text-xs">
    &copy;2020 Acme Corp. All rights reserved.
  </p>
</div>
  );
}

export default RegisterForm;
