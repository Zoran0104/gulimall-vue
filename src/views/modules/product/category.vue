<template>
  <div>
    <el-tree
      :data="menus"
      :props="defaultProps"
      :expand-on-click-node="false"
      :default-expanded-keys="expandKey"
      show-checkbox
      node-key="catId"
      draggable
      :allow-drop="allowdrop"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            v-if="node.level <= 2"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button type="text" size="mini" @click="edit(data)">
            Edit
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="node.childNodes.length == 0"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :closeOnClickModal="false"
    >
      <el-form :model="category">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="category.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="计量单位">
          <el-input
            v-model="category.productUnit"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      dialogType: "",
      dialogTitle: "",
      category: {
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        catId: null,
        icon: "",
        productUnit: ""
      },
      dialogVisible: false,
      menus: [],
      defaultProps: {
        children: "subTree",
        label: "name"
      },
      expandKey: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    getMenu() {
      this.$http({
        url: this.$http.adornUrl("/product/category/treeList"),
        method: "get"
      }).then(result => (this.menus = result.data.result));
    },
    append(data) {
      this.category = {};
      this.dialogType = "add";
      this.dialogTitle = "添加目录";
      this.dialogVisible = true;
      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel * 1 + 1;
    },
    remove(node, data) {
      let ids = [data.catId];
      console.log(node);
      this.$confirm(`确定删除【${data.name}】吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/product/category/delete"),
            method: "post",
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            this.getMenu();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.expandKey = [node.parent.data.catId];
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleAdd() {
      this.$http({
        url: this.$http.adornUrl("/product/category/save"),
        method: "post",
        data: this.$http.adornData(this.category, false)
      }).then(({ data }) => {
        this.$message({
          type: "success",
          message: "菜单保存成功"
        });
        this.dialogVisible = false;
        this.getMenu();
        console.log(this.category.catId);
        this.expandKey = [this.category.parentCid];
      });
    },
    handleEdit() {
      let { catId, name, icon, productUnit } = this.category;
      this.$http({
        url: this.$http.adornUrl("/product/category/update"),
        method: "post",
        data: this.$http.adornData({ catId, name, icon, productUnit }, false)
      }).then(({ data }) => {
        this.$message({
          type: "success",
          message: "菜单修改成功"
        });
        this.dialogVisible = false;
        this.expandKey = [this.category.parentCid];
        this.getMenu();
      });
    },
    handleSubmit() {
      if (this.dialogType == "add") {
        this.handleAdd();
      } else if (this.dialogType == "edit") {
        this.handleEdit();
      }
    },
    edit(data) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.dialogTitle = "编辑目录";
      this.$http({
        url: this.$http.adornUrl(`/product/category/info/${data.catId}`),
        method: "get"
      }).then(({ data }) => {
        this.category.name = data.category.name;
        this.category.catId = data.category.catId;
        this.category.icon = data.category.icon;
        this.category.productUnit = data.category.productUnit;
        this.category.parentCid = data.category.parentCid;
      });
    },
    allowdrop(draggingNode, dropNode, type) {
      return false;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getMenu();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style scoped></style>
