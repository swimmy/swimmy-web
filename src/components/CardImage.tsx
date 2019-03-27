import { Card, CardActionArea, CardMedia } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { pct } from '../libs/pct'
import { Post } from '../types/models/post'

type Props = {
  post: Post
}

const CardImage: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles({})

  return (
    <Link to={`/threads/${post.id}`}>
      <Card>
        <CardActionArea className={classes.actionArea}>
          <CardMedia component={'img'} image={`${post.photoURLs[0]}=s400`} />
        </CardActionArea>
      </Card>
    </Link>
  )
}

const useStyles = makeStyles({ actionArea: { width: pct(100) } })

export default CardImage
