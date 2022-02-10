<template>
  <div class="numberPad">
    <div class="output">{{ output }}</div>
    <div class="buttons">
      <button @click="inputContent">1</button>
      <button @click="inputContent">2</button>
      <button @click="inputContent">3</button>
      <button @click="add">
        <Icon name="add" />
      </button>
      <button @click="inputContent">4</button>
      <button @click="inputContent">5</button>
      <button @click="inputContent">6</button>
      <button @click="minus">
        <Icon name="minus" />
      </button>
      <button @click="inputContent">7</button>
      <button @click="inputContent">8</button>
      <button @click="inputContent">9</button>
      <button @click="clear">
        <Icon name="clear" />
      </button>
      <button @click="inputContent">.</button>
      <button @click="inputContent">0</button>
      <button @click="backspace">
        <Icon name="backspace" />
      </button>
      <button @click="ok">
        <Icon name="tick" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import retainDecimal from '@/lib/retainDecimal'

@Component
export default class NumberPad extends Vue {
  @Prop() readonly value!: number
  output = this.value.toString()

  inputContent(event: MouseEvent) {
    const button = event.target as HTMLButtonElement
    const input = button.textContent as string

    if (this.output.length === 16) {
      return
    }

    this.handleNumber(input)
  }

  handleNumber(input: string) {
    if (this.output === '0') {
      if ('0123456789'.indexOf(input) >= 0) {
        this.output = input
        return
      }

      if (input === '.') {
        this.output += input
        return
      }

      return
    }

    if (input === '.') {
      this.handleDot()
      return
    }

    this.output += input
    return
  }

  handleDot() {
    const lastIndex = this.output.length - 1
    if (this.output[lastIndex] === '+' || this.output[lastIndex] === '-') {
      return
    }

    if (this.output.indexOf('+') < 0 && this.output.indexOf('-') < 0) {
      if (this.output.indexOf('.') >= 0) {
        return
      }
      this.output += '.'
      return
    }

    if (this.output.indexOf('+') >= 0) {
      const item = this.output.split('+')

      if (item[1].indexOf('.') >= 0) {
        return
      }
      this.output += '.'
      return
    } else if (this.output.indexOf('-') >= 0) {
      const item = this.output.split('-')
      if (item[1].indexOf('.') >= 0) {
        return
      } else {
        this.output += '.'
      }
    }
  }

  handleMinusAndAdd(input: string) {
    let result
    const lastIndex = this.output.length - 1
    if (this.output[lastIndex] === '+' || this.output[lastIndex] === '-') {
      this.output = this.output.slice(0, lastIndex)
      this.output += input
      return
    }

    if (this.output.indexOf('+') < 0 && this.output.indexOf('-') < 0) {
      if (this.output[lastIndex] === '.') {
        return
      }
      this.output += input
    } else {
      if (this.output.indexOf('+') >= 0) {
        const item = this.output.split('+')
        result = parseFloat(item[0]) + parseFloat(item[1])
        this.output = result.toString() + input
      } else if (this.output.indexOf('-') >= 0) {
        const item = this.output.split('-')
        if (item.length > 2) {
          result = -1 * parseFloat(item[1]) - parseFloat(item[2])
        } else {
          result = parseFloat(item[0]) - parseFloat(item[1])
        }
        this.output = result.toString() + input
      }
    }
  }

  backspace() {
    if (this.output.length === 1) {
      this.output = '0'
    } else {
      this.output = this.output.slice(0, -1)
    }
  }

  add() {
    this.handleMinusAndAdd('+')
  }

  minus() {
    this.handleMinusAndAdd('-')
  }

  clear() {
    this.output = '0'
  }

  outputChecker() {
    let result = 0
    if (this.output.indexOf('+') >= 0 && this.output.indexOf('-') < 0) {
      const item = this.output.split('+')
      result = item[1]
        ? parseFloat(item[0]) + parseFloat(item[1])
        : parseFloat(item[0])
      return result
    } else if (this.output.indexOf('-') >= 0) {
      const item = this.output.split('-')
      if (item.length === 3) {
        this.clear()
      } else if (item.length === 2) {
        if (item[0] !== '' && item[1] !== '') {
          result = parseFloat(item[0]) - parseFloat(item[1])
          return result
        } else if (item[0] === '') {
          const count = item[1].split('+')
          if (count[1] === '') {
            this.clear()
          } else {
            result = parseFloat(count[1]) - parseFloat(count[0])
            return result
          }
        } else if (item[1] === '') {
          result = parseFloat(item[0])
          return result
        }
      }
    } else {
      result = parseFloat(this.output)
      return result
    }
    return result
  }

  ok() {
    const result = parseFloat(retainDecimal(this.outputChecker()))
    if (result === 0) {
      window.alert('记账金额为零哦')
      return
    } else if (result < 0) {
      window.alert('怎么能记录负数呢')
      this.clear()
      return
    } else {
      this.$emit('update:value', result)
      this.$emit('submit', result)
      this.clear()
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/styles/helper.scss';

.numberPad {
  .output {
    @extend %clearFix;
    @extend %innerShadow;
    font-size: 32px;
    font-family: Consolas, monospace;
    padding: 0 16px;
    text-align: right;
    height: 48px;
  }

  .buttons {
    @extend %clearFix;

    > button {
      width: 25%;
      height: 56px;
      float: left;
      background: transparent;
      border: none;

      &.ok {
        height: 64 * 2px;
        float: right;
      }

      $bg: #f2f2f2;

      &:nth-child(1) {
        background: $bg;
      }

      &:nth-child(2),
      &:nth-child(5) {
        background: darken($bg, 4%);
      }

      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(9) {
        background: darken($bg, 4 * 2%);
      }

      &:nth-child(4),
      &:nth-child(7),
      &:nth-child(10),
      &:nth-child(13) {
        background: darken($bg, 4 * 3%);
      }

      &:nth-child(8),
      &:nth-child(11),
      &:nth-child(14) {
        background: darken($bg, 4 * 4%);
      }

      &:nth-child(15) {
        background: darken($bg, 4 * 5%);
      }

      &:nth-child(12),
      &:nth-child(15) {
        background: darken($bg, 4 * 6%);
      }

      &:nth-child(16) {
        background: darken($bg, 4 * 7%);
      }
    }

    .icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
