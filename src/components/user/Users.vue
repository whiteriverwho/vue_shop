<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }"></el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column fixed type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button icon="el-icon-edit" type="primary" size="mini"
              >修改</el-button
            >
            <!-- 删除 -->
            <el-button icon="el-icon-delete" type="danger" size="mini"
              >删除</el-button
            >
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 @size-change(pageSize 改变时触发)
      @current-change(页码发生改变时触发) :current-page(设置当前页码)
      :page-size(设置每页的数据条数) :total(设置总条数)-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queyInfo.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户对话框组件 :visible.sync(设置是否显示对话框) width(设置对话框的宽度)
      :before-close(在对话框关闭之前触发的事件)-->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
        <!-- 对话框主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 获取查询用户信息的参数
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 2
      },
      // 保存请求回来的用户列表数据
      userList: [],
      total: 0,
      // 是否显示添加用户弹出框
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 添加表单的验证规则duixiang
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3到10个字符之间',
            trigger: 'blur'
          }
        ],

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码在6到15个字符之间',
            trigger: 'blur'
          }
        ],

        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],

        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号格式不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      }

    }
  },

  created() {
    this.getUserList()
  },

  methods: {
    async getUserList() {
      // 发送请求获取用户列表数据
      const { res: data } = await this.$http.get('users', {
        params: this.queryInfo
      })

      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表信息失败')
      }
      // 如果返回成功，则保存数据在data中
      this.userList = res.data.users
      this.total = res.data.total
    },

    // 分页数处理
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 当前页处理
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    // 处理状态改变
    async userStateChanged(row) {
      // 发送请求进行状态修改
      const { res: data } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      // 异常报错并返回
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('修改状态失败')
      }
      this.$message.success('修改状态成功')
    },

    // 处理对话框关闭事件
    addDialogClosed() {
      // 对话框关闭之后，重置表单
      this.$refs.addFormRef.resetFields()
    },

    addUser() {
      // 点击确定按钮，添加新用户
      // 调用validate 进行表单校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整用户信息')

        // 发送请求完成用户添加的操作
        const { res: data } = await this.$http.post('users', this.addForm)

        // 添加失败则弹窗提示
        if (res.meta.status !== 200) {
          return this.$message.error('添加用户失败')
        }

        // 添加成功的提示
        this.$message.success('添加用户成功')
        this.addDialogVisible = false

        // 获取列表shuju
        this.getUserList()

      })
    }
  }
}
</script>

<style lang="less   " scoped>
</style>
