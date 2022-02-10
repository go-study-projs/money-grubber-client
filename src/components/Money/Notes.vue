<template>
  <div>
    <label class="notes">
      <span class="name">备注</span>
      <input
        type="text"
        :value="value"
        @input="onNotesChange($event.target.value)"
        placeholder="写点备注吧~"
      />
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class Notes extends Vue {
  @Prop() readonly value!: string
  @Watch('notes')
  onNotesChange(value: string) {
    this.$emit('update:value', value)
  }
}
</script>

<style scoped lang="scss">
.notes {
  font-size: 14px;
  background: #f5f5f5;
  padding-left: 16px;
  display: flex;
  align-items: center;

  .name {
    padding-right: 16px;
  }

  input {
    height: 40px;
    flex-grow: 1;
    background: transparent;
    border: none;
    padding-right: 16px;
  }
}
</style>
