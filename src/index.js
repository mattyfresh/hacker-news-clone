import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

import { GC_AUTH_TOKEN } from './constants'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo'
import { addGraphQLSubscriptions, SubscriptionClient } from 'subscriptions-transport-ws'

import './styles/index.css'

const ENDPOINT_ID = 'cj8ditmuh0mzj0124v875694t'
const authToken = localStorage.getItem(GC_AUTH_TOKEN)

const networkInterface = createNetworkInterface({
  uri: `https://api.graph.cool/simple/v1/${ENDPOINT_ID}`
})

// new websocket client
const wsClient = new SubscriptionClient(`wss://subscriptions.us-west-2.graph.cool/v1/cj8ditmuh0mzj0124v875694t`, {
  reconnect: true,
  connectionParams: {
    authToken
  }
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

// pass along auth header on every request
// from ApolloCLient to graphcool
networkInterface.use([{
  applyMiddleware: (req, next) => {
    if (!req.options.header) {
      req.options.header = {}
    }

    req.options.header.authorization = authToken ? `Bearer ${authToken}` : null
    next()
  }
}])

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ BrowserRouter>
  , document.getElementById('root'))
registerServiceWorker()
