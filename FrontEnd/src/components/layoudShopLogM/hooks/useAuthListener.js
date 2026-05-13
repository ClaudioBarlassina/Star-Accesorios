import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/firebase"
import useStore from "../../../store/useStore"

export default function useAuthListener() {
  const setUser = useStore((s) => s.setUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])
}