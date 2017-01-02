import React from 'react'
import { translate } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import { AutoComplete, Button, Col, Input, Popover, Row } from 'antd'

/** Load translation namespaces and delay rendering until they are loaded. */
@translate(['wallet'], { wait: true })

/** Make the component reactive and inject MobX stores. */
@inject('addresses', 'keyDump', 'wallet') @observer

class KeyDump extends React.Component {
  constructor (props) {
    super(props)
    this.addresses = props.addresses
    this.keyDump = props.keyDump
    this.t = props.t
    this.wallet = props.wallet
    this.dumpprivkey = this.dumpprivkey.bind(this)
    this.setAddress = this.setAddress.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
  }

  dumpprivkey () {
    this.keyDump.dumpprivkey()
  }

  setAddress (address) {
    this.keyDump.setAddress(address)
  }

  togglePopover () {
    this.keyDump.togglePopover()
  }

  popoverContent () {
    return (
      <div style={{width: '400px'}}>
        <Row>
          <Col span={24} style={{height: '28px'}}>
            <AutoComplete
              placeholder={this.t('wallet:address')}
              style={{width: '100%'}}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              value={this.keyDump.address}
              dataSource={this.addresses.list}
              onChange={this.setAddress}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {
              this.keyDump.privateKey !== '' && (
                <Input
                  style={{margin: '5px 0 0 0'}}
                  value={this.keyDump.privateKey}
                />
              )
            }
          </Col>
        </Row>
        <Row>
          <Col span={15}>
            {
              this.keyDump.errorStatus === 'invalidCharacters' && (
                <p className='text-error'>{this.t('wallet:addressInvalidCharacters')}</p>
              ) ||
              this.keyDump.errorStatus === 'unknownAddress' && (
                <p className='text-error'>{this.t('wallet:addressUnknown')}</p>
              ) ||
              this.keyDump.errorStatus === 'invalidAddress' && (
                <p className='text-error'>{this.t('wallet:addressInvalid')}</p>
              )
            }
          </Col>
          <Col span={9} className='text-right'>
            <Button
              style={{margin: '5px 0 0 0'}}
              onClick={this.dumpprivkey}
              disabled={this.keyDump.errorStatus !== false}
            >
              {this.t('wallet:privateKeyDump')}
            </Button>
          </Col>
        </Row>
      </div>
    )
  }

  render () {
    return (
      <Popover
        title={this.t('wallet:privateKeyDumpLong')}
        trigger='click'
        placement='bottomLeft'
        content={this.popoverContent()}
        visible={this.keyDump.popover === true}
        onVisibleChange={this.togglePopover}
      >
        <Button
          disabled={this.wallet.isLocked === true}
        >
          {this.t('wallet:privateKeyDump')}
        </Button>
      </Popover>
    )
  }
}

export default KeyDump
