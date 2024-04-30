'use client'

// Next Imports
import Link from 'next/link'

import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import Typography from '@mui/material/Typography'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { settings } = useSettings()
  const { isBreakpointReached: isVerticalBreakpointReached } = useVerticalNav()
  const { isBreakpointReached: isHorizontalBreakpointReached } = useHorizontalNav()

  // Vars
  const isBreakpointReached =
    settings.layout === 'vertical' ? isVerticalBreakpointReached : isHorizontalBreakpointReached

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center',

      }}
    >
      <Typography>
        {`© ${new Date().getFullYear()}, Easy Outdesk. All rights reserved. `}
      </Typography>
    </Box>
  )
}

export default FooterContent
