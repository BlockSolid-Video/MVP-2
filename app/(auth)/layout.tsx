import { FC,ReactNode } from "react"

interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout:FC<AuthLayoutProps> = ({children}) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center p-10 ">
        {children}
    </div>
  )
}

export default AuthLayout