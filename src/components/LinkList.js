import React, { Component } from 'react'
import Link from './Link'

import { gql, graphql } from 'react-apollo'

class LinkList extends Component {

  _updateStoreAfterVote(store, createdVote, linkId) {
    // grab the cached Links and all their data
    const data = store.readQuery({ query: ALL_LINKS_QUERY })

    // find the Link in our local cache
    const linkToUpdate = data.allLinks.find(link => link.id === linkId)

    // mutate the existing cached Link with the newest number of votes
    // IE render optimistically fore the UI
    linkToUpdate.votes = createdVote.link.votes
    store.writeQuery({ query: ALL_LINKS_QUERY, data })
  }

  render() {
    if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
      return <div>Error</div>
    }

    const linksToRender = this.props.allLinksQuery.allLinks
    return (
      <div>
        {linksToRender.map((link, index) => (
          <Link
            key={link.id}
            link={link}
            updateStoreAfterVote={this._updateStoreAfterVote}
            index={index} />
        ))}
      </div>
    )
  }
}

export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery {
    allLinks {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

export default graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' })(LinkList)