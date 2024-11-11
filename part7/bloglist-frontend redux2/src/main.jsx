import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './static/index.css'
import store from './store'
import {
  BrowserRouter as Router,
} from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
)