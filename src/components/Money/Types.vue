<template>
  <div class="types-wrapper">
    <ul class="types">
      <li
        :class="{
          [classPrefix + '-item']: classPrefix,
          selected: value === optionList[0]
        }"
        @click="selectType(optionList[0])"
      >
        {{ displayWord[0] || '支出' }}
      </li>
      <li
        :class="{
          [classPrefix + '-item']: classPrefix,
          selected: value === optionList[1]
        }"
        @click="selectType(optionList[1])"
      >
        {{ displayWord[1] || '收入' }}
      </li>
    </ul>
    <button v-if="cancelButton" class="cancel" @click="cancel">取消</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Types extends Vue {
  @Prop() readonly value!: string
  @Prop() readonly classPrefix?: string
  @Prop() readonly cancelButton?: boolean
  @Prop() readonly displayWord?: string[]
  @Prop({ required: true, type: Array }) readonly optionList!: string[]

  selectType(type: string) {
    if (type !== this.optionList[0] && type !== this.optionList[1]) {
      throw new Error('this is a wrong type')
    }
    this.$emit('update:value', type)
  }

  cancel() {
    this.$router.push('/statistics')
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/helper.scss';

.types-wrapper {
  background: $color-highlight;
  display: flex;
  justify-content: center;
  position: relative;

  .types {
    background: $color-highlight;
    display: flex;
    font-size: 20px;
    /*margin-top:5px;*/
    > li {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      &.selected::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #333;
      }
    }
  }

  .cancel {
    font-size: 14px;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    border: 0;
    background-color: transparent;
    padding-right: 16px;
    padding-top: 7px;
  }
}
</style>
