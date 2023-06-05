<template>
  <div class="tag-select">
    <div class="tag-box">
      <el-tag
        v-for="item in selectValues"
        :key="item.id"
        effect="dark"
        style="margin-right: 5px"
        type="primary"
        closable
        @close="onDeleteTag(item)"
      >
        {{ item.name }}
      </el-tag>
    </div>
    <slot name="append" />
  </div>
</template>

<script>
export default {
  name: 'TagSelect',
  props: {
    value: {
      type: [String, Array]
    }
  },
  emits: ['input'],
  data() {
    return {
      selectValues: []
    }
  },
  watch: {
    value: {
      handler(newValue) {
        if (newValue == null || newValue === '') {
          this.selectValues = []
        } else {
          if (Array.isArray(newValue)) {
            this.selectValues = [...newValue]
          } else {
            this.selectValues = newValue.split(',').map((item) => {
              return {
                id: item,
                /* eslint-disable-next-line */
                name: item === '${startUserName}' ? '流程发起人' : item
              }
            })
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    onDeleteTag(tag) {
      const temp = this.selectValues.filter((item) => {
        return item !== tag
      })
      if (Array.isArray(this.value)) {
        this.$emit('input', temp)
      } else {
        this.$emit('input', temp.map((item) => item.id).join(','))
      }
    }
  }
}
</script>

<style scoped>
.tag-select {
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.tag-box {
  flex-grow: 1;
  padding: 0 5px;
}
</style>
