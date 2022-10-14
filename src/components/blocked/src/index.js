import React, {Component, PropTypes} from 'react'
import {Icon} from 'react-mdl'
import {t} from 'utils/i18n'
import {defaultSettings, loadSettings, saveSettings} from 'utils/settings'
import {autobind} from 'core-decorators'


import _styles from './index.scss'

export default class Blocked extends Component {
  constructor () {
    super()

    this.state = Object.assign({trackingPermitted: false}, defaultSettings())

    loadSettings(function (settings) {
      this.setState(settings)
    }.bind(this))

  }

  @autobind
  myhandleChangeWhitelist (evt) {
    const {blockPages, blockOthers, whitelist, trackingPermitted} = this.state
    const {href, hostname} = this.props
    const {value} = evt.target
    // Add hostname to whitelist if not already there
    if (whitelist.indexOf(value) === -1) {
      // Prompt user to input password to add hostname to whitelist, password show be hidden
      var password = prompt('Please enter the password to add hostname to whitelist');
      if (password === 'Study!') {
        whitelist.push(value)
      }
    }
    saveSettings({whitelist})
    this.setState({whitelist})
    // go to href
    chrome.tabs.update({
        url: href
    });
  }

  static propTypes = {
    href: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired
  }

  render () {
    const {href, hostname} = this.props

    return (
      <div className='app-blocked'>
        <p className='app-blocked__info'>
          <Icon name='lock' />
          {t('msg_blocked_page_label')}
        </p>
        <p className='app-blocked__href'>
          {href}
        </p>
        <p>
          {/* Add a button to add blocked hostname to whitelist */}
          <button className='app-blocked__add_hostname' value={hostname}
            onClick={this.myhandleChangeWhitelist}>
            {t('msg_options_addwl_label')}
            {/* On clicked, add hostname to whitelist, then handleChangeWhitelist */}
          </button>
        </p>
        <p className='app-blocked__instructions'>
          {t('msg_blocked_instructions_label', hostname)}
        </p>
      </div>
    )
  }
}
