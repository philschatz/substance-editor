import {Component} from 'substance'

if (!window.MathQuill) {
  throw new Error('BUG: MathQuill has not been loaded yet')
}

export default class MathQuillComponent extends Component {
  render($$) {
    let {node, language, source} = this.props

    let el = $$('span').addClass('sc-mathquill-input').append(source)
    .ref('mathQuillInput')
    return el
  }

  // don't rerender because this would destroy MathJax
  shouldRerender() {
    return false;
  }

  didUpdate(oldProps, oldState) {
    const {source} = this.props
    // Check so we do not lose focus
    if (source !== this._mathField.latex()) {
      this.__hackIgnoreFiringUpdates = true
      this._mathField.latex(source)
      this.__hackIgnoreFiringUpdates = false
    }
  }

  _updateLatex() {
    if (!this.__hackIgnoreFiringUpdates) {
      this.send('mathQuillUpdated', this._mathField.latex())
    }
  }

  didMount() {
    let {node, language, source} = this.props
    let mathQuillInput = this.refs['mathQuillInput'].getNativeElement()

    let MQ = MathQuill.getInterface(2) // for backcompat
    this._mathField = MQ.MathField(mathQuillInput, {
      spaceBehavesLikeTab: true, // configurable
      handlers: {
        edit: this._updateLatex.bind(this)
      }
    })
  }

}
