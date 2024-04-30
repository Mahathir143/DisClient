// Component Imports

import Login from '@views/Login'
import LoginV1 from '@views/LoginV1'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = () => {
  // Vars
  const mode = getServerMode()

  return <LoginV1 mode={mode} />
}

export default LoginPage
