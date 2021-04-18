<template>
<div>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->

  <!-- 角色列表区域 -->
  <!-- row-key='id', 如果是嵌套数据，该属性是必须的 -->
  <el-table row-key="id" :data="roleList" border stripe>
      <!-- 添加展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :class="['bdbottom', i1 === 0 ? 'bdtom' : '', 'vcenter']"
          v-for="(item1, i1) in scope.row.children" :key="item1.id">
          <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="reomoveRightById(scope.row, item1.id)">
                {{item1.authName}}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二、三级权限 -->
            <el-col :span="19">
              <!-- 通过for循环嵌套渲染二、三级权限 -->
              <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
              v-for="(item2, i2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" v-for="(item3) in item2.children"
                  :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting"
          @click="showSetRightDialog">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%" @close="setRightDialogClose">
        <!-- 树形组件
          show-checkbox 显示复选框
          node-key 设置选中节点对应的值
          default-expand-all 是否默认展开所有节点
          :default-checked-keys 设置默认选中项的数组
          ref: 设置引用
        -->
        <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id"
          default-expand-all :default-checked-keys="defKeys" ref="treeRef">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示
      setRightDialogVisible: false,
      // 权限树数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // 通过label 设置属性节点文本展示authName
        label: 'authName',
        // 设置通过children 属性展示子节点信息
        children: 'children'
      },
      // 设置树形控件默认选中的内容
      defKeys: [],
      // 保存正在操作的角色
      roleId: ''
    }
  },

  created() {
    this.getRoleList()
  },

  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      // 异常状态则报错返回
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      console.log(res.data)
      this.roleList = res.data
    },
    async removeRightById(role, rightId) {
      // 弹窗提示用户是否要删除
      const confirmResult = await this.$confirm('请问是否要删除该权限', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击取消
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 发送delete删除请求后，返回的数据就是最新的数据
      const { data: res } = await this.$http.delete('roles/${role.id}/rights/${rightId}')
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      // 只对当前角色进行更新，不用重新获取列表
      role.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 请求获取权限数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限树失败')
      }
      this.rightsList = res.data
      // 调用getLeafKeys进行递归，将三级权限添加到数组中
      this.getLeafKeys(role, this.defKeys)
      // 分配权限时，展示对话框
      this.setRightDialogVisible = true
      console.log(this.defKeys)
    },

    getLeafKeys(node, arr) {
      // 获取所有三级权限id，添加到defKeys中
      // 如果当前节点不包含children属性，则为三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归调用
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClose() {
      // 当用户关闭树形权限对话框时，清除掉所有选中状态
      this.defKeys = []
    },
    async allotRights() {
      // 对用户选中的权限发送请求进行更新
      // 获取选中及半选内容
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将数组转换为拼接的字符串
      const idStr = keys.join(',')
      // 发送请求完成更新
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px, solid, #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
