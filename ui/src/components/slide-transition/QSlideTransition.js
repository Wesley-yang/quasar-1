import { h, defineComponent, Transition } from 'vue'

export default defineComponent({
  name: 'QSlideTransition',

  props: {
    appear: Boolean,
    duration: {
      type: Number,
      default: 300
    }
  },

  methods: {
    __begin (el, height, done) {
      el.style.overflowY = 'hidden'
      if (height !== void 0) {
        el.style.height = `${height}px`
      }
      el.style.transition = `height ${this.duration}ms cubic-bezier(.25, .8, .50, 1)`

      this.animating = true
      this.done = done
    },

    __end (el, event) {
      el.style.overflowY = null
      el.style.height = null
      el.style.transition = null
      this.__cleanup()
      event !== this.lastEvent && this.$emit(event)
    },

    __cleanup () {
      this.done && this.done()
      this.done = null
      this.animating = false

      clearTimeout(this.timer)
      clearTimeout(this.timerFallback)
      this.el !== void 0 && this.el.removeEventListener('transitionend', this.animListener)
      this.animListener = null
    },

    __onEnter (el, done) {
      let pos = 0
      this.el = el

      if (this.animating === true) {
        this.__cleanup()
        pos = el.offsetHeight === el.scrollHeight ? 0 : void 0
      }
      else {
        this.lastEvent = 'hide'
      }

      this.__begin(el, pos, done)

      this.timer = setTimeout(() => {
        el.style.height = `${el.scrollHeight}px`
        this.animListener = ev => {
          if (Object(ev) !== ev || ev.target === el) {
            this.__end(el, 'show')
          }
        }
        el.addEventListener('transitionend', this.animListener)
        this.timerFallback = setTimeout(this.animListener, this.duration * 1.1)
      }, 100)
    },

    __onLeave (el, done) {
      let pos
      this.el = el

      if (this.animating === true) {
        this.__cleanup()
      }
      else {
        this.lastEvent = 'show'
        pos = el.scrollHeight
      }

      this.__begin(el, pos, done)

      this.timer = setTimeout(() => {
        el.style.height = 0
        this.animListener = ev => {
          if (Object(ev) !== ev || ev.target === el) {
            this.__end(el, 'hide')
          }
        }
        el.addEventListener('transitionend', this.animListener)
        this.timerFallback = setTimeout(this.animListener, this.duration * 1.1)
      }, 100)
    }
  },

  beforeUnmount () {
    this.animating && this.__cleanup()
  },

  render () {
    return h(Transition, {
      css: false,
      appear: this.appear,
      onEnter: this.__onEnter,
      onLeave: this.__onLeave
    }, this.$slots.default)
  }
})
