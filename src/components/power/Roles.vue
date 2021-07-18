<style lang="less" scoped>
    .el-tag {
        margin: 7px
    }
    .bdtop {
        border-top: 1px, solid, black;
    }
    .bdbottom {
        border-bottom: 1px, solid, black;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }
    /deep/.el-table th > .cell {
  text-align: center;
}
/deep/.el-table .cell {
  text-align: center;
}
</style>

<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Roles Management</el-breadcrumb-item>
            <el-breadcrumb-item>Roles List</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">Add Roles</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" border stripe>
                <!-- click expand to show details of each roles, each details belong to data.children from server -->
                <!-- prop value are fixed and from server -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 使用for循环一级角色权限scope.row.children在el-tag里渲染，:span限定列宽占5/24 -->
                        <!-- 设置动态样式，每个都有bdbottom，如果i1为0，顶部加上边框bdtop -->
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRoleById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[i2 !== 0 ? 'bdtop' : '', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <!-- 第二级角色菜单占24格的6格，剩余18格给第三级角色菜单 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRoleById(scope.row, item2.id)">{{ item1.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <!-- closable是element内置属性，结合close事件监听用户，然后访问后台删除角色权限 -->
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRoleById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="Roles Name" prop="roleName"></el-table-column>
                <el-table-column label="Roles Description" prop="roleDesc"></el-table-column>
                <el-table-column label="Operation" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">Edit</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">Delete</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">Reset</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- // 这里仅对setting进行编码，没有定义edit and delete，对话框默认值在data里设置为false -->
        <el-dialog
          title="Reset Access Roles"
          :visible.sync="setRightDialogVisible"
          width="50%"
          @close="setRightDialog">
          <!-- 在弹出的dialog里用tree控件渲染rightsList，用props指定tree的格式，格式在data里对象的形式定义 node-key用于指定用户勾选的当前项 default-expanded-keys用于绑定默认在server里已经勾选的项目-->
          <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all default-expanded-keys="defkeys" ref="treeRef"></el-tree>
          <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="allotRights">Confirm</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // preset rolesList to store data from server，默认empty array
      rolesList: [1, 2, 3],
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //   defkeys需要找到当前的三级角色菜单数据，它的二级和一级菜单会自动勾选
      defkeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('getting roles data fail') }
      this.rolesList = res.data
    },
    async removeRoleById(role, id) {
      const confirmResult = await this.$confirm('This will permanently remove the role. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => { return err })
      if (confirmResult !== 'confirm') { return this.$message.info('cancel removal') }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('fail to remove data') }
      //   this.getRolesList()会导致页面重新渲染，一级角色菜单的expand会被关闭，使用对role.children重新赋值可以保持expand开启
      this.$message.success('remove roles rights successfully')
      role.children = res.data
    },
    async showSetRightDialog(role) {
      // 当点击showsetrightdialog获取后台数据同时，获取当前点击的roleid，为后续修改当前roleid做准备，roleid同时在data里预定义
      this.roleId = role.id
      //   获取后台返回的setting的data并保存在rightsList里，下一步把rightsList渲染在dialog里
      const { data: res } = await this.$http.get('right/tree')
      this.getLeafKeys(role, this.defkeys)
      this.showSetRightDialog = true
      if (res.meta.status !== 200) { return this.$message.error('fail to get data') }
      this.rightsList = res.data
    },
    // 通过递归，获取三级角色菜单的id，并保存在defkeys中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => { this.getLeafKeys(node, arr) })
    },
    // 当关闭对话框时，需要清空里面的array，否则下次打开旧数据仍在，这里仅仅是对页面更新，没有更改后台数据，this method set inside the dialog element
    setRightDialog() {
      this.defkeys = []
    },
    // 通过refs引用获得当前tree数据并调用getCheckedKeys和getHalfCheckedKeys这2个element内置函数，从而获得当前全部数据然后...展开合并保存在keys array
    async allotRights() {
      const keys = [
        ...this.refs.treeRef.getCheckedKeys(), ...this.refs.treeRef.getHalfCheckedKeys()
      ]
      // 后台只接受string
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('fail to update data') }
      this.$message.success('update role successfully')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
