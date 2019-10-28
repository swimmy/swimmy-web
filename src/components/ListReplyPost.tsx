import {
  CircularProgress,
  Fade,
  List,
  ListItem,
  ListItemText,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { delay } from 'rxjs/operators'
import { POSTS, POSTS_AS_ANONYM } from '../firestore/constants/collection'
import { DESC } from '../firestore/constants/order'
import { Post } from '../firestore/types/post'

type Props = {
  postId: string
  replyPostCount: number
}

const ListReplyPost: FunctionComponent<Props> = ({
  postId,
  replyPostCount
}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [inProgress, setInProgress] = useState(replyPostCount > 0)
  const classes = useStyles({})

  useEffect(() => {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc(postId)
      .collection(POSTS)
      .limit(24)
      .orderBy('createdAt', DESC)
    const subscription = collectionData(query)
      .pipe(delay(replyPostCount > 0 ? 400 : 0))
      .subscribe((docs: any) => {
        docs.reverse()
        setPosts(docs)
        setInProgress(false)
      })
    return () => subscription.unsubscribe()
  }, [postId, replyPostCount])

  if (inProgress) {
    return (
      <div className={classes.progress}>
        <CircularProgress />
      </div>
    )
  }

  if (!posts.length) {
    return null
  }

  return (
    <Fade in>
      <List className={classes.root}>
        {posts.map(post => (
          <ListItem key={post.id} button>
            <ListItemText>{post.text}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Fade>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    progress: { marginTop: spacing(2), textAlign: 'center' },
    root: { width: `${100}%` }
  }
})

export default ListReplyPost