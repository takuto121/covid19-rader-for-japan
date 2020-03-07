import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {Status} from '../../types/app'
import { Item, User } from '../../types'
import { itemActions } from '../module/item'
import { userActions } from '../module/user'
import { API } from '../firebase/api'
import { defaultUser, defaultItems } from './data'

/////////////////////////////////////////////////
//////////          Sign In             ////////
////////////////////////////////////////////////

export const useSignIn = () => {
  const [status, setStatus] = useState<Status>({Progress: 0, Log: "", Error: "", Loading: false})
  const dispatch = useDispatch()
  const api = new API()

  const signIn = useCallback(async (email: string, password: string) => {
    try{
        // Loading開始
        setStatus({...status, Loading: true})
        
        // sign in auth
        const userCredit = await api.signIn(email, password)
        console.log("1")

        // ユーザー情報を取得
        if(userCredit.user === null){
          throw console.error("can't find user...")
        }
        const uid: User["ID"] = userCredit.user.uid
        const userInfo: User = await api.getUserInfo(uid)

        // userInfoをstore
        dispatch(userActions.updateUserInfo(userInfo))
        console.log("2")

        // itemsを取得
        const items = await api.getItems(uid)
        console.log("3")

        // itemsをstore
        dispatch(itemActions.createItems(items))

        // Loading終了
        setStatus({...status, Loading: false})
        setStatus({...status, Progress: 100})

    }catch(err){

    }

  }, [status])
  return { "signIn": signIn, "status": status}
}

/////////////////////////////////////////////////
//////////          Sign Up             ////////
////////////////////////////////////////////////

export const useSignUp = () => {
    const [status, setStatus] = useState<Status>({Progress: 0, Log: "", Error: "", Loading: false})
    const dispatch = useDispatch()
    const api = new API()
  
    const signUp = useCallback(async (name: string, email: string, password: string) => {
      try{
          // Loading開始
          setStatus({...status, Loading: true})
          
          // sign in auth
          const userCredit = await api.signUp(email, password)
          setStatus({...status, Progress: 30})

          // ユーザー情報を作成
          if(userCredit.user === null){
            throw console.error("can't find user...")
          }
          const uid: User["ID"] = userCredit.user.uid
          const userInfo: User = defaultUser()
          userInfo.ID = uid
          userInfo.Setting.Email = email
          userInfo.Profile.Name = name

          // userInfoをstore
          dispatch(userActions.updateUserInfo(userInfo))
          // userInfoをfirestoreへ
          await api.createUserInfo(userInfo)
          setStatus({...status, Progress: 60})

          // itemsを取得
          const items = defaultItems()

          // itemsをstore
          dispatch(itemActions.createItems(items))
          // itemsをfirestoreへ
          const path = "users/" + uid + "/items"
          await items.forEach(async(item: Item) => {
            await api.createItem(item, path)
          });
  
          // Loading終了
          setStatus({...status, Loading: false})

          setStatus({...status, Progress: 100})
          
      }catch(err){
        console.log("error: ", err)
        setStatus({...status, Error: err})
      }
  
    }, [status])
    return { "signUp": signUp, "status": status}
  }

  /////////////////////////////////////////////////
 //////////          Sign Out             ////////
////////////////////////////////////////////////

  export const useSignOut = () => {
    const [status, setStatus] = useState<Status>({Progress: 0, Log: "", Error: "", Loading: false})
    const dispatch = useDispatch()
    const api = new API()
  
    const signOut = useCallback(async () => {
      try{
          // Loading開始
          setStatus({...status, Loading: true})
          
          // signout
          await api.signOut()
  
          // StoreのItemsを初期化
		      const items: Item[] = []
          dispatch(itemActions.createItems(items))
  
          // Storeのユーザ情報を初期化
          const user: User = new User()
          dispatch(userActions.updateUserInfo(user))
  
          // Loading終了
          setStatus({...status, Loading: false})
          
      }catch(err){
  
      }
  
    }, [status])
    return { "signOut": signOut, "status": status}
  }