import './LoginForm.css'
import {useState, useEffect} from "react";
import { db } from "../Config/firebase-config";
import {collection, getDocs} from 'firebase/firestore'


function LoginForm() {

  const [userList, setUsers] = useState([])
  const userCollectionRef = collection(db, "user")

  useEffect(()=>{
    const getUser = async() => {
        const data = await getDocs(userCollectionRef)
        setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }
    getUser()
  }, [])

  
function login(e)
{
  e.preventDefault()
  userList.map((user) => {  
    
    let email = e.target.email.value
    let password = e.target.password.value

    if(email == user.email && password == user.password)
    {
      window.location.replace("./")
      console.log("succed login")
      return
    }
  })
  console.log("credential failed")
}

  return (
<div class="w-full max-w-xs" id="registerForm">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={login}>
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
      <p class="text-red-500 text-xs italic"></p>
    </div>
    <div class="flex items-center justify-between">
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Sign In
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

export default LoginForm;
