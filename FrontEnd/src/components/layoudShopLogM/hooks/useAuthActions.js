import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
   updateProfile,

} from "firebase/auth"
import { auth } from "../firebase/firebase"
import useStore from "../../../store/useStore"

export default function useAuthActions() {
  const setUser = useStore((state) => state.setUser)

  const provider = new GoogleAuthProvider()

  const register = async (email, password, nombre) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(res.user, {
      displayName: nombre,
    })

    setUser({ ...res.user, displayName: nombre })

  } catch (err) {
    throw err
  }
}
  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)

      setUser(res.user)
    } catch (err) {
      throw err
    }
  }

  const loginGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider)

      setUser(res.user)
    } catch (err) {
      throw err
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return {
    login,
    register,
    logout,
    loginGoogle,
  }
}