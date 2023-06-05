<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <slot name="control-header" />
      <template v-if="!$slots['control-header']">
        <el-button-group key="file-control">
          <el-button
            v-if="!simple"
            :size="headerButtonSize"
            :type="headerButtonType"
            @click="onSave"
          >
            <i class="ri-save-line" /> 保存流程
          </el-button>
          <el-button
            :size="headerButtonSize"
            :type="headerButtonType"
            @click="$refs.refFile.click()"
          >
            <i class="ri-mail-open-line" /> 打开文件
          </el-button>
          <el-tooltip effect="light">
            <template #content>
              <el-button
                :size="headerButtonSize"
                type="text"
                @click="downloadProcessAsXml()"
              >
                下载为XML文件
              </el-button>
              <br>
              <el-button
                :size="headerButtonSize"
                type="text"
                @click="downloadProcessAsSvg()"
              >
                下载为SVG文件
              </el-button>
              <br>
              <el-button
                :size="headerButtonSize"
                type="text"
                @click="downloadProcessAsBpmn()"
              >
                下载为BPMN文件
              </el-button>
            </template>
            <el-button
              :size="headerButtonSize"
              :type="headerButtonType"
            >
              <i class="ri-file-download-line" />下载文件
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light">
            <template #content>
              <el-button
                :size="headerButtonSize"
                type="text"
                @click="previewProcessXML"
              >
                预览XML
              </el-button>
              <br>
              <el-button
                :size="headerButtonSize"
                type="text"
                @click="previewProcessJson"
              >
                预览JSON
              </el-button>
            </template>
            <el-button
              :size="headerButtonSize"
              :type="headerButtonType"
            >
              <i class="ri-eye-line" /> 预览
            </el-button>
          </el-tooltip>
          <el-tooltip
            v-if="simulation"
            effect="light"
            :content="simulationStatus ? '退出模拟' : '开启模拟'"
          >
            <el-button
              :size="headerButtonSize"
              :type="headerButtonType"
              @click="processSimulation"
            >
              <i class="ri-cpu-line" />模拟
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group key="align-control">
          <el-tooltip
            effect="light"
            content="向左对齐"
          >
            <el-button
              :size="headerButtonSize"
              class="align align-left"
              @click="elementsAlign('left')"
            >
              <i class="ri-align-left" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="向右对齐"
          >
            <el-button
              :size="headerButtonSize"
              class="align align-right"
              @click="elementsAlign('right')"
            >
              <i class="ri-align-right" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="向上对齐"
          >
            <el-button
              :size="headerButtonSize"
              class="align align-top"
              @click="elementsAlign('top')"
            >
              <i class="ri-align-top" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="向下对齐"
          >
            <el-button
              :size="headerButtonSize"
              class="align align-bottom"
              @click="elementsAlign('bottom')"
            >
              <i class="ri-align-bottom" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="水平居中"
          >
            <el-button
              :size="headerButtonSize"
              class="align align-center"
              @click="elementsAlign('center')"
            >
              <i class="ri-align-center" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="垂直居中"
          >
            <el-button
              :size="headerButtonSize"
              class="align align-middle"
              @click="elementsAlign('middle')"
            >
              <i class="ri-align-vertically" />
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group key="scale-control">
          <el-tooltip
            effect="light"
            content="缩小视图"
          >
            <el-button
              :size="headerButtonSize"
              :disabled="defaultZoom <= 0.3"
              @click="processZoomOut()"
            >
              <i class="ri-zoom-out-line" />
            </el-button>
          </el-tooltip>
          <el-button :size="headerButtonSize">
            {{ Math.floor(defaultZoom * 10 * 10) + '%' }}
          </el-button>
          <el-tooltip
            effect="light"
            content="放大视图"
          >
            <el-button
              :size="headerButtonSize"
              :disabled="defaultZoom >= 3.9"
              @click="processZoomIn()"
            >
              <i class="ri-zoom-in-line" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="重置视图并居中"
          >
            <el-button
              :size="headerButtonSize"
              @click="processReZoom()"
            >
              <i class="ri-refresh-line" />
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group key="stack-control">
          <el-tooltip
            effect="light"
            content="撤销"
          >
            <el-button
              :size="headerButtonSize"
              :disabled="!revocable"
              @click="processUndo()"
            >
              <i class="ri-arrow-go-back-line" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="恢复"
          >
            <el-button
              :size="headerButtonSize"
              :disabled="!recoverable"
              icon="el-icon-refresh-right"
              @click="processRedo()"
            >
              <i class="ri-arrow-go-forward-line" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="重新绘制"
          >
            <el-button
              :size="headerButtonSize"
              icon="el-icon-refresh"
              @click="processRestart"
            >
              <i class="ri-refresh-line" />
            </el-button>
          </el-tooltip>
        </el-button-group>
      </template>
      <!-- 用于打开本地文件-->
      <input
        id="files"
        ref="refFile"
        type="file"
        style="display: none"
        accept=".xml, .bpmn"
        @change="importLocalFile"
      >
    </div>
    <div class="my-process-designer__container">
      <div
        ref="bpmn-canvas"
        class="my-process-designer__canvas"
      />
    </div>
    <el-dialog
      v-model="previewModelVisible"
      title="预览"
      width="60%"
      append-to-body
      destroy-on-close
    >
      <highlightjs
        :language="previewType"
        :code="previewResult"
        style="height: 60vh"
      />
    </el-dialog>
  </div>
