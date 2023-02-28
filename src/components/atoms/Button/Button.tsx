import { ButtonHTMLAttributes } from 'react'

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="rounded-sm bg-purple text-white px-4 py-1 text-xs transition-all hover:opacity-50 hover:mt-0.5 disabled:opacity-50"
    {...props}
  />
)

export default Button
