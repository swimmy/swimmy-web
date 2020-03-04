import {
  AppBar,
  Divider,
  Fade,
  IconButton,
  Slide,
  Theme,
  Toolbar,
  useScrollTrigger,
} from '@material-ui/core'
import FlightIcon from '@material-ui/icons/Flight'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { detectStandalone } from '../web/detectStandalone'
import DialogMenu from './DialogMenu'
import ImgLogo from './ImgLogo'

const AppBarDefault: FunctionComponent = () => {
  const [openDialog, setOpenDialog] = useState(false)

  const classes = useStyles()

  const isStandalone = detectStandalone()

  const history = useHistory()

  const isFirst =
    history.length === 0 ||
    history.location.pathname === '/' ||
    history.location.pathname === '/images' ||
    history.location.pathname === '/others' ||
    history.location.pathname === '/threads'

  const trigger = useScrollTrigger({ threshold: 100 })

  const triggerDivider = useScrollTrigger({
    disableHysteresis: true,
    threshold: 200,
  })

  const triggerFlight = useScrollTrigger({
    disableHysteresis: true,
    threshold: 600,
  })

  const onScroll = () => {
    document.body.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Slide appear={false} direction={'down'} in={!trigger}>
      <AppBar color={'inherit'} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <ImgLogo disabled={!isFirst} />
          {!isFirst && (
            <IconButton onClick={() => history.goBack()}>
              <KeyboardReturnIcon />
            </IconButton>
          )}
          {isStandalone ? (
            <Fade in={triggerFlight}>
              <IconButton onClick={onScroll}>
                <FlightIcon color={'action'} />
              </IconButton>
            </Fade>
          ) : (
            <IconButton onClick={() => setOpenDialog(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
        <DialogMenu open={openDialog} onClose={() => setOpenDialog(false)} />
        <Fade in={triggerDivider}>
          <Divider />
        </Fade>
      </AppBar>
    </Slide>
  )
}

const useStyles = makeStyles<Theme>(({ breakpoints, spacing, zIndex }) => {
  return {
    actions: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: spacing(1),
    },
    toolbar: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      justifyItems: 'right',
      [breakpoints.up('md')]: { paddingLeft: spacing(40 + 3) },
    },
  }
})

export default AppBarDefault
