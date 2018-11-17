import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Tab from '@material-ui/core/Tab/Tab'
import Tabs from '@material-ui/core/Tabs/Tabs'
import { firestore } from 'firebase/app'
import React from 'react'
import { compose } from 'recompose'
import { collectionData } from 'rxfire/firestore'
import { CardImages } from '../components/CardImages'
import { PageTitle } from '../components/PageTitle'
import { POSTS_AS_IMAGE } from '../constants/collection'
import { DESC } from '../constants/order'
import { withCache } from '../higher-order-components/withCache'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscription = null
  state = { posts: [], inProgress: true, orderBy: 'updatedAt' }

  onChangeTab = (event, orderBy) => {
    const { history } = this.props

    history.push(`?order=${orderBy}`)

    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    this.subscription = this.subscribePosts(orderBy)
    this.setState({ orderBy, inProgress: true })
    this.saveState()
  }

  render() {
    const { classes } = this.props
    const { posts, inProgress } = this.state

    return (
      <main className={classes.root}>
        <PageTitle
          title={'フォトグラフィ'}
          description={'画像の添付された書き込みはここに表示されます。'}
        />
        <Tabs
          value={this.state.orderBy}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.onChangeTab}
        >
          <Tab label="更新" value={'updatedAt'} />
          <Tab label="新着" value={'createdAt'} />
          <Tab label="評価数" value={'likeCount'} />
          <Tab label="レス数" value={'replyPostCount'} />
        </Tabs>
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <CardImages posts={posts} />
          </Fade>
        )}
      </main>
    )
  }

  componentDidMount() {
    const orderBy = this.getOrderBy()

    this.setState({ orderBy })
    this.subscription = this.subscribePosts(orderBy)
    this.restoreState()
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.saveState()
  }

  subscribePosts(orderBy: string) {
    const query = firestore()
      .collection(POSTS_AS_IMAGE)
      .limit(40)
      .orderBy(orderBy, DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      this.setState({ posts, inProgress: false })
    })
  }

  getOrderBy() {
    const { location } = this.props

    switch (location.search.replace('?order=', '')) {
      case 'createdAt':
        return 'createdAt'
      case 'likeCount':
        return 'likeCount'
      case 'replyPostCount':
        return 'replyPostCount'
      default:
        return 'updatedAt'
    }
  }

  restoreState() {
    const { cache } = this.props

    cache.restore(state => {
      this.setState({ posts: state.posts, inProgress: false })
    })
  }

  saveState() {
    const { posts } = this.state
    const { cache } = this.props

    cache.save({ posts })
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: { display: 'grid', gridRowGap: px(spacing.unit * 2) },
    progress: {
      display: 'block',
      marginTop: spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  })

export const PageImages = compose(
  withCache,
  withStyles(styles)
)(Component)
