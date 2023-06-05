import dayjs from 'dayjs'
const allowStatsType = ['time', 'datetime', 'day', 'month', 'year']
/**
 * 日期相关方法
 */
const statsDateRangeMixin = {
  methods: {
    /**
     * 根据输入的日期获得日期范围（例如：输入2019-12-12，输出['2019-12-12 00:00:00', '2019-12-12 23:59:59']）
     * @param {Date|String} date 要转换的日期
     * @param {String} statsType 转换类型（day, month, year）
     * @param {String} format 输出格式
     */
    getDateRangeFilter(
      date,
      statsType = 'day',
      format = 'yyyy-MM-dd HH:mm:ss'
    ) {
      if (date == null) return []

      statsType = allowStatsType.indexOf(statsType) === -1 ? 'day' : statsType
      date = date.substr(0, date.indexOf(' '))
      const tempList = date.split('-')
      const year = Number.parseInt(tempList[0])
      const month = Number.parseInt(tempList[1])
      const day = Number.parseInt(tempList[2])
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return []
      }
      const tempDate = new Date(year, month - 1, day)
      // 判断是否正确的日期
      if (isNaN(tempDate.getTime())) return []

      tempDate.setHours(0, 0, 0, 0)
      let retDate
      switch (statsType) {
        case 'day':
          retDate = [
            new Date(tempDate),
            new Date(tempDate.setDate(tempDate.getDate() + 1))
          ]
          break
        case 'month':
          tempDate.setDate(1)
          retDate = [
            new Date(tempDate),
            new Date(tempDate.setMonth(tempDate.getMonth() + 1))
          ]
          break
        case 'year':
          tempDate.setDate(1)
          tempDate.setMonth(0)
          retDate = [
            new Date(tempDate),
            new Date(tempDate.setFullYear(tempDate.getFullYear() + 1))
          ]
      }

      retDate[1] = new Date(retDate[1].getTime() - 1)

      return [dayjs(retDate[0], format), dayjs(retDate[1], format)]
    },
    /**
     * 格式化日期
     * @param {Date|String} date 要格式化的日期
     * @param {String} statsType 输出日期类型
     * @param {String} format 输入日期的格式
     */
    formatDateByStatsType(date, statsType = 'day', format = 'yyyy-MM-dd') {
      if (date == null) return undefined
      if (statsType == null) return date
      statsType = allowStatsType.indexOf(statsType) === -1 ? 'day' : statsType
      if (statsType === 'datetime') format = 'yyyy-MM-dd HH:mm:ss'

      const tempDate = date instanceof Date ? date : dayjs(date, format)
      if (!tempDate) return undefined
      switch (statsType) {
        case 'time':
          return dayjs(tempDate, 'HH:mm:ss')
        case 'datetime':
          return dayjs(tempDate, 'yyyy-MM-dd HH:mm:ss')
        case 'day':
          return dayjs(tempDate, 'yyyy-MM-dd')
        case 'month':
          return dayjs(tempDate, 'yyyy-MM')
        case 'year':
          return dayjs(tempDate, 'yyyy')
        default:
          return dayjs(tempDate, 'yyyy-MM-dd')
      }
    },
    /**
     * 获得统计类型中文名称
     * @param {String} statsType 统计类型（day, month, year）
     */
    getStatsTypeShowName(statsType) {
      statsType = allowStatsType.indexOf(statsType) === -1 ? 'day' : statsType
      switch (statsType) {
        case 'day':
          return '日统计'
        case 'month':
          return '月统计'
        case 'year':
          return '年统计'
      }
    },
    /**
     * 获取统计类型字典列表
     * @param {Array} statsTypeList 统计类型列表
     */
    getAllowStatsTypeList(statsTypeList) {
      if (Array.isArray(statsTypeList) && statsTypeList.length > 0) {
        return statsTypeList.map((item) => {
          return {
            id: item,
            name: this.getStatsTypeShowName(item)
          }
        })
      } else {
        return []
      }
    }
  }
}

/**
 * 缓存页面跳转页面相关方法
 */
const cachedPageChildMixin = {
  data() {
    return {
      // 是否刷新父页面
      refreshParentCachedPage: false
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.meta == null) to.meta = {}
    to.meta.refresh = this.refreshParentCachedPage
    next()
  }
}

export { statsDateRangeMixin, cachedPageChildMixin }
