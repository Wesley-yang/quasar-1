import { h, defineComponent } from 'vue'

import { uniqueSlot } from '../../utils/slot.js'
import { noop } from '../../utils/event.js'

export default defineComponent({
  name: 'QChatMessage',

  props: {
    sent: Boolean,
    label: String,
    bgColor: String,
    textColor: String,
    name: String,
    avatar: String,
    text: Array,
    stamp: String,
    size: String,
    labelSanitize: Boolean,
    nameSanitize: Boolean,
    textSanitize: Boolean,
    stampSanitize: Boolean
  },

  computed: {
    textClass () {
      return `q-message-text-content q-message-text-content--${this.op}` +
        (this.textColor !== void 0 ? ` text-${this.textColor}` : '')
    },

    messageClass () {
      return `q-message-text q-message-text--${this.op}` +
        (this.bgColor !== void 0 ? ` text-${this.bgColor}` : '')
    },

    containerClass () {
      return `q-message-container row items-end no-wrap` +
        (this.sent === true ? ' reverse' : '')
    },

    sizeClass () {
      if (this.size !== void 0) {
        return `col-${this.size}`
      }
    },

    op () {
      return this.sent === true ? 'sent' : 'received'
    },

    domProps () {
      return {
        msg: this.textSanitize === true ? 'textContent' : 'innerHTML',
        stamp: this.stampSanitize === true ? 'textContent' : 'innerHTML',
        name: this.nameSanitize === true ? 'textContent' : 'innerHTML',
        label: this.labelSanitize === true ? 'textContent' : 'innerHTML'
      }
    }
  },

  methods: {
    __getText () {
      const withStamp = this.stamp
        ? node => [
          node,
          h('div', {
            class: 'q-message-stamp',
            [this.domProps.stamp]: this.stamp
          })
        ]
        : node => [ node ]

      return this.text.map((msg, index) => h('div', {
        key: index,
        class: this.messageClass
      }, [
        h(
          'div',
          { class: this.textClass },
          withStamp(
            h('div', { [this.domProps.msg]: msg })
          )
        )
      ]))
    },

    __getMessage () {
      const content = uniqueSlot(this, 'default', [])

      this.stamp !== void 0 && content.push(
        h('div', {
          class: 'q-message-stamp',
          [this.domProps.stamp]: this.stamp
        })
      )

      return h('div', { class: this.messageClass }, [
        h('div', {
          class: 'q-message-text-content ' + this.textClass
        }, content)
      ])
    }
  },

  render () {
    const container = []

    if (this.$slots.avatar !== void 0) {
      container.push(this.$slots.avatar())
    }
    else if (this.avatar !== void 0) {
      container.push(
        h('img', {
          class: `q-message-avatar q-message-avatar--${this.op}`,
          src: this.avatar,
          'aria-hidden': 'true'
        })
      )
    }

    const msg = []

    this.name !== void 0 && msg.push(
      h('div', {
        class: `q-message-name q-message-name--${this.op}`,
        [this.domProps.name]: this.name
      })
    )

    this.text !== void 0 && msg.push(
      this.__getText()
    )

    this.$slots.default !== void 0 && msg.push(
      this.__getMessage()
    )

    container.push(
      h('div', { class: this.sizeClass }, msg)
    )

    const child = []

    this.label && child.push(
      h('div', {
        class: 'q-message-label text-center',
        [this.domProps.label]: this.label
      })
    )

    child.push(
      h('div', { class: this.containerClass }, container)
    )

    return h('div', {
      class: `q-message q-message-${this.op}`
    }, child)
  }
})