</template>

<script>
// 生产环境时优化
// const BpmnModeler = window.BpmnJS;
// import app from 'src/entry/implement/main.js'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import DefaultEmptyXML from './plugins/defaultEmpty'
// 翻译方法
import customTranslate from './plugins/translate/customTranslate'
import translationsCN from './plugins/translate/zh'
// 模拟流转流程
import tokenSimulation from 'bpmn-js-token-simulation'
// 标签解析构建器
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// 标签解析 Moddle
import camundaModdleDescriptor from './plugins/descriptor/camundaDescriptor.json'
import activitiModdleDescriptor from './plugins/descriptor/activitiDescriptor.json'
import flowableModdleDescriptor from './plugins/descriptor/flowableDescriptor.json'
// 标签解析 Extension
import camundaModdleExtension from './plugins/extension-moddle/camunda'
import activitiModdleExtension from './plugins/extension-moddle/activiti'
import flowableModdleExtension from './plugins/extension-moddle/flowable'
// 引入json转换与高亮
import convert from 'xml-js'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
// app.use(hljsVuePlugin)

export default {
  name: 'MyProcessDesigner',
  componentName: 'MyProcessDesigner',
  props: {
    xml: String, // xml 字符串
    simple: Boolean,
    processId: String,
    processName: String,
    translations: Object, // 自定义的翻译文件
    additionalModel: [Object, Array], // 自定义model
    moddleExtension: Object, // 自定义moddle
    onlyCustomizeAddi: {
      type: Boolean,
      default: false
    },
    onlyCustomizeModdle: {
      type: Boolean,
      default: false
    },
    simulation: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    prefix: {
      type: String,
      default: 'flowable'
    },
    events: {
      type: Array,
      default: () => ['element.click']
    },
    headerButtonSize: {
      type: String,
      default: 'small',
      validator: (value) =>
        ['default', 'medium', 'small', 'mini'].indexOf(value) !== -1
    },
    headerButtonType: {
      type: String,
      default: 'primary',
      validator: (value) =>
        ['default', 'primary', 'success', 'warning', 'danger', 'info'].indexOf(
          value
        ) !== -1
    }
  },
  data() {
    return {
      defaultZoom: 1,
      previewModelVisible: false,
      simulationStatus: false,
      previewResult: '',
      previewType: 'xml',
      recoverable: false,
      revocable: false
    }
  },
  computed: {
    additionalModules() {
      const Modules = []
      // 仅保留用户自定义扩展模块
      if (this.onlyCustomizeAddi) {
        if (
          Object.prototype.toString.call(this.additionalModel) ===
          '[object Array]'
        ) {
          return this.additionalModel || []
        }
        return [this.additionalModel]
      }

      // 插入用户自定义扩展模块
      if (
        Object.prototype.toString.call(this.additionalModel) ===
        '[object Array]'
      ) {
        Modules.push(...this.additionalModel)
      } else {
        this.additionalModel && Modules.push(this.additionalModel)
      }

      // 翻译模块
      const TranslateModule = {
        translate: [
          'value',
          customTranslate(this.translations || translationsCN)
        ]
      }
      Modules.push(TranslateModule)

      // 模拟流转模块
      if (this.simulation) {
        Modules.push(tokenSimulation)
      }

      // 根据需要的流程类型设置扩展元素构建模块
      // if (this.prefix === "bpmn") {
      //   Modules.push(bpmnModdleExtension);
      // }
      if (this.prefix === 'camunda') {
        Modules.push(camundaModdleExtension)
      }
      if (this.prefix === 'flowable') {
        Modules.push(flowableModdleExtension)
      }
      if (this.prefix === 'activiti') {
        Modules.push(activitiModdleExtension)
      }

      return Modules
    },
    moddleExtensions() {
      const Extensions = {}
      // 仅使用用户自定义模块
      if (this.onlyCustomizeModdle) {
        return this.moddleExtension || null
      }

      // 插入用户自定义模块
      if (this.moddleExtension) {
        for (const key in this.moddleExtension) {
          Extensions[key] = this.moddleExtension[key]
        }
      }

      // 根据需要的 "流程类型" 设置 对应的解析文件
      if (this.prefix === 'activiti') {
        Extensions.activiti = activitiModdleDescriptor
      }
      if (this.prefix === 'flowable') {
        Extensions.flowable = flowableModdleDescriptor
      }
      if (this.prefix === 'camunda') {
        Extensions.camunda = camundaModdleDescriptor
      }

      return Extensions
    }
  },
  mounted() {
    this.initBpmnModeler()
    this.createNewDiagram(this.xml)
  },
  beforeUnmount() {
    if (this.bpmnModeler) this.bpmnModeler.destroy()
    this.$emit('destroy', this.bpmnModeler)
    this.bpmnModeler = null
  },
  methods: {
    onSave() {
      if (this.bpmnModeler == null) return
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.$emit('save', xml)
      })
    },
    initBpmnModeler() {
      if (this.bpmnModeler) return
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs['bpmn-canvas'],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions
      })
      this.$emit('init-finished', this.bpmnModeler)
      this.initModelListeners()
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get('eventBus')
      const that = this
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach((event) => {
        EventBus.on(event, function (eventObj) {
          const eventName = event.replace(/\./g, '-')
          const element = eventObj ? eventObj.element : null
          that.$emit(eventName, element, eventObj)
          that.$emit('event', eventName, element, eventObj)
        })
      })
      // 监听图形改变返回xml
      EventBus.on('commandStack.changed', async (event) => {
        console.log(event)
        try {
          setTimeout(async () => {
            this.recoverable = this.bpmnModeler.get('commandStack').canRedo()
            this.revocable = this.bpmnModeler.get('commandStack').canUndo()
            const { xml } = await this.bpmnModeler.saveXML({ format: true })
            this.$emit('commandStack-changed', event)
            this.$emit('update:xml', xml)
            this.$emit('change', xml)
          }, 1000)
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e.message || e}`)
        }
      })
      // 监听视图缩放变化
      this.bpmnModeler.on('canvas.viewbox.changed', ({ viewbox }) => {
        this.$emit('canvas-viewbox-changed', { viewbox })
        const { scale } = viewbox
        this.defaultZoom = Math.floor(scale * 100) / 100
      })
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      const newId = this.processId || `Process_${new Date().getTime()}`
      const newName = this.processName || `业务流程_${new Date().getTime()}`
      const xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix)
      try {
        const { warnings } = await this.bpmnModeler.importXML(xmlString)
        if (warnings && warnings.length) {
          warnings.forEach((warn) => console.warn(warn))
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e.message || e}`)
      }
    },

    // 下载流程图到本地
    async downloadProcess(type, name) {
      try {
        const _this = this
        // 按需要类型创建文件并下载
        if (type === 'xml' || type === 'bpmn') {
          const { err, xml } = await this.bpmnModeler.saveXML()
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`)
          }
          const { href, filename } = _this.setEncoded(
            type.toUpperCase(),
            name,
            xml
          )
          downloadFunc(href, filename)
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG()
          // 读取异常时抛出异常
          if (err) {
            return console.error(err)
          }
          const { href, filename } = _this.setEncoded('SVG', name, svg)
          downloadFunc(href, filename)
        }
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`)
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          const a = document.createElement('a')
          a.download = filename // 指定下载的文件名
          a.href = href //  URL对象
          a.click() // 模拟点击
          URL.revokeObjectURL(a.href) // 释放URL 对象
        }
      }
    },

    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = 'diagram', data) {
      const encodedData = encodeURIComponent(data)
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${
          type === 'svg' ? 'text/xml' : 'bpmn20-xml'
        };charset=UTF-8,${encodedData}`,
        data: data
      }
    },

    // 加载本地文件
    importLocalFile() {
      const that = this
      const file = this.$refs.refFile.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function () {
        const xmlStr = this.result
        that.createNewDiagram(xmlStr)
      }
    },
    /* ------------------------------------------------ refs methods ------------------------------------------------------ */
    downloadProcessAsXml() {
      this.downloadProcess('xml')
    },
    downloadProcessAsBpmn() {
      this.downloadProcess('bpmn')
    },
    downloadProcessAsSvg() {
      this.downloadProcess('svg')
    },
    processSimulation() {
      this.simulationStatus = !this.simulationStatus
      this.simulation && this.bpmnModeler.get('toggleMode').toggleMode()
    },
    processRedo() {
      this.bpmnModeler.get('commandStack').redo()
    },
    processUndo() {
      this.bpmnModeler.get('commandStack').undo()
    },
    processZoomIn(zoomStep = 0.1) {
      const newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100
      if (newZoom > 4) {
        throw new Error(
          '[Process Designer Warn ]: The zoom ratio cannot be greater than 4'
        )
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
    },
    processZoomOut(zoomStep = 0.1) {
      const newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100
      if (newZoom < 0.2) {
        throw new Error(
          '[Process Designer Warn ]: The zoom ratio cannot be less than 0.2'
        )
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
    },
    processZoomTo(newZoom = 1) {
      if (newZoom < 0.2) {
        throw new Error(
          '[Process Designer Warn ]: The zoom ratio cannot be less than 0.2'
        )
      }
      if (newZoom > 4) {
        throw new Error(
          '[Process Designer Warn ]: The zoom ratio cannot be greater than 4'
        )
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(newZoom)
    },
    processReZoom() {
      this.defaultZoom = 1
      this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
    },
    processRestart() {
      this.recoverable = false
      this.revocable = false
      this.createNewDiagram(null).then(() =>
        this.bpmnModeler.get('canvas').zoom(1, 'auto')
      )
    },
    elementsAlign(align) {
      const Align = this.bpmnModeler.get('alignElements')
      const Selection = this.bpmnModeler.get('selection')
      const SelectedElements = Selection.get()
      if (!SelectedElements || SelectedElements.length <= 1) {
        this.$message.warning('请按住 Ctrl 键选择多个元素对齐')
        return
      }
      this.$confirm('自动对齐可能造成图形变形，是否继续？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => Align.trigger(SelectedElements, align))
    },
    /* -----------------------------    方法结束     ----------------------------- */
    previewProcessXML() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = xml
        this.previewType = 'xml'
        this.previewModelVisible = true
      })
    },
    previewProcessJson() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = convert.xml2json(xml, { spaces: 2 })
        this.previewType = 'json'
        this.previewModelVisible = true
      })
    }
  }
}
</script>
