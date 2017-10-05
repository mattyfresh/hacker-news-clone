import React, { Component } from 'react'

import { GC_USER_ID } from '../constants'
import { ALL_LINKS_QUERY } from './LinkList'

import { graphql, gql } from 'react-apollo'

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    return (
      <div>
        <div className='flex flex-column mt3'>
          <input
            className='mb2'
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
            type='text'
            placeholder='A description for the link'
          />
          <input
            className='mb2'
            value={this.state.url}
            onChange={(e) => this.setState({ url: e.target.value })}
            type='text'
            placeholder='The URL for the link'
          />
        </div>
        <button
          onClick={() => this._createLink()}
        >
          Submit
        </button>
      </div>
    )
  }

  _createLink = async () => {
    const userId = localStorage.getItem(GC_USER_ID)
    if (!userId) {
      return console.error('User is not logged in')
    }

    const { description, url } = this.state

    // `createLinkMutation` maps to the name option passed into `graphql` function
    await this.props.createLinkMutation({
      variables: {
        description,
        url,
        postedById: userId,
      },
      update: ((store, { data: { createLink } }) => {
        const data = store.readQuery({ query: ALL_LINKS_QUERY })
        data.allLinks.unshift(createLink)
        store.writeQuery({ query: ALL_LINKS_QUERY, data })
      })
    })

    this.props.history.push('/')
  }
}

const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation($description: String!, $url: String!, $postedById: ID!) {
    createLink(
      description: $description,
      url: $url,
      postedById: $postedById,
    ) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
    }
  }
`

export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLink)