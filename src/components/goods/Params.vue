  <template>
  <div>
    <h3>分类参数</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 :closable="false",是否展示'X'号, show-icon  显示图标 -->
      <el-alert title="注意，只允许为第三级分类设置参数" type="warnning" :closable="false" show-icon>
      
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader expandTrigger="hover" v-model="selectedCateKeys" :options="cateList" 
          :props="cateProps" @change="handleChange" clearable></el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>
      </el-alert>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      cateList: [],
      // 用户在级联菜单下选中的id
      selectedCateKeys: [],
      // 配置级联菜单中数据如何展示
      cateProps: {
        value: 'cate_id',
        lable: 'cate_name',
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      // 获取所有的商品列表
      const { data: res } = await this.$http.get('categories')
      // 失败提示信息
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      // 获取成功赋值
      this.cateList = res.data
    },
    handleChange() {
      console.log(this.selectedCateKeys)
    }
  },
};
</script>

<style lang="less" scoped>
</style>
