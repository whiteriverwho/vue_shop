<template>
  <div>
    <h3>商品分类</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card >
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格
      :data(设置数据源) :columns(设置表格中列配置信息) :selection-type(是否有复选框)
      :expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)
      border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮) -->
      <tree-table :data="cateList" :columns="columns" :selection-type="false"
      :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cate_deleted === false"
          style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cate_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cate_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据列表
      cateList: [],
      // 查询分类数据的条件
      queryInfo: {
        type: 3,
        pageNum: 1,
        pageSize: 5
      },
      // 保存总数据条数
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cate_name' },
        // type:'template' (将该列设置为模板列), template: 'isok' (设置该列模板的名称为isok)
        { label: '是否有效', prop: '', type: 'template', template: 'isok' },
        { label: '排序', prop: '', type: 'template', template: 'order' },
        { label: '操作', prop: '', type: 'template', template: 'opt' }
      ]
    }
  },

  created: {
    
  },

  methods: {
    async getCateList() {
      // 获取商品分类数据
      const { data: res } = await this.$http.get('categories',
        { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      console.log(res.data)
      // 将数据列表赋值给cateList
      this.cateList = res.data.result
      // 总数赋值
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>